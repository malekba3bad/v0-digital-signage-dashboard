import { tickerNotices } from '@/data/ticker';
import { Megaphone } from 'lucide-react';

export function Ticker() {
  const scrollText = tickerNotices.join('   ✦   ');

  return (
    <footer
      className="flex items-center overflow-hidden flex-shrink-0 relative"
      style={{
        height: '7%',
        background: '#8B6914', // Dark Gold
        borderTop: '2px solid #C8A84B',
      }}
    >
      {/* Shimmer line */}
      <div
        className="absolute top-0 inset-x-0 pointer-events-none z-10"
        style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
          animation: 'shimmer-slide 3s infinite linear',
        }}
      />

      {/* Label */}
      <div
        className="flex-shrink-0 h-full flex items-center gap-2.5 z-20"
        style={{
          padding: '0 18px',
          background: '#fe2e28', // Red from Yemen flag
          borderLeft: '2px solid #C8A84B',
          boxShadow: '4px 0 10px rgba(0,0,0,0.2)',
        }}
      >
        <Megaphone className="w-6 h-6 text-white animate-pulse" />
        <span className="font-black text-xl tracking-widest whitespace-nowrap text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
          إعـلان
        </span>
      </div>

      {/* Ticker scroll */}
      <style>{`
        @keyframes scroll-ltr {
          0%   { transform: translateX(-100vw); }
          100% { transform: translateX(100%); }
        }
        .ticker-content {
          animation: scroll-ltr 70s linear infinite;
          white-space: nowrap;
        }
      `}</style>

      <div className="flex-1 overflow-hidden z-10">
        <div
          className="ticker-content font-bold tracking-wider"
          style={{ fontSize: '1.25rem', color: '#FFFFFF', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
        >
          {scrollText}
        </div>
      </div>
    </footer>
  );
}
