'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const VALUES = ['all', 'video', 'vr'] as const;

interface ContentTypeFilterProps {
  labels?: [string, string, string];
}

export default function ContentTypeFilter({ labels = ['すべて', '動画', 'VR'] }: ContentTypeFilterProps) {
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
      {VALUES.map((value, i) => (
        <button
          key={value}
          onClick={() => handleChange(value)}
          className={`px-4 py-2 rounded-md text-xs font-bold transition-all active:scale-95 ${
            current === value
              ? value === 'vr'
                ? 'bg-purple-600 text-white'
                : 'bg-accent text-white'
              : 'text-muted hover:text-foreground'
          }`}
        >
          {labels[i]}
        </button>
      ))}
    </div>
  );
}
