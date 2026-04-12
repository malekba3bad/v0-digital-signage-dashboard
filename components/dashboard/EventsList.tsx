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
        style={{ background: '#f1f5f9', color: '#64748b', border: '1px solid #cbd5e1' }}>
        انتهت
      </span>
    );
  if (days === 0)
    return (
      <span className="text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse"
        style={{ background: '#dcfce7', color: '#166534', border: '1px solid #86efac' }}>
        اليوم!
      </span>
    );
  if (days <= 7)
    return (
      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
        style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' }}>
        {days} أيام
      </span>
    );
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
      style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d' }}>
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
    <div className="flex flex-col h-full gap-2 overflow-y-auto pr-1">
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
                    background: 'rgba(255,255,255,0.6)',
                    border: '1px solid rgba(200,168,75,0.2)',
                    opacity: 0.6,
                  }
                : {
                    background: 'rgba(255,255,255,0.95)',
                    border: '1px solid rgba(200,168,75,0.4)',
                    boxShadow: '0 2px 8px rgba(200,168,75,0.08)',
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
                  background: 'linear-gradient(135deg, #FDF8F0, #FFFFFF)',
                  border: '1px solid #C8A84B',
                }}
              >
                <div className="text-base font-black space-y-0 text-[#fe2e28] leading-none">
                  {new Date(event.date + 'T00:00:00').getDate()}
                </div>
                <div className="text-[9px] text-[#8B6914] font-bold leading-tight">
                  {new Date(event.date + 'T00:00:00').toLocaleDateString('ar', { month: 'short' })}
                </div>
              </div>
            )}

            {/* Event info */}
            <div className="flex-1 text-start min-w-0">
              <div className="flex items-center justify-start gap-1.5 mb-0.5">
                <DaysBadge days={days} />
                <h4 className="text-xl font-bold leading-snug truncate" style={{ color: '#2D1A00' }}>{event.titleAr}</h4>
              </div>
              <div className="flex items-center gap-1 text-[11px] justify-start" style={{ color: '#6B5B3E' }}>
                <span className="truncate">{event.locationAr}</span>
                <MapPin className="w-2.5 h-2.5 flex-shrink-0" style={{ color: '#C8A84B' }} />
                <span className="flex-shrink-0">{event.dateAr}</span>
                <Clock className="w-2.5 h-2.5 flex-shrink-0" style={{ color: '#C8A84B' }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
