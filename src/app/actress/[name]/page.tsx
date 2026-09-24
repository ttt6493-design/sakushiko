import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchActress } from '@/lib/api';
import { getTranslations } from '@/lib/i18n';
import { getLocale } from '@/lib/locale';
import { SITE_URL } from '@/lib/site';
import type { SampleQuality, SearchParams } from '@/lib/types';
import SortTabs from '@/components/SortTabs';
import QualityFilter from '@/components/QualityFilter';
import VideoResults from '@/components/VideoResults';
import VideoGridSkeleton from '@/components/VideoGridSkeleton';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

function decodeName(raw: string): string {
  try {
    return decodeURIComponent(raw).trim();
  } catch {
    return raw.trim();
  }
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { name: raw } = await params;
  const { lang } = await searchParams;
  const name = decodeName(raw);
  const t = getTranslations(await getLocale(lang));
  const actress = await fetchActress(name);

  return {
    title: t.actressPageTitle(name),
    description: t.actressPageDescription(name),
    alternates: { canonical: `${SITE_URL}/actress/${encodeURIComponent(name)}` },
    openGraph: {
      title: t.actressPageTitle(name),
      description: t.actressPageDescription(name),
      type: 'profile',
      ...(actress?.imageUrl && { images: [{ url: actress.imageUrl }] }),
    },
  };
}

export default async function ActressPage({ params, searchParams }: PageProps) {
  const { name: raw } = await params;
  const sp = await searchParams;
  const name = decodeName(raw);
  const t = getTranslations(await getLocale(sp.lang));

  const sort = (sp.sort as 'date' | 'rank' | 'review') || 'rank';
  const quality = (sp.quality as SampleQuality) || 'all';
  const page = Math.max(1, parseInt(sp.page || '1', 10) || 1);

  // Exact match via the actress API when available; keyword search otherwise.
  const actress = await fetchActress(name);
  const query: SearchParams = actress
    ? { actressId: actress.id, actress: name, sort, quality, page }
    : { keyword: name, actress: name, sort, quality, page };
  const queryKey = JSON.stringify(query);

  const size = actress && (actress.bust || actress.waist || actress.hip)
    ? `B${actress.bust || '-'}${actress.cup ? `(${actress.cup})` : ''} / W${actress.waist || '-'} / H${actress.hip || '-'}`
    : '';
  const profile: Array<[string, string]> = actress
    ? [
        [t.profileHeight, actress.height ? `${actress.height}cm` : ''],
        [t.profileSize, size],
        [t.profileBirthday, actress.birthday],
        [t.profileBlood, actress.bloodType],
        [t.profileFrom, actress.prefectures],
        [t.profileHobby, actress.hobby],
      ].filter((row): row is [string, string] => Boolean(row[1]))
    : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    ...(actress?.ruby && { alternateName: actress.ruby }),
    ...(actress?.imageUrl && { image: actress.imageUrl }),
    url: `${SITE_URL}/actress/${encodeURIComponent(name)}`,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted mb-4">
        <Link href="/" className="hover:text-foreground transition-colors">
          {t.home}
        </Link>
        <span>/</span>
        <span>{t.actressIndex}</span>
        <span>/</span>
        <span className="text-foreground">{name}</span>
      </nav>

      {/* Profile header */}
      <header className="flex gap-4 items-start mb-6">
        {actress?.imageUrl && (
          <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden shrink-0 bg-card">
            <Image src={actress.imageUrl} alt={name} fill sizes="112px" className="object-cover" priority />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
            {t.actressHeading(name)}
          </h1>
          {actress?.ruby && <p className="text-xs text-muted mt-0.5">{actress.ruby}</p>}
          {profile.length > 0 && (
            <dl className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs">
              {profile.map(([label, value]) => (
                <div key={label} className="flex gap-1">
                  <dt className="text-muted">{label}:</dt>
                  <dd className="text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </header>

      {/* Sort + quality */}
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <Suspense>
          <SortTabs labels={[t.sortNew, t.sortPopular, t.sortRating]} />
        </Suspense>
        <Suspense>
          <QualityFilter qualityLabel={t.qualityLabel} sampleQualityLabel={t.sampleQualityLabel} />
        </Suspense>
      </div>

      <Suspense key={queryKey} fallback={<VideoGridSkeleton label={t.loadingResults} />}>
        <VideoResults params={query} t={t} />
      </Suspense>
    </div>
  );
}
