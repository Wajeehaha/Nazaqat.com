import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:3000";

export const fetchTrendingProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/trendings`);
    const data = response.data;
    console.log("Raw trending data:", data); // Debug log

    // Handle image URLs for nails collections
    if (data) {
      data.COLLECTION1 = data.COLLECTION1?.map((item) => {
        const processedImage = item.image && item.image.startsWith('http') ? item.image : `${IMAGE_BASE_URL}${item.image}`;
        
        let processedImages = [];
        if (item.images && Array.isArray(item.images) && item.images.length > 0) {
          processedImages = item.images.map(img => 
            img && img.startsWith('http') ? img : `${IMAGE_BASE_URL}${img}`
          );
        } else if (processedImage) {
          processedImages = [processedImage];
        }
        
        return {
          ...item,
          image: processedImage,
          images: processedImages,
        };
      }) || [];
      
      data.COLLECTION2 = data.COLLECTION2?.map((item) => {
        const processedImage = item.image && item.image.startsWith('http') ? item.image : `${IMAGE_BASE_URL}${item.image}`;
        
        let processedImages = [];
        if (item.images && Array.isArray(item.images) && item.images.length > 0) {
          processedImages = item.images.map(img => 
            img && img.startsWith('http') ? img : `${IMAGE_BASE_URL}${img}`
          );
        } else if (processedImage) {
          processedImages = [processedImage];
        }
        
        return {
          ...item,
          image: processedImage,
          images: processedImages,
        };
      }) || [];
    }

    return data; // Returns { COLLECTION1, COLLECTION2 }
  } catch (error) {
    console.error("Error fetching trending products:", error);
    return null;
  }
};

// Fetch all nails
export const fetchNails = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/nails`);
    console.log("Raw nails data:", response.data); // Debug log
    const processedData = response.data.map((item) => {
      const processedImage = item.image && item.image.startsWith('http') ? item.image : `${IMAGE_BASE_URL}${item.image}`;
      
      let processedImages = [];
      if (item.images && Array.isArray(item.images) && item.images.length > 0) {
        processedImages = item.images.map(img => 
          img && img.startsWith('http') ? img : `${IMAGE_BASE_URL}${img}`
        );
      } else if (processedImage) {
        processedImages = [processedImage];
      }
      
      const processedItem = {
        ...item,
        image: processedImage,
        images: processedImages,
      };
      console.log("Processed nail item:", processedItem); // Debug log
      return processedItem;
    });
    return processedData; // Returns an array of nails with proper image URLs
  } catch (error) {
    console.error("Error fetching nails:", error);
    return [];
  }
};

// Fetch nails by category
export const fetchNailsByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/nails/category/${category}`);
    return response.data.map((item) => {
      const processedImage = item.image && item.image.startsWith('http') ? item.image : `${IMAGE_BASE_URL}${item.image}`;
      
      let processedImages = [];
      if (item.images && Array.isArray(item.images) && item.images.length > 0) {
        processedImages = item.images.map(img => 
          img && img.startsWith('http') ? img : `${IMAGE_BASE_URL}${img}`
        );
      } else if (processedImage) {
        processedImages = [processedImage];
      }
      
      return {
        ...item,
        image: processedImage,
        images: processedImages,
      };
    }); // Returns an array of nails by category with proper image URLs
  } catch (error) {
    console.error("Error fetching nails by category:", error);
    return [];
  }
};

// Fetch nails by collection
export const fetchNailsByCollection = async (collection) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/nails/collection/${collection}`);
    return response.data.map((item) => {
      const processedImage = item.image && item.image.startsWith('http') ? item.image : `${IMAGE_BASE_URL}${item.image}`;
      
      let processedImages = [];
      if (item.images && Array.isArray(item.images) && item.images.length > 0) {
        processedImages = item.images.map(img => 
          img && img.startsWith('http') ? img : `${IMAGE_BASE_URL}${img}`
        );
      } else if (processedImage) {
        processedImages = [processedImage];
      }
      
      return {
        ...item,
        image: processedImage,
        images: processedImages,
      };
    }); // Returns an array of nails by collection with proper image URLs
  } catch (error) {
    console.error("Error fetching nails by collection:", error);
    return [];
  }
};

// Fetch a single nail product by ID
export const fetchNailById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/nails/${id}`);
    const item = response.data;
    
    // Process main image
    const processedImage = item.image && item.image.startsWith('http') ? item.image : `${IMAGE_BASE_URL}${item.image}`;
    
    // Process images array
    let processedImages = [];
    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      processedImages = item.images.map(img => 
        img && img.startsWith('http') ? img : `${IMAGE_BASE_URL}${img}`
      );
    } else if (processedImage) {
      // If no images array but has main image, create array with main image
      processedImages = [processedImage];
    }
    
    return {
      ...item,
      image: processedImage,
      images: processedImages,
    }; // Returns a single nail product with proper image URLs
  } catch (error) {
    console.error("Error fetching nail by ID:", error);
    return null;
  }
};;

export const fetchCart = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cart/${userId}`);
    return response.data; // Ensure this returns the cart object with items
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};
// Add an item to the cart
export const addToCart = async (userId, product) => {
  console.log("Adding to cart - userId:", userId, "product:", product.name);
  
  // Validate userId
  if (!userId || userId === 'null' || userId === 'undefined') {
    console.error('Invalid userId for addToCart:', userId);
    throw new Error('User authentication required. Please log in.');
  }
  
  // Transform frontend product object to backend format
  const backendProduct = {
    productId: product.id,
    name: product.name,
    image: product.image,
    pieceOption: product.pieces === 'pieces24' ? '24' : '12', // Convert pieces12/pieces24 to 12/24
    rating: product.rating,
    description: product.description,
    quantity: product.quantity || 1
  };
  
  console.log("Sending to backend:", backendProduct);
  
  try {
    const response = await axios.post(`${API_BASE_URL}/cart/${userId}`, backendProduct);
    console.log('addToCart API response:', response.data);
    return response.data; // Returns the updated cart
  } catch (error) {
    console.error("Error adding to cart:", error);
    if (error.response?.status === 401) {
      throw new Error('Please log in to add items to cart');
    }
    throw error;
  }
};

// Remove an item from the cart
export const removeFromCart = async (userId, productId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/cart/${userId}/${productId}`);
    return response.data; // Returns the updated cart
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
};

// Clear all items from cart
export const clearCartAPI = async (userId) => {
  console.log("clearCartAPI called with userId:", userId);
  console.log("typeof userId:", typeof userId);
  
  // Validate userId
  if (!userId || userId === 'null' || userId === 'undefined') {
    console.error('Invalid userId for clearCart:', userId);
    throw new Error('User authentication required. Please log in.');
  }
  
  const url = `${API_BASE_URL}/cart/clear/${userId}`;
  console.log("Making DELETE request to:", url);
  
  try {
    const response = await axios.delete(url);
    console.log('clearCart API response status:', response.status);
    console.log('clearCart API response data:', response.data);
    return response.data; // Return the updated cart
  } catch (error) {
    console.error('Error clearing cart - full error:', error);
    console.error('Error response status:', error.response?.status);
    console.error('Error response data:', error.response?.data);
    console.error('Error config URL:', error.config?.url);
    
    if (error.response?.status === 401) {
      throw new Error('Please log in to clear cart');
    }
    throw error; // Throw the error to handle it in the calling function
  }
};

// Update the quantity of an item in the cart
export const updateCartQuantity = async (userId, productId, mode, quantity = null) => {
  try {
    const payload = { mode };
    if (mode === 'set' && quantity !== null) {
      payload.quantity = quantity;
    }
    const response = await axios.put(`${API_BASE_URL}/cart/${userId}/${productId}`, payload);
    return response.data; // Returns the updated cart
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    throw error;
  }
};

///placeorder 
export const placeOrder = async (userId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/orders/${userId}`);
    console.log("Order placed successfully:", response.data);
    return response.data; // Returns the order details
  } catch (error) {
    console.error("Error placing order:", error);
    throw error; // Throw the error to handle it in the calling function
  }
};
export const fetchOrders = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/${userId}`);
    return response.data; // Return the fetched orders
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error; // Throw the error to handle it in the calling function
  }
};
export const registerUser = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      name,
      email,
      password,
    });
    return response.data; // Returns user data with token
  } catch (error) {
    console.error("Error registering user:", error);
    throw error.response?.data?.message || "Registration failed";
  }
};

// Login a user
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });
    return response.data; // Returns user data with token
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error.response?.data?.message || "Login failed";
  }
};

export const searchProduct = async (name) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search-product`, {
      params: { name }, // Pass the product name as a query parameter
    });
    const product = response.data;

    // Handle image URL properly
    return {
      ...product,
      image: product.image.startsWith('http') ? product.image : `${IMAGE_BASE_URL}${product.image}`,
    };
  } catch (error) {
    console.error("Error searching product:", error);
    throw error.response?.data?.message || "Product not found";
  }
};




export const perfumes = [
  { id: 1, name: 'Gul', image: '/placeholder.svg', price: '1799', rating: 4.5, description: 'A floral fragrance that captures the essence of blooming roses.' },
  { id: 2, name: 'Janan', image: '/placeholder.svg', price: '1700', rating: 4.2, description: 'An alluring scent that embodies passion and desire.' },
  { id: 3, name: 'Jazb', image: '/placeholder.svg', price: '1800', rating: 4.7, description: 'A magnetic fragrance that draws others in with its captivating aroma.' },
  { id: 4, name: 'Buraq', image: '/placeholder.svg', price: '2000', rating: 4.2, description: 'A heavenly scent inspired by the mythical steed of Islamic tradition.' },
  { id: 5, name: 'Mahoor', image: '/placeholder.svg', price: '1800', rating: 4.7, description: 'A melodious fragrance that resonates with the soul like enchanting music.' },
  { id: 6, name: 'Janoon', image: '/placeholder.svg', price: '1600', rating: 4.2, description: 'An intense and passionate scent for those who live life with fervor.' },
  { id: 7, name: 'Saif-ul-Malook', image: '/placeholder.svg', price: '2000', rating: 4.7, description: 'A mystical fragrance inspired by the legendary lake of poets and lovers.' },
];

export const lotions = [
  { id: 1, name: 'Coconut Dream', price: '200', image: '/placeholder.svg', rating: 4.8, description: 'A deeply moisturizing lotion with the tropical scent of coconut.' },
  { id: 2, name: 'Shea Butter Moisture', price: '220', image: '/placeholder.svg', rating: 4.5, description: 'Rich shea butter formula that nourishes and protects your skin.' },
  { id: 3, name: 'HydraAloe', price: '190', image: '/placeholder.svg', rating: 4.6, description: 'Soothing aloe vera infused lotion that hydrates and calms the skin.' },
];

export const deodorants = [
  { id: 1, name: 'Fresh', image: '/placeholder.svg', price: '299', rating: 4.5, description: 'A refreshing scent that keeps you cool all day.' },
  { id: 2, name: 'Cool', image: '/placeholder.svg', price: '349', rating: 4.2, description: 'A cool and invigorating fragrance for active individuals.' },
  { id: 3, name: 'Sport', image: '/placeholder.svg', price: '399', rating: 4.7, description: 'A sporty scent that energizes and revitalizes.' },
];