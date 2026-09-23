import { Suspense } from 'react';
import { fetchVideos } from '@/lib/api';
import type { SearchParams } from '@/lib/types';
import type { Translations } from '@/lib/i18n';
import VideoCard from './VideoCard';
import Pagination from './Pagination';

interface VideoResultsProps {
  params: SearchParams;
  t: Translations;
}

// Server component that owns the slow part of the home page (the DMM API call).
// Rendered inside <Suspense> so the header, search box and filters paint immediately
// and the grid streams in when the data arrives.
export default async function VideoResults({ params, t }: VideoResultsProps) {
  const result = await fetchVideos(params);
  const page = result.page;
  const from = (page - 1) * result.pageSize + 1;
  const to = Math.min((page - 1) * result.pageSize + result.items.length, result.totalCount);

  return (
    <>
      <div className="flex justify-end mb-3">
        <span className="text-xs text-muted">
          {result.totalCount > 0 && result.items.length > 0 ? t.showing(result.totalCount, from, to) : ''}
        </span>
      </div>

      {result.items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {result.items.map((video) => (
            <VideoCard key={video.content_id} video={video} sampleLabel={t.sample} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-muted">
          <svg className="w-16 h-16 mb-4 text-muted/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-lg mb-1">{t.noResults}</p>
          <p className="text-sm">{t.noResultsSub}</p>
        </div>
      )}

      <Suspense>
        <Pagination
          currentPage={result.page}
          totalPages={result.totalPages}
          prevLabel={t.prevPage}
          nextLabel={t.nextPage}
        />
      </Suspense>
    </>
  );
}
