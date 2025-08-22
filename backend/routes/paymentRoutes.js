const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Coupon = require('../models/Coupon');
const { createPaymentData, getPayFastUrl, verifyPayment } = require('../utils/payfast');
const { generateOrderConfirmationEmail } = require('../utils/emailTemplates');
const sendMail = require('../utils/sendMail');

// Create payment for order
router.post('/create', async (req, res) => {
    try {
        const { userId, customerInfo, paymentMethod, couponCode } = req.body;

        // Validate payment method
        if (!paymentMethod || !['online', 'cod'].includes(paymentMethod)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid payment method' 
            });
        }

        // Get user's cart
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Cart is empty' 
            });
        }

        // Calculate subtotal
        const subtotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
        let discount = 0;
        let couponUsed = null;

        // Apply coupon if provided
        if (couponCode) {
            const coupon = await Coupon.findOne({ 
                code: couponCode.toUpperCase() 
            });

            if (coupon && coupon.isValid() && subtotal >= coupon.minimumAmount) {
                discount = coupon.calculateDiscount(subtotal);
                couponUsed = {
                    code: coupon.code,
                    discountType: coupon.discountType,
                    discountValue: coupon.discountValue,
                    discountAmount: discount
                };

                // Increment usage count
                coupon.usedCount += 1;
                await coupon.save();
            }
        }

        const totalAmount = subtotal - discount;

        // Create order
        const orderData = {
            userId,
            items: cart.items,
            subtotal,
            discount,
            totalAmount,
            paymentMethod,
            status: paymentMethod === 'cod' ? 'Order Placed' : 'Pending Payment',
            customerInfo: {
                firstName: customerInfo.firstName,
                lastName: customerInfo.lastName,
                email: customerInfo.email,
                phone: customerInfo.phone,
                address: customerInfo.address,
                city: customerInfo.city || '',
                postalCode: customerInfo.postalCode || ''
            }
        };

        if (couponUsed) {
            orderData.couponUsed = couponUsed;
        }

        const order = new Order(orderData);
        await order.save();

        // Clear cart
        await Cart.findOneAndUpdate(
            { userId },
            { items: [] }
        );

        // Handle COD orders
        if (paymentMethod === 'cod') {
            // Send order confirmation email for COD
            try {
                const user = await User.findById(userId);
                if (user && user.email) {
                    const subject = '📦 Order Confirmed - Cash on Delivery';
                    const text = `Your order has been confirmed!\n\nOrder #${order._id}\nPayment Method: Cash on Delivery\nTotal Amount: PKR ${totalAmount}\n\nWe'll deliver your order soon!`;
                    const html = generateOrderConfirmationEmail(user, order, order.items, totalAmount);
                    
                    await sendMail(user.email, subject, text, html);
                }
            } catch (mailErr) {
                console.error('Error sending COD confirmation email:', mailErr);
            }

            return res.json({
                success: true,
                message: 'Order placed successfully',
                orderId: order._id,
                paymentMethod: 'cod',
                totalAmount,
                redirect: '/orders'
            });
        }

        // Handle online payment
        const paymentData = createPaymentData({
            orderId: order._id.toString(),
            amount: totalAmount,
            customer: {
                firstName: customerInfo.firstName,
                lastName: customerInfo.lastName,
                email: customerInfo.email
            },
            itemName: `Nazakat Order #${order._id}`,
            description: `${cart.items.length} nail products from Nazakat Store`
        });

        res.json({
            success: true,
            paymentData,
            paymentUrl: getPayFastUrl(),
            orderId: order._id,
            paymentMethod: 'online',
            totalAmount
        });

    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error',
            error: error.message 
        });
    }
});

// PayFast notification webhook
router.post('/notify', async (req, res) => {
    try {
        console.log('PayFast notification received:', req.body);

        // Verify the payment
        const verification = await verifyPayment(req.body);
        
        if (!verification.isValid) {
            console.error('Invalid payment verification');
            return res.status(400).send('Invalid signature');
        }

        const orderId = verification.paymentId;
        const order = await Order.findById(orderId);

        if (!order) {
            console.error('Order not found:', orderId);
            return res.status(404).send('Order not found');
        }

        // Update order status based on payment status
        if (verification.paymentStatus === 'COMPLETE') {
            order.status = 'Paid';
            order.paymentDetails = {
                pfPaymentId: verification.pfPaymentId,
                paymentMethod: 'PayFast',
                paidAmount: verification.amount,
                paidAt: new Date()
            };

            // Clear user's cart
            await Cart.findOneAndUpdate(
                { userId: order.userId },
                { items: [] }
            );

            // Send confirmation email
            try {
                const user = await User.findById(order.userId);
                if (user && user.email) {
                    const subject = '🎉 Payment Confirmed - Nazakat Nails';
                    const text = `Thank you for your payment!\n\nOrder #${order._id}\nAmount: PKR ${order.totalAmount}\n\nYour order is being processed.`;
                    const html = generateOrderConfirmationEmail(user, order, order.items, order.totalAmount);
                    
                    await sendMail(user.email, subject, text, html);
                    console.log(`Payment confirmation email sent to ${user.email}`);
                }
            } catch (mailErr) {
                console.error('Error sending confirmation email:', mailErr);
            }

        } else {
            order.status = 'Payment Failed';
            order.paymentDetails = {
                paymentMethod: 'PayFast',
                failureReason: `Payment status: ${verification.paymentStatus}`,
                failedAt: new Date()
            };
        }

        await order.save();

        console.log(`Order ${orderId} updated with status: ${order.status}`);
        res.status(200).send('OK');

    } catch (error) {
        console.error('Error processing payment notification:', error);
        res.status(500).send('Internal server error');
    }
});

// Check payment status
router.get('/status/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({
            orderId: order._id,
            status: order.status,
            totalAmount: order.totalAmount,
            paymentDetails: order.paymentDetails || null
        });

    } catch (error) {
        console.error('Error checking payment status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Handle successful return from PayFast
router.get('/success', async (req, res) => {
    try {
        // This is typically handled by frontend, but we can log it
        console.log('Payment success return:', req.query);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success?${new URLSearchParams(req.query)}`);
    } catch (error) {
        console.error('Error handling payment success:', error);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/error`);
    }
});

// Handle cancelled payment from PayFast
router.get('/cancel', async (req, res) => {
    try {
        console.log('Payment cancelled:', req.query);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/cancel?${new URLSearchParams(req.query)}`);
    } catch (error) {
        console.error('Error handling payment cancellation:', error);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/error`);
    }
});

module.exports = router;
