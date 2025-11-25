// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-active');
    });

    // Close menu when a link is clicked (only on mobile)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('mobile-active');
            }
        });
    });
}

// Handle window resize to ensure nav-links display correctly
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navLinks.classList.remove('mobile-active');
    }
});

// Smooth Scrolling with navbar offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-category, .project-card, .experience-item').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(element);
});

// Contact Form Handler
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Create mailto link
        const mailtoLink = `mailto:prem.parikh@umass.edu?subject=Portfolio Contact from ${name}&body=${encodeURIComponent(message + '\n\nFrom: ' + email)}`;
        
        // Open default email client
        window.location.href = mailtoLink;
        
        // Reset form
        contactForm.reset();
    });
}

// Active Navigation Link
const navItems = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
    let current = '';
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });
});

// Add active style to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    .nav-links a.active {
        color: var(--primary-color);
        border-bottom: 2px solid var(--primary-color);
        padding-bottom: 0.5rem;
    }
`;
document.head.appendChild(style);

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = 'var(--shadow)';
    } else {
        navbar.style.boxShadow = 'var(--shadow-sm)';
    }
});

// Local video modal handling for links with data-video
document.addEventListener('click', function (e) {
    const btn = e.target.closest('a[data-video]');
    if (!btn) return;
    e.preventDefault();

    const videoUrl = btn.getAttribute('data-video');
    const modal = document.getElementById('videoModalLocal');
    const backdrop = document.getElementById('videoModalBackdrop');
    const closeBtn = document.getElementById('videoModalClose');
    const video = document.getElementById('localVideo');
    const source = document.getElementById('localVideoSource');

    source.src = videoUrl;
    video.load();
    video.currentTime = 0;
    // autoplay if allowed
    const playPromise = video.play();
    if (playPromise !== undefined) {
        playPromise.catch(() => { /* autoplay blocked, user can press play */ });
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');

    function closeModal() {
        video.pause();
        source.src = '';
        video.load();
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        cleanup();
    }

    function onKey(e) {
        if (e.key === 'Escape') closeModal();
    }

    function cleanup() {
        backdrop.removeEventListener('click', closeModal);
        closeBtn.removeEventListener('click', closeModal);
        document.removeEventListener('keydown', onKey);
    }

    backdrop.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', onKey);
});