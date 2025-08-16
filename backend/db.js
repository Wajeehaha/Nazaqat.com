const mongoose = require('mongoose');
const colors = require('colors'); // Import colors for colored logs
const dotenv = require('dotenv'); // Import dotenv

dotenv.config(); // Load environment variables from .env

const connectDB = async () => {
    try {
        // Prefer full URI from env, fallback to username/password
        let mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            if (!process.env.DB_USERNAME || !process.env.DB_PASSWORD) {
                throw new Error('MongoDB credentials are missing in .env');
            }
            mongoURI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@da-chi.zebhaml.mongodb.net/dachi-store?retryWrites=true&w=majority`;
        }
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB'.blue);
    } catch (err) {
        console.error('Error connecting to MongoDB:'.red, err);
        process.exit(1);
    }
};

module.exports = connectDB;