document.addEventListener('DOMContentLoaded', function () {
  var menuToggle = document.querySelector('.menu-toggle');
  var navLinks = document.querySelector('.nav-links');

  var searchContainer = document.querySelector('.search-container');
  var adminIconContainer = document.querySelector('.admin-icon-container');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('mobile-open');
      if (searchContainer) searchContainer.classList.toggle('mobile-open', isOpen);
      if (adminIconContainer) adminIconContainer.classList.toggle('mobile-open', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  function handleMobileDropdowns() {
    if (window.innerWidth > 768) {
      document.querySelectorAll('.dropdown, .dropdown-submenu').forEach(function (item) {
        item.classList.remove('mobile-open');
      });
      return;
    }

    document.querySelectorAll('.dropdown > a, .dropdown-submenu > a').forEach(function (trigger) {
      if (trigger.dataset.mobileBound === 'true') return;

      trigger.addEventListener('click', function (e) {
        if (window.innerWidth > 768) return;

        var parent = trigger.parentElement;
        if (!parent) return;

        var menu = parent.querySelector(':scope > .dropdown-menu, :scope > .dropdown-submenu-list');
        if (!menu) return;

        e.preventDefault();

        var isOpen = parent.classList.contains('mobile-open');

        Array.from(parent.parentElement.children).forEach(function (sib) {
          if (sib !== parent && sib.classList) {
            sib.classList.remove('mobile-open');
          }
        });

        if (isOpen) {
          parent.classList.remove('mobile-open');
        } else {
          parent.classList.add('mobile-open');
        }
      });

      trigger.dataset.mobileBound = 'true';
    });
  }

  handleMobileDropdowns();
  window.addEventListener('resize', handleMobileDropdowns);
});