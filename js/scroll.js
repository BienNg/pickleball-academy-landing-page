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

  const reveal = (el, delay = 0) => {
    const doReveal = () => el.classList.add('in-view');
    delay > 0 ? setTimeout(doReveal, delay) : doReveal();
  };

  // Standard observer: trigger when element is ~35% visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const isInitialViewportHit = performance.now() - observerStartTime < 400;
        reveal(entry.target, isInitialViewportHit ? 20 : 0);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.35,
    rootMargin: '0px 0px -12% 0px'
  });

  // Early observer for #system: trigger as soon as element enters screen (200px before viewport)
  const earlyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const isInitialViewportHit = performance.now() - observerStartTime < 400;
        reveal(entry.target, isInitialViewportHit ? 0 : 0);
        earlyObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0,
    rootMargin: '0px 0px 200px 0px'
  });

  // FAQ: first question triggers cascade (earlier viewport detection, 300px before entering)
  const faqTrigger = document.querySelector('#faq .faq-item:first-child');
  if (faqTrigger) {
    const faqCascadeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          faqCascadeObserver.unobserve(entry.target);
          const faqSection = document.getElementById('faq');
          if (!faqSection) return;
          if (faqSection.classList.contains('scroll-animate')) faqSection.classList.add('in-view');
          faqSection.querySelectorAll('.apple-animate').forEach((el) => el.classList.add('in-view'));
        }
      });
    }, {
      threshold: 0,
      rootMargin: '0px 0px 300px 0px'
    });
    faqCascadeObserver.observe(faqTrigger);
  }

  document.querySelectorAll('.scroll-animate, .apple-animate, .apple-animate-card, .apple-animate-cartoon').forEach((el) => {
    const inFaq = el.closest('#faq');
    const inSystem = el.closest('#system');
    const animateWhenVisible = el.classList.contains('animate-when-visible');
    if (inFaq) return; // FAQ uses cascade observer, skip standard observer
    // Use earlier reveal for #system cards and any explicitly marked element.
    const forceEarly = el.classList.contains('animate-early');
    ((inSystem && !animateWhenVisible) || forceEarly ? earlyObserver : observer).observe(el);
  });
}
