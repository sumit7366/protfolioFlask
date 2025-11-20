class ParticleSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        const container = document.getElementById('particles-js');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        container.appendChild(this.canvas);

        this.resize();
        this.createParticles();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const isNight = document.documentElement.getAttribute('data-theme') === 'night';
        const particleCount = isNight ? 200 : 50;
        
        this.particles = [];
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * (isNight ? 3 : 2) + 1,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                opacity: Math.random() * 0.5 + 0.2,
                twinkle: Math.random() * 0.05
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const isNight = document.documentElement.getAttribute('data-theme') === 'night';
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off walls
            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
            
            // Twinkle effect for night mode
            if (isNight) {
                particle.opacity += particle.twinkle;
                if (particle.opacity > 0.7 || particle.opacity < 0.2) {
                    particle.twinkle *= -1;
                }
            }
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = isNight ? 
                `rgba(255, 255, 255, ${particle.opacity})` :
                `rgba(37, 99, 235, ${particle.opacity})`;
            this.ctx.fill();
            
            // Draw connections for night mode
            if (isNight) {
                this.particles.forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance/150)})`;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.moveTo(particle.x, particle.y);
                        this.ctx.lineTo(otherParticle.x, otherParticle.y);
                        this.ctx.stroke();
                    }
                });
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Water effect class
class WaterEffect {
    constructor() {
        this.drops = [];
        this.canvas = document.querySelector('.water-effect');
        this.ctx = this.canvas.getContext('2d');
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => this.createRipple(e));
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createRipple(e) {
        const isNight = document.documentElement.getAttribute('data-theme') === 'night';
        if (!isNight) return;

        this.drops.push({
            x: e.clientX,
            y: e.clientY,
            radius: 0,
            maxRadius: 100,
            opacity: 0.5
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drops.forEach((drop, index) => {
            drop.radius += 2;
            drop.opacity -= 0.02;
            
            if (drop.opacity <= 0) {
                this.drops.splice(index, 1);
                return;
            }
            
            this.ctx.beginPath();
            this.ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(96, 165, 250, ${drop.opacity})`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const particleSystem = new ParticleSystem();
    const waterEffect = new WaterEffect();
    waterEffect.animate();
    
    // Recreate particles when theme changes
    const observer = new MutationObserver(() => {
        particleSystem.createParticles();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
});