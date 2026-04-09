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
  <div className="flex flex-col items-center gap-1">
    <div
      className="relative overflow-hidden rounded-xl min-w-[3.8rem] text-center"
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(200,168,75,0.4)',
        boxShadow: '0 2px 10px rgba(200,168,75,0.1)',
        padding: '6px 10px',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
      <div className="text-3xl font-black tabular-nums relative z-10 leading-none text-[#2D1A00]">
        {String(value).padStart(2, '0')}
      </div>
    </div>
    <div
      className="text-[10px] font-bold tracking-wider"
      style={{ color: '#8B6914' }}
    >
      {label}
    </div>
  </div>
);

const Separator = () => (
  <div
    className="text-3xl font-black mb-4 select-none"
    style={{
      background: 'linear-gradient(180deg, #C8A84B, #8B6914)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      animation: 'pulse 1.2s ease-in-out infinite',
    }}
  >
    :
  </div>
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
        <div className="text-[#2D6B2D] text-xl font-bold animate-pulse">
          {dashboardConfig.countdown.completedLabel}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="text-sm font-bold tracking-wide"
        style={{ color: '#fe2e28' }}
      >
        {dashboardConfig.countdown.label}
      </div>
      <div className="flex gap-1.5 items-end">
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
