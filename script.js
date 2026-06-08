// Audio Control
let audioPlaying = false;
const videoBackground = document.getElementById('videoBackground');

// Mute video audio if exists
if (videoBackground) {
    videoBackground.muted = true;
    videoBackground.volume = 0;
}

// Só ativa em dispositivos com mouse
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

function initializeCursor() {
    if (isTouchDevice) return;

    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    cursor.style.display = 'block';

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top  = e.clientY + 'px';
    });

    const hoverTargets = 'a, button, .social-btn, .enter-btn, [role="button"]';
    document.querySelectorAll(hoverTargets).forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });

    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
}

    // Hover em elementos clicáveis
    const hoverTargets = 'a, button, .social-btn, .enter-btn, [role="button"]';
    document.querySelectorAll(hoverTargets).forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });
    
    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
}

    // Esconde cursor quando sai da janela
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });
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

    // Menos bolhas em mobile para performance
    const bubbleCount = isTouchDevice ? 30 : 60;

    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';

        const size = Math.random() * 8 + 3;
        bubble.style.width  = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left   = Math.random() * 100 + '%';

        const duration = Math.random() * 8 + 6;
        bubble.style.animationDuration = duration + 's';

        const delay = Math.random() * 8;
        bubble.style.animationDelay = delay + 's';

        const drift = (Math.random() - 0.5) * 80;
        bubble.style.setProperty('--drift', drift + 'px');

        container.appendChild(bubble);
    }
}

function initializeEntryScreen() {
    const entryScreen = document.getElementById('entry-screen');
    const mainContent = document.getElementById('main-content');
    const enterBtn    = document.getElementById('enter-btn');

    if (!enterBtn || !entryScreen || !mainContent) return;

    function doEnter() {
        enterBtn.style.transform = 'scale(0.95)';
        setTimeout(() => { enterBtn.style.transform = 'scale(1.05)'; }, 100);

        const backgroundMusic = document.getElementById('backgroundMusic');
        if (backgroundMusic) {
            backgroundMusic.volume = 0.3;
            backgroundMusic.play().catch(() => {});
        }

        setTimeout(() => {
            entryScreen.classList.add('hidden');
            mainContent.classList.remove('hidden');
            mainContent.classList.add('visible');
            animateMainContent();
        }, 500);
    }

    enterBtn.addEventListener('click', doEnter);

    // Suporte a toque (evita duplo disparo com click em iOS)
    enterBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        doEnter();
    }, { passive: false });
}

function animateMainContent() {
    const container = document.querySelector('.container');
    if (!container) return;

    const elements = container.querySelectorAll('.header, .clock-container, .social-links, .creator-tag');
    elements.forEach((element, index) => {
        element.style.opacity   = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'none';

        setTimeout(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity    = '1';
            element.style.transform  = 'translateY(0)';
        }, 300 + index * 150);
    });
}

// Social cards hover effects (só desktop)
function initializeSocialCards() {
    if (isTouchDevice) return;

    const socialCards = document.querySelectorAll('.social-btn');

    socialCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
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

        if (e.key === 'Enter' && entryScreen && !entryScreen.classList.contains('hidden')) {
            const enterBtn = document.getElementById('enter-btn');
            if (enterBtn) enterBtn.click();
        }

        if (e.key === 'Escape' && entryScreen && mainContent && entryScreen.classList.contains('hidden')) {
            mainContent.classList.remove('visible');
            mainContent.classList.add('hidden');

            const backgroundMusic = document.getElementById('backgroundMusic');
            if (backgroundMusic) {
                backgroundMusic.pause();
                backgroundMusic.currentTime = 0;
            }

            setTimeout(() => { entryScreen.classList.remove('hidden'); }, 50);
        }
    });
}

// Glitch effect (occasional)
function addGlitchEffect() {
    const titles = document.querySelectorAll('.main-title, .entry-title');

    titles.forEach(title => {
        if (Math.random() < 0.05) {
            const originalFilter = title.style.filter;
            title.style.filter = `
                drop-shadow(2px 0 #ff1493)
                drop-shadow(-2px 0 #8a2be2)
            `;
            setTimeout(() => { title.style.filter = originalFilter; }, 100);
        }
    });
}

// Mouse 3D tilt effect — desativado em touch
function initializeMouseEffects() {
    if (isTouchDevice) return;

    const container = document.querySelector('.container');
    if (!container) return;

    document.addEventListener('mousemove', (e) => {
        const mainContent = document.getElementById('main-content');
        if (!mainContent || !mainContent.classList.contains('visible')) return;

        const rect    = container.getBoundingClientRect();
        const centerX = rect.left + rect.width  / 2;
        const centerY = rect.top  + rect.height / 2;

        const deltaX = (e.clientX - centerX) / rect.width;
        const deltaY = (e.clientY - centerY) / rect.height;

        const rotateX = deltaY * 3;
        const rotateY = deltaX * 3;

        container.classList.add('mouse-active');
        container.style.transform = `
            translateY(-15px)
            perspective(1000px)
            rotateX(${-rotateX}deg)
            rotateY(${rotateY}deg)
        `;
    });

    document.addEventListener('mouseleave', () => {
        container.classList.remove('mouse-active');
        container.style.transform = '';
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 1000);

    createBubbles();

    initializeCursor();
    initializeEntryScreen();
    initializeSocialCards();
    initializeMouseEffects();
    initializeKeyboardShortcuts();

    setInterval(addGlitchEffect, 5000);

    setTimeout(() => {
        document.body.style.transition = 'all 0.3s ease';
    }, 1000);
});

// Window load optimizations
window.addEventListener('load', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => { img.classList.add('loaded'); });
        }
    });
});

// Ignore noisy extension messaging errors
window.addEventListener('unhandledrejection', (event) => {
    const reason  = event.reason;
    const message = typeof reason === 'string' ? reason : reason?.message;
    if (typeof message === 'string' && message.includes('message channel closed before a response was received')) {
        event.preventDefault();
    }
});
