/**
 * script.js — لوحة عرض رقمية — مكتب ساحل حضرموت
 * =======================================================
 * متوافق مع Android WebView 83+ / Android TV / كشك المتصفح
 *
 * القواعد الصارمة للتوافق:
 *  - لا optional chaining (?.)
 *  - لا nullish coalescing (??)
 *  - لا top-level await
 *  - لا Class fields / private fields (#)
 *  - لا modules (ES import/export)
 *  - تُفضَّل دوال ES5/ES6 بسيطة
 *  - كود دفاعي: كل العمليات مُحاطة بـ try/catch
 */

'use strict';

// ════════════════════════════════════════════════════════════════════
// 1. الثوابت العالمية
// ════════════════════════════════════════════════════════════════════

var CONFIG = null;       // يُملأ بعد تحميل config.json
var NEWS_ITEMS = [];     // يُملأ بعد تحميل news.json
var EVENTS = [];         // يُملأ بعد تحميل events.json
var STATS = [];          // يُملأ بعد تحميل stats.json
var TICKER_NOTICES = []; // يُملأ بعد تحميل ticker.json

var DAY_NAMES = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
var MONTH_NAMES = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
                   'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

// حالة الشريحة الإجمالية
var sliderState = {
  currentIndex: 0,
  isTransitioning: false,
  progressTimer: null,
  slideTimer: null,
  videoProgressTimer: null,
  videoFallbackTimer: null
};

// حالة واجهة برمجة يوتيوب
var ytState = {
  apiReady: false,
  apiLoading: false,
  player: null
};

// ════════════════════════════════════════════════════════════════════
// 2. خدمة تحميل البيانات (JSON)
// ════════════════════════════════════════════════════════════════════

/**
 * يُحمِّل ملف JSON بشكل غير متزامن ويستدعي callback(data, error).
 * لا يستخدم Promise.all أو await — يعتمد على XHR لدعم Android WebView القديم.
 */
function loadJSON(url, callback) {
  var xhr = new XMLHttpRequest();
  try {
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200 || xhr.status === 0) {
        try {
          var data = JSON.parse(xhr.responseText);
          callback(data, null);
        } catch (e) {
          console.error('[loadJSON] خطأ في تحليل JSON:', url, e);
          callback(null, e);
        }
      } else {
        console.error('[loadJSON] فشل التحميل:', url, xhr.status);
        callback(null, new Error('HTTP ' + xhr.status));
      }
    };
    xhr.send();
  } catch (e) {
    console.error('[loadJSON] استثناء:', url, e);
    callback(null, e);
  }
}

/**
 * يُحمِّل جميع ملفات البيانات بالتسلسل ثم يُهيئ التطبيق.
 * يستخدم التسلسل (sequential) بدلاً من التوازي لتقليل الضغط على الأجهزة القديمة.
 */
function loadAllData() {
  loadJSON('data/config.json', function(data, err) {
    if (data) {
      CONFIG = data;
    } else {
      // قيم افتراضية آمنة إذا فشل تحميل الإعداد
      CONFIG = {
        countdown: { date: '2026-06-15', label: 'متبقي على الاختبارات', completedLabel: '🎓 انطلقت الاختبارات!' },
        imageSlideDurationMs: 30000,
        clockUpdateIntervalMs: 1000,
        youtube: { startFallbackMs: 30000, videoErrorFallbackMs: 180000, maxAbsoluteFallbackMs: 7200000 },
        fullscreenEnabled: true,
        nightDimming: { enabled: true, startHour: 21, endHour: 6, opacity: 0.55 }
      };
    }

    loadJSON('data/news.json', function(data2, err2) {
      if (data2 && Array.isArray(data2)) {
        // تصفية العناصر المعطلة وترتيبها
        NEWS_ITEMS = data2.filter(function(item) {
          return item.enabled !== false;
        }).sort(function(a, b) {
          return (a.order || 0) - (b.order || 0);
        });
      }

      loadJSON('data/events.json', function(data3, err3) {
        if (data3 && Array.isArray(data3)) {
          EVENTS = data3;
        }

        loadJSON('data/stats.json', function(data4, err4) {
          if (data4 && Array.isArray(data4)) {
            STATS = data4;
          }

          loadJSON('data/ticker.json', function(data5, err5) {
            if (data5 && Array.isArray(data5)) {
              TICKER_NOTICES = data5;
            }

            // جميع البيانات محملة — تهيئة التطبيق
            initApp();
          });
        });
      });
    });
  });
}

// ════════════════════════════════════════════════════════════════════
// 3. تهيئة التطبيق
// ════════════════════════════════════════════════════════════════════

function initApp() {
  try { initClock(); }          catch(e) { console.error('[initApp] خطأ في الساعة:', e); }
  try { initCountdown(); }      catch(e) { console.error('[initApp] خطأ في العداد:', e); }
  try { initNightDimming(); }   catch(e) { console.error('[initApp] خطأ في التعتيم:', e); }
  try { initFullscreenButton(); } catch(e) { console.error('[initApp] خطأ في ملء الشاشة:', e); }
  try { renderEventsList(); }   catch(e) { console.error('[initApp] خطأ في الفعاليات:', e); }
  try { renderStatsGrid(); }    catch(e) { console.error('[initApp] خطأ في الإحصائيات:', e); }
  try { initTicker(); }         catch(e) { console.error('[initApp] خطأ في شريط الأخبار:', e); }
  try { initSlider(); }         catch(e) { console.error('[initApp] خطأ في الشريحة:', e); }
}

// ════════════════════════════════════════════════════════════════════
// 4. الساعة والتاريخ
// ════════════════════════════════════════════════════════════════════

function getHijriDate() {
  try {
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date());
  } catch (e) {
    // Fallback: التاريخ الميلادي البسيط بالعربية
    try {
      var now = new Date();
      return DAY_NAMES[now.getDay()] + ' ' + now.getDate() + ' ' + MONTH_NAMES[now.getMonth()] + ' ' + now.getFullYear();
    } catch(e2) {
      return '';
    }
  }
}

function updateClock() {
  try {
    var now = new Date();
    var h = String(now.getHours()).padStart ? String(now.getHours()).padStart(2, '0') : padStart(now.getHours(), 2);
    var m = String(now.getMinutes()).padStart ? String(now.getMinutes()).padStart(2, '0') : padStart(now.getMinutes(), 2);
    var s = String(now.getSeconds()).padStart ? String(now.getSeconds()).padStart(2, '0') : padStart(now.getSeconds(), 2);

    var timeEl = document.getElementById('clock-time');
    if (timeEl) timeEl.textContent = h + ':' + m + ':' + s;

    var gregEl = document.getElementById('clock-gregorian');
    if (gregEl) {
      var day = DAY_NAMES[now.getDay()];
      gregEl.textContent = day + '  ' + now.getDate() + ' ' + MONTH_NAMES[now.getMonth()] + ' ' + now.getFullYear();
    }

    var hijriEl = document.getElementById('clock-hijri');
    if (hijriEl) {
      var hijri = getHijriDate();
      hijriEl.textContent = hijri || '';
    }
  } catch(e) {
    console.error('[updateClock]', e);
  }
}

function initClock() {
  updateClock();
  var interval = (CONFIG && CONFIG.clockUpdateIntervalMs) ? CONFIG.clockUpdateIntervalMs : 1000;
  setInterval(updateClock, interval);
}

// Fallback لـ String.padStart في متصفحات قديمة جداً
function padStart(num, length) {
  var str = String(num);
  while (str.length < length) str = '0' + str;
  return str;
}

// ════════════════════════════════════════════════════════════════════
// 5. العد التنازلي
// ════════════════════════════════════════════════════════════════════

function calcTimeRemaining() {
  try {
    var cfg = (CONFIG && CONFIG.countdown) ? CONFIG.countdown : {};
    var dateStr = cfg.date || '2026-06-15';
    var target = new Date(dateStr);
    // تعيين الوقت لمنتصف الليل لتجنب مشاكل المنطقة الزمنية
    target.setHours(0, 0, 0, 0);
    var diff = target.getTime() - Date.now();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, completed: true };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      completed: false
    };
  } catch(e) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, completed: false };
  }
}

function renderCountdown(time) {
  var container = document.getElementById('countdown-container');
  if (!container) return;

  var cfg = (CONFIG && CONFIG.countdown) ? CONFIG.countdown : {};

  if (time.completed) {
    container.innerHTML = '<div class="countdown-completed">' + (cfg.completedLabel || '🎓 اكتمل!') + '</div>';
    return;
  }

  function block(val, unit) {
    return '<div class="countdown-block">' +
      '<div class="countdown-value-box">' +
        '<span class="countdown-value">' + padStart(val, 2) + '</span>' +
      '</div>' +
      '<div class="countdown-unit">' + unit + '</div>' +
    '</div>';
  }

  var label = cfg.label || 'العد التنازلي';

  container.innerHTML =
    '<div class="countdown-label">' + escapeHtml(label) + '</div>' +
    '<div class="countdown-blocks">' +
      block(time.days, 'أيام') +
      '<span class="countdown-separator">:</span>' +
      block(time.hours, 'ساعات') +
      '<span class="countdown-separator">:</span>' +
      block(time.minutes, 'دقائق') +
      '<span class="countdown-separator">:</span>' +
      block(time.seconds, 'ثوانٍ') +
    '</div>';
}

function initCountdown() {
  var time = calcTimeRemaining();
  renderCountdown(time);
  setInterval(function() {
    try {
      var t = calcTimeRemaining();
      renderCountdown(t);
    } catch(e) {}
  }, 1000);
}

// ════════════════════════════════════════════════════════════════════
// 6. تعتيم الليل
// ════════════════════════════════════════════════════════════════════

function checkNightDimming() {
  try {
    var cfg = (CONFIG && CONFIG.nightDimming) ? CONFIG.nightDimming : {};
    if (!cfg.enabled) return;

    var appRoot = document.getElementById('app-root');
    if (!appRoot) return;

    var hour = new Date().getHours();
    var start = cfg.startHour || 21;
    var end = cfg.endHour || 6;
    var isDimmed = (hour >= start || hour < end);

    if (isDimmed) {
      appRoot.style.opacity = String(cfg.opacity || 0.55);
    } else {
      appRoot.style.opacity = '1';
    }
  } catch(e) {
    console.error('[checkNightDimming]', e);
  }
}

function initNightDimming() {
  checkNightDimming();
  setInterval(checkNightDimming, 60000);
}

// ════════════════════════════════════════════════════════════════════
// 7. زر ملء الشاشة
// ════════════════════════════════════════════════════════════════════

function initFullscreenButton() {
  var btn = document.getElementById('fullscreen-btn');
  if (!btn) return;

  // إخفاء الزر إذا كانت الميزة غير مدعومة أو غير مفعلة
  var fsEnabled = CONFIG && CONFIG.fullscreenEnabled !== false;
  var fsSupported = !!(document.documentElement.requestFullscreen ||
                       document.documentElement.webkitRequestFullscreen ||
                       document.documentElement.mozRequestFullScreen ||
                       document.documentElement.msRequestFullscreen);

  if (!fsEnabled || !fsSupported) {
    btn.style.display = 'none';
    return;
  }

  function updateBtnIcon(isFs) {
    var enterIcon = document.getElementById('fs-icon-enter');
    var exitIcon = document.getElementById('fs-icon-exit');
    if (enterIcon) enterIcon.className = isFs ? 'fs-icon fs-icon-hidden' : 'fs-icon';
    if (exitIcon)  exitIcon.className  = isFs ? 'fs-icon' : 'fs-icon fs-icon-hidden';
    btn.title = isFs ? 'خروج من ملء الشاشة' : 'ملء الشاشة';
    btn.setAttribute('aria-label', isFs ? 'إلغاء ملء الشاشة' : 'تفعيل ملء الشاشة');
    // إخفاء المؤشر في وضع ملء الشاشة
    document.body.style.cursor = isFs ? 'none' : 'auto';
  }

  function onFullscreenChange() {
    var isFs = !!(document.fullscreenElement ||
                  document.webkitFullscreenElement ||
                  document.mozFullScreenElement ||
                  document.msFullscreenElement);
    updateBtnIcon(isFs);
  }

  document.addEventListener('fullscreenchange', onFullscreenChange);
  document.addEventListener('webkitfullscreenchange', onFullscreenChange);
  document.addEventListener('mozfullscreenchange', onFullscreenChange);
  document.addEventListener('MSFullscreenChange', onFullscreenChange);

  btn.addEventListener('click', function() {
    try {
      var isFs = !!(document.fullscreenElement ||
                    document.webkitFullscreenElement ||
                    document.mozFullScreenElement ||
                    document.msFullscreenElement);

      if (!isFs) {
        var el = document.documentElement;
        if (el.requestFullscreen) {
          el.requestFullscreen();
        } else if (el.webkitRequestFullscreen) {
          el.webkitRequestFullscreen();
        } else if (el.mozRequestFullScreen) {
          el.mozRequestFullScreen();
        } else if (el.msRequestFullscreen) {
          el.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    } catch(e) {
      console.warn('[Fullscreen] فشل طلب ملء الشاشة:', e);
    }
  });

  // دعم لوحة المفاتيح / التحكم عن بعد
  btn.addEventListener('keydown', function(e) {
    if (e.keyCode === 13 || e.keyCode === 32) { // Enter أو Space
      e.preventDefault();
      btn.click();
    }
  });
}

// ════════════════════════════════════════════════════════════════════
// 8. قائمة الفعاليات
// ════════════════════════════════════════════════════════════════════

function getDaysRemaining(dateStr) {
  try {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var target = new Date(dateStr + 'T00:00:00');
    var diff = target.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  } catch(e) {
    return 0;
  }
}

function getDaysBadgeHTML(days) {
  if (days < 0)  return '<span class="days-badge badge-past">انتهت</span>';
  if (days === 0) return '<span class="days-badge badge-today">اليوم!</span>';
  if (days <= 7) return '<span class="days-badge badge-soon">' + days + ' أيام</span>';
  return '<span class="days-badge badge-upcoming">' + days + ' يوم</span>';
}

function renderEventsList() {
  var container = document.getElementById('events-list');
  if (!container) return;

  if (!EVENTS || EVENTS.length === 0) {
    container.innerHTML = '<p style="color:#8B6914;text-align:center;padding:16px;">لا توجد فعاليات مجدولة</p>';
    return;
  }

  // ترتيب: القادمة أولاً، المنتهية أخيراً
  var sorted = EVENTS.slice().sort(function(a, b) {
    var dA = getDaysRemaining(a.date);
    var dB = getDaysRemaining(b.date);
    if (dA < 0 && dB >= 0) return 1;
    if (dB < 0 && dA >= 0) return -1;
    return dA - dB;
  });

  var html = '';
  for (var i = 0; i < sorted.length; i++) {
    var ev = sorted[i];
    var days = getDaysRemaining(ev.date);
    var isPast = days < 0;
    var cardClass = isPast ? 'event-card event-card-past' : 'event-card event-card-upcoming';

    // أيقونة الدبوس (SVG مُدمج)
    var pinIcon = '<svg class="event-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
    // أيقونة الساعة
    var clockIcon = '<svg class="event-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';

    html += '<div class="' + cardClass + '">' +
      '<div class="event-info">' +
        '<div class="event-header-row">' +
          getDaysBadgeHTML(days) +
          '<h4 class="event-title">' + escapeHtml(ev.titleAr || '') + '</h4>' +
        '</div>' +
        '<div class="event-meta">' +
          '<span>' + escapeHtml(ev.locationAr || '') + '</span>' +
          pinIcon +
          '<span>' + escapeHtml(ev.dateAr || '') + '</span>' +
          clockIcon +
        '</div>' +
      '</div>' +
    '</div>';
  }

  container.innerHTML = html;
}

// ════════════════════════════════════════════════════════════════════
// 9. شبكة الإحصائيات مع أنيميشن العدّ
// ════════════════════════════════════════════════════════════════════

// خريطة أيقونات SVG المُدمجة لتجنب أي تبعية خارجية
function getStatIconSVG(icon) {
  var icons = {
    'users': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    'graduation': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
    'school': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    'check': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
  };
  return icons[icon] || icons['check'];
}

var colorMap = {
  blue:    { icon: '#1976D2', iconBg: '#eff6ff' },
  emerald: { icon: '#2D6B2D', iconBg: '#f0fdf4' },
  purple:  { icon: '#8B6914', iconBg: '#fefce8' },
  amber:   { icon: '#C8A84B', iconBg: '#fefce8' }
};

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

function formatNumber(n) {
  // تنسيق الأرقام بفواصل — استخدام toLocaleString بشكل دفاعي
  try {
    return n.toLocaleString('ar-SA');
  } catch(e) {
    try { return n.toLocaleString(); } catch(e2) { return String(n); }
  }
}

function renderStatsGrid() {
  var container = document.getElementById('stats-grid');
  if (!container) return;

  if (!STATS || STATS.length === 0) {
    container.innerHTML = '<p style="color:#8B6914;text-align:center;padding:16px;">لا توجد إحصائيات</p>';
    return;
  }

  var html = '';
  for (var i = 0; i < STATS.length; i++) {
    var stat = STATS[i];
    var colors = colorMap[stat.color] || colorMap.amber;
    var iconSVG = getStatIconSVG(stat.icon);

    html += '<div class="stat-card" id="stat-card-' + escapeHtml(stat.id) + '">' +
      '<div class="stat-header">' +
        '<span class="stat-value" id="stat-val-' + escapeHtml(stat.id) + '">0</span>' +
        '<div class="stat-icon-box" style="background:' + colors.iconBg + ';color:' + colors.icon + '">' +
          iconSVG +
        '</div>' +
      '</div>' +
      '<div>' +
        '<div class="stat-title">' + escapeHtml(stat.titleAr || '') + '</div>' +
        '<div class="stat-unit" style="color:' + colors.icon + '">' + escapeHtml(stat.unit || '') + '</div>' +
      '</div>' +
    '</div>';
  }

  container.innerHTML = html;

  // بدء أنيميشن العدّ بعد عرض العناصر
  animateStatsCount();
}

function animateStatsCount() {
  if (!STATS || STATS.length === 0) return;

  var duration = 2200;
  var startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    var elapsed = timestamp - startTime;
    var t = Math.min(elapsed / duration, 1);
    var eased = easeOutQuart(t);

    for (var i = 0; i < STATS.length; i++) {
      var stat = STATS[i];
      var valEl = document.getElementById('stat-val-' + stat.id);
      if (!valEl) continue;
      var current = Math.floor(stat.value * eased);
      valEl.textContent = formatNumber(current);
    }

    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      // تعيين القيم النهائية
      for (var j = 0; j < STATS.length; j++) {
        var s = STATS[j];
        var el = document.getElementById('stat-val-' + s.id);
        if (el) el.textContent = formatNumber(s.value);
      }
    }
  }

  // requestAnimationFrame آمن مع fallback
  if (window.requestAnimationFrame) {
    requestAnimationFrame(step);
  } else {
    // Fallback لمتصفحات قديمة جداً: عرض القيم فوراً
    for (var k = 0; k < STATS.length; k++) {
      var sEl = document.getElementById('stat-val-' + STATS[k].id);
      if (sEl) sEl.textContent = formatNumber(STATS[k].value);
    }
  }
}

// ════════════════════════════════════════════════════════════════════
// 10. شريط الأخبار السفلي (Ticker)
// ════════════════════════════════════════════════════════════════════

function initTicker() {
  var container = document.getElementById('ticker-content');
  if (!container) return;

  if (!TICKER_NOTICES || TICKER_NOTICES.length === 0) {
    container.textContent = 'مكتب وزارة التربية والتعليم — ساحل حضرموت';
    return;
  }

  // دمج الإعلانات بفاصل بسيط (بدون shimmer مزخرف)
  var joined = TICKER_NOTICES.join('   ✦   ');
  container.textContent = joined;

  // إعادة ضبط أنيميشن CSS بعد التعيين لضمان الحركة الصحيحة
  container.style.webkitAnimation = 'none';
  container.style.animation = 'none';
  // forceراحة repaint
  var h = container.offsetHeight; // قراءة تُجبر المتصفح على الإعادة
  container.style.webkitAnimation = '';
  container.style.animation = '';
}

// ════════════════════════════════════════════════════════════════════
// 11. شريحة الأخبار / الوسائط الرئيسية
// ════════════════════════════════════════════════════════════════════

// ── مسح جميع المؤقتات ──
function clearSliderTimers() {
  try {
    if (sliderState.slideTimer)        { clearTimeout(sliderState.slideTimer);        sliderState.slideTimer = null; }
    if (sliderState.progressTimer)     { clearInterval(sliderState.progressTimer);    sliderState.progressTimer = null; }
    if (sliderState.videoProgressTimer){ clearInterval(sliderState.videoProgressTimer); sliderState.videoProgressTimer = null; }
    if (sliderState.videoFallbackTimer){ clearTimeout(sliderState.videoFallbackTimer); sliderState.videoFallbackTimer = null; }
  } catch(e) {}
}

// ── تدمير مشغّل يوتيوب ──
function destroyYTPlayer() {
  try {
    if (ytState.player) {
      ytState.player.destroy();
      ytState.player = null;
    }
  } catch(e) {
    ytState.player = null;
  }
}

// ── الانتقال إلى الشريحة التالية ──
function goToNextSlide() {
  if (sliderState.isTransitioning) return;
  sliderState.isTransitioning = true;

  clearSliderTimers();
  destroyYTPlayer();

  var contentEl = document.getElementById('slider-content');
  if (contentEl) contentEl.classList.add('fading');

  setTimeout(function() {
    sliderState.currentIndex = (sliderState.currentIndex + 1) % NEWS_ITEMS.length;
    sliderState.isTransitioning = false;
    loadCurrentSlide();
    if (contentEl) contentEl.classList.remove('fading');
  }, 500);
}

// ── تحميل الشريحة الحالية ──
function loadCurrentSlide() {
  if (!NEWS_ITEMS || NEWS_ITEMS.length === 0) return;

  clearSliderTimers();

  var item = NEWS_ITEMS[sliderState.currentIndex];
  if (!item) { goToNextSlide(); return; }

  // تحديث الشارات
  updateSliderBadge(item);
  updateUrgentBadge(item);

  // إعادة ضبط شريط التقدم
  var fill = document.getElementById('slider-progress-fill');
  if (fill) { fill.style.width = '0%'; }

  // عرض المحتوى حسب النوع
  if (item.type === 'image') {
    renderImageSlide(item);
  } else if (item.type === 'youtube' || item.type === 'lesson') {
    renderVideoSlide(item);
  } else {
    // نوع غير معروف — انتقل بعد مدة افتراضية
    console.warn('[Slider] نوع محتوى غير معروف:', item.type);
    sliderState.slideTimer = setTimeout(goToNextSlide, 15000);
  }
}

// ── شريحة الصورة ──
function renderImageSlide(item) {
  var container = document.getElementById('slider-content');
  if (!container) return;

  var duration = (item.durationMs && item.durationMs > 0) ? item.durationMs :
                 (CONFIG && CONFIG.imageSlideDurationMs) ? CONFIG.imageSlideDurationMs : 30000;

  // إنشاء عنصر الصورة
  var img = document.createElement('img');
  img.className = 'slide-image';
  img.alt = item.titleAr || '';

  // gradient overlay
  var gradient = document.createElement('div');
  gradient.className = 'slide-gradient';

  // عنوان
  var titleDiv = document.createElement('div');
  titleDiv.className = 'slide-title';
  var h2 = document.createElement('h2');
  h2.textContent = item.titleAr || '';
  titleDiv.appendChild(h2);

  container.innerHTML = '';
  container.appendChild(img);
  container.appendChild(gradient);
  container.appendChild(titleDiv);

  // تحميل الصورة بشكل دفاعي
  var src = item.imageSrc || item.fallbackImageSrc || 'assets/images/logo.png';
  img.onerror = function() {
    // fallback إذا فشل تحميل الصورة
    img.src = (item.fallbackImageSrc && item.fallbackImageSrc !== src)
      ? item.fallbackImageSrc
      : 'assets/images/logo.png';
    img.onerror = null;
  };
  img.src = src;

  // شريط التقدم
  var fill = document.getElementById('slider-progress-fill');
  var startTime = Date.now();

  sliderState.progressTimer = setInterval(function() {
    var elapsed = Date.now() - startTime;
    var pct = Math.min((elapsed / duration) * 100, 100);
    if (fill) fill.style.width = pct + '%';
  }, 100);

  sliderState.slideTimer = setTimeout(goToNextSlide, duration);
}

// ── شريحة الفيديو (YouTube) ──
function renderVideoSlide(item) {
  var container = document.getElementById('slider-content');
  if (!container) return;

  var videoId = item.youtubeVideoId;
  if (!videoId) {
    // لا يوجد معرف فيديو — عرض كصورة fallback
    renderFallbackImageSlide(item);
    return;
  }

  var fallbackMs = (CONFIG && CONFIG.youtube && CONFIG.youtube.startFallbackMs)
                    ? CONFIG.youtube.startFallbackMs : 30000;
  var errorFallbackMs = (CONFIG && CONFIG.youtube && CONFIG.youtube.videoErrorFallbackMs)
                         ? CONFIG.youtube.videoErrorFallbackMs : 180000;
  var maxFallbackMs = (CONFIG && CONFIG.youtube && CONFIG.youtube.maxAbsoluteFallbackMs)
                       ? CONFIG.youtube.maxAbsoluteFallbackMs : 7200000;

  // إظهار أيقونة التحميل
  var loadingOverlay = document.getElementById('video-overlay-loading');
  if (loadingOverlay) loadingOverlay.style.display = 'flex';

  // ✅ الإصلاح: إنشاء div فارغ كهدف — YT.Player يحقن iframe الخاص به (مثل NewsSlider.tsx)
  // لا نُنشئ iframe يدوياً لأنه يُسبب race condition مع YT.Player
  var videoWrapper = document.createElement('div');
  videoWrapper.className = 'slide-video-container';

  var playerTarget = document.createElement('div');
  playerTarget.style.width = '100%';
  playerTarget.style.height = '100%';
  videoWrapper.appendChild(playerTarget);

  // عنوان الفيديو
  var titleBar = document.createElement('div');
  titleBar.className = 'slide-video-title';
  var h2 = document.createElement('h2');
  h2.textContent = item.titleAr || '';
  titleBar.appendChild(h2);

  container.innerHTML = '';
  container.appendChild(videoWrapper);
  container.appendChild(titleBar);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // طبقات التحكم في الانتقال (ترتيب الأولوية):
  // 1. YT.Player onStateChange (الأولى)
  // 2. postMessage listener (الثانية)
  // 3. Fallback timer (الثالثة — آخر ملاذ)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  var videoStarted = false;

  // الطريقة 3: Fallback timer — 30 ثانية للبدء
  sliderState.videoFallbackTimer = setTimeout(function() {
    if (!videoStarted) {
      console.warn('[Slider] فيديو لم يبدأ خلال ' + (fallbackMs/1000) + ' ثانية — fallback صورة');
      renderFallbackImageSlide(item);
    }
  }, fallbackMs);

  // الطريقة 2: postMessage listener
  function onYTMessage(event) {
    if (!event || !event.data) return;
    try {
      var data = (typeof event.data === 'string') ? JSON.parse(event.data) : event.data;
      if (!data || typeof data !== 'object') return;

      // الصيغة الجديدة: infoDelivery
      if (data.event === 'infoDelivery' && data.info && typeof data.info === 'object') {
        handlePlayerState(data.info.playerState);
      }
      // الصيغة القديمة: onStateChange
      if (data.event === 'onStateChange' && typeof data.info === 'number') {
        handlePlayerState(data.info);
      }
    } catch(e) { /* رسالة من مصدر آخر — تجاهل */ }
  }

  // تسجيل مستمع الرسائل
  if (window.addEventListener) {
    window.addEventListener('message', onYTMessage);
  } else if (window.attachEvent) {
    window.attachEvent('onmessage', onYTMessage);
  }

  // تنظيف عند الانتقال: إزالة مستمع الرسائل
  // يُحفظ مرجعه لإزالته لاحقاً
  sliderState._ytMessageHandler = onYTMessage;

  // الطريقة 1: YT.Player API
  // ✅ الإصلاح: تمرير playerTarget (div فارغ) كهدف — YT.Player يُنشئ iframe بنفسه
  loadYouTubeAPI(function() {
    // تأكد أن الشريحة ما زالت نفسها
    if (sliderState.isTransitioning) return;
    if (!window.YT || !window.YT.Player) return;
    // تأكد أن الـ div الهدف ما زال في الـ DOM
    if (!playerTarget.parentNode) return;

    try {
      destroyYTPlayer();
      ytState.player = new window.YT.Player(playerTarget, {
        videoId: videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 1,
          mute: 0,
          controls: 0,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          enablejsapi: 1
        },
        events: {
          onStateChange: function(e) {
            handlePlayerState(e.data);
          },
          onError: function() {
            console.warn('[YT.Player] خطأ في الفيديو — fallback بعد ' + (errorFallbackMs/1000) + ' ثانية');
            clearSliderTimers();
            sliderState.slideTimer = setTimeout(goToNextSlide, errorFallbackMs);
          }
        }
      });
    } catch(e) {
      console.warn('[YT.Player] فشل إنشاء المشغل:', e);
    }
  });

  // ── معالج حالة المشغل المشترك ──
  function handlePlayerState(state) {
    // YT_STATE values: ENDED=0, PLAYING=1, PAUSED=2, BUFFERING=3, CUED=5
    if (state === 1) { // PLAYING
      if (!videoStarted) {
        videoStarted = true;
        // إخفاء أيقونة التحميل
        if (loadingOverlay) loadingOverlay.style.display = 'none';
        // إلغاء fallback البداية وتعيين fallback الطوارئ الأقصى
        if (sliderState.videoFallbackTimer) {
          clearTimeout(sliderState.videoFallbackTimer);
          sliderState.videoFallbackTimer = setTimeout(goToNextSlide, maxFallbackMs);
        }
      }
    }
    if (state === 0) { // ENDED
      goToNextSlide();
    }
    if (state === 2 || state === 3) { // PAUSED أو BUFFERING
      if (loadingOverlay && !videoStarted) loadingOverlay.style.display = 'flex';
    }
  }
}

// ── Fallback للفيديو: عرض كصورة بدلاً منه ──
function renderFallbackImageSlide(item) {
  var fallbackItem = {
    type: 'image',
    titleAr: item.titleAr || '',
    imageSrc: item.fallbackImageSrc || 'assets/images/logo.png',
    fallbackImageSrc: 'assets/images/logo.png',
    durationMs: (CONFIG && CONFIG.imageSlideDurationMs) ? CONFIG.imageSlideDurationMs : 30000
  };
  renderImageSlide(fallbackItem);
}

// ── تحديث شارة نوع المحتوى ──
function updateSliderBadge(item) {
  var area = document.getElementById('slider-badge-area');
  if (!area) return;

  var badgeClass = '';
  var iconSVG = '';
  var label = '';

  if (item.type === 'youtube') {
    badgeClass = 'content-badge badge-youtube';
    label = 'اخبار المكتب';
    iconSVG = '<svg class="badge-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M21.582 6.186a2.496 2.496 0 0 0-1.756-1.756C18.254 4 12 4 12 4s-6.254 0-7.826.43a2.496 2.496 0 0 0-1.756 1.756C2 7.757 2 12 2 12s0 4.243.418 5.814a2.496 2.496 0 0 0 1.756 1.756C5.746 20 12 20 12 20s6.254 0 7.826-.43a2.496 2.496 0 0 0 1.756-1.756C22 16.243 22 12 22 12s0-4.243-.418-5.814zM10 15.464V8.536L16 12l-6 3.464z"/></svg>';
  } else if (item.type === 'image') {
    badgeClass = 'content-badge badge-image';
    label = 'صورة';
    iconSVG = '<svg class="badge-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>';
  } else if (item.type === 'lesson') {
    badgeClass = 'content-badge badge-lesson';
    label = 'دروس تعليمية';
    iconSVG = '<svg class="badge-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg>';
  }

  if (label) {
    area.innerHTML = '<div class="' + badgeClass + '">' + iconSVG + escapeHtml(label) + '</div>';
  } else {
    area.innerHTML = '';
  }
}

// ── تحديث شارة عاجل ──
function updateUrgentBadge(item) {
  var badge = document.getElementById('urgent-badge');
  if (!badge) return;
  badge.style.display = item.isUrgent ? 'flex' : 'none';
}

// ── تهيئة الشريحة ──
function initSlider() {
  if (!NEWS_ITEMS || NEWS_ITEMS.length === 0) {
    var container = document.getElementById('slider-content');
    if (container) {
      container.innerHTML = '<div class="slider-loading-state"><img src="assets/images/logo.png" alt="مكتب ساحل حضرموت" class="slider-loading-logo"></div>';
    }
    return;
  }

  sliderState.currentIndex = 0;
  loadCurrentSlide();
}

// ════════════════════════════════════════════════════════════════════
// 12. تحميل YouTube IFrame API (Singleton — مرة واحدة فقط)
// ════════════════════════════════════════════════════════════════════

var ytCallbacks = [];
var ytLoadStarted = false;

function loadYouTubeAPI(callback) {
  if (ytState.apiReady) {
    try { callback(); } catch(e) {}
    return;
  }

  ytCallbacks.push(callback);

  if (ytLoadStarted) return; // API يُحمَّل بالفعل
  ytLoadStarted = true;

  // الربط بـ callback يوتيوب
  var prev = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = function() {
    if (prev && typeof prev === 'function') {
      try { prev(); } catch(e) {}
    }
    ytState.apiReady = true;
    for (var i = 0; i < ytCallbacks.length; i++) {
      try { ytCallbacks[i](); } catch(e) {}
    }
    ytCallbacks = [];
  };

  // حقن سكريبت يوتيوب إذا لم يكن موجوداً
  if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.onerror = function() {
      console.warn('[YT API] فشل تحميل YouTube IFrame API');
      ytLoadStarted = false;
      // invoked callbacks will naturally result in no YT.Player being created
    };
    var firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(tag, firstScript);
    } else {
      document.head.appendChild(tag);
    }
  }
}

// ════════════════════════════════════════════════════════════════════
// 13. دالة مساعدة — escape HTML لمنع XSS عند داخل innerHTML
// ════════════════════════════════════════════════════════════════════

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ════════════════════════════════════════════════════════════════════
// 14. نقطة الدخول — انتظر تحميل الـ DOM
// ════════════════════════════════════════════════════════════════════

function onDOMReady(fn) {
  if (document.readyState === 'loading') {
    if (document.addEventListener) {
      document.addEventListener('DOMContentLoaded', fn);
    } else if (document.attachEvent) {
      document.attachEvent('onreadystatechange', function() {
        if (document.readyState !== 'loading') fn();
      });
    }
  } else {
    fn();
  }
}

onDOMReady(function() {
  // تعيين overflow:hidden على body هنا للتأكد
  document.body.style.overflow = 'hidden';
  document.body.style.margin = '0';
  document.body.style.padding = '0';

  // بدء تحميل البيانات
  loadAllData();
});

// تنظيف مستمع رسائل الفيديو القديم عند تغيير الشريحة
// (يُعاد ربطه في renderVideoSlide)
function cleanupVideoMessageHandler() {
  if (sliderState._ytMessageHandler) {
    if (window.removeEventListener) {
      window.removeEventListener('message', sliderState._ytMessageHandler);
    } else if (window.detachEvent) {
      window.detachEvent('onmessage', sliderState._ytMessageHandler);
    }
    sliderState._ytMessageHandler = null;
  }
}
