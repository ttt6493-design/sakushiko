import Link from 'next/link';
import Image from 'next/image';
import { VideoItem } from '@/lib/types';
import { getHighestQualityLabel } from '@/lib/api';

interface VideoCardProps {
  video: VideoItem;
  sampleLabel?: string;
}

export default function VideoCard({ video, sampleLabel = 'サンプル' }: VideoCardProps) {
  const qualityLabel = getHighestQualityLabel(video.sampleQualities);

  return (
    <Link
      href={`/video/${video.content_id}`}
      className="group block bg-card rounded-lg overflow-hidden hover:bg-card-hover transition-all hover:ring-1 hover:ring-accent/30 active:scale-[0.98]"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:scale-110 backdrop-blur-sm">
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {/* Sample badge */}
        <span className="absolute top-1.5 left-1.5 bg-accent/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
          {sampleLabel}
        </span>
        {/* Quality badge */}
        {qualityLabel && (
          <span className={`absolute top-1.5 right-1.5 text-white text-[9px] font-bold px-1.5 py-0.5 rounded ${
            qualityLabel === '4K' ? 'bg-amber-500/90' :
            qualityLabel === 'FHD' ? 'bg-emerald-500/90' :
            qualityLabel === 'HD' ? 'bg-blue-500/90' : 'bg-gray-600/90'
          }`}>
            {qualityLabel}
          </span>
        )}
        {/* Duration badge */}
        {video.duration && (
          <span className="absolute bottom-1.5 right-1.5 bg-black/75 text-white text-[10px] px-1.5 py-0.5 rounded">
            {video.duration}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5">
        <h3 className="text-[13px] font-semibold text-foreground leading-tight line-clamp-2 mb-1.5 group-hover:text-accent transition-colors">
          {video.title}
        </h3>

        {video.actresses.length > 0 && (
          <p className="text-[11px] text-accent/80 truncate mb-1">
            {video.actresses.join(' / ')}
          </p>
        )}

        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] text-muted truncate flex-1">
            {video.maker}
          </span>
          {video.reviewAverage !== null && (
            <span className="flex items-center gap-0.5 text-[10px] text-yellow-400 shrink-0">
              ★ {video.reviewAverage.toFixed(1)}
              <span className="text-muted">({video.reviewCount})</span>
            </span>
          )}
        </div>

        {/* Genre tags */}
        <div className="flex flex-wrap gap-1 mt-2">
          {video.genres.slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="text-[9px] text-muted bg-background px-1.5 py-0.5 rounded"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
