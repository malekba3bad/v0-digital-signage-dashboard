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
    const interval = setInterval(check, 60_000); // فحص كل دقيقة
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
      className="w-screen h-screen bg-slate-900 flex flex-col overflow-hidden transition-opacity duration-[2000ms]"
      style={{ opacity: isDimmed ? dashboardConfig.nightDimming.opacity : 1 }}
      dir="rtl"
    >
      {/* Fullscreen Button */}
      <FullscreenButton />

      {/* Header */}
      <HeaderBar />

      {/* Main Content Area */}
      <main className="flex-1 flex gap-5 p-5 overflow-hidden">
        {/* News Slider (65%) */}
        <div className="flex-1 min-w-0">
          <NewsSlider items={newsItems} />
        </div>

        {/* Sidebar (35%) */}
        <div className="w-[34%] flex-shrink-0">
          <SidebarWidgets events={events} stats={stats} />
        </div>
      </main>

      {/* Footer Ticker */}
      <Ticker />
    </div>
  );
}
