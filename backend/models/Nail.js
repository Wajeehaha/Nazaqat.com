const mongoose = require('mongoose');

const nailSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String }, // Main image for backward compatibility
  images: [{ type: String }], // Array of images for slideshow
  collection: { type: String, required: true },
  // category: { 
  //   type: String, 
  //   enum: ['gel-nails', 'acrylic-nails', 'nail-art', 'nail-care'], 
  //   required: true 
  // },
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
}, { 
  suppressReservedKeysWarning: true // Suppress the collection field warning
});

const Nail = mongoose.model('Nail', nailSchema);
module.exports = Nail;
