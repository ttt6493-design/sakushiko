'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const SORT_VALUES = ['date', 'rank', 'review'] as const;

interface SortTabsProps {
  labels?: [string, string, string];
}

export default function SortTabs({ labels = ['新着順', '人気順', '高評価順'] }: SortTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'date';

  const handleSort = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sort);
    params.delete('page');
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex gap-2">
      {SORT_VALUES.map((value, i) => (
        <button
          key={value}
          onClick={() => handleSort(value)}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-all active:scale-95 ${
            currentSort === value
              ? 'bg-accent text-white'
              : 'bg-card text-muted hover:text-foreground'
          }`}
        >
          {labels[i]}
        </button>
      ))}
    </div>
  );
}
