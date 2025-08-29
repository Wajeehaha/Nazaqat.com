const mongoose = require('mongoose');

// Define the schema for orders
const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // User who placed the order
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            name: { type: String, required: true },
            image: { type: String, required: true },
            // Updated pricing structure
            pieceOption: { type: String, enum: ['12', '24'], required: true }, // Which piece option user selected
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            totalPrice: { type: Number, required: true },
        },
    ],
    subtotal: { type: Number, required: true }, // Subtotal before discount
    discount: { type: Number, default: 0 }, // Discount amount
    totalAmount: { type: Number, required: true }, // Total amount after discount
    status: { type: String, default: 'Pending' }, // Order status (e.g., Pending, Paid, Completed, Cancelled)
    paymentMethod: { 
        type: String, 
        enum: ['online', 'cod'], 
        required: true,
        default: 'online'
    },
    customerInfo: {
        firstName: { type: String },
        lastName: { type: String },
        email: { type: String },
        phone: { type: String },
        address: { type: String },
        city: { type: String },
        postalCode: { type: String }
    },
    couponUsed: {
        code: { type: String },
        discountType: { type: String },
        discountValue: { type: Number },
        discountAmount: { type: Number }
    },
    paymentDetails: {
        pfPaymentId: { type: String }, // PayFast payment ID
        paymentMethod: { type: String },
        paidAmount: { type: Number },
        paidAt: { type: Date },
        failureReason: { type: String },
        failedAt: { type: Date }
    },
    createdAt: { type: Date, default: Date.now }, // Timestamp for when the order was placed
    updatedAt: { type: Date, default: Date.now }
});

// Create the model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;