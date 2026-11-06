/* Beauty Salon — luxury-01 behaviour
   Everything a client would otherwise ask on WhatsApp (price, duration, availability)
   is rendered from the data below so the atelier edits one place. */
(() => {
  'use strict';

  const SITE = {
    name: 'Beauty Salon',
    whatsapp: '601158121239',          // digits only, country code first
    storageKey: 'beausalon_luxury_v1',
    hours: { 0: [9, 19], 1: null, 2: [10, 21], 3: [10, 21], 4: [10, 21], 5: [10, 21], 6: [9, 19] }, // Sunday = 0; null = closed
    slotStartHours: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
  };

  const MENU = [
    { cat: 'Face', items: [
      { name: 'The Gold Hour Facial', desc: 'Lymphatic sculpting, 24k gold-leaf mask, scalp release.', mins: 75, price: 388, includes: ['Skin analysis', 'Double cleanse & enzyme peel', 'Gold-leaf mask', 'Scalp & neck release', 'Aftercare card'] },
      { name: 'Quiet Glow Hydration', desc: 'Hyaluronic infusion and cool quartz massage for tired skin.', mins: 60, price: 268, includes: ['Skin analysis', 'Hyaluronic serum infusion', 'Rose-quartz massage', 'LED calm finish'] },
      { name: 'Clarity Reset', desc: 'Deep cleanse, gentle extraction and a barrier-repair mask.', mins: 60, price: 228, includes: ['Steam & extraction', 'Salicylic treatment', 'Barrier-repair mask'] }
    ]},
    { cat: 'Body', items: [
      { name: 'Stone & Silence', desc: 'Warm basalt stones, slow pressure, a phone-free suite.', mins: 90, price: 428, includes: ['Foot ritual', 'Hot-stone full body', 'Warm oil scalp finish', 'Herbal tea'] },
      { name: 'Signature Aromatherapy', desc: 'Your chosen oil blend and a rhythm set to your breath.', mins: 60, price: 298, includes: ['Oil consultation', 'Full-body massage', 'Warm towel wrap'] },
      { name: 'Sugar Polish & Wrap', desc: 'A raw-sugar exfoliation followed by a hydrating cocoon wrap.', mins: 75, price: 338, includes: ['Dry brushing', 'Sugar polish', 'Hydrating wrap', 'Rain shower'] }
    ]},
    { cat: 'Lash & Brow', items: [
      { name: 'Lash Atelier Full Set', desc: 'Hand-placed classic or hybrid extensions for a soft, lifted eye.', mins: 90, price: 258, includes: ['Eye-shape consultation', 'Classic or hybrid set', 'Aftercare kit'] },
      { name: 'Brow Lamination & Tint', desc: 'Brushed-up, tinted brows that hold for six weeks.', mins: 45, price: 148, includes: ['Brow mapping', 'Lamination', 'Tint & nourish'] },
      { name: 'Lash Lift & Tint', desc: 'Your own lashes, curled and darkened. No extensions.', mins: 50, price: 138, includes: ['Lift', 'Tint', 'Keratin boost'] }
    ]},
    { cat: 'Hands & Feet', items: [
      { name: 'Velvet Manicure', desc: 'Cuticle care, gel colour and a warm paraffin finish.', mins: 60, price: 128, includes: ['Shape & cuticle', 'Gel colour', 'Paraffin finish'] },
      { name: 'Velvet Pedicure', desc: 'A soak, callus care and gel colour in a reclining suite.', mins: 70, price: 158, includes: ['Mineral soak', 'Callus care', 'Gel colour', 'Leg massage'] }
    ]},
    { cat: 'Hair & Bridal', items: [
      { name: 'Silk Hair Spa', desc: 'Scalp detox, keratin-silk infusion and a glossy blow-out.', mins: 60, price: 268, includes: ['Scalp analysis', 'Detox cleanse', 'Silk infusion', 'Blow-out'] },
      { name: 'The Bridal Suite', desc: 'Private suite for the bride and two companions.', mins: 240, price: 1280, from: true, includes: ['Skin prep facial', 'Bridal hair', 'Bridal makeup', 'Two companion blow-outs', 'Champagne tea'] },
      { name: 'Bridal Trial', desc: 'A full hair and makeup rehearsal, photographed for reference.', mins: 120, price: 480, includes: ['Consultation', 'Hair trial', 'Makeup trial', 'Reference photos'] }
    ]}
  ];

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const allItems = MENU.flatMap((group) => group.items.map((item) => ({ ...item, cat: group.cat })));
  const money = (n) => `RM ${n.toLocaleString('en-MY')}`;
  const mins = (m) => (m >= 120 ? `${m / 60} hrs` : `${m} min`);
  const pad = (n) => String(n).padStart(2, '0');
  const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const hourLabel = (h) => `${((h + 11) % 12) + 1}:00 ${h >= 12 ? 'PM' : 'AM'}`;

  /* ---------- header, nav, cursor glow ---------- */
  const header = $('#siteHeader');
  const menuToggle = $('#menuToggle');
  const navLinks = $('#navLinks');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const closeMenu = () => { navLinks.classList.remove('open'); document.body.classList.remove('menu-open'); menuToggle.setAttribute('aria-expanded', 'false'); };
  menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    document.body.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.addEventListener('click', (e) => { if (e.target.closest('a')) closeMenu(); });

  const glow = $('#cursorGlow');
  if (glow && window.matchMedia('(hover: hover)').matches && !reduceMotion) {
    let raf = 0;
    window.addEventListener('pointermove', (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { glow.style.left = `${e.clientX}px`; glow.style.top = `${e.clientY}px`; glow.classList.add('on'); });
    });
    document.addEventListener('pointerleave', () => glow.classList.remove('on'));
  }

  /* active nav link */
  const sections = $$('main section[id]');
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      $$('.nav-links a').forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
    }), { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- hero slideshow ---------- */
  const slides = $$('#heroMedia img');
  const dots = $('#heroDots');
  let heroIndex = 0; let heroTimer;
  const showHero = (i) => {
    heroIndex = (i + slides.length) % slides.length;
    slides.forEach((img, n) => img.classList.toggle('is-active', n === heroIndex));
    $$('button', dots).forEach((d, n) => { d.classList.toggle('is-active', n === heroIndex); d.setAttribute('aria-pressed', String(n === heroIndex)); });
  };
  const startHero = () => { clearInterval(heroTimer); if (!reduceMotion && !document.hidden && slides.length > 1) heroTimer = setInterval(() => showHero(heroIndex + 1), 7000); };
  slides.forEach((_, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', `Show scene ${i + 1} of ${slides.length}`); b.addEventListener('click', () => { showHero(i); startHero(); }); dots.append(b); });
  showHero(0); startHero();
  document.addEventListener('visibilitychange', startHero);

  /* ---------- treatment menu ---------- */
  const menuTabs = $('#menuTabs');
  const menuList = $('#menuList');
  const serviceSelect = $('#service');
  const renderMenu = (cat) => {
    const group = MENU.find((g) => g.cat === cat);
    menuList.innerHTML = group.items.map((item, i) => `
      <details class="menu-item">
        <summary>
          <span class="idx">${pad(i + 1)}</span>
          <div><h3>${item.name}</h3><p>${item.desc}</p></div>
          <span class="dur">${mins(item.mins)}</span>
          <span class="price">${item.from ? 'from ' : ''}${money(item.price)}</span>
        </summary>
        <div class="menu-body">
          <ul>${item.includes.map((inc) => `<li>${inc}</li>`).join('')}</ul>
          <a class="button button-ghost" href="#reserve" data-select-service="${item.name}">Reserve</a>
        </div>
      </details>`).join('');
  };
  MENU.forEach((g, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.role = 'tab'; b.textContent = g.cat; b.setAttribute('aria-selected', String(i === 0));
    b.addEventListener('click', () => { $$('button', menuTabs).forEach((x) => x.setAttribute('aria-selected', 'false')); b.setAttribute('aria-selected', 'true'); renderMenu(g.cat); });
    menuTabs.append(b);
  });
  renderMenu(MENU[0].cat);
  MENU.forEach((g) => {
    const og = document.createElement('optgroup'); og.label = g.cat;
    g.items.forEach((item) => { const o = document.createElement('option'); o.value = item.name; o.textContent = `${item.name} · ${mins(item.mins)} · ${item.from ? 'from ' : ''}${money(item.price)}`; og.append(o); });
    serviceSelect.append(og);
  });
  ['The Glow Series (3 facials)', 'Monthly Hour membership', 'Bridal Countdown programme'].forEach((name) => {
    const o = document.createElement('option'); o.value = name; o.textContent = name; serviceSelect.append(o);
  });

  /* ---------- availability (deterministic demo schedule) ---------- */
  const seed = (str) => { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return () => { h += 0x6D2B79F5; let t = Math.imul(h ^ (h >>> 15), 1 | h); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(today); d.setDate(today.getDate() + i); return d; });
  const scheduleFor = (d) => {
    const hours = SITE.hours[d.getDay()];
    if (!hours) return [];
    const rnd = seed(isoDate(d));
    const now = new Date();
    return SITE.slotStartHours.filter((h) => h >= hours[0] && h < hours[1]).map((h) => {
      const r = rnd();
      let state = r < 0.52 ? 'open' : r < 0.74 ? 'limited' : 'full';
      if (isoDate(d) === isoDate(now) && h <= now.getHours()) state = 'full';
      return { hour: h, state };
    });
  };
  const schedule = days.map((d) => ({ date: d, slots: scheduleFor(d) }));
  const openCount = (day) => day.slots.filter((s) => s.state !== 'full').length;
  const dayName = (d) => d.toLocaleDateString('en-MY', { weekday: 'short' });
  const dayLong = (d) => d.toLocaleDateString('en-MY', { weekday: 'long', day: 'numeric', month: 'long' });

  const boardDays = $('#boardDays');
  const boardSlots = $('#boardSlots');
  const boardDayLabel = $('#boardDayLabel');
  const dateInput = $('#date');
  const timeSelect = $('#time');
  let selectedDay = 0;
  let selectedHour = null;

  const fillTimes = (dayIdx) => {
    const day = schedule[dayIdx];
    timeSelect.innerHTML = '<option value="">Choose a time</option>' + day.slots.map((s) => `<option value="${hourLabel(s.hour)}" ${s.state === 'full' ? 'disabled' : ''}>${hourLabel(s.hour)}${s.state === 'full' ? ' · full' : s.state === 'limited' ? ' · limited' : ''}</option>`).join('');
  };
  const renderSlots = () => {
    const day = schedule[selectedDay];
    boardDayLabel.textContent = day.slots.length ? dayLong(day.date) : `${dayLong(day.date)} · closed`;
    boardSlots.innerHTML = day.slots.length
      ? day.slots.map((s) => `<button type="button" class="slot ${s.state}${selectedHour === s.hour ? ' selected' : ''}" data-hour="${s.hour}" ${s.state === 'full' ? 'disabled aria-disabled="true"' : ''}><strong>${hourLabel(s.hour)}</strong><span>${s.state === 'full' ? 'Booked' : s.state === 'limited' ? '1 suite' : 'Open'}</span></button>`).join('')
      : '<p class="board-note">The house rests on Mondays. Choose another day.</p>';
    $$('button', boardDays).forEach((b, i) => b.setAttribute('aria-selected', String(i === selectedDay)));
  };
  schedule.forEach((day, i) => {
    const n = openCount(day);
    const b = document.createElement('button'); b.type = 'button'; b.role = 'tab';
    b.innerHTML = `<span><small>${i === 0 ? 'Today' : dayName(day.date)}</small><strong>${day.date.getDate()} ${day.date.toLocaleDateString('en-MY', { month: 'short' })}</strong></span><em class="${day.slots.length === 0 || n === 0 ? 'none' : n <= 3 ? 'few' : ''}">${day.slots.length === 0 ? 'Closed' : n === 0 ? 'Full' : `${n} open`}</em>`;
    b.addEventListener('click', () => { selectedDay = i; selectedHour = null; dateInput.value = isoDate(day.date); fillTimes(i); timeSelect.value = ''; renderSlots(); updateSummary(); });
    boardDays.append(b);
  });
  boardSlots.addEventListener('click', (e) => {
    const slot = e.target.closest('.slot:not(.full)'); if (!slot) return;
    selectedHour = Number(slot.dataset.hour);
    dateInput.value = isoDate(schedule[selectedDay].date);
    fillTimes(selectedDay); timeSelect.value = hourLabel(selectedHour);
    renderSlots(); updateSummary();
    $('#reserve').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
  dateInput.min = isoDate(today);
  dateInput.addEventListener('change', () => {
    const idx = schedule.findIndex((d) => isoDate(d.date) === dateInput.value);
    if (idx >= 0) { selectedDay = idx; fillTimes(idx); renderSlots(); } else { timeSelect.innerHTML = '<option value="">Choose a time</option>' + SITE.slotStartHours.map((h) => `<option>${hourLabel(h)}</option>`).join(''); }
    selectedHour = null; updateSummary();
  });
  timeSelect.addEventListener('change', updateSummary);
  renderSlots();

  /* hero live card */
  const todayDay = schedule[0];
  const liveOpen = todayDay.slots.filter((s) => s.state !== 'full');
  $('#liveOpenCount').textContent = String(liveOpen.length);
  $('#liveSlots').innerHTML = liveOpen.length
    ? liveOpen.slice(0, 4).map((s) => `<li class="${s.state}">${hourLabel(s.hour)}</li>`).join('') + (liveOpen.length > 4 ? `<li>+${liveOpen.length - 4} more</li>` : '')
    : `<li>${todayDay.slots.length ? 'Fully reserved today' : 'Closed today'} · see tomorrow</li>`;
  const clock = $('#liveClock');
  const tickClock = () => { clock.textContent = new Date().toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' }); };
  tickClock(); setInterval(tickClock, 30000);

  /* open now */
  const openNow = $('#openNow');
  const h = SITE.hours[new Date().getDay()];
  const nowHour = new Date().getHours() + new Date().getMinutes() / 60;
  if (!h) { openNow.textContent = 'Closed today · opens tomorrow'; openNow.classList.add('closed'); }
  else if (nowHour >= h[0] && nowHour < h[1]) openNow.textContent = `Open now · until ${hourLabel(h[1])}`;
  else { openNow.textContent = `Closed now · opens ${hourLabel(h[0])}`; openNow.classList.add('closed'); }

  /* ---------- reservation summary & WhatsApp ---------- */
  const form = $('#reserveForm');
  const status = $('#formStatus');
  const sumService = $('#sumService'); const sumWhen = $('#sumWhen'); const sumPrice = $('#sumPrice');
  function updateSummary() {
    const item = allItems.find((x) => x.name === serviceSelect.value);
    sumService.textContent = serviceSelect.value || 'Not chosen yet';
    sumPrice.textContent = item ? `${mins(item.mins)} · ${item.from ? 'from ' : ''}${money(item.price)}` : (serviceSelect.value ? 'Confirmed by the atelier' : '—');
    if (dateInput.value && timeSelect.value) {
      const d = new Date(`${dateInput.value}T00:00:00`);
      sumWhen.textContent = `${d.toLocaleDateString('en-MY', { weekday: 'short', day: 'numeric', month: 'short' })} · ${timeSelect.value}`;
    } else sumWhen.textContent = 'Pick a slot on the board';
  }
  serviceSelect.addEventListener('change', updateSummary);
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-select-service]'); if (!link) return;
    serviceSelect.value = link.dataset.selectService; updateSummary();
  });

  const composeMessage = (data) => [
    `${SITE.name} — reservation request`,
    `Name: ${data.name}`,
    `Mobile: ${data.phone}`,
    `Ritual: ${data.service}`,
    `Therapist: ${data.therapist || 'No preference'}`,
    `Date & time: ${data.date} at ${data.time}`,
    `Notes: ${data.notes || '-'}`,
    '',
    'Sent from the atelier website. Please reply "confirmed" or suggest the nearest hour.'
  ].join('\n');
  const validate = () => {
    if (!form.reportValidity()) { status.textContent = 'Please complete the highlighted fields.'; status.classList.add('error'); return null; }
    status.classList.remove('error');
    return Object.fromEntries(new FormData(form).entries());
  };
  const remember = (data) => {
    try {
      const list = JSON.parse(localStorage.getItem(SITE.storageKey) || '[]');
      list.unshift({ ...data, createdAt: new Date().toISOString() });
      localStorage.setItem(SITE.storageKey, JSON.stringify(list.slice(0, 5)));
    } catch (_) { /* storage unavailable */ }
    renderRecent();
  };
  const renderRecent = () => {
    let list = [];
    try { list = JSON.parse(localStorage.getItem(SITE.storageKey) || '[]'); } catch (_) { list = []; }
    const wrap = $('#recentWrap'); const ul = $('#recentList');
    wrap.hidden = list.length === 0;
    ul.innerHTML = list.map((r) => `<li><span>${r.date} · ${r.time}</span>${r.service}</li>`).join('');
  };
  renderRecent();
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = validate(); if (!data) return;
    remember(data);
    status.textContent = 'Saved on this device. Opening WhatsApp with your reservation…';
    window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(composeMessage(data))}`, '_blank', 'noopener');
  });
  $('#copyEnquiry').addEventListener('click', async () => {
    const data = validate(); if (!data) return;
    try { await navigator.clipboard.writeText(composeMessage(data)); remember(data); status.textContent = 'Message copied. Paste it into any chat to confirm.'; }
    catch (_) { status.textContent = 'Copy is not available here. Use the WhatsApp button instead.'; status.classList.add('error'); }
  });

  /* ---------- rituals scroller ---------- */
  const scroller = $('#ritualScroller');
  const stepScroller = (dir) => { const card = scroller.querySelector('.ritual-card'); scroller.scrollBy({ left: dir * (card.getBoundingClientRect().width + 22), behavior: reduceMotion ? 'auto' : 'smooth' }); };
  $('#ritualPrev').addEventListener('click', () => stepScroller(-1));
  $('#ritualNext').addEventListener('click', () => stepScroller(1));

  /* ---------- reviews ---------- */
  const quotes = $$('.quote'); const counter = $('#quoteCounter'); let q = 0; let quoteTimer;
  const showQuote = (i) => { quotes[q].classList.remove('active'); q = (i + quotes.length) % quotes.length; quotes[q].classList.add('active'); counter.textContent = `${q + 1} / ${quotes.length}`; };
  const autoQuote = () => { clearInterval(quoteTimer); if (!reduceMotion) quoteTimer = setInterval(() => showQuote(q + 1), 8000); };
  $('#quotePrev').addEventListener('click', () => { showQuote(q - 1); autoQuote(); });
  $('#quoteNext').addEventListener('click', () => { showQuote(q + 1); autoQuote(); });
  autoQuote();

  /* ---------- counters + reveal ---------- */
  const runCounter = (el) => {
    const end = Number(el.dataset.count); const suffix = el.dataset.suffix || ''; const dur = 1400; const start = performance.now();
    if (reduceMotion) { el.textContent = end + suffix; return; }
    const tick = (now) => { const p = Math.min(1, (now - start) / dur); const eased = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(end * eased) + suffix; if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('show');
      $$('[data-count]', entry.target).forEach(runCounter);
      io.unobserve(entry.target);
    }), { threshold: .12 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => { el.classList.add('show'); $$('[data-count]', el).forEach(runCounter); });
  }

  $('#year').textContent = String(new Date().getFullYear());
})();
