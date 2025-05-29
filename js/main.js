document.addEventListener('DOMContentLoaded', function() {
    console.log("Sistema Bancário UNIFACEMS - Inicializando...");
    
    const atm = new SistemaATM();
    
    // Elementos do DOM
    const elements = {
        cardInsertState: document.getElementById('cardInsertState'),
        passwordState: document.getElementById('passwordState'),
        welcomeState: document.getElementById('welcomeState'),
        cardRetainedState: document.getElementById('cardRetainedState'),
        cardCancelState: document.getElementById('cardCancelState'),
        cardCancelConfirmedState: document.getElementById('cardCancelConfirmedState'),
        cardSlot: document.getElementById('cardSlot'),
        insertCardBtn: document.getElementById('insertCardBtn'),
        passwordDisplay: document.getElementById('passwordDisplay'),
        clearBtn: document.getElementById('clearBtn'),
        backspaceBtn: document.getElementById('backspaceBtn'),
        cancelBtn: document.getElementById('cancelBtn'),
        enterBtn: document.getElementById('enterBtn'),
        keyButtons: document.querySelectorAll('.key'),
        alertContainer: document.getElementById('alertContainer'),
        attemptsCounter: document.getElementById('attemptsCounter'),
        progressContainer: document.getElementById('progressContainer'),
        progressBar: document.getElementById('progressBar'),
        securityTimer: document.getElementById('securityTimer'),
        cancelCardSection: document.getElementById('cancelCardSection'),
        cancelCardBtn: document.getElementById('cancelCardBtn'),
        confirmCancelNo: document.getElementById('confirmCancelNo'),
        confirmCancelYes: document.getElementById('confirmCancelYes'),
        cardNumberDisplay: document.getElementById('cardNumberDisplay'),
        returnToMainBtn: document.getElementById('returnToMainBtn')
    };

    // Função que inicializa Barbies flutuantes
    function initBarbieBackgrounds() {
        const barbieImages = [
            'https://i.pinimg.com/736x/15/e8/2e/15e82e247dfcf6502335894eb267a82e.jpg',
            'https://i.pinimg.com/736x/7c/87/76/7c8776bbe237675babb1408b4242b231.jpg',
            'https://i.pinimg.com/736x/7f/22/d9/7f22d9c30ea1ffc3b7bbe410d4cf660b.jpg',
            'https://i.pinimg.com/736x/2a/a6/20/2aa620c8cfe499eb29b744666323c9cf.jpg',
            'https://i.pinimg.com/736x/fe/bc/2e/febc2e4316bb3987f37b6a2470a2a020.jpg',
            'https://i.pinimg.com/736x/b2/b2/e3/b2b2e35b00c08ff868692dab721543fd.jpg',
            'https://i.pinimg.com/736x/1f/86/79/1f867926c647a9d403b6fbc47f52200d.jpg',
            'https://i.pinimg.com/736x/bf/cf/9b/bfcf9bcb20c9b3748291559669350fb0.jpg',
            'https://i.pinimg.com/736x/ba/8d/a5/ba8da5e274f04c967093998b0bdadbca.jpg'
        ];
        
        const container = document.getElementById('barbieBackgrounds');
        container.innerHTML = '';
        
        for (let i = 0; i < 12; i++) {
            const barbie = document.createElement('div');
            barbie.className = 'barbie-background';
            barbie.style.backgroundImage = `url(${barbieImages[i % barbieImages.length]})`;
            barbie.style.left = `${Math.random() * 100}vw`;
            barbie.style.animationDuration = `${10 + Math.random() * 15}s`;
            // barbie.style.animationDelay = `${Math.random() * 5}s`;
            barbie.style.animationDelay = `${Math.random() * 0.1}s`; 
            barbie.style.width = `${60 + Math.random() * 90}px`;
            barbie.style.height = barbie.style.width;
            container.appendChild(barbie);
        }
    }

    // Animação de inserção do cartão
    function animateCardInsertion() {
        elements.cardSlot.classList.add('active');
        setTimeout(() => {
            elements.cardSlot.classList.remove('active');
        }, 3000);
    }

    function insertCard() {
        console.log("Inserindo cartão...");
        elements.insertCardBtn.disabled = true;
        elements.insertCardBtn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Processando...';
        animateCardInsertion();
        
        atm.insertCard(function(response) {
            elements.cardSlot.innerHTML = `
                <p class="m-0">
                    <i class="bi bi-credit-card"></i> Cartão inserido: ${response.cardNumber}
                    <span class="badge bg-success ms-2">Válido</span>
                </p>
            `;
            
            setTimeout(() => {
                elements.cardInsertState.style.display = 'none';
                elements.passwordState.style.display = 'block';
                updateAttemptsCounter();
                elements.insertCardBtn.innerHTML = '<i class="bi bi-arrow-down-circle"></i> Inserir Cartão';
                elements.insertCardBtn.disabled = false;
                showAlert(response.message, 'success');
            }, 1000);
        });
    }

    function appendToPassword(num) {
        if (atm.password.length < 4) {
            atm.password += num;
            updatePasswordDisplay();
        }
    }

    function clearPassword() {
        atm.password = '';
        updatePasswordDisplay();
    }

    function backspace() {
        if (atm.password.length > 0) {
            atm.password = atm.password.slice(0, -1);
            updatePasswordDisplay();
        }
    }

    function updatePasswordDisplay() {
        elements.passwordDisplay.textContent = '💗'.repeat(atm.password.length);
}

    function updateProgressBar() {
        const progress = ((atm.maxAttempts - atm.attempts) / atm.maxAttempts) * 100;
        elements.progressBar.style.width = `${progress}%`;
        elements.progressBar.style.backgroundColor = 
            progress <= 33 ? 'var(--danger-color)' : 
            progress <= 66 ? 'var(--warning-color)' : 
            'var(--primary-color)';
    }

    function updateAttemptsCounter() {
        elements.attemptsCounter.textContent = `Tentativas restantes: ${atm.maxAttempts - atm.attempts}`;
        updateProgressBar();
    }

    function cancelOperation() {
        showAlert('Operação cancelada pelo usuário', 'warning');
        resetToInitialState();
    }

    function validatePassword() {
        if (atm.password.length < 4) {
            showAlert('Por favor, digite os 4 dígitos da senha', 'warning');
            elements.passwordDisplay.classList.add('animate__animated', 'animate__shakeX');
            setTimeout(() => {
                elements.passwordDisplay.classList.remove('animate__animated', 'animate__shakeX');
            }, 1000);
            return;
        }
        
        elements.enterBtn.disabled = true;
        elements.enterBtn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Validando...';
        
        atm.validatePassword(atm.password, function(response) {
            if (response.success) {
                showAlert(response.message, 'success');
                elements.passwordState.style.display = 'none';
                elements.welcomeState.style.display = 'block';
                
                setTimeout(() => {
                    resetToInitialState();
                }, 2000);
            } else {
                elements.enterBtn.disabled = false;
                elements.enterBtn.innerHTML = '<i class="bi bi-check-circle"></i> Entrar';
                updateAttemptsCounter();
                
                if (response.retained) {
                    const overlay = document.createElement('div');
                    overlay.className = 'blocked-overlay';
                    overlay.innerHTML = `
                        <div class="blocked-message">
                            <h3 class="text-danger">Sistema Bloqueado!</h3>
                            <p>Por favor, aguarde o tempo restante</p>
                            <div class="fs-1 fw-bold" id="securityTimer">${atm.lockTimer}</div>
                        </div>
                    `;
                    document.body.appendChild(overlay);

                    atm.startLockTimer(
                        function(timer) {
                            document.getElementById('securityTimer').textContent = timer;
                        },
                        function() {
                            overlay.remove();
                            resetToInitialState();
                            showAlert('Sistema liberado novamente. Você pode tentar novamente.', 'info');
                        }
                    );
                } else {
                    showAlert(response.message, 'danger');
                    elements.passwordState.classList.add('animate__animated', 'animate__shakeX');
                    setTimeout(() => {
                        elements.passwordState.classList.remove('animate__animated', 'animate__shakeX');
                    }, 1000);
                    
                    elements.cardSlot.classList.add('ejecting');
                    setTimeout(() => {
                        elements.cardSlot.classList.remove('ejecting', 'active');
                        elements.cardSlot.innerHTML = '<p class="text-muted m-0"><i class="bi bi-credit-card-2-front"></i> Insira seu cartão novamente</p>';
                        clearPassword();
                    }, 500);
                }
            }
        });
    }

    function showCancelCardDialog() {
        elements.cardInsertState.style.display = 'none';
        elements.cardCancelState.style.display = 'block';
        elements.cardNumberDisplay.textContent = `Cartão: ${atm.fullCardNumber}`;
    }

    function hideCancelCardDialog() {
        elements.cardCancelState.style.display = 'none';
        elements.cardInsertState.style.display = 'block';
    }

    function confirmCardCancellation() {
        atm.cancelCard(function(response) {
            elements.cardCancelState.style.display = 'none';
            elements.cardCancelConfirmedState.style.display = 'block';
            showAlert(response.message, 'success');
        });
    }

    function resetToInitialState() {
        atm.resetSystem();
        clearPassword();
        elements.progressContainer.style.display = 'none';
        
        elements.welcomeState.style.display = 'none';
        elements.cardRetainedState.style.display = 'none';
        elements.cardCancelState.style.display = 'none';
        elements.cardCancelConfirmedState.style.display = 'none';
        elements.passwordState.style.display = 'none';
        elements.cardInsertState.style.display = 'block';
        
        elements.cardSlot.innerHTML = '<p class="text-muted m-0"><i class="bi bi-credit-card-2-front"></i> Insira seu cartão</p>';
        elements.cardSlot.classList.remove('active', 'ejecting');
        elements.insertCardBtn.disabled = false;
        elements.enterBtn.disabled = false;
        elements.enterBtn.innerHTML = '<i class="bi bi-check-circle"></i> Entrar';
    }

    function showAlert(message, type) {
        while (elements.alertContainer.firstChild) {
            elements.alertContainer.removeChild(elements.alertContainer.firstChild);
        }
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show animate__animated animate__fadeInRight`;
        alert.role = 'alert';
        alert.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : 
                type === 'danger' ? 'bi-exclamation-triangle-fill' : 
                type === 'warning' ? 'bi-exclamation-circle-fill' : 
                'bi-info-circle-fill'} me-2"></i>
                <div>${message}</div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        elements.alertContainer.appendChild(alert);
        
        setTimeout(() => {
            alert.classList.add('animate__fadeOutRight');
            setTimeout(() => {
                alert.remove();
            }, 3000);
        }, 3000);
    }

    // Inicialização do sistema
    initBarbieBackgrounds();
    
    // Event Listeners(o que deve acontecer quando o usuário clicar nos botões)
    elements.insertCardBtn.addEventListener('click', insertCard);
    elements.clearBtn.addEventListener('click', clearPassword);
    elements.backspaceBtn.addEventListener('click', backspace);
    elements.cancelBtn.addEventListener('click', cancelOperation);
    elements.enterBtn.addEventListener('click', validatePassword);
    elements.cancelCardBtn.addEventListener('click', showCancelCardDialog);
    elements.confirmCancelNo.addEventListener('click', hideCancelCardDialog);
    elements.confirmCancelYes.addEventListener('click', confirmCardCancellation);
    elements.returnToMainBtn.addEventListener('click', resetToInitialState);
    elements.keyButtons.forEach(button => {
        button.addEventListener('click', () => appendToPassword(button.textContent));
    });

    // Mostra a  seção de cancelamento após 5 segundos
    setTimeout(() => {
        if (elements.cancelCardSection) {
            elements.cancelCardSection.style.display = 'block';
        }
    }, 5000);

    console.log("Sistema inicializado com sucesso!");
});