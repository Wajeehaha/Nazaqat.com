const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Nail', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order',
    required: true // Ensures only verified purchasers can review
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  title: { 
    type: String, 
    required: true,
    maxlength: 100
  },
  comment: { 
    type: String, 
    required: true,
    maxlength: 1000
  },
  images: [{ 
    type: String // URLs of customer-uploaded images
  }],
  verified: { 
    type: Boolean, 
    default: true // Since we check orderId, it's verified
  },
  helpful: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }], // Users who found this review helpful
  flagged: { 
    type: Boolean, 
    default: false 
  },
  response: {
    text: String,
    respondedAt: Date,
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Index for efficient queries
reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ rating: 1 });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
