# لوحة العرض الرقمي — نسخة الكشك الثابتة
## مكتب وزارة التربية والتعليم — ساحل حضرموت

---

## هيكل المجلد

```
/legacy-kiosk
├── index.html            ← الصفحة الرئيسية (HTML ثابت، لا إطار عمل)
├── styles.css            ← تصميم متوافق مع Android WebView
├── script.js             ← المنطق الكامل (Vanilla JS، بدون مكتبات)
├── README.md             ← هذا الملف
├── /assets
│   ├── /images
│   │   └── logo.png      ← شعار الوزارة
│   ├── /icons            ← مجلد محجوز للأيقونات المستقبلية
│   └── /fonts            ← مجلد محجوز إذا أردت خطاً محلياً
└── /data
    ├── config.json       ← إعدادات اللوحة (مؤقت الشرائح، العد التنازلي، التعتيم)
    ├── news.json         ← عناصر شريحة الأخبار / الوسائط
    ├── events.json       ← الفعاليات والمسابقات القادمة
    ├── stats.json        ← إحصائيات الإنجاز
    └── ticker.json       ← نصوص الإعلانات في الشريط السفلي
```

---

## تعديل المحتوى محلياً

جميع المحتويات موجودة في ملفات JSON داخل مجلد `/data`.
لا تحتاج إلى أي نظام بناء أو CMS أو لوحة تحكم.

### تعديل الإعدادات (`config.json`)

| الحقل | الوصف | مثال |
|-------|-------|------|
| `countdown.date` | تاريخ الهدف بصيغة ISO `YYYY-MM-DD` | `"2026-06-15"` |
| `countdown.label` | النص فوق العداد | `"متبقي على الاختبارات"` |
| `countdown.completedLabel` | النص بعد انتهاء العداد | `"🎓 انطلقت الاختبارات!"` |
| `imageSlideDurationMs` | مدة عرض كل صورة بالمللي ثانية | `30000` (30 ثانية) |
| `youtube.startFallbackMs` | الوقت الأقصى لانتظار بدء الفيديو | `30000` (30 ثانية) |
| `youtube.videoErrorFallbackMs` | وقت الانتقال عند خطأ في الفيديو | `180000` (3 دقائق) |
| `nightDimming.enabled` | تفعيل/تعطيل وضع الليل | `true` / `false` |
| `nightDimming.startHour` | ساعة بدء التعتيم (24 ساعة) | `21` (9 مساءً) |
| `nightDimming.endHour` | ساعة انتهاء التعتيم | `6` (6 صباحاً) |
| `nightDimming.opacity` | درجة الشفافية في الليل | `0.55` |

### إضافة خبر أو وسائط (`news.json`)

```json
{
  "id": "news-unique-id",
  "type": "image",
  "enabled": true,
  "titleAr": "عنوان الخبر بالعربية",
  "imageSrc": "https://example.com/image.jpg",
  "fallbackImageSrc": "assets/images/logo.png",
  "durationMs": 30000,
  "isUrgent": false,
  "order": 1
}
```

**أنواع العناصر:**
- `"type": "image"` — صورة ثابتة (يُستخدم حقل `imageSrc`)
- `"type": "youtube"` — فيديو إخباري (يُستخدم حقل `youtubeVideoId`)
- `"type": "lesson"` — درس تعليمي (يُستخدم حقل `youtubeVideoId` مع شارة مختلفة)

> **ملاحظة:** لإخفاء عنصر مؤقتاً دون حذفه، ضع `"enabled": false`.

### إضافة فعالية (`events.json`)

```json
{
  "id": "event-unique-id",
  "titleAr": "عنوان الفعالية",
  "date": "2026-07-10",
  "dateAr": "١٠ يوليو ٢٠٢٦",
  "locationAr": "قاعة الاجتماعات"
}
```

### إضافة إحصائية (`stats.json`)

```json
{
  "id": "stat-unique-id",
  "titleAr": "اسم الإحصائية",
  "value": 12345,
  "unit": "وحدة القياس",
  "icon": "users",
  "color": "blue"
}
```

**الأيقونات المتاحة:** `users` | `graduation` | `school` | `check`

**الألوان المتاحة:** `blue` | `emerald` | `purple` | `amber`

### إضافة إعلان في الشريط السفلي (`ticker.json`)

```json
["نص الإعلان الأول", "نص الإعلان الثاني"]
```

---

## سير العمل للنشر

```
تعديل ملفات JSON  →  حفظ  →  git commit  →  git push  →  Vercel ينشر تلقائياً
```

---

## النشر على Vercel كمشروع منفصل

### إعداد مشروع جديد على Vercel:

1. افتح [vercel.com](https://vercel.com) وأنشئ مشروعاً جديداً
2. اختر نفس المستودع `v0-digital-signage-dashboard`
3. في إعدادات المشروع:
   - **Root Directory:** `legacy-kiosk`
   - **Framework Preset:** `Other` (لا إطار عمل)
   - **Build Command:** *(اتركه فارغاً)*
   - **Output Directory:** `./` (أو اتركه فارغاً)
4. انقر **Deploy**

> المشروع الأصلي Next.js ومشروع الكشك الثابت يمكن نشرهما بشكل مستقل من نفس المستودع عن طريق تحديد Root Directory مختلف لكل مشروع.

---

## الميزات المُحوَّلة والمُبسَّطة

### ما تم الحفاظ عليه بالكامل

| الميزة | النسخة الأصلية | النسخة الثابتة |
|--------|---------|---------|
| هيكل اللوحة | React Components | HTML ثابت + JS |
| تصميم الهوية البصرية | Tailwind CSS | CSS متوافق مخصص |
| الساعة والتاريخ | React state/effect | setInterval + DOM |
| العد التنازلي | React state | setInterval + DOM |
| إحصائيات الإنجاز | requestAnimationFrame | requestAnimationFrame |
| شريط الأخبار | CSS animation | CSS animation |
| RTL/عربي | dir="rtl" lang="ar" | dir="rtl" lang="ar" |
| وضع الليل | React hook | setInterval + style.opacity |
| زر ملء الشاشة | Fullscreen API | Fullscreen API مع vendor prefixes |
| تحميل البيانات | TypeScript modules | XHR + JSON.parse |

### ما تم التبسيط لأسباب التوافق

| الميزة | التبسيط |
|--------|--------|
| **خط Cairo** | يُحمَّل بعد تحميل الصفحة (media=print swap) مع fallback لخط النظام العربي |
| **YouTube** | يعمل عبر iframe مع 3 طبقات: YT.Player + postMessage + Fallback timer |
| **Shimmer على الشريط** | أُزيل — الشريط يستخدم CSS animation مباشر فقط |
| **Glass morphism** | أُزيل (backdrop-filter مكلف على الأجهزة القديمة) |
| **oklch colors** | استُبدلت بقيم hex/rgba مباشرة |
| **CSS nesting / :has()** | محظورة — CSS مسطح بالكامل |
| **Tailwind** | محذوف — CSS مخصص فقط |
| **Vercel Analytics** | محذوف — لا يوجد runtime backend |
| **next/font** | استُبدل بـ link media swap |

### ما يظل محفوفاً بالمخاطر على Android WebView القديم

| المخاطرة | التفاصيل |
|---------|---------|
| **Autoplay + Sound** | معظم Android WebViews تحجب التشغيل التلقائي مع صوت. إذا فشل، يتجاوز Fallback timer للشريحة التالية بعد 30 ثانية. |
| **YouTube Iframe** | بعض إصدارات WebView القديمة لا تدعم YouTube IFrame API. النظام يعود تلقائياً لعرض صورة fallback. |
| **Hijri Date** | `Intl.DateTimeFormat` مع التقويم الإسلامي غير مدعوم في WebView القديمة. النظام يعود للتاريخ الميلادي. |
| **Fullscreen API** | متاح على معظم الأجهزة لكنه قد يكون محجوزاً في بعض أوضاع الكشك. الزر يختفي عند عدم الدعم. |

---

## متطلبات الجهاز الموصى بها

- Android WebView 83+
- دقة شاشة: 1280×720 أو أعلى
- ذاكرة RAM: 1GB كحد أدنى
- اتصال إنترنت أساسي (لتحميل ملفات JSON وفيديوهات YouTube)

---

*آخر تحديث: أبريل 2026*
