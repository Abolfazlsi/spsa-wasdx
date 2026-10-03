/* ============================================================
   سامانه پایش هوشمند عملکرد دانش‌آموز — قالب نمایشی
   تمام داده‌ها نمایشی (Mock) هستند و صرفاً برای پیش‌نمایش قالب
   در سمت مرورگر تولید می‌شوند. هیچ ارتباطی با سرور وجود ندارد.
   ============================================================ */
'use strict';

/* ---------- ابزارهای کمکی ---------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
function toFa(v) {
  return String(v).replace(/\d/g, d => FA_DIGITS[+d]).replace(/\./g, '٫').replace(/,/g, '٬');
}
function faNum(n, dec = 0) {
  return toFa(Number(n).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }));
}
function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
function rnd(seed) { const x = Math.sin(seed) * 10000; return x - Math.floor(x); }

function initials(name) {
  const p = name.trim().split(' ');
  return (p[0][0] || '') + (p[1] ? p[1][0] : '');
}

/* ---------- Toast نمایشی ---------- */
function toast(text, icon = 'bi-check-circle-fill') {
  const host = $('.toast-host');
  const t = document.createElement('div');
  t.className = 'demo-toast';
  t.innerHTML = `<i class="bi ${icon}"></i><span>${text}</span>`;
  host.appendChild(t);
  setTimeout(() => { t.classList.add('hide'); setTimeout(() => t.remove(), 350); }, 3200);
}

/* ============================================================
   پایگاه دادهٔ نمایشی (Mock)
   ============================================================ */
const GRADES = ['اول', 'دوم', 'سوم', 'چهارم', 'پنجم', 'ششم', 'هفتم', 'هشتم', 'نهم'];

const SUBJECTS = {
  'اول':   ['فارسی', 'ریاضی', 'علوم', 'قرآن', 'هدیه‌های آسمانی'],
  'دوم':   ['فارسی', 'ریاضی', 'علوم', 'قرآن', 'هدیه‌های آسمانی', 'زبان انگلیسی'],
  'سوم':   ['فارسی', 'ریاضی', 'علوم', 'قرآن', 'هدیه‌های آسمانی', 'زبان انگلیسی'],
  'هفتم': ['ریاضی', 'علوم تجربی', 'فارسی و نگارش', 'زبان انگلیسی', 'مطالعات اجتماعی', 'عربی', 'قرآن', 'ورزش'],
  'هشتم': ['ریاضی', 'علوم تجربی', 'فارسی و نگارش', 'زبان انگلیسی', 'مطالعات اجتماعی', 'عربی', 'قرآن', 'ورزش'],
  'نهم':  ['ریاضی', 'علوم تجربی', 'فارسی و نگارش', 'زبان انگلیسی', 'مطالعات اجتماعی', 'عربی', 'قرآن', 'ورزش'],
};

const TEACHER_OF = {
  'ریاضی': 'علی کریمی', 'علوم تجربی': 'حسین موسوی', 'علوم': 'حسین موسوی',
  'فارسی': 'مریم احمدی', 'فارسی و نگارش': 'مریم احمدی', 'زبان انگلیسی': 'سارا رحیمی',
  'قرآن': 'زهرا حسینی', 'هدیه‌های آسمانی': 'زهرا حسینی', 'مطالعات اجتماعی': 'کیوان رستمی',
  'عربی': 'کیوان رستمی', 'ورزش': 'رضا قاسمی',
};
/* معلم پایهٔ سوم: تمام دروس یک پایه توسط یک معلم ارایه می‌شود (سناریوی مدرسهٔ ابتدایی) */
function teacherOf(grade, subject) {
  if (grade === 'سوم') return 'نرگس محمدی';
  return TEACHER_OF[subject] || 'نرگس محمدی';
}

const AV_CLASSES = ['av-teal', 'av-amber', 'av-rose', 'av-emerald', 'av-violet', 'av-slate'];

const DB = {
  students: [
    { id: '۱۰۴۲', name: 'علی رضایی',      grade: 'نهم',  cls: '۱', gpa: 18.4, attend: 96, trend: 1.2, parent: 'آقای رضایی',    phone: '۰۹۱۲۳۴۵۶۷۸۹' },
    { id: '۱۰۴۳', name: 'سارا موسوی',     grade: 'نهم',  cls: '۱', gpa: 16.8, attend: 98, trend: 0.4, parent: 'خانم موسوی',    phone: '۰۹۱۲۱۱۱۲۲۳۳' },
    { id: '۱۰۴۴', name: 'مریم عباسی',     grade: 'نهم',  cls: '۱', gpa: 19.2, attend: 98, trend: 0.6, parent: 'آقای عباسی',    phone: '۰۹۳۵۴۴۴۵۵۶۶' },
    { id: '۱۰۴۵', name: 'آرش کاظمی',      grade: 'نهم',  cls: '۱', gpa: 15.9, attend: 91, trend: -0.3, parent: 'آقای کاظمی',   phone: '۰۹۱۹۸۸۸۷۷۶۶' },
    { id: '۱۰۴۶', name: 'امیر قاسمی',     grade: 'نهم',  cls: '۲', gpa: 12.6, attend: 81, trend: -2.1, parent: 'آقای قاسمی',   phone: '۰۹۱۲۷۷۷۸۸۹۹' },
    { id: '۱۰۴۷', name: 'سمیرا ابراهیمی', grade: 'نهم',  cls: '۲', gpa: 16.1, attend: 94, trend: 0.9, parent: 'خانم ابراهیمی', phone: '۰۹۰۱۵۵۵۶۶۷۷' },
    { id: '۱۰۴۸', name: 'محمد حسینی',     grade: 'هفتم', cls: '۲', gpa: 14.1, attend: 74, trend: -1.5, parent: 'آقای حسینی',   phone: '۰۹۱۲۳۳۳۴۴۵۵' },
    { id: '۱۰۴۹', name: 'کیان مرادی',     grade: 'هفتم', cls: '۱', gpa: 11.9, attend: 78, trend: -1.1, parent: 'آقای مرادی',   phone: '۰۹۳۶۲۲۲۳۳۴۴' },
    { id: '۱۰۵۰', name: 'یاسمن توکلی',    grade: 'هشتم', cls: '۱', gpa: 16.3, attend: 93, trend: 0.5, parent: 'خانم توکلی',    phone: '۰۹۱۲۹۹۹۰۰۱۱' },
    { id: '۱۰۵۱', name: 'رضا شریفی',      grade: 'هشتم', cls: '۱', gpa: 13.8, attend: 85, trend: -0.8, parent: 'آقای شریفی',   phone: '۰۹۱۷۱۲۳۴۵۶۷' },
    { id: '۱۰۵۲', name: 'فاطمه کریمی',    grade: 'سوم',  cls: '۱', gpa: 19.6, attend: 99, trend: 0.3, parent: 'خانم کریمی',    phone: '۰۹۱۲۶۵۴۳۲۱۰' },
    { id: '۱۰۵۳', name: 'زهرا نوری',      grade: 'سوم',  cls: '۱', gpa: 17.9, attend: 95, trend: 0.8, parent: 'آقای نوری',     phone: '۰۹۱۸۸۸۷۷۶۶۵' },
    { id: '۱۰۵۴', name: 'حسین صادقی',     grade: 'دوم',  cls: '۱', gpa: 15.2, attend: 90, trend: 0.2, parent: 'آقای صادقی',    phone: '۰۹۱۲۴۵۴۵۴۵۴' },
    { id: '۱۰۵۵', name: 'نگار احمدی',     grade: 'اول',  cls: '۲', gpa: 18.1, attend: 97, trend: 0.7, parent: 'خانم احمدی',    phone: '۰۹۱۲۱۲۳۴۵۶۷' },
  ],

  teachers: [
    { name: 'نرگس محمدی',   role: 'معلم پایهٔ سوم (تمام دروس)', classes: 'سوم — کلاس ۱ و ۲',   count: 46, av: 'av-violet',  tag: ['همهٔ دروس پایهٔ سوم'] },
    { name: 'علی کریمی',    role: 'دبیر ریاضی',                classes: 'هفتم، هشتم، نهم',   count: 92, av: 'av-teal',    tag: ['ریاضی'] },
    { name: 'مریم احمدی',   role: 'دبیر فارسی و نگارش',        classes: 'هفتم، هشتم، نهم',   count: 92, av: 'av-amber',   tag: ['فارسی و نگارش', 'فارسی'] },
    { name: 'حسین موسوی',   role: 'دبیر علوم تجربی',           classes: 'هفتم، هشتم، نهم',   count: 88, av: 'av-emerald', tag: ['علوم تجربی', 'علوم'] },
    { name: 'سارا رحیمی',   role: 'دبیر زبان انگلیسی',         classes: 'دوم، سوم، هفتم، هشتم، نهم', count: 118, av: 'av-rose', tag: ['زبان انگلیسی'] },
    { name: 'کیوان رستمی',  role: 'دبیر مطالعات و عربی',       classes: 'هفتم، هشتم، نهم',   count: 90, av: 'av-slate',   tag: ['مطالعات اجتماعی', 'عربی'] },
    { name: 'زهرا حسینی',   role: 'دبیر قرآن و هدیه‌ها',       classes: 'اول تا نهم',        count: 124, av: 'av-teal',   tag: ['قرآن', 'هدیه‌های آسمانی'] },
    { name: 'رضا قاسمی',    role: 'آموزگار ورزش و هنر',        classes: 'اول تا نهم',        count: 124, av: 'av-amber',  tag: ['ورزش', 'هنر'] },
  ],

  classes: [
    { grade: 'اول',  cls: '۲', teacher: 'سمانه نوروزی', count: 26, avg: 17.6 },
    { grade: 'دوم',  cls: '۱', teacher: 'سمانه نوروزی', count: 24, avg: 16.2 },
    { grade: 'سوم',  cls: '۱', teacher: 'نرگس محمدی',   count: 23, avg: 18.4 },
    { grade: 'سوم',  cls: '۲', teacher: 'نرگس محمدی',   count: 23, avg: 17.9 },
    { grade: 'هفتم', cls: '۱', teacher: 'مینا اکبری',   count: 28, avg: 15.1 },
    { grade: 'هفتم', cls: '۲', teacher: 'مینا اکبری',   count: 27, avg: 14.8 },
    { grade: 'هشتم', cls: '۱', teacher: 'پویا صالحی',   count: 26, avg: 15.9 },
    { grade: 'نهم',  cls: '۱', teacher: 'پویا صالحی',   count: 25, avg: 17.5 },
    { grade: 'نهم',  cls: '۲', teacher: 'پویا صالحی',   count: 24, avg: 15.3 },
  ],

  exams: [
    { title: 'امتحان میان‌ترم ریاضی',            subject: 'ریاضی',            grade: 'نهم',  date: '۱۴۰۳/۰۹/۱۸', kind: 'میان‌ترم', max: 20, state: 'برگزار شده' },
    { title: 'آزمون مستمر علوم تجربی',           subject: 'علوم تجربی',       grade: 'نهم',  date: '۱۴۰۳/۰۹/۱۰', kind: 'مستمر',   max: 5,  state: 'برگزار شده' },
    { title: 'آزمون هفتگی زبان انگلیسی',         subject: 'زبان انگلیسی',     grade: 'هشتم', date: '۱۴۰۳/۰۹/۱۵', kind: 'مستمر',   max: 5,  state: 'برگزار شده' },
    { title: 'امتحان هم‌گامی مطالعات اجتماعی',   subject: 'مطالعات اجتماعی',  grade: 'نهم',  date: '۱۴۰۳/۱۰/۰۲', kind: 'میان‌ترم', max: 10, state: 'پیش‌رو' },
    { title: 'امتحان پایانی فارسی',              subject: 'فارسی',            grade: 'سوم',  date: '۱۴۰۳/۱۰/۰۵', kind: 'پایانی',  max: 20, state: 'پیش‌رو' },
  ],

  /* وضعیت حضور امروز — چند دانش‌آموز غایب/تأخیر برای نمایش اطلاع‌رسانی */
  todayStatus: {
    '۱۰۴۶': 'absent',   /* امیر قاسمی */
    '۱۰۵۱': 'absent',   /* رضا شریفی */
    '۱۰۴۸': 'absent',   /* محمد حسینی */
    '۱۰۴۹': 'late',     /* کیان مرادی */
  },

  weeklyAttendance: {
    labels: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه'],
    school: [92, 93, 91, 92, 90],
    ours:   [94, 91, 95, 89, 93],
  },

  gradeDist: [
    { label: 'عالی', value: 34, color: '#10b981' },
    { label: 'خوب', value: 44, color: '#0d9488' },
    { label: 'نیازمند تلاش', value: 15, color: '#f59e0b' },
    { label: 'ضعیف', value: 7, color: '#e11d48' },
  ],

  messages: [
    { date: 'امروز — ۰۷:۴۵', name: 'امیر قاسمی',     type: 'absent', text: 'والدین محترم آقای قاسمی؛ فرزند شما امروز در مدرسه حاضر نشد. لطفاً تماس بگیرید.', state: 'تحویل شد' },
    { date: 'امروز — ۰۷:۴۵', name: 'رضا شریفی',      type: 'absent', text: 'والدین محترم آقای شریفی؛ فرزند شما امروز در مدرسه حاضر نشد. لطفاً تماس بگیرید.', state: 'تحویل شد' },
    { date: 'امروز — ۰۸:۱۰', name: 'کیان مرادی',     type: 'late',   text: 'والدین محترم آقای مرادی؛ فرزند شما با تأخیر وارد مدرسه شد.', state: 'تحویل شد' },
    { date: 'دیروز — ۱۴:۲۰', name: 'محمد حسینی',     type: 'warn',   text: 'والدین محترم؛ افت تحصیلی در درس ریاضی مشاهده می‌شود. خواهشمند است با مشاور مدرسه تماس بگیرید.', state: 'در انتظار' },
    { date: '۲ روز پیش',     name: 'فاطمه کریمی',    type: 'praise', text: 'والدین محترم؛ تقدیر بابت نمرهٔ عالی فرزند شما در آزمون اخیر. آفرین!', state: 'تحویل شد' },
    { date: '۳ روز پیش',     name: 'نگار احمدی',     type: 'praise', text: 'والدین محترم؛ پیشرفت چشمگیر فرزند شما در درس ریاضی ثبت شد.', state: 'تحویل شد' },
  ],
};

/* ---------- توابع داده ---------- */
function studentStatus(s) {
  if (s.gpa >= 18) return { label: 'عالی', cls: 'st-excellent' };
  if (s.gpa >= 15) return { label: 'خوب', cls: 'st-good' };
  if (s.gpa >= 13) return { label: 'نیازمند تلاش', cls: 'st-warn' };
  return { label: 'ضعیف', cls: 'st-danger' };
}

function subjectsOf(st) {
  const list = SUBJECTS[st.grade] || SUBJECTS['نهم'];
  return list.map((sub, i) => {
    const base = st.gpa + (rnd(hash(st.name + sub)) * 6 - 3);
    const m1 = Math.min(20, Math.max(8, Math.round((base + 1.5) * 4) / 4));
    const mid = Math.min(20, Math.max(8, Math.round((base + rnd(hash(sub)) * 2 - 1) * 4) / 4));
    const fin = Math.min(20, Math.max(8, Math.round((base - 1 + rnd(hash(st.id + sub)) * 2.5 - 1) * 4) / 4));
    const total = Math.round((m1 * 0.2 + mid * 0.3 + fin * 0.5) * 4) / 4;
    return { subject: sub, teacher: teacherOf(st.grade, sub), m1, mid, fin, total };
  });
}

function gradeClassAvg(grade) {
  const rows = DB.classes.filter(c => c.grade === grade);
  return rows.reduce((a, c) => a + c.avg, 0) / (rows.length || 1);
}

function monthTrend(st) {
  const avg = gradeClassAvg(st.grade);
  const labels = ['مهر', 'آبان', 'آذر', 'دی', 'بهمن'];
  const ours = labels.map((m, i) => Math.round(Math.max(10, Math.min(20, st.gpa + (rnd(hash(st.name + m)) * 3 - 1.2) + (i - 2) * (st.trend * 0.4))) * 10) / 10);
  const cls = labels.map(m => Math.round(avg * 10) / 10);
  return { labels, ours, cls };
}

/* ============================================================
   موتور نمودار — SVG دست‌ساز (بدون کتابخانه)
   ============================================================ */
function svgEl(tag, attrs = {}) {
  const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  return e;
}
function faTxt(x, y, str, size = 11, fill = '#8aa39e', anchor = 'middle', weight = 500) {
  const t = svgEl('text', { x, y, 'font-size': size, fill, 'text-anchor': anchor, 'font-weight': weight });
  t.textContent = toFa(str);
  return t;
}

/* نمودار خطی با ناحیهٔ گرادیانی — RTL (اولین نقطه در راست) */
function lineChart(container, opts) {
  const { labels, series, yMin, yMax, suffix = '', ticks = 4 } = opts;
  const W = 640, H = 250, px = 14, pr = 44, pt = 16, pb = 34;
  const iw = W - px - pr, ih = H - pt - pb;
  const n = labels.length;
  const X = i => W - pr - (n === 1 ? iw / 2 : (i * iw) / (n - 1));
  const Y = v => pt + ih - ((v - yMin) / (yMax - yMin)) * ih;

  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'نمودار خطی' });

  /* گرید و برچسب محور عمودی (سمت راست) */
  for (let t = 0; t <= ticks; t++) {
    const v = yMin + ((yMax - yMin) * t) / ticks;
    const y = Y(v);
    svg.appendChild(svgEl('line', { x1: px, x2: W - pr, y1: y, y2: y, stroke: '#e6efee', 'stroke-dasharray': '3 4' }));
    svg.appendChild(faTxt(W - pr + 8, y + 4, faNum(Math.round(v * 10) / 10) + (suffix === '٪' ? '٪' : ''), 10, '#9ab3ae', 'start'));
  }
  /* برچسب محور افقی */
  labels.forEach((l, i) => svg.appendChild(faTxt(X(i), H - 10, l, 10.5, '#7d948f')));

  const defs = svgEl('defs');

  series.forEach((s, si) => {
    const pts = s.data.map((v, i) => [X(i), Y(v)]);
    /* مسیر نرم (Catmull-Rom → Bezier) */
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p2[0]} ${p2[1]}`;
    }
    if (s.area) {
      const gId = `grad-${si}-${Math.floor(rnd(hash(s.name)) * 1e6)}`;
      const grad = svgEl('linearGradient', { id: gId, x1: 0, y1: 0, x2: 0, y2: 1 });
      grad.appendChild(svgEl('stop', { offset: '0%', 'stop-color': s.color, 'stop-opacity': .28 }));
      grad.appendChild(svgEl('stop', { offset: '100%', 'stop-color': s.color, 'stop-opacity': 0 }));
      defs.appendChild(grad);
      const area = svgEl('path', { d: `${d} L ${pts[pts.length - 1][0]} ${Y(yMin)} L ${pts[0][0]} ${Y(yMin)} Z`, fill: `url(#${gId})` });
      svg.appendChild(area);
    }
    svg.appendChild(svgEl('path', { d, fill: 'none', stroke: s.color, 'stroke-width': s.width || 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...(s.dash ? { 'stroke-dasharray': '6 6' } : {}) }));
    pts.forEach(([x, y], i) => {
      if (s.dash) return;
      svg.appendChild(svgEl('circle', { cx: x, cy: y, r: 4, fill: '#fff', stroke: s.color, 'stroke-width': 2.5 }));
      if (s.showVals) svg.appendChild(faTxt(x, y - 10, faNum(s.data[i]) + (suffix || ''), 10, s.color, 'middle', 700));
    });
  });

  svg.appendChild(defs);
  container.innerHTML = '';
  container.appendChild(svg);
}

/* نمودار دونات */
function donut(container, items, centerBig, centerSmall) {
  const S = 210, c = S / 2, r = 78, sw = 24;
  const total = items.reduce((a, i) => a + i.value, 0);
  const svg = svgEl('svg', { viewBox: `0 0 ${S} ${S}`, role: 'img', 'aria-label': 'نمودار دونات' });
  svg.appendChild(svgEl('circle', { cx: c, cy: c, r, fill: 'none', stroke: '#edf3f2', 'stroke-width': sw }));
  const circ = 2 * Math.PI * r;
  let offset = 0;
  items.forEach(it => {
    const frac = it.value / total;
    const seg = svgEl('circle', {
      cx: c, cy: c, r, fill: 'none', stroke: it.color, 'stroke-width': sw,
      'stroke-dasharray': `${Math.max(0, frac * circ - 3)} ${circ}`,
      'stroke-dashoffset': -offset * circ,
      'stroke-linecap': 'round',
      transform: `rotate(-90 ${c} ${c})`,
    });
    svg.appendChild(seg);
    offset += frac;
  });
  const t1 = faTxt(c, c - 2, centerBig, 21, '#12332d', 'middle', 800); t1.setAttribute('class', 'donut-center');
  const t2 = faTxt(c, c + 18, centerSmall, 10.5, '#8aa39e');
  svg.appendChild(t1); svg.appendChild(t2);
  container.innerHTML = '';
  container.appendChild(svg);
}

/* اسپارک‌لاین کوچک */
function sparkline(container, data, color) {
  const W = 96, H = 34, min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => `${W - (i * W) / (data.length - 1)},${H - 4 - ((v - min) / (max - min || 1)) * (H - 10)}`).join(' ');
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}` });
  svg.appendChild(svgEl('polyline', { points: pts, fill: 'none', stroke: color, 'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
  const last = pts.split(' ')[0].split(',');
  svg.appendChild(svgEl('circle', { cx: last[0], cy: last[1], r: 3.2, fill: color }));
  container.innerHTML = ''; container.appendChild(svg);
}

/* ============================================================
   ناوبری بین بخش‌ها
   ============================================================ */
const VIEW_TITLES = {
  dashboard: ['داشبورد', 'نمای کلی وضعیت مدرسه'],
  students:  ['مدیریت دانش‌آموزان', 'فهرست، فیلتر و پروندهٔ دانش‌آموزان'],
  attendance: ['حضور و غیاب', 'ثبت وضعیت روزانه و اطلاع‌رسانی به والدین'],
  grades:    ['نمرات و امتحانات', 'ثبت نمرات و مدیریت امتحانات سال تحصیلی'],
  reports:   ['گزارش‌ها و نمودارها', 'کارنامه، روند تحصیلی و تحلیل وضعیت'],
  ai:        ['دستیار هوشمند', 'پرسش و پاسخ بر اساس داده‌های سامانه'],
  messages:  ['پیام‌های والدین', 'پیامک‌های اطلاع‌رسانی ارسال‌شده'],
  teachers:  ['معلمان و کلاس‌ها', 'سازماندهی دبیران و کلاس‌های مدرسه'],
};

function showView(key) {
  $$('.view').forEach(v => v.classList.add('d-none'));
  const target = $(`#view-${key}`);
  if (target) { target.classList.remove('d-none'); /* ری‌استارت انیمیشن */ target.style.animation = 'none'; void target.offsetWidth; target.style.animation = ''; }
  $$('.side-link').forEach(a => a.classList.toggle('active', a.dataset.view === key));
  const [title, crumb] = VIEW_TITLES[key] || ['', ''];
  $('#pageTitle').textContent = title;
  $('#pageCrumb').textContent = crumb;
  document.title = `${title} | سامانه پایش هوشمند`;
  closeSidebar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openSidebar() { $('.sidebar').classList.add('show'); $('.backdrop').classList.add('show'); }
function closeSidebar() { $('.sidebar').classList.remove('show'); $('.backdrop').classList.remove('show'); }

/* ============================================================
   داشبورد
   ============================================================ */
function renderDashboard() {
  /* آمار */
  $('#statStudents').textContent = faNum(1248);
  $('#statAttend').textContent = '۹۳٪';
  $('#statGpa').textContent = faNum(16.4, 1);
  $('#statAbsent').textContent = faNum(3);
  sparkline($('#spStudents'), [1180, 1204, 1215, 1222, 1235, 1248], '#0d9488');
  sparkline($('#spAttend'), [94, 91, 95, 89, 93], '#10b981');
  sparkline($('#spGpa'), [15.8, 16.0, 15.9, 16.2, 16.4], '#f59e0b');
  sparkline($('#spAbsent'), [5, 2, 4, 3, 3], '#e11d48');

  /* نمودار حضور هفته */
  lineChart($('#chartWeekly'), {
    labels: DB.weeklyAttendance.labels,
    series: [
      { name: 'حضور مدرسه ما', color: '#0d9488', data: DB.weeklyAttendance.ours, area: true, showVals: true },
      { name: 'میانگین منطقه', color: '#cbd5d3', data: DB.weeklyAttendance.school, dash: true, width: 2 },
    ],
    yMin: 80, yMax: 100, suffix: '٪',
  });

  /* دونات توزیع وضعیت تحصیلی */
  donut($('#chartDist'), DB.gradeDist, '۱٬۲۴۸', 'دانش‌آموز');
  $('#distLegend').innerHTML = DB.gradeDist.map(g =>
    `<span class="li"><span class="swatch" style="background:${g.color}"></span>${g.label} (${faNum(g.value)}٪)</span>`
  ).join('');

  /* غایبین امروز */
  const absentees = DB.students.filter(s => DB.todayStatus[s.id] === 'absent' || DB.todayStatus[s.id] === 'late');
  $('#absentList').innerHTML = absentees.map(s => {
    const late = DB.todayStatus[s.id] === 'late';
    const av = AV_CLASSES[hash(s.name) % AV_CLASSES.length];
    return `
    <div class="row-item">
      <span class="avatar sm ${av}">${initials(s.name)}</span>
      <div>
        <div class="t">${s.name}</div>
        <div class="s">پایهٔ ${s.grade} — کلاس ${toFa(s.cls)} • ${late ? 'تأخیر در ورود' : 'غایب'}</div>
      </div>
      <div class="end">
        <span class="status-pill ${late ? 'st-warn' : 'st-danger'}">${late ? 'تأخیر' : 'غایب'}</span>
        <div class="s mt-1"><i class="bi bi-check2-circle text-success"></i> پیام به والدین ارسال شد</div>
      </div>
    </div>`;
  }).join('') || '<div class="empty-hint">امروز غایبی ثبت نشده است 🎉</div>';

  /* برترین‌ها */
  const top = [...DB.students].sort((a, b) => b.gpa - a.gpa).slice(0, 5);
  $('#topList').innerHTML = top.map((s, i) => `
    <div class="row-item">
      <span class="fw-bold text-muted" style="width:1.4rem">${toFa(i + 1)}</span>
      <span class="avatar sm ${AV_CLASSES[i % AV_CLASSES.length]}">${initials(s.name)}</span>
      <div>
        <div class="t">${s.name}</div>
        <div class="s">پایهٔ ${s.grade} — کلاس ${toFa(s.cls)}</div>
        <div class="track mt-1" style="height:6px;background:#edf3f2;border-radius:99px;max-width:170px">
          <div class="fill" style="width:${(s.gpa / 20) * 100}%;background:linear-gradient(90deg,#14b8a6,#0f766e)"></div>
        </div>
      </div>
      <div class="end"><b class="text-success">${faNum(s.gpa, 2)}</b></div>
    </div>`).join('');

  /* تاریخ و خوش‌آمد */
  try {
    const now = new Date();
    const d = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'full' }).format(now);
    $$('[data-today]').forEach(el => el.textContent = d);
    const h = now.getHours();
    $('#greet').textContent = h < 12 ? 'صبح بخیر، خانم مدیر 🌤' : h < 17 ? 'ظهر بخیر، خانم مدیر ☀️' : 'عصر بخیر، خانم مدیر 🌆';
  } catch (e) { /* پشتیبانی نشد */ }
}

/* ============================================================
   دانش‌آموزان
   ============================================================ */
const filterState = { grade: 'all', cls: 'all', status: 'all', q: '' };

function renderStudents() {
  let rows = DB.students.filter(s =>
    (filterState.grade === 'all' || s.grade === filterState.grade) &&
    (filterState.cls === 'all' || s.cls === filterState.cls) &&
    (filterState.status === 'all' || studentStatus(s).label === filterState.status) &&
    (!filterState.q || s.name.includes(filterState.q) || toEn(s.id).includes(toEn(filterState.q)))
  );
  $('#studentTbody').innerHTML = rows.map(s => {
    const st = studentStatus(s);
    const av = AV_CLASSES[hash(s.name) % AV_CLASSES.length];
    const trendChip = s.trend > 0 ? `<span class="chip up"><i class="bi bi-arrow-up-short"></i>${faNum(s.trend, 1)}</span>` : s.trend < 0 ? `<span class="chip down"><i class="bi bi-arrow-down-short"></i>${faNum(Math.abs(s.trend), 1)}</span>` : '<span class="chip flat">ثابت</span>';
    return `
    <tr>
      <td><div class="d-flex align-items-center gap-2">
        <span class="avatar sm ${av}">${initials(s.name)}</span>
        <div><div class="fw-bold" style="font-size:.85rem">${s.name}</div><div class="text-muted" style="font-size:.7rem">کد: ${s.id}</div></div>
      </div></td>
      <td>پایهٔ ${s.grade}</td>
      <td>کلاس ${toFa(s.cls)}</td>
      <td><b>${faNum(s.gpa, 2)}</b> ${trendChip}</td>
      <td>
        <div class="d-flex align-items-center gap-2">
          <div style="width:64px;height:6px;background:#edf3f2;border-radius:99px"><div class="fill" style="width:${s.attend}%;height:100%;border-radius:99px;background:${s.attend >= 90 ? '#10b981' : s.attend >= 80 ? '#f59e0b' : '#e11d48'}"></div></div>
          <span style="font-size:.75rem">${faNum(s.attend)}٪</span>
        </div>
      </td>
      <td><span class="status-pill ${st.cls}">${st.label}</span></td>
      <td class="text-nowrap">
        <button class="btn-icon-ghost" title="مشاهدهٔ پرونده" onclick="openProfile('${s.id}')"><i class="bi bi-eye"></i></button>
        <button class="btn-icon-ghost" title="ویرایش" onclick="toast('در نسخهٔ نمایشی، ویرایش فعال نیست','bi-info-circle')"><i class="bi bi-pencil"></i></button>
        <button class="btn-icon-ghost" title="کارنامه" onclick="gotoReport('${s.id}')"><i class="bi bi-file-earmark-bar-graph"></i></button>
      </td>
    </tr>`;
  }).join('') || '<tr><td colspan="7"><div class="empty-hint">دانش‌آموزی با این مشخصات یافت نشد</div></td></tr>';
  $('#studentCount').textContent = faNum(rows.length);
}

function toEn(v) { return String(v).replace(/[۰-۹]/g, d => FA_DIGITS.indexOf(d)); }

function fillGradeSelect(sel, withAll = true, allLabel = 'همهٔ پایه‌ها') {
  sel.innerHTML = (withAll ? `<option value="all">${allLabel}</option>` : '') + GRADES.map(g => `<option value="${g}">پایهٔ ${g}</option>`).join('');
}
function fillClassSelect(sel, withAll = true) {
  sel.innerHTML = (withAll ? `<option value="all">همهٔ کلاس‌ها</option>` : '') + ['۱', '۲'].map(c => `<option value="${c}">کلاس ${toFa(c)}</option>`).join('');
}

/* پروندهٔ دانش‌آموز (مودال) */
function openProfile(id) {
  const s = DB.students.find(x => x.id === id);
  if (!s) return;
  const st = studentStatus(s);
  const av = AV_CLASSES[hash(s.name) % AV_CLASSES.length];
  const subs = subjectsOf(s);
  const tr = monthTrend(s);
  $('#profileBody').innerHTML = `
    <div class="d-flex align-items-center gap-3 mb-4 flex-wrap">
      <span class="avatar lg ${av}">${initials(s.name)}</span>
      <div class="flex-grow-1">
        <div class="fw-bold fs-5">${s.name} <span class="status-pill ${st.cls} ms-1">${st.label}</span></div>
        <div class="text-muted" style="font-size:.78rem">پایهٔ ${s.grade} • کلاس ${toFa(s.cls)} • کد دانش‌آموزی ${s.id}</div>
      </div>
      <div class="d-flex gap-4 text-center">
        <div><div class="stat-num text-success">${faNum(s.gpa, 2)}</div><div class="stat-label">معدل کل</div></div>
        <div><div class="stat-num text-brand" style="color:var(--brand-600)">${faNum(s.attend)}٪</div><div class="stat-label">حضور</div></div>
        <div><div class="stat-num" style="color:var(--amber)">${faNum(14)}</div><div class="stat-label">روز غیبت سال</div></div>
      </div>
    </div>
    <div class="row g-3 mb-3">
      <div class="col-md-6"><div class="card-soft p-3 h-100"><div class="stat-label mb-1">والدین</div><div class="fw-bold">${s.parent}</div><div class="text-muted" style="font-size:.78rem"><i class="bi bi-telephone"></i> ${s.phone}</div></div></div>
      <div class="col-md-6"><div class="card-soft p-3 h-100"><div class="stat-label mb-1">معلم راهنما</div><div class="fw-bold">${(DB.classes.find(c => c.grade === s.grade && c.cls === s.cls) || {}).teacher || '—'}</div><div class="text-muted" style="font-size:.78rem">کلاس ${toFa(s.cls)} پایهٔ ${s.grade}</div></div></div>
    </div>
    <div class="card-soft p-3 mb-3">
      <div class="d-flex justify-content-between align-items-center mb-2"><b style="font-size:.85rem">روند معدل ماهانه</b><span class="hint text-muted" style="font-size:.7rem">به مقایسه با میانگین کلاس</span></div>
      <div class="chart-wrap" id="profileTrend"></div>
      <div class="legend mt-2">
        <span class="li"><span class="swatch" style="background:#0d9488"></span>این دانش‌آموز</span>
        <span class="li"><span class="swatch" style="background:#cbd5d3"></span>میانگین کلاس</span>
      </div>
    </div>
    <div class="table-responsive" style="max-height:260px;overflow-y:auto">
      <table class="table table-clean">
        <thead><tr><th>درس</th><th>مستمر</th><th>میان‌ترم</th><th>پایان‌ترم</th><th>نهایی</th><th>دبیر</th></tr></thead>
        <tbody>
          ${subs.map(r => `<tr><td class="fw-bold">${r.subject}</td><td>${faNum(r.m1, 2)}</td><td>${faNum(r.mid, 2)}</td><td>${faNum(r.fin, 2)}</td><td><b class="text-success">${faNum(r.total, 2)}</b></td><td class="text-muted" style="font-size:.75rem">${r.teacher}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>`;
  lineChart($('#profileTrend'), {
    labels: tr.labels,
    series: [
      { name: 'دانش‌آموز', color: '#0d9488', data: tr.ours, area: true },
      { name: 'میانگین کلاس', color: '#cbd5d3', data: tr.cls, dash: true, width: 2 },
    ],
    yMin: 10, yMax: 20,
  });
  bootstrap.Modal.getOrCreateInstance($('#profileModal')).show();
}

function gotoReport(id) {
  $('#reportStudent').value = id;
  renderReport();
  showView('reports');
}

/* ============================================================
   حضور و غیاب
   ============================================================ */
const attState = { grade: 'نهم', cls: '۱', statuses: {} };

function renderAttendance() {
  const rows = DB.students.filter(s => s.grade === attState.grade && s.cls === attState.cls);
  if (!rows.some(s => attState.statuses[s.id])) {
    rows.forEach(s => attState.statuses[s.id] = DB.todayStatus[s.id] || 'present');
  }
  $('#attTbody').innerHTML = rows.map(s => {
    const cur = attState.statuses[s.id];
    const av = AV_CLASSES[hash(s.name) % AV_CLASSES.length];
    const seg = [['present', 'حاضر', 'bi-check-circle'], ['absent', 'غایب', 'bi-x-circle'], ['late', 'تأخیر', 'bi-clock'], ['excused', 'مجوز', 'bi-file-earmark-text']]
      .map(([v, l, ic]) => `<button type="button" class="seg-btn ${cur === v ? v : ''}" onclick="setStatus('${s.id}','${v}')"><i class="bi ${ic}"></i>${l}</button>`).join('');
    return `
    <tr>
      <td><div class="d-flex align-items-center gap-2">
        <span class="avatar sm ${av}">${initials(s.name)}</span>
        <div><div class="fw-bold" style="font-size:.85rem">${s.name}</div><div class="text-muted" style="font-size:.7rem">کد: ${s.id}</div></div>
      </div></td>
      <td>${s.parent}</td>
      <td>${s.phone}</td>
      <td><div class="seg">${seg}</div></td>
      <td><span class="status-pill ${cur === 'present' ? 'st-excellent' : cur === 'absent' ? 'st-danger' : cur === 'late' ? 'st-warn' : 'st-info'}" id="pill-${s.id}"></span></td>
    </tr>`;
  }).join('');
  rows.forEach(s => updatePill(s.id));
  updateAttSummary();
  updateSmsPreview();
}

function setStatus(id, v) {
  attState.statuses[id] = v;
  renderAttendance();
}

function updatePill(id) {
  const v = attState.statuses[id];
  const map = { present: ['حاضر', 'st-excellent'], absent: ['غایب', 'st-danger'], late: ['تأخیر', 'st-warn'], excused: ['مجوز', 'st-info'] };
  const el = document.getElementById(`pill-${id}`);
  if (el) { const [t, c] = map[v]; el.textContent = t; el.className = `status-pill ${c}`; }
}

function updateAttSummary() {
  const vals = Object.values(attState.statuses);
  const count = v => vals.filter(x => x === v).length;
  $('#cntPresent').textContent = faNum(count('present'));
  $('#cntAbsent').textContent = faNum(count('absent'));
  $('#cntLate').textContent = faNum(count('late'));
  $('#cntExcused').textContent = faNum(count('excused'));
}

function updateSmsPreview() {
  const absent = DB.students.filter(s => attState.statuses[s.id] === 'absent');
  const late = DB.students.filter(s => attState.statuses[s.id] === 'late');
  const all = [...absent, ...late];
  const box = $('#smsBox');
  if (!all.length) {
    box.innerHTML = `<div class="empty-hint mb-0">همهٔ دانش‌آموزان این کلاس حاضر هستند — پیامی برای ارسال وجود ندارد 🌿</div>`;
    $('#btnNotify').disabled = true;
    return;
  }
  const s = all[0];
  const kindText = absent.includes(s) ? 'در مدرسه حاضر نشد' : 'با تأخیر وارد مدرسه شد';
  box.innerHTML = `
    <div class="sms-head"><i class="bi bi-send-fill"></i> پیش‌نمایش پیامک اطلاع‌رسانی — ${faNum(all.length)} مخاطب</div>
    <div class="mb-2 text-white-50" style="font-size:.72rem">به: ${all.map(x => 'والدین ' + x.name.split(' ')[0] + ' ' + x.name.split(' ')[1] + ' (' + x.phone + ')').join(' ، ')}</div>
    «والدین محترم ${s.parent}؛ فرزند شما ${s.name} امروز ${kindText}. لطفاً جهت هماهنگی با مدرسه تماس بگیرید. — مدیریت مدرسهٔ نمونهٔ پایش»
    <div class="mt-2"><span class="chip up"><i class="bi bi-lightning-charge-fill"></i> ارسال خودکار بلافاصله پس از ثبت</span></div>`;
  $('#btnNotify').disabled = false;
}

function submitAttendance() {
  const absent = DB.students.filter(s => attState.statuses[s.id] === 'absent' || attState.statuses[s.id] === 'late');
  let sent = 0;
  absent.forEach(s => {
    const isAbsent = attState.statuses[s.id] === 'absent';
    DB.messages.unshift({
      date: 'امروز — همین حالا',
      name: s.name,
      type: isAbsent ? 'absent' : 'late',
      text: isAbsent ? `والدین محترم؛ فرزند شما ${s.name} امروز در مدرسه حاضر نشد.` : `والدین محترم؛ فرزند شما ${s.name} امروز با تأخیر وارد مدرسه شد.`,
      state: 'تحویل شد',
    });
    sent++;
    setTimeout(() => toast(`پیامک اطلاع‌رسانی به والدین «${s.name}» ارسال شد`, 'bi-send-check-fill'), sent * 450);
  });
  renderMessages();
  $('#navMsgBadge').textContent = faNum(DB.messages.length);
  if (sent) setTimeout(() => toast('وضعیت حضور و غیاب امروز با موفقیت ثبت شد', 'bi-calendar-check-fill'), 120);
  else toast('وضعیت ثبت شد؛ غایبی برای اطلاع‌رسانی وجود ندارد', 'bi-check-circle');
}

/* ============================================================
   نمرات و امتحانات
   ============================================================ */
function renderGradeEntry() {
  const exam = DB.exams.filter(e => e.state === 'برگزار شده')[0];
  if (!exam) return;
  fillExamSelect();
  $('#gradeExam').value = exam.title;
  const rows = DB.students.filter(s => s.grade === exam.grade);
  $('#gradeTbody').innerHTML = rows.map((s, i) => {
    const av = AV_CLASSES[hash(s.name) % AV_CLASSES.length];
    const def = Math.round((s.gpa + rnd(hash(s.name + exam.title)) * 5 - 2.5) * 4) / 4;
    return `
    <tr>
      <td>${toFa(i + 1)}</td>
      <td><div class="d-flex align-items-center gap-2"><span class="avatar sm ${av}">${initials(s.name)}</span><div class="fw-bold" style="font-size:.85rem">${s.name}</div></div></td>
      <td class="text-muted" style="font-size:.78rem">کلاس ${toFa(s.cls)}</td>
      <td><input type="number" class="form-control form-control-sm text-center" style="max-width:90px" min="0" max="${exam.max}" step="0.25" value="${toFa(def)}" dir="ltr"></td>
      <td><input type="text" class="form-control form-control-sm input-note" placeholder="توضیح دلخواه..."></td>
      <td><span class="status-pill st-excellent">معتبر</span></td>
    </tr>`;
  }).join('');
  $('#gradeExamInfo').textContent = `${exam.subject} • پایهٔ ${exam.grade} • ${exam.kind} • حداکثر نمره: ${toFa(exam.max)}`;
}

function fillExamSelect() {
  $('#gradeExam').innerHTML = DB.exams.filter(e => e.state === 'برگزار شده').map(e => `<option>${e.title}</option>`).join('');
}
function onExamChange() {
  const t = $('#gradeExam').value;
  const exam = DB.exams.find(e => e.title === t);
  if (exam) renderGradeEntryFor(exam);
}
function renderGradeEntryFor(exam) {
  const rows = DB.students.filter(s => s.grade === exam.grade);
  $('#gradeTbody').innerHTML = rows.map((s, i) => {
    const av = AV_CLASSES[hash(s.name) % AV_CLASSES.length];
    const def = Math.round((s.gpa + rnd(hash(s.name + exam.title)) * 5 - 2.5) * 4) / 4;
    return `
    <tr>
      <td>${toFa(i + 1)}</td>
      <td><div class="d-flex align-items-center gap-2"><span class="avatar sm ${av}">${initials(s.name)}</span><div class="fw-bold" style="font-size:.85rem">${s.name}</div></div></td>
      <td class="text-muted" style="font-size:.78rem">کلاس ${toFa(s.cls)}</td>
      <td><input type="number" class="form-control form-control-sm text-center" style="max-width:90px" min="0" max="${exam.max}" step="0.25" value="${toFa(def)}" dir="ltr"></td>
      <td><input type="text" class="form-control form-control-sm input-note" placeholder="توضیح دلخواه..."></td>
      <td><span class="status-pill st-excellent">معتبر</span></td>
    </tr>`;
  }).join('');
  $('#gradeExamInfo').textContent = `${exam.subject} • پایهٔ ${exam.grade} • ${exam.kind} • حداکثر نمره: ${toFa(exam.max)}`;
}

function renderExams() {
  $('#examsTbody').innerHTML = DB.exams.map(e => `
    <tr>
      <td class="fw-bold">${e.title}</td>
      <td>${e.subject}</td>
      <td>پایهٔ ${e.grade}</td>
      <td>${e.date}</td>
      <td><span class="status-pill ${e.kind === 'پایانی' ? 'st-danger' : e.kind === 'میان‌ترم' ? 'st-warn' : 'st-info'}">${e.kind}</span></td>
      <td>${toFa(e.max)}</td>
      <td><span class="status-pill ${e.state === 'برگزار شده' ? 'st-excellent' : 'st-info'}">${e.state}</span></td>
      <td class="text-nowrap">
        <button class="btn-icon-ghost" title="مشاهدهٔ نتایج" onclick="toast('نتایج این امتحان در نسخهٔ نمایشی موجود نیست','bi-info-circle')"><i class="bi bi-clipboard-data"></i></button>
        <button class="btn-icon-ghost danger" title="حذف" onclick="toast('در نسخهٔ نمایشی، حذف فعال نیست','bi-info-circle')"><i class="bi bi-trash"></i></button>
      </td>
    </tr>`).join('');
}

function addExam() {
  const title = $('#examTitle').value.trim() || 'امتحان بدون عنوان';
  const e = {
    title,
    subject: $('#examSubject').value || 'عمومی',
    grade: $('#examGrade').value,
    date: $('#examDate').value || '۱۴۰۳/۱۰/۱۰',
    kind: $('#examKind').value,
    max: Number($('#examMax').value) || 20,
    state: 'پیش‌رو',
  };
  DB.exams.unshift(e);
  renderExams();
  bootstrap.Modal.getInstance($('#examModal')).hide();
  $('#examForm').reset();
  toast(`امتحان «${title}» اضافه شد`, 'bi-journal-plus');
}

/* ============================================================
   گزارش‌ها
   ============================================================ */
let currentReport = null;

function renderReport() {
  const id = $('#reportStudent').value;
  const s = DB.students.find(x => x.id === id) || DB.students[0];
  currentReport = s;
  const st = studentStatus(s);
  const av = AV_CLASSES[hash(s.name) % AV_CLASSES.length];
  const rank = [...DB.students].sort((a, b) => b.gpa - a.gpa).findIndex(x => x.id === s.id) + 1;
  const subs = subjectsOf(s);
  const tr = monthTrend(s);
  const weak = [...subs].sort((a, b) => a.total - b.total)[0];
  const strong = [...subs].sort((a, b) => b.total - a.total)[0];

  $('#reportHead').innerHTML = `
    <div class="d-flex align-items-center gap-3 flex-wrap">
      <span class="avatar lg ${av}">${initials(s.name)}</span>
      <div class="flex-grow-1">
        <div class="fw-bold fs-5">${s.name}</div>
        <div class="text-muted" style="font-size:.78rem">پایهٔ ${s.grade} • کلاس ${toFa(s.cls)} • سال تحصیلی ۱۴۰۳–۱۴۰۴</div>
      </div>
      <div class="d-flex gap-4 text-center flex-wrap">
        <div><div class="stat-num text-success">${faNum(s.gpa, 2)}</div><div class="stat-label">معدل کل</div></div>
        <div><div class="stat-num" style="color:var(--brand-600)">${toFa(rank)}</div><div class="stat-label">رتبه در مدرسه</div></div>
        <div><div class="stat-num" style="color:var(--amber)">${faNum(s.attend)}٪</div><div class="stat-label">درصد حضور</div></div>
        <div><div class="stat-num" style="color:var(--rose)">${faNum(14)}</div><div class="stat-label">روز غیبت</div></div>
      </div>
    </div>`;

  $('#reportInsight').innerHTML = `
    <div class="d-flex flex-wrap gap-2">
      <span class="chip ${s.trend >= 0 ? 'up' : 'down'}"><i class="bi bi-graph-${s.trend >= 0 ? 'up' : 'down'}-arrow"></i> روند ${s.trend >= 0 ? 'صعودی' : 'نزولی'} — ${faNum(Math.abs(s.trend), 1)} نمره</span>
      <span class="chip flat"><i class="bi bi-award"></i> قوی‌ترین درس: ${strong.subject}</span>
      <span class="chip down"><i class="bi bi-exclamation-triangle"></i> نیازمند تقویت: ${weak.subject}</span>
      <span class="chip flat"><i class="bi bi-person-check"></i> معلم راهنما: ${(DB.classes.find(c => c.grade === s.grade && c.cls === s.cls) || {}).teacher || '—'}</span>
    </div>`;

  lineChart($('#chartTrend'), {
    labels: tr.labels,
    series: [
      { name: 'این دانش‌آموز', color: '#0d9488', data: tr.ours, area: true, showVals: true },
      { name: 'میانگین کلاس', color: '#cbd5d3', data: tr.cls, dash: true, width: 2 },
    ],
    yMin: 10, yMax: 20,
  });

  const bars = subs.map(r => `
    <div class="h-bar">
      <div class="h-top"><b>${r.subject}</b><span style="color:${r.total >= 17 ? '#047857' : r.total >= 14 ? '#b45309' : '#be123c'}">${faNum(r.total, 2)}</span></div>
      <div class="track"><div class="fill" style="width:${(r.total / 20) * 100}%;background:${r.total >= 17 ? 'linear-gradient(90deg,#34d399,#059669)' : r.total >= 14 ? 'linear-gradient(90deg,#2dd4bf,#0f766e)' : 'linear-gradient(90deg,#fb7185,#e11d48)'}"></div></div>
    </div>`).join('');
  $('#subjectBars').innerHTML = bars;

  $('#reportTable').innerHTML = subs.map(r => `
    <tr>
      <td class="fw-bold">${r.subject}</td>
      <td>${faNum(r.m1, 2)}</td>
      <td>${faNum(r.mid, 2)}</td>
      <td>${faNum(r.fin, 2)}</td>
      <td><b class="text-success">${faNum(r.total, 2)}</b></td>
      <td><span class="status-pill ${r.total >= 17 ? 'st-excellent' : r.total >= 14 ? 'st-good' : r.total >= 12 ? 'st-warn' : 'st-danger'}">${r.total >= 17 ? 'عالی' : r.total >= 14 ? 'خوب' : r.total >= 12 ? 'قابل قبول' : 'نیازمند تلاش'}</span></td>
      <td class="text-muted" style="font-size:.75rem">${r.teacher}</td>
    </tr>`).join('');

  const attItems = [
    { label: 'حاضر', value: 112, color: '#10b981' },
    { label: 'غایب', value: 8, color: '#e11d48' },
    { label: 'تأخیر', value: 5, color: '#f59e0b' },
    { label: 'مجوز', value: 3, color: '#94a3b8' },
  ];
  donut($('#chartAtt'), attItems, '۹۰٪', 'حضور سال جاری');
  $('#attLegend').innerHTML = attItems.map(g => `<span class="li"><span class="swatch" style="background:${g.color}"></span>${g.label}: ${faNum(g.value)} روز</span>`).join('');
}

function printReport() {
  if ($('#view-reports').classList.contains('d-none')) showView('reports');
  setTimeout(() => window.print(), 250);
}

/* ============================================================
   دستیار هوشمند (پاسخ‌های نمایشیِ سمت مرورگر)
   ============================================================ */
const AI_SUGGESTIONS = [
  'وضعیت علی رضایی چطور است؟',
  'غیبت‌های امیر قاسمی را بررسی کن',
  'ضعیف‌ترین درس محمد حسینی چیست؟',
  'برترین‌های مدرسه را معرفی کن',
  'مقایسهٔ معدل سارا موسوی با کلاس',
];

function aiBubble(text, who = 'ai', html = false) {
  const body = $('#chatBody');
  const wrap = document.createElement('div');
  wrap.className = `msg ${who}`;
  const av = who === 'ai'
    ? '<span class="avatar sm bg-soft-brand" style="color:var(--brand-700);background:var(--brand-soft)"><i class="bi bi-robot"></i></span>'
    : '<span class="avatar sm av-teal"><i class="bi bi-person-fill"></i></span>';
  wrap.innerHTML = `${av}<div><div class="who">${who === 'ai' ? 'دستیار هوشمند' : 'شما'}</div><div class="bubble">${text}</div></div>`;
  body.appendChild(wrap);
  body.scrollTop = body.scrollHeight;
}

function aiThinking(on) {
  const body = $('#chatBody');
  let t = $('#typingRow');
  if (on && !t) {
    t = document.createElement('div');
    t.id = 'typingRow'; t.className = 'msg ai';
    t.innerHTML = '<span class="avatar sm" style="background:var(--brand-soft);color:var(--brand-700)"><i class="bi bi-robot"></i></span><div><div class="who">دستیار هوشمند</div><div class="bubble p-0"><div class="typing"><span></span><span></span><span></span></div></div></div>';
    body.appendChild(t);
  } else if (!on && t) t.remove();
  body.scrollTop = body.scrollHeight;
}

function findStudent(q) {
  return DB.students.find(s => q.includes(s.name)) || DB.students.find(s => s.name.split(' ')[0] && q.includes(s.name.split(' ')[0]));
}

function aiAnswer(q) {
  const s = findStudent(q);
  if (/برترین|بهترین/.test(q)) {
    const top = [...DB.students].sort((a, b) => b.gpa - a.gpa).slice(0, 3);
    return `بر اساس داده‌های سامانه، برترین دانش‌آموزان این ماه:<ul class="mini-list">${top.map((x, i) => `<li><span>${toFa(i + 1)}. ${x.name}</span><b>${faNum(x.gpa, 2)}</b></li>`).join('')}</ul>`;
  }
  if (s) {
    const st = studentStatus(s);
    const subs = subjectsOf(s);
    const weak = [...subs].sort((a, b) => a.total - b.total)[0];
    const strong = [...subs].sort((a, b) => b.total - a.total)[0];
    const clsAvg = gradeClassAvg(s.grade);
    const absDays = Math.round(((100 - s.attend) / 100) * 126);
    if (/غیبت|حضور|تأخیر|تاخیر/.test(q)) {
      return `تحلیل حضور «${s.name}»:<ul class="mini-list">
        <li><span>درصد حضور سال</span><b>${faNum(s.attend)}٪</b></li>
        <li><span>روزهای غیبت</span><b>${faNum(absDays)} روز</b></li>
        <li><span>وضعیت امروز</span><b>${DB.todayStatus[s.id] === 'absent' ? 'غایب' : DB.todayStatus[s.id] === 'late' ? 'تأخیر' : 'حاضر'}</b></li>
      </ul>${s.attend < 85 ? '⚠️ غیبت‌های این دانش‌آموز بالاتر از حد مجاز است؛ پیشنهاد می‌کنم با والدین جلسه‌ای برگزار شود.' : 'حضور این دانش‌آموز در وضعیت مناسبی است.'}`;
    }
    if (/مقایسه|کلاس|میانگین/.test(q)) {
      const diff = s.gpa - clsAvg;
      return `مقایسهٔ «${s.name}» با میانگین کلاس ${toFa(s.cls)} پایهٔ ${s.grade}:<ul class="mini-list">
        <li><span>معدل دانش‌آموز</span><b>${faNum(s.gpa, 2)}</b></li>
        <li><span>میانگین کلاس</span><b>${faNum(Math.round(clsAvg * 100) / 100, 2)}</b></li>
        <li><span>اختلاف</span><b style="color:${diff >= 0 ? '#059669' : '#e11d48'}">${diff >= 0 ? '+' : '−'}${faNum(Math.abs(Math.round(diff * 100) / 100), 2)}</b></li>
      </ul>${diff >= 0 ? 'این دانش‌آموز بالاتر از میانگین کلاس قرار دارد.' : 'این دانش‌آموز کمی پایین‌تر از میانگین کلاس است.'}`;
    }
    if (/ضعیف|تقویت|پیشنهاد|توصیه/.test(q)) {
      return `تحلیل درسی «${s.name}»:<ul class="mini-list">
        <li><span>ضعیف‌ترین درس</span><b>${weak.subject} (${faNum(weak.total, 2)})</b></li>
        <li><span>قوی‌ترین درس</span><b>${strong.subject} (${faNum(strong.total, 2)})</b></li>
      </ul>پیشنهاد: حضور در کلاس‌های تقویتی ${weak.subject} و ثبت نمرات آزمون‌های مستمر بعدی برای پایش روند بهبود.`;
    }
    /* پاسخ عمومی وضعیت */
    return `خلاصهٔ وضعیت «${s.name}»:<ul class="mini-list">
      <li><span>وضعیت تحصیلی</span><b>${st.label}</b></li>
      <li><span>معدل</span><b>${faNum(s.gpa, 2)}</b></li>
      <li><span>حضور</span><b>${faNum(s.attend)}٪</b></li>
      <li><span>روند</span><b>${s.trend >= 0 ? 'صعودی +' + faNum(s.trend, 1) : 'نزولی −' + faNum(Math.abs(s.trend), 1)}</b></li>
    </ul>برای تحلیل دقیق‌تر می‌توانید بپرسید: «ضعیف‌ترین درس ${s.name.split(' ')[0]} چیست؟» یا «مقایسه با میانگین کلاس».`;
  }
  return 'برای تحلیل، نام دانش‌آموز را در پرسش ذکر کنید یا از پیشنهادهای آماده استفاده کنید. من به داده‌های حضور و غیاب، نمرات و امتحانات همین سامانه دسترسی دارم. 📊';
}

function sendChat(text) {
  const q = (text ?? $('#chatInput').value).trim();
  if (!q) return;
  $('#chatInput').value = '';
  aiBubble(q, 'me');
  aiThinking(true);
  setTimeout(() => { aiThinking(false); aiBubble(aiAnswer(q)); }, 900 + rnd(hash(q)) * 700);
}

/* ============================================================
   پیام‌های والدین
   ============================================================ */
const TYPE_MAP = {
  absent: ['اطلاع‌رسانی غیبت', 'st-danger'],
  late: ['اطلاع‌رسانی تأخیر', 'st-warn'],
  warn: ['هشدار تحصیلی', 'st-info'],
  praise: ['تقدیر و تشویق', 'st-excellent'],
  manual: ['پیام دستی', 'st-info'],
};

function renderMessages() {
  const today = DB.messages.filter(m => m.date.startsWith('امروز')).length;
  $('#msgToday').textContent = faNum(today);
  $('#msgDelivered').textContent = faNum(DB.messages.filter(m => m.state === 'تحویل شد').length);
  $('#msgPending').textContent = faNum(DB.messages.filter(m => m.state === 'در انتظار').length);
  $('#msgTbody').innerHTML = DB.messages.map(m => {
    const [label, cls] = TYPE_MAP[m.type] || TYPE_MAP.manual;
    return `
    <tr>
      <td class="text-muted text-nowrap" style="font-size:.76rem">${m.date}</td>
      <td class="fw-bold">${m.name}</td>
      <td><span class="status-pill ${cls}">${label}</span></td>
      <td style="max-width:340px"><span class="d-inline-block text-truncate" style="max-width:330px" title="${m.text}">${m.text}</span></td>
      <td><span class="status-pill ${m.state === 'تحویل شد' ? 'st-excellent' : 'st-warn'}">${m.state}</span></td>
      <td><button class="btn-icon-ghost" title="مشاهدهٔ کامل" onclick="toast('نمایش کامل پیام در نسخهٔ نمایشی','bi-info-circle')"><i class="bi bi-envelope-open"></i></button></td>
    </tr>`;
  }).join('');
}

function sendMessageToParent() {
  const name = $('#msgStudent').value;
  const text = $('#msgText').value.trim() || 'پیام آزمایشی از سامانهٔ پایش هوشمند.';
  DB.messages.unshift({ date: 'امروز — همین حالا', name, type: 'manual', text, state: 'در انتظار' });
  renderMessages();
  bootstrap.Modal.getInstance($('#msgModal')).hide();
  $('#msgForm').reset();
  toast(`پیام برای «${name}» در صف ارسال قرار گرفت`, 'bi-send-fill');
}

/* ============================================================
   معلمان و کلاس‌ها
   ============================================================ */
function renderTeachers() {
  $('#teacherGrid').innerHTML = DB.teachers.map(t => `
    <div class="col-12 col-md-6 col-xl-3">
      <div class="card-soft teacher-card">
        <div class="d-flex align-items-center gap-3 mb-2">
          <span class="avatar ${t.av}">${initials(t.name)}</span>
          <div><div class="fw-bold" style="font-size:.9rem">${t.name}</div><div class="text-muted" style="font-size:.72rem">${t.role}</div></div>
        </div>
        <div class="mb-2">${t.tag.map(x => `<span class="subject-tag">${x}</span>`).join('')}</div>
        <div class="d-flex justify-content-between text-muted" style="font-size:.74rem">
          <span><i class="bi bi-easel2"></i> ${t.classes}</span>
        </div>
        <div class="d-flex justify-content-between align-items-center mt-2 pt-2" style="border-top:1px dashed var(--line)">
          <span class="text-muted" style="font-size:.74rem">تعداد دانش‌آموز</span><b>${faNum(t.count)}</b>
        </div>
      </div>
    </div>`).join('');

  $('#classesTbody').innerHTML = DB.classes.map(c => `
    <tr>
      <td class="fw-bold">پایهٔ ${c.grade}</td>
      <td>کلاس ${toFa(c.cls)}</td>
      <td>${c.teacher}</td>
      <td>${faNum(c.count)} نفر</td>
      <td><b class="text-success">${faNum(c.avg, 1)}</b></td>
      <td>
        <div style="width:90px;height:6px;background:#edf3f2;border-radius:99px">
          <div class="fill" style="width:${(c.avg / 20) * 100}%;height:100%;border-radius:99px;background:linear-gradient(90deg,#2dd4bf,#0f766e)"></div>
        </div>
      </td>
    </tr>`).join('');
}

function addTeacher() {
  const name = $('#teacherName').value.trim();
  if (!name) return toast('لطفاً نام معلم را وارد کنید', 'bi-exclamation-circle');
  const t = {
    name,
    role: 'دبیر ' + ($('#teacherSubject').value || 'درس جدید'),
    classes: $('#teacherClasses').value || '—',
    count: 0, av: AV_CLASSES[hash(name) % AV_CLASSES.length],
    tag: [$('#teacherSubject').value || 'درس جدید'],
  };
  DB.teachers.unshift(t);
  renderTeachers();
  bootstrap.Modal.getInstance($('#teacherModal')).hide();
  $('#teacherForm').reset();
  toast(`معلم «${name}» اضافه شد`, 'bi-person-plus-fill');
}

function addStudent() {
  const name = $('#stName').value.trim();
  if (!name) return toast('لطفاً نام دانش‌آموز را وارد کنید', 'bi-exclamation-circle');
  const s = {
    id: toFa(String(1056 + DB.students.length)),
    name,
    grade: $('#stGrade').value,
    cls: $('#stClass').value,
    gpa: Number($('#stGpa').value) || 15,
    attend: Number($('#stAttend').value) || 90,
    trend: 0,
    parent: $('#stParent').value || '—',
    phone: $('#stPhone').value || '—',
  };
  DB.students.push(s);
  filterState.grade = 'all'; filterState.cls = 'all'; filterState.status = 'all'; filterState.q = '';
  $('#searchStudent').value = '';
  fillGradeSelect($('#fGrade')); fillClassSelect($('#fClass'));
  renderStudents();
  bootstrap.Modal.getInstance($('#studentModal')).hide();
  $('#studentForm').reset();
  toast(`دانش‌آموز «${name}» به سامانه اضافه شد`, 'bi-person-plus-fill');
}

/* ============================================================
   رویدادها و راه‌اندازی
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  /* ناوبری */
  $$('.side-link').forEach(a => a.addEventListener('click', e => { e.preventDefault(); showView(a.dataset.view); }));
  $('#burger').addEventListener('click', openSidebar);
  $('.backdrop').addEventListener('click', closeSidebar);

  /* پر کردن انتخاب‌گرها */
  fillGradeSelect($('#fGrade'));
  fillClassSelect($('#fClass'));
  fillGradeSelect($('#stGrade'), false, '');
  $('#reportStudent').innerHTML = DB.students.map(s => `<option value="${s.id}">${s.name} — پایهٔ ${s.grade} ${toFa(s.cls)}</option>`).join('');
  $('#reportStudent').value = '۱۰۴۲';
  $('#msgStudent').innerHTML = DB.students.map(s => `<option>${s.name}</option>`).join('');
  $('#examGrade').innerHTML = GRADES.map(g => `<option>${g}</option>`).join('');
  $('#examSubject').innerHTML = Object.keys(TEACHER_OF).map(s => `<option>${s}</option>`).join('');

  /* فیلترهای دانش‌آموزان */
  $('#fGrade').addEventListener('change', e => { filterState.grade = e.target.value; renderStudents(); });
  $('#fClass').addEventListener('change', e => { filterState.cls = e.target.value; renderStudents(); });
  $('#fStatus').addEventListener('change', e => { filterState.status = e.target.value; renderStudents(); });
  $('#searchStudent').addEventListener('input', e => { filterState.q = e.target.value.trim(); renderStudents(); });

  /* حضور و غیاب */
  fillGradeSelect($('#attGrade'), false, '');
  fillClassSelect($('#attClass'), false);
  $('#attGrade').value = 'نهم'; $('#attClass').value = '۱';
  $('#attGrade').addEventListener('change', e => { attState.grade = e.target.value; attState.statuses = {}; renderAttendance(); });
  $('#attClass').addEventListener('change', e => { attState.cls = e.target.value; attState.statuses = {}; renderAttendance(); });
  $('#btnNotify').addEventListener('click', submitAttendance);
  try {
    const d = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'full' }).format(new Date());
    $('#attDate').textContent = d;
  } catch (e) { $('#attDate').textContent = 'چهارشنبه ۲۱ آذر ۱۴۰۳'; }

  /* نمرات */
  $('#gradeExam').addEventListener('change', onExamChange);
  $('#btnSaveGrades').addEventListener('click', () => toast('نمرات ثبت شد (نمایشی — ذخیره‌سازی واقعی در نسخهٔ نهایی)', 'bi-journal-check'));
  $$('[data-tab]').forEach(b => b.addEventListener('click', () => {
    $$('[data-tab]').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    $('#paneEntry').classList.toggle('d-none', b.dataset.tab !== 'entry');
    $('#paneExams').classList.toggle('d-none', b.dataset.tab !== 'exams');
  }));

  /* گزارش */
  $('#reportStudent').addEventListener('change', renderReport);
  $('#btnReport').addEventListener('click', renderReport);
  $('#btnPrint').addEventListener('click', printReport);

  /* چت هوشمند */
  $('#btnSend').addEventListener('click', () => sendChat());
  $('#chatInput').addEventListener('keydown', e => { if (e.key === 'Enter') sendChat(); });
  $('#sugChips').innerHTML = AI_SUGGESTIONS.map(s => `<button type="button">${s}</button>`).join('');
  $$('#sugChips button').forEach(b => b.addEventListener('click', () => sendChat(b.textContent)));

  /* پیام‌ها */
  $('#btnNewMsg').addEventListener('click', () => new bootstrap.Modal('#msgModal').show());
  $('#btnSendMsg').addEventListener('click', sendMessageToParent);

  /* مودال‌های افزودن */
  $('#btnAddStudent').addEventListener('click', () => new bootstrap.Modal('#studentModal').show());
  $('#btnSaveStudent').addEventListener('click', addStudent);
  $('#btnAddExam').addEventListener('click', () => new bootstrap.Modal('#examModal').show());
  $('#btnSaveExam').addEventListener('click', addExam);
  $('#btnAddTeacher').addEventListener('click', () => new bootstrap.Modal('#teacherModal').show());
  $('#btnSaveTeacher').addEventListener('click', addTeacher);

  /* رندر اولیه */
  renderDashboard();
  renderStudents();
  renderAttendance();
  renderGradeEntry();
  renderExams();
  renderReport();
  renderMessages();
  renderTeachers();
  aiBubble('سلام! من دستیار هوشمند مدرسه هستم 🤖<br>بر اساس داده‌های همین سامانه (حضور و غیاب، نمرات و امتحانات) می‌توانم وضعیت هر دانش‌آموز را تحلیل کنم. سؤالت را بپرس یا یکی از پیشنهادهای زیر را انتخاب کن.');
  showView('dashboard');
});
