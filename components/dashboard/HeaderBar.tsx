import { Countdown } from './Countdown';
import { ClockDate } from './ClockDate';

export function HeaderBar() {
  return (
    <header className="bg-gradient-to-b from-slate-900 to-slate-800 border-b-2 border-yellow-500/50 p-6 flex items-center justify-between gap-8 h-[12%] flex-shrink-0">
      {/* Right: Office Title */}
      <div className="flex-1 flex flex-col items-end">
        <div className="text-4xl font-bold text-white mb-1">مكتب وزارة التربية والتعليم</div>
        <div className="text-2xl text-yellow-400 font-semibold">ساحل حضرموت</div>
      </div>

      {/* Center: Countdown */}
      <div className="flex-1 flex justify-center">
        <Countdown />
      </div>

      {/* Left: Clock and Date */}
      <div className="flex-1">
        <ClockDate />
      </div>
    </header>
  );
}
