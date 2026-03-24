// ── Shot Technique ─────────────────────────────────────────────────────
function switchSubTab(tabId) {
  activeTechSubTab = tabId;
  $$('.sub-tab').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.subtab === tabId);
  });
  renderTechniqueItems();
}

function renderTechniqueItems() {
  const container = $('techniqueList');
  if (!container) return;
  const items = MOCK.technique.items[activeTechSubTab] || [];
  const sorted = [...items].sort((a, b) => a.checked - b.checked);

  container.innerHTML = sorted
    .map((item) => {
      const isChecked = item.checked;
      const dotClass = isChecked ? 'good' : 'needs-work';
      const statusClass = isChecked ? 'good' : 'needs-work';
      const statusText = isChecked ? 'Good' : 'Needs work';
      const checkedIcon = '<span class="technique-checkmark" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg></span>';

      return `
        <div class="technique-item">
          <div class="technique-item-left">
            <div class="technique-dot ${dotClass}"></div>
            <span class="technique-label">${item.label}</span>
          </div>
          <div class="technique-item-right">
            <span class="technique-status ${statusClass}">${statusText}</span>
            ${isChecked ? checkedIcon : ''}
          </div>
        </div>
      `;
    })
    .join('');
}

// ── Comment Text Parsing (shot pills) ──────────────────────────────────
function parseCommentText(text) {
  return text.replace(
    /\[\[shot:([^\]]+)\]\]/g,
    '<span class="shot-pill">$1</span>'
  );
}
