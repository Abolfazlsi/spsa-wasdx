/* ============================================================
   سامانه پایش هوشمند عملکرد دانش‌آموز — قالب نمایشی (نسخهٔ ساده‌شده برای مدیر)
   ⚠️ تمام داده‌های تستی به‌صورت مستقیم داخل تگ‌های HTML نوشته
   شده‌اند (index.html). این فایل هیچ داده‌ای در خود تعریف
   نمی‌کند و فقط منطق تعامل را در بر دارد:
   ناوبری ساده‌شده (۶ بخش)، کارت‌های «کارهای پرتکرار»،
   ویزارد ۳ گامی حضور و غیاب، تب‌های دانش‌آموزان،
   تور راهنمای اسپات‌لایت، فیلتر جدول، پیش‌نمایش پیامک،
   مودال‌ها و چت نمایشی. هیچ ارتباطی با سرور وجود ندارد.
   ============================================================ */
'use strict';

/* ---------- ابزارهای کمکی ---------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
function toFa(v) { return String(v).replace(/\d/g, d => FA_DIGITS[+d]).replace(/\./g, '٫'); }
function toEn(v) { return String(v).replace(/[۰-۹]/g, d => FA_DIGITS.indexOf(d)); }

let TODAY_FA = '—'; // تاریخ امروز (زمان واقعی — در راه‌اندازی مقدار می‌گیرد)

/* ---------- Toast نمایشی ---------- */
function toast(text, icon = 'bi-check-circle-fill') {
  const host = $('.toast-host');
  if (!host) return;
  const t = document.createElement('div');
  t.className = 'demo-toast';
  t.innerHTML = `<i class="bi ${icon}"></i><span>${text}</span>`;
  host.appendChild(t);
  setTimeout(() => { t.classList.add('hide'); setTimeout(() => t.remove(), 350); }, 3200);
}

/* ============================================================
   ناوبری بین بخش‌ها — فقط ۶ بخش (صفحات پراکنده ادغام شده‌اند)
   ============================================================ */
const VIEW_TITLES = {
  dashboard:  ['خانه', 'کارهای امروز از همین‌جا شروع می‌شود'],
  attendance: ['حضور و غیاب', 'در ۳ گام ساده — با اطلاع‌رسانی خودکار به والدین'],
  students:   ['دانش‌آموزان و کلاس‌ها', 'فهرست دانش‌آموزان، کارنامه و معلمان — در سه تب'],
  trend:      ['افت و پیشرفت تحصیلی', 'هشدار افت تحصیلی و فهرست دانش‌آموزان در حال پیشرفت'],
  grades:     ['نمرات و امتحانات', 'ثبت نمرات و تقویم امتحانات سال تحصیلی'],
  messages:   ['پیام به والدین', 'پیامک‌های اطلاع‌رسانی و ارسال پیام جدید'],
  ai:         ['دستیار هوشمند', 'پرسش و پاسخ بر اساس داده‌های سامانه'],
};

function showView(key) {
  $$('.view').forEach(v => v.classList.add('d-none'));
  const target = $(`#view-${key}`) || $('#view-dashboard');
  target.classList.remove('d-none');
  target.style.animation = 'none'; void target.offsetWidth; target.style.animation = '';
  $$('.side-link').forEach(a => a.classList.toggle('active', a.dataset.view === key));
  $$('#bnav .bn-link').forEach(a => a.classList.toggle('active', a.dataset.view === key));
  const [title, crumb] = VIEW_TITLES[key] || VIEW_TITLES.dashboard;
  $('#pageTitle').textContent = title;
  $('#pageCrumb').textContent = crumb;
  document.title = `${title} | سامانه پایش هوشمند`;
  closeSidebar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openSidebar() { $('.sidebar').classList.add('show'); $('.backdrop').classList.add('show'); }
function closeSidebar() { $('.sidebar').classList.remove('show'); $('.backdrop').classList.remove('show'); }

/* ============================================================
   تب‌های صفحهٔ «دانش‌آموزان و کلاس‌ها»
   (گزارش‌ها و معلمان دیگر صفحهٔ جدا نیستند — سه تب کنار هم)
   ============================================================ */
function setSvTab(key) {
  $$('[data-svtab]').forEach(b => b.classList.toggle('active', b.dataset.svtab === key));
  $('#paneStudentList').classList.toggle('d-none', key !== 'list');
  $('#paneReport').classList.toggle('d-none', key !== 'report');
  $('#paneTeachers').classList.toggle('d-none', key !== 'teachers');
}
function openReportTab()  { showView('students'); setSvTab('report'); }
function openTeachersTab(){ showView('students'); setSvTab('teachers'); }

/* ============================================================
   فیلتر جدول دانش‌آموزان
   (داده‌ها از data-attribute های ردیف‌های HTML خوانده می‌شوند)
   ============================================================ */
function applyStudentFilters() {
  const grade = $('#fGrade').value;
  const cls = $('#fClass').value;
  const status = $('#fStatus').value;
  const q = $('#searchStudent').value.trim();
  let visible = 0;
  $$('#studentTbody tr[data-name]').forEach(tr => {
    const d = tr.dataset;
    const ok = (grade === 'all' || d.grade === grade) &&
               (cls === 'all' || d.cls === cls) &&
               (status === 'all' || d.status === status) &&
               (!q || d.name.includes(q) || toEn(d.id).includes(toEn(q)));
    tr.classList.toggle('d-none', !ok);
    if (ok) visible++;
  });
  $('#studentsEmpty').classList.toggle('d-none', visible > 0);
  $('#studentCount').textContent = toFa(visible);
}

/* ============================================================
   ویزارد ۳ گامی حضور و غیاب
   گام ۱: انتخاب کلاس (از کارت‌های #attClassCards در HTML)
   گام ۲: ثبت وضعیت (ردیف‌های #attTbody)
   گام ۳: تأیید و ارسال پیام به والدین
   ============================================================ */
const ATT = { cls: null, busy: false };
const ATT_PILL = { present: ['حاضر', 'st-excellent'], absent: ['غایب', 'st-danger'], late: ['تأخیر', 'st-warn'], excused: ['مجوز', 'st-info'] };

function selectAttClass(btn) {
  $$('#attClassCards .cls-card').forEach(c => c.classList.remove('selected'));
  btn.classList.add('selected');
  ATT.cls = btn.dataset;
  $('#attSelClass').innerHTML =
    `<i class="bi bi-easel2"></i> کلاس انتخاب‌شده: <b>پایهٔ ${ATT.cls.grade} — کلاس ${ATT.cls.cls}</b> • معلم: ${ATT.cls.teacher} • ${ATT.cls.count} نفر`;
  $('#attToStep2').disabled = false;
}

function goAttStep(n) { /* n: 1..3 و 4 = صفحهٔ موفقیت */
  ['#attStep1', '#attStep2', '#attStep3', '#attDone'].forEach((s, i) => $(s).classList.toggle('d-none', i + 1 !== n));
  $$('#attProg .wstep').forEach(w => {
    const k = +w.dataset.w;
    w.classList.toggle('active', k === Math.min(n, 3));
    w.classList.toggle('done', k < n || n === 4);
  });
  if (n === 3) buildAttReview();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function attRows() { return $$('#attTbody tr[data-status]'); }
function attCount(v) { return attRows().filter(tr => tr.dataset.status === v).length; }

function updateAttSummary() {
  $('#cntPresent').textContent = toFa(attCount('present'));
  $('#cntAbsent').textContent = toFa(attCount('absent'));
  $('#cntLate').textContent = toFa(attCount('late'));
  $('#cntExcused').textContent = toFa(attCount('excused'));
}

/* جستجوی سریع دانش‌آموز در جدول ثبت وضعیت — با نام یا کد دانش‌آموزی
   تا مدیر مجبور نباشد بین ۳۰ نفر بگردد */
function applyAttSearch() {
  const input = $('#attSearch');
  const q = input ? input.value.trim() : '';
  const rows = $$('#attTbody tr[data-name]');
  let visible = 0;
  rows.forEach(tr => {
    const d = tr.dataset;
    const ok = !q || d.name.includes(q) || toEn(d.id).includes(toEn(q));
    tr.classList.toggle('d-none', !ok);
    if (ok) visible++;
  });
  $('#attSearchEmpty').classList.toggle('d-none', visible > 0);
  $('#attVisibleCount').textContent = q
    ? `${toFa(visible)} نفر از ${toFa(rows.length)} پیدا شد`
    : `${toFa(rows.length)} نفر نمایش داده می‌شود`;
}

/* بازگرداندن همهٔ ردیف‌ها به «حاضر» — شروع تازه برای کلاس بعدی
   (همه به‌صورت پیش‌فرض حاضر هستند؛ مدیر فقط غایبین را علامت می‌زند) */
function resetAttRowsToPresent() {
  attRows().forEach(tr => {
    tr.dataset.status = 'present';
    tr.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('present', 'absent', 'late', 'excused'));
    const p = tr.querySelector('.seg-btn[data-v="present"]');
    if (p) p.classList.add('present');
    const pill = tr.querySelector('[data-pill]');
    if (pill) {
      pill.textContent = ATT_PILL.present[0];
      pill.className = `status-pill ${ATT_PILL.present[1]}`;
    }
  });
  updateAttSummary();
}

function buildAttReview() {
  $('#revPresent').textContent = toFa(attCount('present'));
  $('#revAbsent').textContent = toFa(attCount('absent'));
  $('#revLate').textContent = toFa(attCount('late'));
  $('#revExcused').textContent = toFa(attCount('excused'));
  updateSmsPreview();
}

/* با کلیک روی هر دکمهٔ وضعیت — فقط کلاس‌های همان ردیف عوض می‌شود */
function onSegClick(e) {
  const btn = e.target.closest('.seg-btn');
  if (!btn || !btn.dataset.v) return;
  const tr = btn.closest('tr');
  const v = btn.dataset.v;
  btn.closest('.seg').querySelectorAll('.seg-btn').forEach(b => b.classList.remove('present', 'absent', 'late', 'excused'));
  btn.classList.add(v);
  tr.dataset.status = v;
  const pill = tr.querySelector('[data-pill]');
  const [label, cls] = ATT_PILL[v];
  pill.textContent = label;
  pill.className = `status-pill ${cls}`;
  updateAttSummary();
}

function updateSmsPreview() {
  const flagged = attRows().filter(tr => tr.dataset.status === 'absent' || tr.dataset.status === 'late');
  const box = $('#smsBox');
  if (!flagged.length) {
    box.innerHTML = `<div class="empty-hint mb-0" style="color:#a8c8c1">همهٔ دانش‌آموزان حاضر هستند — پیامی برای ارسال وجود ندارد 🌿</div>`;
    $('#btnNotify').disabled = true;
    return;
  }
  const first = flagged[0];
  const kindText = first.dataset.status === 'absent' ? 'در مدرسه حاضر نشد' : 'با تأخیر وارد مدرسه شد';
  const recipients = flagged.map(tr => `والدین ${tr.dataset.name} (${tr.dataset.phone})`).join(' ، ');
  box.innerHTML = `
    <div class="sms-head"><i class="bi bi-send-fill"></i> پیش‌نمایش پیامک اطلاع‌رسانی — ${toFa(flagged.length)} مخاطب</div>
    <div class="mb-2 text-white-50" style="font-size:.72rem">به: ${recipients}</div>
    «والدین محترم ${first.dataset.parent}؛ فرزند شما ${first.dataset.name} امروز ${kindText}. لطفاً جهت هماهنگی با مدرسه تماس بگیرید. — مدیریت مدرسهٔ نمونهٔ پایش»
    <div class="mt-2"><span class="chip up"><i class="bi bi-lightning-charge-fill"></i> ارسال خودکار بلافاصله پس از تأیید</span></div>`;
  $('#btnNotify').disabled = false;
}

function finishAttendance(withSms) {
  if (ATT.busy) return;
  ATT.busy = true;
  const flagged = attRows().filter(tr => tr.dataset.status === 'absent' || tr.dataset.status === 'late');
  if (withSms) {
    flagged.forEach((tr, i) => {
      setTimeout(() => toast(`پیامک اطلاع‌رسانی به والدین «${tr.dataset.name}» ارسال شد`, 'bi-send-check-fill'), 500 + i * 450);
    });
  }
  const clsTxt = ATT.cls ? `پایهٔ ${ATT.cls.grade} — کلاس ${ATT.cls.cls}` : 'کلاس نمونه';
  $('#attDoneText').innerHTML =
    `حضور و غیاب <b>${clsTxt}</b> برای ${TODAY_FA} ثبت شد.` +
    (withSms && flagged.length
      ? ` پیام اطلاع‌رسانی برای <b>${toFa(flagged.length)} خانواده</b> ارسال شد.`
      : ' موردی برای اطلاع‌رسانی به والدین وجود نداشت.');
  setTimeout(() => { goAttStep(4); ATT.busy = false; }, withSms && flagged.length ? 1100 : 250);
  if (!withSms && !flagged.length) toast('وضعیت حضور و غیاب ثبت شد', 'bi-calendar-check-fill');
}

function attRestart() {
  ATT.cls = null;
  $('#attToStep2').disabled = true;
  $('#attSelClass').innerHTML = '<i class="bi bi-easel2"></i> کلاسی انتخاب نشده';
  $$('#attClassCards .cls-card').forEach(c => c.classList.remove('selected'));
  const s = $('#attSearch');
  if (s) s.value = '';
  applyAttSearch();
  resetAttRowsToPresent();
  goAttStep(1);
}

/* ============================================================
   دستیار هوشمند نمایشی
   (پاسخ‌ها فقط از data-attribute های جدول دانش‌آموزان و
    کلاس‌های همان صفحهٔ HTML خوانده می‌شود)
   ============================================================ */
function aiBubble(text, who = 'ai') {
  const body = $('#chatBody');
  const wrap = document.createElement('div');
  wrap.className = `msg ${who}`;
  const av = who === 'ai'
    ? '<span class="avatar sm" style="background:var(--brand-soft);color:var(--brand-700)"><i class="bi bi-robot"></i></span>'
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

function findStudentRow(q) {
  const rows = $$('#studentTbody tr[data-name]');
  return rows.find(r => q.includes(r.dataset.name)) ||
         rows.find(r => r.dataset.name.split(' ')[0] && q.includes(r.dataset.name.split(' ')[0]));
}

function aiAnswer(q) {
  const rows = $$('#studentTbody tr[data-name]');
  if (/برترین|بهترین/.test(q)) {
    const top = rows.slice().sort((a, b) => b.dataset.gpa - a.dataset.gpa).slice(0, 3);
    return `بر اساس داده‌های سامانه، برترین دانش‌آموزان این ماه:<ul class="mini-list">${top.map((r, i) => `<li><span>${toFa(i + 1)}. ${r.dataset.name}</span><b>${toFa(r.dataset.gpa)}</b></li>`).join('')}</ul>`;
  }
  const r = findStudentRow(q);
  if (r) {
    const d = r.dataset;
    if (/غیبت|حضور|تأخیر|تاخیر/.test(q)) {
      const absDays = Math.round(((100 - d.attend) / 100) * 126);
      return `تحلیل حضور «${d.name}»:<ul class="mini-list">
        <li><span>درصد حضور سال</span><b>${toFa(d.attend)}٪</b></li>
        <li><span>روزهای غیبت</span><b>${toFa(absDays)} روز</b></li>
      </ul>${d.attend < 85 ? '⚠️ غیبت‌های این دانش‌آموز بالاتر از حد مجاز است؛ پیشنهاد می‌کنم با والدین جلسه‌ای برگزار شود.' : 'حضور این دانش‌آموز در وضعیت مناسبی است.'}`;
    }
    if (/مقایسه|کلاس|میانگین/.test(q)) {
      const clsRow = $$('#classesTbody tr[data-avg]').find(t => t.dataset.grade === d.grade && t.dataset.cls === d.cls);
      if (clsRow) {
        const diff = Math.round((d.gpa - clsRow.dataset.avg) * 100) / 100;
        return `مقایسهٔ «${d.name}» با میانگین کلاس ${toFa(d.cls)} پایهٔ ${d.grade}:<ul class="mini-list">
          <li><span>معدل دانش‌آموز</span><b>${toFa(d.gpa)}</b></li>
          <li><span>میانگین کلاس</span><b>${toFa(clsRow.dataset.avg)}</b></li>
          <li><span>اختلاف</span><b style="color:${diff >= 0 ? '#059669' : '#e11d48'}">${diff >= 0 ? '+' : '−'}${toFa(Math.abs(diff))}</b></li>
        </ul>${diff >= 0 ? 'این دانش‌آموز بالاتر از میانگین کلاس قرار دارد.' : 'این دانش‌آموز کمی پایین‌تر از میانگین کلاس است.'}`;
      }
    }
    return `خلاصهٔ وضعیت «${d.name}»:<ul class="mini-list">
      <li><span>وضعیت تحصیلی</span><b>${d.status}</b></li>
      <li><span>معدل</span><b>${toFa(d.gpa)}</b></li>
      <li><span>حضور</span><b>${toFa(d.attend)}٪</b></li>
      <li><span>روند</span><b>${d.trend >= 0 ? 'صعودی +' + toFa(d.trend) : 'نزولی −' + toFa(Math.abs(d.trend))}</b></li>
    </ul>برای مشاهدهٔ کارنامهٔ تفصیلی، در صفحهٔ «دانش‌آموزان و کلاس‌ها» تب «کارنامه و گزارش» را ببینید.`;
  }
  return 'برای تحلیل، نام دانش‌آموز را در پرسش ذکر کنید یا از پیشنهادهای آماده استفاده کنید. من به داده‌های حضور و غیاب، نمرات و امتحانات همین سامانه دسترسی دارم. 📊';
}

function sendChat(text) {
  const q = (text ?? $('#chatInput').value).trim();
  if (!q) return;
  $('#chatInput').value = '';
  aiBubble(q, 'me');
  aiThinking(true);
  setTimeout(() => { aiThinking(false); aiBubble(aiAnswer(q)); }, 900);
}

/* ============================================================
   افزودن کلاس جدید — مدیر کلاس دلخواهش را اضافه می‌کند
   کلاسِ تازه هم‌زمان به این‌جاها اضافه می‌شود (نسخهٔ نمایشی):
   ۱) جدول «کلاس‌های فعال مدرسه» در تب معلمان و کلاس‌ها
   ۲) کارت‌های انتخاب کلاس در گام ۱ ویزارد حضور و غیاب
   ۳) گزینهٔ «کلاس» در فیلتر دانش‌آموزان و فرم افزودن دانش‌آموز
   ============================================================ */
const CLS_BADGE_CYCLE = ['av-teal', 'av-amber', 'av-violet', 'av-rose', 'av-emerald'];

function saveClass() {
  const grade = $('#clsGrade').value;
  const numInput = $('#clsNum');
  const numRaw = numInput.value.trim();
  if (!numRaw) {
    numInput.classList.add('is-invalid');
    numInput.focus();
    toast('شمارهٔ کلاس را وارد کنید', 'bi-exclamation-triangle-fill');
    return;
  }
  const num = toFa(numRaw);
  const teacher = $('#clsTeacher').value.trim() || '—';
  const countRaw = toEn($('#clsCount').value.trim());
  const count = countRaw ? toFa(countRaw) : '—';
  const avgRaw = toEn($('#clsAvg').value.trim());
  const avg = avgRaw !== '' ? Math.min(20, Math.max(0, parseFloat(avgRaw))) : null;

  /* جلوگیری از کلاس تکراری */
  const exists = $$('#classesTbody tr').some(tr => tr.dataset.grade === grade && tr.dataset.cls === num);
  if (exists) {
    toast(`کلاس «پایهٔ ${grade} — کلاس ${num}» از قبل وجود دارد`, 'bi-exclamation-triangle-fill');
    return;
  }

  /* ۱) ردیف جدید در جدول «کلاس‌های فعال مدرسه» */
  const tr = document.createElement('tr');
  tr.dataset.grade = grade;
  tr.dataset.cls = num;
  if (avg !== null) tr.dataset.avg = String(avg);
  tr.className = 'row-new';
  tr.innerHTML = `
    <td class="fw-bold">پایهٔ ${grade}</td>
    <td>کلاس ${num}</td>
    <td>${teacher}</td>
    <td>${count === '—' ? '—' : count + ' نفر'}</td>
    <td>${avg !== null ? `<b class="text-success">${toFa(avg)}</b>` : '<span class="text-muted">—</span>'}</td>
    <td>${avg !== null
      ? `<div style="width:90px;height:6px;background:#edf3f2;border-radius:99px"><div class="fill" style="width:${Math.round(avg / 20 * 100)}%;height:100%;border-radius:99px;background:linear-gradient(90deg,#2dd4bf,#0f766e)"></div></div>`
      : '<span class="text-muted">—</span>'}</td>`;
  $('#classesTbody').appendChild(tr);
  setTimeout(() => tr.classList.remove('row-new'), 2600);

  /* ۲) کارت کلاس در گام ۱ ویزارد حضور و غیاب */
  const idx = $$('#attClassCards .cls-card').length;
  const col = document.createElement('div');
  col.className = 'col-12 col-sm-6 col-lg-4';
  col.innerHTML = `
    <button type="button" class="cls-card" data-grade="${grade}" data-cls="${num}"
            data-teacher="${teacher === '—' ? 'تعیین نشده' : teacher}"
            data-count="${count === '—' ? '۰' : count}">
      <span class="cls-badge ${CLS_BADGE_CYCLE[idx % CLS_BADGE_CYCLE.length]}">${grade} ${num}</span>
      <span class="cls-t">پایهٔ ${grade} — کلاس ${num}</span>
      <span class="cls-s"><i class="bi bi-person-video3"></i> معلم: ${teacher === '—' ? 'تعیین نشده' : teacher}</span>
      <span class="cls-s"><i class="bi bi-people"></i> ${count === '—' ? '۰' : count} دانش‌آموز</span>
    </button>`;
  $('#attClassCards').appendChild(col);
  col.querySelector('.cls-card').addEventListener('click', function () { selectAttClass(this); });

  /* ۳) گزینهٔ کلاس در فیلتر دانش‌آموزان و فرم افزودن دانش‌آموز */
  if (!$$('#fClass option').some(o => o.value === num)) $('#fClass').appendChild(new Option(`کلاس ${num}`, num));
  if (!$$('#stClass option').some(o => o.value === num)) $('#stClass').appendChild(new Option(`کلاس ${num}`, num));

  /* ۴) به‌روزرسانی شمارنده‌ها */
  $('#clsCountHint').textContent = `${toFa($$('#classesTbody tr').length)} کلاس فعال — از ۶ پایه`;
  $('#attClsHint').textContent = `${toFa($$('#attClassCards .cls-card').length)} کلاس فعال`;

  /* پایان — بستن مودال، اعلان موفقیت و نمایش ردیف تازه */
  bootstrap.Modal.getOrCreateInstance($('#classModal')).hide();
  toast(`کلاس «پایهٔ ${grade} — کلاس ${num}» با موفقیت اضافه شد`, 'bi-easel2-fill');
  setTimeout(() => tr.scrollIntoView({ behavior: 'smooth', block: 'center' }), 350);
}

/* ============================================================
   افت و پیشرفت تحصیلی — صفحهٔ جدید + هشدار داشبورد
   منبع داده: data-attribute های جدول «فهرست دانش‌آموزان»
   (trend منفی = افت، مثبت = پیشرفت — هیچ دادهٔ جدیدی اینجا تعریف نمی‌شود)
   ============================================================ */
function initialsOf(name) {
  return name.split(' ').slice(0, 2).map(w => w[0] || '').join('');
}

function trendRowHTML(x, isUp) {
  const d = x.d;
  return `
    <div class="row-item">
      <span class="avatar sm ${isUp ? 'av-emerald' : 'av-rose'}">${initialsOf(d.name)}</span>
      <div>
        <div class="t">${d.name}</div>
        <div class="s">پایهٔ ${d.grade} — کلاس ${d.cls} • معدل ${toFa(d.gpa)} • وضعیت: ${d.status}</div>
      </div>
      <div class="end">
        <span class="chip ${isUp ? 'up' : 'down'}"><i class="bi bi-arrow-${isUp ? 'up' : 'down'}-short"></i>${toFa(Math.abs(x.trend))} ${isUp ? 'پیشرفت' : 'افت'}</span>
        <div class="d-flex gap-1 mt-1 justify-content-end">
          <button class="btn btn-ghost btn-sm-brand" onclick="openMsgFor('${d.name}', ${isUp})">${isUp ? 'تقدیر به والدین' : 'پیام به والدین'}</button>
          <button class="btn-icon-ghost" title="کارنامه" onclick="openReportTab()"><i class="bi bi-file-earmark-bar-graph"></i></button>
        </div>
      </div>
    </div>`;
}

function buildTrendLists() {
  const all = $$('#studentTbody tr[data-name]')
    .map(r => ({ d: r.dataset, trend: parseFloat(r.dataset.trend) || 0 }))
    .filter(x => x.trend !== 0);
  const down = all.filter(x => x.trend < 0).sort((a, b) => a.trend - b.trend);
  const up = all.filter(x => x.trend > 0).sort((a, b) => b.trend - a.trend);

  $('#trendDownList').innerHTML = down.length
    ? down.map(x => trendRowHTML(x, false)).join('')
    : '<div class="empty-hint mb-0">دانش‌آموزی با افت تحصیلی ثبت نشده — آفرین! 🌿</div>';
  $('#trendUpList').innerHTML = up.length
    ? up.map(x => trendRowHTML(x, true)).join('')
    : '<div class="empty-hint mb-0">دانش‌آموزی با پیشرفت ثبت نشده است</div>';
  $('#trendDownCount').textContent = toFa(down.length);
  $('#trendUpCount').textContent = toFa(up.length);

  /* هشدار داشبورد — فقط وقتی افت وجود دارد دیده می‌شود (مدیر سریع متوجه می‌شود) */
  const alertCard = $('#declineAlert');
  if (down.length) {
    alertCard.classList.remove('d-none');
    $('#declineAlertCount').textContent = toFa(down.length);
    $('#declineAlertList').innerHTML = down.slice(0, 3).map(x => `
      <div class="col-12 col-sm-6">
        <button class="mini-student" onclick="showView('trend')" title="مشاهده در صفحهٔ افت و پیشرفت">
          <span class="avatar sm av-rose">${initialsOf(x.d.name)}</span>
          <span class="flex-grow-1"><span class="ms-t d-block">${x.d.name}</span><span class="ms-s">پایهٔ ${x.d.grade} • معدل ${toFa(x.d.gpa)}</span></span>
          <span class="chip down"><i class="bi bi-arrow-down-short"></i>${toFa(Math.abs(x.trend))}</span>
        </button>
      </div>`).join('');
  } else {
    alertCard.classList.add('d-none');
  }
}

/* پیام سریع به والدین از صفحهٔ افت/پیشرفت — مودال پیام با دانش‌آموز انتخاب‌شده باز می‌شود */
function openMsgFor(name, praise) {
  showView('messages');
  const sel = $('#msgStudent');
  if ([...sel.options].some(o => o.textContent === name)) sel.value = name;
  $('#msgText').value = praise
    ? `والدین محترم؛ از پیشرفت تحصیلی «${name}» خوشحالیم و این موفقیت را به شما و فرزندتان تبریک می‌گوییم. — مدیریت مدرسه`
    : '';
  bootstrap.Modal.getOrCreateInstance($('#msgModal')).show();
}

/* ============================================================
   تور راهنمای اسپات‌لایت — مدیر هیچ‌وقت گم نمی‌شود
   (۶ گام؛ هدف هر گام: آیتم سایدبار در دسکتاپ یا نوار پایین در موبایل)
   ============================================================ */
const TOUR_STEPS = [
  { view: 'dashboard',  t: 'خانه — مرکز همهٔ کارها', d: 'کارت‌های بزرگِ «کارهای پرتکرار» مهم‌ترین کارهای روزانه را یک‌کلیکه باز می‌کنند؛ آمار و نمودارها هم پایین‌ترِ همین صفحه است.' },
  { view: 'attendance', t: 'حضور و غیاب در ۳ گام', d: 'اول کلاس را انتخاب می‌کنید، بعد وضعیت هر دانش‌آموز را علامت می‌زنید و در پایان تأیید و ارسال. غیبت‌ها خودکار به والدین پیامک می‌شود.' },
  { view: 'students',   t: 'دانش‌آموزان در یک‌جا', d: 'سه تب ساده: «فهرست دانش‌آموزان» با فیلتر و جستجو، «کارنامه و گزارش» برای روند تحصیلی، و «معلمان و کلاس‌ها».' },
  { view: 'trend',      t: 'افت و پیشرفت تحصیلی', d: 'اینجا هشدار افت تحصیلی و فهرست دانش‌آموزان در حال پیشرفت را یک‌جا می‌بینید؛ برای هر دانش‌آموز می‌توانید سریع به والدین پیام بدهید.' },
  { view: 'grades',     t: 'نمرات و امتحانات', d: 'در تب «ثبت نمرات» نمرهٔ هر آزمون را وارد می‌کنید و در تب «فهرست امتحانات» تقویم امتحانات را می‌بینید.' },
  { view: 'messages',   t: 'پیام به والدین', d: 'همهٔ پیامک‌های ارسالی اینجاست؛ پیام جدید را هم با دکمهٔ «ارسال پیام جدید» از همین صفحه بفرستید.' },
];

let tourIdx = -1;
const isMobileView = () => matchMedia('(max-width: 991.98px)').matches;

function tourTargetOf(step) {
  return isMobileView()
    ? $(`#bnav .bn-link[data-view="${step.view}"]`)
    : $(`.sidebar .side-link[data-view="${step.view}"]`);
}

function placeTourSpot(el) {
  const spot = $('#tourSpot'), card = $('#tourCard');
  const pad = 8;
  const r = el.getBoundingClientRect();
  spot.style.top = (r.top - pad) + 'px';
  spot.style.left = (r.left - pad) + 'px';
  spot.style.width = (r.width + pad * 2) + 'px';
  spot.style.height = (r.height + pad * 2) + 'px';

  const vw = innerWidth, vh = innerHeight;
  const cw = card.offsetWidth, ch = card.offsetHeight;
  let top = r.bottom + 14;
  if (top + ch > vh - 12) top = r.top - ch - 14;
  if (top < 12) top = Math.max(12, (vh - ch) / 2);
  let left = r.left + r.width / 2 - cw / 2;
  left = Math.min(Math.max(12, left), vw - cw - 12);
  card.style.top = top + 'px';
  card.style.left = left + 'px';
}

function tourGo(i) {
  const step = TOUR_STEPS[i];
  const el = tourTargetOf(step);
  if (!step || !el) { endTour(); return; }
  tourIdx = i;
  $('#tourTitle').textContent = step.t;
  $('#tourDesc').textContent = step.d;
  $('#tourStepNum').textContent = `گام ${toFa(i + 1)} از ${toFa(TOUR_STEPS.length)}`;
  $('#tourPrev').disabled = i === 0;
  $('#tourNext').textContent = i === TOUR_STEPS.length - 1 ? 'پایان ✔' : 'بعدی';
  requestAnimationFrame(() => placeTourSpot(el));
}

function startTour() {
  const ov = $('#tourOverlay');
  ov.classList.remove('d-none');
  document.body.style.overflow = 'hidden';
  tourGo(0);
}

function endTour(done) {
  tourIdx = -1;
  $('#tourOverlay').classList.add('d-none');
  document.body.style.overflow = '';
  try { localStorage.setItem('py_welcome_done', '1'); } catch (e) { /* حالت خصوصی */ }
  if (done) toast('آفرین! حالا با سایت آشنا هستید 🎉', 'bi-emoji-smile-fill');
}

/* ============================================================
   رویدادها و راه‌اندازی
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  /* ناوبری سایدبار و نوار پایین موبایل */
  $$('.side-link').forEach(a => a.addEventListener('click', e => { e.preventDefault(); showView(a.dataset.view); }));
  $$('#bnav .bn-link').forEach(a => a.addEventListener('click', e => { e.preventDefault(); showView(a.dataset.view); }));
  $('#burger').addEventListener('click', openSidebar);
  $('.backdrop').addEventListener('click', closeSidebar);

  /* تاریخ و خوش‌آمد (زمان واقعی — دادهٔ نمایشی نیست) */
  try {
    const now = new Date();
    const d = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'full' }).format(now);
    TODAY_FA = d;
    $$('[data-today]').forEach(el => el.textContent = d);
    const attDate = $('#attDate'); if (attDate) attDate.textContent = d;
    const h = now.getHours();
    $('#greet').textContent = h < 12 ? 'صبح بخیر، خانم مدیر 🌤' : h < 17 ? 'ظهر بخیر، خانم مدیر ☀️' : 'عصر بخیر، خانم مدیر 🌆';
  } catch (e) { /* پشتیبانی نشد */ }

  /* تب‌های دانش‌آموزان */
  $$('[data-svtab]').forEach(b => b.addEventListener('click', () => setSvTab(b.dataset.svtab)));

  /* فیلترهای دانش‌آموزان */
  ['#fGrade', '#fClass', '#fStatus'].forEach(sel => $(sel).addEventListener('change', applyStudentFilters));
  $('#searchStudent').addEventListener('input', applyStudentFilters);
  applyStudentFilters();

  /* لیست‌های افت و پیشرفت (از جدول دانش‌آموزان) + هشدار داشبورد */
  buildTrendLists();

  /* ویزارد حضور و غیاب */
  $$('#attClassCards .cls-card').forEach(c => c.addEventListener('click', () => selectAttClass(c)));
  $('#attToStep2').addEventListener('click', () => {
    /* ورود به جدول ثبت وضعیت = فهرست تازه؛ جستجوی قبلی پاک می‌شود */
    const s = $('#attSearch');
    if (s) s.value = '';
    applyAttSearch();
    goAttStep(2);
  });
  $('#attBack1').addEventListener('click', () => goAttStep(1));
  $('#attToStep3').addEventListener('click', () => goAttStep(3));
  $('#attBack2').addEventListener('click', () => goAttStep(2));
  $('#btnNotify').addEventListener('click', () => finishAttendance(true));
  $('#attRestart').addEventListener('click', attRestart);
  $('#attTbody').addEventListener('click', onSegClick);
  $('#attSearch').addEventListener('input', applyAttSearch);
  updateAttSummary();

  /* نمرات */
  $('#gradeExam').addEventListener('change', e => {
    const opt = e.target.selectedOptions[0];
    if (opt && opt.dataset.info) $('#gradeExamInfo').textContent = opt.dataset.info;
  });
  $('#btnSaveGrades').addEventListener('click', () => toast('نمرات ثبت شد (نمایشی — ذخیره‌سازی واقعی در نسخهٔ نهایی)', 'bi-journal-check'));
  $$('[data-tab]').forEach(b => b.addEventListener('click', () => {
    $$('[data-tab]').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    $('#paneEntry').classList.toggle('d-none', b.dataset.tab !== 'entry');
    $('#paneExams').classList.toggle('d-none', b.dataset.tab !== 'exams');
  }));

  /* چاپ کارنامه */
  $('#btnPrint').addEventListener('click', () => setTimeout(() => window.print(), 100));

  /* چت هوشمند */
  $('#btnSend').addEventListener('click', () => sendChat());
  $('#chatInput').addEventListener('keydown', e => { if (e.key === 'Enter') sendChat(); });

  /* مودال‌ها (فرم‌ها نمایشی هستند) */
  const openModal = sel => () => bootstrap.Modal.getOrCreateInstance($(sel)).show();
  const modalToast = (sel, msg, icon) => () => {
    bootstrap.Modal.getOrCreateInstance($(sel)).hide();
    toast(msg, icon);
  };
  $('#btnAddStudent').addEventListener('click', openModal('#studentModal'));
  $('#btnSaveStudent').addEventListener('click', modalToast('#studentModal', 'در نسخهٔ نمایشی، ذخیرهٔ دانش‌آموز فعال نیست', 'bi-info-circle'));
  $('#btnAddExam').addEventListener('click', openModal('#examModal'));
  $('#btnSaveExam').addEventListener('click', modalToast('#examModal', 'در نسخهٔ نمایشی، ذخیرهٔ امتحان فعال نیست', 'bi-info-circle'));
  $('#btnAddTeacher').addEventListener('click', openModal('#teacherModal'));
  $('#btnSaveTeacher').addEventListener('click', modalToast('#teacherModal', 'در نسخهٔ نمایشی، ذخیرهٔ معلم فعال نیست', 'bi-info-circle'));
  $('#btnAddClass').addEventListener('click', () => {
    $('#classForm').reset();
    $('#clsNum').classList.remove('is-invalid');
    openModal('#classModal')();
  });
  $('#btnSaveClass').addEventListener('click', saveClass);
  $('#clsNum').addEventListener('input', () => $('#clsNum').classList.remove('is-invalid'));
  $('#btnNewMsg').addEventListener('click', openModal('#msgModal'));
  $('#btnSendMsg').addEventListener('click', modalToast('#msgModal', 'پیام شما در صف ارسال قرار گرفت (نمایشی)', 'bi-send-fill'));

  /* تور راهنما و خوش‌آمد */
  $('#btnTopTour').addEventListener('click', startTour);
  $('#btnSideTour').addEventListener('click', startTour);
  $('#tourNext').addEventListener('click', () => {
    if (tourIdx >= TOUR_STEPS.length - 1) endTour(true);
    else tourGo(tourIdx + 1);
  });
  $('#tourPrev').addEventListener('click', () => { if (tourIdx > 0) tourGo(tourIdx - 1); });
  $('#tourSkip').addEventListener('click', () => endTour(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && tourIdx >= 0) endTour(false); });
  window.addEventListener('resize', () => {
    if (tourIdx < 0) return;
    const el = tourTargetOf(TOUR_STEPS[tourIdx]);
    if (el) placeTourSpot(el); else endTour(false);
  });

  let welcomed = false;
  try { welcomed = !!localStorage.getItem('py_welcome_done'); } catch (e) { /* حالت خصوصی */ }
  if (!welcomed) {
    setTimeout(() => bootstrap.Modal.getOrCreateInstance($('#welcomeModal')).show(), 800);
  }
  $('#btnWelcomeTour').addEventListener('click', () => {
    bootstrap.Modal.getOrCreateInstance($('#welcomeModal')).hide();
    try { localStorage.setItem('py_welcome_done', '1'); } catch (e) { /* بی‌اهمیت */ }
    setTimeout(startTour, 400);
  });
  $('#btnWelcomeLater').addEventListener('click', () => {
    try { localStorage.setItem('py_welcome_done', '1'); } catch (e) { /* بی‌اهمیت */ }
  });

  showView('dashboard');
});
