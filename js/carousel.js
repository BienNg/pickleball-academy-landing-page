// ── Carousel Navigation ──────────────────────────────────────────────────
// Handles the snapping carousel navigation and dot indicators in the System section.

function initCarousel() {
  const carousel = document.getElementById('system-carousel');
  const dotsContainer = document.getElementById('carousel-dots');
  
  if (!carousel || !dotsContainer) return;

  const cards = carousel.querySelectorAll('.carousel-card');
  const dots = dotsContainer.querySelectorAll('.carousel-dot');

  if (cards.length === 0 || dots.length === 0) return;

  // Update dots based on scroll position
  const updateDots = () => {
    // Calculate which card is closest to the center or left edge
    const scrollLeft = carousel.scrollLeft;
    const carouselWidth = carousel.offsetWidth;
    const scrollCenter = scrollLeft + carouselWidth / 2;

    let activeIndex = 0;
    let minDistance = Infinity;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(scrollCenter - cardCenter);

      if (distance < minDistance) {
        minDistance = distance;
        activeIndex = index;
      }
    });

    // Update dot styles
    dots.forEach((dot, index) => {
      if (index === activeIndex) {
        // Active state
        dot.classList.remove('w-2', 'bg-gray-400', 'hover:bg-gray-500');
        dot.classList.add('w-6', 'bg-gray-500');
      } else {
        // Inactive state
        dot.classList.remove('w-6', 'bg-gray-500');
        dot.classList.add('w-2', 'bg-gray-400', 'hover:bg-gray-500');
      }
    });
  };

  // Listen to scroll events on the carousel
  carousel.addEventListener('scroll', () => {
    // Use requestAnimationFrame for smooth performance
    requestAnimationFrame(updateDots);
  });

  // Click on dots to scroll to the respective card
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (cards[index]) {
        // Get the padding offset from the container so it aligns properly
        const paddingLeft = parseFloat(window.getComputedStyle(carousel).paddingLeft) || 0;
        
        // Scroll to the specific card
        carousel.scrollTo({
          left: cards[index].offsetLeft - paddingLeft,
          behavior: 'smooth'
        });
      }
    });
  });

  // Initial update
  updateDots();
}
