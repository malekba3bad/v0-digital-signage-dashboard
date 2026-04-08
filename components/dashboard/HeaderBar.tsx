import { Countdown } from './Countdown';
import { ClockDate } from './ClockDate';

/** شعار وزارة التربية والتعليم — SVG مُضمّن */
function MinistryLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 80 80"
      className="w-12 h-12 flex-shrink-0 drop-shadow-lg"
      aria-label="شعار وزارة التربية والتعليم"
    >
      <path d="M40 4 L72 18 L72 46 C72 62 57 74 40 78 C23 74 8 62 8 46 L8 18 Z"
        fill="none" stroke="#f59e0b" strokeWidth="2.5" />
      <path d="M40 12 L64 23 L64 45 C64 58 53 68 40 72 C27 68 16 58 16 45 L16 23 Z"
        fill="rgba(245,158,11,0.08)" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.5" />
      <rect x="28" y="28" width="10" height="14" rx="1.5" fill="none" stroke="#fbbf24" strokeWidth="1.8" />
      <rect x="42" y="28" width="10" height="14" rx="1.5" fill="none" stroke="#fbbf24" strokeWidth="1.8" />
      <line x1="40" y1="28" x2="40" y2="42" stroke="#fbbf24" strokeWidth="1" />
      <circle cx="40" cy="22" r="3" fill="#f59e0b" />
      <line x1="30" y1="48" x2="50" y2="48" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.6" />
    </svg>
  );
}

export function HeaderBar() {
  return (
    <header
      className="relative bg-gradient-to-b from-slate-800 to-slate-900 border-b border-yellow-500/25 h-[15%] flex-shrink-0 overflow-hidden"
      /* نضع dir=ltr هنا فقط لنتحكم بالترتيب يدوياً داخل كل عمود */
      dir="ltr"
    >
      {/* Top glow line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-yellow-500/60 to-transparent" />
      {/* Bottom glow line */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />

      {/* Grid ثلاثي متساوي — LTR: [يسار=ساعة] [وسط=عداد] [يمين=عنوان] */}
      <div className="h-full grid grid-cols-3 items-center px-8 gap-4">

        {/* العمود الأيسر (فيزيائياً) = الساعة والتاريخ */}
        <div className="flex items-center justify-start">
          <ClockDate />
        </div>

        {/* العمود الأوسط = العداد التنازلي */}
        <div className="flex items-center justify-center">
          <Countdown />
        </div>

        {/* العمود الأيمن (فيزيائياً) = شعار + عنوان الوزارة */}
        <div className="flex items-center justify-end gap-4">
          {/* النص محاذاة يمين */}
          <div dir="rtl" className="text-right">
            <div className="text-[1.6rem] font-black text-white leading-tight">
              مكتب وزارة التربية والتعليم
            </div>
            <div className="text-sm text-yellow-400 font-bold tracking-wide mt-0.5">
              إدارة التعليم — ساحل حضرموت
            </div>
          </div>
          <MinistryLogo />
        </div>

      </div>
    </header>
  );
}
