(() => {
  'use strict';
  try {
    const menu = document.querySelector('.menu-button');
    const nav = document.querySelector('.main-nav');
    const header = document.querySelector('.site-header');
    const toast = document.querySelector('#preview-toast');
    const heroImage = document.querySelector('.hero-art img');

    const fallbackHero = () => {
      if (!heroImage || heroImage.dataset.fallbackApplied === 'true') return;
      heroImage.dataset.fallbackApplied = 'true';
      heroImage.src = 'assets/images/hero.svg';
      console.warn('Primary hero artwork failed to load; restored bundled fallback artwork.');
    };

    heroImage?.addEventListener('error', fallbackHero, { once: true });
    if (heroImage?.complete && heroImage.naturalWidth === 0) fallbackHero();

    const closeMenu = (restoreFocus = false) => {
      menu?.setAttribute('aria-expanded', 'false');
      nav?.classList.remove('open');
      if (restoreFocus) menu?.focus();
    };

    menu?.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') === 'true';
      menu.setAttribute('aria-expanded', String(!open));
      nav?.classList.toggle('open', !open);
    });

    nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu(false)));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
        closeMenu(true);
      }
    });

    document.addEventListener('click', (event) => {
      if (menu?.getAttribute('aria-expanded') === 'true' && header && !header.contains(event.target)) {
        closeMenu(false);
      }
    });

    const showPreview = () => {
      toast?.classList.add('show');
      window.setTimeout(() => toast?.classList.remove('show'), 4200);
    };

    document.querySelector('#preview-form')?.addEventListener('submit', (event) => {
      event.preventDefault();
      showPreview();
    });

    document.querySelectorAll('.preview-checkout').forEach((button) => button.addEventListener('click', showPreview));
  } catch (error) {
    console.error('Wandered & Found UI initialization failed.', error);
  }
})();
