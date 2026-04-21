/* ============================================================
   CACHATTO – Product Page  |  script.js
   Light Mode Only · FAQ Accordion · Testimonial Carousel
   Scroll Animations · Sticky Nav · Mobile Menu
   ============================================================ */

(function () {
  'use strict';

  /* ── HELPERS ─────────────────────────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ── 1. STICKY NAV ────────────────────────────────────────── */
  const nav = $('#mainNav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── 2. MOBILE HAMBURGER ──────────────────────────────────── */
  const hamburger  = $('#hamburger');
  const mobileNav  = $('#mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on any link click (except the dropdown toggle itself)
    $$('a', mobileNav).forEach(a => {
      a.addEventListener('click', (e) => {
        // If the link is inside the mobile menu and its href is just "#" or not a real section, maybe we don't close.
        // Actually, slide-links are 'a' tags. We want to close on click.
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Mobile dropdown toggle
    const mNavToggle = $('.nav__mobile-toggle');
    const mNavMenu = $('.nav__mobile-menu');
    if (mNavToggle && mNavMenu) {
      mNavToggle.addEventListener('click', () => {
        mNavMenu.classList.toggle('open');
        const icon = $('.material-symbols-outlined', mNavToggle);
        if (icon) {
          icon.style.transform = mNavMenu.classList.contains('open') ? 'rotate(180deg)' : '';
        }
      });
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── 3. SMOOTH SCROLL (nav links) ────────────────────────── */
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 75; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── 4. SCROLL ANIMATIONS (IntersectionObserver) ──────────── */
  const fadeEls = $$('.fade-up');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    fadeEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show immediately
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ── 5. FAQ ACCORDION ─────────────────────────────────────── */
  const faqItems = $$('.faq-item');

  faqItems.forEach(item => {
    const btn = $('.faq-q', item);
    const answer = $('.faq-a', item);
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          const ob = $('.faq-q', other);
          if (ob) ob.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle this one
      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });

    // Keyboard: Enter / Space handled by button natively
    // Additional: Escape key closes
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.blur();
      }
    });
  });

  /* ── 5.5 HERO SLIDER ──────────────────────────────────────── */
  const heroTrack = $('#heroTrack');
  const heroPrev = $('#heroSliderPrev');
  const heroNext = $('#heroSliderNext');
  const heroDotsWrap = $('#heroSliderDots');

  if (heroTrack && heroPrev && heroNext && heroDotsWrap) {
    const originalSlides = $$('.hero-slide', heroTrack);
    const heroDots = $$('.hero-slider-dot', heroDotsWrap);
    const heroTotal = originalSlides.length;

    // Clone first and last slides for infinite loop
    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone = originalSlides[heroTotal - 1].cloneNode(true);
    
    firstClone.classList.add('slide-clone');
    lastClone.classList.add('slide-clone');
    firstClone.setAttribute('aria-hidden', 'true');
    lastClone.setAttribute('aria-hidden', 'true');

    heroTrack.appendChild(firstClone);
    heroTrack.insertBefore(lastClone, originalSlides[0]);

    // Current index starts at 1 because index 0 is the cloned last slide
    let heroCurrent = 1;
    let heroTimer = null;
    let isTransitioning = false;
    
    // Set initial position without transition
    heroTrack.style.transition = 'none';
    heroTrack.style.transform = `translateX(-${heroCurrent * 100}%)`;

    function updateDots() {
      let dotIndex = heroCurrent - 1;
      if (heroCurrent === 0) dotIndex = heroTotal - 1;
      if (heroCurrent === heroTotal + 1) dotIndex = 0;
      
      heroDots.forEach((d, i) => {
        d.classList.toggle('active', i === dotIndex);
      });
    }

    function goToHeroSlide(index, useTransition = true) {
      if (isTransitioning) return;
      heroCurrent = index;
      
      if (useTransition) {
        heroTrack.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
        isTransitioning = true;
      } else {
        heroTrack.style.transition = 'none';
      }
      
      heroTrack.style.transform = `translateX(-${heroCurrent * 100}%)`;
      updateDots();
    }

    // Handle end of transition to instantly jump to real slides
    heroTrack.addEventListener('transitionend', () => {
      isTransitioning = false;
      if (heroCurrent === 0) {
        goToHeroSlide(heroTotal, false);
      } else if (heroCurrent === heroTotal + 1) {
        goToHeroSlide(1, false);
      }
    });

    function heroNextSlide() {
      if (isTransitioning) return;
      goToHeroSlide(heroCurrent + 1, true);
    }

    function heroPrevSlide() {
      if (isTransitioning) return;
      goToHeroSlide(heroCurrent - 1, true);
    }

    heroPrev.addEventListener('click', () => { heroPrevSlide(); resetHeroAuto(); });
    heroNext.addEventListener('click', () => { heroNextSlide(); resetHeroAuto(); });

    heroDots.forEach((dot, i) => {
      dot.addEventListener('click', () => { 
        if (isTransitioning) return;
        goToHeroSlide(i + 1, true); 
        resetHeroAuto(); 
      });
    });

    function startHeroAuto() {
      // 6.5s delay to allow users to comfortably read the slide
      heroTimer = setInterval(heroNextSlide, 6500);
    }
    function resetHeroAuto() {
      clearInterval(heroTimer);
      startHeroAuto();
    }
    
    // Pause on hover/focus
    const heroSection = $('#hero');
    if (heroSection) {
      heroSection.addEventListener('mouseenter', () => clearInterval(heroTimer));
      heroSection.addEventListener('mouseleave', startHeroAuto);
      heroSection.addEventListener('focusin', () => clearInterval(heroTimer));
      heroSection.addEventListener('focusout', startHeroAuto);
    }

    // Start auto scroll
    setTimeout(startHeroAuto, 1000);

    // Swipe support for Hero Slider
    let heroTouchStartX = 0;
    let heroTouchEndX = 0;
    
    heroTrack.addEventListener('touchstart', e => {
      heroTouchStartX = e.changedTouches[0].screenX;
      clearInterval(heroTimer);
    }, {passive: true});
    
    heroTrack.addEventListener('touchend', e => {
      heroTouchEndX = e.changedTouches[0].screenX;
      handleHeroSwipe();
      startHeroAuto();
    }, {passive: true});
    
    function handleHeroSwipe() {
      const threshold = 50;
      if (heroTouchStartX - heroTouchEndX > threshold) {
        heroNextSlide(); // swipe left
      } else if (heroTouchEndX - heroTouchStartX > threshold) {
        heroPrevSlide(); // swipe right
      }
    }

    // Hook up the dropdown links to jump to specific slides
    $$('.slide-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const slideIndex = parseInt(link.getAttribute('data-slide'), 10);
        if (!isNaN(slideIndex)) {
          // data-slide is 0, 1, 2. Add 1 for the real slide position.
          goToHeroSlide(slideIndex + 1, true);
          resetHeroAuto();
        }
      });
    });
    
    updateDots();
  }

  /* ── 6. TESTIMONIAL CAROUSEL ──────────────────────────────── */
  const track     = $('#testiTrack');
  const prevBtn   = $('#testiPrev');
  const nextBtn   = $('#testiNext');
  const dotsWrap  = $('#testiDots');

  if (track && prevBtn && nextBtn && dotsWrap) {
    const cards = $$('.testi-card', track);
    const dots  = $$('.testi-dot', dotsWrap);
    const total = cards.length;

    let current   = 0;
    let autoTimer = null;
    let perView   = getPerView();

    function getPerView() {
      if (window.innerWidth <= 768)  return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function getCardWidth() {
      if (!cards[0]) return 0;
      const gap = 24; // matches --s3
      return cards[0].offsetWidth + gap;
    }

    function clamp(val) {
      const max = Math.max(0, total - perView);
      return Math.max(0, Math.min(val, max));
    }

    function goTo(index) {
      current = clamp(index);
      track.style.transform = `translateX(-${current * getCardWidth()}px)`;

      // Active card highlight
      cards.forEach((c, i) => c.classList.toggle('is-active', i === current));

      // Dots
      const maxDot = Math.max(0, total - perView);
      dots.forEach((d, i) => {
        const active = i === Math.min(current, maxDot);
        d.classList.toggle('active', active);
        d.setAttribute('aria-current', active ? 'true' : 'false');
      });

      // Button states
      prevBtn.disabled = current === 0;
      nextBtn.disabled = current >= total - perView;
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
    nextBtn.addEventListener('click', () => { next(); resetAuto(); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goTo(i); resetAuto(); });
    });

    // Auto-advance
    function startAuto() {
      autoTimer = setInterval(() => {
        if (current >= total - perView) goTo(0);
        else next();
      }, 5000);
    }
    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }

    // Touch / swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const delta = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(delta) > 40) {
        delta > 0 ? next() : prev();
        resetAuto();
      }
    }, { passive: true });

    // Keyboard accessibility
    [prevBtn, nextBtn].forEach(btn => {
      btn.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') { prev(); resetAuto(); }
        if (e.key === 'ArrowRight') { next(); resetAuto(); }
      });
    });

    // Resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        perView = getPerView();
        goTo(clamp(current));
      }, 200);
    });

    // Init
    goTo(0);
    startAuto();

    // Pause on hover/focus
    track.closest('section').addEventListener('mouseenter', () => clearInterval(autoTimer));
    track.closest('section').addEventListener('mouseleave', startAuto);
    track.closest('section').addEventListener('focusin',   () => clearInterval(autoTimer));
    track.closest('section').addEventListener('focusout',  startAuto);
  }

  /* ── 7. ACTIVE NAV HIGHLIGHT (scroll spy) ─────────────────── */
  const sections = $$('section[id], div[id]');
  const navLinks = $$('.nav__links a');

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
              const match = link.getAttribute('href') === `#${id}`;
              link.style.color = match ? 'var(--c-blue)' : '';
              link.style.fontWeight = match ? '600' : '';
            });
          }
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach(s => spy.observe(s));
  }

  /* ── 8. COUNTER ANIMATION (hero stats) ────────────────────── */
  const statVals = $$('.hero__stat-val');

  function animateCounter(el) {
    const text = el.textContent.trim();
    const num = parseFloat(text.replace(/[^0-9.]/g, ''));
    const suffix = text.replace(/[0-9.]/g, '').trim();
    if (isNaN(num) || num === 0) return;

    const duration = 1600;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const val = Math.round(ease * num * 10) / 10;
      el.textContent = (Number.isInteger(num) ? Math.round(val) : val.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  if ('IntersectionObserver' in window && statVals.length) {
    const counterObs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statVals.forEach(el => counterObs.observe(el));
  }

  /* ── 9. FORM PLACEHOLDER (contact CTA) ────────────────────── */
  // Future: replace with real form submission endpoint

  console.log('[CACHATTO] Page loaded. Light mode. Version 3.0');

})();
