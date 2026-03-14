import { Suspense } from 'react';
import { fetchVideos } from '@/lib/api';
import VideoCard from '@/components/VideoCard';
import SearchBar from '@/components/SearchBar';
import SortTabs from '@/components/SortTabs';
import GenreFilter from '@/components/GenreFilter';
import Pagination from '@/components/Pagination';
import { isApiConfigured } from '@/lib/config';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const keyword = params.q || '';
  const sort = (params.sort as 'date' | 'rank' | 'review') || 'date';
  const genre = params.genre || '';
  const page = parseInt(params.page || '1', 10);

  // Combine genre and keyword for search
  const searchKeyword = [genre, keyword].filter(Boolean).join(' ');

  const result = await fetchVideos({ keyword: searchKeyword || undefined, sort, page });

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      {/* Hero section */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          サクッとオカズを<span className="text-accent">見つける</span>
        </h1>
        <p className="text-sm text-muted">
          無料サンプル動画をカテゴリ別にサクッと検索。気に入ったらそのまま本編へ。
        </p>
      </div>

      {/* Search */}
      <Suspense>
        <div className="mb-4">
          <SearchBar />
        </div>
      </Suspense>

      {/* Genre filter - scrollable */}
      <Suspense>
        <div className="mb-4">
          <GenreFilter />
        </div>
      </Suspense>

      {/* Sort + count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <Suspense>
          <SortTabs />
        </Suspense>
        <span className="text-xs text-muted">
          {result.totalCount.toLocaleString()}件
          {result.totalCount > 0 && (
            <>
              {' '}/ {(page - 1) * 30 + 1}-{Math.min(page * 30, result.totalCount)}件表示
            </>
          )}
        </span>
      </div>

      {/* Demo banner */}
      {!isApiConfigured() && (
        <div className="bg-purple-900/30 border border-purple-700/30 rounded-lg px-4 py-2.5 mb-4 text-xs text-purple-300">
          デモモード: API未設定のためサンプルデータを表示中
        </div>
      )}

      {/* Video grid */}
      {result.items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {result.items.map((video) => (
            <VideoCard key={video.content_id} video={video} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-muted">
          <svg className="w-16 h-16 mb-4 text-muted/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-lg mb-1">動画が見つかりませんでした</p>
          <p className="text-sm">別のキーワードやカテゴリで検索してみてください</p>
        </div>
      )}

      {/* Pagination */}
      <Suspense>
        <Pagination currentPage={result.page} totalPages={result.totalPages} />
      </Suspense>
    </div>
  );
}
