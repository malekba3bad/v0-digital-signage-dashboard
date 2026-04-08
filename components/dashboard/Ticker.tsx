import { tickerNotices } from '@/data/ticker';

export function Ticker() {
  const scrollText = tickerNotices.join('   ✦   ');

  return (
    <footer className="bg-gradient-to-r from-red-800 via-red-600 to-red-800 text-white h-[8%] flex items-center overflow-hidden flex-shrink-0 border-t-2 border-red-900/80 relative">
      {/* Label */}
      <div className="flex-shrink-0 bg-red-900 h-full flex items-center px-5 gap-3 border-l-2 border-red-950 z-10">
        <span className="text-2xl">📢</span>
        <span className="font-black text-xl tracking-widest whitespace-nowrap">عـاجل</span>
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
        <div className="ticker-content text-2xl font-bold tracking-wider">
          {scrollText}
        </div>
      </div>
    </footer>
  );
}
