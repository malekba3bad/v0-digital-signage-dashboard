'use client';

import { useState, useEffect } from 'react';
import { dashboardConfig } from '@/data/config';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function Countdown() {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const targetDate = new Date(dashboardConfig.examDate);
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, []);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-yellow-500 text-slate-900 rounded-lg px-4 py-3 min-w-20">
        <div className="text-4xl font-bold">{String(value).padStart(2, '0')}</div>
      </div>
      <div className="text-yellow-400 text-sm font-semibold mt-2">{label}</div>
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      <div className="text-2xl font-bold text-yellow-400 mb-4">متبقي على اختبارات نهاية العام</div>
      <div className="flex gap-4 items-end">
        <TimeBlock value={timeRemaining.days} label="أيام" />
        <TimeBlock value={timeRemaining.hours} label="ساعات" />
        <TimeBlock value={timeRemaining.minutes} label="دقائق" />
        <TimeBlock value={timeRemaining.seconds} label="ثوانٍ" />
      </div>
    </div>
  );
}
