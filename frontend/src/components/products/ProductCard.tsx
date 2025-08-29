import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Rating from '@/components/ui/rating';
import { ShoppingCart } from 'lucide-react';
import { Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useCart } from '@/contexts/CartContext'; // Import useCart hook
import {toast} from "sonner"; // Import toast for notifications
interface ProductCardProps {
  id: string; // Use id here (mapped from _id in ProductGrid)
  name: string;
  image: string;
  price: string | number;
  pricing?: {
    pieces12: number;
    pieces24: number;
  };
  rating?: number;
  category: string;
  description?: string;
  onClick?: () => void; // Optional onClick handler
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  image,
  price,
  pricing,
  rating,
  category,
  description,
  onClick, // Accept the onClick prop
}) => {
  const { addToCart } = useCart(); // Use the addToCart function from CartContext
  const [selectedPieces, setSelectedPieces] = useState("pieces12"); // Default to 12 pieces

  // Helper function to get current price based on selected pieces
  const getCurrentPrice = () => {
    if (pricing && pricing[selectedPieces]) {
      return pricing[selectedPieces];
    }
    
    // Fallback logic for products without dual pricing
    if (selectedPieces === "pieces24") {
      return 1199; // Default 24 pieces price
    }
    
    // Default to 12 pieces price or original price
    return Number(price) || 799;
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Stop event propagation to avoid triggering parent click handlers

    const userId = localStorage.getItem("userId"); // Replace with the actual user ID from your authentication context or state
    console.log('User ID:', userId); // Log the user ID for debugging
    
    if (!userId) {
      toast.error('Please login to add items to cart');
      return;
    }
    
    try {   
      // Call the addToCart function from CartContext
      await addToCart({
        id, // Use id here
        name: `${name} (${selectedPieces === 'pieces12' ? '12 Pieces' : '24 Pieces'})`,
        image,
        price: getCurrentPrice().toString(),
        rating: rating || 0,
        description: description || '',
        pieces: selectedPieces, // Add piece information
      });

      console.log('Product added to cart successfully');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      toast.error('Failed to add product to cart. Please try again.'); // Show error notification
    }
  };

  return (
    <Card
      className="product-card group h-full flex flex-col cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={onClick} // Call the onClick handler when the card is clicked
    >
      <div className="overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="product-image w-full h-36 sm:h-40 md:h-48 object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-3 sm:p-4 flex-grow">
        <CardTitle className="font-medium text-sm sm:text-base lg:text-lg mb-1 sm:mb-2 line-clamp-2">{name}</CardTitle>
        <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 line-clamp-2">{description}</p> {/* Display the description */}
        
        {/* Piece Selection for dual pricing */}
        {(pricing || true) && (
          <div className="mb-2">
            <Select value={selectedPieces} onValueChange={setSelectedPieces}>
              <SelectTrigger className="w-full h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pieces12">12 Pieces - Rs. {pricing?.pieces12 || 799}</SelectItem>
                <SelectItem value="pieces24">24 Pieces - Rs. {pricing?.pieces24 || 1199}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-1 sm:mb-2">
          <p className="font-semibold text-black text-sm sm:text-base">Rs. {getCurrentPrice()}</p>
          {rating && rating > 0 && <Rating value={rating} className="text-xs sm:text-sm" />}
        </div>
      </CardContent>
      <CardFooter className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0">
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-subtle-400 to-sage-400 hover:from-subtle-500 hover:to-sage-500 text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl cart-button h-10 sm:h-9 text-xs sm:text-sm font-semibold"
        >
          <ShoppingCart className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Add to Cart</span>
          <span className="xs:hidden">Add</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;