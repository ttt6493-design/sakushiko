'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const OPTIONS = [
  { value: 'all', label: 'すべて' },
  { value: 'video', label: '動画' },
  { value: 'vr', label: 'VR' },
] as const;

export default function ContentTypeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get('type') || 'all';

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      params.delete('type');
    } else {
      params.set('type', value);
    }
    params.delete('page');
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex bg-card rounded-lg p-0.5 gap-0.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => handleChange(opt.value)}
          className={`px-4 py-2 rounded-md text-xs font-bold transition-all active:scale-95 ${
            current === opt.value
              ? opt.value === 'vr'
                ? 'bg-purple-600 text-white'
                : 'bg-accent text-white'
              : 'text-muted hover:text-foreground'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
