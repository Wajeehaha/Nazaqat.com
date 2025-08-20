const mongoose = require('mongoose');
const Coupon = require('./models/Coupon');
const connectDB = require('./db');

// Sample coupons data
const sampleCoupons = [
    {
        code: 'WELCOME10',
        description: 'Welcome discount for new customers',
        discountType: 'percentage',
        discountValue: 10,
        minimumAmount: 500,
        maximumDiscount: 200,
        usageLimit: 100,
        validUntil: new Date('2025-12-31'),
        applicableCategories: []
    },
    {
        code: 'SAVE50',
        description: 'Save Rs. 50 on orders above Rs. 1000',
        discountType: 'fixed',
        discountValue: 50,
        minimumAmount: 1000,
        usageLimit: 50,
        validUntil: new Date('2025-12-31'),
        applicableCategories: []
    },
    {
        code: 'NAIL20',
        description: '20% off on all nail products',
        discountType: 'percentage',
        discountValue: 20,
        minimumAmount: 300,
        maximumDiscount: 300,
        usageLimit: 200,
        validUntil: new Date('2025-12-31'),
        applicableCategories: ['nails']
    },
    {
        code: 'FIRST15',
        description: '15% off for first-time buyers',
        discountType: 'percentage',
        discountValue: 15,
        minimumAmount: 200,
        maximumDiscount: 150,
        usageLimit: null, // unlimited
        validUntil: new Date('2025-12-31'),
        applicableCategories: []
    },
    {
        code: 'MEGA25',
        description: '25% off on orders above Rs. 2000',
        discountType: 'percentage',
        discountValue: 25,
        minimumAmount: 2000,
        maximumDiscount: 500,
        usageLimit: 30,
        validUntil: new Date('2025-12-31'),
        applicableCategories: []
    }
];

async function seedCoupons() {
    try {
        // Connect to database
        await connectDB();
        console.log('Connected to MongoDB');

        // Clear existing coupons
        await Coupon.deleteMany({});
        console.log('Cleared existing coupons');

        // Insert sample coupons
        const insertedCoupons = await Coupon.insertMany(sampleCoupons);
        console.log(`Inserted ${insertedCoupons.length} sample coupons`);

        // Display inserted coupons
        console.log('\n📋 Sample Coupons Created:');
        console.log('================================');
        insertedCoupons.forEach(coupon => {
            console.log(`🎟️  ${coupon.code}`);
            console.log(`   Description: ${coupon.description}`);
            console.log(`   Discount: ${coupon.discountType === 'percentage' ? coupon.discountValue + '%' : 'Rs. ' + coupon.discountValue}`);
            console.log(`   Min Order: Rs. ${coupon.minimumAmount}`);
            if (coupon.maximumDiscount) {
                console.log(`   Max Discount: Rs. ${coupon.maximumDiscount}`);
            }
            console.log(`   Usage Limit: ${coupon.usageLimit || 'Unlimited'}`);
            console.log(`   Valid Until: ${coupon.validUntil.toDateString()}`);
            console.log('   ───────────────────────────');
        });

        console.log('\n✅ Coupon seeding completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding coupons:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    seedCoupons();
}

module.exports = seedCoupons;
