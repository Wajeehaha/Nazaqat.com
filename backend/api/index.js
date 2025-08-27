// Vercel serverless function entry point
const app = require('../server');

// Debug logging for Vercel
console.log('🚀 Serverless function started');

// Export the Express app directly for Vercel
module.exports = app;
