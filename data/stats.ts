export interface Stat {
  id: string;
  titleAr: string;
  value: number;
  unit: string;
  icon: string;
  color: 'blue' | 'emerald' | 'purple' | 'amber';
}

export const stats: Stat[] = [
  {
    id: 'stat-1',
    titleAr: 'إجمالي الطلاب',
    value: 52400,
    unit: 'طالب وطالبة',
    icon: 'Users',
    color: 'blue',
  },
  {
    id: 'stat-2',
    titleAr: 'الكادر التربوي',
    value: 3420,
    unit: 'معلم ومعلمة',
    icon: 'GraduationCap',
    color: 'emerald',
  },
  {
    id: 'stat-3',
    titleAr: 'المدارس',
    value: 187,
    unit: 'مدرسة',
    icon: 'School',
    color: 'purple',
  },
  {
    id: 'stat-4',
    titleAr: 'المشاريع المنجزة',
    value: 47,
    unit: 'مشروع',
    icon: 'CheckCircle',
    color: 'amber',
  },
];
