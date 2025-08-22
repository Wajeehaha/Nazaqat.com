# 🔑 Getting Your Actual Environment Variables

## Step 1: Get Your MongoDB Credentials

### Option A: Check Your MongoDB Atlas Dashboard
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Sign in to your account
3. Click on your cluster name
4. Click **"Connect"** button
5. Choose **"Connect your application"**
6. Copy the connection string (it looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.abc123.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```

### Option B: Check Your Previous Deployment
If you have a working local development setup:
1. Look for a `.env` file in your `backend` folder
2. Or check your previous Vercel project environment variables

## Step 2: Prepare Your Environment Variables

Copy this template and fill in your actual values:

```
# 1. MONGO_URI (REQUIRED)
# Replace with your actual MongoDB Atlas connection string
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/YOUR_DATABASE?retryWrites=true&w=majority

# 2. JWT_SECRET (REQUIRED) 
# Use a strong, unique secret (at least 32 characters)
JWT_SECRET=nazakat-super-secure-jwt-secret-key-2025-production

# 3. NODE_ENV (REQUIRED)
NODE_ENV=production

# 4. FRONTEND_URL (REQUIRED)
FRONTEND_URL=https://nazakat-nail-store.web.app

# 5. PayFast (OPTIONAL - only if you have PayFast account)
PAYFAST_MERCHANT_ID=your_actual_merchant_id
PAYFAST_MERCHANT_KEY=your_actual_merchant_key
PAYFAST_PASSPHRASE=your_actual_passphrase
```

## Step 3: Add to Vercel Environment Variables

**IMPORTANT**: Never upload `.env` files to Vercel or commit them to Git!

Instead, add each variable manually in Vercel dashboard:

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add each variable one by one:

### Add These Variables:

**Variable 1:**
- Name: `MONGO_URI`
- Value: `mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/YOUR_DATABASE?retryWrites=true&w=majority`
- Environment: Production

**Variable 2:**
- Name: `JWT_SECRET`
- Value: `nazakat-super-secure-jwt-secret-key-2025-production`
- Environment: Production

**Variable 3:**
- Name: `NODE_ENV`
- Value: `production`
- Environment: Production

**Variable 4:**
- Name: `FRONTEND_URL`
- Value: `https://nazakat-nail-store.web.app`
- Environment: Production

## Step 4: Find Your MongoDB Details

If you can't find your MongoDB credentials:

### Check Your Code:
Look in these files for clues:
- `backend/db.js`
- Any previous `.env` files
- Your MongoDB Atlas dashboard

### Create New Database (if needed):
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster (free tier)
3. Create a database user
4. Get the connection string
5. Whitelist all IPs (`0.0.0.0/0`) for Vercel

## ⚠️ Security Best Practices

1. **Never commit `.env` files** to Git
2. **Never share your actual credentials** in chat or emails
3. **Use strong, unique secrets** for JWT
4. **Regularly rotate your database passwords**
5. **Use Vercel's environment variables** feature only

## 🔍 Quick Check

To verify your MongoDB connection string is correct:
- It should start with `mongodb+srv://`
- It should contain your username and password
- It should end with your database name
- No `<>` brackets should remain

Example of correct format:
```
mongodb+srv://wajeeh:mypassword123@cluster0.abc123.mongodb.net/nazakat-store?retryWrites=true&w=majority
```

Once you have these values, add them to Vercel manually - do NOT upload any `.env` file!
