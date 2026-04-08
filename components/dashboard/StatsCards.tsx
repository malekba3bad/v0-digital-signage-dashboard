'use client';

import { useEffect, useState } from 'react';
import { Users, GraduationCap, School, CheckCircle } from 'lucide-react';
import { Stat } from '@/data/stats';

interface StatsCardsProps {
  stats: Stat[];
}

const iconMap = { Users, GraduationCap, School, CheckCircle };

const colorMap: Record<string, { from: string; to: string; border: string; icon: string; iconBg: string; glow: string }> = {
  blue: {
    from: 'rgba(59,130,246,0.15)',
    to: 'rgba(59,130,246,0.03)',
    border: 'rgba(59,130,246,0.25)',
    icon: '#60a5fa',
    iconBg: 'rgba(59,130,246,0.12)',
    glow: '0 0 15px rgba(59,130,246,0.1)',
  },
  emerald: {
    from: 'rgba(16,185,129,0.15)',
    to: 'rgba(16,185,129,0.03)',
    border: 'rgba(16,185,129,0.25)',
    icon: '#34d399',
    iconBg: 'rgba(16,185,129,0.12)',
    glow: '0 0 15px rgba(16,185,129,0.1)',
  },
  purple: {
    from: 'rgba(139,92,246,0.15)',
    to: 'rgba(139,92,246,0.03)',
    border: 'rgba(139,92,246,0.25)',
    icon: '#a78bfa',
    iconBg: 'rgba(139,92,246,0.12)',
    glow: '0 0 15px rgba(139,92,246,0.1)',
  },
  amber: {
    from: 'rgba(245,158,11,0.15)',
    to: 'rgba(245,158,11,0.03)',
    border: 'rgba(245,158,11,0.25)',
    icon: '#fbbf24',
    iconBg: 'rgba(245,158,11,0.12)',
    glow: '0 0 15px rgba(245,158,11,0.1)',
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
        const colors = colorMap[stat.color] ?? colorMap.blue;

        return (
          <div
            key={stat.id}
            className="rounded-xl transition-all duration-300 flex flex-col justify-between"
            style={{
              background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
              border: `1px solid ${colors.border}`,
              boxShadow: colors.glow,
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
                  fontSize: '1.4rem',
                  color: '#ffffff',
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
            <div className="text-end">
              <div
                className="text-xs font-bold leading-tight"
                style={{ color: '#cbd5e1' }}
              >
                {stat.titleAr}
              </div>
              <div
                className="text-[10px] font-semibold mt-0.5"
                style={{ color: colors.icon, opacity: 0.8 }}
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
