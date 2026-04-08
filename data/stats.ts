export interface Stat {
  id: string;
  titleAr: string;
  value: number;
  icon: string;
}

export const stats: Stat[] = [
  {
    id: 'stat-1',
    titleAr: 'إجمالي الطلاب',
    value: 5240,
    icon: 'Users',
  },
  {
    id: 'stat-2',
    titleAr: 'الكادر التربوي',
    value: 342,
    icon: 'BookOpen',
  },
  {
    id: 'stat-3',
    titleAr: 'المشاريع المنجزة',
    value: 47,
    icon: 'CheckCircle',
  },
];
