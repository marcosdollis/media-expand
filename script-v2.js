// ===== CURSOR CUSTOMIZADO =====
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

if (cursor && cursorFollower) {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        // Cursor principal
        cursorX += (mouseX - cursorX) * 0.3;
        cursorY += (mouseY - cursorY) * 0.3;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        // Cursor follower
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Efeito hover em links e botões
    const interactiveElements = document.querySelectorAll('a, button, .segment-card, .metric-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(2)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

// ===== MENU MOBILE =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animação do hamburger
        const spans = hamburger.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(12px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-12px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Fechar menu ao clicar em link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

// ===== NAVBAR SCROLL =====
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.8)';
        navbar.style.boxShadow = 'none';
    }
    
    // Ocultar navbar ao rolar para baixo
    if (currentScroll > lastScroll && currentScroll > 500) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== SCROLL REVEAL ANIMATION =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

// Adicionar data-scroll aos elementos que devem animar
const elementsToAnimate = document.querySelectorAll(`
    .problem-card,
    .solution-card,
    .timeline-item,
    .neuro-card-v2,
    .comparison-row,
    .metric-card,
    .segment-card,
    .benefit-item-v2
`);

elementsToAnimate.forEach(el => {
    el.setAttribute('data-scroll', '');
    observer.observe(el);
});

// ===== CONTADOR ANIMADO =====
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 16);
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Animar contadores quando visíveis
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
        }
    });
}, { threshold: 0.5 });

// Aplicar aos números das estatísticas
document.querySelectorAll('.stat-number').forEach(stat => {
    const text = stat.textContent.trim();
    const number = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (!isNaN(number)) {
        stat.setAttribute('data-target', number);
        stat.textContent = '0';
        counterObserver.observe(stat);
    }
});

// ===== FORMULÁRIO =====
const contactForm = document.querySelector('.contact-form-v2');

if (contactForm) {
    // Máscara de telefone
    const phoneInput = contactForm.querySelector('#phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                value = value.replace(/(\d)(\d{4})$/, '$1-$2');
            }
            e.target.value = value;
        });
    }

    // Validação e feedback visual
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value.trim() !== '') {
                input.style.borderColor = 'var(--accent-green)';
            } else {
                input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }
        });

        input.addEventListener('focus', () => {
            input.style.borderColor = 'var(--accent-primary)';
        });
    });

    // Animação de envio
    contactForm.addEventListener('submit', (e) => {
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Enviando...</span>';
        submitBtn.disabled = true;
        
        // O FormSubmit já cuida do redirecionamento
    });
}

// ===== PARALLAX SUAVE =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Hero gradient
    const heroGradient = document.querySelector('.hero-gradient');
    if (heroGradient) {
        heroGradient.style.transform = `translate(${scrolled * 0.2}px, ${scrolled * 0.3}px)`;
    }
    
    // Hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled / 700);
    }
});

// ===== CARDS INTERATIVOS =====
const cards = document.querySelectorAll('.solution-card, .neuro-card-v2, .metric-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===== SEGMENTOS - CLICK TO CONTACT =====
const segmentCards = document.querySelectorAll('.segment-card.available');
segmentCards.forEach(card => {
    card.addEventListener('click', () => {
        const segmentName = card.querySelector('.segment-name').textContent;
        const contactSection = document.querySelector('#contato');
        const segmentSelect = document.querySelector('#segment');
        
        if (contactSection && segmentSelect) {
            // Scroll para contato
            contactSection.scrollIntoView({ behavior: 'smooth' });
            
            // Selecionar segmento
            setTimeout(() => {
                const options = Array.from(segmentSelect.options);
                const option = options.find(opt => 
                    opt.textContent.toLowerCase().includes(segmentName.toLowerCase())
                );
                if (option) {
                    segmentSelect.value = option.value;
                    segmentSelect.style.borderColor = 'var(--accent-green)';
                }
            }, 500);
        }
    });
});

// ===== EFEITO DE DIGITAÇÃO NO HERO =====
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Aplicar efeito de digitação (opcional, descomente para ativar)
/*
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 50);
    }
});
*/

// ===== TOOLTIP PARA SEGMENTOS RESERVADOS =====
const takenSegments = document.querySelectorAll('.segment-card:not(.available):not(.more)');
takenSegments.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const tooltip = document.createElement('div');
        tooltip.className = 'segment-tooltip';
        tooltip.textContent = 'Este segmento já foi reservado por outro anunciante';
        tooltip.style.cssText = `
            position: absolute;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--bg-secondary);
            color: var(--text-secondary);
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-size: 0.75rem;
            white-space: nowrap;
            box-shadow: var(--shadow-md);
            z-index: 10;
            pointer-events: none;
        `;
        card.style.position = 'relative';
        card.appendChild(tooltip);
    });
    
    card.addEventListener('mouseleave', () => {
        const tooltip = card.querySelector('.segment-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    });
});

// ===== LOADING ANIMATION =====
window.addEventListener('load', () => {
    // Remover preloader se existir
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.remove(), 300);
    }
    
    // Animar elementos do hero
    const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-cta, .hero-stats');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// ===== PERFORMANCE: LAZY LOAD IMAGES =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== EASTER EGG: KONAMI CODE =====
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    konamiCode.splice(-konamiSequence.length - 1, konamiCode.length - konamiSequence.length);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Ativar modo "party"
        document.body.style.animation = 'rainbow 2s linear infinite';
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        // Mostrar mensagem
        alert('🎉 Modo Party ativado! Recarregue a página para voltar ao normal.');
    }
});

// ===== DEBUG INFO (remover em produção) =====
console.log('%c🚀 MediaExpand V2', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cDesign: Dark Mode Premium', 'font-size: 14px; color: #8b5cf6;');
console.log('%cFeatures: Cursor customizado, animações suaves, parallax, scroll reveal', 'font-size: 12px; color: #9ca3af;');
