// ========================================
// CAFE JASMIN - GALLERY & LIGHTBOX
// ========================================

document.addEventListener('DOMContentLoaded', function() {

    // ========================================
    // Lightbox Functionality
    // ========================================

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const galleryItems = document.querySelectorAll('.gallery-item');

    let currentImageIndex = 0;
    const images = [];

    // Collect all gallery images
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        images.push({
            src: img.src,
            alt: img.alt,
            index: index
        });

        // Add click event to open lightbox
        item.addEventListener('click', function() {
            openLightbox(index);
        });

        // Add keyboard accessibility
        item.setAttribute('tabindex', '0');
        item.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });

    // Open lightbox
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Update lightbox image
    function updateLightboxImage() {
        const currentImage = images[currentImageIndex];
        lightboxImg.src = currentImage.src;
        lightboxImg.alt = currentImage.alt;
        lightboxCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;

        // Add fade-in animation
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.style.opacity = '1';
        }, 50);
    }

    // Navigate to previous image
    function previousImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    }

    // Navigate to next image
    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightboxImage();
    }

    // Event Listeners
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', function(e) {
            e.stopPropagation();
            previousImage();
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', function(e) {
            e.stopPropagation();
            nextImage();
        });
    }

    // Close lightbox when clicking on the background
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                previousImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    });

    // Touch/Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next image
                nextImage();
            } else {
                // Swipe right - previous image
                previousImage();
            }
        }
    }

    // Preload adjacent images for better UX
    function preloadAdjacentImages() {
        const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
        const nextIndex = (currentImageIndex + 1) % images.length;

        const prevImg = new Image();
        prevImg.src = images[prevIndex].src;

        const nextImg = new Image();
        nextImg.src = images[nextIndex].src;
    }

    // Call preload when opening lightbox
    lightbox.addEventListener('transitionend', function() {
        if (lightbox.classList.contains('active')) {
            preloadAdjacentImages();
        }
    });

    // ========================================
    // Gallery Hover Effects Enhancement
    // ========================================

    galleryItems.forEach(item => {
        const overlay = item.querySelector('.gallery-overlay');

        item.addEventListener('mouseenter', function() {
            overlay.style.transition = 'opacity 0.3s ease';
        });

        item.addEventListener('mouseleave', function() {
            overlay.style.transition = 'opacity 0.3s ease';
        });
    });

    // ========================================
    // Gallery Loading Animation
    // ========================================

    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 50); // Stagger animation

                galleryObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Initialize gallery items for animation
    galleryItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        galleryObserver.observe(item);
    });

    // ========================================
    // Image Error Handling
    // ========================================

    galleryItems.forEach(item => {
        const img = item.querySelector('img');

        img.addEventListener('error', function() {
            console.warn(`Failed to load image: ${img.src}`);
            // You could set a placeholder image here
            // img.src = 'path/to/placeholder.jpg';
        });
    });

    // ========================================
    // Accessibility: Focus Management
    // ========================================

    lightbox.addEventListener('transitionend', function() {
        if (lightbox.classList.contains('active')) {
            lightboxClose.focus();
        }
    });

    // ========================================
    // Performance: Progressive Image Loading
    // ========================================

    function loadGalleryImages() {
        const galleryImages = document.querySelectorAll('.gallery-item img');

        galleryImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
        });
    }

    // Load images when gallery section is in viewport
    const gallerySection = document.getElementById('gallery');

    if (gallerySection) {
        const gallerySectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadGalleryImages();
                    gallerySectionObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        gallerySectionObserver.observe(gallerySection);
    }

    // ========================================
    // Console Log for Development
    // ========================================

    console.log(`Gallery initialized with ${images.length} images`);
});
