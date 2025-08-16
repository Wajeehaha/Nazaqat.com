import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api"; // Base URL for your backend API
const IMAGE_BASE_URL = "http://localhost:3000"; // Base URL for serving images

export const fetchTrendingProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/trendings`);
    const data = response.data;
    console.log("Raw trending data:", data); // Debug log

    // Handle image URLs for nails collections
    if (data) {
      data.COLLECTION1 = data.COLLECTION1.map((item) => {
        const processedItem = {
          ...item,
          image: item.image && item.image.startsWith('http') ? item.image : `${IMAGE_BASE_URL}${item.image}`,
        };
        return processedItem;
      });
      data.COLLECTION2 = data.COLLECTION2.map((item) => {
        const processedItem = {
          ...item,
          image: item.image && item.image.startsWith('http') ? item.image : `${IMAGE_BASE_URL}${item.image}`,
        };
        return processedItem;
      });
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
      const processedItem = {
        ...item,
        image: item.image && item.image.startsWith('http') ? item.image : `${IMAGE_BASE_URL}${item.image}`,
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
    return response.data.map((item) => ({
      ...item,
      image: item.image && item.image.startsWith('http') ? item.image : `${IMAGE_BASE_URL}${item.image}`,
    })); // Returns an array of nails by category with proper image URLs
  } catch (error) {
    console.error("Error fetching nails by category:", error);
    return [];
  }
};

// Fetch nails by collection
export const fetchNailsByCollection = async (collection) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/nails/collection/${collection}`);
    return response.data.map((item) => ({
      ...item,
      image: item.image && item.image.startsWith('http') ? item.image : `${IMAGE_BASE_URL}${item.image}`,
    })); // Returns an array of nails by collection with proper image URLs
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
    return {
      ...item,
      image: item.image && item.image.startsWith('http') ? item.image : `${IMAGE_BASE_URL}${item.image}`,
    }; // Returns a single nail product with proper image URL
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
  console.log("Adding to cart:", userId, product);
  try {
    const response = await axios.post(`${API_BASE_URL}/cart/${userId}`, product);
    return response.data; // Returns the updated cart
  } catch (error) {
    console.error("Error adding to cart:", error);
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
// export const clearCartAPI = async (userId) => {
//   try {
//     const response = await axios.delete(`${API_BASE_URL}/cart/clear/${userId}`);
//     return response.data; // Return the updated cart
//   } catch (error) {
//     console.error('Error clearing cart:', error);
//     throw error; // Throw the error to handle it in the calling function
//   }
// };

// Update the quantity of an item in the cart
export const updateCartQuantity = async (userId, productId, mode) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/cart/${userId}/${productId}`, { mode });
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