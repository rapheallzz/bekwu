document.addEventListener('DOMContentLoaded', () => {
    // Hero Slider
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.slider-dots');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length > 0) {
        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        function updateSlider() {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSlider();
        }

        function goToSlide(index) {
            currentSlide = index;
            updateSlider();
            resetInterval();
        }

        function startInterval() {
            slideInterval = setInterval(nextSlide, 6000);
        }

        function resetInterval() {
            clearInterval(slideInterval);
            startInterval();
        }

        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });

        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });

        startInterval();
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simple scroll reveal effect
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section, .capability, .work-card, .fade-in, .reveal-text').forEach(el => {
        if (!el.classList.contains('reveal-text') && !el.classList.contains('fade-in')) {
            el.classList.add('fade-in');
        }
        observer.observe(el);
    });

    // Counter Animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.getAttribute('data-target'));
                const prefix = target.getAttribute('data-prefix') || '';
                const suffix = target.getAttribute('data-suffix') || '';
                let count = 0;
                const duration = 2000; // 2 seconds
                const startTime = performance.now();

                const updateCount = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const currentCount = Math.floor(progress * countTo);

                    target.innerText = prefix + currentCount + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        target.innerText = prefix + countTo + suffix;
                    }
                };
                requestAnimationFrame(updateCount);
                counterObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(counter => {
        counterObserver.observe(counter);
    });

    // Set active nav link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileToggle) {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // Header Scroll Effect
    const mainNav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    });

    // Back to top button visibility and behavior
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Form Submission Logic ---
    // Replace this with your actual Google Apps Script Web App URL after deployment
    const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_URL_HERE';

    async function submitToAppsScript(form, formType) {
        const formData = new FormData(form);
        formData.append('formType', formType);

        // Use URLSearchParams to ensure compatibility with Google Apps Script doPost(e)
        const params = new URLSearchParams();
        for (const pair of formData) {
            params.append(pair[0], pair[1]);
        }

        try {
            // We use no-cors to avoid preflight issues as Apps Script
            // redirected responses can be tricky with CORS.
            await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                body: params,
                mode: 'no-cors'
            });
            return true;
        } catch (error) {
            console.error('Submission error:', error);
            return false;
        }
    }

    // Modal Logic Utility
    function setupModal(modalId, triggerClass, formId, successId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        const triggers = document.querySelectorAll('.' + triggerClass);
        const closeBtns = modal.querySelectorAll('.close-modal, .close-modal-btn');
        const form = document.getElementById(formId);
        const success = document.getElementById(successId);

        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => {
                if (form) form.style.display = 'block';
                if (success) success.style.display = 'none';
                if (form) form.reset();
            }, 400);
        };

        closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const submitBtn = form.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn ? submitBtn.innerText : 'Submit';
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerText = 'Sending...';
                }

                // Send to Google Sheets if URL is provided
                if (APPS_SCRIPT_URL !== 'YOUR_APPS_SCRIPT_URL_HERE') {
                    await submitToAppsScript(form, formId);
                }

                // If it's the download form, trigger the PDF download
                if (formId === 'download-form' || formId === 'modal-download-form') {
                    const link = document.createElement('a');
                    link.href = 'img/The Global Black Diaspora Report 2026 Edition.pdf';
                    link.download = 'The Global Black Diaspora Report 2026 Edition.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }

                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                }

                form.style.display = 'none';
                if (success) success.style.display = 'block';
            });
        }
    }

    // Floating Download Button Logic
    const floatingBtn = document.getElementById('floating-download-btn');
    if (floatingBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                floatingBtn.classList.add('visible');
            } else {
                floatingBtn.classList.remove('visible');
            }
        });
    }

    // Initialize Modals
    setupModal('newsletter-modal', 'newsletter-trigger', 'newsletter-form', 'newsletter-success');
    setupModal('download-modal', 'download-trigger', 'download-form', 'download-success');
    setupModal('report-modal', 'download-trigger', 'modal-download-form', 'modal-thank-you');

    // Connect Form Submission (Non-modal)
    const connectForm = document.getElementById('connect-form');
    const connectSuccess = document.getElementById('connect-success');
    if (connectForm) {
        connectForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = connectForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerText : 'Submit';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = 'Sending...';
            }

            // Send to Google Sheets if URL is provided
            if (APPS_SCRIPT_URL !== 'YOUR_APPS_SCRIPT_URL_HERE') {
                await submitToAppsScript(connectForm, 'connect-form');
            }

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }

            connectForm.style.display = 'none';
            if (connectSuccess) connectSuccess.style.display = 'block';

            // Scroll to top of form area
            connectSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }
});
