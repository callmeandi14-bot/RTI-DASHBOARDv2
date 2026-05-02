document.addEventListener('DOMContentLoaded', () => {

    // === 1. LOADER ===
    const loader = document.getElementById('loader-wrapper');

    if (loader) {
        if (sessionStorage.getItem('openingPlayed')) {
            // Sudah pernah buka, langsung hilang
            loader.style.display = 'none';
        } else {
            // Pertama kali buka — paksa hilang setelah 3.5s
            // Tidak bergantung class, pakai inline style langsung
            setTimeout(() => {
                loader.style.transition = 'opacity 1s ease, transform 1s ease';
                loader.style.opacity = '0';
                loader.style.transform = 'translateY(-20px)';
                loader.style.pointerEvents = 'none';
                setTimeout(() => {
                    loader.style.display = 'none';
                    sessionStorage.setItem('openingPlayed', 'true');
                }, 1000);
            }, 3000);
        }
    }

    // === 2. THEME TOGGLE ===
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon   = document.getElementById('theme-icon');
    const body        = document.body;

    function updateIcon(isDark) {
        if (!themeIcon) return;
        if (isDark) {
            themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z"></path>';
        } else {
            themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>';
        }
    }

    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        updateIcon(true);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateIcon(isDark);
        });
    }

    // === 3. SIDEBAR ===
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sidebar      = document.getElementById('sidebar');
    const overlay      = document.getElementById('sidebar-overlay');

    function openSidebar() {
        sidebar.classList.add('open');
        overlay.classList.add('open');
        hamburgerBtn.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
        hamburgerBtn.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', () => {
        sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });
    if (overlay) overlay.addEventListener('click', closeSidebar);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSidebar(); });

    // === 4. ACCORDION RECRUITMENT ===
    const accTrigger = document.getElementById('acc-recruitment');
    const accMenu    = document.getElementById('acc-recruitment-menu');

    if (accTrigger && accMenu) {
        const isSubActive = accMenu.querySelector('.sidebar-subitem.active');
        if (isSubActive) {
            accTrigger.classList.add('open');
            accMenu.classList.add('open');
        }
        accTrigger.addEventListener('click', () => {
            accTrigger.classList.toggle('open');
            accMenu.classList.toggle('open');
        });
    }

    // === 5. TYPEWRITER ===
    const textElement = document.getElementById('typewriter');
    const textToType  = "Selamat Datang";
    let textIndex     = 0;

    if (textElement) {
        function type() {
            if (textIndex < textToType.length) {
                textElement.innerHTML += textToType.charAt(textIndex);
                textIndex++;
                setTimeout(type, 150);
            } else {
                textElement.classList.add('typing-text');
            }
        }
        // Kalau loader sudah skip, langsung mulai typewriter
        const delay = sessionStorage.getItem('openingPlayed') ? 300 : 3200;
        setTimeout(type, delay);
    }

    // === 6. REVEAL ON SCROLL ===
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -80px 0px" });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

});