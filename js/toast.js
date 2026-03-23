// ── Toast Notification ─────────────────────────────────────────────────
let toastTimeout = null;

function showToast(message) {
  const toast = $('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2200);
}
