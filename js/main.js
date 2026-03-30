/* ==========================================================================
   ORPI LUXE — Main JavaScript
   Pure vanilla JS — no dependencies
   ========================================================================== */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Mobile Navigation
     -------------------------------------------------------------------------- */

  const hamburger = document.querySelector('.nav__hamburger');
  const mobileNav = document.querySelector('.nav__mobile');
  const mobileLinks = document.querySelectorAll('.nav__mobile a');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* --------------------------------------------------------------------------
     2. Sticky Navigation
     -------------------------------------------------------------------------- */

  const nav = document.querySelector('.nav');

  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --------------------------------------------------------------------------
     3. Scroll Reveal (Intersection Observer)
     -------------------------------------------------------------------------- */

  const revealElements = document.querySelectorAll('[data-reveal]');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-reveal-delay') || 0;
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, parseInt(delay, 10));
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* --------------------------------------------------------------------------
     4. Counter Animation
     -------------------------------------------------------------------------- */

  const counters = document.querySelectorAll('[data-counter]');

  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = el.getAttribute('data-counter');
    const prefix = el.getAttribute('data-counter-prefix') || '';
    const suffix = el.getAttribute('data-counter-suffix') || '';
    const targetNum = parseFloat(target.replace(/[^0-9.]/g, ''));
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(eased * targetNum);

      el.textContent = prefix + formatNumber(current) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + formatNumber(targetNum) + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
  }

  /* --------------------------------------------------------------------------
     5. Testimonial Slider
     -------------------------------------------------------------------------- */

  const testimonialTrack = document.querySelector('.testimonials__track');
  const testimonialDots = document.querySelectorAll('.testimonials__dot');
  const prevBtn = document.querySelector('.testimonials__arrow--prev');
  const nextBtn = document.querySelector('.testimonials__arrow--next');

  if (testimonialTrack) {
    let currentSlide = 0;
    const slides = testimonialTrack.querySelectorAll('.testimonial');
    const totalSlides = slides.length;
    let autoplayInterval;

    function goToSlide(index) {
      currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
      testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      testimonialDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

    testimonialDots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goToSlide(i); resetAutoplay(); });
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    testimonialTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    testimonialTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
        resetAutoplay();
      }
    }, { passive: true });

    // Autoplay
    function startAutoplay() {
      autoplayInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoplay() {
      clearInterval(autoplayInterval);
      startAutoplay();
    }

    startAutoplay();
    goToSlide(0);
  }

  /* --------------------------------------------------------------------------
     6. Search Form Tab Switching
     -------------------------------------------------------------------------- */

  const searchTabs = document.querySelectorAll('.search-form__tab');
  const budgetSelect = document.querySelector('#search-budget');

  const budgetOptions = {
    acheter: [
      { value: '', text: 'Budget' },
      { value: '0-500000', text: "Jusqu'à 500\u00A0000\u00A0€" },
      { value: '500000-1000000', text: '500\u00A0000 - 1\u00A0000\u00A0000\u00A0€' },
      { value: '1000000-2000000', text: '1 - 2\u00A0000\u00A0000\u00A0€' },
      { value: '2000000-5000000', text: '2 - 5\u00A0000\u00A0000\u00A0€' },
      { value: '5000000+', text: '5\u00A0000\u00A0000\u00A0€+' }
    ],
    louer: [
      { value: '', text: 'Budget mensuel' },
      { value: '0-2000', text: "Jusqu'à 2\u00A0000\u00A0€/mois" },
      { value: '2000-5000', text: '2\u00A0000 - 5\u00A0000\u00A0€/mois' },
      { value: '5000-10000', text: '5\u00A0000 - 10\u00A0000\u00A0€/mois' },
      { value: '10000+', text: '10\u00A0000\u00A0€+/mois' }
    ]
  };

  searchTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      searchTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      if (budgetSelect) {
        const type = tab.getAttribute('data-tab');
        const options = budgetOptions[type] || budgetOptions.acheter;
        budgetSelect.innerHTML = options.map(o =>
          `<option value="${o.value}">${o.text}</option>`
        ).join('');
      }
    });
  });

  /* --------------------------------------------------------------------------
     7. Property Filtering (acheter.html)
     -------------------------------------------------------------------------- */

  const filterSelects = document.querySelectorAll('.filter-bar .form-select[data-filter]');
  const sortSelect = document.querySelector('.filter-bar .form-select[data-sort]');
  const propertyCards = document.querySelectorAll('.property-grid .property-card');
  const countDisplay = document.querySelector('.filter-bar__count strong');

  if (filterSelects.length > 0 && propertyCards.length > 0) {
    filterSelects.forEach(select => {
      select.addEventListener('change', applyFilters);
    });

    if (sortSelect) {
      sortSelect.addEventListener('change', applySort);
    }
  }

  function applyFilters() {
    const filters = {};
    filterSelects.forEach(select => {
      const key = select.getAttribute('data-filter');
      const val = select.value;
      if (val) filters[key] = val;
    });

    let visibleCount = 0;

    propertyCards.forEach(card => {
      let show = true;

      if (filters.type && card.getAttribute('data-type') !== filters.type) show = false;
      if (filters.location && card.getAttribute('data-location') !== filters.location) show = false;
      if (filters.rooms) {
        const rooms = parseInt(card.getAttribute('data-rooms'), 10);
        const filterRooms = parseInt(filters.rooms, 10);
        if (filters.rooms === '6+') {
          if (rooms < 6) show = false;
        } else if (rooms !== filterRooms) show = false;
      }
      if (filters.budget) {
        const price = parseInt(card.getAttribute('data-price'), 10);
        const [min, max] = filters.budget.split('-').map(v => parseInt(v, 10));
        if (filters.budget.includes('+')) {
          if (price < min) show = false;
        } else {
          if (price < min || price > max) show = false;
        }
      }

      card.style.opacity = show ? '' : '0';
      card.style.transform = show ? '' : 'scale(0.95)';
      setTimeout(() => {
        card.style.display = show ? '' : 'none';
      }, show ? 0 : 300);

      if (show) visibleCount++;
    });

    if (countDisplay) {
      countDisplay.textContent = visibleCount;
    }
  }

  function applySort() {
    if (!sortSelect) return;
    const grid = document.querySelector('.property-grid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.property-card'));
    const sortValue = sortSelect.value;

    cards.sort((a, b) => {
      const priceA = parseInt(a.getAttribute('data-price'), 10) || 0;
      const priceB = parseInt(b.getAttribute('data-price'), 10) || 0;
      const surfA = parseInt(a.getAttribute('data-surface'), 10) || 0;
      const surfB = parseInt(b.getAttribute('data-surface'), 10) || 0;

      switch (sortValue) {
        case 'price-desc': return priceB - priceA;
        case 'price-asc': return priceA - priceB;
        case 'surface': return surfB - surfA;
        default: return 0;
      }
    });

    cards.forEach(card => grid.appendChild(card));
  }

  /* --------------------------------------------------------------------------
     8. Smooth Scroll for Anchor Links
     -------------------------------------------------------------------------- */

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* --------------------------------------------------------------------------
     9. Image Lazy Loading (fade-in effect)
     -------------------------------------------------------------------------- */

  const lazyImages = document.querySelectorAll('img.img-lazy');

  if (lazyImages.length > 0) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
          if (img.complete) img.classList.add('loaded');
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });

    lazyImages.forEach(img => imgObserver.observe(img));
  }

  /* --------------------------------------------------------------------------
     10. Form Validation
     -------------------------------------------------------------------------- */

  const forms = document.querySelectorAll('form[data-validate]');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Clear previous errors
      form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

      // Validate required fields
      form.querySelectorAll('[required]').forEach(input => {
        const group = input.closest('.form-group');
        if (!input.value.trim()) {
          if (group) group.classList.add('error');
          isValid = false;
        }
      });

      // Validate email
      form.querySelectorAll('input[type="email"]').forEach(input => {
        const group = input.closest('.form-group');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (input.value && !emailRegex.test(input.value)) {
          if (group) group.classList.add('error');
          const errorEl = group?.querySelector('.form-error');
          if (errorEl) errorEl.textContent = 'Veuillez entrer une adresse email valide';
          isValid = false;
        }
      });

      // Validate phone (French format)
      form.querySelectorAll('input[type="tel"]').forEach(input => {
        const group = input.closest('.form-group');
        const phone = input.value.replace(/\s/g, '');
        const phoneRegex = /^(\+33|0)[1-9]\d{8}$/;
        if (phone && !phoneRegex.test(phone)) {
          if (group) group.classList.add('error');
          const errorEl = group?.querySelector('.form-error');
          if (errorEl) errorEl.textContent = 'Format\u00A0: 06 12 34 56 78 ou +33612345678';
          isValid = false;
        }
      });

      if (isValid) {
        // Show success state
        const btn = form.querySelector('.btn');
        if (btn) {
          const originalText = btn.textContent;
          btn.textContent = 'Message envoyé\u00A0!';
          btn.style.background = 'var(--color-success)';
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            form.reset();
          }, 3000);
        }
      }
    });

    // Clear errors on input
    form.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (group) group.classList.remove('error');
      });
    });
  });

  /* --------------------------------------------------------------------------
     11. Back to Top Button
     -------------------------------------------------------------------------- */

  const backToTop = document.querySelector('.back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
