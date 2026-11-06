/* Beauty Salon — modern-01 behaviour
   One data block feeds the bento grid, the quick-book widget, Ask the studio and the booking cart,
   so the studio edits prices and answers in a single place. */
(() => {
  'use strict';

  const SITE = {
    name: 'Beauty Salon',
    whatsapp: '601158121239',               // digits only, country code first
    storageKey: 'beausalon_modern_v1',
    hours: { 0: [9, 19], 1: [10, 21], 2: [10, 21], 3: [10, 21], 4: [10, 21], 5: [10, 21], 6: [9, 19] }, // Sunday = 0
    slotHours: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
  };

  const SERVICES = [
    { id: 'glow-facial', name: 'Glow Facial', cat: 'Face', mins: 60, price: 168, popular: true, size: 'tall photo', img: 'images/facial-ritual.jpg', alt: 'A calm facial treatment', blurb: 'Deep cleanse, enzyme peel, LED, hydration mask.' },
    { id: 'acne-reset', name: 'Clear Skin Reset', cat: 'Face', mins: 60, price: 148, blurb: 'Extraction, salicylic peel, calming mask.' },
    { id: 'hydra', name: 'HydraGlow Infusion', cat: 'Face', mins: 45, price: 198, blurb: 'Vortex cleanse + hyaluronic infusion.' },
    { id: 'hybrid-lash', name: 'Hybrid Lash Set', cat: 'Lash & Brow', mins: 90, price: 198, popular: true, size: 'wide photo', img: 'images/mod-lash-brow.webp', alt: 'Lash extensions being applied', blurb: 'Classic + volume mix. Lasts 3–4 weeks.' },
    { id: 'lash-refill', name: 'Lash Refill', cat: 'Lash & Brow', mins: 60, price: 98, blurb: 'Every 2–3 weeks. Includes lash bath.' },
    { id: 'brow-lam', name: 'Brow Lamination + Tint', cat: 'Lash & Brow', mins: 45, price: 128, blurb: 'Brushed-up brows for 6 weeks.' },
    { id: 'lash-lift', name: 'Lash Lift + Tint', cat: 'Lash & Brow', mins: 50, price: 118, blurb: 'Your own lashes, curled and tinted.' },
    { id: 'gel-mani', name: 'Gel Manicure', cat: 'Nails', mins: 60, price: 88, popular: true, size: 'photo', img: 'images/mod-nails-pastel.webp', alt: 'Pastel gel manicure', blurb: '200+ shades, strengthening base.' },
    { id: 'gel-pedi', name: 'Gel Pedicure', cat: 'Nails', mins: 70, price: 108, blurb: 'Soak, callus care, gel colour.' },
    { id: 'nail-art', name: 'Nail Art (per set)', cat: 'Nails', mins: 30, price: 40, from: true, blurb: 'Chrome, French, 3D — show us a photo.' },
    { id: 'body-scrub', name: 'Body Scrub + Massage', cat: 'Body', mins: 90, price: 228, size: 'wide', blurb: 'Coffee or sugar scrub, 60-min aromatherapy.' },
    { id: 'back-facial', name: 'Back Facial', cat: 'Body', mins: 45, price: 128, blurb: 'For event-ready, clear shoulders.' },
    { id: 'wax-full', name: 'Full Leg Wax', cat: 'Hair removal', mins: 45, price: 98, blurb: 'Hard wax, all-women room.' },
    { id: 'wax-brazil', name: 'Brazilian Wax', cat: 'Hair removal', mins: 30, price: 88, blurb: 'Private room, female therapist only.' },
    { id: 'underarm-ipl', name: 'Underarm IPL (session)', cat: 'Hair removal', mins: 20, price: 68, blurb: 'Course of 6 recommended.' },
    { id: 'blowout', name: 'Blow-out', cat: 'Hair', mins: 45, price: 68, size: 'photo', img: 'images/beauty-hero-hair-v3.webp', alt: 'A stylist shaping glossy waves', blurb: 'Wash, scalp massage, styled finish.' },
    { id: 'bridal', name: 'Bridal Glam', cat: 'Hair', mins: 180, price: 580, from: true, blurb: 'Hair + makeup, trial available.' }
  ];
  const CATEGORIES = ['All', 'Face', 'Lash & Brow', 'Nails', 'Body', 'Hair removal', 'Hair'];

  // Ask the studio knowledge base. keys = words the client might type.
  const FAQ = [
    { keys: ['open', 'hour', 'time', 'sunday', 'saturday', 'weekend', 'close', 'late', 'tonight'], tag: 'Hours', title: 'Open 7 days a week', text: 'Mon–Fri 10 am–9 pm, Sat–Sun 9 am–7 pm. Public holidays by appointment. Last booking is one hour before closing.' },
    { keys: ['park', 'parking', 'car', 'where', 'location', 'address', 'kampung', 'pandan', 'kl'], tag: 'Visit', title: 'Kampung Pandan, Kuala Lumpur', text: '2A Lorong Delapan, Kampung Pandan, 55100 Kuala Lumpur. Message us on WhatsApp for directions and parking.' },
    { keys: ['cancel', 'reschedule', 'change', 'late', 'no show', 'deposit', 'policy'], tag: 'Policy', title: 'Free reschedule up to 12 hours before', text: 'Change or cancel for free up to 12 hours before. Later than that, or a no-show, we ask a RM 30 fee on your next visit. More than 15 minutes late may shorten your service.' },
    { keys: ['hijab', 'private', 'room', 'muslimah', 'women', 'female', 'men', 'guy', 'male'], tag: 'Studio', title: 'Women-only studio, closed rooms', text: 'All therapists are women and every treatment room has a door, so hijab-wearing clients can relax completely. Male guests can wait at the café downstairs.' },
    { keys: ['pregnant', 'pregnancy', 'expecting', 'breastfeeding', 'safe'], tag: 'Health', title: 'Pregnancy-safe options available', text: 'Facials, lashes, brows and nails are fine. We skip IPL, acids and deep-pressure body work. Tell us in the booking note so we prepare the right room and products.' },
    { keys: ['pay', 'payment', 'card', 'cash', 'duitnow', 'tng', 'ewallet', 'qr'], tag: 'Payment', title: 'Card, cash, DuitNow QR and e-wallets', text: 'Pay after your service at the counter. No online payment is taken on this demo site.' },
    { keys: ['first', 'new', 'promo', 'discount', 'student', 'offer'], tag: 'Offer', title: 'First visit: 15% off any facial', text: 'Mention "first glow" in your booking note. Students get 10% off nails on weekdays with a valid ID.' },
    { keys: ['bridal', 'wedding', 'bride', 'event', 'dinner', 'makeup'], tag: 'Bridal', title: 'Bridal Glam from RM 580', text: 'Hair and makeup at the studio or on location in the Klang Valley. A trial is RM 280 and is deducted when you confirm the wedding date.' },
    { keys: ['long', 'duration', 'how long', 'take'], tag: 'Timing', title: 'Every service shows its duration', text: 'Look at the minutes on each card. If you add two services, the booking cart adds the time up so you know when you will be done.' },
    { keys: ['slot', 'available', 'availability', 'today', 'tomorrow', 'free', 'last', 'book', 'when'], tag: 'Availability', title: 'Open slots are shown live', text: 'Scroll to "Best times" to see this week\'s open slots, or use the quick-book bar at the top. Tap a time and it goes straight into your booking.', action: 'times' },
    { keys: ['kid', 'child', 'children', 'baby'], tag: 'Studio', title: 'Little ones are welcome in the lounge', text: 'The lounge has a play corner. Treatment rooms are adults only so you can rest.' },
    { keys: ['allergy', 'sensitive', 'eczema', 'reaction', 'patch'], tag: 'Health', title: 'Patch test for tint and lashes', text: 'If it is your first tint or lash set with us, we do a free 5-minute patch test 24 hours before, or at the start of a longer appointment.' }
  ];

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const money = (n) => `RM ${n.toLocaleString('en-MY')}`;
  const pad = (n) => String(n).padStart(2, '0');
  const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const hourLabel = (h) => `${((h + 11) % 12) + 1}:00 ${h >= 12 ? 'PM' : 'AM'}`;
  const byName = (name) => SERVICES.find((s) => s.name === name);
  const priceText = (s) => `${s.from ? 'from ' : ''}${money(s.price)}`;

  /* ---------- toast ---------- */
  const toastEl = $('#toast'); let toastTimer;
  const toast = (msg) => { toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400); };

  /* ---------- header & nav ---------- */
  const header = $('#siteHeader'); const navLinks = $('#navLinks'); const menuToggle = $('#menuToggle');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  menuToggle.addEventListener('click', () => { const open = navLinks.classList.toggle('open'); document.body.classList.toggle('menu-open', open); menuToggle.setAttribute('aria-expanded', String(open)); });
  navLinks.addEventListener('click', (e) => { if (e.target.closest('a')) { navLinks.classList.remove('open'); document.body.classList.remove('menu-open'); menuToggle.setAttribute('aria-expanded', 'false'); } });
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) $$('.nav-links a').forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${en.target.id}`)); }), { rootMargin: '-40% 0px -55% 0px' });
    $$('main section[id]').forEach((s) => spy.observe(s));
  }

  /* ---------- schedule (deterministic demo) ---------- */
  const seed = (str) => { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return () => { h += 0x6D2B79F5; let t = Math.imul(h ^ (h >>> 15), 1 | h); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const now = new Date();
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(today); d.setDate(today.getDate() + i); return d; });
  const schedule = days.map((date) => {
    const hrs = SITE.hours[date.getDay()]; const rnd = seed(isoDate(date));
    const weekend = date.getDay() === 0 || date.getDay() === 6;
    const slots = SITE.slotHours.filter((h) => h >= hrs[0] && h < hrs[1]).map((h) => {
      // busyness curve: lunchtime + evenings + weekends busier
      let load = 0.35 + (h >= 12 && h <= 14 ? 0.25 : 0) + (h >= 18 ? 0.3 : 0) + (weekend ? 0.2 : 0) + (rnd() - 0.5) * 0.4;
      load = Math.max(0.05, Math.min(1, load));
      let state = load > 0.8 ? 'full' : load > 0.55 ? 'limited' : 'open';
      if (isoDate(date) === isoDate(now) && h <= now.getHours()) { state = 'full'; load = 1; }
      return { hour: h, state, load };
    });
    return { date, slots };
  });
  const openSlots = (day) => day.slots.filter((s) => s.state !== 'full');
  const dayShort = (d) => d.toLocaleDateString('en-MY', { weekday: 'short' });
  const dayLong = (d) => d.toLocaleDateString('en-MY', { weekday: 'long', day: 'numeric', month: 'long' });

  /* ---------- shared booking state ---------- */
  const state = { services: [], dayIdx: 0, hour: null };
  const dateInput = $('#date'); const timeSelect = $('#time');
  const qbService = $('#qbService'); const qbDays = $('#qbDays'); const qbTimes = $('#qbTimes'); const qbSummary = $('#qbSummary');
  const busyChart = $('#busyChart'); const slotsList = $('#slotsList'); const slotsTitle = $('#slotsTitle'); const slotsCount = $('#slotsCount'); const busyNote = $('#busyNote');
  dateInput.min = isoDate(today);

  const fillTimeSelect = (dayIdx) => {
    const opts = dayIdx >= 0 ? schedule[dayIdx].slots.map((s) => `<option value="${hourLabel(s.hour)}" ${s.state === 'full' ? 'disabled' : ''}>${hourLabel(s.hour)}${s.state === 'full' ? ' · full' : s.state === 'limited' ? ' · 1 left' : ''}</option>`) : SITE.slotHours.map((h) => `<option>${hourLabel(h)}</option>`);
    timeSelect.innerHTML = '<option value="">Choose a time</option>' + opts.join('');
  };
  const setDay = (idx) => { state.dayIdx = idx; state.hour = null; dateInput.value = isoDate(schedule[idx].date); fillTimeSelect(idx); timeSelect.value = ''; renderQuickBook(); renderBusy(); };
  const setHour = (h) => { state.hour = h; if (state.dayIdx >= 0) { fillTimeSelect(state.dayIdx); timeSelect.value = hourLabel(h); } renderQuickBook(); };
  dateInput.addEventListener('change', () => { const idx = schedule.findIndex((d) => isoDate(d.date) === dateInput.value); state.dayIdx = idx; state.hour = null; fillTimeSelect(idx); renderQuickBook(); renderBusy(); });
  timeSelect.addEventListener('change', () => { const found = state.dayIdx >= 0 && schedule[state.dayIdx].slots.find((s) => hourLabel(s.hour) === timeSelect.value); state.hour = found ? found.hour : null; renderQuickBook(); });

  /* ---------- cart ---------- */
  const cartList = $('#cartList'); const cartMeta = $('#cartMeta'); const cartTotal = $('#cartTotal');
  const cartSummary = () => ({ mins: state.services.reduce((a, s) => a + s.mins, 0), price: state.services.reduce((a, s) => a + s.price, 0) });
  const renderCart = () => {
    const { mins, price } = cartSummary();
    cartList.innerHTML = state.services.map((s) => `<li><div>${s.name}<br><span>${s.mins} min · ${priceText(s)}</span></div><strong>${money(s.price)}</strong><button type="button" data-remove="${s.id}" aria-label="Remove ${s.name}">✕</button></li>`).join('');
    cartMeta.textContent = state.services.length ? `${state.services.length} service${state.services.length > 1 ? 's' : ''} · about ${mins} min` : 'Nothing added yet';
    cartTotal.textContent = money(price);
    $$('.svc').forEach((card) => card.classList.toggle('added', state.services.some((s) => s.id === card.dataset.id)));
    renderQuickBook();
  };
  const addService = (name, { quiet } = {}) => {
    const s = byName(name); if (!s) return;
    if (state.services.some((x) => x.id === s.id)) { if (!quiet) toast(`${s.name} is already in your booking`); return; }
    state.services.push(s); renderCart(); if (!quiet) toast(`Added ${s.name} · ${s.mins} min`);
  };
  const removeService = (id) => { state.services = state.services.filter((s) => s.id !== id); renderCart(); };
  cartList.addEventListener('click', (e) => { const b = e.target.closest('[data-remove]'); if (b) removeService(b.dataset.remove); });
  document.addEventListener('click', (e) => { const b = e.target.closest('[data-add]'); if (b) addService(b.dataset.add); });
  const addSelect = $('#addService');
  SERVICES.forEach((s) => { const o = document.createElement('option'); o.value = s.name; o.textContent = `${s.name} · ${s.mins} min · ${priceText(s)}`; addSelect.append(o); });
  $('#addServiceBtn').addEventListener('click', () => { if (addSelect.value) { addService(addSelect.value); addSelect.value = ''; } });

  /* ---------- bento services ---------- */
  const grid = $('#serviceGrid'); const filters = $('#serviceFilters');
  const colour = (cat) => ({ 'Face': 'c-peach', 'Lash & Brow': 'c-lav', 'Nails': 'c-sage', 'Body': 'c-peach', 'Hair removal': 'c-lav', 'Hair': 'c-sage' }[cat] || '');
  const renderGrid = (cat) => {
    grid.innerHTML = SERVICES.filter((s) => cat === 'All' || s.cat === cat).map((s) => `
      <article class="svc ${s.size || ''} ${s.img ? '' : colour(s.cat)}" data-id="${s.id}" data-name="${s.name}" tabindex="0" role="button" aria-label="Add ${s.name} to booking">
        ${s.img ? `<img src="${s.img}" alt="${s.alt}" loading="lazy">` : ''}
        ${s.popular ? '<span class="tag chip chip-peach">Popular</span>' : ''}
        <span class="add" aria-hidden="true">+</span>
        <span class="svc-cat">${s.cat}</span>
        <h3>${s.name}</h3>
        <div class="svc-meta"><span>${s.mins} min<em class="blurb"> · ${s.blurb}</em></span><strong>${priceText(s)}</strong></div>
      </article>`).join('');
    renderCart();
  };
  CATEGORIES.forEach((c, i) => { const b = document.createElement('button'); b.type = 'button'; b.role = 'tab'; b.textContent = c; b.setAttribute('aria-selected', String(i === 0)); b.addEventListener('click', () => { $$('button', filters).forEach((x) => x.setAttribute('aria-selected', 'false')); b.setAttribute('aria-selected', 'true'); renderGrid(c); }); filters.append(b); });
  renderGrid('All');
  const toggleCard = (card) => { const s = SERVICES.find((x) => x.id === card.dataset.id); if (state.services.some((x) => x.id === s.id)) { removeService(s.id); toast(`Removed ${s.name}`); } else addService(s.name); };
  grid.addEventListener('click', (e) => { const card = e.target.closest('.svc'); if (card) toggleCard(card); });
  grid.addEventListener('keydown', (e) => { const card = e.target.closest('.svc'); if (card && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); toggleCard(card); } });

  /* ---------- quick book widget ---------- */
  SERVICES.forEach((s) => { const o = document.createElement('option'); o.value = s.name; o.textContent = `${s.name} · ${s.mins} min · ${priceText(s)}`; qbService.append(o); });
  qbService.addEventListener('change', () => { if (qbService.value) { state.services = []; addService(qbService.value, { quiet: true }); } });
  schedule.forEach((day, i) => {
    const n = openSlots(day).length;
    const b = document.createElement('button'); b.type = 'button'; b.role = 'tab';
    b.innerHTML = `<small>${i === 0 ? 'Today' : dayShort(day.date)}</small><strong>${day.date.getDate()}</strong><em class="${n === 0 ? 'none' : n <= 3 ? 'few' : ''}">${n === 0 ? 'full' : `${n} open`}</em>`;
    b.addEventListener('click', () => setDay(i));
    qbDays.append(b);
  });
  function renderQuickBook() {
    $$('button', qbDays).forEach((b, i) => b.setAttribute('aria-selected', String(i === state.dayIdx)));
    const day = state.dayIdx >= 0 ? schedule[state.dayIdx] : null;
    qbTimes.innerHTML = day ? (day.slots.length ? day.slots.map((s) => `<button type="button" class="${s.state}" data-hour="${s.hour}" aria-pressed="${state.hour === s.hour}" ${s.state === 'full' ? 'disabled' : ''}>${hourLabel(s.hour)}</button>`).join('') : '<span class="empty">Closed</span>') : '<span class="empty">Pick a day on the board</span>';
    const { mins, price } = cartSummary();
    const first = state.services[0];
    if (!first) qbSummary.textContent = 'Pick a service to see price & duration';
    else {
      const when = day && state.hour !== null ? ` · ${dayShort(day.date)} ${hourLabel(state.hour)}` : day ? ` · ${dayShort(day.date)}, pick a time` : '';
      qbSummary.textContent = `${state.services.length > 1 ? `${state.services.length} services` : first.name} · ${mins} min · ${money(price)}${when}`;
    }
    if (qbService.value !== (first ? first.name : '') && state.services.length <= 1) qbService.value = first ? first.name : '';
  }
  qbTimes.addEventListener('click', (e) => { const b = e.target.closest('button:not(:disabled)'); if (b) setHour(Number(b.dataset.hour)); });
  $('#qbContinue').addEventListener('click', () => {
    if (!state.services.length) { toast('Choose a service first'); qbService.focus(); return; }
    if (state.hour === null) { toast('Pick a day and time'); return; }
    $('#book').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    setTimeout(() => $('#name').focus({ preventScroll: true }), reduceMotion ? 0 : 600);
  });
  setDay(0);

  // hero chip
  const todayOpen = openSlots(schedule[0]).length;
  $('#heroOpenChip').textContent = todayOpen ? `${todayOpen} slots open today` : 'Fully booked today · see tomorrow';

  /* ---------- Ask the studio ---------- */
  const askForm = $('#askForm'); const askInput = $('#askInput'); const askResults = $('#askResults');
  const tokenize = (q) => q.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  const answer = (q) => {
    const words = tokenize(q); if (!words.length) return;
    const lower = q.toLowerCase();
    const svcHits = SERVICES.map((s) => ({ s, score: words.reduce((a, w) => a + (s.name.toLowerCase().includes(w) || s.cat.toLowerCase().includes(w) || s.blurb.toLowerCase().includes(w) ? 1 : 0), 0) + (lower.includes(s.name.toLowerCase()) ? 3 : 0) })).filter((x) => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);
    const faqHits = FAQ.map((f) => ({ f, score: f.keys.reduce((a, k) => a + (lower.includes(k) ? (k.includes(' ') ? 2 : 1) : 0), 0) })).filter((x) => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 2);
    const cards = [];
    svcHits.forEach(({ s }) => cards.push(`<div class="answer"><small>${s.cat} · service</small><strong>${s.name} — ${priceText(s)}, ${s.mins} min</strong><p>${s.blurb}</p><div class="answer-actions"><button type="button" data-add="${s.name}">Add to booking</button><button type="button" data-jump="#times">See open slots</button></div></div>`));
    faqHits.forEach(({ f }) => cards.push(`<div class="answer"><small>${f.tag}</small><strong>${f.title}</strong><p>${f.text}</p>${f.action === 'times' ? '<div class="answer-actions"><button type="button" data-jump="#times">Open the board</button></div>' : ''}</div>`));
    askResults.innerHTML = cards.length ? cards.join('') : `<div class="answer"><small>Not found</small><strong>We don't have that answer yet</strong><p>Send it on WhatsApp and the studio will reply personally. Common questions get added here so nobody has to ask twice.</p><div class="answer-actions"><button type="button" data-wa="${encodeURIComponent(q)}">Ask on WhatsApp</button></div></div>`;
  };
  askForm.addEventListener('submit', (e) => { e.preventDefault(); answer(askInput.value); });
  let askTimer; askInput.addEventListener('input', () => { clearTimeout(askTimer); askTimer = setTimeout(() => { if (askInput.value.trim().length > 2) answer(askInput.value); }, 280); });
  $('#askSuggest').addEventListener('click', (e) => { const b = e.target.closest('[data-q]'); if (b) { askInput.value = b.dataset.q; answer(b.dataset.q); } });
  askResults.addEventListener('click', (e) => {
    const jump = e.target.closest('[data-jump]'); if (jump) $(jump.dataset.jump).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    const wa = e.target.closest('[data-wa]'); if (wa) window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Hi Beauty Salon, quick question: ')}${wa.dataset.wa}`, '_blank', 'noopener');
  });

  /* ---------- busy chart + open slots ---------- */
  function renderBusy() {
    busyChart.innerHTML = schedule.map((day, i) => `
      <div class="busy-day" data-today="${i === 0}">
        <button type="button" aria-pressed="${i === state.dayIdx}" aria-label="${dayLong(day.date)}: ${openSlots(day).length} open slots">
          ${day.slots.map((s) => `<i class="${s.load > 0.8 ? 'busy' : s.load > 0.55 ? 'mod' : ''}" style="height:${Math.round(s.load * 100)}%"></i>`).join('')}
        </button>
        <span>${i === 0 ? 'Today' : dayShort(day.date)}</span>
      </div>`).join('');
    const day = state.dayIdx >= 0 ? schedule[state.dayIdx] : schedule[0];
    const open = openSlots(day);
    slotsTitle.textContent = `Open · ${state.dayIdx === 0 ? 'today' : dayShort(day.date)} ${day.date.getDate()}`;
    slotsCount.textContent = open.length ? `${open.length} slots` : 'Full';
    slotsList.innerHTML = open.length ? open.map((s) => `<button type="button" class="${s.state}" data-hour="${s.hour}">${hourLabel(s.hour)}${s.state === 'limited' ? ' · 1 left' : ''}</button>`).join('') : '<span class="empty">Fully booked. Try the next day or ask to be waitlisted.</span>';
    const quietest = [...day.slots].filter((s) => s.state !== 'full').sort((a, b) => a.load - b.load)[0];
    busyNote.textContent = quietest ? `Quietest time on ${dayShort(day.date)}: around ${hourLabel(quietest.hour)}. Lunchtime and evenings fill first.` : 'Mornings on weekdays are usually the calmest.';
  }
  busyChart.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; const idx = [...busyChart.children].indexOf(b.parentElement); setDay(idx); });
  slotsList.addEventListener('click', (e) => { const b = e.target.closest('[data-hour]'); if (!b) return; setHour(Number(b.dataset.hour)); toast(`${hourLabel(Number(b.dataset.hour))} selected`); $('#book').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); });
  /* ---------- passes toggle ---------- */
  $$('.toggle button').forEach((b) => b.addEventListener('click', () => {
    $$('.toggle button').forEach((x) => x.classList.toggle('active', x === b));
    const mode = b.dataset.mode;
    $$('.pass-price strong').forEach((el) => { el.textContent = money(Number(el.dataset[mode])); });
    $$('.pass-price span').forEach((el) => { el.textContent = el.dataset[mode]; });
  }));

  /* ---------- booking form, storage, drawer ---------- */
  const form = $('#bookForm'); const status = $('#formStatus');
  const load = () => { try { return JSON.parse(localStorage.getItem(SITE.storageKey) || '[]'); } catch (_) { return []; } };
  const save = (list) => { try { localStorage.setItem(SITE.storageKey, JSON.stringify(list.slice(0, 10))); } catch (_) { /* storage unavailable */ } };
  const badge = $('#bookingBadge'); const drawer = $('#drawer'); const drawerList = $('#drawerList'); const drawerEmpty = $('#drawerEmpty');
  const renderDrawer = () => {
    const list = load();
    badge.hidden = list.length === 0; badge.textContent = String(list.length);
    drawerEmpty.hidden = list.length > 0;
    drawerList.innerHTML = list.map((b) => `<li><strong>${b.services.join(' + ')}</strong><span>${b.date} · ${b.time} · ${b.mins} min · ${money(b.price)}</span><div class="row"><span class="chip chip-peach">Awaiting confirmation</span><button type="button" data-cancel="${b.id}">Remove</button></div></li>`).join('');
  };
  drawerList.addEventListener('click', (e) => { const b = e.target.closest('[data-cancel]'); if (!b) return; save(load().filter((x) => x.id !== b.dataset.cancel)); renderDrawer(); toast('Booking removed from this device'); });
  const openDrawer = (open) => { drawer.classList.toggle('open', open); drawer.setAttribute('aria-hidden', String(!open)); document.body.classList.toggle('drawer-open', open); };
  $('#openBookings').addEventListener('click', () => openDrawer(true));
  $('#closeDrawer').addEventListener('click', () => openDrawer(false));
  $('#drawerBackdrop').addEventListener('click', () => openDrawer(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') openDrawer(false); });
  renderDrawer();

  const compose = (data) => {
    const { mins, price } = cartSummary();
    return [
      `${SITE.name} — booking request`,
      `Name: ${data.name}`,
      `WhatsApp: ${data.phone}`,
      `Services: ${state.services.map((s) => `${s.name} (${s.mins} min, ${priceText(s)})`).join(', ')}`,
      `Total: about ${mins} min · ${money(price)}`,
      `Date & time: ${data.date} at ${data.time}`,
      `Notes: ${data.notes || '-'}`,
      '',
      'Sent from the studio website. Reply "confirmed" or suggest the nearest slot.'
    ].join('\n');
  };
  const validate = () => {
    status.classList.remove('error');
    if (!state.services.length) { status.textContent = 'Add at least one service first.'; status.classList.add('error'); addSelect.focus(); return null; }
    if (!form.reportValidity()) { status.textContent = 'Please complete the highlighted fields.'; status.classList.add('error'); return null; }
    return Object.fromEntries(new FormData(form).entries());
  };
  const persist = (data) => {
    const { mins, price } = cartSummary();
    const list = load();
    list.unshift({ id: String(Date.now()), services: state.services.map((s) => s.name), mins, price, date: data.date, time: data.time, createdAt: new Date().toISOString() });
    save(list); renderDrawer();
  };
  form.addEventListener('submit', (e) => {
    e.preventDefault(); const data = validate(); if (!data) return;
    persist(data);
    status.textContent = 'Saved to "My bookings". Opening WhatsApp with your message…';
    window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(compose(data))}`, '_blank', 'noopener');
  });
  $('#copyBooking').addEventListener('click', async () => {
    const data = validate(); if (!data) return;
    try { await navigator.clipboard.writeText(compose(data)); persist(data); status.textContent = 'Message copied. Paste it into any chat.'; }
    catch (_) { status.textContent = 'Copy is not available here. Use the WhatsApp button.'; status.classList.add('error'); }
  });

  /* ---------- open now ---------- */
  const openNow = $('#openNow'); const h = SITE.hours[now.getDay()]; const nowH = now.getHours() + now.getMinutes() / 60;
  if (nowH >= h[0] && nowH < h[1]) openNow.textContent = `Open now · until ${hourLabel(h[1])}`;
  else { openNow.textContent = `Closed now · opens ${hourLabel(h[0])}`; openNow.classList.add('closed'); }

  /* ---------- reply-cost calculator ---------- */
  const msg = $('#msgPerDay'); const min = $('#minPerReply'); const pct = $('#pctRoutine');
  const calc = () => {
    const m = Number(msg.value); const mi = Number(min.value); const p = Number(pct.value) / 100;
    const hours = (m * mi * 26) / 60;                  // 26 working days
    $('#msgOut').textContent = m; $('#minOut').textContent = mi; $('#pctOut').textContent = `${Math.round(p * 100)}%`;
    $('#hoursLost').textContent = `${Math.round(hours)} h`;
    $('#hoursSaved').textContent = `${Math.round(hours * p)} h`;
    $('#bookingsLost').textContent = String(Math.round(m * 26 * 0.2));
  };
  [msg, min, pct].forEach((el) => el.addEventListener('input', calc)); calc();

  /* ---------- reveal ---------- */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('show'); io.unobserve(en.target); } }), { threshold: .1 });
    revealEls.forEach((el) => io.observe(el));
  } else revealEls.forEach((el) => el.classList.add('show'));

  $('#year').textContent = String(new Date().getFullYear());
})();
