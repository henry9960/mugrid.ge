'use strict';

// ── Nav: frosted-glass effect on scroll ──────────────────────────────────────
const nav = document.getElementById('nav');

function updateNav() {
  nav.classList.toggle('scrolled', window.scrollY > 32);
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav(); // run once on load

// ── Scroll-triggered reveal ───────────────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -48px 0px'
  }
);

// Attach observer and apply staggered delay to sibling .reveal elements
document.querySelectorAll('.reveal').forEach(el => {
  // Find all direct .reveal siblings in the same parent
  const siblings = [...el.parentElement.querySelectorAll(':scope > .reveal')];
  const idx = siblings.indexOf(el);

  // Stagger each sibling by 90ms
  if (idx > 0) {
    el.style.transitionDelay = `${idx * 90}ms`;
  }

  revealObserver.observe(el);
});
