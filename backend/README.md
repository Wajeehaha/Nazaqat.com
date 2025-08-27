# 🚀 Quick Vercel Deployment Guide

## Manual Deployment via Vercel CLI

### Prerequisites
1. Install Vercel CLI: `npm install -g vercel`
2. Login to Vercel: `vercel login`

### Deploy Commands
```powershell
# Navigate to backend directory
cd backend

# Deploy to production
vercel --prod

# Or use the deployment script
.\deploy.ps1
```

### Environment Variables
Add these in Vercel Dashboard > Settings > Environment Variables:
- `MONGO_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secure JWT secret (32+ characters)
- `NODE_ENV` - Set to "production"
- `FRONTEND_URL` - Your frontend URL

### Project Structure
```
backend/
├── .vercel/          # Vercel configuration
├── api/index.js      # Serverless entry point
├── vercel.json       # Deployment configuration
├── server.js         # Main Express server
├── deploy.ps1        # Deployment script
└── .env.template     # Environment variables template
```

### Test Endpoints
After deployment, test:
- `/api/health` - Health check
- `/api/nails` - Products API
- `/` - Root endpoint

### Troubleshooting
- Ensure environment variables are set
- Check function logs in Vercel dashboard
- Verify MongoDB connection string
