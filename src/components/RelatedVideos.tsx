import Link from 'next/link';
import { fetchVideos } from '@/lib/api';
import type { VideoItem } from '@/lib/types';
import type { Translations } from '@/lib/i18n';
import VideoCard from './VideoCard';
import { actressHref, searchHref } from '@/lib/links';

interface RelatedVideosProps {
  video: VideoItem;
  t: Translations;
}

interface RelatedGroup {
  title: string;
  moreHref: string;
  items: VideoItem[];
}

const PER_GROUP = 8;
// Ask for more than we show: the current title and sample-less items get dropped.
const FETCH_HITS = 16;

async function fetchGroup(
  keyword: string,
  title: string,
  exclude: Set<string>,
  moreHref: string = searchHref(keyword)
): Promise<RelatedGroup | null> {
  try {
    const result = await fetchVideos({ keyword, sort: 'rank', hits: FETCH_HITS });
    const items = result.items.filter((v) => !exclude.has(v.content_id)).slice(0, PER_GROUP);
    if (items.length === 0) return null;
    return { title, moreHref, items };
  } catch {
    return null;
  }
}

// Server component: rendered inside <Suspense> so the player and CTA never wait on it.
export default async function RelatedVideos({ video, t }: RelatedVideosProps) {
  const exclude = new Set([video.content_id]);
  const jobs: Array<Promise<RelatedGroup | null>> = [];

  const actress = video.actresses[0];
  if (actress) jobs.push(fetchGroup(actress, t.relatedByActress(actress), exclude, actressHref(actress)));

  if (video.series) {
    jobs.push(fetchGroup(video.series, t.relatedBySeries(video.series), exclude));
  } else if (video.maker) {
    jobs.push(fetchGroup(video.maker, t.relatedByMaker(video.maker), exclude));
  }

  // Fallback so the section is never empty: same first genre
  if (jobs.length === 0 && video.genres[0]) {
    jobs.push(fetchGroup(video.genres[0], video.genres[0], exclude));
  }

  const groups = (await Promise.all(jobs)).filter((g): g is RelatedGroup => g !== null);

  // Don't show the same title twice across groups
  const seen = new Set<string>();
  for (const group of groups) {
    group.items = group.items.filter((v) => {
      if (seen.has(v.content_id)) return false;
      seen.add(v.content_id);
      return true;
    });
  }
  const visible = groups.filter((g) => g.items.length > 0);
  if (visible.length === 0) return null;

  return (
    <section className="mb-6 space-y-6">
      <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
        <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        {t.relatedTitle}
      </h2>
      {visible.map((group) => (
        <div key={group.title}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-muted truncate">{group.title}</h3>
            <Link
              href={group.moreHref}
              className="text-xs text-accent hover:text-accent-hover shrink-0 ml-3"
            >
              {t.seeMore} ›
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {group.items.map((item) => (
              <VideoCard key={item.content_id} video={item} sampleLabel={t.sample} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
