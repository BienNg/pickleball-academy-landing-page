// ── Carousel Navigation ──────────────────────────────────────────────────
// Handles the snapping carousel navigation and dot indicators in the System section.

function initCarousel() {
  const carousel = document.getElementById('system-carousel');
  const dotsContainer = document.getElementById('carousel-dots');
  
  if (!carousel || !dotsContainer) return;

  const cards = carousel.querySelectorAll('.carousel-card');
  const dots = dotsContainer.querySelectorAll('.carousel-dot');

  if (cards.length === 0 || dots.length === 0) return;

  // Update dots based on scroll position (or use explicit index when provided)
  const updateDots = (forceIndex) => {
    let activeIndex;

    if (typeof forceIndex === 'number') {
      activeIndex = forceIndex;
    } else {
      const scrollLeft = carousel.scrollLeft;
      const carouselWidth = carousel.offsetWidth;
      const scrollCenter = scrollLeft + carouselWidth / 2;

      activeIndex = 0;
      let minDistance = Infinity;

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(scrollCenter - cardCenter);

        if (distance < minDistance) {
          minDistance = distance;
          activeIndex = index;
        }
      });
    }

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

  // Ignore scroll-driven updates during programmatic scroll (prevents dot from shrinking on first click)
  let isProgrammaticScroll = false;

  carousel.addEventListener('scroll', () => {
    if (isProgrammaticScroll) return;
    requestAnimationFrame(() => updateDots());
  });

  // Scroll to a specific card and focus the dot
  const goToCard = (index) => {
    if (!cards[index]) return;
    isProgrammaticScroll = true;
    updateDots(index); // Immediately expand the dot

    const paddingLeft = parseFloat(window.getComputedStyle(carousel).paddingLeft) || 0;
    carousel.scrollTo({
      left: cards[index].offsetLeft - paddingLeft,
      behavior: 'smooth'
    });

    // Re-enable scroll-driven updates when scroll settles
    if ('onscrollend' in window) {
      carousel.addEventListener('scrollend', () => {
        isProgrammaticScroll = false;
      }, { once: true });
    } else {
      setTimeout(() => { isProgrammaticScroll = false; }, 500);
    }
  };

  // Click on card: scroll to center it and focus the dot (ignore if user was dragging)
  let pointerStartX = 0;
  cards.forEach((card, index) => {
    card.addEventListener('pointerdown', (e) => {
      pointerStartX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    });
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      const dx = Math.abs((e.clientX ?? 0) - pointerStartX);
      if (dx > 15) return; // User was dragging, don't treat as click
      goToCard(index);
    });
  });

  // Click on dots: scroll to card and focus the dot
  dots.forEach((dot, index) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      goToCard(index);
    });
  });

  // Initial update
  updateDots();
}
