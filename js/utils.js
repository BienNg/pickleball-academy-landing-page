// ── Time Formatting ────────────────────────────────────────────────────
function fmt(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

// ── Progress Bar UI ────────────────────────────────────────────────────
function updateProgressUI() {
  const pct = DURATION > 0 ? (currentTime / DURATION) * 100 : 0;
  $('progressFill').style.width = pct + '%';
  $('progressThumb').style.left = pct + '%';
  $('videoCurrentTime').textContent = fmt(currentTime);
  const durEl = $('videoDuration');
  if (durEl) durEl.textContent = fmt(DURATION);
}
