export interface Event {
  id: string;
  titleAr: string;
  dateAr: string;
  locationAr: string;
}

export const events: Event[] = [
  {
    id: 'event-1',
    titleAr: 'مسابقة الروبوتيكس الإقليمية',
    dateAr: '١٥ يونيو ٢٠٢٤',
    locationAr: 'مقر الوزارة - المكلا',
  },
  {
    id: 'event-2',
    titleAr: 'ورشة تطوير المهارات الرقمية',
    dateAr: '٢٠ يونيو ٢٠٢٤',
    locationAr: 'مركز التدريب التربوي',
  },
  {
    id: 'event-3',
    titleAr: 'اجتماع قادة المدارس والمشرفين',
    dateAr: '٢٨ يونيو ٢٠٢٤',
    locationAr: 'قاعة الاجتماعات الرئيسية',
  },
  {
    id: 'event-4',
    titleAr: 'الحفل الختامي للعام الدراسي',
    dateAr: '٣٠ يونيو ٢٠٢٤',
    locationAr: 'الصالة الرياضية المركزية',
  },
];
