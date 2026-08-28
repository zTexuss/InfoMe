let audioPlaying = false;
const videoBackground = document.getElementById('videoBackground');

if (videoBackground) {
    videoBackground.muted = true;
    videoBackground.volume = 0;
}

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

function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const clockElement = document.getElementById('digital-clock');
    if (clockElement) clockElement.textContent = timeString;
}

function createBubbles() {
    const container = document.getElementById('bubblesContainer');
    if (!container) return;

    const bubbleCount = isTouchDevice ? 30 : 60;

    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';

        const size = Math.random() * 8 + 3;
        bubble.style.width  = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left   = Math.random() * 100 + '%';
        bubble.style.animationDuration = (Math.random() * 8 + 6) + 's';
        bubble.style.animationDelay    = (Math.random() * 8) + 's';
        bubble.style.setProperty('--drift', ((Math.random() - 0.5) * 80) + 'px');

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
            backgroundMusic.volume = 0.5;
            backgroundMusic.play().catch(() => {});
        }

        setTimeout(() => {
            entryScreen.classList.add('hidden');
            mainContent.classList.remove('hidden');
            mainContent.classList.add('visible');
            animateMainContent();

            const volumeControl = document.getElementById('volumeControl');
            if (volumeControl) volumeControl.classList.add('visible');
        }, 500);
    }

    enterBtn.addEventListener('click', doEnter);
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
        element.style.opacity    = '0';
        element.style.transform  = 'translateY(20px)';
        element.style.transition = 'none';

        setTimeout(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity    = '1';
            element.style.transform  = 'translateY(0)';
        }, 300 + index * 150);
    });
}

function initializeSocialCards() {
    if (isTouchDevice) return;

    document.querySelectorAll('.social-btn').forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.social-icon');
            if (icon) {
                const r = (Math.random() - 0.5) * 30;
                icon.style.transform = `scale(1.2) rotate(${360 + r}deg)`;
            }
        });
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.social-icon');
            if (icon) icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

function initializeVolumeControl() {
    const control       = document.getElementById('volumeControl');
    const toggleBtn      = document.getElementById('volumeToggle');
    const icon           = document.getElementById('volumeIcon');
    const track          = document.getElementById('volumeTrack');
    const fill           = document.getElementById('volumeFill');
    const volumeDown     = document.getElementById('volumeDown');
    const volumeUp       = document.getElementById('volumeUp');
    const backgroundMusic = document.getElementById('backgroundMusic');

    if (!control || !toggleBtn || !icon || !track || !fill || !backgroundMusic) return;

    let currentVolume = 50;
    let lastVolume     = 50;
    let isDragging      = false;

    function updateIcon(value) {
        icon.className = value == 0
            ? 'fas fa-volume-mute'
            : value < 50
                ? 'fas fa-volume-down'
                : 'fas fa-volume-up';
    }

    function setVolume(value) {
        currentVolume = Math.round(Math.min(100, Math.max(0, value)));
        backgroundMusic.volume = currentVolume / 100;
        fill.style.width = currentVolume + '%';
        track.setAttribute('aria-valuenow', currentVolume);
        updateIcon(currentVolume);
        if (currentVolume > 0) lastVolume = currentVolume;
    }

    function valueFromClientX(clientX) {
        const rect = track.getBoundingClientRect();
        const ratio = (clientX - rect.left) / rect.width;
        return ratio * 100;
    }

    function expand() { control.classList.add('expanded'); }
    function collapse() { if (!isDragging) control.classList.remove('expanded'); }

    // Abre no hover (desktop) e continua aberto enquanto o mouse estiver em cima
    control.addEventListener('mouseenter', expand);
    control.addEventListener('mouseleave', collapse);
    control.addEventListener('focusin', expand);
    control.addEventListener('focusout', collapse);

    // Em touch (sem hover), tocar no controle abre o widget sem bloquear os controles.
    control.addEventListener('pointerdown', (e) => {
        if (e.target !== track && !track.contains(e.target)) expand();
    });

    // Toque fora do widget fecha ele de novo (relevante em touch)
    document.addEventListener('click', (e) => {
        if (!control.contains(e.target)) collapse();
    });

    // Arraste na trilha (mouse e touch)
    track.addEventListener('pointerdown', (e) => {
        isDragging = true;
        control.classList.add('active');
        track.setPointerCapture(e.pointerId);
        track.focus();
        setVolume(valueFromClientX(e.clientX));
    });

    track.addEventListener('click', (e) => {
        setVolume(valueFromClientX(e.clientX));
    });

    track.addEventListener('wheel', (e) => {
        e.preventDefault();
        setVolume(currentVolume + (e.deltaY < 0 ? 5 : -5));
    }, { passive: false });

    track.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        setVolume(valueFromClientX(e.clientX));
    });

    function endDrag(e) {
        if (!isDragging) return;
        isDragging = false;
        control.classList.remove('active');
        if (e?.pointerId !== undefined) {
            try { track.releasePointerCapture(e.pointerId); } catch (_) {}
        }
        if (!control.matches(':hover')) control.classList.remove('expanded');
    }
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);

    // Teclado (acessibilidade): setas ajustam o volume
    track.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault();
            setVolume(currentVolume + 5);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault();
            setVolume(currentVolume - 5);
        }
    });

    toggleBtn.addEventListener('click', () => {
        if (currentVolume > 0) {
            lastVolume = currentVolume;
            setVolume(0);
        } else {
            setVolume(lastVolume || 30);
        }
    });

    volumeDown.addEventListener('click', () => setVolume(currentVolume - 10));
    volumeUp.addEventListener('click', () => setVolume(currentVolume + 10));

    setVolume(lastVolume);
}

function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        const entryScreen = document.getElementById('entry-screen');
        const mainContent = document.getElementById('main-content');

        if (e.key === 'Enter' && entryScreen && !entryScreen.classList.contains('hidden')) {
            document.getElementById('enter-btn')?.click();
        }

        if (e.key === 'Escape' && entryScreen?.classList.contains('hidden')) {
            mainContent.classList.remove('visible');
            mainContent.classList.add('hidden');

            const backgroundMusic = document.getElementById('backgroundMusic');
            if (backgroundMusic) {
                backgroundMusic.pause();
                backgroundMusic.currentTime = 0;
            }

            document.getElementById('volumeControl')?.classList.remove('visible');

            setTimeout(() => { entryScreen.classList.remove('hidden'); }, 50);
        }
    });
}

function addGlitchEffect() {
    document.querySelectorAll('.main-title, .entry-title').forEach(title => {
        if (Math.random() < 0.05) {
            const original = title.style.filter;
            title.style.filter = 'drop-shadow(2px 0 #ff1493) drop-shadow(-2px 0 #8a2be2)';
            setTimeout(() => { title.style.filter = original; }, 100);
        }
    });
}

function initializeMouseEffects() {
    if (isTouchDevice) return;

    const container = document.querySelector('.container');
    if (!container) return;

    document.addEventListener('mousemove', (e) => {
        const mainContent = document.getElementById('main-content');
        if (!mainContent?.classList.contains('visible')) return;

        const rect    = container.getBoundingClientRect();
        const deltaX  = (e.clientX - (rect.left + rect.width  / 2)) / rect.width;
        const deltaY  = (e.clientY - (rect.top  + rect.height / 2)) / rect.height;

        container.classList.add('mouse-active');
        container.style.transform = `
            translateY(-15px)
            perspective(1000px)
            rotateX(${-deltaY * 3}deg)
            rotateY(${deltaX * 3}deg)
        `;
    });

    document.addEventListener('mouseleave', () => {
        container.classList.remove('mouse-active');
        container.style.transform = '';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 1000);

    createBubbles();
    initializeCursor();
    initializeEntryScreen();
    initializeSocialCards();
    initializeMouseEffects();
    initializeKeyboardShortcuts();
    initializeVolumeControl();

    setInterval(addGlitchEffect, 5000);

    setTimeout(() => { document.body.style.transition = 'all 0.3s ease'; }, 1000);
});

window.addEventListener('load', () => {
    document.querySelectorAll('img').forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => img.classList.add('loaded'));
        }
    });
});

window.addEventListener('unhandledrejection', (event) => {
    const message = typeof event.reason === 'string' ? event.reason : event.reason?.message;
    if (typeof message === 'string' && message.includes('message channel closed before a response was received')) {
        event.preventDefault();
    }
});
