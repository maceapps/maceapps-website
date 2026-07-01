/* ============================================
   MACE Applications - JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollEffects();
  initSmoothScroll();
  initNavbarScroll();
  initSpotlight();
});

// Scroll-based navigation styling
function initNavbarScroll() {
  const navbar = document.getElementById('mainNav');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// Scroll-triggered fade-in animations
function initScrollEffects() {
  const fadeElements = document.querySelectorAll(
    '.bento-item, .contact-card, .coming-soon-card'
  );

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  fadeElements.forEach((el, i) => {
    el.classList.add('fade-in');
    el.style.setProperty('--fade-delay', `${Math.min(i * 80, 240)}ms`);
  });

  if (reduceMotion) {
    fadeElements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  fadeElements.forEach(el => observer.observe(el));
}

// Cursor-tracking spotlight highlight on cards
function initSpotlight() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.spotlight').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      el.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = document.getElementById('mainNav')?.offsetHeight || 70;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });

        // Close mobile menu if open
        const navCollapse = document.querySelector('.navbar-collapse');
        if (navCollapse?.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
          bsCollapse?.hide();
        }
      }
    });
  });
}

// Active nav link highlighting on scroll
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// Also call on scroll for nav highlighting
window.addEventListener('load', initActiveNavHighlight);
