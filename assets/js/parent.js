/* ============================================================
   پورتال خانواده — منطق نمایشی (parent.html)
   ⚠️ این فایل هیچ دادهٔ تستی‌ای در خود ندارد؛ همهٔ داده‌ها
   (معدل، روند ماهانه، حضور و غیاب، نمرات دروس) مستقیماً داخل
   تگ‌های HTML (data-attribute ها) تعریف شده‌اند و اینجا فقط
   خوانده و به نمودار SVG ترسیم می‌شوند.
   در نسخهٔ نهایی: پس از ورود خانواده با شمارهٔ تلفن، همین
   تگ‌ها به‌صورت پویا با اطلاعات فرزند همان خانواده پر می‌شوند.
   ============================================================ */
'use strict';

/* ---------- ابزارهای کمکی (مشابه app.js) ---------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
function toFa(v) { return String(v).replace(/\d/g, d => FA_DIGITS[+d]).replace(/\./g, '٫'); }
function numList(str) { return String(str || '').split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x)); }

/* ============================================================
   اسپارک‌لاین کوچک کارت‌های آمار (۹۶×۳۴ — راست به چپ)
   داده از data-points و data-color خوانده می‌شود
   ============================================================ */
function sparkSVG(points, color) {
  if (points.length < 2) return '';
  const W = 96, H = 34, P = 4;
  const min = Math.min(...points), max = Math.max(...points);
  const span = (max - min) || 1;
  const step = (W - P * 2) / (points.length - 1);
  /* RTL: قدیمی‌ترین مقدار سمت راست، جدیدترین سمت چپ */
  const pts = points.map((v, i) => [W - P - i * step, H - P - ((v - min) / span) * (H - P * 2)]);
  const line = pts.map(p => p.map(n => Math.round(n * 100) / 100).join(',')).join(' ');
  const last = pts[pts.length - 1];
  return `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true">
    <polyline points="${line}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></polyline>
    <circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="3.2" fill="${color}"></circle>
  </svg>`;
}

/* ============================================================
   نمودار خطی روند معدل ماهانه (۶۴۰×۲۵۰ — مثل سایت مدیر)
   داده از #trendCard: data-months / data-student / data-class
   ============================================================ */
function smoothPath(pts) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return d;
}

function trendChartSVG(months, student, klass) {
  const W = 640, H = 250, X0 = 14, X1 = 596, Y0 = 16, Y1 = 216;
  const yOf = v => Y1 - ((v - 15) / 5) * (Y1 - Y0);         /* دامنهٔ نمره: ۱۵ تا ۲۰ */
  const n = student.length;
  const step = (X1 - X0) / (n - 1);
  const xOf = i => X1 - i * step;                            /* RTL: ماه اول سمت راست */

  /* خطوط راهنما */
  let grid = '';
  [15, 16, 17, 18, 19, 20].forEach(v => {
    const y = yOf(v);
    grid += `<line x1="${X0}" x2="${X1}" y1="${y}" y2="${y}" stroke="#e6efee" stroke-dasharray="3 4"></line>`;
    grid += `<text x="604" y="${y + 4}" font-size="10" fill="#9ab3ae" text-anchor="start" font-weight="500">${toFa(v)}</text>`;
  });

  /* برچسب ماه‌ها */
  const labels = months.map((m, i) =>
    `<text x="${xOf(i)}" y="240" font-size="10.5" fill="#7d948f" text-anchor="middle" font-weight="500">${m}</text>`).join('');

  /* خط دانش‌آموز + ناحیهٔ گرادیانی */
  const pts = student.map((v, i) => [xOf(i), yOf(v)]);
  const line = smoothPath(pts);
  const area = `${line} L ${X0} ${Y1} L ${X1} ${Y1} Z`;
  const dots = pts.map((p, i) =>
    `<circle cx="${p[0].toFixed(2)}" cy="${p[1].toFixed(2)}" r="4" fill="#fff" stroke="#0d9488" stroke-width="2.5"></circle>
     <text x="${p[0].toFixed(2)}" y="${(p[1] - 10).toFixed(2)}" font-size="10" fill="#0d9488" text-anchor="middle" font-weight="700">${toFa(student[i])}</text>`).join('');

  /* خط میانگین کلاس (نقطه‌چین) */
  const avgPts = klass.map((v, i) => [xOf(i), yOf(v)]);
  const avgLine = smoothPath(avgPts);

  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="نمودار خطی روند معدل">
    <defs>
      <linearGradient id="grad-p-trend" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0d9488" stop-opacity="0.28"></stop>
        <stop offset="100%" stop-color="#0d9488" stop-opacity="0"></stop>
      </linearGradient>
    </defs>
    ${grid}${labels}
    <path d="${area}" fill="url(#grad-p-trend)"></path>
    <path d="${avgLine}" fill="none" stroke="#cbd5d3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="6 6"></path>
    <path d="${line}" fill="none" stroke="#0d9488" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
    ${dots}
  </svg>`;
}

/* ============================================================
   دونات حضور سال (۲۱۰×۲۱۰)
   داده از #attDonutCard: data-total/present/absent/late/excused
   ============================================================ */
function donutSVG(c) {
  const R = 78, CIRC = 2 * Math.PI * R;
  const segs = [
    { v: c.present, col: '#10b981' },
    { v: c.absent,  col: '#e11d48' },
    { v: c.late,    col: '#f59e0b' },
    { v: c.excused, col: '#94a3b8' },
  ];
  const total = c.total || segs.reduce((s, x) => s + x.v, 0);
  let off = 0, arcs = '';
  segs.forEach(s => {
    const len = (s.v / total) * CIRC;
    arcs += `<circle cx="105" cy="105" r="${R}" fill="none" stroke="${s.col}" stroke-width="24"
      stroke-dasharray="${len.toFixed(2)} ${(CIRC - len).toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}"
      stroke-linecap="round" transform="rotate(-90 105 105)"></circle>`;
    off += len;
  });
  const pct = Math.round((c.present / total) * 100);
  return `<svg viewBox="0 0 210 210" role="img" aria-label="نمودار دونات حضور">
    <circle cx="105" cy="105" r="${R}" fill="none" stroke="#edf3f2" stroke-width="24"></circle>
    ${arcs}
    <text x="105" y="103" font-size="21" fill="#12332d" text-anchor="middle" font-weight="800" class="donut-center">${toFa(pct)}٪</text>
    <text x="105" y="123" font-size="10.5" fill="#8aa39e" text-anchor="middle" font-weight="500">حضور سال جاری</text>
  </svg>`;
}

/* ============================================================
   میله‌های مقایسهٔ دروس — از ردیف‌های جدول کارنامه خوانده می‌شود
   (تک‌منبع داده: همان tbody جدول؛ هیچ دادهٔ تکراری وجود ندارد)
   ============================================================ */
function buildSubjectBars() {
  const rows = $$('#gradeTbody tr[data-subject]');
  const host = $('#subjectBars');
  if (!host || !rows.length) return;
  host.innerHTML = rows.map(tr => {
    const name = tr.dataset.subject;
    const score = parseFloat(tr.dataset.final) || 0;
    const strong = score >= 17;
    const color = strong ? '#047857' : '#b45309';
    const grad = strong ? 'linear-gradient(90deg,#34d399,#059669)' : 'linear-gradient(90deg,#2dd4bf,#0f766e)';
    return `
      <div class="h-bar">
        <div class="h-top"><b>${name}</b><span style="color:${color}">${toFa(score.toFixed(2))}</span></div>
        <div class="track"><div class="fill" style="width:${(score / 20 * 100).toFixed(1)}%;background:${grad}"></div></div>
      </div>`;
  }).join('');
}

/* ============================================================
   راه‌اندازی — خواندن داده‌ها از تگ‌های HTML و ترسیم
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  /* اسپارک‌لاین کارت‌های آمار */
  $$('.js-spark').forEach(el => {
    el.innerHTML = sparkSVG(numList(el.dataset.points), el.dataset.color || '#0d9488');
  });

  /* نمودار روند معدل */
  const trend = $('#trendCard');
  if (trend) {
    $('#trendChart').innerHTML = trendChartSVG(
      String(trend.dataset.months || '').split(','),
      numList(trend.dataset.student),
      numList(trend.dataset.class)
    );
  }

  /* دونات حضور */
  const donut = $('#attDonutCard');
  if (donut) {
    $('#attDonut').innerHTML = donutSVG({
      total:   parseFloat(donut.dataset.total)   || 0,
      present: parseFloat(donut.dataset.present) || 0,
      absent:  parseFloat(donut.dataset.absent)  || 0,
      late:    parseFloat(donut.dataset.late)    || 0,
      excused: parseFloat(donut.dataset.excused) || 0,
    });
  }

  /* میله‌های مقایسهٔ دروس */
  buildSubjectBars();

  /* چاپ کارنامه */
  const btnPrint = $('#btnPrintCar');
  if (btnPrint) btnPrint.addEventListener('click', () => setTimeout(() => window.print(), 100));
});
