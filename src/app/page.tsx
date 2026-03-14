import { Suspense } from 'react';
import { fetchVideos } from '@/lib/api';
import VideoCard from '@/components/VideoCard';
import SearchBar from '@/components/SearchBar';
import SortTabs from '@/components/SortTabs';
import GenreFilter from '@/components/GenreFilter';
import Pagination from '@/components/Pagination';
import ValueProps from '@/components/ValueProps';
import QualityFilter from '@/components/QualityFilter';
import { isApiConfigured } from '@/lib/config';
import { getTranslations, type Locale } from '@/lib/i18n';
import type { SampleQuality } from '@/lib/types';
import type { Metadata } from 'next';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const lang = (params.lang as Locale) || 'ja';

  if (lang === 'en') {
    return {
      title: 'SAKUSHIKO - Free Japanese AV Sample Videos | No Ads, Just Content',
      description:
        'Browse free official Japanese AV sample videos. Premium quality, zero ads, instant category search. The cleanest JAV preview site on the web.',
      keywords: ['japanese av', 'JAV', 'free sample', 'preview', 'FANZA', 'no ads', 'DMM'],
      openGraph: {
        title: 'SAKUSHIKO - Free Japanese AV Samples',
        description: 'Premium Japanese AV samples. No ads. No BS.',
      },
    };
  }

  return {
    title: 'SAKUSHIKO - 無料サンプル動画で今すぐオカズ探し',
    description:
      'FANZAの無料サンプル動画をサクッと探せるサイト。広告なし、カテゴリ別に簡単検索。気に入ったらそのまま購入へ。',
    keywords: ['FANZA', 'サンプル動画', '無料', 'DMM', 'AV', '広告なし'],
  };
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const lang = (params.lang as Locale) || 'ja';
  const t = getTranslations(lang);
  const keyword = params.q || '';
  const sort = (params.sort as 'date' | 'rank' | 'review') || 'date';
  const genre = params.genre || '';
  const quality = (params.quality as SampleQuality) || 'all';
  const page = parseInt(params.page || '1', 10);

  const searchKeyword = [genre, keyword].filter(Boolean).join(' ');
  const result = await fetchVideos({ keyword: searchKeyword || undefined, sort, quality, page });

  const isFirstPage = page === 1 && !keyword && !genre;

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      {/* Hero section */}
      <div className="text-center mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {lang === 'ja' ? (
            <>サクッとオカズを<span className="text-accent">見つける</span></>
          ) : (
            <>Find What You Need. <span className="text-accent">Fast.</span></>
          )}
        </h1>
        <p className="text-sm text-muted">
          {t.subtitle}
        </p>
      </div>

      {/* Value propositions - only on first page */}
      {isFirstPage && <ValueProps t={t} />}

      {/* Search */}
      <Suspense>
        <div className="mb-4">
          <SearchBar placeholder={t.searchPlaceholder} />
        </div>
      </Suspense>

      {/* Genre filter */}
      <Suspense>
        <div className="mb-4">
          <GenreFilter allLabel={t.allGenres} />
        </div>
      </Suspense>

      {/* Sort + quality + count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <Suspense>
            <SortTabs labels={[t.sortNew, t.sortPopular, t.sortRating]} />
          </Suspense>
          <Suspense>
            <QualityFilter />
          </Suspense>
        </div>
        <span className="text-xs text-muted">
          {result.totalCount > 0
            ? t.showing(result.totalCount, (page - 1) * 30 + 1, Math.min(page * 30, result.totalCount))
            : ''}
        </span>
      </div>

      {/* Demo banner */}
      {!isApiConfigured() && (
        <div className="bg-purple-900/30 border border-purple-700/30 rounded-lg px-4 py-2.5 mb-4 text-xs text-purple-300">
          {t.demoMode}
        </div>
      )}

      {/* Video grid */}
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

      {/* Pagination */}
      <Suspense>
        <Pagination currentPage={result.page} totalPages={result.totalPages} />
      </Suspense>
    </div>
  );
}
