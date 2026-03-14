'use client';

import { useRouter, useSearchParams } from 'next/navigation';

// Matches FANZA's actual sample video quality tiers
const QUALITY_OPTIONS = [
  { value: 'all', label: 'ALL', desc: 'すべて' },
  { value: '4k', label: '4K', desc: '4K (2160p)' },
  { value: '1080p', label: 'FHD', desc: 'Full HD (1080p)' },
  { value: '720p', label: 'HD', desc: 'HD (720p)' },
  { value: '576p', label: '高画質', desc: '高画質 (576p)' },
  { value: '432p', label: '中画質', desc: '中画質 (432p)' },
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
                ? opt.value === '4k'
                  ? 'bg-amber-500 text-white'
                  : opt.value === '1080p'
                  ? 'bg-emerald-500 text-white'
                  : opt.value === '720p'
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
