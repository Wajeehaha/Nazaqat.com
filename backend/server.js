const express = require('express');
const cors = require('cors');
const multer = require('multer'); // Import multer for file uploads
const path = require('path');
const connectDB = require('./db'); // Import the database connection function
const Nail = require('./models/Nail'); // Import the Nail model
const Logo = require('./models/Logo');
const cartAPI = require('./routes/cartAPI');
const Order = require('./models/order'); // Import the Order model
const Cart = require('./models/Cart'); // Import the Cart model
const authRoutes = require('./routes/authRoutes');
const User = require('./models/User'); // Import the User model


const app = express();

// CORS configuration for production
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        // List of allowed origins
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:3000',
            // Add your Firebase hosting URL here after deployment
            process.env.FRONTEND_URL
        ];
        
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies (for PayFast)

// Set up multer for file uploads (disabled for Vercel deployment)
// TODO: Use cloud storage (Cloudinary/AWS S3) for production
const storage = multer.memoryStorage(); // Use memory storage temporarily
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Serve static files from the 'uploads' folder (disabled for Vercel)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
connectDB();
//test api
app.get('/', (req, res) => {
    res.send('API is running...'); // Simple message to indicate the server is running
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
        const image = req.file ? `/uploads/${req.file.filename}` : null;
        if (!name || !price || !collection || !category) {
            return res.status(400).json({ message: 'Name, price, collection, and category are required' });
        }
        
        // Parse images if provided as JSON string
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
            name, 
            price, 
            rating, 
            description, 
            stock, 
            collection, 
            category, 
            image,
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
        
        // Map frontend collection names to actual database collection names
        let actualCollection = collection;
        if (collection.toLowerCase() === 'collection1') {
            // Get the first available collection from database
            const collections = await Nail.distinct('collection');
            actualCollection = collections[0] || collection;
        } else if (collection.toLowerCase() === 'collection2') {
            // Get the second available collection from database
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
        const image = req.file ? `/uploads/${req.file.filename}` : null; // Save the image path

        // Validate the request body
        if (!image) {
            return res.status(400).json({ message: 'Logo image is required' });
        }

        // Create a new logo document
        const logo = new Logo({ image });
        await logo.save();

        res.status(201).json(logo); // Respond with the newly created logo
    } catch (error) {
        console.error('Error uploading logo:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET API: Retrieve the logo
app.get('/api/logo', async (req, res) => {
    try {
        const logo = await Logo.findOne(); // Fetch the first logo document from the database
        if (!logo) {
            return res.status(404).json({ message: 'Logo not found' });
        }
        res.json(logo); // Send the logo as JSON
    } catch (error) {
        console.error('Error fetching logo:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET API: Retrieve trending nails by collection
app.get('/api/trendings', async (req, res) => {
    try {
        // Fetch all distinct collections first
        const collections = await Nail.distinct('collection');
        console.log('Found collections:', collections);
        
        // Fetch trending nails (rating 4.5 or above) for all collections
        const trendingNails = await Nail.find({ rating: { $gte: 4.5 } });
        console.log('Found trending nails:', trendingNails.length);
        
        // Group by collection and map to expected format
        const trendingProducts = {
            COLLECTION1: [],
            COLLECTION2: []
        };
        
        // If we have collections, map them to COLLECTION1 and COLLECTION2
        if (collections.length > 0) {
            const firstCollection = collections[0];
            const secondCollection = collections[1] || collections[0]; // fallback to first if only one exists
            
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

        // Find all orders for the given user ID
        const orders = await Order.find({ userId });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }

        res.json(orders); // Send the orders as JSON
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST API: Place an order
app.post('/api/orders/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const sendMail = require('./utils/sendMail');
        const User = require('./models/User');
        // Find the user's cart
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate the total amount
        const totalAmount = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);

        // Create a new order
        const order = new Order({
            userId,
            items: cart.items,
            totalAmount,
        });
        await order.save();

        // Get user email
        const user = await User.findById(userId);
        if (user && user.email) {
            console.log('Sending order confirmation email...');
            console.log('Cart items for email:', cart.items.map(item => ({
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity
            })));
            
            const { generateOrderConfirmationEmail } = require('./utils/emailTemplates');
            
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

        // Clear the user's cart after placing the order
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
    // Check nail collection for the given ID
    const nail = await Nail.findById(productId);
    if (nail) return { productType: 'Nail', product: nail };

    // If no product is found, return null
    return null;
};

// POST API: Submit an order (direct buy)
app.post('/api/submit-order', async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Validate the request body
        if (!userId || !productId || !quantity) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Get the product type and product details using the helper function
        const result = await getProductTypeById(productId);
        if (!result) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const { productType, product } = result;

        // Check if the requested quantity is available
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        // Subtract the quantity from the product's stock
        product.stock -= quantity;
        await product.save();

        // Calculate the total price
        const totalPrice = product.price * quantity;

        // Create a new order
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

const searchRoutes = require('./routes/searchRoutes'); // Import the search routes
const reviewRoutes = require('./routes/reviewRoutes'); // Import the review routes
const paymentRoutes = require('./routes/paymentRoutes'); // Import the payment routes
const couponRoutes = require('./routes/couponRoutes'); // Import the coupon routes
app.use('/api', searchRoutes);//search
//Cart api
app.use('/api/cart', cartAPI);
// Auth routes
app.use('/api/auth', authRoutes);
// Review routes
app.use('/api/reviews', reviewRoutes);
// Payment routes
app.use('/api/payment', paymentRoutes);
// Coupon routes
app.use('/api/coupons', couponRoutes);

// Export the app for Vercel (serverless)
module.exports = app;

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`.green);
    });
}