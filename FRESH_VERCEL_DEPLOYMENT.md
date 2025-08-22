# 🚀 Fresh Vercel Deployment - Step by Step Guide

## Phase 1: Create New Vercel Project

### Step 1: Login to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Make sure you're on the dashboard

### Step 2: Import Your Repository
1. Click **"Add New..."** → **"Project"**
2. Find your **"Nazaqat.com"** repository
3. Click **"Import"** next to it
4. **Important**: Change the **Root Directory** to `backend` (not the default root)
5. Framework Preset: **Other**
6. Click **"Deploy"** (it will fail initially - that's expected)

### Step 3: Configure Project Settings
After the failed deployment:
1. Go to **Settings** → **General**
2. Set **Root Directory** to `backend`
3. **Build Command**: Leave empty
4. **Output Directory**: Leave empty
5. **Install Command**: `npm install`

---

## Phase 2: Set Environment Variables

### Step 4: Add Environment Variables
Go to **Settings** → **Environment Variables** and add these one by one:

#### Required Variables:
```
MONGO_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
Environment: Production
```

```
JWT_SECRET
Value: nazakat-super-secure-jwt-secret-key-2025-production
Environment: Production
```

```
NODE_ENV
Value: production
Environment: Production
```

```
FRONTEND_URL
Value: https://nazakat-nail-store.web.app
Environment: Production
```

#### Optional (PayFast - if you're using payments):
```
PAYFAST_MERCHANT_ID
Value: your_merchant_id
Environment: Production
```

```
PAYFAST_MERCHANT_KEY
Value: your_merchant_key
Environment: Production
```

```
PAYFAST_PASSPHRASE
Value: your_passphrase
Environment: Production
```

### Step 5: Add MongoDB Database Details
You'll need your actual MongoDB credentials. If you don't have them:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Sign in to your account
3. Go to your cluster → **Connect** → **Connect your application**
4. Copy the connection string
5. Replace `<username>`, `<password>`, and `<dbname>` with actual values

---

## Phase 3: Deploy Backend

### Step 6: Trigger Deployment
1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Check **"Use existing Build Cache"**: ❌ (unchecked)
4. Click **"Redeploy"**

### Step 7: Monitor Deployment
1. Watch the build logs in real-time
2. If successful, you'll get a green ✅ status
3. Note down your new Vercel URL (something like: `https://nazakat-com-xyz123.vercel.app`)

### Step 8: Test Backend API
Test these endpoints:

1. **Health Check**: `https://your-new-vercel-url.vercel.app/api/health`
   Should return: `{"status":"OK","message":"Nazakat Backend API is running"}`

2. **Products**: `https://your-new-vercel-url.vercel.app/api/nails`
   Should return: Array of nail products

3. **Auth Test**: Try registering a user:
   ```bash
   POST https://your-new-vercel-url.vercel.app/api/auth/register
   {
     "name": "Test User",
     "email": "test@example.com", 
     "password": "password123"
   }
   ```

---

## Phase 4: Update Frontend

### Step 9: Update Frontend Environment
1. Open your `frontend/.env.production` file
2. Replace the URL with your new Vercel URL:

```bash
# Replace with your NEW Vercel URL
VITE_API_BASE_URL=https://your-new-vercel-url.vercel.app/api
VITE_IMAGE_BASE_URL=https://nazakat-nail-store.web.app
```

### Step 10: Redeploy Frontend
```bash
cd frontend
npm run build
firebase deploy
```

---

## Phase 5: Final Testing

### Step 11: Test Complete Application
1. Visit your Firebase hosting URL: `https://nazakat-nail-store.web.app`
2. Test these features:
   - ✅ Browse products
   - ✅ Register new account
   - ✅ Login with account
   - ✅ Add items to cart
   - ✅ View cart
   - ✅ Place order (if PayFast is configured)

### Step 12: Common Issues & Solutions

#### Issue: "Cannot connect to backend"
**Solution**: Check if CORS is working
- Add your Firebase URL to Vercel environment variables:
```
FRONTEND_URL=https://nazakat-nail-store.web.app
```

#### Issue: "Database connection failed"
**Solution**: Check MongoDB Atlas
- Ensure IP whitelist includes `0.0.0.0/0`
- Verify connection string is correct

#### Issue: "Authentication not working"
**Solution**: Verify JWT_SECRET
- Must be at least 32 characters long
- Should be set in Vercel environment variables

#### Issue: "CORS errors"
**Solution**: Check allowed origins
- Firebase hosting URL should be in CORS origins
- Check browser console for specific CORS errors

---

## 📋 Deployment Checklist

### Before You Start:
- [ ] MongoDB Atlas credentials ready
- [ ] GitHub repository accessible
- [ ] Firebase project deployed

### Vercel Setup:
- [ ] New Vercel project created
- [ ] Root directory set to `backend`
- [ ] All environment variables added
- [ ] First deployment successful

### Testing:
- [ ] `/api/health` endpoint works
- [ ] `/api/nails` returns products
- [ ] Authentication endpoints work
- [ ] Frontend connects to backend
- [ ] Cart functionality works
- [ ] Orders can be placed

### Production Ready:
- [ ] All features tested
- [ ] Error monitoring enabled
- [ ] Performance optimized
- [ ] Security headers configured

---

## 🆘 Need Help?

If you encounter any issues during deployment:

1. **Check Vercel Function Logs**:
   - Go to Vercel Dashboard → Deployments → Click on latest deployment → View Function Logs

2. **Check Environment Variables**:
   - Ensure all required variables are set
   - No typos in variable names
   - Values are correct (especially MongoDB URI)

3. **Test API Individually**:
   - Use Postman or browser to test each endpoint
   - Start with `/api/health` first

4. **Common Commands**:
   ```bash
   # Check Vercel status
   vercel ls
   
   # View logs
   vercel logs
   
   # Redeploy
   vercel --prod
   ```

Ready to start? Let me know when you've created the new Vercel project and I'll help you through each step! 🚀
