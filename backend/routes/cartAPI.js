const express = require('express');
const Cart = require('../models/Cart'); // Import the Cart model
const router = express.Router();
const Nail = require('../models/Nail'); // Import the Nail model

// Test route - can be removed after testing
router.get('/test', (req, res) => {
    res.json({ message: 'Cart API is working!' });
});

// DELETE API: Clear all items from cart (MUST come before the general delete route)
router.delete('/clear/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("=== CLEAR CART ENDPOINT HIT ===");
        console.log("Clearing cart for userId:", userId);
        console.log("Request params:", req.params);
        console.log("Request URL:", req.url);

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
        const { productId, name, image, pieceOption, rating, description, quantity } = req.body;

        // Validate userId
        if (!userId || userId === 'null' || userId === 'undefined') {
            console.log('Invalid userId provided:', userId);
            return res.status(401).json({ message: 'User authentication required' });
        }

        // Validate piece option
        if (!pieceOption || !['12', '24'].includes(pieceOption)) {
            return res.status(400).json({ message: 'Invalid piece option. Must be "12" or "24"' });
        }

        console.log('Add to cart request:', { userId, productId, name, pieceOption, quantity }); // Debug log

        // Fetch the product to check stock
        const product = await Nail.findById(productId);

        if (!product) {
            console.log('Product not found:', productId); // Debug log
            return res.status(404).json({ message: 'Product not found' });
        }

        // Get price based on piece option
        const price = pieceOption === '12' ? product.pricing.pieces12 : product.pricing.pieces24;
        const stockField = pieceOption === '12' ? 'pieces12' : 'pieces24';
        const availableStock = product.stock[stockField] || 0;

        console.log('Product found:', product.name, 'Piece option:', pieceOption, 'Price:', price, 'Stock:', availableStock); // Debug log

        if (availableStock < 1) {
            return res.status(400).json({ message: `${pieceOption}-piece option is out of stock` });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
            console.log('Created new cart for user:', userId); // Debug log
        } else {
            console.log('Found existing cart with', cart.items.length, 'items'); // Debug log
        }

        // Check if the same product with same piece option exists
        const existingItem = cart.items.find((item) => 
            item.productId.toString() === productId && item.pieceOption === pieceOption
        );
        
        if (existingItem) {
            console.log('Item already exists in cart, updating quantity'); // Debug log
            if (existingItem.quantity + (quantity || 1) > availableStock) {
                return res.status(400).json({ message: 'Not enough stock available' });
            }
            existingItem.quantity += (quantity || 1);
            existingItem.totalPrice = existingItem.quantity * price;
        } else {
            console.log('Adding new item to cart'); // Debug log
            cart.items.push({
                productId,
                name,
                image,
                pieceOption,
                price: price,
                rating,
                description,
                quantity: quantity || 1,
                totalPrice: price * (quantity || 1),
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

// DELETE API: Clear all items from cart (MUST come before the general delete route)
// router.delete('/clear/:userId', async (req, res) => {
//     try {
//         const { userId } = req.params;
//         console.log("=== CLEAR CART ENDPOINT HIT ===");
//         console.log("Clearing cart for userId:", userId);
//         console.log("Request params:", req.params);
//         console.log("Request URL:", req.url);

//         // Find the cart for the given user ID
//         let cart = await Cart.findOne({ userId });

//         // If the cart does not exist, return empty cart response
//         if (!cart) {
//             console.log("Cart not found for user:", userId);
//             return res.json({ 
//                 message: 'Cart was already empty', 
//                 cart: { userId, items: [] } 
//             });
//         }

//         // Clear all items in the cart
//         cart.items = [];

//         // Save the updated cart
//         await cart.save();
//         console.log("Cart cleared successfully for user:", userId);

//         res.json({ 
//             message: 'Cart cleared successfully', 
//             cart 
//         });
//     } catch (error) {
//         console.error('Error clearing cart:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// DELETE API: Remove an item from the cart
router.delete('/:userId/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { pieceOption } = req.query; // Get piece option from query params
        
        console.log("=== REMOVE ITEM ENDPOINT HIT ===");
        console.log("userId:", userId, "productId:", productId, "pieceOption:", pieceOption);
        console.log("Request URL:", req.url);

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Remove item with matching productId and pieceOption
        if (pieceOption) {
            cart.items = cart.items.filter((item) => 
                !(item.productId.toString() === productId && item.pieceOption === pieceOption)
            );
        } else {
            // If no piece option specified, remove all items with this productId
            cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
        }
        
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
        const { mode, quantity, pieceOption } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find item with matching productId and pieceOption
        const item = cart.items.find((item) => 
            item.productId.toString() === productId && 
            item.pieceOption === pieceOption
        );
        
        if (!item) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        // Fetch the product to check stock
        const product = await Nail.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Get stock for the specific piece option
        const stockField = pieceOption === '12' ? 'pieces12' : 'pieces24';
        const availableStock = product.stock[stockField] || 0;

        // Handle different update modes
        if (mode === 'set' && quantity !== undefined) {
            // Direct quantity setting
            const newQuantity = parseInt(quantity);
            if (newQuantity <= 0) {
                return res.status(400).json({ message: 'Quantity must be greater than 0' });
            }
            if (newQuantity > availableStock) {
                return res.status(400).json({ message: 'Not enough stock available' });
            }
            item.quantity = newQuantity;
        } else if (mode === 'increment') {
            if (item.quantity + 1 > availableStock) {
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
        console.log(`Cart updated: ${item.name} (${item.pieceOption} pieces) quantity set to ${item.quantity}`);
        res.json(cart);
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;