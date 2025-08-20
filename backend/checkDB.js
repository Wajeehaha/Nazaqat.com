const mongoose = require('mongoose');
const Nail = require('./models/Nail');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@da-chi.zebhaml.mongodb.net/dachi-store?retryWrites=true&w=majority`)
.then(async () => {
  console.log('Connected to MongoDB');
  const nails = await Nail.find();
  console.log('All nails in database:');
  nails.forEach(nail => {
    console.log(`- ${nail.name} (Collection: ${nail.collection}, Rating: ${nail.rating})`);
  });
  
  console.log('\nTrending nails (rating >= 4.5):');
  const trending = await Nail.find({ rating: { $gte: 4.5 } });
  trending.forEach(nail => {
    console.log(`- ${nail.name} (Collection: ${nail.collection}, Rating: ${nail.rating})`);
  });
  
  console.log('\nDistinct collections:');
  const collections = await Nail.distinct('collection');
  console.log(collections);
  
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
