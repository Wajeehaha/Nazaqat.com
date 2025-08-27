# Vercel Deployment Guide for Nazakat Backend

## 📋 Prerequisites
- Vercel account (sign up at https://vercel.com)
- GitHub repository with your backend code
- Environment variables from your .env file

## 🚀 Step-by-Step Deployment Process

### 1. **Login to Vercel Dashboard**
   - Go to https://vercel.com
   - Sign in with your GitHub account

### 2. **Import Your Project**
   - Click "New Project" or "Import Project"
   - Connect your GitHub account if not already connected
   - Select your repository: `Wajeehaha/Nazaqat.com`
   - Choose the **backend** folder as the root directory

### 3. **Configure Project Settings**
   - **Project Name**: `nazakat-backend` (or your preferred name)
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: Leave empty (not needed for serverless functions)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

### 4. **Set Environment Variables**
   Click "Environment Variables" and add these:

   ```
   DB_USERNAME=wajeehazulfiqar120
   DB_PASSWORD=QNuyv9XGATK43YCg
   JWT_SECRET=2b7e6f8c-4e1a-4c9d-9e2a-7f3b1d6a5c4e
   MONGO_URI=mongodb+srv://wajeehazulfiqar120:QNuyv9XGATK43YCg@cluster0.ke8ivmy.mongodb.net/dachi-store?retryWrites=true&w=majority
   PORT=3000
   EMAIL_USER=wajeehazulfiqar120@gmail.com
   EMAIL_PASS=khqs pfvt nilf imvg
   PAYFAST_MERCHANT_ID=10000100
   PAYFAST_MERCHANT_KEY=46f0cd694581a
   PAYFAST_PASSPHRASE=
   PAYFAST_RETURN_URL=https://nazakat-nail-store.web.app/payment/success
   PAYFAST_CANCEL_URL=https://nazakat-nail-store.web.app/payment/cancel
   PAYFAST_NOTIFY_URL=https://your-backend-url.vercel.app/api/payment/notify
   FRONTEND_URL=https://nazakat-nail-store.web.app
   NODE_ENV=production
   ```

   **⚠️ Important Notes:**
   - Replace `your-backend-url` with your actual Vercel deployment URL
   - Update PayFast URLs to use your production frontend URL
   - All environment variables should be set to "Production" environment

### 5. **Deploy**
   - Click "Deploy"
   - Wait for the deployment to complete (usually 1-2 minutes)

### 6. **Post-Deployment Setup**
   1. **Get your Vercel URL**: Copy the deployment URL (e.g., `https://nazakat-backend.vercel.app`)
   2. **Update PAYFAST_NOTIFY_URL**: 
      - Go to Environment Variables in Vercel dashboard
      - Update `PAYFAST_NOTIFY_URL` to `https://your-actual-url.vercel.app/api/payment/notify`
      - Redeploy the project
   3. **Update Frontend**: Update your frontend's `.env.production` file with the new backend URL

### 7. **Test Your Deployment**
   - Visit `https://your-backend-url.vercel.app/` - Should show "Nazakat API is running..."
   - Test `https://your-backend-url.vercel.app/api/health` - Should return health status
   - Test API endpoints from your frontend

## 🔧 Files Created for Deployment

### `vercel.json` Configuration
- Configures Vercel to use your `api/index.js` as a serverless function
- Routes all requests to your Express app
- Sets maximum execution time to 30 seconds

### `.vercelignore` File
- Excludes unnecessary files from deployment
- Keeps deployment size small and secure

## 🔄 Automatic Deployments
Once set up, Vercel will automatically deploy:
- **Production**: When you push to `main` branch
- **Preview**: When you create pull requests

## 🐛 Troubleshooting

### Common Issues:
1. **Environment Variables**: Ensure all variables are set correctly
2. **CORS Issues**: Check that your frontend URL is in CORS configuration
3. **MongoDB Connection**: Verify MongoDB URI and credentials
4. **PayFast URLs**: Ensure all PayFast URLs use HTTPS in production

### Debugging:
- Check Vercel function logs in the dashboard
- Use `console.log` statements to debug issues
- Monitor the "Functions" tab for execution details

## 📱 Mobile/Additional Configuration
- Your API will work on all devices once deployed
- CORS is configured for your frontend domain
- All endpoints support mobile requests

## 🎉 Success!
Your backend should now be live and accessible from your frontend application!
