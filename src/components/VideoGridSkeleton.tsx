interface VideoGridSkeletonProps {
  count?: number;
  label?: string;
}

// Placeholder grid shown while the video list streams in from the server.
export default function VideoGridSkeleton({ count = 12, label = '読み込み中...' }: VideoGridSkeletonProps) {
  return (
    <div aria-busy="true" aria-label={label}>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="bg-card rounded-lg overflow-hidden animate-pulse">
            <div className="aspect-[3/4] bg-card-hover" />
            <div className="p-2.5 space-y-2">
              <div className="h-3 bg-card-hover rounded w-11/12" />
              <div className="h-3 bg-card-hover rounded w-2/3" />
              <div className="h-2.5 bg-card-hover rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
