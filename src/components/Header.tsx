import Link from 'next/link';
import { Suspense } from 'react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#0a0a12]/95 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-lg font-black text-accent">▶</span>
          <span className="text-base font-bold text-foreground tracking-tight">
            SAKUSHIKO
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden sm:flex items-center gap-5 text-xs">
            <Link href="/?sort=date" className="text-muted hover:text-foreground transition-colors">
              新着
            </Link>
            <Link href="/?sort=rank" className="text-muted hover:text-foreground transition-colors">
              人気
            </Link>
            <Link href="/?sort=review" className="text-muted hover:text-foreground transition-colors">
              高評価
            </Link>
          </nav>
          <Suspense>
            <LanguageSwitcher />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
