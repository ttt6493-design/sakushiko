import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import AgeGate from '@/components/AgeGate';
import { getLocale } from '@/lib/locale';
import { getTranslations } from '@/lib/i18n';

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
    default: 'ZERO 4K AV｜無料・広告なし。4Kで見られるAV動画',
    template: '%s | ZERO 4K AV',
  },
  description:
    '無料・広告なしで見られるFANZA公式のAV動画。4K・フルHD対応、女優・ジャンル別に秒で検索。気に入ったらそのまま本編へ。',
  keywords: ['4K', 'AV', '無料', '広告なし', 'FANZA', 'エロ動画', 'DMM'],
  openGraph: {
    title: 'ZERO 4K AV',
    description: '無料。広告ゼロ。4Kで見るAV。',
    type: 'website',
    siteName: 'ZERO 4K AV',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZERO 4K AV',
    description: '無料。広告ゼロ。4Kで見るAV。',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ZERO 4K AV',
  },
  formatDetection: {
    telephone: false,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Layout can't see searchParams, so this reflects cookie / Accept-Language.
  // Pages that receive ?lang= resolve their own locale on top of this.
  const locale = await getLocale();
  const t = getTranslations(locale);

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} antialiased`}>
        <AgeGate />
        <Header locale={locale} t={t} />
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-border py-6 px-4">
          <div className="max-w-6xl mx-auto text-center space-y-2">
            {/* PR表示 (ステマ規制法対応) */}
            <p className="text-xs font-medium text-foreground/70">{t.prDisclosure}</p>
            {/* DMM クレジット表示 */}
            <p className="text-[10px] text-muted">
              {t.creditPrefix}
              <a
                href="https://affiliate.dmm.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover"
              >
                {t.creditLink}
              </a>
              {t.creditSuffix}
            </p>
            <p className="text-[10px] text-muted">{t.footer2}</p>
            <p className="text-[10px] text-muted/50 mt-2">
              © {new Date().getFullYear()} ZERO 4K AV
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
