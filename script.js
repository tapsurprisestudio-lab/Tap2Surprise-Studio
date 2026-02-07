/**
 * Tap2Surprise Studio - Premium Valentine Demo
 * Main JavaScript File
 */

// ============================================
// DOM Elements
// ============================================
const pages = {
    page1: document.getElementById('page1'),
    page2: document.getElementById('page2'),
    gift1: document.getElementById('gift1'),
    gift2: document.getElementById('gift2'),
    gift3: document.getElementById('gift3'),
    page3: document.getElementById('page3')
};

const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const soundToggle = document.getElementById('soundToggle');
const bgMusic = document.getElementById('bgMusic');
const particles = document.getElementById('particles');
const confettiCanvas = document.getElementById('confetti');
const progressCount = document.getElementById('progressCount');
const energyPercent = document.getElementById('energyPercent');
const resultMessage = document.getElementById('resultMessage');
const portfolioSection = document.getElementById('portfolioSection');
const viewPortfolio = document.getElementById('viewPortfolio');
const toFinalCta = document.getElementById('toFinalCta');
const letterText = document.getElementById('letterText');
const giftCards = document.querySelectorAll('.gift-card');
const backBtns = document.querySelectorAll('.back-btn');

// ============================================
// State
// ============================================
let unlockedGifts = new Set();
let audioEnabled = true;
let noButtonInterval = null;
let isNoButtonMoving = false;
let typingInterval = null;

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNoButton();
    initEventListeners();
    updateProgress();
});

// ============================================
// Particles System
// ============================================
function initParticles() {
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        createParticle(i);
    }
}

function createParticle(index) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (6 + Math.random() * 4) + 's';
    particles.appendChild(particle);
}

// ============================================
// NO Button Behavior
// ============================================
function initNoButton() {
    // Move button every 1.2 seconds
    noButtonInterval = setInterval(moveNoButtonRandomly, 1200);

    // Mouse/touch approach detection
    noBtn.addEventListener('mouseenter', handleNoButtonApproach);
    noBtn.addEventListener('touchstart', handleNoButtonApproach, { passive: false });
}

function handleNoButtonApproach(e) {
    e.preventDefault();
    moveNoButtonRandomly();

    // Add subtle scale effect
    const scale = 0.8 + Math.random() * 0.4;
    noBtn.style.transform = `scale(${scale})`;

    setTimeout(() => {
        noBtn.style.transform = '';
    }, 200);
}

function moveNoButtonRandomly() {
    const container = document.querySelector('.button-container');
    const containerRect = container.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    // Calculate safe margins
    const padding = 20;
    const maxX = window.innerWidth - btnRect.width - padding;
    const maxY = window.innerHeight - btnRect.height - 100; // Leave space for footer

    // Get the button container position
    const containerCenterX = containerRect.left + containerRect.width / 2;
    const containerCenterY = containerRect.top + containerRect.height / 2;

    // Generate new position away from container center
    let newX, newY;
    let attempts = 0;
    const maxAttempts = 10;

    do {
        newX = Math.random() * maxX;
        newY = Math.random() * maxY;
        attempts++;
    } while (
        attempts < maxAttempts &&
        isNearPosition(newX, newY, containerCenterX - btnRect.width / 2, containerCenterY - btnRect.height / 2, 120)
    );

    // Apply smooth movement
    noBtn.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    noBtn.style.position = 'fixed';
    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';
    noBtn.style.zIndex = '100';
}

function isNearPosition(x1, y1, x2, y2, threshold) {
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    return distance < threshold;
}

// ============================================
// YES Button - Success Action
// ============================================
yesBtn.addEventListener('click', handleYesClick);

function handleYesClick() {
    // Add pulse animation
    yesBtn.classList.add('pulse-animation');

    // Confetti burst
    triggerConfetti();

    // Hide NO button
    if (noButtonInterval) {
        clearInterval(noButtonInterval);
    }
    noBtn.style.opacity = '0';
    noBtn.style.pointerEvents = 'none';

    // Show sound toggle
    soundToggle.classList.remove('hidden');
    soundToggle.classList.add('visible');

    // Start audio
    startAudio();

    // Transition to page 2 after delay
    setTimeout(() => {
        showPage('page2');
    }, 1500);
}

// ============================================
// Audio System
// ============================================
function startAudio() {
    if (bgMusic) {
        bgMusic.volume = 0.3;
        bgMusic.play().catch(() => {
            console.log('Audio autoplay blocked - user must interact first');
        });
    }
}

function toggleAudio() {
    if (bgMusic.paused) {
        bgMusic.play();
        audioEnabled = true;
        soundToggle.innerHTML = '<span class="sound-icon">🔊</span>';
    } else {
        bgMusic.pause();
        audioEnabled = false;
        soundToggle.innerHTML = '<span class="sound-icon">🔇</span>';
    }
}

soundToggle.addEventListener('click', toggleAudio);

// ============================================
// Confetti System
// ============================================
const confettiCtx = confettiCanvas.getContext('2d');
let confettiParticles = [];

function triggerConfetti() {
    resizeConfettiCanvas();

    const colors = ['#E8A5B3', '#D4A59A', '#F5C6CB', '#FFF', '#E8D5E0'];
    const shapes = ['circle', 'square'];

    for (let i = 0; i < 50; i++) {
        confettiParticles.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            vx: (Math.random() - 0.5) * 15,
            vy: (Math.random() - 0.5) * 15 - 5,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            life: 1,
            decay: 0.015 + Math.random() * 0.01
        });
    }

    animateConfetti();
}

function resizeConfettiCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}

function animateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confettiParticles = confettiParticles.filter(p => p.life > 0);

    confettiParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3; // gravity
        p.rotation += p.rotationSpeed;
        p.life -= p.decay;

        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate(p.rotation * Math.PI / 180);
        confettiCtx.globalAlpha = p.life;
        confettiCtx.fillStyle = p.color;

        if (p.shape === 'circle') {
            confettiCtx.beginPath();
            confettiCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            confettiCtx.fill();
        } else {
            confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        }

        confettiCtx.restore();
    });

    if (confettiParticles.length > 0) {
        requestAnimationFrame(animateConfetti);
    }
}

// ============================================
// Page Navigation
// ============================================
function showPage(pageId) {
    // Hide all pages
    Object.values(pages).forEach(page => {
        if (page) {
            page.classList.remove('active');
        }
    });

    // Show target page
    const targetPage = pages[pageId];
    if (targetPage) {
        targetPage.classList.add('active');

        // Scroll to top
        targetPage.scrollTop = 0;
    }
}

// ============================================
// Gift Cards
// ============================================
giftCards.forEach(card => {
    card.addEventListener('click', () => {
        const giftType = card.dataset.gift;

        // Mark as unlocked
        if (!unlockedGifts.has(giftType)) {
            unlockedGifts.add(giftType);
            updateProgress();
        }

        // Show appropriate gift page
        if (giftType === 'memory') {
            showPage('gift1');
        } else if (giftType === 'letter') {
            showPage('gift2');
            startTypingEffect();
        } else if (giftType === 'surprise') {
            showPage('gift3');
            startSurpriseCounter();
        }
    });
});

// Back buttons
backBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const backTarget = btn.dataset.back;
        showPage(backTarget);

        // Stop typing effect if going back from letter
        if (typingInterval) {
            clearInterval(typingInterval);
            letterText.textContent = '';
        }
    });
});

// ============================================
// Progress Tracker
// ============================================
function updateProgress() {
    const count = unlockedGifts.size;
    progressCount.textContent = count;
}

// ============================================
// Typing Effect for Letter
// ============================================
const letterContent = `I could've sent a normal message…
but that felt too easy.

So I built something interactive.
Something personal.
Something that feels like effort.

Because the best surprises are the ones you can experience.`;

function startTypingEffect() {
    letterText.textContent = '';
    let index = 0;
    let isComplete = false;

    // Allow instant display on tap
    document.getElementById('gift2').addEventListener('click', () => {
        if (!isComplete) {
            clearInterval(typingInterval);
            letterText.textContent = letterContent;
            isComplete = true;
        }
    }, { once: true });

    typingInterval = setInterval(() => {
        if (index < letterContent.length) {
            letterText.textContent = letterContent.substring(0, index + 1);
            index++;
        } else {
            clearInterval(typingInterval);
            isComplete = true;
        }
    }, 50);
}

// ============================================
// Surprise Mode Counter
// ============================================
let counterStarted = false;

function startSurpriseCounter() {
    if (counterStarted) return;
    counterStarted = true;

    resultMessage.classList.add('hidden');

    // Reset counter
    let percent = 0;
    energyPercent.textContent = percent;

    const duration = 3000; // 3 seconds
    const steps = 60;
    const increment = 100 / steps;
    const stepDuration = duration / steps;

    let step = 0;

    const counterInterval = setInterval(() => {
        step++;
        percent = Math.min(Math.round(increment * step), 1000);

        // Slow down at higher numbers
        if (percent > 500 && step % 2 !== 0) {
            return;
        }

        energyPercent.textContent = percent;

        // Add glow effect at milestones
        if (percent === 100 || percent === 500 || percent === 1000) {
            energyPercent.style.transform = 'scale(1.2)';
            setTimeout(() => {
                energyPercent.style.transform = 'scale(1)';
            }, 200);
        }

        if (step >= steps) {
            clearInterval(counterInterval);

            // Show result message
            setTimeout(() => {
                resultMessage.classList.remove('hidden');
            }, 300);
        }
    }, stepDuration);
}

// ============================================
// Event Listeners
// ============================================
function initEventListeners() {
    // Continue to Final CTA
    toFinalCta.addEventListener('click', () => {
        showPage('page3');
    });

    // View Portfolio toggle
    viewPortfolio.addEventListener('click', () => {
        portfolioSection.classList.toggle('hidden');

        // Smooth scroll to portfolio
        if (!portfolioSection.classList.contains('hidden')) {
            portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        resizeConfettiCanvas();
    });

    // Prevent horizontal scroll
    document.body.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches.length > 1) {
            // Allow pinch zoom but prevent horizontal pan
            return;
        }
    }, { passive: true });

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
}

// ============================================
// Utility Functions
// ============================================
// Show page from global scope (used in gift3)
window.showPage = showPage;

// Handle orientation change
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        resizeConfettiCanvas();
        // Reposition NO button if visible
        if (noBtn && noBtn.style.opacity !== '0') {
            noBtn.style.left = '';
            noBtn.style.top = '';
            noBtn.style.position = '';
            noBtn.style.transform = '';
        }
    }, 100);
});

// Prevent context menu on long press (mobile)
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        e.preventDefault();
    }
});

// Handle touch feedback on mobile
document.addEventListener('touchstart', (e) => {
    const target = e.target.closest('button');
    if (target) {
        target.classList.add('touch-active');
    }
}, { passive: true });

document.addEventListener('touchend', (e) => {
    document.querySelectorAll('.touch-active').forEach(btn => {
        btn.classList.remove('touch-active');
    });
});

// Add touch-active class styles dynamically
const style = document.createElement('style');
style.textContent = `
    .touch-active {
        transform: scale(0.95) !important;
    }
`;
document.head.appendChild(style);
