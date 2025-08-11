class WebGLScene {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.wireframe = null;
        this.particles = null;
        this.globalParticles = null;
        this.mouse = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };
        this.currentRotation = { x: 0, y: 0 };
        
        this.init();
        this.createGlobe();
        this.createParticles();
        this.createGlobalParticles();
        this.setupLighting();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();
        
        // Camera - ajustado para globo maior
        this.camera = new THREE.PerspectiveCamera(
            75, 
            this.container.clientWidth / this.container.clientHeight, 
            0.1, 
            1000
        );
        this.camera.position.z = 8; // Mais distante para acomodar globo maior
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);
    }

    createGlobe() {
        // Globo principal - 3x maior, apenas wireframe laranja
        const globeGeometry = new THREE.IcosahedronGeometry(4, 2); // Aumentado de 1.5 para 4
        
        // Material wireframe laranja da marca
        const globeMaterial = new THREE.MeshBasicMaterial({
            color: 0xFF6B35, // Laranja da Evolua
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        
        this.wireframe = new THREE.Mesh(globeGeometry, globeMaterial);
        this.scene.add(this.wireframe);
        
        // Adicionar pontos de conexão nos vértices
        const pointsGeometry = new THREE.BufferGeometry();
        const positions = globeGeometry.attributes.position.array;
        pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const pointsMaterial = new THREE.PointsMaterial({
            color: 0xFF6B35,
            size: 0.1,
            transparent: true,
            opacity: 0.9
        });
        
        const points = new THREE.Points(pointsGeometry, pointsMaterial);
        this.scene.add(points);
    }

    createParticles() {
        // Partículas ao redor do globo
        const particleCount = 200;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            // Posições em esfera ao redor do globo
            const radius = 6 + Math.random() * 4;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);
            
            // Cores variando entre laranja e azul
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
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        this.particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particles);
    }

    createGlobalParticles() {
        // Partículas que se espalham por todo o site (menor quantidade)
        const globalParticleCount = 50;
        const positions = new Float32Array(globalParticleCount * 3);
        const colors = new Float32Array(globalParticleCount * 3);
        
        for (let i = 0; i < globalParticleCount; i++) {
            // Posições mais espalhadas
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
            
            // Principalmente laranja com alguns azuis
            const isOrange = Math.random() > 0.3;
            if (isOrange) {
                colors[i * 3] = 1.0;
                colors[i * 3 + 1] = 0.42;
                colors[i * 3 + 2] = 0.21;
            } else {
                colors[i * 3] = 0.2;
                colors[i * 3 + 1] = 0.6;
                colors[i * 3 + 2] = 0.9;
            }
        }
        
        const globalGeometry = new THREE.BufferGeometry();
        globalGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        globalGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const globalMaterial = new THREE.PointsMaterial({
            size: 0.03,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });
        
        this.globalParticles = new THREE.Points(globalGeometry, globalMaterial);
        this.scene.add(this.globalParticles);
    }

    setupLighting() {
        // Luz ambiente
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Luz direcional
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
        
        // Luz pontual laranja para destacar o globo
        const pointLight = new THREE.PointLight(0xFF6B35, 1, 100);
        pointLight.position.set(0, 0, 10);
        this.scene.add(pointLight);
    }

    setupEventListeners() {
        // Mouse movement
        this.container.addEventListener('mousemove', (event) => {
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            this.targetRotation.x = this.mouse.y * 0.3;
            this.targetRotation.y = this.mouse.x * 0.3;
        });
        
        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // Rotação suave do globo
        if (this.wireframe) {
            // Interpolação suave para seguir o mouse
            this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.05;
            this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.05;
            
            this.wireframe.rotation.x = this.currentRotation.x + time * 0.1;
            this.wireframe.rotation.y = this.currentRotation.y + time * 0.15;
        }
        
        // Animação das partículas
        if (this.particles) {
            this.particles.rotation.x = time * 0.05;
            this.particles.rotation.y = time * 0.08;
        }
        
        // Animação das partículas globais
        if (this.globalParticles) {
            this.globalParticles.rotation.x = time * 0.02;
            this.globalParticles.rotation.y = time * 0.03;
            
            // Movimento vertical sutil
            this.globalParticles.position.y = Math.sin(time * 0.5) * 0.5;
        }
        
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('webgl-container')) {
        window.webglScene = new WebGLScene('webgl-container');
    }
});

