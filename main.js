// Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && navToggle && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });

    // Update active nav link based on current page
    updateActiveNavLink();
});

function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Tab Navigation
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            const activeContent = document.getElementById(tabName);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });

    // Set first tab as active by default
    if (tabBtns.length > 0 && tabContents.length > 0) {
        tabBtns[0].classList.add('active');
        tabContents[0].classList.add('active');
    }
}

// Gallery Modal
class GalleryModal {
    constructor() {
        this.modal = null;
        this.currentIndex = 0;
        this.items = [];
    }

    init() {
        this.createModal();
        this.attachEventListeners();
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'gallery-modal';
        this.modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <button class="modal-prev">&#10094;</button>
                <img class="modal-image" src="" alt="">
                <button class="modal-next">&#10095;</button>
                <div class="modal-info">
                    <span class="modal-counter"></span>
                </div>
            </div>
        `;
        document.body.appendChild(this.modal);
        this.attachModalListeners();
    }

    attachEventListeners() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        this.items = Array.from(galleryItems);

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.currentIndex = index;
                this.open();
            });
        });
    }

    attachModalListeners() {
        const overlay = this.modal.querySelector('.modal-overlay');
        const closeBtn = this.modal.querySelector('.modal-close');
        const prevBtn = this.modal.querySelector('.modal-prev');
        const nextBtn = this.modal.querySelector('.modal-next');

        overlay.addEventListener('click', () => this.close());
        closeBtn.addEventListener('click', () => this.close());
        prevBtn.addEventListener('click', () => this.prev());
        nextBtn.addEventListener('click', () => this.next());

        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('active')) return;
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
            if (e.key === 'Escape') this.close();
        });
    }

    open() {
        this.updateImage();
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.updateImage();
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        this.updateImage();
    }

    updateImage() {
        const item = this.items[this.currentIndex];
        const img = this.modal.querySelector('.modal-image');
        const counter = this.modal.querySelector('.modal-counter');
        
        if (item.querySelector('img')) {
            img.src = item.querySelector('img').src;
        } else {
            img.src = item.style.backgroundImage.slice(5, -2);
        }
        
        counter.textContent = `${this.currentIndex + 1} / ${this.items.length}`;
    }
}

// Smooth Scroll
function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Animation on Scroll
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.card, .feature-card, .gallery-item, .stat-item').forEach(el => {
        observer.observe(el);
    });
}

// Form Handling
class FormHandler {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!this.validate(data)) {
            return;
        }

        // Show loading state
        this.setLoading(true);

        // Simulate API call
        setTimeout(() => {
            this.setLoading(false);
            this.showSuccess();
            this.form.reset();
        }, 1500);
    }

    validate(data) {
        // Basic validation
        for (const [key, value] of Object.entries(data)) {
            if (!value || value.trim() === '') {
                this.showError(`${key} is required`);
                return false;
            }
        }

        // Email validation if email field exists
        if (data.email && !this.isValidEmail(data.email)) {
            this.showError('Invalid email address');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    setLoading(loading) {
        if (loading) {
            this.form.classList.add('loading');
        } else {
            this.form.classList.remove('loading');
        }
    }

    showSuccess() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.textContent = 'Message sent successfully!';
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(34, 197, 94, 0.2);
            border: 1px solid #22c55e;
            color: #22c55e;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    showError(errorMsg) {
        const message = document.createElement('div');
        message.className = 'error-message';
        message.textContent = errorMsg;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(239, 68, 68, 0.2);
            border: 1px solid #ef4444;
            color: #ef4444;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, 3000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    smoothScroll();
    observeElements();
    
    // Initialize gallery modal if gallery items exist
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
        const gallery = new GalleryModal();
        gallery.init();
    }

    // Initialize contact form if it exists
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        new FormHandler('contactForm');
    }

    // Add slide-in animation styles if not already present
    if (!document.querySelector('style[data-animations]')) {
        const style = document.createElement('style');
        style.setAttribute('data-animations', 'true');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            .gallery-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2000;
            }

            .gallery-modal.active {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .gallery-modal .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(10px);
            }

            .gallery-modal .modal-content {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                max-width: 90vw;
                max-height: 90vh;
            }

            .gallery-modal .modal-close {
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(147, 51, 234, 0.2);
                border: 1px solid var(--border-color);
                color: var(--text-primary);
                width: 40px;
                height: 40px;
                border-radius: 50%;
                font-size: 24px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                z-index: 2001;
            }

            .gallery-modal .modal-close:hover {
                background: rgba(147, 51, 234, 0.4);
            }

            .gallery-modal .modal-prev,
            .gallery-modal .modal-next {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(147, 51, 234, 0.2);
                border: 1px solid var(--border-color);
                color: var(--text-primary);
                width: 50px;
                height: 50px;
                border-radius: 8px;
                font-size: 24px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                z-index: 2001;
            }

            .gallery-modal .modal-prev:hover,
            .gallery-modal .modal-next:hover {
                background: rgba(147, 51, 234, 0.4);
            }

            .gallery-modal .modal-prev {
                left: 20px;
            }

            .gallery-modal .modal-next {
                right: 20px;
            }

            .gallery-modal .modal-image {
                max-width: 100%;
                max-height: 100%;
                border-radius: 12px;
            }

            .gallery-modal .modal-info {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: var(--text-primary);
                padding: 10px 20px;
                border-radius: 8px;
                font-size: 14px;
                border: 1px solid var(--border-color);
            }

            .in-view {
                animation: fadeInUp 0.6s ease forwards;
            }
        `;
        document.head.appendChild(style);
    }
});

// Utility Functions
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

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export for use in other files
window.FormHandler = FormHandler;
window.GalleryModal = GalleryModal;
