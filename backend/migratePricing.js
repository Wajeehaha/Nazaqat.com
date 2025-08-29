const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Nail = require('./models/Nail');
const Perfume = require('./models/Perfume');
const Deodorant = require('./models/Deodorant');
const Lotion = require('./models/Lotions');

async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
}

async function migratePricing() {
    try {
        console.log('Starting pricing migration...');

        // Update Nails
        const nails = await Nail.find({});
        console.log(`Found ${nails.length} nail products to update`);
        
        for (const nail of nails) {
            if (!nail.pricing) {
                nail.pricing = {
                    pieces12: 799,
                    pieces24: 1199
                };
                nail.stock = {
                    pieces12: nail.stock || 0,
                    pieces24: nail.stock || 0
                };
                await nail.save();
                console.log(`Updated nail product: ${nail.name}`);
            }
        }

        // Update Perfumes
        const perfumes = await Perfume.find({});
        console.log(`Found ${perfumes.length} perfume products to update`);
        
        for (const perfume of perfumes) {
            if (!perfume.pricing) {
                perfume.pricing = {
                    pieces12: 799,
                    pieces24: 1199
                };
                perfume.stock = {
                    pieces12: perfume.stock || 0,
                    pieces24: perfume.stock || 0
                };
                await perfume.save();
                console.log(`Updated perfume product: ${perfume.name}`);
            }
        }

        // Update Deodorants
        const deodorants = await Deodorant.find({});
        console.log(`Found ${deodorants.length} deodorant products to update`);
        
        for (const deodorant of deodorants) {
            if (!deodorant.pricing) {
                deodorant.pricing = {
                    pieces12: 799,
                    pieces24: 1199
                };
                deodorant.stock = {
                    pieces12: deodorant.stock || 0,
                    pieces24: deodorant.stock || 0
                };
                await deodorant.save();
                console.log(`Updated deodorant product: ${deodorant.name}`);
            }
        }

        // Update Lotions
        const lotions = await Lotion.find({});
        console.log(`Found ${lotions.length} lotion products to update`);
        
        for (const lotion of lotions) {
            if (!lotion.pricing) {
                lotion.pricing = {
                    pieces12: 799,
                    pieces24: 1199
                };
                lotion.stock = {
                    pieces12: lotion.stock || 0,
                    pieces24: lotion.stock || 0
                };
                await lotion.save();
                console.log(`Updated lotion product: ${lotion.name}`);
            }
        }

        console.log('Pricing migration completed successfully!');
        
    } catch (error) {
        console.error('Error during pricing migration:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the migration
connectToDatabase().then(() => {
    migratePricing();
});
