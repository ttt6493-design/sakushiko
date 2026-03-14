import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchVideoById } from '@/lib/api';
import VideoPlayer from '@/components/VideoPlayer';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const video = await fetchVideoById(id);
  if (!video) return { title: '動画が見つかりません' };

  return {
    title: `${video.title} - 無料サンプル動画 | SAKUSHIKO`,
    description: `${video.title}の無料サンプル動画。${video.actresses.join(', ')} 出演 | ${video.maker} | ${video.genres.join(', ')}`,
    openGraph: {
      title: video.title,
      description: `${video.actresses.join(', ')} | ${video.maker}`,
      type: 'video.other',
      images: [{ url: video.largeThumbnailUrl, width: 800, height: 450 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: video.title,
      images: [video.largeThumbnailUrl],
    },
  };
}

export default async function VideoDetailPage({ params }: PageProps) {
  const { id } = await params;
  const video = await fetchVideoById(id);

  if (!video) {
    notFound();
  }

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: `${video.actresses.join(', ')} | ${video.maker} | ${video.genres.join(', ')}`,
    thumbnailUrl: video.largeThumbnailUrl,
    uploadDate: video.date,
    duration: video.duration,
    ...(video.reviewAverage !== null && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: video.reviewAverage,
        reviewCount: video.reviewCount,
        bestRating: 5,
      },
    }),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <Link href="/" className="hover:text-foreground transition-colors shrink-0">
          ホーム
        </Link>
        <span>/</span>
        {video.genres[0] && (
          <>
            <Link
              href={`/?genre=${encodeURIComponent(video.genres[0])}`}
              className="hover:text-foreground transition-colors shrink-0"
            >
              {video.genres[0]}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-foreground truncate">{video.title}</span>
      </nav>

      {/* ===== MAIN: Sample Video Player ===== */}
      <section className="mb-6">
        <VideoPlayer
          videoUrl={video.sampleVideoUrl}
          posterUrl={video.largeThumbnailUrl}
          title={video.title}
        />
        <p className="text-[10px] text-muted mt-2 text-center">
          ※ FANZAが公式に提供する無料サンプル動画です
        </p>
      </section>

      {/* ===== Video Title & Quick Info ===== */}
      <section className="mb-5">
        <h1 className="text-lg sm:text-xl font-bold text-foreground leading-snug mb-3">
          {video.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          {video.reviewAverage !== null && (
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(video.reviewAverage!)
                        ? 'text-yellow-400'
                        : 'text-gray-600'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="text-yellow-400 font-bold">{video.reviewAverage.toFixed(1)}</span>
              <span className="text-muted text-xs">({video.reviewCount}件)</span>
            </div>
          )}
          {video.duration && (
            <span className="text-muted flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {video.duration}
            </span>
          )}
          <span className="text-muted text-xs">{video.date} 配信</span>
        </div>
      </section>

      {/* ===== CTA: Purchase Section ===== */}
      <section className="bg-gradient-to-r from-accent/10 to-pink-900/10 border border-accent/20 rounded-xl p-5 mb-6">
        <p className="text-sm text-foreground mb-3 font-medium">
          サンプルが気に入りましたか？本編をチェック！
        </p>
        <a
          href={video.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent-hover active:scale-[0.98] text-white font-bold py-4 rounded-lg transition-all hover:shadow-lg hover:shadow-accent/25 text-base"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          FANZAで本編を見る
        </a>
        <p className="text-[10px] text-muted mt-2 text-center">
          FANZAの商品ページへ移動します
        </p>
      </section>

      {/* ===== Details ===== */}
      <section className="mb-6">
        <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          作品情報
        </h2>
        <div className="bg-card rounded-lg overflow-hidden divide-y divide-border">
          {video.actresses.length > 0 && (
            <div className="flex px-4 py-3">
              <span className="text-muted text-sm w-20 shrink-0">出演</span>
              <div className="flex flex-wrap gap-1.5">
                {video.actresses.map((actress) => (
                  <Link
                    key={actress}
                    href={`/?q=${encodeURIComponent(actress)}`}
                    className="text-sm text-accent hover:text-accent-hover active:opacity-70 transition-colors font-medium"
                  >
                    {actress}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {video.maker && (
            <div className="flex px-4 py-3">
              <span className="text-muted text-sm w-20 shrink-0">メーカー</span>
              <Link
                href={`/?q=${encodeURIComponent(video.maker)}`}
                className="text-sm hover:text-accent transition-colors"
              >
                {video.maker}
              </Link>
            </div>
          )}
          {video.series && (
            <div className="flex px-4 py-3">
              <span className="text-muted text-sm w-20 shrink-0">シリーズ</span>
              <span className="text-sm">{video.series}</span>
            </div>
          )}
          <div className="flex px-4 py-3">
            <span className="text-muted text-sm w-20 shrink-0">品番</span>
            <span className="text-sm font-mono">{video.content_id}</span>
          </div>
        </div>
      </section>

      {/* ===== Genre Tags ===== */}
      {video.genres.length > 0 && (
        <section className="mb-20">
          <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            ジャンル
          </h2>
          <div className="flex flex-wrap gap-2">
            {video.genres.map((genre) => (
              <Link
                key={genre}
                href={`/?genre=${encodeURIComponent(genre)}`}
                className="bg-card hover:bg-card-hover active:scale-95 text-muted hover:text-foreground text-xs px-3 py-1.5 rounded-full transition-all"
              >
                {genre}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== Bottom Sticky CTA ===== */}
      <section className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t border-border px-4 py-3 safe-bottom">
        <div className="max-w-4xl mx-auto">
          <a
            href={video.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent-hover active:scale-[0.98] text-white font-bold py-3.5 rounded-lg transition-all text-sm"
          >
            FANZAで本編を見る・購入する
          </a>
        </div>
      </section>
    </div>
  );
}
