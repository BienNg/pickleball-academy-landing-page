// ── FAQ Accordion ────────────────────────────────────────────────────────
function initFaq() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    // Make the whole item clickable
    item.addEventListener('click', () => {
      const button = item.querySelector('.faq-button');
      const content = item.querySelector('.faq-content');
      const icon = item.querySelector('.faq-icon');
      const isOpen = item.classList.contains('is-open');

      // Close all others
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('is-open')) {
          otherItem.classList.remove('is-open');
          const otherContent = otherItem.querySelector('.faq-content');
          const otherIcon = otherItem.querySelector('.faq-icon');
          otherContent.style.maxHeight = null;
          otherContent.style.opacity = '0';
          otherContent.style.marginTop = '0';
          otherIcon.style.transform = 'rotate(0deg)';
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('is-open');
        content.style.maxHeight = null;
        content.style.opacity = '0';
        content.style.marginTop = '0';
        icon.style.transform = 'rotate(0deg)';
      } else {
        item.classList.add('is-open');
        content.style.maxHeight = content.scrollHeight + "px";
        content.style.opacity = '1';
        icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}
