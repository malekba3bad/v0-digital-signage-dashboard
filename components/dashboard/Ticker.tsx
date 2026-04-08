import { tickerNotices } from '@/data/ticker';
import { Megaphone } from 'lucide-react';

export function Ticker() {
  const scrollText = tickerNotices.join('   ✦   ');

  return (
    <footer
      className="flex items-center overflow-hidden flex-shrink-0 relative"
      style={{
        height: '7%',
        background: 'linear-gradient(90deg, #312e81 0%, #4c1d95 20%, #4338ca 50%, #4c1d95 80%, #312e81 100%)',
        borderTop: '1px solid rgba(139,92,246,0.4)',
      }}
    >
      {/* Shimmer line */}
      <div
        className="absolute top-0 inset-x-0 pointer-events-none"
        style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.6), rgba(245,158,11,0.5), rgba(167,139,250,0.6), transparent)',
        }}
      />

      {/* Label */}
      <div
        className="flex-shrink-0 h-full flex items-center gap-2.5 z-10"
        style={{
          padding: '0 18px',
          background: 'rgba(0,0,0,0.3)',
          borderLeft: '1px solid rgba(139,92,246,0.3)',
        }}
      >
        <Megaphone className="w-5 h-5 text-amber-300 animate-pulse" />
        <span className="font-black text-lg tracking-widest whitespace-nowrap text-white">
          إعـلان
        </span>
      </div>

      {/* Ticker scroll */}
      <style>{`
        @keyframes scroll-rtl {
          0%   { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
        .ticker-content {
          animation: scroll-rtl 70s linear infinite;
          white-space: nowrap;
        }
      `}</style>

      <div className="flex-1 overflow-hidden">
        <div
          className="ticker-content font-bold tracking-wider"
          style={{ fontSize: '1.1rem', color: '#e2e8f0' }}
        >
          {scrollText}
        </div>
      </div>
    </footer>
  );
}
