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

// Check if a sample video has a specific quality available (e.g., "2160p", "1080p", "720p")
async function checkSampleHasQuality(cid: string, resolution: string): Promise<boolean> {
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
    return html.includes(resolution);
  } catch {
    return false;
  }
}

export async function fetchVideos(params: SearchParams = {}): Promise<SearchResult> {
  const page = params.page || 1;
  const hits = params.hits || API_CONFIG.HITS_PER_PAGE;

  if (!isApiConfigured()) {
    return getMockResult(params, page, hits);
  }

  // Fetch more than needed to compensate for filtering out videos without samples
  const fetchHits = Math.min(hits * 3, 100); // Fetch 3x, max 100 (API limit)
  const offset = (page - 1) * fetchHits + 1;

  // Determine floor based on content type filter
  const floor = params.contentType === 'vr' ? 'video' : API_CONFIG.FLOOR;

  const queryParams = new URLSearchParams({
    api_id: API_CONFIG.API_ID,
    affiliate_id: API_CONFIG.AFFILIATE_ID,
    site: API_CONFIG.SITE,
    service: API_CONFIG.SERVICE,
    floor,
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
    throw new Error(`DMM API error: ${response.status}`);
  }

  const data: DmmApiResponse = await response.json();

  let items = data.result.items.map(mapDmmItem);

  // Filter out videos without sample videos
  items = items.filter((v) => v.sampleVideoUrl !== null);

  // Filter by content type (client-side, to exclude VR from regular listing)
  if (params.contentType === 'video') {
    items = items.filter((v) => !v.genres.some((g) => g.includes('VR')));
  }

  // Sample quality filter: check actual sample quality from DMM player pages
  if (params.quality === 's4k' || params.quality === 'sfhd' || params.quality === 'shd') {
    const targetRes = params.quality === 's4k' ? '2160p' : params.quality === 'sfhd' ? '1080p' : '720p';
    const checked = await Promise.all(
      items.map(async (item) => {
        const cidMatch = item.sampleVideoUrl?.match(/cid=([^/]+)/);
        const cid = cidMatch?.[1] || item.content_id;
        const hasQuality = await checkSampleHasQuality(cid, targetRes);
        return { item, hasQuality };
      })
    );
    items = checked.filter((c) => c.hasQuality).map((c) => c.item);
  }

  // Trim to requested page size after all filters
  const totalCount = data.result.total_count;
  items = items.slice(0, hits);

  return {
    items,
    totalCount: Math.min(totalCount, items.length > 0 ? totalCount : 0),
    page,
    totalPages: Math.ceil(totalCount / hits),
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
