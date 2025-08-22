# 🚀 Vercel Deployment Fix Guide

## Issues Fixed

### 1. **Serverless Compatibility**
- ✅ Removed `process.exit()` calls that crash serverless functions
- ✅ Switched to memory storage for file uploads
- ✅ Added proper error handling for serverless environment
- ✅ Fixed database connection management

### 2. **CORS Configuration**
- ✅ Added Firebase hosting URLs to allowed origins
- ✅ Added proper production URL handling

### 3. **Environment Variables**
- ✅ Added environment variable validation
- ✅ Created Vercel-specific environment template

### 4. **File Structure**
- ✅ Created proper Vercel entry point (`api/index.js`)
- ✅ Updated `vercel.json` configuration

## 🔧 Deployment Steps

### Step 1: Set Up Environment Variables in Vercel

Go to your Vercel dashboard → Project → Settings → Environment Variables

Add these **REQUIRED** variables:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-characters
FRONTEND_URL=https://nazakat-nail-store.web.app
NODE_ENV=production
```

**Optional** (if using PayFast):
```
PAYFAST_MERCHANT_ID=your_merchant_id
PAYFAST_MERCHANT_KEY=your_merchant_key
PAYFAST_PASSPHRASE=your_passphrase
```

### Step 2: Deploy Backend

```bash
cd backend
vercel --prod
```

### Step 3: Update Frontend Environment

After backend deployment, update your frontend `.env.production`:

```bash
# Replace with your actual Vercel backend URL
VITE_API_BASE_URL=https://your-actual-vercel-url.vercel.app/api
VITE_IMAGE_BASE_URL=https://nazakat-nail-store.web.app
```

### Step 4: Deploy Frontend

```bash
cd frontend
npm run build
firebase deploy
```

## 🐛 Common Issues & Solutions

### Issue 1: "FUNCTION_INVOCATION_FAILED"
**Cause**: Missing environment variables
**Solution**: Ensure all required env vars are set in Vercel dashboard

### Issue 2: "MongoDB connection failed"
**Cause**: Invalid MONGO_URI or network restrictions
**Solution**: 
- Verify MongoDB Atlas connection string
- Ensure IP whitelist includes `0.0.0.0/0` for Vercel

### Issue 3: "CORS errors"
**Cause**: Frontend URL not in allowed origins
**Solution**: Add your Firebase hosting URL to CORS origins

### Issue 4: "Authentication not working"
**Cause**: Missing JWT_SECRET
**Solution**: Set JWT_SECRET in Vercel environment variables

## 🔍 Testing the Deployment

### Test Backend Health
```
GET https://your-vercel-url.vercel.app/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Nazakat Backend API is running",
  "timestamp": "2025-08-23T..."
}
```

### Test Authentication
```bash
# Register
POST https://your-vercel-url.vercel.app/api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}

# Login
POST https://your-vercel-url.vercel.app/api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}
```

### Test Product API
```
GET https://your-vercel-url.vercel.app/api/nails
```

## 📝 Notes

### Image Handling
- **Current**: Images are processed in memory (serverless compatible)
- **Recommendation**: Implement Cloudinary or AWS S3 for production image storage
- **Temporary**: Image URLs in database point to placeholder paths

### Database Connection
- Uses connection pooling for serverless efficiency
- Automatically reconnects if connection is lost
- Optimized for Vercel's serverless functions

### File Uploads
- Currently using memory storage (works for small files)
- For production: implement cloud storage integration
- File size limit: 5MB per upload

## 🚀 Production Recommendations

1. **Cloud Storage**: Implement Cloudinary for image uploads
2. **Monitoring**: Add Vercel Analytics and error monitoring
3. **Caching**: Implement Redis for session management
4. **SSL**: Ensure all URLs use HTTPS
5. **Performance**: Add database indexing for better query performance

## 🆘 If Issues Persist

1. Check Vercel function logs: `vercel logs --follow`
2. Verify all environment variables are set
3. Test API endpoints individually
4. Check MongoDB Atlas network access settings
5. Ensure Firebase hosting CORS is properly configured

Your backend should now deploy successfully to Vercel! 🎉
