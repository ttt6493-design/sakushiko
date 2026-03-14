export interface Genre {
  id: string;
  label: string;
  icon: string;
}

// DMM API genre IDs (will be used when API is connected)
// For now, these serve as filter keywords
export const GENRES: Genre[] = [
  { id: 'all', label: 'すべて', icon: '🎬' },
  { id: '美少女', label: '美少女', icon: '👩' },
  { id: '巨乳', label: '巨乳', icon: '💎' },
  { id: '人妻', label: '人妻・熟女', icon: '👠' },
  { id: 'スレンダー', label: 'スレンダー', icon: '✨' },
  { id: 'OL', label: 'OL', icon: '👔' },
  { id: 'ナース', label: 'ナース', icon: '🏥' },
  { id: '女子校生', label: '女子校生', icon: '🎀' },
  { id: 'コスプレ', label: 'コスプレ', icon: '🎭' },
  { id: '痴女', label: '痴女', icon: '🔥' },
  { id: 'デビュー作品', label: '新人デビュー', icon: '🌟' },
  { id: '企画', label: '企画', icon: '📋' },
  { id: 'ドラマ', label: 'ドラマ', icon: '🎞️' },
  { id: '4K', label: '4K高画質', icon: '📺' },
  { id: 'VR', label: 'VR', icon: '🥽' },
  { id: '単体作品', label: '単体作品', icon: '⭐' },
];
