import { Calendar, MapPin } from 'lucide-react';
import { Event } from '@/data/events';
import { Card } from '@/components/ui/card';

interface EventsListProps {
  events: Event[];
}

export function EventsList({ events }: EventsListProps) {
  return (
    <div className="flex flex-col h-full">
      <h3 className="text-2xl font-bold text-white mb-4 text-end">الفعاليات والمسابقات القادمة</h3>
      <div className="flex flex-col gap-3 overflow-y-auto">
        {events.map((event) => (
          <Card key={event.id} className="bg-gradient-to-l from-yellow-500/10 to-transparent border-yellow-500/50 p-4 hover:border-yellow-500 transition-colors">
            <div className="flex items-start gap-4">
              <div className="flex-1 text-end">
                <h4 className="text-xl font-bold text-white mb-2">{event.titleAr}</h4>
                <div className="flex items-center gap-2 text-gray-300 mb-1 justify-end">
                  <span>{event.dateAr}</span>
                  <Calendar className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="flex items-center gap-2 text-gray-300 justify-end">
                  <span>{event.locationAr}</span>
                  <MapPin className="w-4 h-4 text-yellow-400" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
