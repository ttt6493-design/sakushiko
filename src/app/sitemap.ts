import type { MetadataRoute } from 'next';

const BASE_URL = 'https://sakushiko-rouge.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/?sort=rank`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/?sort=review`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog/best-free-jav-sample-sites-2026`,
      lastModified: new Date('2026-03-14'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog/why-japanese-av-is-the-best`,
      lastModified: new Date('2026-03-12'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog/how-to-use-fanza-sample-videos`,
      lastModified: new Date('2026-03-10'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];
}
