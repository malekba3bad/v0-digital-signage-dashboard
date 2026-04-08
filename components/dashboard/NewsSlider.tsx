'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { NewsItem } from '@/data/news';
import { dashboardConfig } from '@/data/config';

interface NewsSliderProps {
  items: NewsItem[];
}

export function NewsSlider({ items }: NewsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const playerRef = useRef<HTMLIFrameElement | null>(null);
  const youtubeLoadedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoEndedListenerRef = useRef<boolean>(false);

  const currentItem = items[currentIndex];

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  }, []);

  const goToNext = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
      setProgress(0);
      setIsVisible(true);
    }, 500); // مدة تأثير Fade
  }, [items.length]);

  // Load YouTube API
  useEffect(() => {
    if (youtubeLoadedRef.current) return;

    window.onYouTubeIframeAPIReady = () => {
      youtubeLoadedRef.current = true;
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }
  }, []);

  // Handle slide transitions + progress bar
  useEffect(() => {
    clearTimers();
    videoEndedListenerRef.current = false;

    if (currentItem.type === 'image') {
      // Progress bar animation
      const duration = dashboardConfig.imageSlideDurationMs;
      const step = 100 / (duration / 100);
      let currentProgress = 0;

      progressIntervalRef.current = setInterval(() => {
        currentProgress += step;
        setProgress(Math.min(currentProgress, 100));
      }, 100);

      // Auto-advance after duration
      timeoutRef.current = setTimeout(goToNext, duration);
    } else {
      // YouTube: no timed progress — fallback after 10 minutes
      setProgress(0);
      timeoutRef.current = setTimeout(goToNext, dashboardConfig.youtubeErrorTimeoutMs);

      // Listen for video end via postMessage
      const handleMessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          if (data.event === 'onStateChange' && data.info === 0) {
            if (!videoEndedListenerRef.current) {
              videoEndedListenerRef.current = true;
              clearTimers();
              goToNext();
            }
          }
        } catch {
          // not a YouTube message
        }
      };
      window.addEventListener('message', handleMessage);
      return () => {
        clearTimers();
        window.removeEventListener('message', handleMessage);
      };
    }

    return clearTimers;
  }, [currentIndex, currentItem.type, clearTimers, goToNext]);

  const renderContent = () => {
    if (currentItem.type === 'image') {
      return (
        <div className="relative w-full h-full">
          <Image
            src={currentItem.imageSrc}
            alt={currentItem.titleAr}
            fill
            className="object-cover"
            priority
          />
          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          {/* Title */}
          <div className="absolute inset-0 flex items-end p-8">
            <h2 className="text-5xl font-black text-white text-end max-w-4xl leading-tight drop-shadow-xl">
              {currentItem.titleAr}
            </h2>
          </div>
        </div>
      );
    }

    // YouTube embed with enablejsapi for postMessage events
    return (
      <div className="relative w-full h-full bg-black">
        <iframe
          ref={playerRef}
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${currentItem.youtubeVideoId}?autoplay=1&mute=1&controls=0&playsinline=1&rel=0&enablejsapi=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
        {/* Title overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 to-transparent p-8 z-10">
          <h2 className="text-5xl font-black text-white text-end drop-shadow-xl">
            {currentItem.titleAr}
          </h2>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl bg-black shadow-2xl">
      {/* Slide content with fade transition */}
      <div
        className="w-full h-full transition-opacity duration-500 ease-in-out"
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        {renderContent()}
      </div>

      {/* Progress bar */}
      {currentItem.type === 'image' && (
        <div className="absolute top-0 inset-x-0 h-1.5 bg-white/10 z-30">
          <div
            className="h-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]"
            style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
          />
        </div>
      )}

      {/* Slide dots indicator */}
      <div className="absolute bottom-5 end-6 flex gap-2 z-20">
        {items.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-yellow-400 w-8 shadow-[0_0_6px_rgba(250,204,21,0.8)]'
                : 'bg-white/30 w-2'
            }`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-5 start-6 z-20 text-white/60 text-sm font-mono">
        {currentIndex + 1} / {items.length}
      </div>

      {/* Urgent badge — with pulse */}
      {currentItem.isUrgent && (
        <div className="absolute top-5 end-5 z-30 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </span>
          <div className="bg-red-600 text-white px-4 py-2 rounded-xl font-black text-lg shadow-lg shadow-red-600/40 tracking-wider">
            عـاجل
          </div>
        </div>
      )}
    </div>
  );
}
