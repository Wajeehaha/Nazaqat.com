const crypto = require('crypto');

// PayFast configuration - move these to environment variables
const PAYFAST_CONFIG = {
    merchant_id: process.env.PAYFAST_MERCHANT_ID || '10000100', // Use your actual merchant ID
    merchant_key: process.env.PAYFAST_MERCHANT_KEY || '46f0cd694581a', // Use your actual merchant key
    passphrase: process.env.PAYFAST_PASSPHRASE || '', // PayFast passphrase if you have one
    return_url: process.env.PAYFAST_RETURN_URL || 'http://localhost:5173/payment/success',
    cancel_url: process.env.PAYFAST_CANCEL_URL || 'http://localhost:5173/payment/cancel',
    notify_url: process.env.PAYFAST_NOTIFY_URL || 'http://localhost:3000/api/payment/notify',
    sandbox: process.env.NODE_ENV !== 'production' // Use sandbox for development
};

// Generate PayFast signature
const generateSignature = (data, passPhrase = '') => {
    // Create parameter string
    let pfOutput = '';
    for (let key in data) {
        if (data.hasOwnProperty(key) && data[key] !== '') {
            pfOutput += `${key}=${encodeURIComponent(data[key].toString().trim()).replace(/%20/g, '+')}&`;
        }
    }
    
    // Remove last ampersand
    pfOutput = pfOutput.slice(0, -1);
    
    // Add passphrase if provided
    if (passPhrase !== '') {
        pfOutput += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, '+')}`;
    }
    
    // Generate signature
    return crypto.createHash('md5').update(pfOutput).digest('hex');
};

// Validate PayFast signature
const validateSignature = (data, signature, passPhrase = '') => {
    const calculatedSignature = generateSignature(data, passPhrase);
    return calculatedSignature === signature;
};

// Create PayFast payment data
const createPaymentData = (orderData) => {
    const {
        merchant_id,
        merchant_key,
        return_url,
        cancel_url,
        notify_url
    } = PAYFAST_CONFIG;

    const paymentData = {
        merchant_id,
        merchant_key,
        return_url,
        cancel_url,
        notify_url,
        name_first: orderData.customer.firstName,
        name_last: orderData.customer.lastName,
        email_address: orderData.customer.email,
        m_payment_id: orderData.orderId,
        amount: orderData.amount.toFixed(2),
        item_name: orderData.itemName || `Nazakat Order #${orderData.orderId}`,
        item_description: orderData.description || 'Nail products from Nazakat Store'
    };

    // Generate signature
    const signature = generateSignature(paymentData, PAYFAST_CONFIG.passphrase);
    paymentData.signature = signature;

    return paymentData;
};

// Get PayFast URL
const getPayFastUrl = () => {
    return PAYFAST_CONFIG.sandbox 
        ? 'https://sandbox.payfast.co.za/eng/process'
        : 'https://www.payfast.co.za/eng/process';
};

// Verify payment from PayFast
const verifyPayment = async (data) => {
    const { signature, ...paymentData } = data;
    
    // Validate signature
    if (!validateSignature(paymentData, signature, PAYFAST_CONFIG.passphrase)) {
        throw new Error('Invalid signature');
    }

    // Additional verification can be added here
    // e.g., checking with PayFast servers for payment confirmation

    return {
        isValid: true,
        paymentStatus: data.payment_status,
        paymentId: data.m_payment_id,
        pfPaymentId: data.pf_payment_id,
        amount: parseFloat(data.amount_gross)
    };
};

module.exports = {
    PAYFAST_CONFIG,
    generateSignature,
    validateSignature,
    createPaymentData,
    getPayFastUrl,
    verifyPayment
};
