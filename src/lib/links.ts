// URL helpers shared by cards, detail page, related videos and the sitemap.
export const actressHref = (name: string) => `/actress/${encodeURIComponent(name)}`;
export const videoHref = (contentId: string) => `/video/${encodeURIComponent(contentId)}`;
export const genreHref = (genre: string) => `/?genre=${encodeURIComponent(genre)}`;
export const searchHref = (keyword: string) => `/?q=${encodeURIComponent(keyword)}`;
