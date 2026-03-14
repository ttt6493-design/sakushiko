'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { GENRES } from '@/lib/genres';

export default function GenreFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentGenre = searchParams.get('genre') || 'all';

  const handleGenre = (genreId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (genreId === 'all') {
      params.delete('genre');
    } else {
      params.set('genre', genreId);
    }
    params.delete('page');
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
      <div className="flex gap-2 pb-2 min-w-max">
        {GENRES.map((genre) => (
          <button
            key={genre.id}
            onClick={() => handleGenre(genre.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              currentGenre === genre.id
                ? 'bg-accent text-white shadow-lg shadow-accent/25'
                : 'bg-card text-muted hover:text-foreground hover:bg-card-hover'
            }`}
          >
            <span>{genre.icon}</span>
            <span>{genre.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
