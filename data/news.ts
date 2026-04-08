export type NewsItem =
  | {
      type: 'image';
      id: string;
      titleAr: string;
      imageSrc: string;
      youtubeVideoId?: never;
      isUrgent?: boolean;
    }
  | {
      type: 'youtube';
      id: string;
      titleAr: string;
      youtubeVideoId: string;
      imageSrc?: never;
      isUrgent?: boolean;
    };

export const newsItems: NewsItem[] = [
  {
    type: 'image',
    id: 'news-1',
    titleAr: 'اختتام فعاليات اليوم الوطني بحضرموت',
    imageSrc: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&h=1080&fit=crop',
    isUrgent: false,
  },
  {
    type: 'youtube',
    id: 'news-2',
    titleAr: 'شرح المنهج الجديد للسنة الدراسية',
    youtubeVideoId: 'dQw4w9WgXcQ',
    isUrgent: false,
  },
  {
    type: 'image',
    id: 'news-3',
    titleAr: 'تدشين مركز التعليم الرقمي الحديث',
    imageSrc: 'https://images.unsplash.com/photo-1554744512-d2c143f8c00e?w=1920&h=1080&fit=crop',
    isUrgent: false,
  },
  {
    type: 'image',
    id: 'news-4',
    titleAr: 'برنامج تطوير المعلمين والمعلمات',
    imageSrc: 'https://images.unsplash.com/photo-1427504494785-f39f23fe6f6e?w=1920&h=1080&fit=crop',
    isUrgent: false,
  },
  {
    type: 'youtube',
    id: 'news-5',
    titleAr: 'إرشادات الاختبارات النهائية',
    youtubeVideoId: 'jNQXAC9IVRw',
    isUrgent: true,
  },
];
