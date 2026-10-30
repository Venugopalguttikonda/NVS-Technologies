// Money Ledgr product page: menu, header shadow, back-to-top, active link

const header = document.querySelector('.site-header');
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('main-nav');
const toTop = document.getElementById('to-top');

function closeMenu() {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open menu');
}

toggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', isOpen);
  toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});
nav.addEventListener('click', (e) => { if (e.target.tagName === 'A') closeMenu(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
  toTop.hidden = window.scrollY < 700;
});
toTop.addEventListener('click', () => window.scrollTo({ top: 0 }));

// Highlight the nav link for the section on screen (only in-page links)
const links = [...document.querySelectorAll('.main-nav a[href^="#"]')];
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
links.forEach(l => { const s = document.querySelector(l.getAttribute('href')); if (s) observer.observe(s); });

document.getElementById('year').textContent = new Date().getFullYear();


// ==========================================================
// Interactive budget demo (sample data, nothing is saved)
// ==========================================================
const demoForm = document.getElementById('demo-form');

if (demoForm) {
  const START = [
    { id: 'food',      name: 'Food',          limit: 2500, used: 120 },
    { id: 'transport', name: 'Transport',     limit: 1500, used: 0 },
    { id: 'fun',       name: 'Entertainment', limit: 1500, used: 0 }
  ];
  let cats = START.map(c => ({ ...c }));

  // days left this month, taken from today's real date
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeft = daysInMonth - now.getDate() + 1;

  const money = (n) => '\u20B9' + Math.round(n).toLocaleString('en-IN');
  const $ = (id) => document.getElementById(id);
  const select = $('demo-cat');

  cats.forEach(c => select.add(new Option(c.name, c.id)));

  function render() {
    const total = cats.reduce((sum, c) => sum + c.limit, 0);
    const used = cats.reduce((sum, c) => sum + c.used, 0);
    const remaining = total - used;
    const share = used / total;

    $('d-remaining').textContent = money(remaining);
    $('d-total').textContent = money(total);
    $('d-used').textContent = money(used);
    $('d-bar').style.width = Math.max(2, Math.min(100, share * 100)) + '%';
    $('d-daily').textContent = remaining >= 0
      ? 'You can spend ' + money(remaining / daysLeft) + '/day for ' + daysLeft + ' days'
      : 'You are ' + money(-remaining) + ' over budget this month';

    const card = $('dp-balance');
    card.classList.toggle('over', remaining < 0);
    card.classList.toggle('low', remaining >= 0 && share >= 0.8);

    $('d-list').innerHTML = cats.map(c => {
      const pct = c.used / c.limit;
      const state = pct > 1 ? 'over' : pct >= 0.8 ? 'warn' : '';
      return '<li class="' + state + '">' +
        '<div class="dp-row"><b>' + c.name + '</b><span>' + money(c.used) + ' / ' + money(c.limit) + '</span></div>' +
        '<div class="dp-mini"><i style="width:' + Math.min(100, pct * 100) + '%"></i></div></li>';
    }).join('');
  }

  function addExpense(amount, id) {
    const cat = cats.find(c => c.id === id);
    if (!cat || !(amount > 0)) return;

    const before = cat.used;
    cat.used += amount;
    render();

    const big = $('d-remaining');
    big.classList.remove('pulse');
    void big.offsetWidth;            // restart the animation
    big.classList.add('pulse');

    let msg = 'Added ' + money(amount) + ' to ' + cat.name + '.';
    if (cat.used > cat.limit && before <= cat.limit) msg = cat.name + ' limit crossed by ' + money(cat.used - cat.limit) + '.';
    else if (cat.used > cat.limit) msg = cat.name + ' is ' + money(cat.used - cat.limit) + ' over its limit.';
    else if (cat.used / cat.limit >= 0.8) msg = cat.name + ' is at ' + Math.round(cat.used / cat.limit * 100) + '% of its limit.';
    $('d-toast').textContent = msg;
  }

  demoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const amountField = $('demo-amount');
    addExpense(Number(amountField.value), select.value);
    amountField.value = '';
    amountField.focus();
  });

  $('demo-quick').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (btn) addExpense(Number(btn.dataset.amt), btn.dataset.cat);
  });

  $('demo-reset').addEventListener('click', () => {
    cats = START.map(c => ({ ...c }));
    $('d-toast').textContent = 'Demo reset.';
    render();
  });

  render();
}

// ==========================================================
// Animated tour (plays like a short video)
// ==========================================================

// To use your own video: upload it to YouTube, copy the ID from the link
// (the part after v=) and paste it between the quotes. A button then appears.
const TOUR_VIDEO_ID = '';

const tour = document.getElementById('tour');

if (tour) {
  const slides = [
    { src: 'images/screens/investments.jpg',   title: 'Grow your investments', text: 'See portfolio value, returns and allocation in one place.', alt: 'Investment Portfolio screen' },
    { src: 'images/screens/budgets.jpg',       title: 'Budgets made simple',   text: 'Set monthly limits and know what you can spend each day.', alt: 'Budgets screen' },
    { src: 'images/screens/plan-funds.jpg',    title: 'Plan your funds',       text: 'Divide your money across bills, savings and goals.',      alt: 'Plan Your Funds screen' },
    { src: 'images/screens/loans.jpg',         title: 'Manage loans with ease', text: 'Track EMIs, interest and due dates, owed and lent.',      alt: 'Loans screen' },
    { src: 'images/screens/split-payments.jpg', title: 'Split payments',       text: 'Share trip and flat costs, then settle up cleanly.',      alt: 'Split Payments screen' }
  ];

  const img = document.getElementById('tour-img');
  const caption = document.querySelector('.tour-caption');
  const segsBox = document.getElementById('tour-segs');
  const playBtn = document.getElementById('tour-play');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;
  let started = false;

  slides.forEach((s, i) => {
    const seg = document.createElement('button');
    seg.type = 'button';
    seg.className = 'seg';
    seg.setAttribute('aria-label', 'Go to ' + s.title);
    seg.innerHTML = '<span><i></i></span>';
    seg.addEventListener('click', () => goTo(i));
    // when the progress bar finishes, move on to the next slide
    seg.querySelector('i').addEventListener('animationend', () => goTo(index + 1));
    segsBox.appendChild(seg);
  });
  const segs = [...segsBox.children];

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    const s = slides[index];

    img.classList.add('swap');
    caption.classList.add('swap');
    setTimeout(() => {
      img.src = s.src;
      img.alt = s.alt;
      document.getElementById('tour-title').textContent = s.title;
      document.getElementById('tour-text').textContent = s.text;
      document.getElementById('tour-count').textContent = (index + 1) + ' / ' + slides.length;
      img.classList.remove('swap');
      caption.classList.remove('swap');
    }, 220);

    segs.forEach((seg, k) => {
      seg.classList.remove('active');
      seg.classList.toggle('done', k < index);
    });
    void segsBox.offsetWidth;       // restart the fill animation
    segs[index].classList.add('active');
  }

  function setPlaying(on) {
    tour.classList.toggle('paused', !on);
    playBtn.innerHTML = on ? '&#10074;&#10074;' : '&#9654;';
    playBtn.setAttribute('aria-label', on ? 'Pause tour' : 'Play tour');
  }

  playBtn.addEventListener('click', () => setPlaying(tour.classList.contains('paused')));

  goTo(0);
  setPlaying(false);

  // start playing only once the tour is on screen
  new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      if (!reduceMotion) setPlaying(true);
      obs.disconnect();
    }
  }, { threshold: 0.4 }).observe(tour);

  // optional: real video
  const videoBtn = document.getElementById('tour-video');
  if (TOUR_VIDEO_ID) {
    videoBtn.hidden = false;
    videoBtn.addEventListener('click', () => {
      setPlaying(false);
      document.getElementById('tour-stage').innerHTML =
        '<iframe src="https://www.youtube-nocookie.com/embed/' + TOUR_VIDEO_ID + '?autoplay=1&rel=0" ' +
        'title="Money Ledgr video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
      document.querySelector('.tour-controls').hidden = true;
    });
  }
}


// ==========================================================
// Money playground: EMI, split a bill, savings goal
// ==========================================================
const lab = document.querySelector('.lab');

if (lab) {
  const $ = (id) => document.getElementById(id);
  const money = (n) => '\u20B9' + Math.round(n).toLocaleString('en-IN');
  const val = (id) => parseFloat($(id).value) || 0;

  // keep each slider and its number box in step with each other
  lab.querySelectorAll('.lf').forEach(box => {
    const range = box.querySelector('[type=range]');
    const num = box.querySelector('[type=number]');
    range.addEventListener('input', () => { num.value = range.value; calcAll(); });
    num.addEventListener('input', () => { range.value = num.value; calcAll(); });
  });
  $('s-paid').addEventListener('change', calcAll);

  // tabs
  const tabs = [...lab.querySelectorAll('[role=tab]')];
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => {
      const on = t === tab;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on);
      $(t.getAttribute('aria-controls')).hidden = !on;
    });
  }));

  function calcEmi() {
    const p = val('e-p'), n = Math.max(1, val('e-n'));
    const r = val('e-r') / 12 / 100;
    const emi = r === 0 ? p / n : p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    $('e-emi').textContent = money(emi);
    $('e-pr').textContent = money(p);
    $('e-int').textContent = money(total - p);
    $('e-tot').textContent = money(total);
    $('e-donut').style.setProperty('--p', total ? (p / total * 100).toFixed(1) : 100);
  }

  function calcSplit() {
    const bill = val('s-b'), people = Math.max(2, Math.round(val('s-n')));
    const total = bill * (1 + val('s-t') / 100);
    const each = total / people;
    $('s-each').textContent = money(each);
    $('s-total').textContent = money(total);
    $('s-line').innerHTML = $('s-paid').checked
      ? 'Friends owe you <b>' + money(total - each) + '</b>'
      : 'You owe the payer <b>' + money(each) + '</b>';
    $('s-people').innerHTML = Array.from({ length: Math.min(people, 20) }, (_, i) => '<i' + (i === 0 ? ' class="you"' : '') + '></i>').join('');
  }

  function calcGoal() {
    const target = val('g-t'), n = Math.max(1, val('g-n')), saved = val('g-c');
    const r = val('g-r') / 12 / 100;
    const grown = saved * Math.pow(1 + r, n);                // what today's savings become
    const gap = Math.max(0, target - grown);                 // what we still need to build
    const monthly = r === 0 ? gap / n : gap * r / (Math.pow(1 + r, n) - 1);
    const put = monthly * n + saved;
    $('g-month').textContent = money(monthly);
    $('g-day').textContent = money(monthly * 12 / 365);
    $('g-put').textContent = money(put);
    $('g-grow').textContent = money(Math.max(0, target - put));
    $('g-bar').style.width = Math.min(100, (put / Math.max(target, 1)) * 100) + '%';
  }

  function calcAll() { calcEmi(); calcSplit(); calcGoal(); }
  calcAll();
}

// ==========================================================
// Scroll reveal: sections fade up as they come into view
// ==========================================================
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('js');

  const targets = document.querySelectorAll(
    '.overview > div, .demo-phone, .demo-copy, .lab, .feat-tabs, .tool-grid li, .p-steps li, .audience > div, .tour, .p-cta-inner'
  );
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 3) * 80 + 'ms';    // small stagger inside rows
    io.observe(el);
  });
}


// ==========================================================
// Features in detail: one panel, switch between the five screens
// ==========================================================
const featBox = document.getElementById('feat-tabs');

if (featBox) {
  const tabs = [...featBox.querySelectorAll('[role=tab]')];

  function showFeature(tab, focus) {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
    tab.scrollIntoView({ block: 'nearest', inline: 'center' });
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => showFeature(tab));
    tab.addEventListener('keydown', (e) => {
      const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (step) { e.preventDefault(); showFeature(tabs[(i + step + tabs.length) % tabs.length], true); }
      if (e.key === 'Home') { e.preventDefault(); showFeature(tabs[0], true); }
      if (e.key === 'End') { e.preventDefault(); showFeature(tabs[tabs.length - 1], true); }
    });
  });
}


// ---------- App preview slider ----------
(function () {
  const track = document.getElementById('pv-track');
  if (!track) return;
  const prev = document.getElementById('pv-prev');
  const next = document.getElementById('pv-next');
  const step = () => { const i = track.querySelector('.pv-item'); return i.offsetWidth + 22; };
  const update = () => {
    prev.disabled = track.scrollLeft < 4;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  };
  prev.addEventListener('click', () => track.scrollBy({ left: -step() * 2 }));
  next.addEventListener('click', () => track.scrollBy({ left: step() * 2 }));
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
