document.addEventListener('DOMContentLoaded', () => {
    const mainHeader = document.getElementById('mainHeader');
    const sidebar = document.getElementById('sidebar');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const eventPageContent = document.getElementById('eventPageContent');

    let lastScrollY = window.scrollY;
    let isHeaderHidden = false;
    const scrollThreshold = 50;

    const homeButton = document.getElementById('homeButton');
    const renamePlayerButton = document.getElementById('renamePlayerButton');

    let playerName = localStorage.getItem('playerName') || 'Player';

    // header bullshit
    window.addEventListener('scroll', () => {
        if (sidebar.classList.contains('open')) {
            return;
        }

        if (window.scrollY > lastScrollY && window.scrollY > scrollThreshold) {
            if (!isHeaderHidden) {
                mainHeader.classList.add('header-hidden');
                isHeaderHidden = true;
            }
        } else if (window.scrollY < lastScrollY) {
            if (isHeaderHidden) {
                mainHeader.classList.remove('header-hidden');
                isHeaderHidden = false;
            }
        }
        lastScrollY = window.scrollY;
    });

    // sidebar
    hamburgerMenu.addEventListener('click', () => {
        toggleSidebar();
    });

    sidebarOverlay.addEventListener('click', () => {
        toggleSidebar();
    });

    function toggleSidebar() {
        sidebar.classList.toggle('open');
        hamburgerMenu.classList.toggle('open');
        sidebarOverlay.classList.toggle('open');

        if (sidebar.classList.contains('open')) {
            if (window.innerWidth > 768) {
                 eventPageContent.classList.add('shifted');
            }
        } else {
            eventPageContent.classList.remove('shifted');
        }
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
            eventPageContent.classList.remove('shifted');
        } else if (window.innerWidth > 768 && sidebar.classList.contains('open')) {
            eventPageContent.classList.add('shifted');
        }
    });

    // sleepy mode
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body.setAttribute('data-theme', 'dark');
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            if (body.getAttribute('data-theme') === 'dark') {
                body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // sending you to the shadow realm
    if (homeButton) {
      homeButton.addEventListener('click', () => {
        window.location.href = '../../index.html';
      });
    }

    // rename
    if (renamePlayerButton) {
      renamePlayerButton.addEventListener('click', () => {
        const newName = prompt('Replace [Player] with a name of your choice:');
        if (newName !== null && newName.trim() !== '') {
          playerName = newName.trim();
          localStorage.setItem('playerName', playerName);
          alert(`Name has been updated to "${playerName}"!`);
          
          loadStory(jsonPath); 
        } else if (newName !== null) {
          alert('Nope. That cannot be empty.');
        }
      });
    }
});