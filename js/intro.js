// ── Demo Splash Screen ─────────────────────────────────────────────────
function startDemo() {
  demoStarted = true;
  if (ytReady && ytPlayer && typeof ytPlayer.unMute === 'function') {
    applyDemoVideoVolume();
    ytPlayer.unMute();
    ytPlayer.playVideo();
  }

  const splash = $('appSplash');
  const demoContent = $('appDemoContent');
  if (!splash || !demoContent) return;

  splash.classList.add('hidden');

  const elementsToAnimate = Array.from(demoContent.children).filter((el) => {
    return window.getComputedStyle(el).display !== 'none';
  });

  if (typeof gsap !== 'undefined') {
    gsap.set(elementsToAnimate, { opacity: 0, y: 20 });
  }

  demoContent.classList.remove('app-demo-content-hidden');

  if (typeof gsap !== 'undefined') {
    gsap.to(elementsToAnimate, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.1,
      clearProps: 'all',
    });
  }

  setTimeout(() => { splash.style.display = 'none'; }, 450);
}

// ── Intro Animation ────────────────────────────────────────────────────
function initIntroAnimation() {
  if (typeof gsap === 'undefined') return;

  const introPill = document.getElementById('intro-pill');
  const heroPill = document.getElementById('hero-pill');
  const introBg = document.getElementById('intro-bg');

  if (!introPill || !heroPill || !introBg) {
    initPhoneScrollAnimation();
    return;
  }

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  document.body.style.overflow = 'hidden';

  gsap.set(introPill, { xPercent: -50, yPercent: -50, scale: 0.95 });

  const edgePad = 48;
  const baseW = introPill.offsetWidth || 1;
  const baseH = introPill.offsetHeight || 1;
  const peakScale = Math.max(
    1,
    Math.min(
      4,
      (window.innerWidth - edgePad) / baseW,
      (window.innerHeight - edgePad) / baseH
    )
  );

  gsap.to(introPill, {
    opacity: 1,
    scale: peakScale,
    duration: 1,
    ease: 'power2.out',
    onComplete: () => {
      setTimeout(() => {
        window.scrollTo(0, 0);
        const destRect = heroPill.getBoundingClientRect();
        const destCenterX = destRect.left + destRect.width / 2;
        const destCenterY = destRect.top + destRect.height / 2;

        gsap.to(introPill, {
          left: destCenterX,
          top: destCenterY,
          scale: 1,
          duration: 1,
          ease: 'power3.inOut',
          onComplete: () => {
            heroPill.style.opacity = '1';
            introPill.style.display = 'none';
            document.body.style.overflow = '';

            gsap.to(introBg, {
              opacity: 0,
              duration: 0.5,
              onComplete: () => { introBg.style.display = 'none'; },
            });

            document.querySelectorAll('[class*="intro-animate-"]').forEach((el) => {
              Array.from(el.classList).forEach((cls) => {
                if (cls.startsWith('intro-animate-')) {
                  el.classList.remove(cls);
                  el.classList.add(cls.replace('intro-', ''));
                }
              });
            });

            initPhoneScrollAnimation();
          },
        });
      }, 1000);
    },
  });
}

// ── Phone Scroll Animation ─────────────────────────────────────────────
function initPhoneScrollAnimation() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const appShell = document.getElementById('appShell');
  const heroPlaceholder = document.getElementById('heroPhonePlaceholder');

  if (!appShell || !heroPlaceholder) return;

  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  mm.add('(min-width: 1024px)', () => {
    appShell.style.position = 'relative';
    appShell.style.zIndex = '40';

    const phRectInit = heroPlaceholder.getBoundingClientRect();
    const shellRectInit = appShell.getBoundingClientRect();
    gsap.set(appShell, {
      x: phRectInit.left - shellRectInit.left,
      y: phRectInit.top - shellRectInit.top,
    });

    gsap.from(appShell, {
      opacity: 0,
      scale: 0.95,
      duration: 1.2,
      delay: 0.8,
      ease: 'power3.out',
    });

    gsap.fromTo(
      appShell,
      {
        x: () => {
          const phRect = heroPlaceholder.getBoundingClientRect();
          const shellRect = appShell.getBoundingClientRect();
          const currentX = gsap.getProperty(appShell, 'x') || 0;
          return phRect.left - (shellRect.left - currentX);
        },
        y: () => {
          const phRect = heroPlaceholder.getBoundingClientRect();
          const shellRect = appShell.getBoundingClientRect();
          const currentY = gsap.getProperty(appShell, 'y') || 0;
          return phRect.top - (shellRect.top - currentY);
        },
      },
      {
        x: 0,
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          endTrigger: '#demo',
          end: 'top center',
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      }
    );

    return () => { gsap.set(appShell, { clearProps: 'all' }); };
  });
}
