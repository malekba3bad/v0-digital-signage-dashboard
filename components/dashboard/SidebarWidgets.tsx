'use client';

import { Event } from '@/data/events';
import { Stat } from '@/data/stats';
import { EventsList } from './EventsList';
import { StatsCards } from './StatsCards';
import { Calendar, BarChart3 } from 'lucide-react';

interface SidebarWidgetsProps {
  events: Event[];
  stats: Stat[];
}

function SectionHeader({
  icon: Icon,
  title,
  accent,
}: {
  icon: React.ElementType;
  title: string;
  accent: string;
}) {
  return (
    <div className="flex items-center justify-start gap-2.5 flex-shrink-0" style={{ marginBottom: '8px' }}>
      <span
        className="text-sm font-black tracking-wide"
        style={{ color: '#fe2e28' }}
      >
        {title}
      </span>
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: accent }}
      >
        <Icon size={14} color="#fff" />
      </div>
    </div>
  );
}

export function SidebarWidgets({ events, stats }: SidebarWidgetsProps) {
  return (
    <aside
      className="flex flex-col h-full overflow-hidden"
      style={{ gap: '10px' }}
    >
      {/* ===== Events Section (55%) ===== */}
      <div
        className="flex flex-col overflow-hidden rounded-2xl"
        style={{
          flex: '55 1 0',
          background: '#FFFFFF',
          border: '1px solid rgba(200,168,75,0.3)',
          boxShadow: '0 2px 16px rgba(200,168,75,0.1)',
          padding: '12px',
        }}
      >
        <SectionHeader
          icon={Calendar}
          title="الفعاليات والمسابقات القادمة"
          accent="#C8A84B"
        />
        <div className="flex-1 overflow-hidden">
          <EventsList events={events} />
        </div>
      </div>

      {/* ===== Stats Section (45%) ===== */}
      <div
        className="flex flex-col overflow-hidden rounded-2xl"
        style={{
          flex: '45 1 0',
          background: '#FFFFFF',
          border: '1px solid rgba(200,168,75,0.3)',
          boxShadow: '0 2px 16px rgba(200,168,75,0.1)',
          padding: '12px',
        }}
      >
        <SectionHeader
          icon={BarChart3}
          title="إحصائيات الإنجاز"
          accent="#fe2e28"
        />
        <div className="flex-1 overflow-hidden">
          <StatsCards stats={stats} />
        </div>
      </div>
    </aside>
  );
}
