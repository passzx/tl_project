document.addEventListener('DOMContentLoaded', () => {

    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNavigation = document.getElementById('main-navigation');

    if (mobileNavToggle && primaryNavigation) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
            primaryNavigation.classList.toggle('mobile-menu-open');
             document.body.classList.toggle('mobile-menu-active');

        });
    }
});