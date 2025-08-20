const mongoose = require('mongoose');

// Define the schema for discount coupons
const couponSchema = new mongoose.Schema({
    code: { 
        type: String, 
        required: true, 
        unique: true,
        uppercase: true,
        trim: true
    },
    description: { 
        type: String, 
        required: true 
    },
    discountType: { 
        type: String, 
        enum: ['percentage', 'fixed'], 
        required: true 
    },
    discountValue: { 
        type: Number, 
        required: true,
        min: 0
    },
    minimumAmount: { 
        type: Number, 
        default: 0 
    },
    maximumDiscount: { 
        type: Number, // For percentage discounts
        default: null 
    },
    usageLimit: { 
        type: Number, 
        default: null // null means unlimited
    },
    usedCount: { 
        type: Number, 
        default: 0 
    },
    validFrom: { 
        type: Date, 
        default: Date.now 
    },
    validUntil: { 
        type: Date, 
        required: true 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    applicableCategories: [{ 
        type: String 
    }], // Empty array means all categories
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
}, {
    suppressReservedKeysWarning: true // Suppress reserved keys warning
});

// Create indexes for better performance (removing duplicate)
couponSchema.index({ validFrom: 1, validUntil: 1 });
couponSchema.index({ isActive: 1 });

// Method to check if coupon is valid
couponSchema.methods.isValid = function() {
    const now = new Date();
    return this.isActive && 
           this.validFrom <= now && 
           this.validUntil >= now &&
           (this.usageLimit === null || this.usedCount < this.usageLimit);
};

// Method to calculate discount
couponSchema.methods.calculateDiscount = function(amount) {
    if (!this.isValid() || amount < this.minimumAmount) {
        return 0;
    }

    let discount = 0;
    if (this.discountType === 'percentage') {
        discount = (amount * this.discountValue) / 100;
        if (this.maximumDiscount && discount > this.maximumDiscount) {
            discount = this.maximumDiscount;
        }
    } else if (this.discountType === 'fixed') {
        discount = Math.min(this.discountValue, amount);
    }

    return Math.round(discount * 100) / 100; // Round to 2 decimal places
};

// Create the model
const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
