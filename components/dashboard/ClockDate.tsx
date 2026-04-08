'use client';

import { useState, useEffect } from 'react';
import { dashboardConfig } from '@/data/config';

export function ClockDate() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTime(`${hours}:${minutes}:${seconds}`);

      const dayNames = [
        'الأحد',
        'الاثنين',
        'الثلاثاء',
        'الأربعاء',
        'الخميس',
        'الجمعة',
        'السبت',
      ];
      const monthNames = [
        'يناير',
        'فبراير',
        'مارس',
        'أبريل',
        'مايو',
        'يونيو',
        'يوليو',
        'أغسطس',
        'سبتمبر',
        'أكتوبر',
        'نوفمبر',
        'ديسمبر',
      ];

      const day = dayNames[now.getDay()];
      const date = now.getDate();
      const month = monthNames[now.getMonth()];
      const year = now.getFullYear();

      setDate(`${day} ${date} ${month} ${year}`);
    };

    updateClock();
    const interval = setInterval(updateClock, dashboardConfig.clockUpdateIntervalMs);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-end">
      <div className="text-5xl font-bold text-white font-mono mb-2">{time}</div>
      <div className="text-xl text-gray-300">{date}</div>
    </div>
  );
}
