'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const SORT_OPTIONS = [
  { value: 'date', label: '新着順' },
  { value: 'rank', label: '人気順' },
  { value: 'review', label: '高評価順' },
] as const;

export default function SortTabs() {
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
      {SORT_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => handleSort(option.value)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            currentSort === option.value
              ? 'bg-accent text-white'
              : 'bg-card text-muted hover:text-foreground'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
