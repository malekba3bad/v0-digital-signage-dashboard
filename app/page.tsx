'use client';

import { useEffect, useState } from 'react';
import { HeaderBar } from '@/components/dashboard/HeaderBar';
import { NewsSlider } from '@/components/dashboard/NewsSlider';
import { SidebarWidgets } from '@/components/dashboard/SidebarWidgets';
import { Ticker } from '@/components/dashboard/Ticker';
import { FullscreenButton } from '@/components/dashboard/FullscreenButton';
import { newsItems } from '@/data/news';
import { events } from '@/data/events';
import { stats } from '@/data/stats';
import { dashboardConfig } from '@/data/config';

function useNightDimming() {
  const [isDimmed, setIsDimmed] = useState(false);

  useEffect(() => {
    const check = () => {
      const hour = new Date().getHours();
      const { startHour, endHour, enabled } = dashboardConfig.nightDimming;
      if (!enabled) { setIsDimmed(false); return; }
      const dimmed = hour >= startHour || hour < endHour;
      setIsDimmed(dimmed);
    };
    check();
    const interval = setInterval(check, 60_000);
    return () => clearInterval(interval);
  }, []);

  return isDimmed;
}

export default function Dashboard() {
  const isDimmed = useNightDimming();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div
      className="w-screen h-screen flex flex-col overflow-hidden transition-opacity duration-[2000ms] relative"
      style={{
        background: '#FDF8F0',
        opacity: isDimmed ? dashboardConfig.nightDimming.opacity : 1,
      }}
      dir="rtl"
    >
      {/* Decorative warm golden orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-10%', right: '-5%',
          width: '45vw', height: '45vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,168,75,0.12) 0%, transparent 70%)',
          animation: 'float-orb 8s ease-in-out infinite',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '5%', left: '-8%',
          width: '40vw', height: '40vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(254,46,40,0.06) 0%, transparent 70%)',
          animation: 'float-orb 10s ease-in-out infinite reverse',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: '30%', left: '35%',
          width: '30vw', height: '30vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,168,75,0.07) 0%, transparent 70%)',
          animation: 'float-orb 12s ease-in-out infinite 2s',
        }}
      />

      {/* Fullscreen Button */}
      <FullscreenButton />

      {/* Header */}
      <HeaderBar />

      {/* Main Content Area */}
      <main className="flex-1 flex gap-4 px-4 pb-3 pt-3 overflow-hidden relative z-10">
        {/* News Slider (63%) */}
        <div className="flex-1 min-w-0">
          <NewsSlider items={newsItems} />
        </div>

        {/* Sidebar (37%) */}
        <div className="w-[36%] flex-shrink-0">
          <SidebarWidgets events={events} stats={stats} />
        </div>
      </main>

      {/* Footer Ticker */}
      <Ticker />
    </div>
  );
}
