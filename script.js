/* ============================================================
   CACHATTO Enterprise – script.js  v2
   Theme Engine · Router · Nav · Animations · FAQ · Counters
   ============================================================ */
(function () {
  'use strict';

  /* ──────────────────────────────────────────
     THEME ENGINE
     ────────────────────────────────────────── */
  const THEME_KEY  = 'cachatto-theme';
  const THEMES     = { DARK: 'dark', LIGHT: 'light' };

  /**
   * Read the currently active theme from the <html> attribute.
   * (Already set by the inline bootstrap script in <head>.)
   */
  function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || THEMES.DARK;
  }

  /**
   * Apply a theme:
   *  1. Set data-theme on <html>
   *  2. Persist to localStorage
   *  3. Update all toggle UI (desktop + mobile)
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    syncToggleUI(theme);
  }

  function toggleTheme() {
    const next = getCurrentTheme() === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    applyTheme(next);
  }

  /**
   * Sync the visual state of every theme-toggle button & label on the page.
   */
  function syncToggleUI(theme) {
    const isDark  = theme === THEMES.DARK;
    const icon    = isDark ? '🌙' : '☀️';
    const label   = isDark ? 'Dark'  : 'Light';
    const labelMobile = isDark ? 'Dark mode' : 'Light mode';

    // Desktop toggle
    const themeIcon  = document.getElementById('themeIcon');
    const themeLabel = document.getElementById('themeLabel');
    if (themeIcon)  themeIcon.textContent  = icon;
    if (themeLabel) themeLabel.textContent = label;

    // Mobile toggle
    const mobileThemeIcon  = document.getElementById('mobileThemeIcon');
    const mobileThemeLabel = document.getElementById('mobileThemeLabel');
    if (mobileThemeIcon)  mobileThemeIcon.textContent  = icon;
    if (mobileThemeLabel) mobileThemeLabel.textContent = labelMobile;

    // ARIA label on all toggle buttons
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.setAttribute(
        'aria-label',
        `Switch to ${isDark ? 'light' : 'dark'} mode (currently ${label.toLowerCase()})`
      );
    });
  }

  function initTheme() {
    // The <head> script already applied the theme; just sync UI
    syncToggleUI(getCurrentTheme());

    // Bind desktop toggle
    const toggle = document.getElementById('themeToggle');
    if (toggle) toggle.addEventListener('click', toggleTheme);

    // Bind mobile toggle
    const mobileToggle = document.getElementById('mobileThemeToggle');
    if (mobileToggle) mobileToggle.addEventListener('click', toggleTheme);

    // Listen for OS preference change (only if user hasn't made a manual choice)
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? THEMES.LIGHT : THEMES.DARK);
      }
    });
  }

  /* ──────────────────────────────────────────
     SPA ROUTER
  ──────────────────────────────────────────── */
  const PAGE_MAP = {
    home:         'homePage',
    cachatto:     'page-cachatto',
    ninjaconnect: 'page-ninjaconnect',
    ninjaism:     'page-ninjaism',
  };

  function showPage(key) {
    const id = PAGE_MAP[key] || PAGE_MAP.home;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Re-trigger fade-ins for the new page content
      requestAnimationFrame(observeFadeIns);
    }
  }

  function bindProductLinks() {
    document.querySelectorAll('[data-product]').forEach(el => {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        showPage(this.dataset.product);
        closeMobileMenu();
      });
    });

    document.querySelectorAll('[data-back]').forEach(el => {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        showPage(this.dataset.back);
      });
    });

    ['logoHome', 'navHome', 'mNavHome'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', e => {
          e.preventDefault();
          showPage('home');
          closeMobileMenu();
        });
      }
    });
  }

  /* ──────────────────────────────────────────
     MOBILE NAVIGATION
  ──────────────────────────────────────────── */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav    = document.getElementById('mobileNav');
  const mobileClose  = document.getElementById('mobileClose');

  function openMobileMenu() {
    mobileNav.classList.add('open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileNav.classList.remove('open');
    if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openMobileMenu);
  if (mobileClose)  mobileClose.addEventListener('click', closeMobileMenu);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  /* ──────────────────────────────────────────
     SMOOTH SCROLL
  ──────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const targetId = anchor.getAttribute('href').slice(1);
    if (!targetId) return;
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeMobileMenu();
    }
  });

  /* ──────────────────────────────────────────
     NAV SCROLL EFFECT
  ──────────────────────────────────────────── */
  const mainNav = document.getElementById('mainNav');
  function updateNav() {
    if (!mainNav) return;
    mainNav.style.borderBottomColor = window.scrollY > 60
      ? 'var(--nav-border)'
      : 'transparent';
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ──────────────────────────────────────────
     INTERSECTION OBSERVER – fade-in
  ──────────────────────────────────────────── */
  let fadeObserver;

  function observeFadeIns() {
    const els = document.querySelectorAll('.page.active .fade-in:not(.visible)');
    if (!els.length) return;
    if (fadeObserver) fadeObserver.disconnect();

    fadeObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.10, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach(el => fadeObserver.observe(el));
  }

  /* ──────────────────────────────────────────
     ANIMATED COUNTERS
  ──────────────────────────────────────────── */
  const counterObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  function animateCounter(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const target = parseInt(el.dataset.target, 10);
    const steps = Math.round(1800 / 16);
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current).toLocaleString();
    }, 16);
  }

  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

  /* ──────────────────────────────────────────
     FAQ ACCORDION
  ──────────────────────────────────────────── */
  function initFAQs() {
    document.querySelectorAll('.faq__q').forEach(btn => {
      if (btn._faqBound) return;   // idempotent
      btn._faqBound = true;
      btn.addEventListener('click', function () {
        const item   = this.closest('.faq__item');
        const isOpen = item.classList.contains('open');
        // Close siblings
        const list = item.closest('.faq__list');
        if (list) {
          list.querySelectorAll('.faq__item.open').forEach(openItem => {
            openItem.classList.remove('open');
            openItem.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
          });
        }
        if (!isOpen) {
          item.classList.add('open');
          this.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ──────────────────────────────────────────
     HERO PARALLAX (subtle)
  ──────────────────────────────────────────── */
  const heroBg   = document.querySelector('.hero__bg');
  const heroGrid = document.querySelector('.hero__grid');

  function heroParallax() {
    if (!heroBg || window.innerWidth < 768) return;
    const y = window.scrollY;
    heroBg.style.transform  = `translateY(${y * 0.22}px)`;
    heroGrid.style.transform = `translateY(${y * 0.08}px)`;
  }
  window.addEventListener('scroll', heroParallax, { passive: true });

  /* ──────────────────────────────────────────
     PRODUCT CARD 3D TILT (desktop)
  ──────────────────────────────────────────── */
  function initTilt() {
    if (window.innerWidth < 768) return;
    document.querySelectorAll('.product-card').forEach(card => {
      if (card._tiltBound) return;
      card._tiltBound = true;
      card.style.transformStyle = 'preserve-3d';
      card.style.willChange = 'transform';
      card.addEventListener('mousemove', function (e) {
        const r = this.getBoundingClientRect();
        const x = (e.clientX - r.left)  / r.width  - 0.5;
        const y = (e.clientY - r.top)   / r.height - 0.5;
        this.style.transform = `translateY(-4px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg)`;
      });
      card.addEventListener('mouseleave', function () {
        this.style.transform = '';
      });
    });
  }

  /* ──────────────────────────────────────────
     MUTATION OBSERVER
     Re-init interactive elements when SPA switches pages
  ──────────────────────────────────────────── */
  const bodyObserver = new MutationObserver(() => {
    observeFadeIns();
    initFAQs();
    initTilt();
  });
  bodyObserver.observe(document.body, {
    childList: false, subtree: true,
    attributes: true, attributeFilter: ['class']
  });

  /* ──────────────────────────────────────────
     INIT
  ──────────────────────────────────────────── */
  function init() {
    initTheme();
    bindProductLinks();
    observeFadeIns();
    initFAQs();
    initTilt();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
