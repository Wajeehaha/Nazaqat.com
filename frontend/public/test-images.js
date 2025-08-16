// Test script to verify image URLs
// You can run this in the browser console to test image loading

const testImageURL = "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop";

// Test 1: Create an image element and try to load it
const img = new Image();
img.onload = () => console.log("✅ Image loaded successfully:", testImageURL);
img.onerror = () => console.log("❌ Image failed to load:", testImageURL);
img.src = testImageURL;

// Test 2: Fetch the image
fetch(testImageURL, { method: 'HEAD' })
  .then(response => {
    if (response.ok) {
      console.log("✅ Image URL is accessible:", testImageURL);
      console.log("Response headers:", response.headers);
    } else {
      console.log("❌ Image URL returned error:", response.status, testImageURL);
    }
  })
  .catch(error => console.log("❌ Network error:", error));

// Test 3: Log current database seed data
console.log("Expected image URLs from seed data:");
console.log("Chanel No. 5:", "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop");
console.log("Dior Sauvage:", "https://images.unsplash.com/photo-1588405748880-12d1d2a59d32?w=400&h=400&fit=crop");
