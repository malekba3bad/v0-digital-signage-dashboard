export interface Event {
  id: string;
  titleAr: string;
  /** تاريخ الفعالية — استخدم صيغة ISO: 'YYYY-MM-DD' */
  date: string;
  dateAr: string;
  locationAr: string;
}

export const events: Event[] = [
  {
    id: 'event-1',
    titleAr: 'جائزة حضرموت للمعلم المتميز',
    date: '2026-06-15',
    dateAr: '١٥ يونيو ٢٠٢٦',
    locationAr: 'المكلا',
  },
  {
    id: 'event-2',
    titleAr: 'دورة تطوير المحتوى الرقمي للاعلام التربوي',
    date: '2026-06-20',
    dateAr: '٢٠ يونيو ٢٠٢٦',
    locationAr: 'مركز التدريب التربوي',
  },
  // {
  //   id: 'event-3',
  //   titleAr: 'اجتماع قادة المدارس والمشرفين',
  //   date: '2026-06-28',
  //   dateAr: '٢٨ يونيو ٢٠٢٦',
  //   locationAr: 'قاعة الاجتماعات الرئيسية',
  // },
  // {
  //   id: 'event-4',
  //   titleAr: 'الحفل الختامي للعام الدراسي',
  //   date: '2026-06-30',
  //   dateAr: '٣٠ يونيو ٢٠٢٦',
  //   locationAr: 'الصالة الرياضية المركزية',
  // },
];
