// Tela de Loading Tecnológica - Inspirada em Bruno Simon
class TechLoadingScreen {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.loadingMesh = null;
        this.particles = null;
        this.progress = 0;
        this.isComplete = false;
        
        this.init();
    }
    
    init() {
        this.createLoadingHTML();
        this.setupThreeJS();
        this.createLoadingGeometry();
        this.createParticleSystem();
        this.setupLighting();
        this.startAnimation();
        this.simulateLoading();
    }
    
    createLoadingHTML() {
        // Container principal da tela de loading
        this.container = document.createElement('div');
        this.container.id = 'tech-loading-screen';
        this.container.innerHTML = `
            <div class="loading-content">
                <div id="loading-canvas-container"></div>
                <div class="loading-text">
                    <h1 class="loading-title">EVOLUA</h1>
                    <p class="loading-subtitle">Inicializando experiência...</p>
                    <div class="loading-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" id="progress-fill"></div>
                        </div>
                        <span class="progress-text" id="progress-text">0%</span>
                    </div>
                </div>
                <div class="loading-grid"></div>
            </div>
        `;
        
        // Estilos CSS da tela de loading
        const styles = `
            <style>
                #tech-loading-screen {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    transition: opacity 1s ease, transform 1s ease;
                }
                
                #tech-loading-screen.fade-out {
                    opacity: 0;
                    transform: scale(1.1);
                    pointer-events: none;
                }
                
                .loading-content {
                    position: relative;
                    text-align: center;
                    z-index: 2;
                }
                
                #loading-canvas-container {
                    width: 400px;
                    height: 400px;
                    margin: 0 auto 2rem;
                    position: relative;
                }
                
                .loading-title {
                    font-size: 4rem;
                    font-weight: 900;
                    color: #FF6B35;
                    margin: 0 0 1rem;
                    letter-spacing: 0.2em;
                    text-shadow: 0 0 20px rgba(255, 107, 53, 0.5);
                    animation: titlePulse 2s ease-in-out infinite alternate;
                }
                
                @keyframes titlePulse {
                    from { text-shadow: 0 0 20px rgba(255, 107, 53, 0.5); }
                    to { text-shadow: 0 0 30px rgba(255, 107, 53, 0.8), 0 0 40px rgba(255, 107, 53, 0.3); }
                }
                
                .loading-subtitle {
                    font-size: 1.2rem;
                    color: #3498DB;
                    margin: 0 0 3rem;
                    opacity: 0.8;
                    animation: subtitleFade 3s ease-in-out infinite;
                }
                
                @keyframes subtitleFade {
                    0%, 100% { opacity: 0.8; }
                    50% { opacity: 0.4; }
                }
                
                .loading-progress {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                    margin-top: 2rem;
                }
                
                .progress-bar {
                    width: 300px;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                    overflow: hidden;
                    position: relative;
                }
                
                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #FF6B35, #3498DB);
                    border-radius: 2px;
                    width: 0%;
                    transition: width 0.3s ease;
                    position: relative;
                }
                
                .progress-fill::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                    animation: progressShine 2s ease-in-out infinite;
                }
                
                @keyframes progressShine {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                .progress-text {
                    color: #fff;
                    font-weight: 600;
                    font-size: 1.1rem;
                    min-width: 50px;
                    text-align: left;
                }
                
                .loading-grid {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0.1;
                    background-image: 
                        linear-gradient(rgba(255, 107, 53, 0.3) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 107, 53, 0.3) 1px, transparent 1px);
                    background-size: 50px 50px;
                    animation: gridMove 20s linear infinite;
                }
                
                @keyframes gridMove {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(50px, 50px); }
                }
                
                /* Responsividade */
                @media (max-width: 768px) {
                    .loading-title {
                        font-size: 2.5rem;
                    }
                    
                    #loading-canvas-container {
                        width: 300px;
                        height: 300px;
                    }
                    
                    .progress-bar {
                        width: 250px;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
        document.body.appendChild(this.container);
    }
    
    setupThreeJS() {
        const canvasContainer = document.getElementById('loading-canvas-container');
        
        // Scene
        this.scene = new THREE.Scene();
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            canvasContainer.clientWidth / canvasContainer.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        this.renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x000000, 0);
        canvasContainer.appendChild(this.renderer.domElement);
    }
    
    createLoadingGeometry() {
        // Geometria principal - Icosaedro que se transforma
        const geometry = new THREE.IcosahedronGeometry(1.5, 2);
        
        // Material com efeito holográfico
        const material = new THREE.MeshPhongMaterial({
            color: 0xFF6B35,
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        
        this.loadingMesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.loadingMesh);
        
        // Adicionar pontos nos vértices
        const pointsGeometry = new THREE.BufferGeometry();
        const positions = geometry.attributes.position.array;
        pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const pointsMaterial = new THREE.PointsMaterial({
            color: 0x3498DB,
            size: 0.1,
            transparent: true,
            opacity: 0.9
        });
        
        const points = new THREE.Points(pointsGeometry, pointsMaterial);
        this.scene.add(points);
        
        // Anel externo que gira
        const ringGeometry = new THREE.RingGeometry(2, 2.1, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0x3498DB,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide
        });
        
        this.ring = new THREE.Mesh(ringGeometry, ringMaterial);
        this.scene.add(this.ring);
    }
    
    createParticleSystem() {
        const particleCount = 100;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            // Posições aleatórias em esfera
            const radius = 3 + Math.random() * 2;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);
            
            // Cores alternando entre laranja e azul
            const isOrange = Math.random() > 0.5;
            if (isOrange) {
                colors[i * 3] = 1.0;     // R
                colors[i * 3 + 1] = 0.42; // G
                colors[i * 3 + 2] = 0.21; // B
            } else {
                colors[i * 3] = 0.2;     // R
                colors[i * 3 + 1] = 0.6;  // G
                colors[i * 3 + 2] = 0.9;  // B
            }
        }
        
        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.03,
            vertexColors: true,
            transparent: true,
            opacity: 0.7
        });
        
        this.particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particles);
    }
    
    setupLighting() {
        // Luz ambiente
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Luz direcional
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
        
        // Luz pontual laranja
        const pointLight = new THREE.PointLight(0xFF6B35, 1, 100);
        pointLight.position.set(0, 0, 3);
        this.scene.add(pointLight);
    }
    
    startAnimation() {
        const animate = () => {
            if (this.isComplete) return;
            
            requestAnimationFrame(animate);
            
            const time = Date.now() * 0.001;
            
            // Rotação do objeto principal
            if (this.loadingMesh) {
                this.loadingMesh.rotation.x = time * 0.5;
                this.loadingMesh.rotation.y = time * 0.3;
                
                // Efeito de "respiração" baseado no progresso
                const scale = 1 + Math.sin(time * 2) * 0.1 + (this.progress / 100) * 0.3;
                this.loadingMesh.scale.setScalar(scale);
            }
            
            // Rotação do anel
            if (this.ring) {
                this.ring.rotation.z = time * 0.8;
                this.ring.rotation.x = Math.sin(time * 0.5) * 0.2;
            }
            
            // Animação das partículas
            if (this.particles) {
                this.particles.rotation.x = time * 0.1;
                this.particles.rotation.y = time * 0.15;
            }
            
            this.renderer.render(this.scene, this.camera);
        };
        
        animate();
    }
    
    simulateLoading() {
        const duration = 3000; // 3 segundos
        const startTime = Date.now();
        
        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / duration) * 100, 100);
            
            this.progress = progress;
            this.updateProgressUI(progress);
            
            if (progress < 100) {
                requestAnimationFrame(updateProgress);
            } else {
                setTimeout(() => this.completeLoading(), 500);
            }
        };
        
        updateProgress();
    }
    
    updateProgressUI(progress) {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
        
        if (progressText) {
            progressText.textContent = Math.round(progress) + '%';
        }
        
        // Atualizar texto baseado no progresso
        const subtitle = document.querySelector('.loading-subtitle');
        if (subtitle) {
            if (progress < 30) {
                subtitle.textContent = 'Carregando recursos...';
            } else if (progress < 60) {
                subtitle.textContent = 'Inicializando WebGL...';
            } else if (progress < 90) {
                subtitle.textContent = 'Preparando experiência...';
            } else {
                subtitle.textContent = 'Quase pronto!';
            }
        }
    }
    
    completeLoading() {
        this.isComplete = true;
        
        // Fade out da tela de loading
        this.container.classList.add('fade-out');
        
        // Remover após a animação
        setTimeout(() => {
            if (this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }
            
            // Cleanup Three.js
            if (this.renderer) {
                this.renderer.dispose();
            }
            
            // Callback para indicar que o loading terminou
            if (window.onLoadingComplete) {
                window.onLoadingComplete();
            }
        }, 1000);
    }
}

// Inicializar tela de loading quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se Three.js está disponível
    if (typeof THREE !== 'undefined') {
        window.techLoadingScreen = new TechLoadingScreen();
    } else {
        console.warn('Three.js não encontrado. Tela de loading não será exibida.');
    }
});

// Exportar para uso global
window.TechLoadingScreen = TechLoadingScreen;

