'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function LanguageSwitcher() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentLang = searchParams.get('lang') || 'ja';

  const switchLang = (lang: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (lang === 'ja') {
      params.delete('lang');
    } else {
      params.set('lang', lang);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-1 text-xs">
      <button
        onClick={() => switchLang('ja')}
        className={`px-2 py-1 rounded transition-colors ${
          currentLang === 'ja'
            ? 'bg-accent text-white'
            : 'text-muted hover:text-foreground'
        }`}
      >
        JP
      </button>
      <button
        onClick={() => switchLang('en')}
        className={`px-2 py-1 rounded transition-colors ${
          currentLang === 'en'
            ? 'bg-accent text-white'
            : 'text-muted hover:text-foreground'
        }`}
      >
        EN
      </button>
    </div>
  );
}
