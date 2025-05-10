document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Initialize custom particles
    initParticles();

    // Theme toggle
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }

    // Scroll animations
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                const direction = entry.target.getAttribute('data-direction') || 'up';
                
                // Apply direction-specific transform before adding visible class
                if (direction === 'left') {
                    entry.target.style.transform = 'translateX(-30px)';
                } else if (direction === 'right') {
                    entry.target.style.transform = 'translateX(30px)';
                } else if (direction === 'up') {
                    entry.target.style.transform = 'translateY(30px)';
                } else if (direction === 'down') {
                    entry.target.style.transform = 'translateY(-30px)';
                }
                
                // Delay the animation based on data-delay attribute
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay * 1000);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Staggered animations for lists
    const skillLists = document.querySelectorAll('.skills-list');
    skillLists.forEach(list => {
        const badges = list.querySelectorAll('.skill-badge');
        badges.forEach((badge, index) => {
            badge.style.opacity = '0';
            badge.style.transform = 'translateY(20px)';
            setTimeout(() => {
                badge.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                badge.style.opacity = '1';
                badge.style.transform = 'translateY(0)';
            }, 100 + (index * 50));
        });
    });

    const factsList = document.querySelectorAll('.facts-list');
    factsList.forEach(list => {
        const items = list.querySelectorAll('.fact-item');
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease, background-color 0.2s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 100 + (index * 100));
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Custom particles implementation
function initParticles() {
    const canvas = document.getElementById('canvas-particles');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle settings
    const particleCount = 80;
    const particles = [];
    const primaryColor = '#3b82f6';
    const connectionDistance = 150;
    const mouseRadius = 120;
    
    // Mouse position
    let mouse = {
        x: null,
        y: null,
        radius: mouseRadius
    };
    
    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    
    // Create particles
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.baseSize = this.size;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = primaryColor;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        
        update() {
            // Move particles
            this.x += this.speedX;
            this.y += this.speedY  {
            // Move particles
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Bounce off edges
            if (this.x > canvas.width || this.x < 0) {
                this.speedX = -this.speedX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.speedY = -this.speedY;
            }
            
            // Mouse interaction
            if (mouse.x != null && mouse.y != null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    // Increase size when mouse is near
                    this.size = this.baseSize + 2;
                    
                    // Move away from mouse
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    
                    this.x -= forceDirectionX * force * 2;
                    this.y -= forceDirectionY * force * 2;
                } else {
                    // Return to original size
                    this.size = this.baseSize;
                }
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    
    // Initialize particles
    function init() {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Connect particles with lines
    function connect() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    // Draw line with opacity based on distance
                    const opacity = 1 - (distance / connectionDistance);
                    ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.2})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        
        connect();
        requestAnimationFrame(animate);
    }
    
    // Add particles on click
    canvas.addEventListener('click', function(event) {
        for (let i = 0; i < 3; i++) {
            const particle = new Particle();
            particle.x = event.x;
            particle.y = event.y;
            particles.push(particle);
            
            // Keep particle count manageable
            if (particles.length > 120) {
                particles.splice(0, 3);
            }
        }
    });
    
    // Start animation
    init();
    animate();
        }
