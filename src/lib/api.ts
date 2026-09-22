import { VideoItem, SearchParams, SearchResult, SampleQuality } from './types';
import { API_CONFIG, isApiConfigured } from './config';
import { MOCK_VIDEOS } from './mock-data';

interface DmmApiResponse {
  result: {
    status: number;
    result_count: number;
    total_count: number;
    first_position: number;
    items: DmmItem[];
  };
}

interface DmmItem {
  content_id: string;
  title: string;
  URL: string;
  affiliateURL: string;
  affiliateURLsp: string;
  imageURL: {
    list: string;
    small: string;
    large: string;
  };
  sampleImageURL?: {
    sample_s?: { image: string[] };
  };
  sampleMovieURL?: {
    size_476_306?: string;
    size_560_360?: string;
    size_644_414?: string;
    size_720_480?: string;
  };
  iteminfo: {
    actress?: Array<{ id: number; name: string }>;
    genre?: Array<{ id: number; name: string }>;
    maker?: Array<{ id: number; name: string }>;
    series?: Array<{ id: number; name: string }>;
  };
  date: string;
  review?: {
    count: number;
    average: string;
  };
  volume?: string;
}

// Map API's sampleMovieURL sizes to FANZA's actual player quality tiers
// FANZA player offers: 4K(2160p), FullHD(1080p), HD(720p), 高画質(576p), 中画質(432p), 中画質(288p), 低画質(144p)
// API only provides URLs up to 720x480, but we detect higher qualities from genre tags
function getSampleQualities(movie?: DmmItem['sampleMovieURL']): SampleQuality[] {
  if (!movie) return [];
  const qualities: SampleQuality[] = [];
  // API provides limited sizes; map them to approximate FANZA tiers
  if (movie.size_720_480) qualities.push('720p');
  if (movie.size_644_414 || movie.size_560_360) qualities.push('576p');
  if (movie.size_476_306) qualities.push('432p');
  return qualities;
}

function getHighestQualityLabel(qualities: SampleQuality[]): string {
  if (qualities.includes('4k')) return '4K';
  if (qualities.includes('1080p')) return 'FHD';
  if (qualities.includes('720p')) return 'HD';
  if (qualities.includes('576p')) return 'HQ';
  if (qualities.includes('432p')) return 'SD';
  return '';
}

// Export for use in components
export { getHighestQualityLabel };

function mapDmmItem(item: DmmItem): VideoItem {
  const qualities = getSampleQualities(item.sampleMovieURL);

  // Detect higher qualities from genre tags
  const genres = item.iteminfo.genre?.map((g) => g.name) || [];
  const is4k = genres.some((g) => g.includes('4K') || g.includes('4k'));
  const isHD = genres.some((g) => g.includes('ハイビジョン') || g.includes('HD'));

  if (is4k) {
    if (!qualities.includes('4k')) qualities.unshift('4k');
    if (!qualities.includes('1080p')) qualities.splice(1, 0, '1080p');
  } else if (isHD) {
    if (!qualities.includes('1080p')) qualities.unshift('1080p');
  }

  return {
    content_id: item.content_id,
    title: item.title,
    thumbnailUrl: item.imageURL.small || item.imageURL.list,
    largeThumbnailUrl: item.imageURL.large || item.imageURL.small,
    sampleVideoUrl:
      item.sampleMovieURL?.size_720_480 ||
      item.sampleMovieURL?.size_644_414 ||
      item.sampleMovieURL?.size_560_360 ||
      item.sampleMovieURL?.size_476_306 ||
      null,
    sampleQualities: qualities,
    affiliateUrl: item.affiliateURLsp || item.affiliateURL || item.URL,
    actresses: item.iteminfo.actress?.map((a) => a.name) || [],
    genres: item.iteminfo.genre?.map((g) => g.name) || [],
    maker: item.iteminfo.maker?.[0]?.name || '',
    series: item.iteminfo.series?.[0]?.name || '',
    date: item.date,
    reviewAverage: item.review ? parseFloat(item.review.average) : null,
    reviewCount: item.review?.count || 0,
    duration: item.volume || '',
  };
}

// In-memory cache of "does sample <cid> offer <resolution>?" results.
// The DMM player HTML is fetched once per cid and reused across all resolutions.
const SAMPLE_QUALITY_TTL_MS = 6 * 60 * 60 * 1000; // 6h
const sampleQualityCache = new Map<string, { resolutions: string[]; expires: number }>();
// 12 in flight: a cold 90-item page takes ~8s instead of ~18s at 6, while still far below the
// 90 parallel requests the filter used to fire. Warm pages are served from cache in <1s.
const SAMPLE_QUALITY_CONCURRENCY = 12;
const KNOWN_RESOLUTIONS = ['2160p', '1080p', '720p', '576p', '432p', '288p', '144p'];

async function fetchSampleResolutions(cid: string): Promise<string[]> {
  const cached = sampleQualityCache.get(cid);
  if (cached && cached.expires > Date.now()) return cached.resolutions;

  let resolutions: string[] = [];
  try {
    const url = `https://www.dmm.co.jp/service/digitalapi/-/html5_player/=/cid=${cid}/mtype=AhRVShI_/service=litevideo/mode=part/width=720/height=480/affi_id=${API_CONFIG.AFFILIATE_ID}/`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.dmm.co.jp/',
      },
      next: { revalidate: 3600 },
    });

    const html = await response.text();
    resolutions = KNOWN_RESOLUTIONS.filter((r) => html.includes(r));
  } catch {
    // Treat as unknown: cache the miss briefly so a flaky request doesn't retry on every page view
  }

  sampleQualityCache.set(cid, { resolutions, expires: Date.now() + SAMPLE_QUALITY_TTL_MS });
  return resolutions;
}

// Check if a sample video has a specific quality available (e.g., "2160p", "1080p", "720p")
async function checkSampleHasQuality(cid: string, resolution: string): Promise<boolean> {
  const resolutions = await fetchSampleResolutions(cid);
  return resolutions.includes(resolution);
}

// Run async tasks with a bounded number in flight, preserving order of results.
async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  });
  await Promise.all(workers);
  return results;
}

function isSampleQualityFilter(quality?: SampleQuality): boolean {
  return quality === 's4k' || quality === 'sfhd' || quality === 'shd';
}

export async function fetchVideos(params: SearchParams = {}): Promise<SearchResult> {
  const page = params.page || 1;
  const hits = params.hits || API_CONFIG.HITS_PER_PAGE;

  if (!isApiConfigured()) {
    return getMockResult(params, page, hits);
  }

  // Page window in the raw DMM result set. Normally one page = `hits` raw items,
  // so page N always starts right after page N-1 (no gaps, no duplicates).
  // Sample-quality filters discard most items, so for those the raw window is
  // widened to 3x (still page-aligned) and paging advances by that window.
  const sampleFilter = isSampleQualityFilter(params.quality);
  const fetchHits = sampleFilter ? Math.min(hits * 3, 100) : hits;
  const offset = (page - 1) * fetchHits + 1;

  // VR titles live in the same 'videoa' floor (tagged with the VR genre); 'video' is not a
  // valid FANZA floor and made the API return an error (HTTP 500 on /?type=vr).
  const queryParams = new URLSearchParams({
    api_id: API_CONFIG.API_ID,
    affiliate_id: API_CONFIG.AFFILIATE_ID,
    site: API_CONFIG.SITE,
    service: API_CONFIG.SERVICE,
    floor: API_CONFIG.FLOOR,
    hits: String(fetchHits),
    offset: String(offset),
    sort: params.sort || 'rank', // Default: popular
    output: 'json',
  });

  // Build keyword: combine user keyword + quality keyword for server-side filtering
  // Quality values: p4k/pfhd/phd = product quality, s4k/sfhd/shd = sample quality
  const keywords: string[] = [];
  if (params.keyword) keywords.push(params.keyword);
  if (params.quality === 'p4k' || params.quality === 's4k') keywords.push('4K');
  if (params.quality === 'pfhd' || params.quality === 'sfhd') keywords.push('ハイビジョン');
  if (params.quality === 'phd' || params.quality === 'shd') keywords.push('ハイビジョン');
  if (params.contentType === 'vr') keywords.push('VR');

  if (keywords.length > 0) {
    queryParams.set('keyword', keywords.join(' '));
  }

  const url = `${API_CONFIG.BASE_URL}/ItemList?${queryParams.toString()}`;
  const response = await fetch(url, { next: { revalidate: 300 } });

  if (!response.ok) {
    // Render an empty list instead of a 500 page; details go to the server log
    console.error(`DMM API error: HTTP ${response.status} for ${url.replace(API_CONFIG.API_ID, '***')}`);
    return { items: [], totalCount: 0, page, pageSize: fetchHits, totalPages: 0 };
  }

  const data: DmmApiResponse = await response.json();

  let items = (data.result.items ?? []).map(mapDmmItem);

  // Filter out videos without sample videos
  items = items.filter((v) => v.sampleVideoUrl !== null);

  // Filter by content type (client-side, to exclude VR from regular listing)
  if (params.contentType === 'video') {
    items = items.filter((v) => !v.genres.some((g) => g.includes('VR')));
  }

  // Sample quality filter: check actual sample quality from DMM player pages
  // (bounded concurrency + per-cid cache so one page view can't fire 90 parallel requests)
  if (sampleFilter) {
    const targetRes = params.quality === 's4k' ? '2160p' : params.quality === 'sfhd' ? '1080p' : '720p';
    const checked = await mapWithConcurrency(items, SAMPLE_QUALITY_CONCURRENCY, async (item) => {
      const cidMatch = item.sampleVideoUrl?.match(/cid=([^/]+)/);
      const cid = cidMatch?.[1] || item.content_id;
      return { item, hasQuality: await checkSampleHasQuality(cid, targetRes) };
    });
    items = checked.filter((c) => c.hasQuality).map((c) => c.item);
  }

  const totalCount = data.result.total_count;
  items = items.slice(0, hits);

  return {
    items,
    totalCount,
    page,
    pageSize: fetchHits,
    totalPages: Math.ceil(totalCount / fetchHits),
  };
}

function getMockResult(params: SearchParams, page: number, hits: number): SearchResult {
  let filtered = MOCK_VIDEOS;

  if (params.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter(
      (v) =>
        v.title.toLowerCase().includes(kw) ||
        v.actresses.some((a) => a.toLowerCase().includes(kw)) ||
        v.genres.some((g) => g.toLowerCase().includes(kw)) ||
        v.maker.toLowerCase().includes(kw)
    );
  }

  if (params.quality && params.quality !== 'all') {
    filtered = filtered.filter((v) => v.sampleQualities.includes(params.quality!));
  }

  if (params.sort === 'review') {
    filtered = [...filtered].sort((a, b) => (b.reviewAverage || 0) - (a.reviewAverage || 0));
  } else if (params.sort === 'rank') {
    filtered = [...filtered].sort((a, b) => b.reviewCount - a.reviewCount);
  }

  const start = (page - 1) * hits;
  return {
    items: filtered.slice(start, start + hits),
    totalCount: filtered.length,
    page,
    pageSize: hits,
    totalPages: Math.ceil(filtered.length / hits),
  };
}

export async function fetchVideoById(id: string): Promise<VideoItem | null> {
  if (!isApiConfigured()) {
    return MOCK_VIDEOS.find((v) => v.content_id === id) || null;
  }

  const queryParams = new URLSearchParams({
    api_id: API_CONFIG.API_ID,
    affiliate_id: API_CONFIG.AFFILIATE_ID,
    site: API_CONFIG.SITE,
    service: API_CONFIG.SERVICE,
    floor: API_CONFIG.FLOOR,
    hits: '1',
    cid: id,
    output: 'json',
  });

  const url = `${API_CONFIG.BASE_URL}/ItemList?${queryParams.toString()}`;
  const response = await fetch(url, { next: { revalidate: 300 } });

  if (!response.ok) return null;

  const data: DmmApiResponse = await response.json();
  if (!data.result.items?.length) return null;

  return mapDmmItem(data.result.items[0]);
}
