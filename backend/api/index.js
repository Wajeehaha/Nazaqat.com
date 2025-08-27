// Vercel serverless function entry point
const app = require('../server');

// Debug logging for Vercel
console.log('🚀 Serverless function started');

// For Vercel, we need to export as a function
module.exports = (req, res) => {
    console.log(`📡 Request: ${req.method} ${req.url}`);
    return app(req, res);
};
