// p = product quality (genre tag), s = sample quality (actual playback)
export type SampleQuality = 'all' | 'p4k' | 'pfhd' | 'phd' | 's4k' | 'sfhd' | 'shd' | '4k' | '1080p' | '720p' | '576p' | '432p';

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

export interface SearchParams {
  keyword?: string;
  sort?: 'date' | 'rank' | 'review';
  genre?: string;
  actress?: string;
  actressId?: number; // exact filter via DMM article=actress (preferred over keyword)
  quality?: SampleQuality;
  page?: number;
  hits?: number;
}

export interface Actress {
  id: number;
  name: string;
  ruby: string;
  imageUrl: string | null;
  height: string;
  bust: string;
  cup: string;
  waist: string;
  hip: string;
  birthday: string;
  bloodType: string;
  hobby: string;
  prefectures: string;
}

export interface SearchResult {
  items: VideoItem[];
  totalCount: number;
  page: number;
  pageSize: number; // raw items consumed per page (drives pagination offsets)
  totalPages: number;
}
