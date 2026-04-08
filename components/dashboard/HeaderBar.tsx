import { Countdown } from './Countdown';
import { ClockDate } from './ClockDate';

/** شعار وزارة التربية والتعليم — SVG مُضمّن */
function MinistryLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 80 80"
      className="w-11 h-11 flex-shrink-0 drop-shadow-lg"
      aria-label="شعار وزارة التربية والتعليم"
    >
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      <path d="M40 4 L72 18 L72 46 C72 62 57 74 40 78 C23 74 8 62 8 46 L8 18 Z"
        fill="none" stroke="url(#shieldGrad)" strokeWidth="2.5" />
      <path d="M40 12 L64 23 L64 45 C64 58 53 68 40 72 C27 68 16 58 16 45 L16 23 Z"
        fill="rgba(245,158,11,0.1)" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.5" />
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
      className="relative flex-shrink-0 overflow-hidden"
      style={{
        height: '14%',
        background: 'rgba(15,23,42,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(99,102,241,0.25)',
      }}
      dir="ltr"
    >
      {/* Top gradient line */}
      <div
        className="absolute top-0 inset-x-0"
        style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #6366f1, #8b5cf6, #f59e0b, transparent)',
        }}
      />

      {/* Subtle inner glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 100%)',
        }}
      />

      {/* Three-column grid */}
      <div className="h-full grid grid-cols-3 items-center px-6 gap-4 relative z-10">

        {/* Left: Clock */}
        <div className="flex items-center justify-start">
          <ClockDate />
        </div>

        {/* Center: Countdown */}
        <div className="flex items-center justify-center">
          <Countdown />
        </div>

        {/* Right: Ministry title */}
        <div className="flex items-center justify-end gap-3">
          <div dir="rtl" className="text-right">
            <div
              className="font-black leading-tight"
              style={{
                fontSize: '1.4rem',
                background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              مكتب وزارة التربية والتعليم
            </div>
            <div
              className="text-sm font-bold mt-0.5"
              style={{
                background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              إدارة التعليم — ساحل حضرموت
            </div>
          </div>
          <MinistryLogo />
        </div>

      </div>
    </header>
  );
}
