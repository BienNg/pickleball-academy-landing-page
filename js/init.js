// ── App Initialization ─────────────────────────────────────────────────
// Called by loader.js after all HTML sections have been injected into the DOM.
function appInit() {
  initIntroAnimation();
  initSmoothPageScroll();
  initScrollAnimations();
  initCarousel();
  initWaitlistForm();
  initFaq();
  renderComments();
  renderProgressMarkers();
  renderTechniqueItems();
  updateProgressUI();
  initDraggableAnnotation();
  updateCommentsNavMeta();
  updateDemoCopy(0);
  initVietnamMap();
}

function initVietnamMap() {
  const container = document.getElementById('vietnam-map-container');
  const baseSvg = document.getElementById('vietnam-map-svg');
  if (!container || !baseSvg) return;

  const brightSvg = baseSvg.cloneNode(true);
  brightSvg.removeAttribute('id');
  brightSvg.classList.remove('opacity-30', 'mix-blend-multiply');
  brightSvg.classList.add('absolute', 'inset-0', 'pointer-events-none', 'transition-opacity', 'duration-300');
  
  brightSvg.style.opacity = 'var(--map-hover, 0)';
  brightSvg.style.maskImage = 'radial-gradient(80px circle at var(--map-x, 50%) var(--map-y, 50%), black 0%, transparent 100%)';
  brightSvg.style.webkitMaskImage = 'radial-gradient(80px circle at var(--map-x, 50%) var(--map-y, 50%), black 0%, transparent 100%)';

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    container.style.setProperty('--map-x', `${x}px`);
    container.style.setProperty('--map-y', `${y}px`);
    container.style.setProperty('--map-hover', '1');
  });

  container.addEventListener('mouseleave', () => {
    container.style.setProperty('--map-hover', '0');
  });

  baseSvg.parentNode.insertBefore(brightSvg, baseSvg.nextSibling);
}
