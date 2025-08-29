const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

// Import models
const Nail = require('./models/Nail');

dotenv.config();

// Dummy nail data with multiple images for slideshow and dual pricing structure
const dummyNails=[// Collection 1 - Product 1
    {
        name: "Sahil",
        image: "/uploads/Narmeen-sahil-1.jpg",
        images: [
            "/uploads/Narmeen-sahil-1.jpg",
            "/uploads/Narmeen-sahil-2.jpg",
            "/uploads/Narmeen-sahil-3.jpg",
            "/uploads/Narmeen-sahil-4.jpg"
        ],
        // New pricing structure with different piece options
        pricing: {
            pieces12: 799, // 12 pieces for 799
            pieces24: 1199  // 24 pieces for 1199
        },
        // Deprecated: Keep for backward compatibility but not used
        price: 799,
        rating: 4.5,
        description: "Minimal yet timeless, Saahil nails capture the calm of the shore with their soft nude tones. Perfectly short and versatile, they're designed for everyday elegance and a natural, graceful finish",
        // Stock for both options
        stock: {
            pieces12: 20,
            pieces24: 15
        },
        collection: 'Narmeen'
    },
    // Collection 1 - Product 2
    {
        name: "Noor",
        image: "/uploads/Narmeen-noor-1.jpg",
        images: [
            "/uploads/Narmeen-noor-1.jpg",
            "/uploads/Narmeen-noor-2.jpg",
            "/uploads/Narmeen-noor-3.jpg",
            "/uploads/narmeen-noor-4.jpg"
        ],
        // New pricing structure with different piece options
        pricing: {
            pieces12: 799, // 12 pieces for 799
            pieces24: 1199  // 24 pieces for 1199
        },
        // Deprecated: Keep for backward compatibility but not used
        price: 799,
        rating: 4.7,
        description: "A dreamy blend of elegance and radiance, Noor nails shine with soft nude pink tones and a delicate touch of glitter. Long, graceful, and luminous—just like their name, they light up every look with effortless beauty.",
        // Stock for both options
        stock: {
            pieces12: 25,
            pieces24: 18
        },
        collection: 'Narmeen'
    },

    // Collection 2 - Product 1
    {
        name: "Naaz",
        image: "/uploads/Dilnasheen-naaz-1.jpg",
        images: [
           
            "/uploads/Dilnasheen-naaz-2.jpg",
            "/uploads/Dilnasheen-naaz-3.jpg"  ,
            "/uploads/Dilnasheen-naaz-4.jpg",
            "/uploads/Dilnasheen-naaz-5.jpg"
        ],
        // New pricing structure with different piece options
        pricing: {
            pieces12: 799, // 12 pieces for 799
            pieces24: 1199  // 24 pieces for 1199
        },
        // Deprecated: Keep for backward compatibility but not used
        price: 799,
        rating: 4.6,
        description: "A bold twist on classic sophistication, Naaz features long nude nails with sharp black French tips. Chic, confident, and graceful—these nails embody poise with a touch of modern edge.",
        // Stock for both options
        stock: {
            pieces12: 22,
            pieces24: 12
        },
        collection: 'Dilnasheen'
    },
    // Collection 2 - Product 2
   {
        name: "Suroor",
        image: "/uploads/Dilnasheen-suroor-1.jpg",
        images: [
           
            "/uploads/Dilnasheen-suroor-2.jpg",
            "/uploads/Dilnasheen-suroor-3.jpg",
       
        ],
        // New pricing structure with different piece options
        pricing: {
            pieces12: 799, // 12 pieces for 799
            pieces24: 1199  // 24 pieces for 1199
        },
        // Deprecated: Keep for backward compatibility but not used
        price: 799,
        rating: 4.8,
        description: "Suroor is pure indulgence—a deep maroon base kissed with golden glitter. Luxurious, festive, and mesmerizing, these long nails are made for moments that deserve to be unforgettable.",
        // Stock for both options
        stock: {
            pieces12: 18,
            pieces24: 10
        },
        collection: 'Dilnasheen'
    },
];

// MongoDB connection
// const connectDB = async () => {
//     try {
//         const mongoURI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@da-chi.zebhaml.mongodb.net/dachi-store?retryWrites=true&w=majority`;
//         await mongoose.connect(mongoURI);
//         console.log('Connected to MongoDB Atlas for seeding'.blue);
//     } catch (err) {
//         console.error('Error connecting to MongoDB:'.red, err);
//         process.exit(1);
//     }
// };

// const dotenv = require('dotenv');
// const colors = require('colors');

// // Import models
// const Nail = require('./models/Nail');

// dotenv.config();

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

// Dummy nail data with multiple images for slideshow and dual pricing structure
// const dummyNails = [
//     // Collection 1 - Product 1
//     {
//         name: "Sahil",
//         image: "/uploads/Narmeen-sahil-1.jpg",
//         images: [
//             "/uploads/Narmeen-sahil-1.jpg",
//             "/uploads/Narmeen-sahil-2.jpg",
//             "/uploads/Narmeen-sahil-3.jpg",
//             "/uploads/Narmeen-sahil-4.jpg"
//         ],
//         price: 1300.00,
//         rating: 4.5,
//         description: "Minimal yet timeless, Saahil nails capture the calm of the shore with their soft nude tones. Perfectly short and versatile, they’re designed for everyday elegance and a natural, graceful finish",
//         stock: 15,
//         collection: 'Narmeen'
//     },
//     // Collection 1 - Product 2
//     {
//         name: "Noor",
//         image: "/uploads/Narmeen-noor-1.jpg",
//         images: [
//             "/uploads/Narmeen-noor-1.jpg",
//             "/uploads/Narmeen-noor-2.jpg",
//             "/uploads/Narmeen-noor-3.jpg",
//             "/uploads/Narmeen-noor-4.jpg"
//         ],
//         // New pricing structure with different piece options
//         pricing: {
//             pieces12: 799, // 12 pieces for 799
//             pieces24: 1199  // 24 pieces for 1199
//         },
//         // Deprecated: Keep for backward compatibility but not used
//         price: 799,
//         rating: 4.7,
//         description: "A dreamy blend of elegance and radiance, Noor nails shine with soft nude pink tones and a delicate touch of glitter. Long, graceful, and luminous—just like their name, they light up every look with effortless beauty.",
//         // Stock for both options
//         stock: {
//             pieces12: 25,
//             pieces24: 18
//         },
//         collection: 'Narmeen'
//     },

//     // Collection 2 - Product 1
//     {
//         name: "Naaz",
//         image: "/uploads/Dilnasheen-naaz-1.jpg",
//         images: [
           
//             "/uploads/Dilnasheen-naaz-2.jpg",
//             "/uploads/Dilnasheen-naaz-3.jpg"  ,
//             "/uploads/Dilnasheen-naaz-4.jpg",
//             "/uploads/Dilnasheen-naaz-5.jpg"
//         ],
//         // New pricing structure with different piece options
//         pricing: {
//             pieces12: 799, // 12 pieces for 799
//             pieces24: 1199  // 24 pieces for 1199
//         },
//         // Deprecated: Keep for backward compatibility but not used
//         price: 799,
//         rating: 4.6,
//         description: "A bold twist on classic sophistication, Naaz features long nude nails with sharp black French tips. Chic, confident, and graceful—these nails embody poise with a touch of modern edge.",
//         // Stock for both options
//         stock: {
//             pieces12: 22,
//             pieces24: 12
//         },
//         collection: 'Dilnasheen'
//     },
//     // Collection 2 - Product 2
//    {
//         name: "Suroor",
//         image: "/uploads/Dilnasheen-suroor-1.jpg",
//         images: [
           
//             "/uploads/Dilnasheen-suroor-2.jpg",
//             "/uploads/Dilnasheen-suroor-3.jpg",
       
//         ],
//         // New pricing structure with different piece options
//         pricing: {
//             pieces12: 799, // 12 pieces for 799
//             pieces24: 1199  // 24 pieces for 1199
//         },
//         // Deprecated: Keep for backward compatibility but not used
//         price: 799,
//         rating: 4.8,
//         description: "Suroor is pure indulgence—a deep maroon base kissed with golden glitter. Luxurious, festive, and mesmerizing, these long nails are made for moments that deserve to be unforgettable.",
//         // Stock for both options
//         stock: {
//             pieces12: 18,
//             pieces24: 10
//         },
//         collection: 'Dilnasheen'
//     },
// ];

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
