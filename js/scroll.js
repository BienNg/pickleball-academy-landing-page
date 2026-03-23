// ── Smooth Page Scroll (Lenis) ─────────────────────────────────────────
function initSmoothPageScroll() {
  if (typeof Lenis === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const lenis = new Lenis({ autoRaf: true, smoothWheel: true, lerp: 0.12 });

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') {
        e.preventDefault();
        lenis.scrollTo(0);
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target);
      }
    });
  });
}

// ── Scroll-triggered Animations ────────────────────────────────────────
function initScrollAnimations() {
  const observerStartTime = performance.now();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Delay initial in-view elements slightly so the hidden state paints first.
        const isInitialViewportHit = performance.now() - observerStartTime < 400;
        const reveal = () => entry.target.classList.add('in-view');
        if (isInitialViewportHit) {
          setTimeout(reveal, 80);
        } else {
          reveal();
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    // Trigger a bit later so cards don't animate before users reach the section.
    threshold: 0.35,
    rootMargin: '0px 0px -12% 0px'
  });

  document.querySelectorAll('.scroll-animate, .apple-animate, .apple-animate-card').forEach((el) => observer.observe(el));
}
