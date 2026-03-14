'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const QUALITY_OPTIONS = [
  { value: 'all', label: 'ALL', desc: 'すべて' },
  { value: '720p', label: 'HD', desc: '720x480' },
  { value: '644p', label: 'HQ', desc: '644x414' },
  { value: '560p', label: 'SD', desc: '560x360' },
  { value: '476p', label: 'LQ', desc: '476x306' },
] as const;

export default function QualityFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuality = searchParams.get('quality') || 'all';

  const handleQuality = (quality: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (quality === 'all') {
      params.delete('quality');
    } else {
      params.set('quality', quality);
    }
    params.delete('page');
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-muted shrink-0">画質:</span>
      <div className="flex gap-1.5">
        {QUALITY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleQuality(opt.value)}
            title={opt.desc}
            className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wide transition-all active:scale-95 ${
              currentQuality === opt.value
                ? opt.value === '720p'
                  ? 'bg-blue-500 text-white'
                  : 'bg-accent text-white'
                : 'bg-card text-muted hover:text-foreground'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
