'use client';

import { useEffect, useState } from 'react';
import { Users, BookOpen, CheckCircle } from 'lucide-react';
import { Stat } from '@/data/stats';
import { Card } from '@/components/ui/card';

interface StatsCardsProps {
  stats: Stat[];
}

const iconMap = {
  Users: Users,
  BookOpen: BookOpen,
  CheckCircle: CheckCircle,
};

export function StatsCards({ stats }: StatsCardsProps) {
  const [displayValues, setDisplayValues] = useState<Record<string, number>>({});
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;

    // Initialize display values at 0
    const initial: Record<string, number> = {};
    stats.forEach((stat) => {
      initial[stat.id] = 0;
    });
    setDisplayValues(initial);

    // Animate count-up
    const animationDuration = 2000; // 2 seconds
    const frameCount = 60;
    const frameInterval = animationDuration / frameCount;
    let frame = 0;

    const animateInterval = setInterval(() => {
      frame++;
      const progress = frame / frameCount;

      const newValues: Record<string, number> = {};
      stats.forEach((stat) => {
        newValues[stat.id] = Math.floor(stat.value * progress);
      });
      setDisplayValues(newValues);

      if (frame >= frameCount) {
        clearInterval(animateInterval);
        const finalValues: Record<string, number> = {};
        stats.forEach((stat) => {
          finalValues[stat.id] = stat.value;
        });
        setDisplayValues(finalValues);
        setHasAnimated(true);
      }
    }, frameInterval);

    return () => clearInterval(animateInterval);
  }, [stats, hasAnimated]);

  return (
    <div className="flex flex-col h-full">
      <div className="border-t border-yellow-500/50 pt-4 mb-4" />
      <h3 className="text-2xl font-bold text-white mb-4 text-end">إحصائيات الإنجاز</h3>
      <div className="grid grid-cols-1 gap-3">
        {stats.map((stat) => {
          const IconComponent = iconMap[stat.icon as keyof typeof iconMap] || Users;
          const displayValue = displayValues[stat.id] ?? 0;

          return (
            <Card
              key={stat.id}
              className="bg-gradient-to-l from-blue-500/10 to-transparent border-blue-500/50 p-4 hover:border-blue-400 transition-colors"
            >
              <div className="flex items-center gap-4">
                <IconComponent className="w-8 h-8 text-blue-400 flex-shrink-0" />
                <div className="flex-1 text-end">
                  <div className="text-2xl font-bold text-white">{displayValue.toLocaleString('ar-SA')}</div>
                  <div className="text-sm text-gray-300">{stat.titleAr}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
