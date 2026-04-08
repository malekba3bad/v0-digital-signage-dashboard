import { Countdown } from './Countdown';
import { ClockDate } from './ClockDate';

/** شعار وزارة التربية والتعليم — SVG مُضمّن */
function MinistryLogo() {
  return (
    <div className="flex flex-col items-center gap-1 flex-shrink-0">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 80 80"
        className="w-14 h-14 drop-shadow-lg"
        aria-label="شعار وزارة التربية والتعليم"
      >
        {/* Shield shape */}
        <path
          d="M40 4 L72 18 L72 46 C72 62 57 74 40 78 C23 74 8 62 8 46 L8 18 Z"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2.5"
        />
        {/* Inner decoration */}
        <path
          d="M40 12 L64 23 L64 45 C64 58 53 68 40 72 C27 68 16 58 16 45 L16 23 Z"
          fill="rgba(245,158,11,0.08)"
          stroke="#f59e0b"
          strokeWidth="1.5"
          strokeOpacity="0.5"
        />
        {/* Book shape */}
        <rect x="28" y="28" width="10" height="14" rx="1.5" fill="none" stroke="#fbbf24" strokeWidth="1.8" />
        <rect x="42" y="28" width="10" height="14" rx="1.5" fill="none" stroke="#fbbf24" strokeWidth="1.8" />
        <line x1="40" y1="28" x2="40" y2="42" stroke="#fbbf24" strokeWidth="1" />
        {/* Star */}
        <circle cx="40" cy="22" r="3" fill="#f59e0b" />
        {/* Bottom text line */}
        <line x1="30" y1="48" x2="50" y2="48" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.6" />
      </svg>
      <div className="text-yellow-400/60 text-xs font-bold tracking-widest">يمن</div>
    </div>
  );
}

export function HeaderBar() {
  return (
    <header className="relative bg-gradient-to-b from-slate-800 to-slate-900 border-b border-yellow-500/30 px-8 py-4 flex items-center justify-between gap-6 h-[15%] flex-shrink-0 overflow-hidden">
      {/* Subtle top glow line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-yellow-500/60 to-transparent" />

      {/* Right: Office Title + Logo */}
      <div className="flex items-center gap-4 flex-1 justify-end">
        <div className="text-end">
          <div className="text-3xl font-black text-white leading-tight">مكتب وزارة التربية والتعليم</div>
          <div className="text-xl text-yellow-400 font-bold">ساحل حضرموت</div>
        </div>
        <MinistryLogo />
      </div>

      {/* Center: Countdown */}
      <div className="flex-1 flex justify-center">
        <Countdown />
      </div>

      {/* Left: Clock and Date */}
      <div className="flex-1 flex justify-start">
        <ClockDate />
      </div>

      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />
    </header>
  );
}
