import type { MetadataRoute } from 'next';
import { fetchVideos } from '@/lib/api';
import { isApiConfigured } from '@/lib/config';
import { GENRES } from '@/lib/genres';
import { SITE_URL } from '@/lib/site';

// Regenerate at most once per hour; video entries come from the live API.
export const revalidate = 3600;

const VIDEO_PAGES = 3; // 3 x 100 = top 300 popular videos
const VIDEO_HITS = 100; // DMM API max per request

async function fetchVideoEntries(): Promise<MetadataRoute.Sitemap> {
  if (!isApiConfigured()) return [];

  const pages = await Promise.all(
    Array.from({ length: VIDEO_PAGES }, (_, i) =>
      fetchVideos({ sort: 'rank', page: i + 1, hits: VIDEO_HITS }).catch(() => null)
    )
  );

  const seen = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];
  for (const result of pages) {
    if (!result) continue;
    for (const video of result.items) {
      if (seen.has(video.content_id)) continue;
      seen.add(video.content_id);
      entries.push({
        url: `${SITE_URL}/video/${encodeURIComponent(video.content_id)}`,
        lastModified: video.date ? new Date(video.date) : undefined,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  }
  return entries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/?sort=date`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/?sort=review`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    {
      url: `${SITE_URL}/blog/best-free-jav-sample-sites-2026`,
      lastModified: new Date('2026-03-14'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog/why-japanese-av-is-the-best`,
      lastModified: new Date('2026-03-12'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog/how-to-use-fanza-sample-videos`,
      lastModified: new Date('2026-03-10'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];

  const genreEntries: MetadataRoute.Sitemap = GENRES.filter((g) => g.id !== 'all').map((g) => ({
    url: `${SITE_URL}/?genre=${encodeURIComponent(g.id)}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  const videoEntries = await fetchVideoEntries();

  return [...staticEntries, ...genreEntries, ...videoEntries];
}
