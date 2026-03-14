import { VideoItem, SearchParams, SearchResult } from './types';
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

function mapDmmItem(item: DmmItem): VideoItem {
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

export async function fetchVideos(params: SearchParams = {}): Promise<SearchResult> {
  const page = params.page || 1;
  const hits = params.hits || API_CONFIG.HITS_PER_PAGE;

  if (!isApiConfigured()) {
    return getMockResult(params, page, hits);
  }

  const offset = (page - 1) * hits + 1; // DMM API is 1-based

  const queryParams = new URLSearchParams({
    api_id: API_CONFIG.API_ID,
    affiliate_id: API_CONFIG.AFFILIATE_ID,
    site: API_CONFIG.SITE,
    service: API_CONFIG.SERVICE,
    floor: API_CONFIG.FLOOR,
    hits: String(hits),
    offset: String(offset),
    sort: params.sort || 'date',
    output: 'json',
  });

  if (params.keyword) {
    queryParams.set('keyword', params.keyword);
  }

  const url = `${API_CONFIG.BASE_URL}/ItemList?${queryParams.toString()}`;

  const response = await fetch(url, { next: { revalidate: 300 } }); // Cache 5min

  if (!response.ok) {
    throw new Error(`DMM API error: ${response.status}`);
  }

  const data: DmmApiResponse = await response.json();

  const totalCount = data.result.total_count;
  return {
    items: data.result.items.map(mapDmmItem),
    totalCount,
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
