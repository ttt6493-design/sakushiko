'use client';

import { useRouter, useSearchParams } from 'next/navigation';

// Product quality (genre tag based)
const PRODUCT_OPTIONS = [
  { value: 'all', label: 'ALL' },
  { value: 'p4k', label: '4K' },
  { value: 'pfhd', label: 'FHD' },
  { value: 'phd', label: 'HD' },
] as const;

// Sample video quality (actual playback quality)
const SAMPLE_OPTIONS = [
  { value: 's4k', label: '4K' },
  { value: 'sfhd', label: 'FHD' },
  { value: 'shd', label: 'HD' },
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

  const btnClass = (value: string) =>
    `px-2.5 py-1 rounded text-[10px] font-bold tracking-wide transition-all active:scale-95 ${
      currentQuality === value
        ? value.includes('4k')
          ? 'bg-amber-500 text-white'
          : value.includes('fhd')
          ? 'bg-emerald-500 text-white'
          : value.includes('hd')
          ? 'bg-blue-500 text-white'
          : 'bg-accent text-white'
        : 'bg-card text-muted hover:text-foreground'
    }`;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {/* Product quality */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-muted shrink-0">画質:</span>
        {PRODUCT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleQuality(opt.value)}
            className={btnClass(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Sample quality */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-muted shrink-0">サンプル画質:</span>
        {SAMPLE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleQuality(opt.value)}
            className={btnClass(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
