import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import AgeGate from '@/components/AgeGate';

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
        <AgeGate />
        <Header />
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-border py-6 px-4">
          <div className="max-w-6xl mx-auto text-center space-y-2">
            {/* PR表示 (ステマ規制法対応) */}
            <p className="text-xs font-medium text-foreground/70">
              【PR】当サイトはDMMアフィリエイトを利用した広告サイトです。
            </p>
            {/* DMM クレジット表示 */}
            <p className="text-[10px] text-muted">
              このサイトの商品情報は
              <a
                href="https://affiliate.dmm.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover"
              >
                DMMアフィリエイト
              </a>
              のWebサービスを利用して取得しています。
            </p>
            <p className="text-[10px] text-muted">
              サンプル動画はFANZAが公式に提供する無料コンテンツです。
            </p>
            <p className="text-[10px] text-muted/50 mt-2">
              © {new Date().getFullYear()} SAKUSHIKO
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
