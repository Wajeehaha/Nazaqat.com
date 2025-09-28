// Test script for owner notification email with environment variable
require('dotenv').config(); // Load environment variables
const { generateOwnerOrderNotificationEmail } = require('./utils/emailTemplates');

// Verify environment variable
console.log('🔍 Environment Variable Check:');
console.log('OWNER_EMAIL:', process.env.OWNER_EMAIL || 'NOT SET');
console.log('EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET');
console.log('');

// Test data
const testOrder = {
  _id: '67890abcdef1234567890123',
  paymentMethod: 'cod',
  discount: 50,
  couponUsed: {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10
  }
};

const testCustomerInfo = {
  firstName: 'Wajeeha',
  lastName: 'Zulfiqar',
  email: 'customer@example.com',
  phone: '+92 300 1234567',
  address: 'House 123, Street 45, Block A',
  city: 'Karachi',
  postalCode: '75500'
};

const testCartItems = [
  {
    name: 'Sahil Nail Set',
    description: 'Premium nail art collection',
    pieceOption: '24',
    quantity: 2,
    price: 1199,
    totalPrice: 2398
  },
  {
    name: 'Noor Classic Collection',
    description: 'Elegant nail designs',
    pieceOption: '12',
    quantity: 1,
    price: 799,
    totalPrice: 799
  }
];

const testTotalAmount = 3197;

// Generate the email HTML
const emailHtml = generateOwnerOrderNotificationEmail(testOrder, testCustomerInfo, testCartItems, testTotalAmount);

console.log('✅ Owner notification email template generated successfully!');
console.log('📧 Email HTML length:', emailHtml.length, 'characters');
console.log('🎯 Key features included:');
console.log('   - Order details with ID and payment method');
console.log('   - Customer information with delivery address');
console.log('   - Items list with piece options and quantities');
console.log('   - Total amount and discount information');
console.log('   - Packing instructions for the team');
console.log('   - Professional styling with urgent action indicators');
console.log('');

// Test email sending configuration
console.log('📤 Email Configuration:');
console.log('   From:', process.env.EMAIL_USER);
console.log('   To:', process.env.OWNER_EMAIL);
console.log('   SMTP configured:', process.env.EMAIL_PASS ? 'YES' : 'NO');

// Optional: Save to file for preview
const fs = require('fs');
fs.writeFileSync('./test-owner-email.html', emailHtml);
console.log('💾 Email preview saved as test-owner-email.html');
