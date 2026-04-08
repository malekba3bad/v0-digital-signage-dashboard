'use client';

import { useEffect } from 'react';
import { HeaderBar } from '@/components/dashboard/HeaderBar';
import { NewsSlider } from '@/components/dashboard/NewsSlider';
import { SidebarWidgets } from '@/components/dashboard/SidebarWidgets';
import { Ticker } from '@/components/dashboard/Ticker';
import { FullscreenButton } from '@/components/dashboard/FullscreenButton';
import { newsItems } from '@/data/news';
import { events } from '@/data/events';
import { stats } from '@/data/stats';

export default function Dashboard() {
  useEffect(() => {
    // Set page to fullscreen optimized styles
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-slate-900 flex flex-col overflow-hidden" dir="rtl">
      {/* Fullscreen Button */}
      <FullscreenButton />

      {/* Header */}
      <HeaderBar />

      {/* Main Content Area */}
      <main className="flex-1 flex gap-6 p-6 overflow-hidden">
        {/* Left: News Slider (65%) */}
        <div className="flex-1 w-[65%]">
          <NewsSlider items={newsItems} />
        </div>

        {/* Right: Sidebar Widgets (35%) */}
        <div className="w-[35%] flex flex-col gap-6">
          <SidebarWidgets events={events} stats={stats} />
        </div>
      </main>

      {/* Footer Ticker */}
      <Ticker />
    </div>
  );
}
