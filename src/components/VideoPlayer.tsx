'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface VideoPlayerProps {
  videoUrl: string | null;
  posterUrl: string;
  title: string;
}

interface VideoQuality {
  label: string;
  url: string;
}

export default function VideoPlayer({ videoUrl, posterUrl, title }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [mp4Url, setMp4Url] = useState<string | null>(null);
  const [qualities, setQualities] = useState<VideoQuality[]>([]);
  const [loading, setLoading] = useState(false);
  const [showQuality, setShowQuality] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const fetchMp4Url = useCallback(async () => {
    if (!videoUrl) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/video-url?url=${encodeURIComponent(videoUrl)}`);
      const data = await res.json();
      if (data.url) {
        setMp4Url(data.url);
        setQualities(data.qualities || []);
      }
    } catch {
      // Fallback: open on FANZA
    } finally {
      setLoading(false);
    }
  }, [videoUrl]);

  const handlePlay = async () => {
    setPlaying(true);
    if (!mp4Url) {
      await fetchMp4Url();
    }
  };

  const switchQuality = (url: string) => {
    const video = videoRef.current;
    const currentTime = video?.currentTime || 0;
    setMp4Url(url);
    setShowQuality(false);
    // Restore position after source change
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = currentTime;
        videoRef.current.play();
      }
    }, 100);
  };

  // Auto-play when mp4Url is ready
  useEffect(() => {
    if (mp4Url && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [mp4Url]);

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
            <svg className="w-8 h-8 text-white/50 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <p className="text-white/50 text-sm font-medium">サンプル動画なし</p>
        </div>
      </div>
    );
  }

  if (playing) {
    return (
      <div className="bg-black -mx-4 sm:rounded-xl sm:mx-0 overflow-hidden">
        <div className="relative w-full aspect-video">
          {loading && !mp4Url ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-3 border-white/20 border-t-accent rounded-full animate-spin" />
            </div>
          ) : mp4Url ? (
            <>
              <video
                ref={videoRef}
                src={mp4Url}
                poster={posterUrl}
                controls
                playsInline
                autoPlay
                className="w-full h-full"
              />
              {/* Quality selector */}
              {qualities.length > 1 && (
                <div className="absolute top-2 right-2 z-10">
                  <button
                    onClick={() => setShowQuality(!showQuality)}
                    className="bg-black/60 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded hover:bg-black/80 transition-colors"
                  >
                    画質
                  </button>
                  {showQuality && (
                    <div className="absolute top-8 right-0 bg-black/90 backdrop-blur rounded overflow-hidden min-w-[140px]">
                      {qualities.map((q) => (
                        <button
                          key={q.url}
                          onClick={() => switchQuality(q.url)}
                          className={`block w-full text-left text-[11px] px-3 py-2 transition-colors ${
                            q.url === mp4Url
                              ? 'text-accent bg-white/10'
                              : 'text-white/80 hover:bg-white/10'
                          }`}
                        >
                          {q.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white/50 text-sm">読み込みに失敗しました</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl shadow-black/50 cursor-pointer group"
      onClick={handlePlay}
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
        <p className="text-white/80 text-sm font-medium">サンプル動画を再生</p>
      </div>
    </div>
  );
}
