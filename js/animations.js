// Scroll Animations and Effects
class ScrollAnimations {
    constructor() {
        this.elements = [];
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.setupScrollEffects();
        this.setupParallaxEffects();
    }
    
    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, options);
        
        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach(el => {
            this.observer.observe(el);
        });
        
        // Observe sections for side navigation
        document.querySelectorAll('section').forEach(section => {
            this.observer.observe(section);
        });
    }
    
    setupScrollEffects() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    handleScroll() {
        const scrollY = window.pageYOffset;
        
        // Update navbar on scroll
        this.updateNavbar(scrollY);
        
        // Update side navigation
        this.updateSideNavigation();
        
        // Parallax effects
        this.updateParallax(scrollY);
        
        // Stats counter animation
        this.animateCounters();
    }
    
    updateNavbar(scrollY) {
        const navbar = document.getElementById('navbar');
        if (scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    updateSideNavigation() {
        const sections = document.querySelectorAll('section');
        const sideNavItems = document.querySelectorAll('.side-nav-item');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = section.id;
            }
        });
        
        sideNavItems.forEach(item => {
            const href = item.getAttribute('href').substring(1);
            if (href === currentSection) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    setupParallaxEffects() {
        this.parallaxElements = document.querySelectorAll('[data-parallax]');
    }
    
    updateParallax(scrollY) {
        this.parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            if (this.isElementInViewport(counter) && !counter.classList.contains('animated')) {
                counter.classList.add('animated');
                this.animateCounter(counter);
            }
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.textContent.replace(/\D/g, ''));
        const suffix = element.textContent.replace(/\d/g, '');
        let current = 0;
        const increment = target / 60; // 60 frames for 1 second at 60fps
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 16); // ~60fps
    }
    
    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// Smooth Scroll for Navigation Links
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    this.scrollToElement(target);
                }
            });
        });
    }
    
    scrollToElement(element) {
        const offsetTop = element.offsetTop - 80; // Account for fixed navbar
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Cases Filter Animation
class CasesFilter {
    constructor() {
        this.init();
    }
    
    init() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const caseCards = document.querySelectorAll('.case-card');
        
        // Mostrar todos os cases inicialmente
        this.filterCards(caseCards, 'all');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter cards with animation
                this.filterCards(caseCards, filter);
            });
        });
    }
    
    filterCards(cards, filter) {
        cards.forEach((card, index) => {
            const category = card.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
}

// Mobile Menu Toggle
class MobileMenu {
    constructor() {
        this.init();
    }
    
    init() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
            
            // Close menu when clicking on a link
            navMenu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
    }
}

// Form Handling
class ContactForm {
    constructor() {
        this.init();
    }
    
    init() {
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!this.validateForm(data)) {
            return;
        }
        
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            this.showSuccessMessage();
            e.target.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
    
    validateForm(data) {
        const { name, email, phone } = data;
        
        if (!name || !email || !phone) {
            this.showErrorMessage('Por favor, preencha todos os campos obrigatórios.');
            return false;
        }
        
        if (!this.isValidEmail(email)) {
            this.showErrorMessage('Por favor, insira um e-mail válido.');
            return false;
        }
        
        return true;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showSuccessMessage() {
        this.showMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
    }
    
    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }
    
    showMessage(message, type) {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message ${type}`;
        messageEl.textContent = message;
        
        // Style the message
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            ${type === 'success' ? 'background: #27AE60;' : 'background: #E74C3C;'}
        `;
        
        document.body.appendChild(messageEl);
        
        // Animate in
        setTimeout(() => {
            messageEl.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(messageEl);
            }, 300);
        }, 5000);
    }
}

// Cursor Effects (for desktop)
class CursorEffects {
    constructor() {
        if (window.innerWidth > 768) {
            this.init();
        }
    }
    
    init() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: var(--evolua-orange);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
            transition: transform 0.1s ease;
        `;
        
        document.body.appendChild(this.cursor);
        
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX - 10 + 'px';
            this.cursor.style.top = e.clientY - 10 + 'px';
        });
        
        // Scale cursor on hover over interactive elements
        document.querySelectorAll('a, button, .case-card, .service-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.style.transform = 'scale(2)';
            });
            
            el.addEventListener('mouseleave', () => {
                this.cursor.style.transform = 'scale(1)';
            });
        });
    }
}

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimations();
    new SmoothScroll();
    new CasesFilter();
    new MobileMenu();
    new ContactForm();
    new CursorEffects();
    
    // Add fade-in class to elements that should animate
    const animatedElements = document.querySelectorAll(`
        .section-header,
        .stat-item,
        .differential-item,
        .service-card,
        .case-card,
    `);
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
    });
});

// Performance optimization: Debounce resize events
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Trigger any resize-dependent animations
        if (window.webglScene) {
            window.webglScene.onWindowResize();
        }
    }, 250);
});

