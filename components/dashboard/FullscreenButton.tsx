'use client';

import { useState, useEffect, useCallback } from 'react';

function IconFullscreen() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="w-5 h-5">
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

function IconExitFullscreen() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="w-5 h-5">
      <path d="M8 3v3a2 2 0 0 1-2 2H3" />
      <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
      <path d="M3 16h3a2 2 0 0 1 2 2v3" />
      <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

export function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  /* تتبع حالة ملء الشاشة عبر حدث المتصفح — أكثر موثوقية من الـ state اليدوي */
  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      document.body.style.cursor = document.fullscreenElement ? 'none' : 'auto';
    };
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen request failed:', err);
    }
  }, []);

  return (
    <button
      id="fullscreen-toggle-btn"
      onClick={toggleFullscreen}
      title={isFullscreen ? 'خروج من ملء الشاشة' : 'ملء الشاشة'}
      className="absolute top-3 left-3 z-50 flex items-center justify-center w-9 h-9 rounded-lg
        bg-slate-700/60 hover:bg-yellow-500/20 border border-yellow-500/30 hover:border-yellow-400/60
        text-yellow-400/70 hover:text-yellow-300
        transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
    >
      {isFullscreen ? <IconExitFullscreen /> : <IconFullscreen />}
    </button>
  );
}
