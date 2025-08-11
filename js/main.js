// Main JavaScript file for Evolua Web Design Portfolio
class EvoluaPortfolio {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupLazyLoading();
        this.setupPerformanceOptimizations();
        this.setupAnalytics();
        this.setupAccessibility();
    }    
    setupLazyLoading() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    setupPerformanceOptimizations() {
        // Optimize scroll performance
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            
            scrollTimeout = setTimeout(() => {
                // Perform scroll-dependent operations
                this.updateScrollProgress();
            }, 10);
        }, { passive: true });
        
        // Optimize resize performance
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }
    
    updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        // Update scroll progress indicator if it exists
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            progressBar.style.width = scrollPercent + '%';
        }
    }
    
    handleResize() {
        // Handle responsive adjustments
        const isMobile = window.innerWidth <= 768;
        
        // Adjust WebGL scene if needed
        if (window.webglScene) {
            window.webglScene.onWindowResize();
        }
        
        // Update mobile-specific features
        if (isMobile) {
            this.enableMobileOptimizations();
        } else {
            this.disableMobileOptimizations();
        }
    }
    
    enableMobileOptimizations() {
        // Reduce animations on mobile for better performance
        document.body.classList.add('mobile-optimized');
        
        // Disable complex animations on mobile
        const complexAnimations = document.querySelectorAll('.complex-animation');
        complexAnimations.forEach(el => {
            el.style.animation = 'none';
        });
    }
    
    disableMobileOptimizations() {
        document.body.classList.remove('mobile-optimized');
    }
    
    setupAnalytics() {
        // Track user interactions
        this.trackClicks();
        this.trackScrollDepth();
        this.trackTimeOnPage();
    }
    
    trackClicks() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, button');
            if (target) {
                const action = target.textContent.trim();
                const category = target.closest('section')?.id || 'general';
                
                // Log interaction (replace with actual analytics)
                console.log('Click tracked:', { category, action });
            }
        });
    }
    
    trackScrollDepth() {
        const milestones = [25, 50, 75, 100];
        const tracked = new Set();
        
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            
            milestones.forEach(milestone => {
                if (scrollPercent >= milestone && !tracked.has(milestone)) {
                    tracked.add(milestone);
                    console.log('Scroll depth tracked:', milestone + '%');
                }
            });
        });
    }
    
    trackTimeOnPage() {
        const startTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            console.log('Time on page:', timeSpent + ' seconds');
        });
    }
    
    setupAccessibility() {
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // Focus management
        this.setupFocusManagement();
        
        // Screen reader support
        this.setupScreenReaderSupport();
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // ESC key closes mobile menu
            if (e.key === 'Escape') {
                const hamburger = document.getElementById('hamburger');
                const navMenu = document.getElementById('nav-menu');
                
                if (hamburger && navMenu && navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
            
            // Tab navigation enhancement
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        // Remove keyboard navigation class on mouse use
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }
    
    setupFocusManagement() {
        // Ensure focus is visible for keyboard users
        const focusableElements = document.querySelectorAll(`
            a, button, input, textarea, select, 
            [tabindex]:not([tabindex="-1"])
        `);
        
        focusableElements.forEach(el => {
            el.addEventListener('focus', () => {
                if (document.body.classList.contains('keyboard-navigation')) {
                    el.style.outline = '2px solid var(--evolua-orange)';
                    el.style.outlineOffset = '2px';
                }
            });
            
            el.addEventListener('blur', () => {
                el.style.outline = '';
                el.style.outlineOffset = '';
            });
        });
    }
    
    setupScreenReaderSupport() {
        // Add screen reader only text for better context
        const srOnlyStyle = `
            position: absolute !important;
            width: 1px !important;
            height: 1px !important;
            padding: 0 !important;
            margin: -1px !important;
            overflow: hidden !important;
            clip: rect(0, 0, 0, 0) !important;
            white-space: nowrap !important;
            border: 0 !important;
        `;
        
        // Add skip link
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Pular para o conteúdo principal';
        skipLink.style.cssText = srOnlyStyle;
        skipLink.addEventListener('focus', () => {
            skipLink.style.cssText = `
                position: fixed;
                top: 10px;
                left: 10px;
                background: var(--evolua-orange);
                color: white;
                padding: 8px 16px;
                border-radius: 4px;
                z-index: 10001;
            `;
        });
        skipLink.addEventListener('blur', () => {
            skipLink.style.cssText = srOnlyStyle;
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
}

// Utility Functions
const Utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Format phone number for WhatsApp
    formatPhoneForWhatsApp(phone) {
        return phone.replace(/\D/g, '');
    },
    
    // Generate WhatsApp message URL
    generateWhatsAppURL(phone, message = '') {
        const formattedPhone = this.formatPhoneForWhatsApp(phone);
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    }
};

// Enhanced WhatsApp Integration
class WhatsAppIntegration {
    constructor() {
        this.defaultPhone = '5511999999999';
        this.init();
    }
    
    init() {
        this.setupWhatsAppButtons();
        this.setupFloatingButton();
    }
    
    setupWhatsAppButtons() {
        const whatsappButtons = document.querySelectorAll('[href*="wa.me"], .btn-whatsapp');
        
        whatsappButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                const message = this.generateMessage(button);
                const url = Utils.generateWhatsAppURL(this.defaultPhone, message);
                
                window.open(url, '_blank');
                
                // Track WhatsApp click
                console.log('WhatsApp clicked:', { message, source: button.textContent.trim() });
            });
        });
    }
    
    setupFloatingButton() {
        const floatingButton = document.querySelector('.whatsapp-float a');
        if (floatingButton) {
            floatingButton.addEventListener('click', (e) => {
                e.preventDefault();
                
                const message = 'Olá! Gostaria de saber mais sobre os serviços da Evolua Web Design.';
                const url = Utils.generateWhatsAppURL(this.defaultPhone, message);
                
                window.open(url, '_blank');
            });
        }
    }
    
    generateMessage(button) {
        const section = button.closest('section')?.id;
        const buttonText = button.textContent.trim();
        
        let message = 'Olá! ';
        
        switch (section) {
            case 'home':
                message += 'Gostaria de fazer um orçamento personalizado.';
                break;
            case 'servicos':
                message += 'Tenho interesse nos serviços da Evolua Web Design.';
                break;
            case 'cases':
                message += 'Vi o portfólio e gostaria de saber mais sobre os projetos.';
                break;
            case 'contato':
                message += 'Gostaria de conversar sobre meu projeto.';
                break;
            default:
                message += 'Gostaria de saber mais sobre os serviços da Evolua Web Design.';
        }
        
        return message;
    }
}
// Validação Formulário
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.setupValidation();
        this.setupSubmitHandler();
    }
    
    setupValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório';
        }
        
        // Specific field validations
        if (value && fieldName === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Digite um e-mail válido';
            }
        }
        
        if (value && fieldName === 'phone') {
            const phoneRegex = /^[\(\)\s\-\+\d]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Digite um telefone válido';
            }
        }
        
        if (value && fieldName === 'name') {
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Nome deve ter pelo menos 2 caracteres';
            }
        }
        
        this.showFieldError(field, isValid, errorMessage);
        return isValid;
    }
    
    showFieldError(field, isValid, errorMessage) {
        const formGroup = field.closest('.form-group');
        let errorElement = formGroup.querySelector('.error-message');
        
        if (!isValid) {
            field.classList.add('error');
            
            if (!errorElement) {
                errorElement = document.createElement('span');
                errorElement.className = 'error-message';
                formGroup.appendChild(errorElement);
            }
            errorElement.textContent = errorMessage;
        } else {
            field.classList.remove('error');
            if (errorElement) {
                errorElement.remove();
            }
        }
    }
    
    clearError(field) {
        field.classList.remove('error');
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });
        
        return isFormValid;
    }
    
    setupSubmitHandler() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateForm()) {
                this.submitForm();
            } else {
                this.showFormError('Por favor, corrija os erros antes de enviar');
            }
        });
    }
    
    submitForm() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            this.showSuccessMessage();
            this.form.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
    
    showFormError(message) {
        this.showMessage(message, 'error');
    }
    
    showSuccessMessage() {
        this.showMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
    }
    
        showMessage(message, type) {
    // Remove any previously displayed global messages
    const existingMessage = document.querySelector(".global-form-message");
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageElement = document.createElement("div");
    messageElement.className = `global-form-message ${type}`;
    messageElement.textContent = message;
    
    document.body.appendChild(messageElement);
    
    // Auto remove after 4 seconds with fade-out effect
    setTimeout(() => {
        messageElement.classList.add("hide");
        messageElement.addEventListener("transitionend", () => messageElement.remove(), { once: true });
    }, 4000);
}
}
// Error Handler Class
    class ErrorHandler {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupGlobalErrorHandling();
        this.setupUnhandledPromiseRejection();
        this.setupResourceErrorHandling();
        this.setupNetworkErrorHandling();
    }
    
    setupGlobalErrorHandling() {
        window.addEventListener('error', (event) => {
            this.logError('JavaScript Error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
            
            // Prevent default browser error handling for better UX
            event.preventDefault();
        });
    }
    
    setupUnhandledPromiseRejection() {
        window.addEventListener('unhandledrejection', (event) => {
            this.logError('Unhandled Promise Rejection', {
                reason: event.reason,
                promise: event.promise
            });
            
            // Prevent default browser error handling
            event.preventDefault();
        });
    }
    
    setupResourceErrorHandling() {
        // Handle image loading errors
        document.addEventListener('error', (event) => {
            if (event.target.tagName === 'IMG') {
                this.handleImageError(event.target);
            } else if (event.target.tagName === 'SCRIPT') {
                this.handleScriptError(event.target);
            } else if (event.target.tagName === 'LINK') {
                this.handleStylesheetError(event.target);
            }
        }, true);
    }
    
    setupNetworkErrorHandling() {
        // Monitor fetch requests
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            try {
                const response = await originalFetch(...args);
                if (!response.ok) {
                    this.logError('Network Error', {
                        url: args[0],
                        status: response.status,
                        statusText: response.statusText
                    });
                }
                return response;
            } catch (error) {
                this.logError('Fetch Error', {
                    url: args[0],
                    error: error.message
                });
                throw error;
            }
        };
    }
    
    handleImageError(img) {
        // Replace broken images with placeholder
        img.style.display = 'none';
        
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.innerHTML = '📷';
        placeholder.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg-card);
            color: var(--text-secondary);
            font-size: 2rem;
            min-height: 200px;
            border-radius: var(--radius-md);
        `;
        
        img.parentNode.insertBefore(placeholder, img);
        
        this.logError('Image Load Error', {
            src: img.src,
            alt: img.alt
        });
    }
    
    handleScriptError(script) {
        this.logError('Script Load Error', {
            src: script.src
        });
        
        // Try to gracefully degrade functionality
        this.gracefulDegradation();
    }
    
    handleStylesheetError(link) {
        this.logError('Stylesheet Load Error', {
            href: link.href
        });
    }
    
    gracefulDegradation() {
        // Disable complex animations if scripts fail
        document.body.classList.add('fallback-mode');
        
        // Add fallback styles
        const fallbackStyles = document.createElement('style');
        fallbackStyles.textContent = `
            .fallback-mode * {
                animation: none !important;
                transition: none !important;
            }
            .fallback-mode .webgl-container {
                background: var(--gradient-dark) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            .fallback-mode .webgl-container::after {
                content: "🚀";
                font-size: 4rem;
                opacity: 0.5;
            }
        `;
        document.head.appendChild(fallbackStyles);
    }
    
    logError(type, details) {
        const errorData = {
            type,
            details,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        // Log to console in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.error(`[${type}]`, errorData);
        }
        
        // Store errors for potential reporting
        this.storeError(errorData);
    }
    
    storeError(errorData) {
        try {
            const errors = JSON.parse(localStorage.getItem('evolua_errors') || '[]');
            errors.push(errorData);
            
            // Keep only last 10 errors
            if (errors.length > 10) {
                errors.splice(0, errors.length - 10);
            }
            
            localStorage.setItem('evolua_errors', JSON.stringify(errors));
        } catch (e) {
            // Silently fail if localStorage is not available
        }
    }
    
    getStoredErrors() {
        try {
            return JSON.parse(localStorage.getItem('evolua_errors') || '[]');
        } catch (e) {
            return [];
        }
    }
    
    clearStoredErrors() {
        try {
            localStorage.removeItem('evolua_errors');
        } catch (e) {
            // Silently fail if localStorage is not available
        }
    }
}
// Efeito 3D nos Cards
function setupServiceCardHover() {
    // Cards com efeito 3D
    document.querySelectorAll(".service-card, .case-card").forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)";
        });
    });
}
// Efeito Typewriter
function setupTypewriter() {
    const heroTitle = document.querySelector('#home h1');
    if (!heroTitle) return;
    
    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    
    let i = 0;
    const typeSpeed = 100; // velocidade em ms
    
    function typeWriter() {
        if (i < originalText.length) {
            heroTitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, typeSpeed);
        }
    }
    
    // Inicia o efeito após um pequeno delay
    setTimeout(typeWriter, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize main portfolio functionality
    window.evoluaPortfolio = new EvoluaPortfolio();
    
    // Initialize WhatsApp integration
    window.whatsappIntegration = new WhatsAppIntegration();
    
    // Initialize 3D card hover effect
    setupServiceCardHover();
    
    // Initialize typewriter effect
    setupTypewriter();
    
    // Add main tag for accessibility
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.id = 'main';
    }
    
    // Console branding
    console.log('%c🚀 Evolua Web Design', 'color: #FF6B35; font-size: 24px; font-weight: bold;');
    console.log('%cSeu Futuro Online Começa Aqui', 'color: #3498DB; font-size: 16px;');
    console.log('%cPortfólio desenvolvido com HTML5, CSS3, JavaScript e WebGL', 'color: #27AE60; font-size: 12px;');
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EvoluaPortfolio, Utils, WhatsAppIntegration };
}

