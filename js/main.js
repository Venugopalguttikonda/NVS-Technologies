// NVS Technologies - small interactions: mobile menu, active links, form check

const header = document.querySelector('.site-header');
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('main-nav');
const toTop = document.getElementById('to-top');

// Mobile menu open/close
toggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', isOpen);
  toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

// Close the menu after tapping a link, or pressing Escape
nav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') closeMenu();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});
function closeMenu() {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open menu');
}

// Header shadow + back-to-top button
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
  toTop.hidden = window.scrollY < 600;
});
toTop.addEventListener('click', () => window.scrollTo({ top: 0 }));

// Highlight the nav link for the section currently on screen
const links = document.querySelectorAll('.main-nav a:not(.btn)');
const sections = [...links].map(l => document.querySelector(l.getAttribute('href')));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => s && observer.observe(s));

// Contact form: basic checks before sending
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

// Paste your Google Form "pre-filled link" here (setup steps are in the chat).
// The form saves every message into a Google Sheet. Questions must be in this order: Name, Email, Message.
const GOOGLE_FORM_LINK = 'PASTE_YOUR_PREFILLED_LINK_HERE';

// Work out the submit address and the three entry IDs from that one link
function readFormLink(link) {
  try {
    const u = new URL(link);
    const entries = [...u.searchParams.keys()].filter(k => k.startsWith('entry.'));
    if (entries.length < 3) return null;
    return {
      url: u.origin + u.pathname.replace(/\/viewform$/, '/formResponse'),
      name: entries[0], email: entries[1], message: entries[2]
    };
  } catch (err) { return null; }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  let ok = true;

  form.querySelectorAll('input:not([name="website"]), textarea').forEach(field => {
    const bad = !field.value.trim() || (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(field.value));
    field.classList.toggle('invalid', bad);
    if (bad) ok = false;
  });

  if (!ok) {
    status.className = 'form-status error';
    status.textContent = 'Please fill in every field with a valid email address.';
    return;
  }

  // hidden spam-trap field: bots fill it in, people never see it
  if (form.website.value) {
    status.className = 'form-status ok';
    status.textContent = 'Thanks! Your message has been sent.';
    form.reset();
    return;
  }

  const target = readFormLink(GOOGLE_FORM_LINK);
  if (!target) {
    status.className = 'form-status error';
    status.textContent = 'The form is not connected yet. Please email us instead.';
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  status.className = 'form-status';
  status.textContent = 'Sending...';

  const data = new URLSearchParams();
  data.append(target.name, form.name.value.trim());
  data.append(target.email, form.email.value.trim());
  data.append(target.message, form.message.value.trim());

  try {
    // no-cors: Google does not let a website read the reply, so we only know the request went out
    await fetch(target.url, { method: 'POST', mode: 'no-cors', body: data });
    status.className = 'form-status ok';
    status.textContent = 'Thanks! Your message has been sent. We will get back to you soon.';
    form.reset();
  } catch (err) {
    status.className = 'form-status error';
    status.textContent = 'Sorry, something went wrong. Please email support.nvstechnologies@gmail.com.';
  } finally {
    button.disabled = false;
  }
});

document.getElementById('year').textContent = new Date().getFullYear();


// ---------- Money Ledgr screenshot viewer ----------
const showcase = document.getElementById('showcase');
const scImage = document.getElementById('sc-image');
const scTitle = document.getElementById('sc-title');
const scText = document.getElementById('sc-text');
const scCount = document.getElementById('sc-count');
const scTabs = [...showcase.querySelectorAll('.sc-tabs button')];
let current = 0;

function showScreen(index) {
  // wrap around at both ends
  current = (index + scTabs.length) % scTabs.length;
  const tab = scTabs[current];

  scImage.classList.add('fading');
  setTimeout(() => {
    scImage.src = tab.dataset.src;
    scImage.alt = tab.dataset.alt;
    scImage.classList.remove('fading');
  }, 120);

  scTitle.textContent = tab.dataset.title;
  scText.textContent = tab.dataset.text;
  scCount.textContent = (current + 1) + ' / ' + scTabs.length;

  scTabs.forEach((t, i) => {
    t.classList.toggle('active', i === current);
    t.setAttribute('aria-selected', i === current);
  });

  // warm up the next image so it appears instantly
  new Image().src = scTabs[(current + 1) % scTabs.length].dataset.src;
}

document.querySelector('[data-open-showcase]').addEventListener('click', () => {
  showScreen(0);
  showcase.showModal();
  document.documentElement.classList.add('modal-open');
});

showcase.addEventListener('close', () => document.documentElement.classList.remove('modal-open'));
showcase.querySelector('.sc-close').addEventListener('click', () => showcase.close());

// clicking the dark area outside the card closes it
showcase.addEventListener('click', (e) => { if (e.target === showcase) showcase.close(); });

scTabs.forEach((tab, i) => tab.addEventListener('click', () => showScreen(i)));
document.getElementById('sc-prev').addEventListener('click', () => showScreen(current - 1));
document.getElementById('sc-next').addEventListener('click', () => showScreen(current + 1));

// arrow keys while the viewer is open
showcase.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') showScreen(current + 1);
  if (e.key === 'ArrowLeft') showScreen(current - 1);
});
