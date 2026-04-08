import { MapPin, Clock } from 'lucide-react';
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
  if (days < 0)
    return (
      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
        style={{ background: 'rgba(100,116,139,0.25)', color: '#94a3b8' }}>
        انتهت
      </span>
    );
  if (days === 0)
    return (
      <span className="text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse"
        style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399', border: '1px solid rgba(16,185,129,0.35)' }}>
        اليوم!
      </span>
    );
  if (days <= 7)
    return (
      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
        style={{ background: 'rgba(249,115,22,0.18)', color: '#fb923c', border: '1px solid rgba(249,115,22,0.3)' }}>
        {days} أيام
      </span>
    );
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
      style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.22)' }}>
      {days} يوم
    </span>
  );
}

export function EventsList({ events }: EventsListProps) {
  // Sort: upcoming first, past last
  const sorted = [...events].sort((a, b) => {
    const dA = getDaysRemaining(a.date);
    const dB = getDaysRemaining(b.date);
    if (dA < 0 && dB >= 0) return 1;
    if (dB < 0 && dA >= 0) return -1;
    return dA - dB;
  });

  return (
    <div className="flex flex-col h-full gap-2 overflow-y-auto">
      {sorted.map((event) => {
        const days = getDaysRemaining(event.date);
        const isPast = days < 0;

        return (
          <div
            key={event.id}
            className="flex items-center gap-2.5 rounded-xl flex-shrink-0"
            style={{
              padding: '8px 10px',
              ...(isPast
                ? {
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    opacity: 0.5,
                  }
                : {
                    background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(251,191,36,0.02) 100%)',
                    border: '1px solid rgba(245,158,11,0.18)',
                  }),
            }}
          >
            {/* Date mini-badge */}
            {!isPast && (
              <div
                className="flex-shrink-0 flex flex-col items-center justify-center rounded-lg text-center"
                style={{
                  width: '36px',
                  height: '40px',
                  background: 'linear-gradient(135deg, rgba(245,158,11,0.45), rgba(251,191,36,0.3))',
                  border: '1px solid rgba(245,158,11,0.28)',
                }}
              >
                <div className="text-base font-black text-amber-300 leading-none">
                  {new Date(event.date + 'T00:00:00').getDate()}
                </div>
                <div className="text-[9px] text-amber-400/80 font-bold leading-tight">
                  {new Date(event.date + 'T00:00:00').toLocaleDateString('ar', { month: 'short' })}
                </div>
              </div>
            )}

            {/* Event info */}
            <div className="flex-1 text-end min-w-0">
              <div className="flex items-center justify-end gap-1.5 mb-0.5">
                <DaysBadge days={days} />
                <h4 className="text-sm font-bold text-white leading-snug truncate">{event.titleAr}</h4>
              </div>
              <div className="flex items-center gap-1 text-slate-400 text-[11px] justify-end">
                <span className="truncate">{event.locationAr}</span>
                <MapPin className="w-2.5 h-2.5 flex-shrink-0" style={{ color: '#f59e0b88' }} />
                <span className="flex-shrink-0">{event.dateAr}</span>
                <Clock className="w-2.5 h-2.5 flex-shrink-0" style={{ color: '#f59e0b88' }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
