'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { NewsItem } from '@/data/news';
import { dashboardConfig } from '@/data/config';

interface NewsSliderProps {
  items: NewsItem[];
}

export function NewsSlider({ items }: NewsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);
  const playerRef = useRef<any>(null);
  const youtubeLoadedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const videoEndedListenerRef = useRef<boolean>(false);

  const currentItem = items[currentIndex];

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

  // Handle slide transitions
  useEffect(() => {
    if (currentItem.type === 'image') {
      // Image slides: use timer
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
        setVideoEnded(false);
      }, dashboardConfig.imageSlideDurationMs);

      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    } else {
      // YouTube slides: handled by player state changes
      setVideoEnded(false);
      videoEndedListenerRef.current = false;
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }
  }, [currentIndex, currentItem, items.length]);

  // Handle YouTube video end
  useEffect(() => {
    if (currentItem.type !== 'youtube') return;

    const checkPlayerReady = () => {
      if (window.YT?.Player && playerRef.current) {
        try {
          const onPlayerStateChange = (event: any) => {
            // State 0 = ENDED
            if (event.data === 0 && !videoEndedListenerRef.current) {
              videoEndedListenerRef.current = true;
              setVideoEnded(true);
              // Move to next slide
              setCurrentIndex((prev) => (prev + 1) % items.length);
            }
          };

          playerRef.current.addEventListener('onStateChange', onPlayerStateChange);
        } catch (e) {
          // Player not ready yet
        }
      }
    };

    checkPlayerReady();

    // Fallback timeout for videos that don't trigger completion
    timeoutRef.current = setTimeout(() => {
      if (!videoEndedListenerRef.current) {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }
    }, 600000); // 10 minutes fallback

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, currentItem, items.length]);

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
          {/* Bottom gradient overlay with title */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-end p-8">
            <h2 className="text-5xl font-bold text-white text-end max-w-3xl">{currentItem.titleAr}</h2>
          </div>
        </div>
      );
    }

    // YouTube embed
    return (
      <div className="relative w-full h-full bg-black flex items-center justify-center">
        <iframe
          ref={playerRef}
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${currentItem.youtubeVideoId}?autoplay=1&mute=1&controls=0&playsinline=1&rel=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0"
        />
        {/* Title overlay at bottom */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-8 z-10">
          <h2 className="text-5xl font-bold text-white text-end">{currentItem.titleAr}</h2>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-black rounded-lg">
      {renderContent()}

      {/* Slide indicator */}
      <div className="absolute bottom-4 start-4 flex gap-2 z-20">
        {items.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-yellow-500 w-8' : 'bg-white/40 w-2'
            }`}
          />
        ))}
      </div>

      {/* Urgent badge if applicable */}
      {currentItem.isUrgent && (
        <div className="absolute top-4 end-4 bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg z-20">
          عاجل
        </div>
      )}
    </div>
  );
}
