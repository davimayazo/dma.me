const AppState = {
    currentLang: 'es',
    currentTheme: 'dark',
    currentSection: 'home',
    isMenuOpen: false,
    isLoaded: false
};

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    loadPreferences();
    initLanguage();
    initTheme();
    initNavigation();
    initScrollEffects();
    initFormHandlers();
    initMobileMenu();
    updateLanguageUI();
    updateThemeUI();
    initEasterEgg();
    AppState.isLoaded = true;
}

function loadPreferences() {
    const savedLang = localStorage.getItem('portfolio-lang');
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedLang) AppState.currentLang = savedLang;
    if (savedTheme) AppState.currentTheme = savedTheme;
}

function initLanguage() {
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }
    setLanguage(AppState.currentLang);
}

function toggleLanguage() {
    const newLang = AppState.currentLang === 'es' ? 'en' : 'es';
    setLanguage(newLang);
    localStorage.setItem('portfolio-lang', newLang);
}

function setLanguage(lang) {
    AppState.currentLang = lang;
    const html = document.documentElement;
    const body = document.body;

    if (lang === 'en') {
        html.setAttribute('lang', 'en');
        html.setAttribute('dir', 'ltr');
        body.setAttribute('data-lang', 'en');
        body.setAttribute('data-dir', 'ltr');
    } else {
        html.setAttribute('lang', 'es');
        html.setAttribute('dir', 'ltr');
        body.setAttribute('data-lang', 'es');
        body.setAttribute('data-dir', 'ltr');
    }
    updateLanguageUI();
}

function updateLanguageUI() {
    const textElements = document.querySelectorAll('[data-text-es], [data-text-en]');
    textElements.forEach(element => {
        const esText = element.getAttribute('data-text-es');
        const enText = element.getAttribute('data-text-en');
        if (AppState.currentLang === 'en' && enText) {
            element.textContent = enText;
        } else if (AppState.currentLang === 'es' && esText) {
            element.textContent = esText;
        }
    });

    const placeholderElements = document.querySelectorAll('[data-placeholder-es], [data-placeholder-en]');
    placeholderElements.forEach(element => {
        const esPlaceholder = element.getAttribute('data-placeholder-es');
        const enPlaceholder = element.getAttribute('data-placeholder-en');
        if (AppState.currentLang === 'en' && enPlaceholder) {
            element.setAttribute('placeholder', enPlaceholder);
        } else if (AppState.currentLang === 'es' && esPlaceholder) {
            element.setAttribute('placeholder', esPlaceholder);
        }
    });

    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        const langText = langToggle.querySelector('.lang-text');
        if (langText) {
            langText.textContent = AppState.currentLang === 'es' ? 'EN' : 'ES';
        }
    }
}

function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    setTheme(AppState.currentTheme);
}

function toggleTheme() {
    const newTheme = AppState.currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
}

function setTheme(theme) {
    AppState.currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    updateThemeUI();
}

function updateThemeUI() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = AppState.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                updateActiveNavLink(link);
                if (AppState.isMenuOpen) {
                    toggleMobileMenu();
                }
            }
        });
    });

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', updateHeaderOnScroll);
}

function handleScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    // Check if we're at the bottom of the page
    const isAtBottom = (window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight - 50;

    if (isAtBottom) {
        // Find the last section and set it as active
        if (sections.length > 0) {
            const lastSectionId = sections[sections.length - 1].getAttribute('id');
            AppState.currentSection = lastSectionId;
            updateActiveNavLink(null, lastSectionId);
            return;
        }
    }

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            AppState.currentSection = sectionId;
            updateActiveNavLink(null, sectionId);
        }
    });
}

function updateActiveNavLink(clickedLink, sectionId = null) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (clickedLink && link === clickedLink) {
            link.classList.add('active');
        } else if (sectionId) {
            const linkSection = link.getAttribute('data-section');
            if (linkSection === sectionId) {
                link.classList.add('active');
            }
        }
    });
}

function updateHeaderOnScroll() {
    const header = document.querySelector('.main-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => observer.observe(element));

    const sections = document.querySelectorAll('.section');
    sections.forEach(section => observer.observe(section));
}

function initFormHandlers() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('.btn-submit');
    const submitText = submitBtn.querySelector('span');
    const submitIcon = submitBtn.querySelector('i');

    // Save original state
    const originalText = submitText.textContent;
    const originalIcon = submitIcon.className;

    // Show loading state
    submitBtn.disabled = true;
    submitText.textContent = AppState.currentLang === 'es' ? 'Enviando...' : 'Sending...';
    submitIcon.className = 'fas fa-spinner fa-spin';

    const formData = new FormData(form);
    const jsonData = Object.fromEntries(formData);

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                submitText.textContent = AppState.currentLang === 'es' ? '¡Mensaje Enviado!' : 'Message Sent!';
                submitIcon.className = 'fas fa-check';
                submitBtn.style.background = 'var(--green)';
                form.reset();
            } else {
                submitText.textContent = AppState.currentLang === 'es' ? 'Error al enviar' : 'Send Failed';
                submitIcon.className = 'fas fa-exclamation-triangle';
                submitBtn.style.background = 'var(--red, #ff4444)';
            }
        })
        .catch(() => {
            submitText.textContent = AppState.currentLang === 'es' ? 'Error al enviar' : 'Send Failed';
            submitIcon.className = 'fas fa-exclamation-triangle';
            submitBtn.style.background = 'var(--red, #ff4444)';
        })
        .finally(() => {
            setTimeout(() => {
                submitBtn.disabled = false;
                submitText.textContent = originalText;
                submitIcon.className = originalIcon;
                submitBtn.style.background = '';
            }, 3000);
        });
}

function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }

    document.addEventListener('click', (e) => {
        const navMenu = document.getElementById('navMenu');
        const menuToggle = document.getElementById('menuToggle');

        if (AppState.isMenuOpen &&
            !navMenu.contains(e.target) &&
            !menuToggle.contains(e.target)) {
            toggleMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    AppState.isMenuOpen = !AppState.isMenuOpen;
    const navMenu = document.getElementById('navMenu');
    const menuToggle = document.getElementById('menuToggle');

    if (navMenu) {
        navMenu.classList.toggle('active', AppState.isMenuOpen);
    }

    if (menuToggle) {
        menuToggle.classList.toggle('active', AppState.isMenuOpen);
    }
}

function generateParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const codeSymbols = ['{', '}', '[', ']', '(', ')', '<', '>', '/', '*', '=', '+', '-', ';', ':', '&', '|', '%', '$', '#', '@'];
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = codeSymbols[Math.floor(Math.random() * codeSymbols.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    generateParticles();
});



//--------------animations.js-----------------
function inView(element, callback, options = {}) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback(entry);
                if (options.once !== false) {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, {
        threshold: options.amount || 0.1,
        rootMargin: options.rootMargin || '0px'
    });
    observer.observe(element);
    return () => observer.unobserve(element);
}

function animateElement(element, props, options = {}) {
    if (typeof anime === 'undefined') return;
    const animeProps = {};
    if (props.opacity) animeProps.opacity = props.opacity;
    if (props.x !== undefined) animeProps.translateX = props.x;
    if (props.y !== undefined) animeProps.translateY = props.y;
    if (props.scale) animeProps.scale = props.scale;
    return anime({
        targets: element,
        ...animeProps,
        duration: (options.duration || 0.8) * 1000,
        delay: (options.delay || 0) * 1000,
        easing: options.easing || 'easeOutExpo'
    });
}

window.addEventListener('load', () => {
    setTimeout(() => {
        initLoaderAnimation();
    }, 100);
});

function initLoaderAnimation() {
    const loader = document.getElementById('loader');
    const loaderPercent = document.getElementById('loaderPercent');
    const loaderStatus = document.getElementById('loaderStatus');
    if (!loader || !loaderPercent) return;

    const statusMessages = [
        'Initializing system...',
        'Loading Python modules...',
        'Connecting to Oracle DB...',
        'Parsing HL7 messages...',
        'Starting Linux servers...',
        'Deploying to production...',
        'System ready ✓'
    ];

    let progress = 0;
    let msgIndex = 0;

    const statusInterval = setInterval(() => {
        if (msgIndex < statusMessages.length && loaderStatus) {
            loaderStatus.textContent = statusMessages[msgIndex];
            msgIndex++;
        }
    }, 300);

    const progressInterval = setInterval(() => {
        progress += Math.random() * 12;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            clearInterval(statusInterval);
            if (loaderStatus) loaderStatus.textContent = 'System ready ✓';
            setTimeout(() => {
                if (typeof anime !== 'undefined') {
                    anime({
                        targets: loader,
                        opacity: [1, 0],
                        duration: 500,
                        easing: 'easeInOutQuad',
                        complete: () => {
                            loader.classList.add('hidden');
                            initPageAnimations();
                        }
                    });
                } else {
                    loader.classList.add('hidden');
                    initPageAnimations();
                }
            }, 400);
        }
        if (loaderPercent) {
            loaderPercent.textContent = Math.floor(progress) + '%';
        }
    }, 120);
}

function initPageAnimations() {
    setTimeout(() => {
        initHeroAnimations();
        initSkillAnimations();
        initTimelineAnimations();
        initProjectAnimations();
        initScrollAnimations();
        initContactAnimations();
        animateStats();
        initParallax();
        initSmoothScroll();
    }, 300);
}

function initHeroAnimations() {
    if (typeof anime === 'undefined') return;

    const heroName = document.getElementById('heroName');
    if (heroName) {
        const nameValue = heroName.querySelector('.name-value');
        if (nameValue) {
            const originalText = nameValue.textContent;
            nameValue.textContent = '';
            anime({
                targets: { value: 0 },
                value: originalText.length,
                duration: 1500,
                delay: 500,
                easing: 'easeInOutQuad',
                update: function (anim) {
                    const length = Math.floor(anim.animatables[0].target.value);
                    nameValue.textContent = originalText.substring(0, length);
                },
                complete: () => {
                    const cursor = document.createElement('span');
                    cursor.className = 'name-cursor';
                    cursor.textContent = '|';
                    cursor.style.animation = 'blink 1s infinite';
                    nameValue.appendChild(cursor);
                    setTimeout(() => cursor.remove(), 2000);
                }
            });
        }
    }

    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        anime({
            targets: heroTitle,
            opacity: [0, 1],
            translateX: [-30, 0],
            delay: 800,
            duration: 1000,
            easing: 'easeOutExpo'
        });
    }

    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription) {
        anime({
            targets: heroDescription,
            opacity: [0, 1],
            translateY: [20, 0],
            delay: 1200,
            duration: 1000,
            easing: 'easeOutExpo'
        });
    }

    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    if (heroButtons.length > 0) {
        anime({
            targets: heroButtons,
            opacity: [0, 1],
            scale: [0.8, 1],
            delay: anime.stagger(100, { start: 1500 }),
            duration: 800,
            easing: 'easeOutBack'
        });
    }

    const socialIcons = document.querySelectorAll('.hero-social .social-icon');
    if (socialIcons.length > 0) {
        anime({
            targets: socialIcons,
            opacity: [0, 1],
            scale: [0, 1],
            rotate: [180, 0],
            delay: anime.stagger(100, { start: 2000 }),
            duration: 800,
            easing: 'easeOutBack'
        });
    }

    const profileImage = document.getElementById('profileImage');
    if (profileImage) {
        anime({
            targets: profileImage,
            opacity: [0, 1],
            scale: [0.8, 1],
            rotate: [180, 0],
            delay: 1000,
            duration: 1500,
            easing: 'easeOutElastic(1, .8)'
        });

        profileImage.addEventListener('mouseenter', () => {
            anime({
                targets: profileImage,
                scale: [1, 1.1],
                rotate: [0, 5],
                duration: 500,
                easing: 'easeOutElastic(1, .8)'
            });
        });

        profileImage.addEventListener('mouseleave', () => {
            anime({
                targets: profileImage,
                scale: [1.1, 1],
                rotate: [5, 0],
                duration: 500,
                easing: 'easeOutElastic(1, .8)'
            });
        });
    }

    const badges = document.querySelectorAll('.floating-badge');
    if (badges.length > 0) {
        badges.forEach((badge, index) => {
            anime({
                targets: badge,
                opacity: [0, 1],
                scale: [0, 1],
                delay: 1500 + (index * 200),
                duration: 800,
                easing: 'easeOutBack'
            });
        });
    }
}

function initSkillAnimations() {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;

    const skillCategories = skillsSection.querySelectorAll('.skill-category');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const category = entry.target;
                const tags = category.querySelectorAll('.skill-tag');

                if (tags.length > 0 && typeof anime !== 'undefined') {
                    anime({
                        targets: tags,
                        opacity: [0, 1],
                        scale: [0.8, 1],
                        translateY: [20, 0],
                        delay: anime.stagger(100),
                        duration: 800,
                        easing: 'easeOutBack'
                    });
                }
                observer.unobserve(category);
            }
        });
    }, { threshold: 0.2 });

    skillCategories.forEach(category => observer.observe(category));
}

function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        inView(item, () => {
            if (typeof anime !== 'undefined') {
                anime({
                    targets: item,
                    opacity: [0, 1],
                    translateX: [-50, 0],
                    delay: index * 150,
                    duration: 1000,
                    easing: 'easeOutExpo'
                });
            } else {
                animateElement(item, { opacity: [0, 1], x: [-50, 0] }, { duration: 0.8, delay: index * 0.1 });
            }
        }, { amount: 0.3 });
    });
}

function initProjectAnimations() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        inView(card, () => {
            if (typeof anime !== 'undefined') {
                anime({
                    targets: card,
                    opacity: [0, 1],
                    translateY: [50, 0],
                    scale: [0.9, 1],
                    delay: index * 100,
                    duration: 1000,
                    easing: 'easeOutExpo'
                });
            } else {
                animateElement(card, { opacity: [0, 1], y: [50, 0], scale: [0.9, 1] }, { duration: 0.8, delay: index * 0.1 });
            }
        }, { amount: 0.2 });

        card.addEventListener('mouseenter', () => {
            if (typeof anime !== 'undefined') {
                anime({ targets: card, scale: [1, 1.02], duration: 300, easing: 'easeOutQuad' });
            }
        });

        card.addEventListener('mouseleave', () => {
            if (typeof anime !== 'undefined') {
                anime({ targets: card, scale: [1.02, 1], duration: 300, easing: 'easeOutQuad' });
            }
        });
    });
}

function initScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        inView(section, () => {
            const sectionHeader = section.querySelector('.section-header');
            if (sectionHeader && typeof anime !== 'undefined') {
                anime({
                    targets: sectionHeader,
                    opacity: [0, 1],
                    translateY: [-20, 0],
                    duration: 600,
                    easing: 'easeOutExpo'
                });
            }
        }, { amount: 0.2 });
    });

    const cards = document.querySelectorAll('.card, .project-card, .contact-item');
    cards.forEach((card, index) => {
        inView(card, () => {
            if (typeof anime !== 'undefined') {
                anime({
                    targets: card,
                    opacity: [0, 1],
                    translateY: [30, 0],
                    delay: index * 30,
                    duration: 500,
                    easing: 'easeOutExpo'
                });
            } else {
                animateElement(card, { opacity: [0, 1], y: [50, 0] }, { duration: 0.6, delay: index * 0.05 });
            }
        }, { amount: 0.2 });
    });
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count') || 0);
        const suffix = stat.getAttribute('data-suffix') || '';
        inView(stat, () => {
            if (typeof anime !== 'undefined') {
                anime({
                    targets: { value: 0 },
                    value: target,
                    duration: 2000,
                    easing: 'easeOutExpo',
                    update: function (anim) {
                        stat.textContent = Math.floor(anim.animatables[0].target.value) + suffix;
                    }
                });
            }
        }, { amount: 0.5 });
    });
}

function initContactAnimations() {
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (typeof anime !== 'undefined') {
                anime({ targets: item, scale: [1, 1.02], duration: 200, easing: 'easeOutQuad' });
            }
        });
        item.addEventListener('mouseleave', () => {
            if (typeof anime !== 'undefined') {
                anime({ targets: item, scale: [1.02, 1], duration: 200, easing: 'easeOutQuad' });
            }
        });
    });
}

function initParallax() {
    const profileImage = document.getElementById('profileImage');
    if (!profileImage) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const parallaxSpeed = 0.3;
                const maxOffset = 100;
                const offset = Math.min(scrolled * parallaxSpeed, maxOffset);

                if (profileImage) {
                    profileImage.style.transform = `translateY(${offset}px)`;
                }

                const gridBg = document.querySelector('.code-grid-bg');
                if (gridBg) {
                    gridBg.style.transform = `translateY(${scrolled * 0.2}px)`;
                }

                ticking = false;
            });
            ticking = true;
        }
    });
}

function initSmoothScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;

                if (typeof anime !== 'undefined') {
                    anime({
                        targets: window,
                        scrollTop: targetPosition,
                        duration: 800,
                        easing: 'easeInOutQuad'
                    });
                } else {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

function initEasterEgg() {
    let inputSequence = '';
    document.addEventListener('keydown', (e) => {
        if (e.key.length === 1) {
            inputSequence += e.key.toLowerCase();
        }

        if (inputSequence.length > 10) {
            inputSequence = inputSequence.slice(-10);
        }

        if (inputSequence.endsWith('33')) {
            triggerEasterEgg('alonso');
            inputSequence = '';
        } else if (inputSequence.endsWith('ñ')) {
            triggerEasterEgg('nadal');
            inputSequence = '';
        } else if (inputSequence.endsWith('10')) {
            triggerEasterEgg('messi');
            inputSequence = '';
        }
    });
}

function triggerEasterEgg(type) {
    let eggId = type + '-easter-egg';
    let container = document.getElementById(eggId);

    if (!container) {
        container = document.createElement('div');
        container.id = eggId;
        container.className = 'easter-egg-container';

        let text = document.createElement('div');
        text.className = 'easter-egg-text';

        let img = document.createElement('img');
        img.className = 'easter-egg-img';

        if (type === 'alonso') {
            text.textContent = 'LA 33 ES INEVITABLE';
            img.src = 'fernando-alonso.png';
        } else if (type === 'nadal') {
            text.textContent = 'El mejor deportista español de todos los tiempos';
            img.src = 'rafa-nadal.png';
        } else if (type === 'messi') {
            text.textContent = 'GOAT';
            img.src = 'leo-messi.png';
        }

        container.appendChild(text);
        container.appendChild(img);
        document.body.appendChild(container);
    }

    animateEasterEgg(container);
}

function animateEasterEgg(container) {
    if (container.classList.contains('is-animating')) return;
    container.classList.add('is-animating');

    let textNode = container.querySelector('.easter-egg-text');

    if (typeof anime !== 'undefined') {
        let tl = anime.timeline();
        tl.add({
            targets: container,
            translateY: ['100%', '0%'],
            duration: 1000,
            easing: 'easeOutElastic(1, .6)'
        });
        
        if (textNode) {
            tl.add({
                targets: textNode,
                opacity: [0, 1],
                scale: [0.5, 1],
                duration: 500,
                easing: 'easeOutBack'
            }, '-=600');
        }

        tl.add({
            targets: container,
            translateY: ['0%', '100%'],
            duration: 800,
            delay: 1500,
            easing: 'easeInBack',
            complete: function () {
                container.classList.remove('is-animating');
                if (textNode) {
                    textNode.style.opacity = '0';
                    textNode.style.transform = 'scale(0.5)';
                }
            }
        });
    } else {
        container.style.transform = 'translateY(0%)';
        container.style.transition = 'transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        if (textNode) textNode.style.opacity = '1';

        setTimeout(() => {
            container.style.transform = 'translateY(100%)';
            if (textNode) textNode.style.opacity = '0';
            setTimeout(() => {
                container.classList.remove('is-animating');
            }, 1000);
        }, 3000);
    }
}

window.Animations = {
    initParallax,
    initSmoothScroll
};

// Full-Stack Accordion Toggle
function toggleFullstackCerts() {
    const accordion = document.getElementById('fullstackAccordion');
    if (!accordion) return;
    accordion.classList.toggle('expanded');
    
    const hint = accordion.querySelector('.fullstack-expand-hint span');
    if (hint) {
        const isExpanded = accordion.classList.contains('expanded');
        if (AppState.currentLang === 'es') {
            hint.textContent = isExpanded ? 'Ocultar certificaciones' : 'Ver certificaciones incluidas';
        } else {
            hint.textContent = isExpanded ? 'Hide certifications' : 'View included certifications';
        }
    }
}
