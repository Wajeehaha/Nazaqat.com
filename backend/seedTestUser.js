// const mongoose = require('mongoose');
// const connectDB = require('./db');
// const User = require('./models/User');

// const seedTestUser = async () => {
//   try {
//     await connectDB();
    
//     // Create a test user with the ID we're using in frontend
//     const testUser = new User({
//       _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
//       firstName: 'John',
//       lastName: 'Doe',
//       email: 'john.doe@test.com',
//       password: 'testpassword123' // This should be hashed in real implementation
//     });

//     // Check if user already exists
//     const existingUser = await User.findById('507f1f77bcf86cd799439011');
//     if (!existingUser) {
//       await testUser.save();
//       console.log('Test user created successfully');
//     } else {
//       console.log('Test user already exists');
//     }

//   } catch (error) {
//     console.error('Error creating test user:', error);
//   }
// };

// // Run if called directly
// if (require.main === module) {
//   seedTestUser().then(() => {
//     console.log('Seeding completed');
//     process.exit(0);
//   });
// }

// module.exports = seedTestUser;
