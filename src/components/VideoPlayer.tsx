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
  const [currentLabel, setCurrentLabel] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchMp4Url = useCallback(async () => {
    if (!videoUrl) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/video-url?url=${encodeURIComponent(videoUrl)}`);
      const data = await res.json();
      if (data.url) {
        setMp4Url(data.url);
        setQualities(data.qualities || []);
        // Set current quality label
        const current = data.qualities?.find((q: VideoQuality) => q.url === data.url);
        setCurrentLabel(current?.label || '');
      }
    } catch {
      // Failed
    } finally {
      setLoading(false);
    }
  }, [videoUrl]);

  const enterFullscreenLandscape = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      // Use video element's fullscreen for better mobile support
      if (video.requestFullscreen) {
        await video.requestFullscreen();
      } else if ((video as any).webkitEnterFullscreen) {
        // iOS Safari
        (video as any).webkitEnterFullscreen();
      } else if ((video as any).webkitRequestFullscreen) {
        (video as any).webkitRequestFullscreen();
      }

      // Lock to landscape
      try {
        await (screen.orientation as any).lock?.('landscape');
      } catch {
        // Not supported
      }
    } catch {
      // Fullscreen not available
    }
  }, []);

  const handlePlay = async () => {
    setPlaying(true);
    if (!mp4Url) {
      await fetchMp4Url();
    }
  };

  const switchQuality = (q: VideoQuality) => {
    const video = videoRef.current;
    const currentTime = video?.currentTime || 0;
    const wasMuted = video?.muted ?? true;
    setMp4Url(q.url);
    setCurrentLabel(q.label);
    setShowQuality(false);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = currentTime;
        videoRef.current.muted = wasMuted;
        videoRef.current.play();
      }
    }, 100);
  };

  // Auto-play muted when mp4Url is ready
  useEffect(() => {
    if (mp4Url && videoRef.current) {
      videoRef.current.muted = true;
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
      <div ref={containerRef} className="bg-black -mx-4 sm:rounded-xl sm:mx-0 overflow-hidden">
        <div className="relative w-full aspect-video">
          {loading && !mp4Url ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="w-10 h-10 border-3 border-white/20 border-t-accent rounded-full animate-spin" />
              <p className="text-white/50 text-xs ml-3">読み込み中...</p>
            </div>
          ) : mp4Url ? (
            <>
              <video
                ref={videoRef}
                src={mp4Url}
                poster={posterUrl}
                controls
                playsInline
                muted
                autoPlay
                className="w-full h-full bg-black"
              />

              {/* Quality selector + Fullscreen button overlay */}
              <div className="absolute top-0 right-0 z-10 flex items-start gap-1 p-2">
                {/* Quality button */}
                {qualities.length > 1 && (
                  <div className="relative">
                    <button
                      onClick={() => setShowQuality(!showQuality)}
                      className="flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-black/90 active:scale-95 transition-all"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {currentLabel || '画質'}
                    </button>
                    {showQuality && (
                      <div className="absolute top-full right-0 mt-1 bg-black/95 backdrop-blur-sm rounded-lg overflow-hidden min-w-[160px] shadow-xl border border-white/10">
                        <div className="px-3 py-1.5 text-[10px] text-white/40 border-b border-white/10">
                          画質を選択
                        </div>
                        {qualities.map((q) => (
                          <button
                            key={q.url}
                            onClick={() => switchQuality(q)}
                            className={`flex items-center justify-between w-full text-left text-xs px-3 py-2.5 transition-colors ${
                              q.url === mp4Url
                                ? 'text-accent bg-accent/10'
                                : 'text-white/80 hover:bg-white/10 active:bg-white/20'
                            }`}
                          >
                            <span>{q.label}</span>
                            {q.url === mp4Url && (
                              <svg className="w-3.5 h-3.5 text-accent" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Landscape fullscreen button (mobile) */}
                <button
                  onClick={enterFullscreenLandscape}
                  className="sm:hidden bg-black/70 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-black/90 active:scale-95 transition-all"
                  title="横向き全画面"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
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
