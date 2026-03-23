// ── Keyboard Shortcuts ─────────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  const tag = document.activeElement.tagName;
  if (['INPUT', 'TEXTAREA'].includes(tag)) return;

  if (e.key === 'Escape') {
    if ($('waitlistSuccessModal')?.classList.contains('open')) {
      closeWaitlistSuccessModal();
      return;
    }
    closeViewFrameModal();
  }
  if (e.key === ' ' && tag !== 'BUTTON') { e.preventDefault(); togglePlay(); }
  if (e.key === 'ArrowLeft') adjustTime(-1 / 30);
  if (e.key === 'ArrowRight') adjustTime(1 / 30);
  if (e.key === 'q' || e.key === 'Q') adjustTime(-1);
  if (e.key === 'w' || e.key === 'W') adjustTime(1);
  if (e.key === 'a' || e.key === 'A') adjustTime(-5);
  if (e.key === 's' || e.key === 'S') adjustTime(5);
  if (e.key === 'y' || e.key === 'Y') adjustTime(-10);
  if (e.key === 'x' || e.key === 'X') adjustTime(10);
});
