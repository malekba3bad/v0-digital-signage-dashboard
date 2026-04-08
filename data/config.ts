export const dashboardConfig = {
  countdown: {
    // تاريخ اختبارات نهاية العام — عدّله حسب الجدول الرسمي
    date: new Date(2026, 5, 15), // 15 يونيو 2026
    label: 'متبقي على اختبارات نهاية العام',
    completedLabel: '🎓 انطلقت الاختبارات!',
  },
  imageSlideDurationMs: 30000,     // 30 ثانية لكل صورة
  clockUpdateIntervalMs: 1000,     // تحديث الساعة كل ثانية
  youtubeErrorTimeoutMs: 600000,   // 10 دقائق fallback للفيديو
  fullscreenEnabled: true,
  nightDimming: {
    enabled: true,
    startHour: 21, // 9م
    endHour: 6,    // 6ص
    opacity: 0.55,
  },
};
