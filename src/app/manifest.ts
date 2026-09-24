import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ZERO 4K AV - 無料・広告なしの4K AV動画',
    short_name: 'ZERO 4K AV',
    description: '無料・広告なしで見られるFANZA公式のAV動画',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a12',
    theme_color: '#e91e63',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
      {
        src: '/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
