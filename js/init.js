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
}
