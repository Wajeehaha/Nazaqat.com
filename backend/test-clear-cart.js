const axios = require('axios');

const testEndpoints = async () => {
  console.log('Testing cart endpoints...');
  
  // Test 1: Root API endpoint
  try {
    console.log('\n1. Testing root API endpoint...');
    const response = await axios.get('http://localhost:3000/');
    console.log('✓ Root endpoint working:', response.data);
  } catch (error) {
    console.log('✗ Root endpoint failed:', error.message);
  }
  
  // Test 2: Get cart endpoint
  try {
    console.log('\n2. Testing get cart endpoint...');
    const response = await axios.get('http://localhost:3000/api/cart/test-user-id');
    console.log('✓ Get cart endpoint working:', response.data);
  } catch (error) {
    console.log('✗ Get cart endpoint failed:', error.response?.status || error.message);
  }
  
  // Test 3: Clear cart endpoint
  try {
    console.log('\n3. Testing clear cart endpoint...');
    const response = await axios.delete('http://localhost:3000/api/cart/clear/test-user-id');
    console.log('✓ Clear cart endpoint working:', response.data);
  } catch (error) {
    console.log('✗ Clear cart endpoint failed:', error.response?.status || error.message);
    console.log('   Error details:', error.response?.data);
  }
};

testEndpoints();
