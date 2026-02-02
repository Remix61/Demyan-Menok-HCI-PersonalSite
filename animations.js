/**
 * VOLTURIO - Scroll Animations
 * Parallax (30%) + Scroll Reveal
 */
(function () {
  'use strict';

  var PARALLAX_FACTOR = 0.3; // 30% scroll speed
  var REVEAL_THRESHOLD = 0.15;
  var REVEAL_ROOT_MARGIN = '0px 0px -80px 0px';

  // Parallax: move background at 30% of scroll
  function initParallax() {
    var parallaxElements = document.querySelectorAll('[data-parallax]');
    
    function updateParallax() {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      
      parallaxElements.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var elTop = rect.top + scrollY;
        var elHeight = rect.height;
        var viewportHeight = window.innerHeight;
        
        // When element enters viewport, start parallax
        var visibleTop = Math.max(0, scrollY - elTop + viewportHeight);
        var visibleBottom = Math.min(elHeight + viewportHeight, scrollY + viewportHeight - elTop + viewportHeight);
        
        var offset = (scrollY - elTop) * PARALLAX_FACTOR;
        el.style.backgroundPositionY = offset + 'px';
      });
    }
    
    window.addEventListener('scroll', function () {
      requestAnimationFrame(updateParallax);
    }, { passive: true });
    updateParallax();
  }

  // Parallax with transform for bg layers
  function initParallaxBg() {
    var parallaxBgs = document.querySelectorAll('.parallax-bg');
    
    function updateParallaxBg() {
      var scrollY = window.pageYOffset;
      
      parallaxBgs.forEach(function (bg) {
        var parent = bg.closest('.parallax-section') || bg.parentElement;
        if (!parent) return;
        
        var rect = parent.getBoundingClientRect();
        var parentTop = rect.top + scrollY;
        var parentHeight = rect.height;
        
        var scrollProgress = (scrollY - parentTop + window.innerHeight * 0.5) / (parentHeight + window.innerHeight);
        var offset = scrollProgress * parentHeight * PARALLAX_FACTOR;
        
        bg.style.transform = 'translate3d(0, ' + offset + 'px, 0)';
      });
    }
    
    window.addEventListener('scroll', function () {
      requestAnimationFrame(updateParallaxBg);
    }, { passive: true });
    updateParallaxBg();
  }

  // Scroll reveal: add .revealed when element is in view
  function initScrollReveal() {
    var revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right, .reveal-scale');
    
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      }, {
        threshold: REVEAL_THRESHOLD,
        rootMargin: REVEAL_ROOT_MARGIN
      });
      
      revealElements.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      revealElements.forEach(function (el) {
        el.classList.add('revealed');
      });
    }
  }

  // Parallax for sections with background-image via data attribute
  function initSectionParallax() {
    var sections = document.querySelectorAll('[data-parallax-bg]');
    
    function update() {
      var scrollY = window.pageYOffset;
      
      sections.forEach(function (section) {
        var rect = section.getBoundingClientRect();
        var sectionTop = rect.top + scrollY;
        var sectionHeight = rect.height;
        
        var relativeScroll = scrollY - sectionTop;
        var offset = relativeScroll * PARALLAX_FACTOR;
        
        section.style.backgroundPositionY = offset + 'px';
      });
    }
    
    window.addEventListener('scroll', function () {
      requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  // Back to top button
  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;

    function toggleVisibility() {
      if (window.pageYOffset > 300) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', function () {
      requestAnimationFrame(toggleVisibility);
    }, { passive: true });
    toggleVisibility();
  }

  // Run on DOM ready
  function init() {
    initParallax();
    initParallaxBg();
    initSectionParallax();
    initScrollReveal();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
