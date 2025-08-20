const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Review = require('../models/Review');
const Nail = require('../models/Nail');
const Order = require('../models/order');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure multer for review image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-review-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// GET reviews for a specific product
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sortBy = 'newest' } = req.query;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    let sortOption = {};
    switch (sortBy) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'highest':
        sortOption = { rating: -1 };
        break;
      case 'lowest':
        sortOption = { rating: 1 };
        break;
      case 'helpful':
        sortOption = { 'helpful.length': -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const reviews = await Review.find({ productId: new mongoose.Types.ObjectId(productId), flagged: false })
      .populate('userId', 'name')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    console.log(`Fetched ${reviews.length} reviews for product ${productId}`);
    if (reviews.length > 0) {
      console.log('Sample review data:', {
        reviewId: reviews[0]._id,
        userName: reviews[0].userId?.name,
        rating: reviews[0].rating,
        hasImages: reviews[0].images?.length > 0
      });
    }

    const totalReviews = await Review.countDocuments({ productId: new mongoose.Types.ObjectId(productId), flagged: false });
    
    // Calculate basic stats without complex aggregation
    const allProductReviews = await Review.find({ productId: new mongoose.Types.ObjectId(productId), flagged: false });
    
    let averageRating = 0;
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    if (allProductReviews.length > 0) {
      const sum = allProductReviews.reduce((acc, review) => acc + review.rating, 0);
      averageRating = sum / allProductReviews.length;
      
      allProductReviews.forEach(review => {
        ratingDistribution[review.rating]++;
      });
    }

    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews,
        hasNext: page < Math.ceil(totalReviews / limit),
        hasPrev: page > 1
      },
      stats: {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        ratingDistribution
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST create a new review (protected route)
router.post('/', protect, upload.array('images', 5), async (req, res) => {
  try {
    const { productId, orderId, rating, title, comment } = req.body;
    const userId = req.user._id; // Get from authenticated user

    // Validate required fields
    if (!productId || !orderId || !rating || !title || !comment) {
      return res.status(400).json({ 
        message: 'Missing required fields: productId, orderId, rating, title, comment' 
      });
    }

    // Validate productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ 
        message: 'Invalid product ID format' 
      });
    }

    console.log('Creating review for product:', productId, 'by user:', userId);
    console.log('Review data:', { productId, userId, orderId, rating, title, comment });
    console.log('Uploaded images:', req.files ? req.files.map(f => f.filename) : 'None');

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ 
      productId: new mongoose.Types.ObjectId(productId), 
      userId: userId 
    });
    
    if (existingReview) {
      return res.status(400).json({ 
        message: 'You have already reviewed this product' 
      });
    }

    // Process uploaded images
    const imageUrls = req.files ? req.files.map(file => file.filename) : [];

    const review = new Review({
      productId: new mongoose.Types.ObjectId(productId),
      userId: userId,
      orderId: mongoose.Types.ObjectId.isValid(orderId) ? 
        new mongoose.Types.ObjectId(orderId) : 
        new mongoose.Types.ObjectId(),
      rating: parseInt(rating),
      title,
      comment,
      images: imageUrls
    });

    await review.save();
    console.log('Review saved successfully:', { 
      reviewId: review._id, 
      productId: review.productId, 
      userId: review.userId,
      rating: review.rating,
      imagesCount: review.images.length 
    });

    // Update product's average rating
    await updateProductRating(productId);

    // Populate user info before sending response
    await review.populate('userId', 'name');

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: error.message });
  }
});

// PUT update review helpfulness (protected route)
router.put('/:reviewId/helpful', protect, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id; // Get from authenticated user

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const hasVoted = review.helpful.includes(userId);
    
    if (hasVoted) {
      // Remove vote
      review.helpful = review.helpful.filter(id => id.toString() !== userId.toString());
    } else {
      // Add vote
      review.helpful.push(userId);
    }

    await review.save();

    res.json({
      message: hasVoted ? 'Vote removed' : 'Vote added',
      helpfulCount: review.helpful.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to update product rating
async function updateProductRating(productId) {
  const stats = await Review.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId), flagged: false } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  const avgRating = stats.length > 0 ? stats[0].avgRating : 0;
  
  await Nail.findByIdAndUpdate(productId, { 
    rating: Math.round(avgRating * 10) / 10 // Round to 1 decimal
  });
}

module.exports = router;
