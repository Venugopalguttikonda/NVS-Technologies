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

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let ok = true;

  form.querySelectorAll('input, textarea').forEach(field => {
    const bad = !field.value.trim() || (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(field.value));
    field.classList.toggle('invalid', bad);
    if (bad) ok = false;
  });

  status.className = 'form-status ' + (ok ? 'ok' : 'error');
  if (!ok) {
    status.textContent = 'Please fill in every field with a valid email address.';
    return;
  }

  // TODO: connect to your backend or a service like Formspree here
  status.textContent = 'Thanks! Your message is ready to send. Connect the form to your backend to go live.';
  form.reset();
});

document.getElementById('year').textContent = new Date().getFullYear();
