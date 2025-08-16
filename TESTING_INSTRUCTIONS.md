# Review System - Quick Test Instructions

## To Test the Review System:

### 1. Start Both Servers
```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend  
cd frontend
npm run dev
```

### 2. Navigate to Product Page
- Go to any product detail page
- Click on the "Reviews" tab to see existing reviews
- Click on "Write Review" tab to add a new review

### 3. Test Review Submission
- **First, create a user account**:
  - Go to `/auth` page and register/login
  - This will store your real userId and token in localStorage
- Navigate to any product detail page
- Click "Write Review" tab (only available for logged-in users)
- Add a star rating (required)
- Add a title and comment
- Optionally upload images
- Click "Submit Review"

### 4. Common Issues Fixed:
- ✅ **404 errors**: Added Vite proxy configuration to route `/api/*` to backend
- ✅ **500 errors**: Simplified aggregation queries and added proper ObjectId validation
- ✅ **JSON parsing errors**: Added better error handling and validation
- ✅ **CORS issues**: Proxy handles cross-origin requests
- ✅ **400 Bad Request (Invalid ID format)**: Now uses real user authentication
- ✅ **Authentication**: Integrated with existing login system

### 5. What Should Work Now:
- ✅ View reviews on product pages
- ✅ Submit new reviews with images
- ✅ Rate products with star system
- ✅ See rating statistics and distributions
- ✅ Mark reviews as helpful

### 6. Authentication Integration:
- ✅ Uses real user IDs from localStorage
- ✅ Requires login to submit reviews
- ✅ Requires login to vote on review helpfulness
- ✅ Reviews are linked to actual user accounts
- ✅ Protected routes with JWT authentication

### 7. Next Steps After Testing:
- Re-enable order verification once user authentication is implemented
- Connect with actual user data instead of mock data
- Add admin moderation features

## File Changes Made:
1. `vite.config.ts` - Added API proxy
2. `reviewRoutes.js` - Simplified queries and added validation
3. All frontend components - Reverted to relative API paths
4. Added proper error handling throughout
