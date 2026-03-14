import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SAKUSHIKO - 無料サンプル動画サーチ',
    short_name: 'SAKUSHIKO',
    description: 'FANZAの無料サンプル動画をサクッと探せるサイト',
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
