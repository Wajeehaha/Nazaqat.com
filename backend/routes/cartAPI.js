const express = require('express');
const Cart = require('../models/Cart'); // Import the Cart model
const router = express.Router();
const Nail = require('../models/Nail'); // Import the Nail model
// GET API: Retrieve the cart for a user
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the cart for the given user ID
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.json({ items: [] }); // Return an empty cart if none exists
        }

        // Return the cart with all items
        res.json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST API: Add an item to the cart
router.post('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { productId, name, image, price, rating, description, quantity } = req.body;

        // Validate userId
        if (!userId || userId === 'null' || userId === 'undefined') {
            console.log('Invalid userId provided:', userId);
            return res.status(401).json({ message: 'User authentication required' });
        }

        console.log('Add to cart request:', { userId, productId, name, price, quantity }); // Debug log

        // Fetch the product to check stock
        const product = await Nail.findById(productId);

        if (!product) {
            console.log('Product not found:', productId); // Debug log
            return res.status(404).json({ message: 'Product not found' });
        }

        console.log('Product found:', product.name, 'Stock:', product.stock); // Debug log

        if (product.stock < 1) {
            return res.status(400).json({ message: 'Product is out of stock' });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
            console.log('Created new cart for user:', userId); // Debug log
        } else {
            console.log('Found existing cart with', cart.items.length, 'items'); // Debug log
        }

        const existingItem = cart.items.find((item) => item.productId.toString() === productId);
        if (existingItem) {
            console.log('Item already exists in cart, updating quantity'); // Debug log
            if (existingItem.quantity + (quantity || 1) > product.stock) {
                return res.status(400).json({ message: 'Not enough stock available' });
            }
            existingItem.quantity += (quantity || 1);
            existingItem.totalPrice = existingItem.quantity * parseFloat(existingItem.price);
        } else {
            console.log('Adding new item to cart'); // Debug log
            cart.items.push({
                productId,
                name,
                image,
                price: parseFloat(price), // Ensure price is number in database
                rating,
                description,
                quantity: quantity || 1,
                totalPrice: parseFloat(price) * (quantity || 1),
            });
        }

        await cart.save();
        console.log('Cart saved successfully with', cart.items.length, 'items'); // Debug log
        res.status(201).json(cart);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// DELETE API: Remove an item from the cart
router.delete('/:userId/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
        await cart.save();

        res.json(cart);
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// PUT API: Update the quantity of an item in the cart
router.put('/:userId/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { mode, quantity } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.find((item) => item.productId.toString() === productId);
        if (!item) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        // Fetch the product to check stock
        const product = await Nail.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Handle different update modes
        if (mode === 'set' && quantity !== undefined) {
            // Direct quantity setting
            const newQuantity = parseInt(quantity);
            if (newQuantity <= 0) {
                return res.status(400).json({ message: 'Quantity must be greater than 0' });
            }
            if (newQuantity > product.stock) {
                return res.status(400).json({ message: 'Not enough stock available' });
            }
            item.quantity = newQuantity;
        } else if (mode === 'increment') {
            if (item.quantity + 1 > product.stock) {
                return res.status(400).json({ message: 'Not enough stock available' });
            }
            item.quantity += 1;
        } else if (mode === 'decrement') {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                return res.status(400).json({ message: 'Quantity cannot be less than 1' });
            }
        } else {
            return res.status(400).json({ message: 'Invalid mode. Use "increment", "decrement", or "set" with quantity.' });
        }

        item.totalPrice = item.quantity * item.price;
        await cart.save();
        console.log(`Cart updated: ${item.name} quantity set to ${item.quantity}`);
        res.json(cart);
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// DELETE API: Clear all items from cart
router.delete('/clear/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("Clearing cart for userId:", userId);

        // Find the cart for the given user ID
        let cart = await Cart.findOne({ userId });

        // If the cart does not exist, return empty cart response
        if (!cart) {
            console.log("Cart not found for user:", userId);
            return res.json({ 
                message: 'Cart was already empty', 
                cart: { userId, items: [] } 
            });
        }

        // Clear all items in the cart
        cart.items = [];

        // Save the updated cart
        await cart.save();
        console.log("Cart cleared successfully for user:", userId);

        res.json({ 
            message: 'Cart cleared successfully', 
            cart 
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;