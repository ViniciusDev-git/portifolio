// Carrossel de Depoimentos para a seção "Resultados que Falam por Si"
class TestimonialsCarousel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 segundos
        
        // Dados dos depoimentos
        this.testimonials = [
            {
                id: 1,
                name: "Carlos Silva",
                company: "TechStart Innovations",
                role: "CEO",
                avatar: "👨‍💼",
                rating: 5,
                text: "A Evolua transformou completamente nossa presença digital. Em 3 meses, nosso faturamento online aumentou 250%. A equipe é extremamente profissional e entende as necessidades do mercado.",
                results: ["250% aumento no faturamento", "3x mais leads qualificados", "Tempo de carregamento 80% menor"]
            },
            {
                id: 2,
                name: "Marina Santos",
                company: "Boutique Elegance",
                role: "Proprietária",
                avatar: "👩‍💼",
                rating: 5,
                text: "Minha loja online criada pela Evolua superou todas as expectativas. O design é lindo e as vendas dispararam. Recomendo de olhos fechados!",
                results: ["400% aumento nas vendas online", "95% satisfação dos clientes", "Integração perfeita com estoque"]
            },
            {
                id: 3,
                name: "Roberto Oliveira",
                company: "Clínica Saúde Total",
                role: "Diretor Médico",
                avatar: "👨‍⚕️",
                rating: 5,
                text: "O site da nossa clínica ficou incrível. Agendamentos online aumentaram 300% e nossa credibilidade no mercado cresceu exponencialmente. Trabalho impecável!",
                results: ["300% mais agendamentos", "Credibilidade aumentada", "Sistema integrado eficiente"]
            },
            {
                id: 4,
                name: "Ana Paula Costa",
                company: "EcoVerde Sustentável",
                role: "Fundadora",
                avatar: "👩‍🌾",
                rating: 5,
                text: "A Evolua não apenas criou nosso site, mas entendeu nossa missão sustentável. O resultado foi uma plataforma que reflete nossos valores e gera resultados reais.",
                results: ["Identidade visual alinhada", "Engajamento 200% maior", "Conversões otimizadas"]
            },
            {
                id: 5,
                name: "Fernando Almeida",
                company: "AutoPeças Premium",
                role: "Gerente Comercial",
                avatar: "👨‍🔧",
                rating: 5,
                text: "E-commerce robusto, rápido e intuitivo. Nossos clientes adoraram a nova experiência de compra. Vendas online cresceram 180% no primeiro trimestre.",
                results: ["180% crescimento vendas", "Experiência otimizada", "Gestão simplificada"]
            }
        ];
        
        this.init();
    }
    
    init() {
        if (!this.container) {
            console.warn('Container do carrossel de depoimentos não encontrado');
            return;
        }
        
        this.createCarouselHTML();
        this.setupEventListeners();
        this.startAutoPlay();
        this.updateCarousel();
    }
    
    createCarouselHTML() {
        this.container.innerHTML = `
            <div class="testimonials-carousel">
                <div class="carousel-header">
                    <h3 class="carousel-title">O que nossos <span class="highlight">clientes dizem</span></h3>
                    <p class="carousel-subtitle">Depoimentos reais de empresas que transformaram seus negócios conosco</p>
                </div>
                
                <div class="carousel-container">
                    <div class="carousel-track" id="carousel-track">
                        <!-- Slides serão inseridos aqui -->
                    </div>
                    
                    <!-- Setas para desktop -->
                    <button class="carousel-btn carousel-btn-prev desktop-only" id="prev-btn" aria-label="Depoimento anterior">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    
                    <button class="carousel-btn carousel-btn-next desktop-only" id="next-btn" aria-label="Próximo depoimento">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    
                    <!-- Setas clean para mobile -->
                    <button class="mobile-arrow mobile-arrow-left mobile-only" id="mobile-prev-btn" aria-label="Depoimento anterior">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    
                    <button class="mobile-arrow mobile-arrow-right mobile-only" id="mobile-next-btn" aria-label="Próximo depoimento">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                
                <div class="carousel-indicators" id="carousel-indicators">
                    <!-- Indicadores serão inseridos aqui -->
                </div>
                
                <div class="carousel-controls">
                    <button class="auto-play-toggle" id="auto-play-toggle" aria-label="Pausar reprodução automática">
                        <svg class="play-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                            <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        this.createSlides();
        this.createIndicators();
    }
    
    createSlides() {
        const track = document.getElementById('carousel-track');
        
        this.testimonials.forEach((testimonial, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.innerHTML = `
                <div class="testimonial-card">
                    <div class="testimonial-header">
                        <div class="client-info">
                            <div class="client-avatar">${testimonial.avatar}</div>
                            <div class="client-details">
                                <h4 class="client-name">${testimonial.name}</h4>
                                <p class="client-role">${testimonial.role}</p>
                                <p class="client-company">${testimonial.company}</p>
                            </div>
                        </div>
                        <div class="rating">
                            ${this.generateStars(testimonial.rating)}
                        </div>
                    </div>
                    
                    <blockquote class="testimonial-text">
                        "${testimonial.text}"
                    </blockquote>
                    
                    <div class="testimonial-results">
                        <h5>Resultados Alcançados:</h5>
                        <ul class="results-list">
                            ${testimonial.results.map(result => `<li>${result}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
            
            track.appendChild(slide);
        });
    }
    
    createIndicators() {
        const indicatorsContainer = document.getElementById('carousel-indicators');
        
        this.testimonials.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = 'carousel-indicator';
            indicator.setAttribute('data-index', index);
            indicator.setAttribute('aria-label', `Ir para depoimento ${index + 1}`);
            
            if (index === 0) {
                indicator.classList.add('active');
            }
            
            indicatorsContainer.appendChild(indicator);
        });
    }
    
    generateStars(rating) {
        let stars = '';
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                stars += '<span class="star filled">★</span>';
            } else {
                stars += '<span class="star">☆</span>';
            }
        }
        return stars;
    }
    
    setupEventListeners() {
        // Botões de navegação desktop
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Botões de navegação mobile
        const mobilePrevBtn = document.getElementById('mobile-prev-btn');
        const mobileNextBtn = document.getElementById('mobile-next-btn');
        
        if (mobilePrevBtn) mobilePrevBtn.addEventListener('click', () => this.prevSlide());
        if (mobileNextBtn) mobileNextBtn.addEventListener('click', () => this.nextSlide());
        
        // Indicadores
        const indicators = document.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Auto-play toggle
        const autoPlayToggle = document.getElementById('auto-play-toggle');
        if (autoPlayToggle) {
            autoPlayToggle.addEventListener('click', () => this.toggleAutoPlay());
        }
        
        // Pausar auto-play ao passar o mouse
        this.container.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.container.addEventListener('mouseleave', () => this.resumeAutoPlay());
        
        // Navegação por teclado
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
        
        // Touch/swipe support
        this.setupTouchEvents();
    }
    
    setupTouchEvents() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        let isHorizontalSwipe = false;
        
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isHorizontalSwipe = false;
        });
        
        this.container.addEventListener('touchmove', (e) => {
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = Math.abs(currentX - startX);
            const diffY = Math.abs(currentY - startY);
            
            // Determina se é um swipe horizontal
            if (diffX > diffY && diffX > 10) {
                isHorizontalSwipe = true;
                e.preventDefault(); // Previne scroll apenas para swipes horizontais
            }
        });
        
        this.container.addEventListener('touchend', (e) => {
            if (!isHorizontalSwipe) return;
            
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // Mínimo de 50px para considerar swipe
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
    }
    
    updateCarousel() {
        const track = document.getElementById('carousel-track');
        const indicators = document.querySelectorAll('.carousel-indicator');
        
        if (track) {
            const translateX = -this.currentIndex * 100;
            track.style.transform = `translateX(${translateX}%)`;
        }
        
        // Atualizar indicadores
        indicators.forEach((indicator, index) => {
            if (index === this.currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
        
        // Atualizar acessibilidade
        const slides = document.querySelectorAll('.carousel-slide');
        slides.forEach((slide, index) => {
            if (index === this.currentIndex) {
                slide.setAttribute('aria-hidden', 'false');
            } else {
                slide.setAttribute('aria-hidden', 'true');
            }
        });
    }
    
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
        this.updateCarousel();
    }
    
    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
        this.updateCarousel();
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resumeAutoPlay() {
        if (!this.autoPlayInterval) {
            this.startAutoPlay();
        }
    }
    
    toggleAutoPlay() {
        const toggle = document.getElementById('auto-play-toggle');
        
        if (this.autoPlayInterval) {
            this.pauseAutoPlay();
            toggle.innerHTML = `
                <svg class="play-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="5,3 19,12 5,21" fill="currentColor"/>
                </svg>
            `;
            toggle.setAttribute('aria-label', 'Iniciar reprodução automática');
        } else {
            this.resumeAutoPlay();
            toggle.innerHTML = `
                <svg class="play-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                    <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
                </svg>
            `;
            toggle.setAttribute('aria-label', 'Pausar reprodução automática');
        }
    }
    
    // Método para destruir o carrossel (cleanup)
    destroy() {
        this.pauseAutoPlay();
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Inicializar o carrossel quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se existe um container para o carrossel
    const testimonialsContainer = document.getElementById('testimonials-carousel-container');
    if (testimonialsContainer) {
        window.testimonialsCarousel = new TestimonialsCarousel('testimonials-carousel-container');
    }
});

// Exportar para uso global
window.TestimonialsCarousel = TestimonialsCarousel;
