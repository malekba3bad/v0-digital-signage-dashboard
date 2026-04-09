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
    type: 'youtube',
    id: 'news-1',
    titleAr: 'اجتماع تربية ساحل حضرموت مع برنامج الغذاء العالمي',
    youtubeVideoId: '4GHGwcAnVTc',
    isUrgent: false,
  },
  {
    type: 'youtube',
    id: 'news-2',
    titleAr: 'اجتماع اللجنة الإشرافية الفرعية للاختبارات بساحل حضرموت',
    youtubeVideoId: 'pUu5sb73igA',
    isUrgent: false,
  },
  {
    type: 'image',
    id: 'news-3',
    titleAr: 'مكتب تربية ساحل حضرموت يناقش مشروع تطوير قدرات الموجهين التربويين المقدم من مؤسسة حضرموت تنمية بشرية',
    imageSrc: 'https://meoh.gov.ye/wp-content/uploads/2026/03/IMG-20260330-WA0039.jpg',
    isUrgent: false,
  },
  {
    type: 'youtube',
    id: 'news-4',
    titleAr: 'مدير تربية ساحل حضرموت يطلع على سير الدراسة في عدد من مدارس وثانويات منطقة ربوة خلف بمديرية المكلا',
    youtubeVideoId: '9KMic2hIz9c',
    isUrgent: false,
  },
  {
    type: 'youtube',
    id: 'news-5',
    titleAr: 'مدير تربية ساحل حضرموت يتفقد أضرار المنخفض الجوي بمدرسة ابن الهيثم بمنطقة ربوة خلف بمديرية المكلا',
    youtubeVideoId: '9KMic2hIz9c',
    isUrgent: true,
  },
];
