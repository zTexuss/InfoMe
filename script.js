// Audio Control
let audioPlaying = false;
const videoBackground = document.getElementById('videoBackground');

// Mute video audio if exists
if (videoBackground) {
    videoBackground.muted = true;
    videoBackground.volume = 0;
}

// Digital Clock
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const clockElement = document.getElementById('digital-clock');
    if (clockElement) {
        clockElement.textContent = timeString;
    }
}

// Create floating bubbles
function createBubbles() {
    const container = document.getElementById('bubblesContainer');
    if (!container) return;
    
    const bubbleCount = 60;

    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        // Random size
        const size = Math.random() * 8 + 3;
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = Math.random() * 100 + '%';
        
        // Random animation duration
        const duration = Math.random() * 8 + 6;
        bubble.style.animationDuration = duration + 's';
        
        // Random delay
        const delay = Math.random() * 8;
        bubble.style.animationDelay = delay + 's';
        
        // Random horizontal drift
        const drift = (Math.random() - 0.5) * 80;
        bubble.style.setProperty('--drift', drift + 'px');
        
        container.appendChild(bubble);
    }
}

// Entry screen functionality - CORRIGIDO
function initializeEntryScreen() {
    const entryScreen = document.getElementById('entry-screen');
    const mainContent = document.getElementById('main-content');
    const enterBtn = document.getElementById('enter-btn');
    
    if (!enterBtn || !entryScreen || !mainContent) {
        return;
    }
    
    enterBtn.addEventListener('click', () => {
        // Add click effect
        enterBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            enterBtn.style.transform = 'scale(1.05)';
        }, 100);

        // Start background music
        const backgroundMusic = document.getElementById('backgroundMusic');
        if (backgroundMusic) {
            backgroundMusic.volume = 0.3;
            backgroundMusic.play().catch(error => {
                // Autoplay prevented
            });
        }

        // Hide entry screen and show main content
        setTimeout(() => {
            entryScreen.classList.add('hidden');
            mainContent.classList.remove('hidden');
            mainContent.classList.add('visible');
            document.body.style.overflow = 'auto';
            animateMainContent();
        }, 500);
    });
}

// Animate main content elements - CORRIGIDO
function animateMainContent() {
    const container = document.querySelector('.container');
    if (!container) return;
    
    const elements = container.querySelectorAll('.header, .clock-container, .social-links, .creator-tag');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

// Social cards hover effects
function initializeSocialCards() {
    const socialCards = document.querySelectorAll('.social-btn');
    
    socialCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add rotation to icon
            const icon = card.querySelector('.social-icon');
            if (icon) {
                const randomRotation = (Math.random() - 0.5) * 30;
                icon.style.transform = `scale(1.2) rotate(${360 + randomRotation}deg)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.social-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

// Keyboard shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        const entryScreen = document.getElementById('entry-screen');
        const mainContent = document.getElementById('main-content');
        
        // Enter key to skip entry screen
        if (e.key === 'Enter' && !entryScreen.classList.contains('hidden')) {
            const enterBtn = document.getElementById('enter-btn');
            if (enterBtn) enterBtn.click();
        }
        
        // ESC key to return to entry screen
        if (e.key === 'Escape' && entryScreen.classList.contains('hidden')) {
            entryScreen.classList.remove('hidden');
            mainContent.classList.add('hidden');
            mainContent.classList.remove('visible');
            document.body.style.overflow = 'hidden';
        }
    });
}

// Glitch effect for title (occasional) - CORRIGIDO
function addGlitchEffect() {
    const titles = document.querySelectorAll('.main-title, .entry-title');
    
    titles.forEach(title => {
        // Random chance of glitch effect
        if (Math.random() < 0.05) {
            const originalFilter = title.style.filter;
            
            title.style.filter = `
                drop-shadow(2px 0 #ff1493) 
                drop-shadow(-2px 0 #8a2be2)
            `;
            
            setTimeout(() => {
                title.style.filter = originalFilter;
            }, 100);
        }
    });
}

// Performance optimization with Intersection Observer
function initializeObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe animatable elements
    document.querySelectorAll('.social-btn, .clock-container, .header').forEach(el => {
        observer.observe(el);
    });
}

// Add mouse movement parallax effect - CORRIGIDO
function initializeMouseEffects() {
    const container = document.querySelector('.container');
    
    if (!container) return;
    
    document.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) / rect.width;
        const deltaY = (e.clientY - centerY) / rect.height;
        
        const rotateX = deltaY * 3;
        const rotateY = deltaX * 3;
        
        container.style.transform = `
            translateY(-15px) 
            perspective(1000px) 
            rotateX(${-rotateX}deg) 
            rotateY(${rotateY}deg)
        `;
    });
    
    // Reset on mouse leave
    container.addEventListener('mouseleave', () => {
        container.style.transform = 'translateY(-15px) perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Start clock update
    updateClock();
    setInterval(updateClock, 1000);
    
    // Create floating bubbles
    createBubbles();
    
    // Initialize components
    initializeEntryScreen();
    initializeSocialCards();
    initializeMouseEffects();
    initializeKeyboardShortcuts();
    initializeObserver();
    
    // Add occasional glitch effect
    setInterval(addGlitchEffect, 5000);
    
    // Smooth transitions after load
    setTimeout(() => {
        document.body.style.transition = 'all 0.3s ease';
    }, 1000);
});

// Window load optimizations
window.addEventListener('load', () => {
    // Preload images and optimize
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
    });
});