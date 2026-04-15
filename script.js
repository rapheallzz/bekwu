document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.getElementById('qodef-page-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('qodef-header--sticky');
        } else {
            header.classList.remove('qodef-header--sticky');
        }
    });

    // Mobile Menu Toggle
    const mobileOpener = document.querySelector('.qodef-mobile-header-opener');
    const menu = document.querySelector('.qodef-menu');

    if (mobileOpener) {
        mobileOpener.addEventListener('click', () => {
            menu.classList.toggle('qodef--active');
        });
    }

    // Close menu when link is clicked
    document.querySelectorAll('.qodef-menu a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('qodef--active');
        });
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('qodef-animated');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.qodef-m-section-title, .qodef-grid-item, .qodef-m-hero-text-holder').forEach(el => {
        observer.observe(el);
    });
});
