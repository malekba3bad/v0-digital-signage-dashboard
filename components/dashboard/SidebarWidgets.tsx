import { Event } from '@/data/events';
import { Stat } from '@/data/stats';
import { EventsList } from './EventsList';
import { StatsCards } from './StatsCards';

interface SidebarWidgetsProps {
  events: Event[];
  stats: Stat[];
}

export function SidebarWidgets({ events, stats }: SidebarWidgetsProps) {
  return (
    <aside className="w-[35%] flex flex-col gap-6 overflow-hidden">
      {/* Events Section */}
      <div className="flex-1 overflow-hidden">
        <EventsList events={events} />
      </div>

      {/* Stats Section */}
      <div className="flex-1 overflow-hidden">
        <StatsCards stats={stats} />
      </div>
    </aside>
  );
}
