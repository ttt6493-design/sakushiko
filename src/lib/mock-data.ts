import { VideoItem, SampleQuality } from './types';

const MOCK_QUALITY_PATTERNS: SampleQuality[][] = [
  ['4k', '720p', '644p', '560p', '476p'],  // 4K - all qualities
  ['720p', '644p', '560p', '476p'],          // HD - all qualities
  ['720p', '560p'],                           // HD
  ['4k', '720p', '560p'],                    // 4K
  ['644p', '560p', '476p'],                  // HQ
  ['560p', '476p'],                           // SD
];

const MOCK_TITLES = [
  '新人専属デビュー作品',
  '完全密着ドキュメント',
  '初撮りデビュー',
  'プレミアム限定公開',
  '独占配信スペシャル',
  '大型新人登場',
];

const MOCK_ACTRESSES = [
  '出演者A', '出演者B', '出演者C', '出演者D', '出演者E',
  '出演者F', '出演者G', '出演者H', '出演者I', '出演者J',
];

const MOCK_GENRES = [
  '単体作品', '美少女', 'ハイビジョン', '4K', 'デビュー作品',
  'ドキュメンタリー', 'スレンダー', 'OL', 'ドラマ', '企画',
];

const MOCK_MAKERS = [
  'S1 NO.1 STYLE', 'IDEA POCKET', 'MOODYZ', 'プレミアム',
  'マドンナ', 'SODstar', 'kawaii*', 'FALENO', 'Attackers', 'エスワン',
];

export const MOCK_VIDEOS: VideoItem[] = Array.from({ length: 30 }, (_, i) => ({
  content_id: `sample${String(i + 1).padStart(5, '0')}`,
  title: MOCK_TITLES[i % MOCK_TITLES.length] + `【Vol.${i + 1}】`,
  thumbnailUrl: `https://picsum.photos/seed/fanza${i}/320/180`,
  largeThumbnailUrl: `https://picsum.photos/seed/fanza${i}/800/450`,
  sampleVideoUrl: null,
  sampleQualities: MOCK_QUALITY_PATTERNS[i % MOCK_QUALITY_PATTERNS.length],
  affiliateUrl: 'https://www.dmm.co.jp/',
  actresses: [MOCK_ACTRESSES[i % MOCK_ACTRESSES.length]],
  genres: [MOCK_GENRES[i % MOCK_GENRES.length], MOCK_GENRES[(i + 3) % MOCK_GENRES.length]],
  maker: MOCK_MAKERS[i % MOCK_MAKERS.length],
  series: '',
  date: `2026-03-${String(14 - (i % 14)).padStart(2, '0')}`,
  reviewAverage: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
  reviewCount: Math.floor(20 + Math.random() * 300),
  duration: `${90 + Math.floor(Math.random() * 90)}分`,
}));
