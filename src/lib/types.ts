export interface VideoItem {
  content_id: string;
  title: string;
  thumbnailUrl: string;
  largeThumbnailUrl: string;
  sampleVideoUrl: string | null;
  affiliateUrl: string;
  actresses: string[];
  genres: string[];
  maker: string;
  series: string;
  date: string;
  reviewAverage: number | null;
  reviewCount: number;
  duration: string;
}

export interface SearchParams {
  keyword?: string;
  sort?: 'date' | 'rank' | 'review';
  genre?: string;
  actress?: string;
  page?: number;
  hits?: number;
}

export interface SearchResult {
  items: VideoItem[];
  totalCount: number;
  page: number;
  totalPages: number;
}
