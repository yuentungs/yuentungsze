(() => {
  function initEditorialNavigation() {
    document.querySelectorAll('.site-nav').forEach((nav) => {
      const toggle = nav.querySelector('.nav-toggle');
      const menu = nav.querySelector('.nav-menu');
      if (!toggle || !menu) return;

      toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });

      menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          nav.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEditorialNavigation);
  } else {
    initEditorialNavigation();
  }
})();
