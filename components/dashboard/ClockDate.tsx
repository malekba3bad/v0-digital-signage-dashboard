'use client';

import { useState, useEffect } from 'react';
import { dashboardConfig } from '@/data/config';

const DAY_NAMES = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const MONTH_NAMES = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

function getHijriDate(): string {
  try {
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
  } catch {
    return '';
  }
}

export function ClockDate() {
  const [time, setTime] = useState('');
  const [gregorianDate, setGregorianDate] = useState('');
  const [hijriDate, setHijriDate] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTime(`${hours}:${minutes}:${seconds}`);

      const day = DAY_NAMES[now.getDay()];
      const date = now.getDate();
      const month = MONTH_NAMES[now.getMonth()];
      const year = now.getFullYear();
      setGregorianDate(`${day}  ${date} ${month} ${year}`);
      setHijriDate(getHijriDate());
    };

    updateClock();
    const interval = setInterval(updateClock, dashboardConfig.clockUpdateIntervalMs);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-start gap-0.5" dir="ltr">
      {/* الساعة */}
      <div
        className="font-black font-mono leading-none tabular-nums"
        style={{
          fontSize: '2.8rem',
          background: 'linear-gradient(135deg, #ffffff, #c7d2fe)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: 'none',
          filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.4))',
        }}
      >
        {time}
      </div>
      {/* التاريخ الميلادي */}
      <div className="text-sm text-slate-300 font-medium">{gregorianDate}</div>
      {/* التاريخ الهجري */}
      {hijriDate && (
        <div
          className="text-xs font-semibold"
          style={{
            background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {hijriDate}
        </div>
      )}
    </div>
  );
}
