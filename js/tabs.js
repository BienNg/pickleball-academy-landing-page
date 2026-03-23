// ── Tab Switching ──────────────────────────────────────────────────────
function switchTab(tab) {
  const isComments = tab === 'comments';
  $('tab-comments').classList.toggle('active', isComments);
  $('tab-shot').classList.toggle('active', !isComments);
  $('commentsArea').style.display = isComments ? 'block' : 'none';
  $('shotTechniquePanel').classList.toggle('visible', !isComments);
}
