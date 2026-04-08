'use client';

import { useState, useEffect } from 'react';
import { dashboardConfig } from '@/data/config';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isCompleted: boolean;
}

function calculateTimeRemaining(): TimeRemaining {
  const now = new Date();
  const targetDate = new Date(dashboardConfig.countdown.date);
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isCompleted: false,
  };
}

const TimeBlock = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="bg-yellow-500 text-slate-900 rounded-xl px-4 py-2 min-w-[4.5rem] shadow-lg shadow-yellow-500/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
      <div className="text-4xl font-black tabular-nums relative z-10">
        {String(value).padStart(2, '0')}
      </div>
    </div>
    <div className="text-yellow-400/90 text-xs font-semibold mt-1.5 tracking-wider">{label}</div>
  </div>
);

const Separator = () => (
  <div className="text-yellow-500 text-4xl font-black mb-5 animate-pulse select-none">:</div>
);

export function Countdown() {
  const [time, setTime] = useState<TimeRemaining>(calculateTimeRemaining);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(calculateTimeRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (time.isCompleted) {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="text-green-400 text-2xl font-bold animate-pulse">
          {dashboardConfig.countdown.completedLabel}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-lg font-semibold text-yellow-300/80 tracking-wide">
        {dashboardConfig.countdown.label}
      </div>
      <div className="flex gap-2 items-end">
        <TimeBlock value={time.days} label="أيام" />
        <Separator />
        <TimeBlock value={time.hours} label="ساعات" />
        <Separator />
        <TimeBlock value={time.minutes} label="دقائق" />
        <Separator />
        <TimeBlock value={time.seconds} label="ثوانٍ" />
      </div>
    </div>
  );
}
