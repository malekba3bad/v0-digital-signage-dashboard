import { Countdown } from './Countdown';
import { ClockDate } from './ClockDate';
import Image from 'next/image';


/** شعار وزارة التربية والتعليم — SVG مُضمّن */
function MinistryLogo() {
  return (
    <Image
      src="/logo.png"
      alt="شعار وزارة التربية والتعليم"
      width={50}
      height={50}
      className="flex-shrink-0 drop-shadow-lg"
    />
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
