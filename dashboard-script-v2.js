// ===== MENU MOBILE =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
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
    document.querySelectorAll('.nav-link').forEach(link => {
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
        navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ===== CONTADOR ANIMADO =====
function animateCounter(element, target, duration = 2000, suffix = '') {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target) + suffix;
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current)) + suffix;
        }
    }, 16);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        // Se for número redondo de milhares, não mostrar decimais
        if (num % 1000 === 0) {
            return (num / 1000).toFixed(0) + 'K';
        }
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// ===== INTERSECTION OBSERVER PARA CONTADORES =====
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const target = parseInt(entry.target.getAttribute('data-target'));
            
            // Determinar o sufixo baseado no contexto
            let suffix = '';
            const label = entry.target.nextElementSibling?.textContent || '';
            
            if (label.includes('horas') || label.includes('Tempo')) {
                suffix = 'h';
            } else if (label.includes('%') || label.includes('Crescimento')) {
                suffix = '%';
            } else if (label.includes('segundos')) {
                suffix = 's';
            }
            
            animateCounter(entry.target, target, 2000, suffix);
        }
    });
}, { threshold: 0.3 });

// Aplicar aos contadores
document.querySelectorAll('[data-target]').forEach(counter => {
    counterObserver.observe(counter);
});

// ===== SCROLL REVEAL ANIMATION =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

// Adicionar data-scroll aos elementos que devem animar
const elementsToAnimate = document.querySelectorAll(`
    .executive-summary,
    .growth-card,
    .metric-card,
    .social-card,
    .growth-message,
    .dashboard-cta
`);

elementsToAnimate.forEach(el => {
    el.setAttribute('data-scroll', '');
    scrollObserver.observe(el);
});

// ===== CARDS 3D HOVER EFFECT =====
const cards = document.querySelectorAll('.metric-card, .social-card, .growth-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===== TOOLTIP INTERATIVO =====
const infoIcons = document.querySelectorAll('.info-icon[data-tooltip]');

infoIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Remover tooltips existentes
        document.querySelectorAll('.custom-tooltip').forEach(t => t.remove());
        
        // Criar tooltip customizado
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = icon.getAttribute('data-tooltip');
        tooltip.style.cssText = `
            position: absolute;
            top: ${icon.offsetTop + 40}px;
            right: ${icon.offsetParent.offsetWidth - icon.offsetLeft - icon.offsetWidth}px;
            padding: 1rem;
            background: var(--bg-secondary);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            font-size: 0.875rem;
            max-width: 300px;
            z-index: 100;
            box-shadow: var(--shadow-lg);
            animation: fadeInUp 0.3s ease-out;
        `;
        
        icon.offsetParent.style.position = 'relative';
        icon.offsetParent.appendChild(tooltip);
        
        // Fechar ao clicar fora
        setTimeout(() => {
            document.addEventListener('click', function closeTooltip() {
                tooltip.remove();
                document.removeEventListener('click', closeTooltip);
            });
        }, 100);
    });
});

// ===== REFRESH BUTTON ANIMATION =====
const refreshBtn = document.querySelector('.refresh-btn');

if (refreshBtn) {
    refreshBtn.addEventListener('click', (e) => {
        if (!refreshBtn.classList.contains('refreshing')) {
            e.preventDefault();
            refreshBtn.classList.add('refreshing');
            
            const icon = refreshBtn.querySelector('i');
            icon.style.animation = 'spin 1s linear infinite';
            
            setTimeout(() => {
                location.reload();
            }, 500);
        }
    });
}

// CSS para animação de spin
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .custom-tooltip {
        animation: fadeInUp 0.3s ease-out;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ===== PARALLAX SUAVE NO HERO =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    const heroGradient = document.querySelector('.hero-gradient');
    if (heroGradient) {
        heroGradient.style.transform = `translate(${scrolled * 0.2}px, ${scrolled * 0.3}px)`;
    }
    
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && scrolled < 500) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / 600);
    }
});

// ===== LOADING ANIMATION =====
window.addEventListener('load', () => {
    // Animar elementos do hero
    const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .quick-stats');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        setTimeout(() => {
            el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 150);
    });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== ANIMAÇÃO DE ENTRADA DOS CARDS =====
function staggerCards(selector, delay = 100) {
    const cards = document.querySelectorAll(selector);
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * delay);
    });
}

// Aplicar animação escalonada quando a seção entra na viewport
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            
            if (entry.target.classList.contains('growth-section')) {
                staggerCards('.growth-card', 100);
            } else if (entry.target.classList.contains('metrics-section')) {
                staggerCards('.metric-card', 80);
            } else if (entry.target.classList.contains('social-section')) {
                staggerCards('.social-card', 100);
            }
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.growth-section, .metrics-section, .social-section').forEach(section => {
    sectionObserver.observe(section);
});

// ===== EASTER EGG: KONAMI CODE =====
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    konamiCode.splice(-konamiSequence.length - 1, konamiCode.length - konamiSequence.length);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        document.body.style.animation = 'rainbow 2s linear infinite';
        
        const rainbowStyle = document.createElement('style');
        rainbowStyle.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(rainbowStyle);
        
        alert('🎉 Modo Party ativado no Dashboard! Recarregue a página para voltar ao normal.');
    }
});

// ===== INFORMAÇÕES DE PERFORMANCE =====
console.log('%c📊 MediaExpand Dashboard V2', 'font-size: 24px; font-weight: bold; color: #6366f1;');
console.log('%cDesign: Dark Mode Premium with Animations', 'font-size: 14px; color: #8b5cf6;');
console.log('%cFeatures: Animated counters, 3D hover effects, scroll reveal', 'font-size: 12px; color: #9ca3af;');

// Métricas de performance
if (performance && performance.timing) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`%c⚡ Página carregada em ${loadTime}ms`, 'font-size: 12px; color: #10b981;');
        }, 0);
    });
}

// ===== DETECTAR MODO DE ACESSIBILIDADE =====
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Desabilitar animações para usuários que preferem menos movimento
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
    console.log('%c♿ Modo de movimento reduzido detectado - Animações desabilitadas', 'font-size: 12px; color: #f59e0b;');
}

// ===== AUTO-UPDATE TIMESTAMP (OPCIONAL) =====
function updateTimestamp() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR');
    const dateString = now.toLocaleDateString('pt-BR');
    
    const badge = document.querySelector('.hero-badge span:last-child');
    if (badge && badge.textContent.includes('atualizados')) {
        badge.textContent = `Dados atualizados em ${dateString} às ${timeString}`;
    }
}

// Atualizar a cada minuto
setInterval(updateTimestamp, 60000);
