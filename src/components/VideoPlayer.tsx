'use client';

import { useState } from 'react';
import Image from 'next/image';

interface VideoPlayerProps {
  videoUrl: string | null;
  posterUrl: string;
  title: string;
}

export default function VideoPlayer({ videoUrl, posterUrl, title }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);

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
            サンプル動画なし
          </p>
        </div>
      </div>
    );
  }

  // DMM API returns player page URLs, not direct MP4s
  // Use iframe to embed DMM's official player
  if (playing) {
    return (
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl shadow-black/50">
        <iframe
          src={videoUrl}
          className="w-full h-full"
          allowFullScreen
          allow="autoplay; fullscreen"
          title={title}
        />
      </div>
    );
  }

  return (
    <div
      className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl shadow-black/50 cursor-pointer group"
      onClick={() => setPlaying(true)}
    >
      <Image
        src={posterUrl}
        alt={title}
        fill
        className="object-cover group-hover:opacity-80 transition-opacity"
        priority
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-black/40 backdrop-blur flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-accent/60 transition-all">
          <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <p className="text-white/80 text-sm font-medium">
          サンプル動画を再生
        </p>
      </div>
    </div>
  );
}
