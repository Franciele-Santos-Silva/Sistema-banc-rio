class SistemaATM {
    constructor() {
        this.currentState = 'cardInsert';
        this.password = '';
        this.attempts = 0;
        this.maxAttempts = 3;
        this.correctPassword = '1234';
        this.cardNumber = '•••• •••• •••• 3456';
        this.fullCardNumber = '1234567890123456';
        this.lockTimer = 120;
        this.timerInterval = null;
    }

    insertCard(callback) {
        setTimeout(() => {
            this.currentState = 'passwordEntry';
            callback({
                success: true,
                message: 'Cartão reconhecido. Insira sua senha.',
                cardNumber: this.cardNumber
            });
        }, 1500);
    }

    validatePassword(password, callback) {
        setTimeout(() => {
            if (password === this.correctPassword) {
                this.attempts = 0;
                callback({
                    success: true,
                    message: 'Autenticação bem-sucedida!'
                });
            } else {
                this.attempts++;
                if (this.attempts >= this.maxAttempts) {
                    callback({
                        success: false,
                        message: 'Medidas de segurança ativadas! Cartão retido temporariamente.',
                        retained: true
                    });
                } else {
                    callback({
                        success: false,
                        message: `Senha incorreta! Tentativas restantes: ${this.maxAttempts - this.attempts}`,
                        attemptsLeft: this.maxAttempts - this.attempts
                    });
                }
            }
        }, 1500);
    }

    startLockTimer(updateCallback, finishCallback) {
        this.updateTimerDisplay(updateCallback);
        this.timerInterval = setInterval(() => {
            this.lockTimer--;
            this.updateTimerDisplay(updateCallback);
            
            // Bloqueia interações
            document.querySelectorAll('button').forEach(btn => {
                btn.disabled = true;
            });

            if (this.lockTimer <= 0) {
                clearInterval(this.timerInterval);

                // Reativa interações
                document.querySelectorAll('button').forEach(btn => {
                    btn.disabled = false;
                });
                finishCallback();
            }
        }, 1000);
    }

    updateTimerDisplay(callback) {
        const minutes = Math.floor(this.lockTimer / 60);
        const seconds = this.lockTimer % 60;
        callback(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }

    cancelCard(callback) {
        setTimeout(() => {
            callback({
                success: true,
                message: 'Cartão cancelado com sucesso!'
            });
        }, 1000);
    }

    resetSystem() {
        this.password = '';
        this.attempts = 0;
        this.lockTimer = 120;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        this.currentState = 'cardInsert';
    }
}