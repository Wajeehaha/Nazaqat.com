const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');

// Validate coupon code
router.post('/validate', async (req, res) => {
    try {
        const { code, orderAmount } = req.body;

        if (!code || !orderAmount) {
            return res.status(400).json({
                success: false,
                message: 'Coupon code and order amount are required'
            });
        }

        // Find the coupon
        const coupon = await Coupon.findOne({ 
            code: code.toUpperCase() 
        });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Invalid coupon code'
            });
        }

        // Check if coupon is valid
        if (!coupon.isValid()) {
            let message = 'Coupon is not valid';
            if (!coupon.isActive) {
                message = 'Coupon is inactive';
            } else if (new Date() < coupon.validFrom) {
                message = 'Coupon is not yet active';
            } else if (new Date() > coupon.validUntil) {
                message = 'Coupon has expired';
            } else if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
                message = 'Coupon usage limit reached';
            }

            return res.status(400).json({
                success: false,
                message
            });
        }

        // Check minimum amount
        if (orderAmount < coupon.minimumAmount) {
            return res.status(400).json({
                success: false,
                message: `Minimum order amount of Rs. ${coupon.minimumAmount} required for this coupon`
            });
        }

        // Calculate discount
        const discountAmount = coupon.calculateDiscount(orderAmount);
        const finalAmount = orderAmount - discountAmount;

        res.json({
            success: true,
            message: 'Coupon applied successfully',
            coupon: {
                code: coupon.code,
                description: coupon.description,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                discountAmount,
                minimumAmount: coupon.minimumAmount,
                maximumDiscount: coupon.maximumDiscount
            },
            orderSummary: {
                subtotal: orderAmount,
                discount: discountAmount,
                total: finalAmount
            }
        });

    } catch (error) {
        console.error('Error validating coupon:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get all active coupons (for admin or promotional display)
router.get('/active', async (req, res) => {
    try {
        const now = new Date();
        const coupons = await Coupon.find({
            isActive: true,
            validFrom: { $lte: now },
            validUntil: { $gte: now },
            $or: [
                { usageLimit: null },
                { $expr: { $lt: ['$usedCount', '$usageLimit'] } }
            ]
        }).select('code description discountType discountValue minimumAmount maximumDiscount validUntil');

        res.json({
            success: true,
            coupons
        });

    } catch (error) {
        console.error('Error fetching active coupons:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Create coupon (admin only - you might want to add authentication)
router.post('/create', async (req, res) => {
    try {
        const {
            code,
            description,
            discountType,
            discountValue,
            minimumAmount,
            maximumDiscount,
            usageLimit,
            validFrom,
            validUntil,
            applicableCategories
        } = req.body;

        // Validate required fields
        if (!code || !description || !discountType || !discountValue || !validUntil) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Check if coupon code already exists
        const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
        if (existingCoupon) {
            return res.status(400).json({
                success: false,
                message: 'Coupon code already exists'
            });
        }

        const newCoupon = new Coupon({
            code: code.toUpperCase(),
            description,
            discountType,
            discountValue,
            minimumAmount: minimumAmount || 0,
            maximumDiscount,
            usageLimit,
            validFrom: validFrom || new Date(),
            validUntil: new Date(validUntil),
            applicableCategories: applicableCategories || []
        });

        await newCoupon.save();

        res.status(201).json({
            success: true,
            message: 'Coupon created successfully',
            coupon: newCoupon
        });

    } catch (error) {
        console.error('Error creating coupon:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router;
