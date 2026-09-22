'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Locale } from '@/lib/i18n';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

interface LanguageSwitcherProps {
  initialLocale: Locale;
}

export default function LanguageSwitcher({ initialLocale }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // An explicit ?lang= on the URL wins over the cookie-derived locale
  const paramLang = searchParams.get('lang');
  const currentLang: Locale = paramLang === 'en' || paramLang === 'ja' ? paramLang : initialLocale;

  const switchLang = (lang: Locale) => {
    if (lang === currentLang) return;
    // Persist so every page (list, detail, blog) renders in this language
    document.cookie = `lang=${lang}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;

    // Drop any stale ?lang= from the URL and re-render the current page
    const params = new URLSearchParams(searchParams.toString());
    params.delete('lang');
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
    router.refresh();
  };

  const btnClass = (lang: Locale) =>
    `px-2 py-1 rounded transition-colors ${
      currentLang === lang ? 'bg-accent text-white' : 'text-muted hover:text-foreground'
    }`;

  return (
    <div className="flex items-center gap-1 text-xs">
      <button onClick={() => switchLang('ja')} className={btnClass('ja')}>
        JP
      </button>
      <button onClick={() => switchLang('en')} className={btnClass('en')}>
        EN
      </button>
    </div>
  );
}
