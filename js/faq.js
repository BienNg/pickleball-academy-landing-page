// ── FAQ Accordion ────────────────────────────────────────────────────────
function initFaq() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    // Make the whole item clickable
    item.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all others
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('is-open')) {
          otherItem.classList.remove('is-open');
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('is-open');
      } else {
        item.classList.add('is-open');
      }
    });
  });
}
