# 🔧 Backend URL Configuration Fix

## 🎯 **Issue Identified:**
Your backend is deployed at `https://shopnazaqat-com.vercel.app` but your environment variables were pointing to different URLs.

## ✅ **Fixes Applied:**

### 1. **Updated Frontend Environment**
- Fixed `VITE_API_BASE_URL` to point to `https://shopnazaqat-com.vercel.app/api`

### 2. **Updated Backend Environment Template**
- Updated `PAYFAST_NOTIFY_URL` to use correct backend URL

## 🚨 **CRITICAL: Update Vercel Environment Variables**

You need to update these environment variables in your Vercel dashboard:

### **Go to Vercel Dashboard → Your Project → Settings → Environment Variables**

Update these variables:
```
PAYFAST_NOTIFY_URL=https://shopnazaqat-com.vercel.app/api/payment/notify
FRONTEND_URL=https://nazakat-nail-store.web.app
```

## 🧪 **Test Your Backend:**

### **Quick Tests:**
1. **Root URL**: https://shopnazaqat-com.vercel.app/
   - Should show: `{"message": "Nazakat API is running...", ...}`

2. **Health Check**: https://shopnazaqat-com.vercel.app/api/health
   - Should show: `{"status": "OK", "message": "Nazakat Backend API is running"}`

3. **Products API**: https://shopnazaqat-com.vercel.app/api/nails
   - Should return array of nail products

## 🔄 **Next Steps:**

1. **Update Vercel Environment Variables** (as shown above)
2. **Redeploy** your backend after updating environment variables
3. **Test all endpoints** to ensure they're working
4. **Rebuild and redeploy frontend** to use the new backend URL

## 📋 **Frontend Rebuild Required:**
After updating the frontend environment variables, you need to rebuild and redeploy your frontend:

```bash
cd frontend
npm run build
# Deploy to Firebase
```

---

## ⚡ **Quick Command Summary:**
If the backend still shows errors, check the Vercel function logs in your dashboard for more detailed error information.
