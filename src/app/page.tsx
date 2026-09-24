import { Suspense } from 'react';
import SearchBar from '@/components/SearchBar';
import SortTabs from '@/components/SortTabs';
import GenreFilter from '@/components/GenreFilter';
import ValueProps from '@/components/ValueProps';
import QualityFilter from '@/components/QualityFilter';
import VideoResults from '@/components/VideoResults';
import VideoGridSkeleton from '@/components/VideoGridSkeleton';
import { isApiConfigured } from '@/lib/config';
import { getTranslations } from '@/lib/i18n';
import { getLocale } from '@/lib/locale';
import type { SampleQuality, SearchParams } from '@/lib/types';
import type { Metadata } from 'next';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const lang = await getLocale(params.lang);

  if (lang === 'en') {
    return {
      title: { absolute: 'ZERO 4K AV | Free Japanese AV in 4K. Zero Ads.' },
      description:
        'Watch official Japanese AV videos free, in 4K and Full HD, with zero ads. Instant search by actress and genre.',
      keywords: ['japanese av', 'JAV', '4K', 'free', 'no ads', 'FANZA', 'DMM'],
      openGraph: {
        title: 'ZERO 4K AV',
        description: 'Free. Zero ads. Japanese AV in 4K.',
      },
    };
  }

  return {
    title: { absolute: 'ZERO 4K AV｜無料・広告なし。4Kで見られるAV動画' },
    description:
      '無料・広告なしで見られるFANZA公式のAV動画。4K・フルHD対応、女優・ジャンル別に秒で検索。気に入ったらそのまま本編へ。',
    keywords: ['4K', 'AV', '無料', '広告なし', 'FANZA', 'エロ動画', 'DMM'],
  };
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const lang = await getLocale(params.lang);
  const t = getTranslations(lang);
  const keyword = params.q || '';
  const sort = (params.sort as 'date' | 'rank' | 'review') || 'rank'; // Default: popular
  const genre = params.genre || '';
  const quality = (params.quality as SampleQuality) || 'all';
  const page = Math.max(1, parseInt(params.page || '1', 10) || 1);

  const searchKeyword = [genre, keyword].filter(Boolean).join(' ');
  const query: SearchParams = {
    keyword: searchKeyword || undefined,
    sort,
    quality,
    page,
  };
  // Changing any search input remounts the Suspense boundary so the skeleton
  // shows immediately instead of the previous results lingering.
  const queryKey = JSON.stringify(query);

  const isFirstPage = page === 1 && !keyword && !genre && quality === 'all';

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      {/* Hero section */}
      <div className="text-center mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
          {t.tagline}
        </h1>
        {isFirstPage && (
          <div className="max-w-md mx-auto bg-card/50 rounded-lg px-4 py-3 mb-2">
            <p className="text-xs text-muted leading-relaxed whitespace-pre-line">
              {t.creatorNote}
            </p>
            {t.creatorSign && (
              <p className="text-[10px] text-muted/60 mt-1.5 italic">
                {t.creatorSign}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Value propositions - only on first page */}
      {isFirstPage && <ValueProps t={t} />}

      {/* Search */}
      <Suspense>
        <div className="mb-4">
          <SearchBar placeholder={t.searchPlaceholder} />
        </div>
      </Suspense>

      <Suspense>
        <div className="mb-4">
          <GenreFilter allLabel={t.allGenres} />
        </div>
      </Suspense>

      {/* Sort + quality */}
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <Suspense>
          <SortTabs labels={[t.sortNew, t.sortPopular, t.sortRating]} />
        </Suspense>
        <Suspense>
          <QualityFilter qualityLabel={t.qualityLabel} sampleQualityLabel={t.sampleQualityLabel} />
        </Suspense>
      </div>

      {/* Demo banner */}
      {!isApiConfigured() && (
        <div className="bg-purple-900/30 border border-purple-700/30 rounded-lg px-4 py-2.5 mb-4 text-xs text-purple-300">
          {t.demoMode}
        </div>
      )}

      {/* Video grid: streamed in after the shell above has painted */}
      <Suspense key={queryKey} fallback={<VideoGridSkeleton label={t.loadingResults} />}>
        <VideoResults params={query} t={t} />
      </Suspense>
    </div>
  );
}
