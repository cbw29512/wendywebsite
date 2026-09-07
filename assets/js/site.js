(() => {
  'use strict';
  try {
    const menu = document.querySelector('.menu-button');
    const nav = document.querySelector('.main-nav');
    const toast = document.querySelector('#preview-toast');
    menu?.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') === 'true';
      menu.setAttribute('aria-expanded', String(!open));
      nav?.classList.toggle('open', !open);
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
