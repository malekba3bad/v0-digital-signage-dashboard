'use client';

import { useEffect, useState } from 'react';
import { Users, GraduationCap, School, CheckCircle } from 'lucide-react';
import { Stat } from '@/data/stats';

interface StatsCardsProps {
  stats: Stat[];
}

const iconMap = {
  Users,
  GraduationCap,
  School,
  CheckCircle,
};

const colorMap: Record<string, { bg: string; border: string; icon: string; glow: string }> = {
  blue:    { bg: 'from-blue-500/10',    border: 'border-blue-500/30',    icon: 'text-blue-400',    glow: 'shadow-blue-500/20' },
  emerald: { bg: 'from-emerald-500/10', border: 'border-emerald-500/30', icon: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
  purple:  { bg: 'from-purple-500/10',  border: 'border-purple-500/30',  icon: 'text-purple-400',  glow: 'shadow-purple-500/20' },
  amber:   { bg: 'from-amber-500/10',   border: 'border-amber-500/30',   icon: 'text-amber-400',   glow: 'shadow-amber-500/20' },
};

// Easing function for smoother count-up
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

    const duration = 2500;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const easedT = easeOutQuart(t);

      const newValues: Record<string, number> = {};
      stats.forEach((s) => {
        newValues[s.id] = Math.floor(s.value * easedT);
      });
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
    <div className="flex flex-col h-full">
      {/* Section header */}
      <div className="flex items-center justify-end gap-3 mb-3">
        <h3 className="text-xl font-black text-white tracking-wide">إحصائيات الإنجاز</h3>
        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-blue-400" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {stats.map((stat) => {
          const IconComponent = iconMap[stat.icon as keyof typeof iconMap] || Users;
          const displayValue = displayValues[stat.id] ?? 0;
          const colors = colorMap[stat.color] ?? colorMap.blue;

          return (
            <div
              key={stat.id}
              className={`rounded-xl border bg-gradient-to-br ${colors.bg} to-slate-800/60 ${colors.border} p-3.5 shadow-sm ${colors.glow}`}
            >
              <div className="flex flex-col items-end gap-1.5">
                <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center`}>
                  <IconComponent className={`w-4 h-4 ${colors.icon}`} />
                </div>
                <div className="text-2xl font-black text-white tabular-nums leading-none">
                  {displayValue.toLocaleString('ar-SA')}
                </div>
                <div className="text-xs text-slate-300 font-semibold text-end leading-tight">
                  {stat.titleAr}
                </div>
                <div className={`text-xs ${colors.icon} opacity-70`}>
                  {stat.unit}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
