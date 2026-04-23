import { $, $$ } from './utils.js';

// ─── SPEED CONTROLS ────────────────────────────────────────────
// To slow down reading time:  increase AUTOPLAY_DELAY  (e.g. 8000)
// To speed up reading time:   decrease AUTOPLAY_DELAY  (e.g. 4000)
// To slower slide animation:  increase TRANSITION_SPEED (e.g. 900)
// To snappier slide animation: decrease TRANSITION_SPEED (e.g. 500)
const AUTOPLAY_DELAY    = 7000; // ms between automatic slide changes
const TRANSITION_SPEED  = 700;  // ms for the slide-move animation
const TRANSITION_EASING = 'ease-in-out'; // CSS easing for the slide animation
// ────────────────────────────────────────────────────────────────

export function initHeroSlider() {
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
        // Use named constants so speed is easy to tune at the top of this file
        heroTrack.style.transition = `transform ${TRANSITION_SPEED}ms ${TRANSITION_EASING}`;
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
      heroTimer = setInterval(heroNextSlide, AUTOPLAY_DELAY);
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
}
