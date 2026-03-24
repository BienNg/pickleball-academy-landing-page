// ── Tab Switching ──────────────────────────────────────────────────────
function switchTab(tab) {
  const isComments = tab === 'comments';
  $('tab-comments').classList.toggle('active', isComments);
  $('tab-shot').classList.toggle('active', !isComments);
  $('commentsArea').style.display = isComments ? 'block' : 'none';
  $('shotTechniquePanel').classList.toggle('visible', !isComments);

  // If user clicks back to Comments from the shot-technique slide,
  // reset carousel to the first slide (1 / N).
  if (
    isComments &&
    typeof showDemoSlide === 'function' &&
    demoSlideIndex === SHOT_TECHNIQUE_SLIDE_INDEX
  ) {
    showDemoSlide(0, { instant: true });
    return;
  }

  // If user explicitly clicks the Shot tab, sync the carousel to the
  // dedicated shot-technique slide.
  if (
    !isComments &&
    typeof showDemoSlide === 'function' &&
    demoSlideIndex !== SHOT_TECHNIQUE_SLIDE_INDEX
  ) {
    showDemoSlide(SHOT_TECHNIQUE_SLIDE_INDEX, { instant: true });
  }
}
