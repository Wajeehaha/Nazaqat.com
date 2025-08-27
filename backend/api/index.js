// Vercel serverless function entry point
const app = require('../server');

// Export a proper handler function for Vercel
module.exports = async (req, res) => {
    try {
        // Add CORS headers for preflight requests
        if (req.method === 'OPTIONS') {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
            res.status(200).end();
            return;
        }

        // Log the request for debugging
        console.log(`📡 ${req.method} ${req.url} - ${new Date().toISOString()}`);

        // Handle the request with Express app
        return app(req, res);
    } catch (error) {
        console.error('❌ Serverless function error:', error);
        res.status(500).json({ 
            error: 'Internal Server Error',
            message: 'Function invocation failed',
            timestamp: new Date().toISOString()
        });
    }
};
