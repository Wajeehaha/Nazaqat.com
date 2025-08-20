// Script to update all products in the Nail collection from COLLECTION1/COLLECTION2 to Narmeen/Dilnasheen
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Nail = require('./models/Nail');
const connectDB = require('./db');

async function updateCollections() {
  await connectDB();
  const res1 = await Nail.updateMany(
    { collection: 'COLLECTION1' },
    { $set: { collection: 'Narmeen' } }
  );
  const res2 = await Nail.updateMany(
    { collection: 'COLLECTION2' },
    { $set: { collection: 'Dilnasheen' } }
  );
  console.log('Updated COLLECTION1 to Narmeen:', res1.modifiedCount);
  console.log('Updated COLLECTION2 to Dilnasheen:', res2.modifiedCount);
  mongoose.connection.close();
}

updateCollections().catch(err => {
  console.error('Error updating collections:', err);
  mongoose.connection.close();
});
