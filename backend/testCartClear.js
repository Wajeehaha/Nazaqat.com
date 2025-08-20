const axios = require('axios');

// Test the cart clearing API
async function testCartClear() {
    try {
        console.log('Testing cart clear API...');
        
        // Test with a sample userId
        const userId = '60d5ecb54ef7ec001f4b1234'; // Sample user ID
        
        // First, check if cart exists
        console.log('1. Checking current cart...');
        try {
            const cartResponse = await axios.get(`http://localhost:3000/api/cart/${userId}`);
            console.log('Current cart:', cartResponse.data);
        } catch (error) {
            console.log('Cart check error:', error.response?.data || error.message);
        }
        
        // Clear the cart
        console.log('2. Clearing cart...');
        const clearResponse = await axios.delete(`http://localhost:3000/api/cart/clear/${userId}`);
        console.log('Clear response:', clearResponse.data);
        
        // Check cart again
        console.log('3. Checking cart after clear...');
        const cartAfterClear = await axios.get(`http://localhost:3000/api/cart/${userId}`);
        console.log('Cart after clear:', cartAfterClear.data);
        
        console.log('✅ Cart clear test completed successfully!');
        
    } catch (error) {
        console.error('❌ Cart clear test failed:', error.response?.data || error.message);
    }
}

// Run the test
testCartClear();
