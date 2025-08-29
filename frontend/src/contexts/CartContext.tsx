import React, { createContext, useReducer, useContext, ReactNode, useEffect, useState } from 'react';
import { toast } from "sonner";
import { fetchCart, addToCart as addToCartAPI, removeFromCart as removeFromCartAPI, updateCartQuantity, clearCartAPI } from '@/assets/data'; // Import API functions

type Product = {
  id: string; // Use id (mapped from MongoDB's _id)
  name: string;
  image: string;
  price: string;
  rating?: number;
  description?: string;
  pieces?: string; // Add pieces property for dual pricing
};

type CartItem = Product & {
  quantity: number;
};

interface CartState {
  cartItems: CartItem[];
}

type CartAction =
  | { type: "SET_CART"; payload: CartItem[] }
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" };

const initialState: CartState = {
  cartItems: [],
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "SET_CART": {
      return {
        ...state,
        cartItems: action.payload,
      };
    }

    case "ADD_TO_CART": {
      const existingItem = state.cartItems.find((item) => item.id === action.payload.id);

      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, action.payload],
        };
      }
    }

    case "REMOVE_FROM_CART": {
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.id !== action.payload.id),
      };
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
      };
    }

    case "CLEAR_CART": {
      return {
        ...state,
        cartItems: [],
      };
    }

    default:
      return state;
  }
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshUserId: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [userId, setUserId] = useState<string | null>(null);

  // Initialize userId from localStorage and listen for changes
  useEffect(() => {
    const initializeUserId = () => {
      const storedUserId = localStorage.getItem("userId");
      console.log("Initializing userId from localStorage:", storedUserId);
      setUserId(storedUserId);
      return storedUserId;
    };

    // Initialize on mount
    const initialUserId = initializeUserId();

    // Listen for localStorage changes (when user logs in/out)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userId') {
        console.log("UserId changed in localStorage via storage event:", e.newValue);
        setUserId(e.newValue);
      }
    };

    // Also listen for manual localStorage updates (for same tab)
    const handleStorageUpdate = () => {
      const currentUserId = localStorage.getItem("userId");
      if (currentUserId !== userId) {
        console.log("UserId changed in localStorage via polling:", currentUserId);
        setUserId(currentUserId);
      }
    };

    // Poll for changes every second (for same tab updates)
    const pollInterval = setInterval(handleStorageUpdate, 1000);

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(pollInterval);
    };
  }, [userId]);

  useEffect(() => {
    const loadCart = async () => {
      if (!userId) {
        console.log("No userId available, skipping cart load");
        return;
      }
      
      try {
        console.log("Loading cart for userId:", userId);
        const cart = await fetchCart(userId); // Fetch cart from backend
        // Map productId to id for frontend compatibility
        const mappedItems = (cart.items || []).map(item => ({
          ...item,
          id: item.productId, // Map productId to id
          price: item.price.toString(), // Ensure price is string for frontend
        }));
        console.log("Cart loaded successfully:", mappedItems);
        dispatch({ type: "SET_CART", payload: mappedItems });
      } catch (error) {
        console.error("Error loading cart:", error);
        toast.error("Failed to load cart. Please try again.");
      }
    };

    loadCart();
  }, [userId]); // Depend on userId state instead of localStorage directly
const addToCart = async (product: Product, quantity: number = 1) => {
  console.log("CartContext addToCart called - userId:", userId, "product:", product.name, "quantity:", quantity);
  
  if (!userId) {
    console.error("No userId in CartContext addToCart");
    toast.error("Please log in to add items to cart");
    return;
  }
  
  try {
    console.log("Calling addToCartAPI with userId:", userId);
    const updatedCart = await addToCartAPI(userId, {
      id: product.id, // Keep as 'id' for frontend, will be transformed in data.js
      name: product.name,
      image: product.image,
      price: product.price,
      rating: product.rating,
      description: product.description,
      pieces: product.pieces, // Pass the pieces information
      quantity: quantity, // Use the passed quantity
    });
    console.log("addToCartAPI completed successfully, updating state");
    // Map productId to id for frontend compatibility
    const mappedItems = (updatedCart.items || []).map(item => ({
      ...item,
      id: item.productId, // Map productId to id
      price: item.price.toString(), // Ensure price is string for frontend
    }));
    dispatch({ type: "SET_CART", payload: mappedItems });
    toast.success(`${product.name} added to cart successfully!`); // Show success toast
  } catch (error) {
    console.error("Error adding to cart:", error);
    toast.error(error.message || "Failed to add item to cart. Please try again."); // Show error toast
  }
};

  const removeFromCart = async (id: string) => {
  if (!userId) {
    toast.error("Please log in to modify cart");
    return;
  }
  
  try {
    console.log("Removing from cart for userId:", userId);
    const updatedCart = await removeFromCartAPI(userId, id); // Call the API to remove the item
    // Map productId to id for frontend compatibility
    const mappedItems = (updatedCart.items || []).map(item => ({
      ...item,
      id: item.productId, // Map productId to id
      price: item.price.toString(), // Ensure price is string for frontend
    }));
    dispatch({ type: "SET_CART", payload: mappedItems }); // Update the cart state
    toast.success("Item removed from cart!");
     console.log("Updated Cart:", updatedCart); // Debugging
  } catch (error) {
    console.error("Error removing from cart:", error);
    toast.error("Failed to remove item from cart. Please try again.");
  }
};
  const updateQuantity = async (id: string, quantity: number) => {
    if (!userId) {
      toast.error("Please log in to modify cart");
      return;
    }
    
    if (quantity <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }
    
    try {
      console.log("Updating quantity for userId:", userId, "productId:", id, "to quantity:", quantity);
      const updatedCart = await updateCartQuantity(userId, id, "set", quantity);
      // Map productId to id for frontend compatibility
      const mappedItems = (updatedCart.items || []).map(item => ({
        ...item,
        id: item.productId, // Map productId to id
        price: item.price.toString(), // Ensure price is string for frontend
      }));
      dispatch({ type: "SET_CART", payload: mappedItems });
      toast.success("Cart updated successfully!");
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      toast.error(error.response?.data?.message || "Failed to update cart. Please try again.");
    }
  };

const clearCart = async () => {
  try {
    console.log("Starting clearCart function...");
    console.log("Current userId:", userId);
    
    if (!userId) {
      console.error("No userId found, cannot clear cart");
      toast.error("User not logged in");
      return;
    }
    
    console.log("Calling clearCartAPI...");
    const result = await clearCartAPI(userId); // Call the API to clear the cart
    console.log("clearCartAPI result:", result);
    
    console.log("Dispatching CLEAR_CART action...");
    dispatch({ type: "CLEAR_CART" }); // Clear the cart in the state
    console.log("Cart cleared successfully in context");
    
    toast.success("Cart cleared successfully!");
  } catch (error) {
    console.error("Error clearing cart:", error);
    toast.error("Failed to clear cart. Please try again.");
  }
};

const refreshUserId = () => {
  const storedUserId = localStorage.getItem("userId");
  console.log("Refreshing userId from localStorage:", storedUserId);
  setUserId(storedUserId);
};

  const totalItems = state.cartItems.reduce((total, item) => total + item.quantity, 0);

  const subtotal = state.cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshUserId,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};