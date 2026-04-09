'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { NewsItem } from '@/data/news';
import { dashboardConfig } from '@/data/config';

// ─── إعلانات أنواع YouTube IFrame API ────────────────────────────────────────
interface YTPlayerInstance {
  destroy(): void;
  getPlayerState(): number;
  getCurrentTime(): number;
  getDuration(): number;
}

interface YTPlayerOptions {
  videoId: string;
  playerVars?: Record<string, string | number>;
  events?: {
    onReady?: (e: { target: YTPlayerInstance }) => void;
    onStateChange?: (e: { data: number }) => void;
    onError?: (e: { data: number }) => void;
  };
}

declare global {
  interface Window {
    YT?: {
      Player: new (element: HTMLElement, options: YTPlayerOptions) => YTPlayerInstance;
      PlayerState: { ENDED: 0; PLAYING: 1; PAUSED: 2; BUFFERING: 3; CUED: 5 };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

// ─── ثوابت ───────────────────────────────────────────────────────────────────
const YT_STATE = { ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3 } as const;

/** مدة الـ fallback: 3 دقائق — إذا لم تشتغل أي طريقة ينتقل بعد 3 دقائق */
const FALLBACK_MS = 3 * 60 * 1000;

/** مدة عرض الصورة الثابتة */
const IMAGE_MS = dashboardConfig.imageSlideDurationMs ?? 30_000;

// ─── تحميل YouTube API مرة واحدة فقط (Singleton Promise) ─────────────────────
let ytApiReady: Promise<void> | null = null;

function loadYouTubeAPI(): Promise<void> {
  if (ytApiReady) return ytApiReady;

  ytApiReady = new Promise<void>((resolve) => {
    // API محمّلة بالفعل
    if (window.YT?.Player) {
      resolve();
      return;
    }

    // ربط callback الـ API
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };

    // حقن سكريبت يوتيوب إذا لم يكن موجوداً
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
  });

  return ytApiReady;
}

// ─── واجهة المكوّن ────────────────────────────────────────────────────────────
interface NewsSliderProps {
  items: NewsItem[];
}

// ─── المكوّن الرئيسي ──────────────────────────────────────────────────────────
export function NewsSlider({ items }: NewsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible]       = useState(true);
  const [progress, setProgress]         = useState(0);       // شريط الصور
  const [videoProgress, setVideoProgress] = useState(0);     // شريط الفيديو
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // ── refs ──────────────────────────────────────────────────────────────────
  const playerContainerRef      = useRef<HTMLDivElement | null>(null);
  const ytPlayerRef             = useRef<YTPlayerInstance | null>(null);
  const timeoutRef              = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef     = useRef<NodeJS.Timeout | null>(null);
  const videoProgressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const transitionLockRef       = useRef(false); // يمنع تشغيل goToNext مرتين
  // ref للـ goToNext دائماً محدّث — لتجنّب stale closure في YT.Player callbacks
  const goToNextRef             = useRef<() => void>(() => {});

  const currentItem = items[currentIndex];

  // ─── مسح جميع المؤقتات ────────────────────────────────────────────────────
  const clearAllTimers = useCallback(() => {
    if (timeoutRef.current)              clearTimeout(timeoutRef.current);
    if (progressIntervalRef.current)    clearInterval(progressIntervalRef.current);
    if (videoProgressIntervalRef.current) clearInterval(videoProgressIntervalRef.current);
  }, []);

  // ─── تدمير مشغّل يوتيوب الحالي بأمان ────────────────────────────────────
  const destroyYTPlayer = useCallback(() => {
    if (ytPlayerRef.current) {
      try { ytPlayerRef.current.destroy(); } catch { /* ignore */ }
      ytPlayerRef.current = null;
    }
  }, []);

  // ─── الانتقال إلى الشريحة التالية ────────────────────────────────────────
  const goToNext = useCallback(() => {
    if (transitionLockRef.current) return; // تجنّب الاستدعاء المزدوج
    transitionLockRef.current = true;

    clearAllTimers();
    destroyYTPlayer();
    setIsVisible(false);

    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
      setProgress(0);
      setVideoProgress(0);
      setIsVideoPlaying(false);
      setIsVisible(true);
      transitionLockRef.current = false;
    }, 500); // مدة تأثير التلاشي
  }, [items.length, clearAllTimers, destroyYTPlayer]);

  // مزامنة الـ ref مع أحدث نسخة من goToNext
  useEffect(() => {
    goToNextRef.current = goToNext;
  }, [goToNext]);

  // ─── إنشاء YT.Player (الطريقة الأولى — الأكثر موثوقية) ──────────────────
  const createYTPlayer = useCallback(
    async (videoId: string) => {
      try {
        await loadYouTubeAPI(); // انتظر حتى تتحمّل API يوتيوب

        // تأكّد أن الـ container ما زال موجوداً وأنه لم يتم الانتقال بعد
        if (!playerContainerRef.current || transitionLockRef.current) return;

        destroyYTPlayer();

        ytPlayerRef.current = new window.YT!.Player(playerContainerRef.current, {
          videoId,
          playerVars: {
            autoplay:       1,
            mute:           1,
            controls:       0,
            playsinline:    1,
            rel:            0,
            modestbranding: 1,
          },
          events: {
            onStateChange: (e) => {
              if (e.data === YT_STATE.PLAYING)  setIsVideoPlaying(true);
              if (e.data === YT_STATE.PAUSED)   setIsVideoPlaying(false);
              if (e.data === YT_STATE.BUFFERING) setIsVideoPlaying(false);

              // ✅ الطريقة الأولى: YT.Player callback الرسمي
              if (e.data === YT_STATE.ENDED) {
                goToNextRef.current();
              }
            },
            onError: () => {
              // عند خطأ في الفيديو: انتظر 5 ثوانٍ ثم انتقل
              setTimeout(() => goToNextRef.current(), 5_000);
            },
          },
        });

        // شريط تقدّم الفيديو (polling على getCurrentTime)
        videoProgressIntervalRef.current = setInterval(() => {
          if (!ytPlayerRef.current) return;
          try {
            const duration    = ytPlayerRef.current.getDuration();
            const currentTime = ytPlayerRef.current.getCurrentTime();
            if (duration > 0) {
              setVideoProgress((currentTime / duration) * 100);
            }
          } catch { /* ignore */ }
        }, 1_000);

      } catch {
        // إذا فشل إنشاء YT.Player تماماً، اعتمد على الـ fallback timer
        console.warn('[NewsSlider] YT.Player creation failed — relying on fallback timer');
      }
    },
    [destroyYTPlayer]
  );

  // ─── منطق كل شريحة (يعمل عند تغيير currentIndex) ────────────────────────
  useEffect(() => {
    clearAllTimers();
    transitionLockRef.current = false;

    // ────────── صورة ثابتة ──────────────────────────────────────────────────
    if (currentItem.type === 'image') {
      const step    = 100 / (IMAGE_MS / 100);
      let current   = 0;

      progressIntervalRef.current = setInterval(() => {
        current += step;
        setProgress(Math.min(current, 100));
      }, 100);

      timeoutRef.current = setTimeout(goToNext, IMAGE_MS);
      return clearAllTimers;
    }

    // ────────── فيديو يوتيوب ─────────────────────────────────────────────────
    setVideoProgress(0);
    setIsVideoPlaying(false);

    /**
     * ┌─────────────────────────────────────────────────────────────┐
     * │              الطبقات الثلاث لضمان الانتقال                  │
     * │                                                             │
     * │  1️⃣  YT.Player onStateChange    ← الأولوية الأولى (موثوق) │
     * │  2️⃣  postMessage listener       ← نسخة احتياطية            │
     * │  3️⃣  Fallback timer (3 دقائق)  ← الملاذ الأخير             │
     * └─────────────────────────────────────────────────────────────┘
     */

    // 3️⃣ الطريقة الثالثة: Fallback timer — 3 دقائق كحدّ أقصى مطلق
    timeoutRef.current = setTimeout(goToNext, FALLBACK_MS);

    // 2️⃣ الطريقة الثانية: postMessage (يدعم كلا صيغتي يوتيوب القديمة والجديدة)
    const handleMessage = (event: MessageEvent) => {
      if (typeof event.data !== 'string') return;
      try {
        const data = JSON.parse(event.data) as {
          event?: string;
          info?: number | { playerState?: number };
        };

        // الصيغة الجديدة: infoDelivery
        if (data.event === 'infoDelivery' && typeof data.info === 'object' && data.info !== null) {
          const info = data.info as { playerState?: number };
          if (info.playerState === YT_STATE.PLAYING)  setIsVideoPlaying(true);
          if (info.playerState === YT_STATE.PAUSED)   setIsVideoPlaying(false);
          if (info.playerState === YT_STATE.ENDED)    goToNext();
        }

        // الصيغة القديمة: onStateChange
        if (data.event === 'onStateChange' && typeof data.info === 'number') {
          if (data.info === YT_STATE.PLAYING) setIsVideoPlaying(true);
          if (data.info === YT_STATE.PAUSED)  setIsVideoPlaying(false);
          if (data.info === YT_STATE.ENDED)   goToNext();
        }
      } catch { /* رسالة غير يوتيوب */ }
    };

    window.addEventListener('message', handleMessage);

    // 1️⃣ الطريقة الأولى: YT.Player الرسمي (async)
    if (currentItem.youtubeVideoId) {
      createYTPlayer(currentItem.youtubeVideoId);
    }

    return () => {
      clearAllTimers();
      window.removeEventListener('message', handleMessage);
      destroyYTPlayer();
    };
  }, [currentIndex, currentItem.type, currentItem.youtubeVideoId, clearAllTimers, goToNext, createYTPlayer, destroyYTPlayer]);

  // ─── عرض المحتوى ──────────────────────────────────────────────────────────
  const renderContent = () => {
    // ────── صورة ──────────────────────────────────────────────────────────────
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex items-end p-8">
            <h2 className="text-5xl font-black text-white text-end max-w-4xl leading-tight drop-shadow-xl">
              {currentItem.titleAr}
            </h2>
          </div>
        </div>
      );
    }

    // ────── يوتيوب — YT.Player يحقن الـ iframe داخل الـ div تلقائياً ─────────
    return (
      <div className="relative w-full h-full bg-black">

        {/* الحاوية التي يحقن فيها YT.Player الـ iframe */}
        <div
          ref={playerContainerRef}
          className="absolute inset-0 w-full h-full"
        />

        {/* شريط تقدّم الفيديو (أزرق) */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-white/10 z-30">
          <div
            className="h-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)] transition-all duration-1000 ease-linear"
            style={{ width: `${videoProgress}%` }}
          />
        </div>

        {/* أيقونة انتظار / تحميل */}
        {!isVideoPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="bg-black/50 backdrop-blur-sm rounded-full p-5 animate-pulse">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* عنوان الفيديو */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 to-transparent p-8 z-10">
          <h2 className="text-5xl font-black text-white text-end drop-shadow-xl">
            {currentItem.titleAr}
          </h2>
        </div>
      </div>
    );
  };

  // ─── الواجهة الخارجية ─────────────────────────────────────────────────────
  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl bg-black shadow-2xl">

      {/* المحتوى مع تأثير تلاشي */}
      <div
        className="w-full h-full transition-opacity duration-500 ease-in-out"
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        {renderContent()}
      </div>

      {/* شريط تقدّم الصورة (أصفر) */}
      {currentItem.type === 'image' && (
        <div className="absolute top-0 inset-x-0 h-1.5 bg-white/10 z-30">
          <div
            className="h-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]"
            style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
          />
        </div>
      )}

      {/* نقاط مؤشر الشرائح */}
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

      {/* عداد الشرائح */}
      <div className="absolute bottom-5 start-6 z-20 text-white/60 text-sm font-mono">
        {currentIndex + 1} / {items.length}
      </div>

      {/* شارة نوع المحتوى */}
      <div className="absolute top-4 start-4 z-30">
        {currentItem.type === 'youtube' ? (
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-red-400 px-3 py-1.5 rounded-lg text-sm font-bold border border-red-500/30">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21.582 6.186a2.496 2.496 0 0 0-1.756-1.756C18.254 4 12 4 12 4s-6.254 0-7.826.43a2.496 2.496 0 0 0-1.756 1.756C2 7.757 2 12 2 12s0 4.243.418 5.814a2.496 2.496 0 0 0 1.756 1.756C5.746 20 12 20 12 20s6.254 0 7.826-.43a2.496 2.496 0 0 0 1.756-1.756C22 16.243 22 12 22 12s0-4.243-.418-5.814zM10 15.464V8.536L16 12l-6 3.464z" />
            </svg>
            يوتيوب
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-emerald-400 px-3 py-1.5 rounded-lg text-sm font-bold border border-emerald-500/30">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
            صورة
          </div>
        )}
      </div>

      {/* شارة عاجل */}
      {currentItem.isUrgent && (
        <div className="absolute top-4 end-4 z-30 flex items-center gap-2">
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
