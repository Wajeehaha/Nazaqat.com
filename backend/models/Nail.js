const mongoose = require('mongoose');

const nailSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  // New pricing structure with different piece options
  pricing: {
    pieces12: { type: Number, default: 799 }, // 12 pieces for 799
    pieces24: { type: Number, default: 1199 }  // 24 pieces for 1199
  },
  // Deprecated: Keep for backward compatibility but not used
  price: { type: Number, default: 799 },
  image: { type: String }, // Main image for backward compatibility
  images: [{ type: String }], // Array of images for slideshow
  collection: { type: String, required: true },
  // Stock for both options
  stock: {
    pieces12: { type: Number, default: 0 },
    pieces24: { type: Number, default: 0 }
  },
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
}, { 
  suppressReservedKeysWarning: true // Suppress the collection field warning
});

const Nail = mongoose.model('Nail', nailSchema);
module.exports = Nail;
