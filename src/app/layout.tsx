import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#e91e63',
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: {
    default: 'SAKUSHIKO - 無料サンプル動画で今すぐオカズ探し',
    template: '%s | SAKUSHIKO',
  },
  description:
    'FANZAの無料サンプル動画をサクッと探せるサイト。カテゴリ別に簡単検索、気に入ったらそのまま購入へ。',
  keywords: ['FANZA', 'サンプル動画', '無料', 'DMM', 'アダルト', '動画'],
  openGraph: {
    title: 'SAKUSHIKO',
    description: 'FANZAの無料サンプル動画をサクッと探せるサイト',
    type: 'website',
    siteName: 'SAKUSHIKO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SAKUSHIKO',
    description: 'FANZAの無料サンプル動画をサクッと探せるサイト',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SAKUSHIKO',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-border py-8 text-center text-xs text-muted">
          <p>当サイトはDMMアフィリエイトを利用しています。</p>
          <p className="mt-1">サンプル動画はFANZAが公式に提供する無料コンテンツです。</p>
        </footer>
      </body>
    </html>
  );
}
