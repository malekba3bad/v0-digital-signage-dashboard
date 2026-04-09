import { Countdown } from './Countdown';
import { ClockDate } from './ClockDate';
import Image from 'next/image';


/** شعار وزارة التربية والتعليم */
function MinistryLogo() {
  return (
    <Image
      src="/logo.png"
      alt="شعار وزارة التربية والتعليم"
      width={54}
      height={54}
      className="flex-shrink-0 drop-shadow-md"
    />
  );
}

export function HeaderBar() {
  return (
    <header
      className="relative flex-shrink-0 overflow-hidden"
      style={{
        height: '14%',
        background: '#FFFFFF',
        borderBottom: '3px solid #C8A84B',
        boxShadow: '0 2px 20px rgba(200,168,75,0.2)',
      }}
    >
      {/* Top gold shimmer line */}
      <div
        className="absolute top-0 inset-x-0"
        style={{
          height: '3px',
          background: 'linear-gradient(90deg, #fe2e28 0%, #C8A84B 40%, #8B6914 60%, #C8A84B 80%, #fe2e28 100%)',
        }}
      />

      {/* Subtle warm inner glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(200,168,75,0.05) 0%, transparent 100%)',
        }}
      />

      {/* Three-column grid */}
      <div className="h-full grid grid-cols-3 items-center px-6 gap-4 relative z-10">

        {/* Right: Ministry title (Now first child in RTL) */}
        <div className="flex items-center justify-start gap-3">
          <MinistryLogo />
          <div className="text-start">
            <div
              className="font-black leading-tight"
              style={{
                fontSize: '1.4rem',
                color: '#2D1A00',
              }}
            >
              مكتب وزارة التربية والتعليم
            </div>
            <div
              className="text-sm font-bold mt-0.5"
              style={{
                color: '#C8A84B',
              }}
            >
             ساحل حضرموت
            </div>
          </div>
        </div>

        {/* Center: Countdown */}
        <div className="flex items-center justify-center">
          <Countdown />
        </div>

        {/* Left: Clock (Now third child in RTL) */}
        <div className="flex items-center justify-end">
          <ClockDate />
        </div>

      </div>
    </header>
  );
}
