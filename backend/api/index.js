// Combined Vercel serverless function - All-in-one deployment file
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const Nail = require('../models/Nail');
const Logo = require('../models/Logo');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');

// Import routes
const cartAPI = require('../routes/cartAPI');
const authRoutes = require('../routes/authRoutes');
const searchRoutes = require('../routes/searchRoutes');
const reviewRoutes = require('../routes/reviewRoutes');
const paymentRoutes = require('../routes/paymentRoutes');
const couponRoutes = require('../routes/couponRoutes');

// Database connection function
const connectDB = async () => {
    try {
        let mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            if (!process.env.DB_USERNAME || !process.env.DB_PASSWORD) {
                throw new Error('MongoDB credentials are missing in .env');
            }
            mongoURI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ke8ivmy.mongodb.net/dachi-store?retryWrites=true&w=majority`;
        }
        
        const connection = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferMaxEntries: 0,
            bufferCommands: false,
        });
        
        console.log('Connected to MongoDB'.blue);
        return connection;
    } catch (err) {
        console.error('Error connecting to MongoDB:'.red, err);
        throw err;
    }
};

// Create Express app
const app = express();

// CORS configuration
const corsOptions = {
    origin: [
        'https://nazakat-nail-store.web.app',
        'https://nazakat-nail-store.firebaseapp.com',
        'http://localhost:5173',
        'http://localhost:3000',
        'https://localhost:5173'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Nazakat API is running...', 
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV 
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Nazakat Backend API is running',
        timestamp: new Date().toISOString()
    });
});

// POST API: Add a new nail product
app.post('/api/nails', upload.single('image'), async (req, res) => {
    try {
        const { name, price, rating, description, stock, collection, category, images } = req.body;
        const image = req.file ? `/uploads/${Date.now()}-${req.file.originalname}` : null;
        
        if (!name || !price || !collection) {
            return res.status(400).json({ message: 'Name, price, and collection are required' });
        }
        
        let parsedImages = [];
        if (images) {
            try {
                parsedImages = JSON.parse(images);
            } catch (error) {
                console.log('Images field is not valid JSON, treating as single image');
                parsedImages = [images];
            }
        }
        
        const nail = new Nail({ 
            name, price, rating, description, stock, collection, category, image,
            images: parsedImages.length > 0 ? parsedImages : (image ? [image] : [])
        });
        await nail.save();
        res.status(201).json(nail);
    } catch (error) {
        console.error('Error adding nail:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET API: Retrieve all nails
app.get('/api/nails', async (req, res) => {
    try {
        const nails = await Nail.find();
        res.json(nails);
    } catch (error) {
        console.error('Error fetching nails:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET API: Retrieve nails by category
app.get('/api/nails/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const nails = await Nail.find({ category });
        res.json(nails);
    } catch (error) {
        console.error('Error fetching nails by category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET API: Retrieve nails by collection
app.get('/api/nails/collection/:collection', async (req, res) => {
    try {
        const { collection } = req.params;
        
        let actualCollection = collection;
        if (collection.toLowerCase() === 'collection1') {
            const collections = await Nail.distinct('collection');
            actualCollection = collections[0] || collection;
        } else if (collection.toLowerCase() === 'collection2') {
            const collections = await Nail.distinct('collection');
            actualCollection = collections[1] || collections[0] || collection;
        }
        
        console.log(`Mapping ${collection} to ${actualCollection}`);
        const nails = await Nail.find({ collection: actualCollection });
        res.json(nails);
    } catch (error) {
        console.error('Error fetching nails by collection:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET API: Retrieve a single nail product by ID
app.get('/api/nails/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const nail = await Nail.findById(id);
        
        if (!nail) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json(nail);
    } catch (error) {
        console.error('Error fetching nail by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST API: Upload a new logo
app.post('/api/logo', upload.single('image'), async (req, res) => {
    try {
        const image = req.file ? `/uploads/${Date.now()}-logo-${req.file.originalname}` : null;

        if (!image) {
            return res.status(400).json({ message: 'Logo image is required' });
        }

        const logo = new Logo({ image });
        await logo.save();

        res.status(201).json(logo);
    } catch (error) {
        console.error('Error uploading logo:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET API: Retrieve the logo
app.get('/api/logo', async (req, res) => {
    try {
        const logo = await Logo.findOne();
        if (!logo) {
            return res.status(404).json({ message: 'Logo not found' });
        }
        res.json(logo);
    } catch (error) {
        console.error('Error fetching logo:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET API: Retrieve trending nails by collection
app.get('/api/trendings', async (req, res) => {
    try {
        const collections = await Nail.distinct('collection');
        console.log('Found collections:', collections);
        
        const trendingNails = await Nail.find({ rating: { $gte: 4.5 } });
        console.log('Found trending nails:', trendingNails.length);
        
        const trendingProducts = {
            COLLECTION1: [],
            COLLECTION2: []
        };
        
        if (collections.length > 0) {
            const firstCollection = collections[0];
            const secondCollection = collections[1] || collections[0];
            
            trendingProducts.COLLECTION1 = trendingNails.filter(nail => nail.collection === firstCollection);
            trendingProducts.COLLECTION2 = trendingNails.filter(nail => nail.collection === secondCollection);
        }
        
        console.log('Trending products:', {
            COLLECTION1: trendingProducts.COLLECTION1.length,
            COLLECTION2: trendingProducts.COLLECTION2.length
        });
        
        res.json(trendingProducts);
    } catch (error) {
        console.error('Error fetching trending nails:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET API: Retrieve all orders for a specific user
app.get('/api/orders/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ userId });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST API: Place an order
app.post('/api/orders/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const sendMail = require('../utils/sendMail');
        
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const totalAmount = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);

        const order = new Order({
            userId,
            items: cart.items,
            totalAmount,
        });
        await order.save();

        const user = await User.findById(userId);
        if (user && user.email) {
            console.log('Sending order confirmation email...');
            console.log('Cart items for email:', cart.items.map(item => ({
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity
            })));
            
            const { generateOrderConfirmationEmail } = require('../utils/emailTemplates');
            
            const subject = '🎉 Order Confirmation - Nazakat Nails';
            const text = `Thank you for your order!\n\nOrder Details:\n${cart.items.map(item => `- ${item.name} x${item.quantity}: Rs. ${item.totalPrice}`).join('\n')}\n\nTotal: Rs. ${totalAmount}\n\nWe appreciate your business!`;
            const html = generateOrderConfirmationEmail(user, order, cart.items, totalAmount);
            
            try {
                await sendMail(user.email, subject, text, html);
                console.log(`Order confirmation email sent to ${user.email}`);
            } catch (mailErr) {
                console.error('Error sending order confirmation email:', mailErr);
            }
        }

        cart.items = [];
        await cart.save();

        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Helper function to get the product type based on the product ID
const getProductTypeById = async (productId) => {
    const nail = await Nail.findById(productId);
    if (nail) return { productType: 'Nail', product: nail };
    return null;
};

// POST API: Submit an order (direct buy)
app.post('/api/submit-order', async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!userId || !productId || !quantity) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const result = await getProductTypeById(productId);
        if (!result) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const { productType, product } = result;

        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        product.stock -= quantity;
        await product.save();

        const totalPrice = product.price * quantity;

        const order = new Order({
            userId,
            items: [
                {
                    productId: product._id,
                    name: product.name,
                    image: product.image,
                    price: product.price,
                    quantity,
                    totalPrice,
                },
            ],
            totalAmount: totalPrice,
        });
        await order.save();

        res.status(201).json({ message: 'Order submitted successfully', order });
    } catch (error) {
        console.error('Error submitting order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Mount route handlers - Note: Routes should be mounted without /api prefix
// since Vercel routes everything to this function
app.use('/api', searchRoutes);
app.use('/api/cart', cartAPI);
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/coupons', couponRoutes);

// Global error handler
app.use((error, req, res, next) => {
    console.error('❌ Global error handler:', error);
    res.status(500).json({
        error: 'Internal Server Error',
        message: error.message || 'Something went wrong',
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
});

// Handle 404 routes
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`,
        timestamp: new Date().toISOString()
    });
});

// Serverless function handler for Vercel
module.exports = async (req, res) => {
    try {
        // Connect to database on each request (serverless pattern)
        if (mongoose.connection.readyState === 0) {
            await connectDB();
        }

        // Handle CORS preflight requests
        if (req.method === 'OPTIONS') {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
            res.status(200).end();
            return;
        }

        // Log the request
        console.log(`📡 ${req.method} ${req.url} - ${new Date().toISOString()}`);

        // Handle the request with Express app
        return app(req, res);
    } catch (error) {
        console.error('❌ Serverless function error:', error);
        res.status(500).json({ 
            error: 'Internal Server Error',
            message: 'Function invocation failed',
            timestamp: new Date().toISOString()
        });
    }
};
