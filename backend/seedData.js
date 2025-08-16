const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

// Import models
const Perfume = require('./models/Perfume');
const Deodorant = require('./models/Deodorant');
const Lotion = require('./models/Lotions');
const User = require('./models/User');
const Logo = require('./models/Logo');

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

// Sample data
const perfumes = [
    {
        name: "Chanel No. 5",
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
        price: "120.00",
        rating: 4.8,
        description: "A timeless classic fragrance with floral notes and aldehydes.",
        stock: 25
    },
    {
        name: "Dior Sauvage",
        image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop", 
        price: "95.00",
        rating: 4.7,
        description: "A fresh and spicy fragrance with bergamot and pepper notes.",
        stock: 30
    },
    {
        name: "Tom Ford Black Orchid",
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop",
        price: "140.00", 
        rating: 4.6,
        description: "A luxurious and mysterious fragrance with dark floral notes.",
        stock: 15
    },
    {
        name: "Versace Bright Crystal",
        image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop",
        price: "75.00",
        rating: 4.5,
        description: "A fresh and vibrant fragrance with fruity and floral notes.",
        stock: 40
    },
    {
        name: "Creed Aventus",
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
        price: "320.00",
        rating: 4.9,
        description: "A sophisticated fragrance with pineapple, birch, and musk.",
        stock: 10
    }
];

const deodorants = [
    {
        name: "Axe Dark Temptation",
        image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop",
        price: "12.99",
        rating: 4.2,
        description: "Long-lasting protection with chocolate fragrance notes.",
        stock: 50
    },
    {
        name: "Old Spice Classic",
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop", 
        price: "8.99",
        rating: 4.1,
        description: "Original spice fragrance with 24-hour protection.",
        stock: 60
    },
    {
        name: "Dove Men+Care Clean Comfort",
        image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop",
        price: "6.99",
        rating: 4.3,
        description: "Gentle protection with moisturizing formula.",
        stock: 45
    },
    {
        name: "Secret Clinical Strength", 
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
        price: "9.99",
        rating: 4.4,
        description: "Maximum protection antiperspirant for women.",
        stock: 35
    },
    {
        name: "Degree MotionSense",
        image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop",
        price: "7.49",
        rating: 4.0,
        description: "Motion-activated protection that releases fragrance as you move.",
        stock: 55
    }
];

const lotions = [
    {
        name: "Nivea Soft Moisturizing Cream",
        price: 8.99,
        image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop",
        rating: 4.3,
        description: "Light, non-greasy formula for soft and smooth skin.",
        stock: 75
    },
    {
        name: "Cetaphil Daily Facial Moisturizer",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop", 
        rating: 4.5,
        description: "Gentle moisturizer with SPF 15 for sensitive skin.",
        stock: 40
    },
    {
        name: "Aveeno Daily Moisturizing Lotion",
        price: 9.99,
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
        rating: 4.4,
        description: "Oat-based formula for dry and sensitive skin.",
        stock: 60
    },
    {
        name: "L'Occitane Shea Butter Hand Cream",
        price: 18.00,
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
        rating: 4.7,
        description: "Rich shea butter formula for intensive hand care.",
        stock: 30
    },
    {
        name: "Bath & Body Works Japanese Cherry Blossom",
        price: 13.50,
        image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop",
        rating: 4.2,
        description: "Floral scented body lotion with cherry blossom and Asian pear.",
        stock: 45
    }
];

const users = [
    {
        name: "John Doe",
        email: "john.doe@example.com", 
        password: "password123"
    },
    {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        password: "password123"
    },
    {
        name: "Ahmed Khan",
        email: "ahmed.khan@example.com",
        password: "password123"
    },
    {
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com", 
        password: "password123"
    }
];

const logos = [
    {
        image: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop"
    }
];

// Seeding function
const seedData = async () => {
    try {
        // Clear existing data
        console.log('Clearing existing data...'.yellow);
        await Perfume.deleteMany({});
        await Deodorant.deleteMany({});
        await Lotion.deleteMany({});
        await User.deleteMany({});
        await Logo.deleteMany({});

        // Insert new data
        console.log('Inserting perfumes...'.green);
        await Perfume.insertMany(perfumes);
        
        console.log('Inserting deodorants...'.green);
        await Deodorant.insertMany(deodorants);
        
        console.log('Inserting lotions...'.green);
        await Lotion.insertMany(lotions);
        
        console.log('Inserting users...'.green);
        await User.insertMany(users);
        
        console.log('Inserting logo...'.green);
        await Logo.insertMany(logos);

        console.log('Data seeded successfully!'.green.bold);
        
        // Display summary
        const perfumeCount = await Perfume.countDocuments();
        const deodorantCount = await Deodorant.countDocuments();
        const lotionCount = await Lotion.countDocuments();
        const userCount = await User.countDocuments();
        const logoCount = await Logo.countDocuments();
        
        console.log('\n📊 Database Summary:'.blue.bold);
        console.log(`Perfumes: ${perfumeCount}`.cyan);
        console.log(`Deodorants: ${deodorantCount}`.cyan);
        console.log(`Lotions: ${lotionCount}`.cyan);
        console.log(`Users: ${userCount}`.cyan);
        console.log(`Logos: ${logoCount}`.cyan);
        
    } catch (error) {
        console.error('Error seeding data:'.red, error);
    } finally {
        mongoose.connection.close();
    }
};

// Run the seeding script
const runSeeder = async () => {
    await connectDB();
    await seedData();
};

runSeeder();
