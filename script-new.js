document.addEventListener('DOMContentLoaded', function() {
    // Menu móvel - aprimorado
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Impede propagação do evento
            navLinks.classList.toggle('active');
            console.log('Menu mobile clicado'); // Para debug
        });
        
        // Fechar menu quando clicar em um link
        const navLinksItems = document.querySelectorAll('.nav-links a');
        navLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
            });
        });
        
        // Fechar menu quando clicar fora dele
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.navbar')) {
                navLinks.classList.remove('active');
            }
        });
    } else {
        console.error('Menu mobile não encontrado'); // Para debug
    }
    
    // Manipulador de envio do formulário
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    // Função para mostrar o status do formulário
    function showFormStatus(type, message) {
        if (formStatus) {
            formStatus.className = 'form-status ' + type;
            formStatus.textContent = message;
            formStatus.style.display = 'block';
            
            // Rolar para a mensagem
            formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Esconder após 5 segundos se for sucesso
            if (type === 'success') {
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
            }
        }
    }
    
    // FormSubmit já vai processar o formulário automaticamente
    // Este código aqui é apenas para melhorar a experiência do usuário
    if (contactForm) {
        const submitButton = document.getElementById('submitButton');
        
        // Ao enviar o formulário, mostrar feedback visual
        contactForm.addEventListener('submit', function() {
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Enviando...';
                showFormStatus('info', 'Enviando formulário...');
                
                // Resetar o botão após alguns segundos, caso algo dê errado
                setTimeout(() => {
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent = 'Quero fazer parte';
                    }
                }, 5000);
            }
        });
    }
    
    // Fix para labels dos formulários
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
    formInputs.forEach(input => {
        // Verifica o estado inicial
        if (input.value !== '') {
            const label = input.nextElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.classList.add('active');
            }
        }
        
        // Adiciona listener para mudanças
        input.addEventListener('change', function() {
            const label = this.nextElementSibling;
            if (label && label.tagName === 'LABEL') {
                if (this.value !== '') {
                    label.classList.add('active');
                } else {
                    label.classList.remove('active');
                }
            }
        });
        
        // Adiciona listener para input (verificação em tempo real)
        input.addEventListener('input', function() {
            const label = this.nextElementSibling;
            if (label && label.tagName === 'LABEL') {
                if (this.value !== '') {
                    label.classList.add('active');
                } else {
                    label.classList.remove('active');
                }
            }
        });
    });
    
    // Formatação para telefone
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
            
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            
            // Formata: (00) 00000-0000
            if (value.length > 0) {
                value = '(' + value;
                
                if (value.length > 3) {
                    value = value.slice(0, 3) + ') ' + value.slice(3);
                }
                
                if (value.length > 10) {
                    value = value.slice(0, 10) + '-' + value.slice(10);
                }
            }
            
            e.target.value = value;
        });
    }
    
    // Formatação para CEP
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 8) {
                value = value.slice(0, 8);
            }
            
            if (value.length > 5) {
                value = value.slice(0, 5) + '-' + value.slice(5);
            }
            
            e.target.value = value;
        });
    }
    
    // Contador para estatísticas
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        counter.textContent = '0';
        
        const countUp = () => {
            const count = parseInt(counter.textContent);
            const increment = target / 30; // Ajuste a velocidade aqui
            
            if (count < target) {
                counter.textContent = Math.ceil(count + increment);
                setTimeout(countUp, 30);
            } else {
                counter.textContent = target;
            }
        };
        
        // Inicia animação quando o elemento está visível
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                countUp();
                observer.disconnect();
            }
        });
        
        observer.observe(counter);
    });

    // Slider de localizações
    const locationSlider = document.getElementById('locationSlider');
    const reachValue = document.getElementById('reachValue');
    const costPerView = document.getElementById('costPerView');
    
    if (locationSlider) {
        locationSlider.addEventListener('input', function() {
            const locations = parseInt(this.value);
            // Crescimento para atingir 25.000 pessoas quando estiver em 10 locais
            // Usando o valor inicial de 2500 pessoas para 1 local
            const initialReach = 2500;
            const maxReach = 25000;
            
            // Se estiver no máximo (10 locais), defina como 25.000
            // Caso contrário, calcule uma progressão que cresce mais rapidamente nos últimos valores
            let reach;
            if (locations === 10) {
                reach = maxReach;
            } else {
                // Usando uma função de potência que cresce mais rapidamente ao final
                const growthFactor = Math.pow(maxReach/initialReach, 1/9); // 9 é o número de passos de 1 a 10
                reach = Math.round(initialReach * Math.pow(growthFactor, locations - 1));
            }
            
            const cost = (250 / reach).toFixed(2);
            
            reachValue.textContent = reach;
            costPerView.textContent = `R$ ${cost}`;
        });
    }

    // Animação de pontos no mapa
    // Usando IntersectionObserver para ativar quando a seção estiver visível
    const mapSection = document.querySelector('.growth-section');
    const futurePoints = document.querySelectorAll('.point.future');
    
    // Variável para controlar qual ponto está sendo ativado
    let pointIndex = 0;
    let intervalId = null;
    
    // Adicionar linhas de conexão entre os pontos para simular rede
    function createConnectionLines() {
        const mapElement = document.querySelector('.city-map');
        if (!mapElement) return;
        
        const points = document.querySelectorAll('.point');
        
        // Remover linhas existentes
        const oldLines = document.querySelectorAll('.connection-line');
        oldLines.forEach(line => line.remove());
        
        // Criar novas linhas
        points.forEach((point1, i) => {
            // Obter apenas pontos ativos para conectar
            if (!point1.classList.contains('active')) return;
            
            const rect1 = point1.getBoundingClientRect();
            const mapRect = mapElement.getBoundingClientRect();
            
            const x1 = rect1.left + rect1.width/2 - mapRect.left;
            const y1 = rect1.top + rect1.height/2 - mapRect.top;
            
            points.forEach((point2, j) => {
                // Evitar conectar com pontos futuros e evitar duplicações
                if (i >= j || !point2.classList.contains('active')) return;
                
                const rect2 = point2.getBoundingClientRect();
                const x2 = rect2.left + rect2.width/2 - mapRect.left;
                const y2 = rect2.top + rect2.height/2 - mapRect.top;
                
                // Calcular distância
                const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                
                // Conectar apenas pontos próximos (limite de 200px)
                if (distance < 200) {
                    const line = document.createElement('div');
                    line.className = 'connection-line';
                    
                    // Calcular o comprimento e ângulo da linha
                    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
                    
                    // Posicionar e rotacionar a linha
                    line.style.width = length + 'px';
                    line.style.left = x1 + 'px';
                    line.style.top = y1 + 'px';
                    line.style.transform = `rotate(${angle}deg)`;
                    
                    // Adicionar linha ao mapa
                    mapElement.appendChild(line);
                }
            });
        });
    }
    
    // Adicionar comportamento de mostrar informação ao clicar nos pontos também
    const allPoints = document.querySelectorAll('.point');
    allPoints.forEach(point => {
        // Mostrar informação ao clicar ou tocar (para mobile)
        point.addEventListener('click', function() {
            const locationInfo = this.querySelector('.location-info');
            if (locationInfo) {
                // Remover classes ativas de outras informações
                document.querySelectorAll('.location-info.info-visible').forEach(info => {
                    if (info !== locationInfo) {
                        info.classList.remove('info-visible');
                    }
                });
                
                locationInfo.classList.toggle('info-visible');
                
                // Aplicar classe de destaque ao ponto
                this.classList.add('highlight-point');
                setTimeout(() => {
                    this.classList.remove('highlight-point');
                }, 500);
            }
        });
    });
    
    // Observer para ativar animação dos pontos
    const mapObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            // Iniciar animação de pontos se ainda não estiver rodando
            if (!intervalId && futurePoints.length > 0) {
                intervalId = setInterval(() => {
                    if (pointIndex < futurePoints.length) {
                        const point = futurePoints[pointIndex];
                        point.classList.remove('future');
                        point.classList.add('active');
                        
                        // Redesenhar as linhas de conexão
                        createConnectionLines();
                        
                        pointIndex++;
                    } else {
                        clearInterval(intervalId);
                        intervalId = null;
                    }
                }, 3000); // Ativar um novo ponto a cada 3 segundos
            }
        } else {
            // Se sair da tela, resetar animação
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        }
    });
    
    if (mapSection) {
        mapObserver.observe(mapSection);
    }
    
    // Garantir que o vídeo do YouTube carregue corretamente
    function checkYouTubeVideo() {
        const videoIframe = document.querySelector('.video-container iframe');
        
        if (videoIframe) {
            // Verificar se a URL contém os parâmetros necessários
            const currentSrc = videoIframe.getAttribute('src');
            
            if (currentSrc && !currentSrc.includes('playlist=')) {
                // Adicionar os parâmetros necessários para loop se estiverem faltando
                const videoId = currentSrc.split('/').pop().split('?')[0];
                const updatedSrc = `https://www.youtube.com/embed/${videoId}?playlist=${videoId}&loop=1&autoplay=1&mute=1`;
                videoIframe.setAttribute('src', updatedSrc);
                console.log('YouTube video parameters fixed');
            }
        }
    }
    
    // Executar a verificação após o carregamento completo da página
    window.addEventListener('load', checkYouTubeVideo);
});
