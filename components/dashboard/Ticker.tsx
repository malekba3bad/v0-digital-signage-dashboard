import { CSSProperties } from 'react';

const urgentNotices = [
  'تذكير هام: آخر موعد للتسجيل في الاختبارات النهائية هو الخميس القادم',
  'إعلان: سيتم إغلاق الدوام في جميع المدارس يوم الجمعة للصيانة الدورية',
  'تنبيه: يرجى حضور الاجتماع الإداري يوم الأربعاء الساعة الثالثة عصراً',
  'إشعار: تم تأجيل اختبارات الفصل الثاني إلى الأسبوع القادم',
  'تعميم: جميع الطلاب والطالبات مطالبين باستلام شهاداتهم من المدرسة',
];

export function Ticker() {
  const scrollText = urgentNotices.join(' • ');

  return (
    <footer className="bg-red-600 text-white h-[8%] flex items-center overflow-hidden flex-shrink-0 border-t-2 border-red-700">
      <style>{`
        @keyframes scroll-rtl {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .ticker-content {
          animation: scroll-rtl 60s linear infinite;
          white-space: nowrap;
          padding-right: 100%;
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
