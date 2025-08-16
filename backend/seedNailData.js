const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

// Import models
const Nail = require('./models/Nail');
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

// Sample nail data
const nails = [
    // Collection 1 - Gel Nails
    {
        name: "Classic Red Gel",
        image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop",
        price: 45.00,
        rating: 4.8,
        description: "Long-lasting classic red gel nail polish with brilliant shine.",
        stock: 25,
        collection: 'COLLECTION1',
        category: 'gel-nails'
    },
    {
        name: "French Manicure Gel Set",
        image: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400&h=400&fit=crop",
        price: 65.00,
        rating: 4.9,
        description: "Professional French manicure gel set with base and top coat.",
        stock: 20,
        collection: 'COLLECTION1',
        category: 'gel-nails'
    },
    {
        name: "Nude Pink Gel",
        image: "https://images.unsplash.com/photo-1515688594390-b649af70d282?w=400&h=400&fit=crop",
        price: 42.00,
        rating: 4.7,
        description: "Elegant nude pink gel polish perfect for everyday wear.",
        stock: 30,
        collection: 'COLLECTION1',
        category: 'gel-nails'
    },

    // Collection 1 - Acrylic Nails
    {
        name: "Acrylic Extension Kit",
        image: "https://images.unsplash.com/photo-1632345031453-988b4c60beec?w=400&h=400&fit=crop",
        price: 85.00,
        rating: 4.6,
        description: "Complete acrylic nail extension kit with forms and powder.",
        stock: 15,
        collection: 'COLLECTION1',
        category: 'acrylic-nails'
    },
    {
        name: "Clear Acrylic Powder",
        image: "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=400&h=400&fit=crop",
        price: 35.00,
        rating: 4.5,
        description: "High-quality clear acrylic powder for natural nail extensions.",
        stock: 40,
        collection: 'COLLECTION1',
        category: 'acrylic-nails'
    },

    // Collection 2 - Nail Art
    {
        name: "Glitter Nail Art Set",
        image: "https://images.unsplash.com/photo-1595751520943-1806076c28c3?w=400&h=400&fit=crop",
        price: 55.00,
        rating: 4.8,
        description: "Sparkling glitter collection for stunning nail art designs.",
        stock: 35,
        collection: 'COLLECTION2',
        category: 'nail-art'
    },
    {
        name: "Rhinestone Decoration Kit",
        image: "https://images.unsplash.com/photo-1599888230318-7e7c95518430?w=400&h=400&fit=crop",
        price: 28.00,
        rating: 4.6,
        description: "Premium rhinestones and gems for luxurious nail decorations.",
        stock: 25,
        collection: 'COLLECTION2',
        category: 'nail-art'
    },
    {
        name: "Nail Art Brushes Set",
        image: "https://images.unsplash.com/photo-1607893378714-007fd47c8719?w=400&h=400&fit=crop",
        price: 32.00,
        rating: 4.7,
        description: "Professional nail art brushes for detailed designs and patterns.",
        stock: 30,
        collection: 'COLLECTION2',
        category: 'nail-art'
    },

    // Collection 2 - Nail Care
    {
        name: "Cuticle Oil Treatment",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
        price: 18.00,
        rating: 4.9,
        description: "Nourishing cuticle oil with vitamin E for healthy nail growth.",
        stock: 50,
        collection: 'COLLECTION2',
        category: 'nail-care'
    },
    {
        name: "Strengthening Base Coat",
        image: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400&h=400&fit=crop",
        price: 25.00,
        rating: 4.8,
        description: "Fortifying base coat that strengthens weak and brittle nails.",
        stock: 45,
        collection: 'COLLECTION2',
        category: 'nail-care'
    },
    {
        name: "Nail Repair Serum",
        image: "https://images.unsplash.com/photo-1619451683461-66b8b6a8d8d6?w=400&h=400&fit=crop",
        price: 38.00,
        rating: 4.7,
        description: "Advanced nail repair serum for damaged and split nails.",
        stock: 20,
        collection: 'COLLECTION2',
        category: 'nail-care'
    }
];

// Sample users
const users = [
    {
        name: 'Admin User',
        email: 'admin@nazakat.com',
        password: 'admin123'
    },
    {
        name: 'Test User',
        email: 'test@nazakat.com',
        password: 'test123'
    }
];

// Sample logo
const logos = [
    {
        image: '/uploads/logo.jpg'
    }
];

const seedData = async () => {
    try {
        // Clear existing data
        console.log('Clearing existing data...'.yellow);
        await Nail.deleteMany({});
        await User.deleteMany({});
        await Logo.deleteMany({});
        
        // Insert new data
        console.log('Inserting nail products...'.green);
        await Nail.insertMany(nails);
        
        console.log('Inserting users...'.green);
        await User.insertMany(users);
        
        console.log('Inserting logo...'.green);
        await Logo.insertMany(logos);

        console.log('Data seeded successfully!'.green.bold);
        
        // Display summary
        const nailCount = await Nail.countDocuments();
        const userCount = await User.countDocuments();
        const logoCount = await Logo.countDocuments();
        
        console.log('\n📊 Database Summary:'.blue.bold);
        console.log(`Nail Products: ${nailCount}`.cyan);
        console.log(`Users: ${userCount}`.cyan);
        console.log(`Logos: ${logoCount}`.cyan);
        
        // Show category breakdown
        const gelNails = await Nail.countDocuments({ category: 'gel-nails' });
        const acrylicNails = await Nail.countDocuments({ category: 'acrylic-nails' });
        const nailArt = await Nail.countDocuments({ category: 'nail-art' });
        const nailCare = await Nail.countDocuments({ category: 'nail-care' });
        
        console.log('\n🎨 Category Breakdown:'.blue.bold);
        console.log(`Gel Nails: ${gelNails}`.cyan);
        console.log(`Acrylic Nails: ${acrylicNails}`.cyan);
        console.log(`Nail Art: ${nailArt}`.cyan);
        console.log(`Nail Care: ${nailCare}`.cyan);
        
        // Show collection breakdown
        const collection1 = await Nail.countDocuments({ collection: 'COLLECTION1' });
        const collection2 = await Nail.countDocuments({ collection: 'COLLECTION2' });
        
        console.log('\n📚 Collection Breakdown:'.blue.bold);
        console.log(`Collection 1: ${collection1}`.cyan);
        console.log(`Collection 2: ${collection2}`.cyan);
        
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
