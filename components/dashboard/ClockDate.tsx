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
    <div className="flex flex-col items-start gap-0.5">
      {/* الساعة */}
      <div
        className="font-black font-mono leading-none tabular-nums"
        style={{
          fontSize: '2.8rem',
          color: '#2D1A00',
          textShadow: '0 2px 4px rgba(200,168,75,0.3)',
        }}
      >
        {time}
      </div>
      {/* التاريخ الميلادي */}
      <div className="text-sm font-bold" style={{ color: '#8B6914' }}>{gregorianDate}</div>
      {/* التاريخ الهجري */}
      {hijriDate && (
        <div
          className="text-xs font-black"
          style={{
            color: '#fe2e28',
          }}
        >
          {hijriDate}
        </div>
      )}
    </div>
  );
}
