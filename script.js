/* ══════════════════════════════════════════════
   LAGO AZUL — DESPACHO LEGAL
   script.js — Interactividad completa
   ══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────
     1. NAVBAR — scroll shadow + menú móvil
     ────────────────────────────────────────── */
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('hamburger');
  const navLinks    = document.getElementById('navLinks');
  const navOverlay  = document.getElementById('navOverlay');

  // Scroll shadow
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Toggle menú móvil
  function openMenu() {
    navLinks.classList.add('open');
    navOverlay.classList.add('visible');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    navLinks.classList.remove('open');
    navOverlay.classList.remove('visible');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });

  navOverlay.addEventListener('click', closeMenu);

  // Cerrar al hacer clic en un enlace del menú
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Cerrar menú con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) closeMenu();
  });

  /* ──────────────────────────────────────────
     2. TABS DE SERVICIOS
     ────────────────────────────────────────── */
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      // Desactivar todos
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(p => p.classList.remove('active'));

      // Activar el seleccionado
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const panel = document.getElementById('tab-' + target);
      if (panel) panel.classList.add('active');

      // Scroll suave del nav de tabs para centrar el botón activo (móvil)
      btn.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' });
    });
  });

  /* ──────────────────────────────────────────
     3. SCROLL-SPY — resaltar nav link activo
     ────────────────────────────────────────── */
  const sections    = document.querySelectorAll('section[id]');
  const navLinkEls  = document.querySelectorAll('.nav-link');

  const observerOpts = { rootMargin: '-50% 0px -40% 0px', threshold: 0 };
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkEls.forEach(link => {
          link.classList.toggle('active-section',
            link.getAttribute('href') === '#' + id
          );
        });
      }
    });
  }, observerOpts);

  sections.forEach(sec => sectionObserver.observe(sec));

  /* ──────────────────────────────────────────
     4. REVEAL ON SCROLL — IntersectionObserver
     ────────────────────────────────────────── */
  const revealEls = document.querySelectorAll(
    '.service-card, .team-card, .info-block, .valor-item, .panel-intro'
  );

  // Aplicar estado inicial de invisibilidad
  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Pequeño delay escalonado por posición en la grilla
        const delay = (entry.target.dataset.revealDelay || 0) + 'ms';
        entry.target.style.transitionDelay = delay;
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  // Asignar delays escalonados a cards dentro de un grid
  document.querySelectorAll('.services-grid, .team-grid, .ubicacion-info').forEach(grid => {
    const children = grid.querySelectorAll('.service-card, .team-card, .info-block');
    children.forEach((child, idx) => {
      child.dataset.revealDelay = idx * 80;
    });
  });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ──────────────────────────────────────────
     5. WHATSAPP FLOAT — ocultar en hero
     ────────────────────────────────────────── */
  const waFloat = document.querySelector('.whatsapp-float');
  const hero    = document.querySelector('.hero');

  if (waFloat && hero) {
    const heroObserver = new IntersectionObserver(([entry]) => {
      waFloat.style.opacity    = entry.isIntersecting ? '0' : '1';
      waFloat.style.pointerEvents = entry.isIntersecting ? 'none' : 'all';
      waFloat.style.transition = 'opacity .4s ease';
    }, { threshold: 0.3 });
    heroObserver.observe(hero);
  }

  /* ──────────────────────────────────────────
     6. SMOOTH SCROLL para anclas del navbar
     ────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 70; // altura del navbar
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ──────────────────────────────────────────
     7. ACTIVE NAV LINK STYLE — inyectar CSS
     ────────────────────────────────────────── */
  const activeStyle = document.createElement('style');
  activeStyle.textContent = `
    .nav-link.active-section {
      color: #C9A84C !important;
    }
  `;
  document.head.appendChild(activeStyle);

  /* ──────────────────────────────────────────
     8. TABS — accesibilidad teclado (←/→)
     ────────────────────────────────────────── */
  const tabsNav = document.getElementById('tabsNav');
  if (tabsNav) {
    tabsNav.addEventListener('keydown', (e) => {
      const current = tabsNav.querySelector('.tab-btn.active');
      const all     = [...tabsNav.querySelectorAll('.tab-btn')];
      const idx     = all.indexOf(current);
      let nextIdx   = idx;

      if (e.key === 'ArrowRight') nextIdx = (idx + 1) % all.length;
      if (e.key === 'ArrowLeft')  nextIdx = (idx - 1 + all.length) % all.length;
      if (nextIdx !== idx) {
        all[nextIdx].focus();
        all[nextIdx].click();
      }
    });
  }

  /* ──────────────────────────────────────────
     9. VALOR STRIP — contador animado
     ────────────────────────────────────────── */
  function animateCounter(el, target, suffix, duration) {
    let start = 0;
    const startTime = performance.now();
    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      // easing: ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      const value  = Math.floor(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  const valorNums = document.querySelectorAll('.valor-num');
  const counterData = [
    { target: 500, suffix: '+' },
    { target: 2,   suffix: '' },
    { target: 100, suffix: '%' },
    { target: null, text: 'Gratis' }
  ];

  let countersStarted = false;
  const counterObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      valorNums.forEach((el, i) => {
        const data = counterData[i];
        if (data && data.target !== null) {
          el.textContent = '0' + data.suffix;
          setTimeout(() => animateCounter(el, data.target, data.suffix, 1200), i * 150);
        }
      });
    }
  }, { threshold: 0.5 });

  const valorStrip = document.querySelector('.valor-strip');
  if (valorStrip) counterObserver.observe(valorStrip);

})();