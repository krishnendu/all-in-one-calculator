// ============================================================================
// PWA SERVICE WORKER REGISTRATION
// ============================================================================

class PWAHandler {
    constructor() {
        this.isOnline = navigator.onLine;
        this.registration = null;
        this.init();
    }

    async init() {
        // Register service worker
        if ('serviceWorker' in navigator) {
            try {
                this.registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered successfully:', this.registration);
                this.setupServiceWorkerEvents();
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }

        // Setup online/offline detection
        this.setupOnlineOfflineDetection();
        
        // Setup PWA install prompt
        this.setupInstallPrompt();
    }

    setupServiceWorkerEvents() {
        if (this.registration) {
            // Handle service worker updates
            this.registration.addEventListener('updatefound', () => {
                const newWorker = this.registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        this.showUpdateNotification();
                    }
                });
            });

            // Handle service worker controller change
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('Service Worker controller changed');
                window.location.reload();
            });
        }
    }

    setupOnlineOfflineDetection() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showNotification('You are back online!', 'success');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showNotification('You are offline. App will work with cached data.', 'warning');
        });
    }

    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallPrompt();
        });

        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            this.showNotification('App installed successfully!', 'success');
        });
    }

    showInstallPrompt() {
        const installButton = document.createElement('button');
        installButton.textContent = 'Install App';
        installButton.className = 'install-prompt-btn';
        installButton.onclick = () => {
            if (this.deferredPrompt) {
                this.deferredPrompt.prompt();
                this.deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    } else {
                        console.log('User dismissed the install prompt');
                    }
                    this.deferredPrompt = null;
                });
            }
        };

        // Add install button to the page
        const header = document.querySelector('.header');
        if (header && !document.querySelector('.install-prompt-btn')) {
            header.appendChild(installButton);
        }
    }

    showUpdateNotification() {
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update Available - Click to Update';
        updateButton.className = 'update-notification-btn';
        updateButton.onclick = () => {
            if (this.registration && this.registration.waiting) {
                this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
        };

        // Add update button to the page
        const header = document.querySelector('.header');
        if (header && !document.querySelector('.update-notification-btn')) {
            header.appendChild(updateButton);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `pwa-notification pwa-notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Request notification permission
    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                console.log('Notification permission granted');
                return true;
            }
        }
        return false;
    }

    // Send notification
    sendNotification(title, options = {}) {
        if ('Notification' in window && Notification.permission === 'granted') {
            const defaultOptions = {
                icon: '/icons/icon-192x192.webp',
                badge: '/icons/icon-72x72.webp',
                vibrate: [100, 50, 100]
            };
            
            new Notification(title, { ...defaultOptions, ...options });
        }
    }
}

// ============================================================================
// CALCULATOR CLASS - Handles basic arithmetic operations
// ============================================================================

class Calculator {
    constructor() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        
        this.currentOperandElement = document.getElementById('current-operand');
        this.previousOperandElement = document.getElementById('previous-operand');
        
        this.initializeEventListeners();
    }

    /**
     * Initialize calculator event listeners
     */
    initializeEventListeners() {
        // Number buttons
        document.querySelectorAll('.calc-btn.number').forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.dataset.number);
            });
        });

        // Operator buttons
        document.querySelectorAll('.calc-btn.operator').forEach(button => {
            button.addEventListener('click', () => {
                console.log('Operator clicked:', button.dataset.action);
                this.chooseOperation(button.dataset.action);
            });
        });

        // Equals button
        document.querySelector('.calc-btn.equals').addEventListener('click', () => {
            this.compute();
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardInput(e);
        });
    }

    /**
     * Handle keyboard input for calculator
     */
    handleKeyboardInput(e) {
        const key = e.key;
        
        if (key >= '0' && key <= '9' || key === '.') {
            this.appendNumber(key);
        } else if (key === '+' || key === '-') {
            this.chooseOperation(key === '+' ? 'add' : 'subtract');
        } else if (key === '*') {
            this.chooseOperation('multiply');
        } else if (key === '/') {
            this.chooseOperation('divide');
        } else if (key === 'Enter' || key === '=') {
            this.compute();
        } else if (key === 'Escape') {
            this.clear();
        } else if (key === 'Backspace') {
            this.delete();
        }
    }

    /**
     * Clear calculator display and reset state
     */
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        this.updateDisplay();
    }

    /**
     * Delete last digit from current operand
     */
    delete() {
        if (this.currentOperand === '0' || this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
        this.shouldResetScreen = false;
        this.updateDisplay();
    }

    /**
     * Append number to current operand
     */
    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
        this.updateDisplay();
    }

    /**
     * Choose operation to perform
     */
    chooseOperation(action) {
        console.log('Choosing operation:', action);
        
        if (action === 'delete') {
            this.delete();
            return;
        }
        
        if (action === 'clear') {
            this.clear();
            return;
        }
        
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.compute();
        }

        this.operation = action;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    /**
     * Perform calculation
     */
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case 'add':
                computation = prev + current;
                break;
            case 'subtract':
                computation = prev - current;
                break;
            case 'multiply':
                computation = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    alert('Cannot divide by zero!');
                    return;
                }
                computation = prev / current;
                break;
            case 'percent':
                computation = prev * (current / 100);
                break;
            default:
                return;
        }

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    /**
     * Format number for display
     */
    formatDisplayNumber(number) {
        if (number === '' || number === null || number === undefined) {
            return '';
        }
        
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    /**
     * Update calculator display
     */
    updateDisplay() {
        this.currentOperandElement.textContent = this.formatDisplayNumber(this.currentOperand);
        
        if (this.operation != null && this.previousOperand !== '') {
            const operationSymbols = {
                'add': '+',
                'subtract': '−',
                'multiply': '×',
                'divide': '÷',
                'percent': '%'
            };
            this.previousOperandElement.textContent = 
                `${this.formatDisplayNumber(this.previousOperand)} ${operationSymbols[this.operation]}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }
}

// ============================================================================
// SCIENTIFIC CALCULATOR CLASS - Handles scientific functions
// ============================================================================

class ScientificCalculator extends Calculator {
    constructor() {
        super();
        this.memory = 0;
        this.currentOperandElement = document.getElementById('sci-current-operand');
        this.previousOperandElement = document.getElementById('sci-previous-operand');
        // Don't initialize scientific listeners in constructor - wait for tab activation
        console.log('ScientificCalculator initialized');
    }

    /**
     * Initialize scientific calculator event listeners
     */
    initializeScientificEventListeners() {
        console.log('Initializing scientific calculator event listeners');
        
        // Remove any existing listeners first
        this.removeScientificEventListeners();
        
        // Scientific function buttons
        const scientificButtons = document.querySelectorAll('.calc-btn.scientific');
        console.log('Found scientific buttons:', scientificButtons.length);
        scientificButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Scientific function clicked:', button.dataset.action);
                this.performScientificFunction(button.dataset.action);
            });
        });

        // Memory function buttons
        const memoryButtons = document.querySelectorAll('.calc-btn.memory');
        console.log('Found memory buttons:', memoryButtons.length);
        memoryButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Memory function clicked:', button.dataset.action);
                this.performMemoryFunction(button.dataset.action);
            });
        });

        // Number buttons for scientific calculator
        const numberButtons = document.querySelectorAll('#scientific .calc-btn.number');
        console.log('Found number buttons:', numberButtons.length);
        numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                console.log('Number clicked:', button.dataset.number);
                this.appendNumber(button.dataset.number);
            });
        });

        // Operator buttons for scientific calculator
        const operatorButtons = document.querySelectorAll('#scientific .calc-btn.operator');
        console.log('Found operator buttons:', operatorButtons.length);
        operatorButtons.forEach(button => {
            button.addEventListener('click', () => {
                console.log('Scientific operator clicked:', button.dataset.action);
                this.chooseOperation(button.dataset.action);
            });
        });

        // Equals button for scientific calculator
        const equalsButton = document.querySelector('#scientific .calc-btn.equals');
        console.log('Found equals button:', !!equalsButton);
        if (equalsButton) {
            equalsButton.addEventListener('click', () => {
                console.log('Scientific equals clicked');
                this.compute();
            });
        }

        // Override keyboard support for scientific calculator
        document.addEventListener('keydown', (e) => {
            if (document.getElementById('scientific').classList.contains('active')) {
                this.handleScientificKeyboardInput(e);
            }
        });
        
        console.log('Scientific calculator event listeners initialized');
    }

    /**
     * Remove scientific event listeners to prevent duplicates
     */
    removeScientificEventListeners() {
        // Remove scientific function listeners
        document.querySelectorAll('.calc-btn.scientific').forEach(button => {
            button.replaceWith(button.cloneNode(true));
        });
        
        // Remove memory function listeners
        document.querySelectorAll('.calc-btn.memory').forEach(button => {
            button.replaceWith(button.cloneNode(true));
        });
        
        // Remove basic calculator listeners from scientific tab
        document.querySelectorAll('#scientific .calc-btn.number').forEach(button => {
            button.replaceWith(button.cloneNode(true));
        });
        
        document.querySelectorAll('#scientific .calc-btn.operator').forEach(button => {
            button.replaceWith(button.cloneNode(true));
        });
        
        const equalsButton = document.querySelector('#scientific .calc-btn.equals');
        if (equalsButton) {
            equalsButton.replaceWith(equalsButton.cloneNode(true));
        }
    }

    /**
     * Handle keyboard input for scientific calculator
     */
    handleScientificKeyboardInput(e) {
        const key = e.key;
        
        if (key >= '0' && key <= '9' || key === '.') {
            this.appendNumber(key);
        } else if (key === '+' || key === '-') {
            this.chooseOperation(key === '+' ? 'add' : 'subtract');
        } else if (key === '*') {
            this.chooseOperation('multiply');
        } else if (key === '/') {
            this.chooseOperation('divide');
        } else if (key === 'Enter' || key === '=') {
            this.compute();
        } else if (key === 'Escape') {
            this.clear();
        } else if (key === 'Backspace') {
            this.delete();
        } else if (key === 's' && e.ctrlKey) {
            e.preventDefault();
            this.performScientificFunction('sin');
        } else if (key === 'c' && e.ctrlKey) {
            e.preventDefault();
            this.performScientificFunction('cos');
        } else if (key === 't' && e.ctrlKey) {
            e.preventDefault();
            this.performScientificFunction('tan');
        }
    }

    /**
     * Perform scientific function
     */
    performScientificFunction(action) {
        console.log('Performing scientific function:', action);
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) {
            console.log('Current operand is NaN, using 0');
            this.currentOperand = '0';
            return;
        }

        let result;
        const radians = current * Math.PI / 180; // Convert to radians for trig functions

        switch (action) {
            case 'sin':
                result = Math.sin(radians);
                break;
            case 'cos':
                result = Math.cos(radians);
                break;
            case 'tan':
                result = Math.tan(radians);
                break;
            case 'log':
                if (current <= 0) {
                    alert('Cannot calculate log of non-positive number!');
                    return;
                }
                result = Math.log10(current);
                break;
            case 'ln':
                if (current <= 0) {
                    alert('Cannot calculate ln of non-positive number!');
                    return;
                }
                result = Math.log(current);
                break;
            case 'sqrt':
                if (current < 0) {
                    alert('Cannot calculate square root of negative number!');
                    return;
                }
                result = Math.sqrt(current);
                break;
            case 'power':
                result = Math.pow(current, 2);
                break;
            case 'cube':
                result = Math.pow(current, 3);
                break;
            case 'factorial':
                if (current < 0 || current !== Math.floor(current)) {
                    alert('Factorial is only defined for non-negative integers!');
                    return;
                }
                result = this.factorial(current);
                break;
            case 'inverse':
                if (current === 0) {
                    alert('Cannot divide by zero!');
                    return;
                }
                result = 1 / current;
                break;
            case 'pi':
                result = Math.PI;
                break;
            case 'e':
                result = Math.E;
                break;
            default:
                console.log('Unknown scientific function:', action);
                return;
        }

        console.log('Scientific function result:', result);
        this.currentOperand = result.toString();
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    /**
     * Calculate factorial
     */
    factorial(n) {
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    /**
     * Perform memory function
     */
    performMemoryFunction(action) {
        const current = parseFloat(this.currentOperand);
        
        switch (action) {
            case 'mc':
                this.memory = 0;
                break;
            case 'mr':
                this.currentOperand = this.memory.toString();
                this.shouldResetScreen = true;
                break;
            case 'm-plus':
                this.memory += isNaN(current) ? 0 : current;
                break;
            case 'm-minus':
                this.memory -= isNaN(current) ? 0 : current;
                break;
        }
        
        this.updateDisplay();
    }
}

// ============================================================================
// INVESTMENT CALCULATOR CLASS - Handles investment calculations and comparisons
// ============================================================================

class InvestmentCalculator {
    constructor() {
        this.currentOption = 'fixed-deposit';
        this.interestType = 'compound';
        this.investments = [];
        this.results = [];
        this.chart = null;
        
        this.initializeEventListeners();
        this.setupChart();
    }

    /**
     * Initialize investment calculator event listeners
     */
    initializeEventListeners() {
        // Investment option buttons
        document.querySelectorAll('.option-btn').forEach(button => {
            button.addEventListener('click', () => {
                this.selectOption(button.dataset.option);
            });
        });

        // Interest type buttons
        document.querySelectorAll('.interest-btn').forEach(button => {
            button.addEventListener('click', () => {
                this.selectInterestType(button.dataset.interest);
            });
        });

        // Add investment button
        document.getElementById('add-investment-btn').addEventListener('click', () => {
            this.addInvestment();
        });

        // Calculate button
        document.getElementById('calculate-btn').addEventListener('click', () => {
            this.calculateAllInvestments();
        });

        // Clear all button
        document.getElementById('clear-all-btn').addEventListener('click', () => {
            this.clearAllInvestments();
        });

        // Form validation
        this.setupFormValidation();
    }

    /**
     * Select investment option
     */
    selectOption(option) {
        this.currentOption = option;
        
        // Update active button
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-option="${option}"]`).classList.add('active');
        
        // Update form based on option
        this.updateFormForOption(option);
    }

    /**
     * Select interest type
     */
    selectInterestType(type) {
        this.interestType = type;
        
        // Update active button
        document.querySelectorAll('.interest-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-interest="${type}"]`).classList.add('active');
        
        // Update compounding frequency visibility
        this.updateCompoundingVisibility();
    }

    /**
     * Update form fields based on selected investment option
     */
    updateFormForOption(option) {
        const principalField = document.getElementById('principal');
        const monthlyContributionField = document.getElementById('monthly-contribution');
        
        switch (option) {
            case 'fixed-deposit':
                principalField.disabled = false;
                principalField.placeholder = '100000';
                monthlyContributionField.value = '';
                monthlyContributionField.disabled = true;
                monthlyContributionField.placeholder = 'Not applicable for FD';
                break;
            case 'recurring-deposit':
                principalField.disabled = true;
                principalField.value = '';
                principalField.placeholder = 'Not applicable for RD';
                monthlyContributionField.disabled = false;
                monthlyContributionField.placeholder = '5000';
                break;
            case 'custom-plan':
                principalField.disabled = false;
                principalField.placeholder = '100000';
                monthlyContributionField.disabled = false;
                monthlyContributionField.placeholder = '5000';
                break;
        }
    }

    /**
     * Update compounding frequency visibility based on interest type
     */
    updateCompoundingVisibility() {
        const compoundingField = document.getElementById('compounding-frequency');
        const compoundingLabel = compoundingField.previousElementSibling;
        
        if (this.interestType === 'simple') {
            compoundingField.disabled = true;
            compoundingField.style.opacity = '0.5';
            compoundingLabel.style.opacity = '0.5';
        } else {
            compoundingField.disabled = false;
            compoundingField.style.opacity = '1';
            compoundingLabel.style.opacity = '1';
        }
    }

    /**
     * Setup form validation
     */
    setupFormValidation() {
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateInput(input);
            });
        });
    }

    /**
     * Validate input field
     */
    validateInput(input) {
        const value = parseFloat(input.value);
        const min = parseFloat(input.min);
        const max = parseFloat(input.max);
        
        if (value < min) {
            input.setCustomValidity(`Value must be at least ${min}`);
        } else if (value > max) {
            input.setCustomValidity(`Value must be at most ${max}`);
        } else {
            input.setCustomValidity('');
        }
    }

    /**
     * Add investment to list
     */
    addInvestment() {
        // Get form values
        const principal = parseFloat(document.getElementById('principal').value) || 0;
        const monthlyContribution = parseFloat(document.getElementById('monthly-contribution').value) || 0;
        const interestRate = parseFloat(document.getElementById('interest-rate').value) || 0;
        const compoundingFrequency = document.getElementById('compounding-frequency').value;
        const term = parseFloat(document.getElementById('investment-term').value) || 0;
        const termUnit = document.getElementById('term-unit').value;

        // Validate inputs
        if (!this.validateForm(principal, monthlyContribution, interestRate, term)) {
            return;
        }

        // Convert term to years
        const termInYears = termUnit === 'months' ? term / 12 : term;

        // Create investment object
        const investment = {
            id: Date.now(),
            name: `Investment ${this.investments.length + 1}`,
            type: this.currentOption,
            principal: principal,
            monthlyContribution: monthlyContribution,
            interestRate: interestRate,
            compoundingFrequency: compoundingFrequency,
            termInYears: termInYears,
            interestType: this.interestType
        };

        // Add to investments array
        this.investments.push(investment);

        // Update investment list display
        this.updateInvestmentList();

        // Clear form
        this.clearForm();

        // Show success message
        this.showNotification('Investment added successfully!', 'success');
    }

    /**
     * Update investment list display
     */
    updateInvestmentList() {
        const container = document.getElementById('investment-items');
        
        if (this.investments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-plus-circle"></i>
                    <h4>No investments added</h4>
                    <p>Add your first investment to start comparing</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.investments.map(investment => `
            <div class="investment-item" data-id="${investment.id}">
                <div class="investment-info">
                    <div class="investment-name">${investment.name}</div>
                    <div class="investment-details">
                        ${this.getInvestmentTypeDisplay(investment.type)} | 
                        ${investment.interestRate}% ${investment.interestType} | 
                        ${investment.termInYears} years
                    </div>
                </div>
                <button class="remove-investment" onclick="investmentCalculator.removeInvestment(${investment.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    /**
     * Get investment type display name
     */
    getInvestmentTypeDisplay(type) {
        const types = {
            'fixed-deposit': 'Fixed Deposit',
            'recurring-deposit': 'Recurring Deposit',
            'custom-plan': 'Custom Plan'
        };
        return types[type] || type;
    }

    /**
     * Remove investment from list
     */
    removeInvestment(id) {
        this.investments = this.investments.filter(inv => inv.id !== id);
        this.updateInvestmentList();
        this.showNotification('Investment removed!', 'info');
    }

    /**
     * Clear all investments
     */
    clearAllInvestments() {
        this.investments = [];
        this.results = [];
        this.updateInvestmentList();
        this.hideResults();
        this.showNotification('All investments cleared!', 'info');
    }

    /**
     * Clear form
     */
    clearForm() {
        document.getElementById('principal').value = '';
        document.getElementById('monthly-contribution').value = '';
        document.getElementById('interest-rate').value = '';
        document.getElementById('investment-term').value = '';
    }

    /**
     * Validate form inputs
     */
    validateForm(principal, monthlyContribution, interestRate, term) {
        if (this.currentOption === 'fixed-deposit' && principal <= 0) {
            alert('Please enter a valid principal amount for Fixed Deposit');
            return false;
        }
        if (this.currentOption === 'recurring-deposit' && monthlyContribution <= 0) {
            alert('Please enter a valid monthly contribution for Recurring Deposit');
            return false;
        }
        if (this.currentOption === 'custom-plan' && principal <= 0 && monthlyContribution <= 0) {
            alert('Please enter at least principal amount or monthly contribution for Custom Plan');
            return false;
        }
        if (interestRate <= 0 || interestRate > 20) {
            alert('Please enter a valid interest rate (0-20%)');
            return false;
        }
        if (term <= 0) {
            alert('Please enter a valid investment term');
            return false;
        }
        return true;
    }

    /**
     * Calculate all investments
     */
    calculateAllInvestments() {
        if (this.investments.length === 0) {
            alert('Please add at least one investment to calculate');
            return;
        }

        this.results = [];
        
        this.investments.forEach(investment => {
            let result;
            
            switch (investment.type) {
                case 'fixed-deposit':
                    result = this.calculateFixedDeposit(investment);
                    break;
                case 'recurring-deposit':
                    result = this.calculateRecurringDeposit(investment);
                    break;
                case 'custom-plan':
                    result = this.calculateCustomPlan(investment);
                    break;
            }
            
            if (result) {
                this.results.push(result);
            }
        });

        // Display results
        this.displayResults();
        this.updateChart();
    }

    /**
     * Calculate Fixed Deposit returns
     */
    calculateFixedDeposit(investment) {
        const { principal, interestRate, termInYears, interestType } = investment;
        
        let maturityValue, interestEarned;
        
        if (interestType === 'simple') {
            interestEarned = principal * (interestRate / 100) * termInYears;
            maturityValue = principal + interestEarned;
        } else {
            const n = this.getCompoundingFrequency(investment.compoundingFrequency);
            const r = interestRate / 100;
            maturityValue = principal * Math.pow(1 + r/n, n * termInYears);
            interestEarned = maturityValue - principal;
        }

        const effectiveRate = (Math.pow(maturityValue / principal, 1 / termInYears) - 1) * 100;

        return {
            name: investment.name,
            type: 'Fixed Deposit',
            principal: principal,
            totalContribution: principal,
            interestEarned: interestEarned,
            maturityValue: maturityValue,
            effectiveRate: effectiveRate
        };
    }

    /**
     * Calculate Recurring Deposit returns
     */
    calculateRecurringDeposit(investment) {
        const { monthlyContribution, interestRate, termInYears, interestType } = investment;
        
        let maturityValue, interestEarned;
        
        if (interestType === 'simple') {
            const totalContribution = monthlyContribution * termInYears * 12;
            interestEarned = totalContribution * (interestRate / 100) * termInYears;
            maturityValue = totalContribution + interestEarned;
        } else {
            const n = this.getCompoundingFrequency(investment.compoundingFrequency);
            const r = interestRate / 100;
            const totalMonths = termInYears * 12;
            
            // Calculate maturity value using RD formula
            maturityValue = monthlyContribution * 
                ((Math.pow(1 + r/n, n * termInYears) - 1) / (Math.pow(1 + r/n, n/12) - 1));
            
            const totalContribution = monthlyContribution * totalMonths;
            interestEarned = maturityValue - totalContribution;
        }

        const totalContribution = monthlyContribution * termInYears * 12;
        const effectiveRate = (Math.pow(maturityValue / totalContribution, 1 / termInYears) - 1) * 100;

        return {
            name: investment.name,
            type: 'Recurring Deposit',
            principal: 0,
            totalContribution: totalContribution,
            interestEarned: interestEarned,
            maturityValue: maturityValue,
            effectiveRate: effectiveRate
        };
    }

    /**
     * Calculate Custom Plan returns (FD + RD combined)
     */
    calculateCustomPlan(investment) {
        const { principal, monthlyContribution, interestRate, termInYears, interestType } = investment;
        
        // Calculate FD component
        const fdInvestment = { ...investment, type: 'fixed-deposit' };
        const fdResult = this.calculateFixedDeposit(fdInvestment);
        
        // Calculate RD component
        const rdInvestment = { ...investment, type: 'recurring-deposit' };
        const rdResult = this.calculateRecurringDeposit(rdInvestment);
        
        // Combine results
        const totalContribution = fdResult.totalContribution + rdResult.totalContribution;
        const totalInterestEarned = fdResult.interestEarned + rdResult.interestEarned;
        const totalMaturityValue = fdResult.maturityValue + rdResult.maturityValue;
        const effectiveRate = (Math.pow(totalMaturityValue / totalContribution, 1 / termInYears) - 1) * 100;

        return {
            name: investment.name,
            type: 'Custom Plan (FD + RD)',
            principal: principal,
            totalContribution: totalContribution,
            interestEarned: totalInterestEarned,
            maturityValue: totalMaturityValue,
            effectiveRate: effectiveRate
        };
    }

    /**
     * Get compounding frequency multiplier
     */
    getCompoundingFrequency(frequency) {
        const frequencies = {
            'daily': 365,
            'weekly': 52,
            'monthly': 12,
            'quarterly': 4,
            'half-yearly': 2,
            'yearly': 1
        };
        return frequencies[frequency] || 12;
    }

    /**
     * Display calculation results
     */
    displayResults() {
        const resultsSection = document.getElementById('results-section');
        resultsSection.style.display = 'block';
        
        // Calculate totals
        const totalInvestment = this.results.reduce((sum, r) => sum + r.totalContribution, 0);
        const totalInterest = this.results.reduce((sum, r) => sum + r.interestEarned, 0);
        const totalMaturity = this.results.reduce((sum, r) => sum + r.maturityValue, 0);
        const bestRate = Math.max(...this.results.map(r => r.effectiveRate));
        
        // Update summary cards
        document.getElementById('total-investment').textContent = this.formatCurrency(totalInvestment);
        document.getElementById('total-interest').textContent = this.formatCurrency(totalInterest);
        document.getElementById('total-maturity').textContent = this.formatCurrency(totalMaturity);
        document.getElementById('best-rate').textContent = bestRate.toFixed(2) + '%';

        // Update comparison table
        this.updateComparisonTable();
        
        // Add success animation
        resultsSection.classList.add('success-animation');
        setTimeout(() => {
            resultsSection.classList.remove('success-animation');
        }, 600);
    }

    /**
     * Hide results section
     */
    hideResults() {
        document.getElementById('results-section').style.display = 'none';
    }

    /**
     * Update comparison table
     */
    updateComparisonTable() {
        const tbody = document.getElementById('comparison-tbody');
        tbody.innerHTML = '';

        this.results.forEach(result => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${result.name}</strong></td>
                <td>${result.type}</td>
                <td>${this.formatCurrency(result.principal)}</td>
                <td>${this.formatCurrency(result.totalContribution)}</td>
                <td>${this.formatCurrency(result.interestEarned)}</td>
                <td><strong>${this.formatCurrency(result.maturityValue)}</strong></td>
                <td>${result.effectiveRate.toFixed(2)}%</td>
                <td>
                    <button class="action-btn" onclick="investmentCalculator.removeInvestmentByName('${result.name}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    /**
     * Remove investment by name
     */
    removeInvestmentByName(name) {
        this.investments = this.investments.filter(inv => inv.name !== name);
        this.updateInvestmentList();
        this.calculateAllInvestments();
    }

    /**
     * Setup chart for visualization
     */
    setupChart() {
        const ctx = document.getElementById('investment-chart');
        if (!ctx) return;

        // Simple chart using Canvas API (no external dependencies)
        this.chart = ctx;
        this.chart.width = ctx.offsetWidth;
        this.chart.height = ctx.offsetHeight;
    }

    /**
     * Update chart with new data
     */
    updateChart() {
        if (!this.chart || this.results.length === 0) return;

        const ctx = this.chart.getContext('2d');
        const width = this.chart.width;
        const height = this.chart.height;
        const padding = 40;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Find max values for scaling
        const maxContribution = Math.max(...this.results.map(r => r.totalContribution));
        const maxMaturity = Math.max(...this.results.map(r => r.maturityValue));
        const maxValue = Math.max(maxContribution, maxMaturity);

        // Draw bars
        const barWidth = (width - 2 * padding) / this.results.length;
        const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'];

        this.results.forEach((result, index) => {
            const x = padding + index * barWidth + barWidth / 4;
            const contributionHeight = (result.totalContribution / maxValue) * (height - 2 * padding);
            const maturityHeight = (result.maturityValue / maxValue) * (height - 2 * padding);

            // Draw contribution bar
            ctx.fillStyle = colors[index % colors.length];
            ctx.fillRect(x, height - padding - contributionHeight, barWidth / 2, contributionHeight);

            // Draw maturity bar
            ctx.fillStyle = colors[index % colors.length] + '80';
            ctx.fillRect(x + barWidth / 2, height - padding - maturityHeight, barWidth / 2, maturityHeight);

            // Draw labels
            ctx.fillStyle = '#333';
            ctx.font = '12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(result.name.split(' ')[0], x + barWidth / 4, height - 10);
            ctx.fillText('Total', x + barWidth / 4, height - 25);
            ctx.fillText('Maturity', x + 3 * barWidth / 4, height - 10);
        });

        // Draw legend
        ctx.fillStyle = '#333';
        ctx.font = '14px Inter';
        ctx.textAlign = 'left';
        ctx.fillText('Total Investment', 20, 30);
        ctx.fillText('Maturity Value', 20, 50);
    }

    /**
     * Format currency for display
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : '#17a2b8'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease;
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// ============================================================================
// TAB MANAGER CLASS - Handles tab switching functionality
// ============================================================================

class TabManager {
    constructor() {
        this.currentTab = 'calculator';
        this.initializeEventListeners();
    }

    /**
     * Initialize tab event listeners
     */
    initializeEventListeners() {
        document.querySelectorAll('.tab-btn').forEach(button => {
            button.addEventListener('click', () => {
                this.switchTab(button.dataset.tab);
            });
        });
    }

    /**
     * Switch to specified tab
     */
    switchTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update active tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        this.currentTab = tabName;
        
        // Initialize scientific calculator when switching to scientific tab
        if (tabName === 'scientific' && window.scientificCalculator) {
            setTimeout(() => {
                window.scientificCalculator.initializeScientificEventListeners();
            }, 100);
        }
        
        // Update chart if switching to investment tab
        if (tabName === 'investment' && window.investmentCalculator) {
            setTimeout(() => {
                window.investmentCalculator.setupChart();
                if (window.investmentCalculator.results.length > 0) {
                    window.investmentCalculator.updateChart();
                }
            }, 100);
        }
    }
}

// ============================================================================
// MAIN APPLICATION CLASS - Orchestrates all components
// ============================================================================

class CalculatorApp {
    constructor() {
        this.calculator = null;
        this.scientificCalculator = null;
        this.investmentCalculator = null;
        this.tabManager = null;
        this.pwaHandler = null;
        this.initialize();
    }

    /**
     * Initialize the application
     */
    initialize() {
        // Initialize PWA handler first
        this.pwaHandler = new PWAHandler();
        
        // Initialize components
        this.calculator = new Calculator();
        this.scientificCalculator = new ScientificCalculator();
        this.investmentCalculator = new InvestmentCalculator();
        this.tabManager = new TabManager();

        // Set default values for better UX
        this.setDefaultValues();

        // Add global references for debugging
        window.calculator = this.calculator;
        window.scientificCalculator = this.scientificCalculator;
        window.investmentCalculator = this.investmentCalculator;
        window.pwaHandler = this.pwaHandler;

        console.log('All-in-One Calculator initialized successfully!');
    }

    /**
     * Set default values for form fields
     */
    setDefaultValues() {
        document.getElementById('principal').value = '100000';
        document.getElementById('monthly-contribution').value = '5000';
        document.getElementById('interest-rate').value = '8.5';
        document.getElementById('investment-term').value = '5';
    }
}

// ============================================================================
// INITIALIZATION - Start the application when DOM is loaded
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the main application
    const app = new CalculatorApp();
    
    // Add some helpful console messages
    console.log('🚀 All-in-One Calculator & Investment Tool');
    console.log('📊 Features: Basic Calculator + Scientific Calculator + Investment Comparison');
    console.log('💡 Tip: Use keyboard shortcuts for calculator operations');
    console.log('📱 Responsive design - works on all devices');
    console.log('🔬 Scientific functions: sin, cos, tan, log, ln, sqrt, power, factorial');
    console.log('💰 Investment types: Fixed Deposit, Recurring Deposit, Custom Plans');
    console.log('📈 Interest types: Simple Interest, Compound Interest');
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
