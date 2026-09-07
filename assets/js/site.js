(() => {
  'use strict';
  try {
    const menu = document.querySelector('.menu-button');
    const nav = document.querySelector('.main-nav');
    const header = document.querySelector('.site-header');
    const toast = document.querySelector('#preview-toast');

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

    document.querySelector('.hero-art img')?.addEventListener('error', (event) => {
      const image = event.currentTarget;
      if (!(image instanceof HTMLImageElement)) return;
      if (image.dataset.fallbackApplied === 'true') return;
      image.dataset.fallbackApplied = 'true';
      image.src = 'assets/images/hero.svg';
      console.warn('Hero artwork failed to load; fallback artwork applied.');
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
