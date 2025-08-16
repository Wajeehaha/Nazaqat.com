const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

// Import models
const Nail = require('./models/Nail');

dotenv.config();

// MongoDB connection
const connectDB = async () => {
    try {
        const mongoURI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@da-chi.zebhaml.mongodb.net/dachi-store?retryWrites=true&w=majority`;
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB Atlas for seeding'.blue);
    } catch (err) {
        console.error('Error connecting to MongoDB:'.red, err);
        process.exit(1);
    }
};

// Dummy nail data with multiple images for slideshow
const dummyNails = [
    // Collection 1 - Product 1
    {
        name: "Glamour Rose Gold Gel",
        image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1515688594390-b649af70d282?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop"
        ],
        price: 55.00,
        rating: 4.8,
        description: "Luxurious rose gold gel nail polish with metallic finish. Perfect for special occasions and everyday glamour. Long-lasting formula with chip-resistant technology.",
        stock: 25,
        collection: 'COLLECTION1',
        category: 'gel-nails'
    },
    // Collection 1 - Product 2
    {
        name: "Midnight Blue Elegance",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1542452618-4bb999a92b70?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1596652426039-d04b408c0ca8?w=400&h=400&fit=crop"
        ],
        price: 48.00,
        rating: 4.7,
        description: "Deep midnight blue nail art with stunning shimmer effects. Professional grade formula that provides salon-quality results at home.",
        stock: 30,
        collection: 'COLLECTION1',
        category: 'nail-art'
    },
    // Collection 2 - Product 1
    {
        name: "Crystal Clear Acrylic Set",
        image: "https://images.unsplash.com/photo-1599948128020-9a44fe305326?w=400&h=400&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1599948128020-9a44fe305326?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1509130872995-86c1187635f5?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1605462863863-8a6e857cb29b?w=400&h=400&fit=crop"
        ],
        price: 75.00,
        rating: 4.9,
        description: "Premium crystal clear acrylic nail set with professional application tools. Perfect for creating stunning French manicures and nail extensions.",
        stock: 20,
        collection: 'COLLECTION2',
        category: 'acrylic-nails'
    },
    // Collection 2 - Product 2
    {
        name: "Lavender Dreams Nail Care Kit",
        image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=400&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1594735797693-d0501ba2fe65?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=400&h=400&fit=crop"
        ],
        price: 42.00,
        rating: 4.6,
        description: "Complete nail care kit with lavender-infused treatments. Includes cuticle oil, nail strengthener, and nourishing hand cream for healthy, beautiful nails.",
        stock: 35,
        collection: 'COLLECTION2',
        category: 'nail-care'
    }
];

// Clear existing data and insert new dummy data
const seedDatabase = async () => {
    try {
        await connectDB();
        
        console.log('Clearing existing nail data...'.yellow);
        await Nail.deleteMany({});
        
        console.log('Inserting dummy nail data...'.yellow);
        await Nail.insertMany(dummyNails);
        
        console.log('Dummy nail data seeded successfully!'.green);
        console.log(`Inserted ${dummyNails.length} nail products`.blue);
        
        // Display inserted data
        const insertedNails = await Nail.find();
        console.log('\nInserted products:'.cyan);
        insertedNails.forEach((nail, index) => {
            console.log(`${index + 1}. ${nail.name} (${nail.collection}) - ${nail.images.length} images`.white);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:'.red, error);
        process.exit(1);
    }
};

// Run the seeding
seedDatabase();
