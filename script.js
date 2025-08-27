document.addEventListener('DOMContentLoaded', function() {
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
                message: document.getElementById('message').value,
                date: new Date().toISOString()
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
            
            // OPÇÃO 3: Google Sheets via Google Apps Script (Gratuito)
            const scriptURL = 'https://script.google.com/macros/s/AKfycbyzPT6w80w0pAa7vJ5IOvrcKcAvLthYJMpDJ8GxJr97QCQK-DssnRjn-A-6D357gF58/exec';
            
            // Mostrar indicador de carregamento
            showFormStatus('info', 'Enviando formulário para o Google Sheets...');
            
            fetch(scriptURL, { 
                method: 'POST', 
                body: new FormData(contactForm)
            })
            .then(response => {
                console.log('Resposta:', response);
                showFormStatus('success', 'Formulário enviado com sucesso! Entraremos em contato em breve.');
                contactForm.reset();
            })
            .catch(error => {
                console.error('Erro:', error);
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
    
    const mapObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            // Quando a seção estiver visível, ativa o primeiro ponto imediatamente
            if (pointIndex < futurePoints.length) {
                futurePoints[pointIndex].classList.remove('future');
                futurePoints[pointIndex].classList.add('active');
                pointIndex++;
            }
            
            // Configura um intervalo para ativar um ponto a cada 10 segundos
            intervalId = setInterval(() => {
                if (pointIndex < futurePoints.length) {
                    futurePoints[pointIndex].classList.remove('future');
                    futurePoints[pointIndex].classList.add('active');
                    pointIndex++;
                } else {
                    // Todos os pontos foram ativados, podemos limpar o intervalo
                    clearInterval(intervalId);
                }
            }, 10000); // 10000 ms = 10 segundos
        } else {
            // Se a seção sair da visão, limpa o intervalo
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        }
    });
    
    mapObserver.observe(mapSection);
});
