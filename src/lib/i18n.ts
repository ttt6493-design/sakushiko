export type Locale = 'ja' | 'en';

export const translations = {
  ja: {
    siteName: 'SAKUSHIKO',
    tagline: 'サクッとオカズを見つける',
    subtitle: '無料サンプル動画をカテゴリ別にサクッと検索。気に入ったらそのまま本編へ。',
    searchPlaceholder: 'タイトル・女優名・ジャンルで検索...',
    sortNew: '新着順',
    sortPopular: '人気順',
    sortRating: '高評価順',
    showing: (total: number, from: number, to: number) =>
      `${total.toLocaleString()}件 / ${from}-${to}件表示`,
    noResults: '動画が見つかりませんでした',
    noResultsSub: '別のキーワードやカテゴリで検索してみてください',
    sample: 'サンプル',
    playFullscreen: '再生で全画面＋横向き表示',
    sampleNote: '※ FANZAが公式に提供する無料サンプル動画です',
    likedIt: 'サンプルが気に入りましたか？本編をチェック！',
    watchOnFanza: 'FANZAで本編を見る',
    buyOnFanza: 'FANZAで本編を見る・購入する',
    goToFanza: 'FANZAの商品ページへ移動します',
    infoTitle: '作品情報',
    actress: '出演',
    maker: 'メーカー',
    series: 'シリーズ',
    productId: '品番',
    genre: 'ジャンル',
    home: 'ホーム',
    popular: '人気',
    topRated: '高評価',
    delivered: '配信',
    reviews: '件',
    demoMode: 'デモモード: API未設定のためサンプルデータを表示中',
    footer1: '当サイトはDMMアフィリエイトを利用しています。',
    footer2: 'サンプル動画はFANZAが公式に提供する無料コンテンツです。',
    allGenres: 'すべて',
    // Value props
    prop1Title: '広告なし',
    prop1Desc: 'ウザい広告ゼロ。動画だけに集中。',
    prop2Title: '世界最高品質',
    prop2Desc: '日本のAVは世界一のクオリティ。',
    prop3Title: 'サクッと検索',
    prop3Desc: 'カテゴリ別に秒で見つかる。',
    playVideo: 'サンプル動画を再生',
    apiNote: 'API接続後に再生可能になります',
  },
  en: {
    siteName: 'SAKUSHIKO',
    tagline: 'Find What You Need. Fast.',
    subtitle: 'Browse free official sample videos by category. No ads. No BS. Just content.',
    searchPlaceholder: 'Search by title, actress, genre...',
    sortNew: 'Latest',
    sortPopular: 'Popular',
    sortRating: 'Top Rated',
    showing: (total: number, from: number, to: number) =>
      `${total.toLocaleString()} results / showing ${from}-${to}`,
    noResults: 'No videos found',
    noResultsSub: 'Try a different keyword or category',
    sample: 'FREE',
    playFullscreen: 'Tap to play fullscreen',
    sampleNote: '* Official free sample provided by FANZA',
    likedIt: 'Liked the preview? Watch the full version!',
    watchOnFanza: 'Watch Full Video on FANZA',
    buyOnFanza: 'Watch Full Video on FANZA',
    goToFanza: 'Opens FANZA product page',
    infoTitle: 'Video Info',
    actress: 'Actress',
    maker: 'Studio',
    series: 'Series',
    productId: 'Product ID',
    genre: 'Genre',
    home: 'Home',
    popular: 'Popular',
    topRated: 'Top Rated',
    delivered: 'Released',
    reviews: 'reviews',
    demoMode: 'Demo mode: Showing sample data (API not configured)',
    footer1: 'This site uses DMM affiliate program.',
    footer2: 'Sample videos are official free content provided by FANZA.',
    allGenres: 'All',
    // Value props
    prop1Title: 'Zero Ads',
    prop1Desc: 'No popups. No redirects. Just videos.',
    prop2Title: 'Premium Quality',
    prop2Desc: 'Japanese AV — the highest production quality in the world.',
    prop3Title: 'Instant Search',
    prop3Desc: 'Find exactly what you want in seconds.',
    playVideo: 'Play sample video',
    apiNote: 'Available after API connection',
  },
} as const;

export function getTranslations(locale: Locale) {
  return translations[locale];
}

export function detectLocale(acceptLanguage?: string | null): Locale {
  if (!acceptLanguage) return 'ja';
  if (acceptLanguage.startsWith('ja')) return 'ja';
  return 'en';
}
