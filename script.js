// 1. SMOOTH SCROLL INTEGRATION (LENIS & GSAP)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// 2. LOADING SCREEN TERMINATION & INITIALIZATION
window.addEventListener('DOMContentLoaded', () => {
    const tl = gsap.timeline();
    tl.to('.loader-brand-block', { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
      .to('.loader-bar', { opacity: 1, duration: 0.3 }, "-=0.4")
      .to('.loader-progress', { width: "100%", duration: 1.4, ease: "power2.inOut" })
      .to('#preloader', { yPercent: -100, duration: 0.8, ease: "power4.inOut" })
      .from('.hero-bg', { scale: 1.2, duration: 2.5, ease: "power3.out" }, "-=0.6")
      .from('.hero-content h1', { opacity: 0, y: 50, duration: 1, ease: "power3.out" }, "-=1.8")
      .from('.hero-content p', { opacity: 0, y: 30, duration: 1, ease: "power3.out" }, "-=1.5")
      .from('.hero-btns', { opacity: 0, y: 20, duration: 1, ease: "power3.out" }, "-=1.2");

    // Initialize Form Event Listener
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleMailtoSubmit);
    }

    // Initialize Mobile Navigation System
    initMobileNavigation();
});

// Delay execution until layout updates are fully completed
window.addEventListener('load', () => {
    initScrollAnimations();
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 500);
});

// 3. TRANSPARENT STICKY NAVIGATION STYLES
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    // Scroll Progress Execution
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalScroll) * 100;
    const progressEl = document.getElementById('scroll-progress');
    if (progressEl) {
        progressEl.style.width = progress + '%';
    }
});

// 4. GSAP TIMELINE & STRUCTURAL SCROLL ACTION PATHWAYS
function initScrollAnimations() {
    document.querySelectorAll('.visual-reveal').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 80%",
            },
            scale: 0.98,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });
    });

    gsap.to('.timeline-progress', {
        scrollTrigger: {
            trigger: '.timeline',
            start: "top 30%",
            end: "bottom 70%",
            scrub: true
        },
        height: "100%",
        ease: "none"
    });

    // COUNTERS & STATISTICS
    gsap.utils.toArray('.counter-val').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        gsap.to(counter, {
            scrollTrigger: {
                trigger: counter,
                start: "top 90%",
            },
            innerText: target,
            duration: 1.8,
            snap: { innerText: 1 },
            ease: "power3.out"
        });
    });
}

// 5. RESIDENTIAL PORTFOLIO FILTERING
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const selector = btn.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            if (selector === 'all' || card.getAttribute('data-category') === selector) {
                gsap.to(card, { scale: 1, opacity: 1, duration: 0.4, display: 'block', ease: 'power2.out' });
            } else {
                gsap.to(card, { scale: 0.8, opacity: 0, duration: 0.4, display: 'none', ease: 'power2.out' });
            }
        });
        ScrollTrigger.refresh();
    });
});

// 6. HORIZONTAL TESTIMONIAL SCROLL INVERSION
if (document.querySelector("#testimonials") && document.querySelector(".testimonials-slider")) {
    gsap.to(".testimonials-slider", {
        scrollTrigger: {
            trigger: "#testimonials",
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => "+=" + document.querySelector(".testimonials-slider").scrollWidth
        },
        x: () => -(document.querySelector(".testimonials-slider").scrollWidth - window.innerWidth + 150),
        ease: "none"
    });
}

// 7. DIRECT MAILBOX SUBMISSION HANDLER
function handleMailtoSubmit(event) {
    event.preventDefault();

    const form = event.target;

    const name = form.querySelector('[name="name"]')?.value || '';
    const email = form.querySelector('[name="email"]')?.value || '';
    const message = form.querySelector('[name="message"]')?.value || '';

    const subject = encodeURIComponent(
        "New Design & Build Request | Al Fattah Construction"
    );

    const body = encodeURIComponent(
        `Al Fattah Construction Team,\n\n` +
        `You have received a new residential project inquiry:\n\n` +
        `----------------------------------------\n` +
        `• Client Name: ${name}\n` +
        `• Client Email: ${email}\n` +
        `----------------------------------------\n\n` +
        `Project / Maintenance Scale Details:\n` +
        `${message}\n\n` +
        `Sent directly from online corporate site portfolio.`
    );

    const mailtoURL =
        `mailto:info@alfattahconstruction.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoURL;
}

// 8. ENABLE ALL MAILTO LINKS SITE-WIDE
function initializeMailtoLinks() {
    const mailLinks = document.querySelectorAll('a[href^="mailto:"]');

    mailLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const href = this.getAttribute('href');

            if (href) {
                window.location.href = href;
            }
        });
    });
}

// 9. MOBILE NAVIGATION SYSTEM INTERACTION LOGIC
function initMobileNavigation() {
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            
            // Toggle hamburger icon to X close marker
            const icon = menuBtn.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.className = 'fa-solid fa-xmark';
                } else {
                    icon.className = 'fa-solid fa-bars';
                }
            }
        });

        // Close menu panel when any individual navigation page option link is clicked
        const singleLinks = navLinks.querySelectorAll('a');
        singleLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.className = 'fa-solid fa-bars';
                }
            });
        });

        // Close menu cleanly if user clicks anywhere outside the primary container workspace
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const icon = menuBtn.querySelector('i');
                    if (icon) {
                        icon.className = 'fa-solid fa-bars';
                    }
                }
            }
        });
    }
}

// 10. INITIALIZE RE-VERIFICATION HANDLERS
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.removeEventListener('submit', handleMailtoSubmit);
        contactForm.addEventListener('submit', handleMailtoSubmit);
    }

    initializeMailtoLinks();
});


function isMobileDevice() {
        return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Handles the first link (Contact card)
    function handleEmailContact(event) {
        event.preventDefault(); // Prevents the page from jumping
        if (isMobileDevice()) {
            window.location.href = "mailto:info@alfattahconstruction.com";
        } else {
            window.open("https://mail.google.com/mail/?view=cm&fs=1&to=info@alfattahconstruction.com", "_blank");
        }
    }

    // Handles the second link (Footer with subject line)
    function handleEmailFooter(event) {
        event.preventDefault(); // Prevents the page from jumping
        if (isMobileDevice()) {
            window.location.href = "mailto:info@alfattahconstruction.com?subject=Corporate%20Planning%20Desk%20Inquiry";
        } else {
            window.open("https://mail.google.com/mail/?view=cm&fs=1&to=info@alfattahconstruction.com&su=Corporate%20Planning%20Desk%20Inquiry", "_blank");
        }
    }