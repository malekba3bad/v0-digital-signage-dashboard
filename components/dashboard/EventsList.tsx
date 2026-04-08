import { Calendar, MapPin, Clock } from 'lucide-react';
import { Event } from '@/data/events';

interface EventsListProps {
  events: Event[];
}

function getDaysRemaining(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function DaysBadge({ days }: { days: number }) {
  if (days < 0) {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-600/60 text-slate-400 font-semibold">
        انتهت
      </span>
    );
  }
  if (days === 0) {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-bold animate-pulse">
        اليوم!
      </span>
    );
  }
  if (days <= 7) {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-bold">
        {days} أيام
      </span>
    );
  }
  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400/80 font-semibold">
      {days} يوم
    </span>
  );
}

export function EventsList({ events }: EventsListProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Section header */}
      <div className="flex items-center justify-end gap-3 mb-3">
        <h3 className="text-xl font-black text-white tracking-wide">الفعاليات والمسابقات القادمة</h3>
        <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
          <Calendar className="w-4 h-4 text-yellow-400" />
        </div>
      </div>

      <div className="flex flex-col gap-2.5 overflow-y-auto">
        {events.map((event) => {
          const days = getDaysRemaining(event.date);
          const isPast = days < 0;
          return (
            <div
              key={event.id}
              className={`rounded-xl border p-3.5 transition-all ${
                isPast
                  ? 'bg-slate-800/40 border-slate-700/50 opacity-60'
                  : 'bg-gradient-to-l from-yellow-500/8 to-slate-800/60 border-yellow-500/30 hover:border-yellow-500/60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 text-end">
                  <div className="flex items-center justify-end gap-2 mb-1.5">
                    <DaysBadge days={days} />
                    <h4 className="text-lg font-bold text-white leading-snug">{event.titleAr}</h4>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-1 justify-end">
                    <span>{event.dateAr}</span>
                    <Clock className="w-3.5 h-3.5 text-yellow-500/70 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-sm justify-end">
                    <span>{event.locationAr}</span>
                    <MapPin className="w-3.5 h-3.5 text-yellow-500/70 flex-shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
