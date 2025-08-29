const mongoose = require('mongoose');

// Define the schema for lotions
const lotionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, required: true },
    // New pricing structure with different piece options
    pricing: {
        pieces12: { type: Number, default: 799 }, // 12 pieces for 799
        pieces24: { type: Number, default: 1199 }  // 24 pieces for 1199
    },
    // Deprecated: Keep for backward compatibility
    price: { type: Number, default: 799 },
    // Stock for both options
    stock: {
        pieces12: { type: Number, default: 0 },
        pieces24: { type: Number, default: 0 }
    },
});

// Create the model
const Lotion = mongoose.model('Lotion', lotionSchema);

module.exports = Lotion;