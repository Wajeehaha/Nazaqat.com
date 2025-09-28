// Local development server for Nazakat Backend
// This file allows you to run the backend locally for development and testing

const app = require('./api/index');
const port = process.env.PORT || 3000;

// Start the server
const server = app.listen(port, () => {
  console.log(`🚀 Nazakat Backend running on port ${port}`.green);
  console.log(`📍 Local URL: http://localhost:${port}`.cyan);
  console.log(`🏥 Health Check: http://localhost:${port}/api/health`.cyan);
  console.log(`📦 Products API: http://localhost:${port}/api/nails`.cyan);
  console.log('');
  console.log('✅ Backend is ready for development!'.green);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('💤 Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('💤 Process terminated');
    process.exit(0);
  });
});
