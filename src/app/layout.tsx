import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SAKUSHIKO - 無料サンプル動画で今すぐオカズ探し',
  description:
    'FANZAの無料サンプル動画をサクッと探せるサイト。カテゴリ別に簡単検索、気に入ったらそのまま購入へ。',
  openGraph: {
    title: 'SAKUSHIKO',
    description: 'FANZAの無料サンプル動画をサクッと探せるサイト',
    type: 'website',
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
