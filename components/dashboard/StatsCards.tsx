'use client';

import { useEffect, useState } from 'react';
import { Users, GraduationCap, School, CheckCircle } from 'lucide-react';
import { Stat } from '@/data/stats';

interface StatsCardsProps {
  stats: Stat[];
}

const iconMap = { Users, GraduationCap, School, CheckCircle };

const colorMap: Record<string, { icon: string; iconBg: string }> = {
  blue: {
    icon: '#1976D2',
    iconBg: '#eff6ff',
  },
  emerald: {
    icon: '#2D6B2D',
    iconBg: '#f0fdf4',
  },
  purple: {
    icon: '#8B6914',
    iconBg: '#fefce8',
  },
  amber: {
    icon: '#C8A84B',
    iconBg: '#fefce8',
  },
};

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export function StatsCards({ stats }: StatsCardsProps) {
  const [displayValues, setDisplayValues] = useState<Record<string, number>>({});
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;

    const initial: Record<string, number> = {};
    stats.forEach((s) => { initial[s.id] = 0; });
    setDisplayValues(initial);

    const duration = 2200;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const easedT = easeOutQuart(t);

      const newValues: Record<string, number> = {};
      stats.forEach((s) => { newValues[s.id] = Math.floor(s.value * easedT); });
      setDisplayValues(newValues);

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        const finalValues: Record<string, number> = {};
        stats.forEach((s) => { finalValues[s.id] = s.value; });
        setDisplayValues(finalValues);
        setHasAnimated(true);
      }
    };
    const rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [stats, hasAnimated]);

  return (
    <div className="grid grid-cols-2 gap-2 h-full content-start">
      {stats.map((stat, i) => {
        const IconComponent = iconMap[stat.icon as keyof typeof iconMap] || Users;
        const displayValue = displayValues[stat.id] ?? 0;
        const colors = colorMap[stat.color] ?? colorMap.amber;

        return (
          <div
            key={stat.id}
            className="rounded-xl transition-all duration-300 flex flex-col justify-between bg-white"
            style={{
              border: '1px solid rgba(200,168,75,0.4)',
              boxShadow: '0 2px 10px rgba(200,168,75,0.08)',
              padding: '10px 12px',
              animationDelay: `${i * 100}ms`,
              minHeight: '80px',
            }}
          >
            {/* Header: Value + Icon */}
            <div className="flex items-center justify-between mb-1">
              <div
                className="font-black tabular-nums leading-none"
                style={{
                  fontSize: '1.7rem',
                  color: '#2D1A00',
                }}
              >
                {displayValue.toLocaleString('ar-SA')}
              </div>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: colors.iconBg }}
              >
                <IconComponent className="w-4 h-4" style={{ color: colors.icon }} />
              </div>
            </div>

            {/* Footer: Title + Unit */}
            <div className="text-start">
              <div
                className="text-lg font-bold leading-tight"
                style={{ color: '#6B5B3E' }}
              >
                {stat.titleAr}
              </div>
              <div
                className="text-[10px] font-semibold mt-0.5"
                style={{ color: colors.icon, opacity: 0.9 }}
              >
                {stat.unit}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
