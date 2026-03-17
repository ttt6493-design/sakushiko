export type SampleQuality = 'all' | '4k' | '1080p' | '720p' | '576p' | '432p';

export interface VideoItem {
  content_id: string;
  title: string;
  thumbnailUrl: string;
  largeThumbnailUrl: string;
  sampleVideoUrl: string | null;
  sampleQualities: SampleQuality[]; // available sample qualities
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

export type ContentType = 'all' | 'video' | 'vr';

export interface SearchParams {
  keyword?: string;
  sort?: 'date' | 'rank' | 'review';
  genre?: string;
  actress?: string;
  quality?: SampleQuality;
  contentType?: ContentType;
  page?: number;
  hits?: number;
}

export interface SearchResult {
  items: VideoItem[];
  totalCount: number;
  page: number;
  totalPages: number;
}
