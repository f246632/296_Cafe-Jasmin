// ========================================
// CAFE JASMIN - MAIN JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', function() {

    // ========================================
    // Navigation
    // ========================================

    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNavLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);

    // ========================================
    // Smooth Scrolling
    // ========================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 70;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // Contact Form Handling
    // ========================================

    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();

            // Validate
            if (!name || !email || !message) {
                showFormMessage('Bitte füllen Sie alle erforderlichen Felder aus.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormMessage('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
                return;
            }

            // In a real application, you would send this data to a server
            // For now, we'll just show a success message
            showFormMessage('Vielen Dank für Ihre Nachricht! Wir werden uns bald bei Ihnen melden.', 'success');
            contactForm.reset();

            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        });
    }

    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
    }

    // ========================================
    // Scroll Animations (Intersection Observer)
    // ========================================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .menu-category, .gallery-item, .review-card');

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // ========================================
    // Rating Stars Animation
    // ========================================

    const ratingDisplay = document.querySelector('.rating-display');

    if (ratingDisplay) {
        const ratingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stars = entry.target.querySelectorAll('.star');
                    stars.forEach((star, index) => {
                        setTimeout(() => {
                            star.style.opacity = '1';
                            star.style.transform = 'scale(1)';
                        }, index * 100);
                    });
                    ratingObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Initialize stars for animation
        const stars = ratingDisplay.querySelectorAll('.star');
        stars.forEach(star => {
            star.style.opacity = '0';
            star.style.transform = 'scale(0)';
            star.style.transition = 'all 0.3s ease';
        });

        ratingObserver.observe(ratingDisplay);
    }

    // ========================================
    // Performance: Lazy Load Images
    // ========================================

    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ========================================
    // Back to Top Button (Optional)
    // ========================================

    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ========================================
    // Prevent Right Click on Images (Optional Protection)
    // ========================================

    // Uncomment if you want to prevent right-click on gallery images
    /*
    const galleryImages = document.querySelectorAll('.gallery-item img');
    galleryImages.forEach(img => {
        img.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
    });
    */

    // ========================================
    // Console Welcome Message
    // ========================================

    console.log('%c Welcome to Cafe Jasmin! ', 'background: #8B4513; color: #D4AF37; font-size: 20px; padding: 10px;');
    console.log('%c Designed with ❤️ for Berlin\'s finest cafe experience ', 'color: #666; font-size: 12px;');

});

// ========================================
// Utility Functions
// ========================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
