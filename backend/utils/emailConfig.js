// Email configuration for handling image URLs in different environments
const getEmailConfig = () => {
  // Check if we're in production or development
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Get base URL - prioritize production URL if available
  let baseURL = process.env.BASE_URL || process.env.PRODUCTION_URL || 'http://localhost:3000';
  
  // If in production and no production URL is set, warn the user
  if (isProduction && baseURL.includes('localhost')) {
    console.warn('⚠️  WARNING: Using localhost URL in production environment. Set PRODUCTION_URL environment variable.');
  }
  
  console.log(`📧 Email service configured with base URL: ${baseURL}`);
  
  return {
    baseURL,
    isProduction
  };
};

// Function to ensure image URLs are absolute for email templates
const getAbsoluteImageUrl = (imageUrl, baseURL) => {
  if (!imageUrl) {
    // Return embedded SVG as data URL for maximum compatibility
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXIpIiByeD0iOCIvPgo8dGV4dCB4PSIzMCIgeT0iNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfkpU8L3RleHQ+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXIiIHgxPSIwIiB5MT0iMCIgeDI9IjYwIiB5Mj0iNjAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0VDNDg5OSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNCRTE4NUQiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K';
  }
  
  // If already absolute URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  
  // Handle relative paths
  if (imageUrl.startsWith('/uploads/')) {
    return `${baseURL}${imageUrl}`;
  } else if (imageUrl.startsWith('/')) {
    return `${baseURL}${imageUrl}`;
  } else if (imageUrl.startsWith('uploads/')) {
    return `${baseURL}/${imageUrl}`;
  } else {
    // Assume it's just a filename
    return `${baseURL}/uploads/${imageUrl}`;
  }
};

module.exports = {
  getEmailConfig,
  getAbsoluteImageUrl
};
