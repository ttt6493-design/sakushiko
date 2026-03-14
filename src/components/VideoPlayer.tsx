'use client';

import { useRef, useCallback } from 'react';
import Image from 'next/image';

interface VideoPlayerProps {
  videoUrl: string | null;
  posterUrl: string;
  title: string;
}

export default function VideoPlayer({ videoUrl, posterUrl, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      // Request fullscreen on play for immersive experience
      if (video.requestFullscreen) {
        await video.requestFullscreen();
      } else if ((video as any).webkitEnterFullscreen) {
        // iOS Safari uses this
        (video as any).webkitEnterFullscreen();
      }

      // Lock to landscape if supported (Android Chrome, etc.)
      try {
        await (screen.orientation as any).lock?.('landscape');
      } catch {
        // Orientation lock not supported, that's fine
      }
    } catch {
      // Fullscreen not supported, play normally
    }
  }, []);

  if (!videoUrl) {
    return (
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl shadow-black/50">
        <Image
          src={posterUrl}
          alt={title}
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur flex items-center justify-center mb-3">
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <p className="text-white/70 text-sm font-medium">
            サンプル動画を再生
          </p>
          <p className="text-white/40 text-xs mt-1">
            API接続後に再生可能になります
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl shadow-black/50">
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        controls
        playsInline
        onPlay={handlePlay}
        className="w-full h-full"
      />
      {/* Fullscreen hint for mobile */}
      <div className="absolute bottom-12 right-2 bg-black/60 text-white/70 text-[9px] px-2 py-1 rounded pointer-events-none sm:hidden">
        再生で全画面＋横向き表示
      </div>
    </div>
  );
}
