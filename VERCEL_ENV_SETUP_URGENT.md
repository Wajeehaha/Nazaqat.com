# 🔧 URGENT: Fix Database Connection Error

## 🚨 **Current Issue:**
Your backend is showing: `{"error": "Database Connection Error", "message": "Failed to connect to database"}`

This means the environment variables are **NOT SET** in your Vercel deployment.

## ⚡ **IMMEDIATE FIX - Set Environment Variables in Vercel:**

### **Step 1: Go to Vercel Dashboard**
1. Visit [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Find and click on your project: **`shopnazaqat-com`**
3. Click **Settings** tab
4. Click **Environment Variables** in the left sidebar

### **Step 2: Add These Environment Variables**
Click **"Add"** and enter each variable:

```bash
# Database Configuration (REQUIRED)
MONGO_URI
mongodb+srv://wajeehazulfiqar120:QNuyv9XGATK43YCg@cluster0.ke8ivmy.mongodb.net/dachi-store?retryWrites=true&w=majority

# Alternative Database Credentials
DB_USERNAME
wajeehazulfiqar120

DB_PASSWORD
QNuyv9XGATK43YCg

# JWT Secret (REQUIRED)
JWT_SECRET
2b7e6f8c-4e1a-4c9d-9e2a-7f3b1d6a5c4e

# Email Configuration
EMAIL_USER
wajeehazulfiqar120@gmail.com

EMAIL_PASS
khqs pfvt nilf imvg

# PayFast Configuration
PAYFAST_MERCHANT_ID
10000100

PAYFAST_MERCHANT_KEY
46f0cd694581a

PAYFAST_PASSPHRASE
(leave empty)

PAYFAST_RETURN_URL
https://nazakat-nail-store.web.app/payment/success

PAYFAST_CANCEL_URL
https://nazakat-nail-store.web.app/payment/cancel

PAYFAST_NOTIFY_URL
https://shopnazaqat-com.vercel.app/api/payment/notify

# Frontend URL
FRONTEND_URL
https://nazakat-nail-store.web.app

# Environment
NODE_ENV
production
```

### **Step 3: Deploy**
After adding all variables:
1. Click **"Redeploy"** button in Vercel
2. Or just wait 1-2 minutes for automatic deployment

## 🧪 **Test After Setting Variables:**

### **1. Check Environment (NEW DEBUG ENDPOINT)**
```
https://shopnazaqat-com.vercel.app/
```
Should show environment check with `hasMongoUri: true`

### **2. Health Check**
```
https://shopnazaqat-com.vercel.app/api/health
```
Should show `"connected": true` in database status

### **3. Products API**
```
https://shopnazaqat-com.vercel.app/api/nails
```
Should return nail products array

## 📸 **Visual Guide:**

### **Vercel Environment Variables Screen:**
```
┌─────────────────────────────────────────┐
│ Environment Variables                   │
├─────────────────────────────────────────┤
│ Name: MONGO_URI                         │
│ Value: mongodb+srv://wajeehazul...      │
│ Environment: Production ✓               │
│ [Save]                                  │
├─────────────────────────────────────────┤
│ Name: JWT_SECRET                        │
│ Value: 2b7e6f8c-4e1a...                │
│ Environment: Production ✓               │
│ [Save]                                  │
└─────────────────────────────────────────┘
```

## ⚠️ **IMPORTANT NOTES:**

1. **Set Environment to "Production"** for each variable
2. **Don't include quotes** around the values
3. **Copy-paste exactly** to avoid typos
4. **All variables are required** for full functionality

## 🔍 **If Still Having Issues:**

### **Check Vercel Function Logs:**
1. Vercel Dashboard → Your Project → **Functions** tab
2. Click **"View Function Logs"**
3. Look for specific error messages

### **Common Issues:**
- **Typos in variable names** - Must match exactly
- **Wrong environment** - Set to "Production" 
- **Missing quotes in MongoDB URI** - Don't add extra quotes
- **Network issues** - MongoDB Atlas must allow Vercel IPs

## 🎯 **Expected Timeline:**
- **Adding variables**: 2-3 minutes
- **Deployment**: 1-2 minutes  
- **Total**: 5 minutes to working backend

---

## 🚀 **Once Fixed, Your Backend Will:**
- ✅ Connect to MongoDB successfully
- ✅ Handle all API requests
- ✅ Process payments via PayFast  
- ✅ Send email notifications
- ✅ Serve your frontend perfectly
