import Link from 'next/link';
import { Suspense } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import type { Locale, Translations } from '@/lib/i18n';

interface HeaderProps {
  locale: Locale;
  t: Translations;
}

export default function Header({ locale, t }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#0a0a12]/95 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 shrink-0" aria-label="ZERO 4K AV">
          <span className="text-lg font-black text-accent leading-none">▶</span>
          <span className="flex items-baseline gap-1.5 leading-none">
            <span className="text-lg font-black text-foreground tracking-tight">ZERO</span>
            <span className="text-xs font-bold text-accent tracking-[0.2em]">4K AV</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden sm:flex items-center gap-5 text-xs">
            <Link href="/?sort=date" className="text-muted hover:text-foreground transition-colors">
              {t.sortNew}
            </Link>
            <Link href="/?sort=rank" className="text-muted hover:text-foreground transition-colors">
              {t.sortPopular}
            </Link>
            <Link href="/?sort=review" className="text-muted hover:text-foreground transition-colors">
              {t.sortRating}
            </Link>
            <Link href="/blog" className="text-muted hover:text-foreground transition-colors">
              {t.blog}
            </Link>
          </nav>
          <Suspense>
            <LanguageSwitcher initialLocale={locale} />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
