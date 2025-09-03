document.addEventListener('DOMContentLoaded', function() {
    // Configuração do Supabase - Substitua pelos valores da sua conta
    const SUPABASE_URL = 'https://SEU_ID_DE_PROJETO.supabase.co';
    const SUPABASE_KEY = 'SUA_CHAVE_PUBLICA_AQUI';
    
    // Manipulador de envio do formulário
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitButton = document.getElementById('submitButton');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Enviando...';
            }
            
            // Obter todos os dados do formulário
            const formData = {
                name: document.getElementById('name').value,
                business: document.getElementById('business').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                cep: document.getElementById('cep').value,
                segment: document.getElementById('segment').value,
                message: document.getElementById('message').value
            };
            
            // OPÇÃO 1: Enviar para Formspree
            // Descomente esse bloco e substitua "seu-endpoint" no action do formulário
            /*
            fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Erro ao enviar o formulário. Tente novamente mais tarde.');
            })
            .then(data => {
                showFormStatus('success', 'Formulário enviado com sucesso! Entraremos em contato em breve.');
                contactForm.reset();
            })
            .catch(error => {
                showFormStatus('error', error.message);
            })
            .finally(() => {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Quero fazer parte';
                }
            });
            */
            
            // OPÇÃO 4: Supabase - Banco de dados PostgreSQL com API integrada
            // Configuração do Supabase - Substitua com suas credenciais
            const SUPABASE_URL = 'https://seu-projeto.supabase.co';
            const SUPABASE_KEY = 'sua-chave-publica-aqui';
            
            // Obter todos os dados do formulário como objeto
            const formDataObj = {
                name: document.getElementById('name').value,
                business: document.getElementById('business').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                cep: document.getElementById('cep').value,
                segment: document.getElementById('segment').value,
                message: document.getElementById('message').value
            };
            
            // Mostrar indicador de carregamento
            showFormStatus('info', 'Enviando formulário...');
            
            // Logging para depuração
            console.log('Enviando dados para Supabase:', formDataObj);
            
            // Enviar para o Supabase usando fetch API
            fetch(`${SUPABASE_URL}/rest/v1/contatos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_KEY,
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(formDataObj)
            })
            .then(response => {
                console.log('Resposta completa:', response);
                
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`Erro ${response.status}: ${text}`);
                    });
                }
                
                showFormStatus('success', 'Formulário enviado com sucesso! Entraremos em contato em breve.');
                contactForm.reset();
            })
            .catch(error => {
                console.error('Erro completo:', error);
                showFormStatus('error', 'Erro ao enviar o formulário: ' + error.message);
            })
            .finally(() => {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Quero fazer parte';
                }
            });
            
            /* 
            // OPÇÃO 2: Salvar localmente (apenas para testes)
            try {
                // Convertendo para CSV
                const headers = Object.keys(formData).join(',');
                const values = Object.values(formData).map(value => `"${value}"`).join(',');
                const csvRow = `${values}\n`;
                
                // Criando blob e link de download
                const csvContent = headers + '\n' + csvRow;
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', `contato-${formData.name}-${new Date().toISOString().slice(0,10)}.csv`);
                link.style.display = 'none';
                document.body.appendChild(link);
                
                // Baixar CSV
                link.click();
                document.body.removeChild(link);
                
                // Mostrar mensagem de sucesso
                showFormStatus('success', 'Dados salvos com sucesso! Em uma versão publicada, estes seriam enviados para nosso servidor.');
                contactForm.reset();
                
                // Resetar o estado do botão
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Quero fazer parte';
                }
            } catch (error) {
                showFormStatus('error', 'Erro ao salvar os dados: ' + error.message);
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Quero fazer parte';
                }
            }
            */
        });
    }
    
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
                
                // Alternar visibilidade
                locationInfo.classList.toggle('info-visible');
                
                // Adicionar animação de destaque ao clicar
                this.classList.add('highlight-point');
                
                // Remover a classe de destaque após 2 segundos
                setTimeout(() => {
                    this.classList.remove('highlight-point');
                }, 2000);
                
                // Esconder após 4 segundos
                setTimeout(() => {
                    locationInfo.classList.remove('info-visible');
                }, 4000);
            }
        });
    });
    
    // Formatador de CEP
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não for número
            
            if (value.length > 8) {
                value = value.slice(0, 8);
            }
            
            // Adiciona hífen após o 5º dígito
            if (value.length > 5) {
                value = value.slice(0, 5) + '-' + value.slice(5);
            }
            
            e.target.value = value;
        });
    }
    
    // Função para ativar um ponto com animação mais chamativa
    function activatePoint(point) {
        // Adiciona classe para animar o ponto
        point.classList.remove('future');
        point.classList.add('active');
        
        // Adiciona uma animação de destaque
        point.classList.add('highlight-point');
        
        // Remove a classe de destaque após 4 segundos
        setTimeout(() => {
            point.classList.remove('highlight-point');
        }, 4000);
        
        // Faz o ponto piscar 3 vezes
        let blinkCount = 0;
        const blinkInterval = setInterval(() => {
            point.style.opacity = point.style.opacity === '0.5' ? '1' : '0.5';
            blinkCount++;
            if (blinkCount >= 6) { // 3 ciclos completos
                clearInterval(blinkInterval);
                point.style.opacity = '1';
            }
        }, 200);
        
        // Mostra a notificação do balão
        const notification = point.querySelector('.notification-bubble');
        if (notification) {
            // Reset da animação
            notification.style.animation = 'none';
            setTimeout(() => {
                notification.style.animation = 'showNotification 4s forwards';
            }, 10);
        }
        
        // Mostra informação de localização temporariamente
        const locationInfo = point.querySelector('.location-info');
        if (locationInfo) {
            locationInfo.classList.add('info-visible');
            
            // Esconder após 4 segundos
            setTimeout(() => {
                locationInfo.classList.remove('info-visible');
            }, 4000);
        }
        
        // Atualizar as linhas de conexão quando um ponto é ativado
        setTimeout(() => {
            createConnectionLines();
        }, 100);
    }
    
    const mapObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            // Quando a seção estiver visível, ativa o primeiro ponto imediatamente
            if (pointIndex < futurePoints.length) {
                activatePoint(futurePoints[pointIndex]);
                pointIndex++;
            }
            
            // Configura um intervalo para ativar um ponto a cada 7 segundos (mais rápido para melhor experiência do usuário)
            intervalId = setInterval(() => {
                if (pointIndex < futurePoints.length) {
                    activatePoint(futurePoints[pointIndex]);
                    pointIndex++;
                } else {
                    // Todos os pontos foram ativados, podemos limpar o intervalo
                    clearInterval(intervalId);
                    
                    // Reset após 5 segundos e comece novamente (loop contínuo)
                    setTimeout(() => {
                        // Resetar todos os pontos para futuros novamente
                        futurePoints.forEach(point => {
                            point.classList.remove('active');
                            point.classList.add('future');
                        });
                        
                        // Resetar o índice
                        pointIndex = 0;
                        
                        // Iniciar a animação novamente após um pequeno delay
                        setTimeout(() => {
                            if (entries[0].isIntersecting) {
                                if (pointIndex < futurePoints.length) {
                                    activatePoint(futurePoints[pointIndex]);
                                    pointIndex++;
                                }
                                
                                // Reinicia o intervalo
                                intervalId = setInterval(() => {
                                    if (pointIndex < futurePoints.length) {
                                        activatePoint(futurePoints[pointIndex]);
                                        pointIndex++;
                                    } else {
                                        clearInterval(intervalId);
                                    }
                                }, 7000);
                            }
                        }, 2000);
                    }, 5000);
                }
            }, 7000); // 7000 ms = 7 segundos
        } else {
            // Se a seção sair da visão, limpa o intervalo
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        }
    });
    
    mapObserver.observe(mapSection);
    
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
