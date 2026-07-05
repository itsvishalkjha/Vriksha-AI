/* ==========================================================================
   vriksha.ai Application Script (Restored Premium Scrollytelling Layout)
   Animations: GSAP, ScrollTrigger, Google Sheets REST API, Particle Canvas,
               Magnetic Micro-interactions, Admin Local Registry Dashboard
   ========================================================================== */

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// --------------------------------------------------------------------------
// 0. Configuration & Global Variables (Easily Customizable)
// --------------------------------------------------------------------------
// PLACEHOLDER URL: Replace with your deployed Google Apps Script Web App URL
const GOOGLE_SHEET_URL = ''; 

const LOCAL_STORAGE_KEY = 'vriksha_waitlist_emails';
const DEFAULT_WAITLIST_COUNT = 1420;

// Initialize app when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    animateHeroEntrance();
    initParticleCanvas();
    initMagneticButtons();
    initHeroParallax();
    initScrollTriggerAnimations();
    initFaqAccordion();
    initWaitlistCounter();
    setupAdminConsole();
});

/* --------------------------------------------------------------------------
   1. Custom Cursor Follower
   -------------------------------------------------------------------------- */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const dot = document.querySelector('.custom-cursor-dot');
    
    if (!cursor || !dot) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        gsap.set(dot, { x: mouseX, y: mouseY });
    });

    gsap.ticker.add(() => {
        const dt = 1.0 - Math.exp(-0.2); // Interpolation speed
        cursorX += (mouseX - cursorX) * dt;
        cursorY += (mouseY - cursorY) * dt;
        gsap.set(cursor, { x: cursorX, y: cursorY });
    });

    // Handle hover states
    const hoverables = document.querySelectorAll('a, button, input, .magnetic-btn, .faq-question, #logo-trigger');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
            gsap.to(dot, { scale: 2, backgroundColor: '#093426', duration: 0.2 });
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
            gsap.to(dot, { scale: 1, backgroundColor: '#B89B72', duration: 0.2 });
        });
    });
}

function animateHeroEntrance() {
    gsap.timeline()
        .from('.app-header', { y: -30, opacity: 0, duration: 1, ease: 'power3.out' })
        .from('.hero-eyebrow', { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.7')
        .from('.hero-title', { y: 40, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.6')
        .from('.hero-description', { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.8')
        .from('.waitlist-form-container', { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6')
        .from('.hero-graphic-block', { scale: 0.9, opacity: 0, duration: 1.2, ease: 'power3.out' }, '-=1.0')
        .from('.hero-scroll-indicator', { opacity: 0, y: -10, duration: 0.6 }, '-=0.4');
}

/* --------------------------------------------------------------------------
   3. Dynamic Bio-Digital Canvas Particle Network
   -------------------------------------------------------------------------- */
function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 100 };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.type = Math.random() > 0.15 ? 'leaf' : 'node';
            this.size = this.type === 'leaf' ? Math.random() * 6 + 3 : Math.random() * 3 + 1;
            this.speedX = Math.random() * 0.6 + 0.2; // drift rightward
            this.speedY = Math.random() * 0.4 + 0.1; // drift downward
            this.color = this.type === 'leaf' ? 'rgba(83, 117, 99, 0.25)' : 'rgba(9, 52, 38, 0.12)';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Wrap around boundaries for smooth floating effect
            if (this.x > canvas.width + 10) {
                this.x = -10;
                this.y = Math.random() * canvas.height;
            }
            if (this.y > canvas.height + 10) {
                this.y = -10;
                this.x = Math.random() * canvas.width;
            }
            if (this.y < -10) this.y = canvas.height + 10;

            if (mouse.x != null && mouse.y != null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    let force = (mouse.radius - distance) / mouse.radius;
                    let angle = Math.atan2(dy, dx);
                    // Push particles away gently from cursor
                    this.x += Math.cos(angle) * force * 1.5;
                    this.y += Math.sin(angle) * force * 1.5;
                }
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            
            if (this.type === 'node') {
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Floating organic leaf shape
                ctx.moveTo(this.x, this.y - this.size * 2);
                ctx.quadraticCurveTo(this.x + this.size * 1.5, this.y, this.x, this.y + this.size * 2);
                ctx.quadraticCurveTo(this.x - this.size * 1.5, this.y, this.x, this.y - this.size * 2);
                ctx.fill();
            }
        }
    }

    const particleCount = Math.min(120, Math.floor((canvas.width * canvas.height) / 12000));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 140) {
                    opacityValue = 1 - (distance / 140);
                    ctx.strokeStyle = `rgba(83, 117, 99, ${opacityValue * 0.12})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

/* --------------------------------------------------------------------------
   4. Magnetic Hover Buttons (Friction pull)
   -------------------------------------------------------------------------- */
function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.35,
                y: y * 0.35,
                duration: 0.3,
                ease: 'power2.out'
            });

            const btnText = btn.querySelector('span');
            if (btnText) {
                gsap.to(btnText, {
                    x: x * 0.15,
                    y: y * 0.15,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
            
            const btnIcon = btn.querySelector('svg');
            if (btnIcon) {
                gsap.to(btnIcon, {
                    x: x * 0.2,
                    y: y * 0.2,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
            const btnText = btn.querySelector('span');
            if (btnText) gsap.to(btnText, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
            const btnIcon = btn.querySelector('svg');
            if (btnIcon) gsap.to(btnIcon, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
        });
    });
}

/* --------------------------------------------------------------------------
   5. Hero Parallax
   -------------------------------------------------------------------------- */
function initHeroParallax() {
    const target = document.getElementById('parallax-target');
    const container = document.getElementById('scene-container');
    
    if (!target || !container) return;

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left - rect.width / 2;
        const mouseY = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(target, {
            rotationY: mouseX * 0.04,
            rotationX: -mouseY * 0.04,
            x: mouseX * 0.05,
            y: mouseY * 0.05,
            transformPerspective: 1000,
            duration: 0.6,
            ease: 'power2.out'
        });
    });

    container.addEventListener('mouseleave', () => {
        gsap.to(target, {
            rotationY: 0,
            rotationX: 0,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
    });
}

/* --------------------------------------------------------------------------
   6. GSAP ScrollTrigger timelines (Restored Scrollytelling)
   -------------------------------------------------------------------------- */
function initScrollTriggerAnimations() {
    const track = document.getElementById('horizontal-track');
    const pinContainer = document.getElementById('horizontal-pin');
    
    if (track && pinContainer) {
        let pinTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '#about',
                pin: true,
                start: 'top top',
                end: () => '+=' + track.offsetWidth,
                scrub: 1,
                anticipatePin: 1,
                invalidateOnRefresh: true
            }
        });

        // Translate horizontally
        pinTimeline.to(track, {
            x: () => -(track.offsetWidth - window.innerWidth),
            ease: 'none'
        });

        // Slide reveals for panels
        const panels = document.querySelectorAll('.pillar-panel');
        panels.forEach((panel) => {
            const num = panel.querySelector('.panel-num');
            const details = panel.querySelector('.panel-details');
            const illustration = panel.querySelector('.panel-illustration');

            gsap.timeline({
                scrollTrigger: {
                    trigger: panel,
                    containerAnimation: pinTimeline,
                    start: 'left center',
                    toggleActions: 'play none none reverse'
                }
            })
            .from(num, { opacity: 0, y: -50, scale: 0.8, duration: 0.8, ease: 'power2.out' })
            .from(illustration, { opacity: 0, scale: 0.85, rotation: -5, duration: 0.8, ease: 'back.out(1.2)' }, '-=0.6')
            .from(details, { opacity: 0, x: 50, duration: 0.8, ease: 'power2.out' }, '-=0.6');
        });
    }

    // Scroll reveal cards
    const reveals = document.querySelectorAll('.scroll-reveal');
    reveals.forEach(el => {
        gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });
}

/* --------------------------------------------------------------------------
   7. FAQ Accordions
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all
            faqItems.forEach(i => {
                i.classList.remove('active');
                const ans = i.querySelector('.faq-answer');
                if (ans) ans.style.maxHeight = null;
            });

            // Toggle
            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                if (answer) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            }
        });
    });
}

/* --------------------------------------------------------------------------
   8. Waitlist form submittals & Google Sheet sync
   -------------------------------------------------------------------------- */
function initWaitlistCounter() {
    const counterEl = document.getElementById('waitlist-counter');
    if (!counterEl) return;

    const currentCount = getWaitlistData().length;
    const totalCount = DEFAULT_WAITLIST_COUNT + currentCount;
    
    gsap.from(counterEl, {
        textContent: 0,
        duration: 2.2,
        snap: { textContent: 1 },
        ease: 'power3.out',
        onUpdate: function() {
            counterEl.textContent = Math.floor(this.targets()[0].textContent).toLocaleString();
        }
    });
}

function getWaitlistData() {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveWaitlistData(data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}

function handleWaitlistSubmit(event) {
    event.preventDefault();
    const emailInput = document.getElementById('user-email');
    const feedbackMsg = document.getElementById('feedback-msg');
    
    if (!emailInput || !feedbackMsg) return;

    processSubmission(emailInput.value, feedbackMsg, () => {
        emailInput.value = '';
    });
}

function handleWaitlistSubmitBottom(event) {
    event.preventDefault();
    const emailInput = document.getElementById('user-email-bottom');
    const feedbackMsg = document.getElementById('feedback-msg-bottom');
    
    if (!emailInput || !feedbackMsg) return;

    processSubmission(emailInput.value, feedbackMsg, () => {
        emailInput.value = '';
    });
}

function processSubmission(email, feedbackEl, successCallback) {
    const sanitizedEmail = email.trim().toLowerCase();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
        showFeedback(feedbackEl, 'Please enter a valid corporate email address.', 'error');
        return;
    }

    const waitlist = getWaitlistData();
    const emailExists = waitlist.some(entry => entry.email === sanitizedEmail);
    if (emailExists) {
        showFeedback(feedbackEl, 'This email is already in our database.', 'error');
        return;
    }

    const payload = {
        email: sanitizedEmail,
        timestamp: new Date().toISOString()
    };
    
    // Save locally
    waitlist.push(payload);
    saveWaitlistData(waitlist);

    // Update global visual counters
    const counterEl = document.getElementById('waitlist-counter');
    if (counterEl) {
        const currentVal = parseInt(counterEl.textContent.replace(/,/g, ''));
        gsap.to(counterEl, {
            textContent: currentVal + 1,
            duration: 0.8,
            snap: { textContent: 1 },
            onUpdate: function() {
                counterEl.textContent = Math.floor(this.targets()[0].textContent).toLocaleString();
            }
        });
    }

    showFeedback(feedbackEl, 'Successfully registered for early access!', 'success');
    successCallback();
}

function showFeedback(el, msg, type) {
    el.textContent = msg;
    el.className = `form-feedback ${type}`;
    gsap.fromTo(el, { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 });
}

/* --------------------------------------------------------------------------
   9. Sheet Connection Setup Modal Guide
   -------------------------------------------------------------------------- */
// setupModal functions removed as database is purely local

/* --------------------------------------------------------------------------
   10. Administrative Access Dashboard Modal
   -------------------------------------------------------------------------- */
function setupAdminConsole() {
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyA') {
            e.preventDefault();
            openAdminDashboard();
        }
    });
}

function openAdminDashboard(e) {
    if (e) e.preventDefault();
    const modal = document.getElementById('admin-modal');
    if (!modal) return;

    modal.classList.add('active');
    gsap.from('#admin-modal .modal-card', { scale: 0.9, opacity: 0, y: 30, duration: 0.4, ease: 'back.out(1.2)' });
    
    document.getElementById('admin-auth-screen').style.display = 'flex';
    document.getElementById('admin-console-screen').style.display = 'none';
    document.getElementById('admin-username').value = '';
    document.getElementById('admin-password').value = '';
    document.getElementById('auth-err-msg').style.display = 'none';
}

function closeAdminDashboard() {
    const modal = document.getElementById('admin-modal');
    if (!modal) return;

    gsap.to('#admin-modal .modal-card', {
        scale: 0.9,
        opacity: 0,
        y: 30,
        duration: 0.25,
        onComplete: () => {
            modal.classList.remove('active');
        }
    });
}

function verifyAdminAuth() {
    const userVal = document.getElementById('admin-username').value.trim();
    const passVal = document.getElementById('admin-password').value;
    const errMsg = document.getElementById('auth-err-msg');
    
    if (userVal === 'admin' && (passVal === 'admin123' || passVal === 'admin')) {
        document.getElementById('admin-auth-screen').style.display = 'none';
        document.getElementById('admin-console-screen').style.display = 'block';
        renderWaitlistTable();
    } else {
        errMsg.textContent = 'Invalid credentials. Access Denied.';
        errMsg.style.display = 'block';
        gsap.fromTo('#admin-auth-screen', { x: -8 }, { x: 8, duration: 0.08, repeat: 5, yoyo: true });
    }
}

function renderWaitlistTable() {
    const tableBody = document.getElementById('waitlist-table-rows');
    if (!tableBody) return;

    const data = getWaitlistData();
    tableBody.innerHTML = '';

    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--color-text-muted);">No waitlist registrations found in storage.</td></tr>';
        return;
    }

    data.forEach((entry, idx) => {
        const row = document.createElement('tr');
        const formattedDate = new Date(entry.timestamp).toLocaleString();
        
        row.innerHTML = `
            <td>${idx + 1}</td>
            <td style="font-weight: 500;">${entry.email}</td>
            <td>${formattedDate}</td>
            <td><a href="#" class="btn-delete-row" onclick="deleteWaitlistEntry(${idx}, event)">Remove</a></td>
        `;
        tableBody.appendChild(row);
    });
}

function filterWaitlist() {
    const query = document.getElementById('console-search').value.toLowerCase();
    const rows = document.querySelectorAll('#waitlist-table-rows tr');
    
    rows.forEach(row => {
        const emailCell = row.querySelector('td:nth-child(2)');
        if (emailCell) {
            const emailText = emailCell.textContent.toLowerCase();
            row.style.display = emailText.includes(query) ? '' : 'none';
        }
    });
}

function deleteWaitlistEntry(index, event) {
    if (event) event.preventDefault();
    if (!confirm('Are you sure you want to delete this waitlist registration?')) return;

    let waitlist = getWaitlistData();
    waitlist.splice(index, 1);
    saveWaitlistData(waitlist);
    
    renderWaitlistTable();
    initWaitlistCounter();
}

function clearWaitlistData() {
    if (!confirm('CRITICAL ACTION: Delete all local registry entries?')) return;
    saveWaitlistData([]);
    renderWaitlistTable();
    initWaitlistCounter();
}

function exportWaitlistCSV() {
    const data = getWaitlistData();
    if (data.length === 0) {
        alert('Waitlist registration register is currently empty.');
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,Index,Corporate Email,Registration Date\r\n";
    
    data.forEach((entry, idx) => {
        csvContent += `${idx + 1},${entry.email},${entry.timestamp}\r\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vriksha_waitlist_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    link.click();
    document.body.removeChild(link);
}

/* --------------------------------------------------------------------------
   11. Helper Navigation
   -------------------------------------------------------------------------- */
function scrollToContent() {
    const nextSec = document.getElementById('about');
    if (nextSec) nextSec.scrollIntoView({ behavior: 'smooth' });
}

function scrollToWaitlist() {
    const ctaSec = document.getElementById('waitlist-register');
    if (ctaSec) ctaSec.scrollIntoView({ behavior: 'smooth' });
}
