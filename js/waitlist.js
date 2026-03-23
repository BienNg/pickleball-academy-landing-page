// ── Waitlist Form ──────────────────────────────────────────────────────
function initWaitlistForm() {
  const form = document.getElementById('waitlistForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = form.querySelector('#waitlistName');
    const phoneInput = form.querySelector('#waitlistPhone');
    nameInput?.classList.remove('error');
    phoneInput?.classList.remove('error');
    const name = (nameInput?.value || '').trim();
    const phone = (phoneInput?.value || '').trim();
    let valid = true;
    if (!name) { nameInput?.classList.add('error'); valid = false; }
    if (!phone) { phoneInput?.classList.add('error'); valid = false; }
    if (!valid) {
      showToast('Please enter your name and phone number.');
      return;
    }
    // TODO: Send to backend (e.g. Formspree, Netlify Forms, or your API)
    showToast(`Thanks, ${name}! You're on the waitlist. We'll be in touch soon.`);
    form.reset();
  });
}
