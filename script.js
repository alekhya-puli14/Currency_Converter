// DOM Elements
const amountEl = document.getElementById('amount');
const fromCurrencyEl = document.getElementById('from-currency');
const toCurrencyEl = document.getElementById('to-currency');
const swapBtn = document.getElementById('swap-btn');
const convertBtn = document.getElementById('convert-btn');
const rateInfoEl = document.getElementById('rate-info');
const convertedAmountEl = document.getElementById('converted-amount');
const lastUpdatedEl = document.getElementById('last-updated');
const popularConversionsEl = document.getElementById('popular-conversions');

// Popular currency pairs for quick reference
const popularPairs = [
    { from: 'USD', to: 'EUR' },
    { from: 'EUR', to: 'USD' },
    { from: 'GBP', to: 'USD' },
    { from: 'USD', to: 'JPY' },
    { from: 'USD', to: 'INR' },
    { from: 'EUR', to: 'GBP' }
];

// Exchange rate cache
let exchangeRates = {};
let lastUpdated = null;

// Initialize the app
function init() {
    // Load currencies and set default values
    loadCurrencies();
    
    // Fetch exchange rates
    fetchExchangeRates();
    
    // Set up event listeners
    amountEl.addEventListener('input', calculate);
    fromCurrencyEl.addEventListener('change', calculate);
    toCurrencyEl.addEventListener('change', calculate);
    swapBtn.addEventListener('click', swapCurrencies);
    convertBtn.addEventListener('click', calculate);
    
    // Initial calculation
    calculate();
}

// Fetch exchange rates from API
async function fetchExchangeRates() {
    try {
        rateInfoEl.textContent = 'Loading exchange rates...';
        rateInfoEl.classList.add('loading');
        
        // Note: In a production app, you would use a real API with your API key
        // For this example, we'll simulate API response with a few hardcoded rates
        // and random variations to simulate real-time data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Base currency is USD (free APIs typically have USD as base)
        const baseCurrency = 'USD';
        
        // Simulated response data
        const response = {
            success: true,
            timestamp: Math.floor(Date.now() / 1000),
            base: baseCurrency,
            date: new Date().toISOString().split('T')[0],
            rates: {
                USD: 1,
                EUR: getRandomRate(0.85, 0.95),
                GBP: getRandomRate(0.75, 0.85),
                JPY: getRandomRate(130, 150),
                AUD: getRandomRate(1.3, 1.5),
                CAD: getRandomRate(1.2, 1.4),
                CHF: getRandomRate(0.9, 1.0),
                CNY: getRandomRate(6.5, 7.5),
                INR: getRandomRate(75, 85)
            }
        };
        
        if (response.success) {
            exchangeRates = response.rates;
            lastUpdated = new Date(response.timestamp * 1000);
            lastUpdatedEl.textContent = lastUpdated.toLocaleString();
            
            // Update UI
            calculate();
            updatePopularConversions();
            
            rateInfoEl.classList.remove('loading');
        } else {
            throw new Error('Failed to fetch exchange rates');
        }
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        rateInfoEl.textContent = 'Error loading exchange rates. Using default rates.';
        rateInfoEl.classList.remove('loading');
        
        // Fallback rates if API fails
        exchangeRates = {
            USD: 1,
            EUR: 0.92,
            GBP: 0.79,
            JPY: 142,
            AUD: 1.47,
            CAD: 1.34,
            CHF: 0.89,
            CNY: 7.24,
            INR: 82.89
        };
        lastUpdated = new Date();
        lastUpdatedEl.textContent = 'offline data';
        
        calculate();
        updatePopularConversions();
    }
}

// Helper function to get random rate for simulation
function getRandomRate(min, max) {
    return (Math.random() * (max - min) + min).toFixed(6);
}

// Calculate conversion
function calculate() {
    const amount = parseFloat(amountEl.value);
    const fromCurrency = fromCurrencyEl.value;
    const toCurrency = toCurrencyEl.value;
    
    if (isNaN(amount) || amount < 0) {
        convertedAmountEl.textContent = 'Invalid amount';
        return;
    }
    
    // If we have exchange rates
    if (Object.keys(exchangeRates).length > 0) {
        // Convert from USD to target (if base is USD)
        let fromRate = exchangeRates[fromCurrency];
        let toRate = exchangeRates[toCurrency];
        
        // Calculate the conversion
        const convertedAmount = (amount / fromRate) * toRate;
        
        // Display result
        convertedAmountEl.textContent = convertedAmount.toFixed(2);
        
        // Display rate info
        const rate = (toRate / fromRate).toFixed(6);
        rateInfoEl.textContent = `1 ${fromCurrency} = ${rate} ${toCurrency}`;
    } else {
        convertedAmountEl.textContent = '0.00';
        rateInfoEl.textContent = 'Exchange rates not available';
    }
}

// Swap currencies
function swapCurrencies() {
    const temp = fromCurrencyEl.value;
    fromCurrencyEl.value = toCurrencyEl.value;
    toCurrencyEl.value = temp;
    calculate();
}

// Update popular conversions section
function updatePopularConversions() {
    if (Object.keys(exchangeRates).length === 0) return;
    
    popularConversionsEl.innerHTML = '';
    
    popularPairs.forEach(pair => {
        const fromRate = exchangeRates[pair.from];
        const toRate = exchangeRates[pair.to];
        
        if (fromRate && toRate) {
            const rate = (toRate / fromRate).toFixed(6);
            
            const conversionItem = document.createElement('div');
            conversionItem.className = 'conversion-item';
            conversionItem.innerHTML = `
                <div>${pair.from} to ${pair.to}</div>
                <div class="conversion-rate">1 ${pair.from} = ${rate} ${pair.to}</div>
            `;
            
            // Add click handler to set these currencies
            conversionItem.addEventListener('click', () => {
                fromCurrencyEl.value = pair.from;
                toCurrencyEl.value = pair.to;
                calculate();
            });
            
            popularConversionsEl.appendChild(conversionItem);
        }
    });
}

// Initialize currency dropdowns
function loadCurrencies() {
    // In a real app, you might fetch this from an API
    const currencies = [
        { code: 'USD', name: 'United States Dollar' },
        { code: 'EUR', name: 'Euro' },
        { code: 'GBP', name: 'British Pound' },
        { code: 'JPY', name: 'Japanese Yen' },
        { code: 'AUD', name: 'Australian Dollar' },
        { code: 'CAD', name: 'Canadian Dollar' },
        { code: 'CHF', name: 'Swiss Franc' },
        { code: 'CNY', name: 'Chinese Yuan' },
        { code: 'INR', name: 'Indian Rupee' }
    ];
    
    // Populate dropdowns
    currencies.forEach(currency => {
        const option1 = document.createElement('option');
        option1.value = currency.code;
        option1.textContent = `${currency.code} - ${currency.name}`;
        
        const option2 = option1.cloneNode(true);
        
        fromCurrencyEl.appendChild(option1);
        toCurrencyEl.appendChild(option2);
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);