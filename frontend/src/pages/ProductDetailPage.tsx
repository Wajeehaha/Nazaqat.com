import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import Rating from "@/components/ui/rating";
import { ShoppingCart, ArrowLeft, Heart, Share2, Minus, Plus, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchTrendingProducts, fetchNailById } from "@/assets/data";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReviewSummary from "@/components/reviews/ReviewSummary";
import ReviewList from "@/components/reviews/ReviewList";
import ReviewForm from "@/components/reviews/ReviewForm";
import { useCart } from "@/contexts/CartContext";

const ProductDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { category, id } = useParams();
  const { addToCart } = useCart(); // Use cart context
  const [product, setProduct] = useState(() => {
    const initial = location.state?.product || null;
    if (initial && !initial.images) {
      return { ...initial, images: initial.image ? [initial.image] : [] };
    }
    return initial;
  });
  // Ensure product always has an images array after fetch
  useEffect(() => {
    if (product && !product.images) {
      setProduct({ ...product, images: product.image ? [product.image] : [] });
    }
  }, [product]);
  const [quantity, setQuantity] = useState(1);
  const [selectedPieces, setSelectedPieces] = useState("pieces12"); // Default to 12 pieces
  const [activeImage, setActiveImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  
  // Get actual user data from localStorage
  const userId = localStorage.getItem("userId");
  const userToken = localStorage.getItem("token");
  const isLoggedIn = !!userId;
  
  // Mock user info for display - in real app, fetch from user profile API
  const currentUser = { id: userId, firstName: 'Customer', lastName: '' };
  const userOrders = [userId]; // Use userId as orderId for now - replace with actual orders

  // Helper function to get current price based on selected pieces
  const getCurrentPrice = () => {
    if (!product) return 0;
    
    // Check if product has dual pricing structure
    if (product.pricing && product.pricing[selectedPieces]) {
      return product.pricing[selectedPieces];
    }
    
    // Fallback logic for products without dual pricing
    if (selectedPieces === "pieces24") {
      return 1199; // Default 24 pieces price
    }
    
    // Default fallback to 12 pieces price or product.price
    return product.price || 799;
  };

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        setIsLoading(true);
        
        // Reset states when navigating to new product
        setActiveImage(0);
        setQuantity(1);
        setSelectedPieces("pieces12"); // Reset to default piece selection
        setProduct(null);
        setReviews([]);
        setReviewStats(null);

        // Always fetch the product by ID to ensure fresh data
        if (id) {
          const fetchedProduct = await fetchNailById(id);
          if (fetchedProduct) {
            setProduct(fetchedProduct);
          }
        }

        // Fetch trending products
        const trending = await fetchTrendingProducts();

        // Filter related products based on nails collections
        if (trending) {
          const allNails = [...(trending.COLLECTION1 || []), ...(trending.COLLECTION2 || [])];
          
          // Filter out the current product and shuffle
          const related = allNails
            .filter(item => item._id !== id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);

          setRelatedProducts(related);
        }

        // Fetch reviews for the new product
        await fetchReviews();
      } catch (error) {
        console.error("Error fetching related products:", error);
        toast.error("Failed to load related products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductAndRelated();
  }, [category, id]); // Removed 'product' from dependencies to prevent infinite loop

  const handleQuantityChange = (type) => {
    if (type === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    } else if (type === "increase") {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      console.log("Adding to cart with quantity:", quantity, "pieces:", selectedPieces);
      
      // Create product object for cart context
      const productForCart = {
        id: product._id,
        name: `${product.name} (${selectedPieces === 'pieces12' ? '12 Pieces' : '24 Pieces'})`,
        image: product.image,
        price: getCurrentPrice().toString(),
        rating: product.rating,
        description: product.description,
        pieces: selectedPieces, // Add piece information
      };

      // Use cart context to add to cart with quantity
      await addToCart(productForCart, quantity);

      console.log("Product added to cart successfully");
      // Reset quantity to 1 after adding to cart
      setQuantity(1);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      // Error toast will be shown by cart context
    } finally {
      setIsLoading(false);
    }
  };

  // Share functionality
  const handleShare = async () => {
    if (!product) return;

    const productUrl = `${window.location.origin}/product/nails/${product._id}`;
    const shareData = {
      title: `${product.name} - Nazaqat.com`,
      text: `Check out this amazing nail product: ${product.name} - Rs. ${product.price}`,
      url: productUrl,
    };

    try {
      // Check if Web Share API is supported (mobile devices)
      if (navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        await navigator.share(shareData);
        toast.success("Product shared successfully!");
      } else {
        // Fallback: Copy link to clipboard
        await navigator.clipboard.writeText(productUrl);
        toast.success("Product link copied to clipboard!");
      }
    } catch (error) {
      // If both methods fail, show the link in a modal or alert
      if (error.name !== 'AbortError') {
        // Create a temporary input element to copy the link
        const tempInput = document.createElement('input');
        tempInput.value = productUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        
        toast.success("Product link copied to clipboard!");
      }
    }
  };

  // Review functions
  const fetchReviews = async () => {
    if (!id) return;
    
    try {
      setReviewsLoading(true);
      const response = await fetch(`/api/reviews/product/${id}`);
      
      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('Reviews API returned non-JSON response, using fallback data');
        // Set fallback empty review data
        setReviews([]);
        setReviewStats({
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        });
        return;
      }
      
      const data = await response.json();
      
      if (response.ok) {
        setReviews(data.reviews || []);
        setReviewStats(data.stats || {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        });
      } else {
        // API returned error, use fallback
        setReviews([]);
        setReviewStats({
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Set fallback data on error
      setReviews([]);
      setReviewStats({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleHelpfulClick = async (reviewId: string) => {
    if (!isLoggedIn) {
      toast.error('Please login to vote on reviews');
      navigate('/auth');
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ userId: currentUser.id }),
      });

      if (response.ok) {
        // Refresh reviews to get updated helpful count
        fetchReviews();
      }
    } catch (error) {
      console.error('Error updating helpful status:', error);
    }
  };

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    fetchReviews();
    toast.success('Review submitted successfully!');
  };

  // Fetch reviews when product loads
  useEffect(() => {
    if (product) {
      fetchReviews();
    }
  }, [product]);

  if (!product && !isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
          <Button onClick={() => navigate("/")}>Return to Home</Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        <Button
          variant="ghost"
          className="mb-4 sm:mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {category || "products"}
        </Button>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          product && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
                {/* Product Images */}
                <div className="space-y-4">
                  {/* Main Image Display */}
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 relative">
                    <img
                      src={(product.images && product.images[activeImage]) || product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-contain p-4 transition-all duration-300 hover:scale-105"
                    />
                    
                    {/* Image Navigation Arrows */}
                    {product.images && product.images.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white h-8 w-8 sm:h-10 sm:w-10"
                          onClick={() => setActiveImage(activeImage === 0 ? product.images.length - 1 : activeImage - 1)}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white h-8 w-8 sm:h-10 sm:w-10"
                          onClick={() => setActiveImage(activeImage === product.images.length - 1 ? 0 : activeImage + 1)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    
                    {/* Image Indicators */}
                    {product.images && product.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {product.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveImage(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              activeImage === index ? 'bg-primary' : 'bg-white/60 hover:bg-white/80'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Image Thumbnails */}
                  {product.images && product.images.length > 1 && (
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImage(index)}
                          className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            activeImage === index ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${product.name} view ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Badge
                        variant="outline"
                        className="text-xs font-medium px-2.5 py-0.5 bg-primary/10 text-primary border-primary/20"
                      >
                        {category?.toUpperCase() || "FEATURED"}
                      </Badge>
                      {/* Hide these buttons on mobile, show them below Add to Cart instead */}
                      <div className="hidden sm:flex gap-2">
                        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 sm:h-10 sm:w-10">
                          <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span className="sr-only">Add to wishlist</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
                          onClick={handleShare}
                        >
                          <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span className="sr-only">Share product</span>
                        </Button>
                      </div>
                    </div>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-playfair mt-2 mb-3 text-gray-900 leading-tight">
                      {product.name}
                    </h1>

                    <div className="flex items-center gap-4 mb-4">
                      <Rating value={product.rating} className="text-amber-400" />
                      <span className="text-sm text-gray-500">
                        ({reviewStats?.totalReviews || 0} {reviewStats?.totalReviews === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-4 sm:mb-6">
                      <span className="text-3xl sm:text-4xl font-bold text-primary">Rs. {getCurrentPrice()}</span>
                      <span className="text-sm text-gray-500 line-through opacity-0">Rs. {(Number(getCurrentPrice()) * 1.2).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="prose prose-gray max-w-none">
                    <p className="text-sm sm:text-base text-gray-700">{product.description}</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>In stock and ready to ship</span>
                  </div>

                  <Separator />

                  {/* Piece Selection */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label htmlFor="pieces" className="block text-sm font-medium text-gray-700 mb-3">
                      Select Pieces
                    </label>
                    <Select value={selectedPieces} onValueChange={setSelectedPieces}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select number of pieces" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pieces12">12 Pieces - Rs. {product?.pricing?.pieces12 || 799}</SelectItem>
                        <SelectItem value="pieces24">24 Pieces - Rs. {product?.pricing?.pieces24 || 1199}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quantity Selector */}
                  <div className="bg-gray-50 p-4 rounded-lg mobile-quantity-selector">
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-3">
                      Quantity
                    </label>
                    <div className="flex items-center justify-center w-full sm:w-fit border-2 border-gray-300 rounded-lg bg-white shadow-sm">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuantityChange("decrease")}
                        disabled={quantity <= 1}
                        className="h-12 w-12 sm:h-10 sm:w-10 rounded-l-lg border-r hover:bg-gray-100 disabled:opacity-50 cart-button"
                      >
                        <Minus className="h-5 w-5 sm:h-4 sm:w-4" />
                      </Button>
                      <div className="flex-1 sm:w-16 text-center text-lg sm:text-base font-semibold py-3 px-4 bg-white">
                        {quantity}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuantityChange("increase")}
                        className="h-12 w-12 sm:h-10 sm:w-10 rounded-r-lg border-l hover:bg-gray-100 cart-button"
                      >
                        <Plus className="h-5 w-5 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="pt-4">
                    <Button 
                      size="lg" 
                      className="w-full h-14 sm:h-12 text-lg sm:text-base font-semibold bg-gradient-to-r from-subtle-400 to-sage-400 hover:from-subtle-500 hover:to-sage-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] mobile-add-to-cart cart-button" 
                      onClick={handleAddToCart} 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Adding to Cart...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <ShoppingCart className="h-5 w-5 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">Add to Cart • Rs. {(Number(getCurrentPrice()) * quantity).toFixed(2)}</span>
                          <span className="sm:hidden">Add Rs. {(Number(getCurrentPrice()) * quantity).toFixed(2)} to Cart</span>
                        </div>
                      )}
                    </Button>
                    
                    {/* Additional Action Buttons for Mobile */}
                    <div className="grid grid-cols-2 gap-3 mt-3 sm:hidden">
                      <Button 
                        variant="outline" 
                        className="h-12 border-2 border-subtle-400 text-subtle-500 hover:bg-subtle-50 font-medium cart-button"
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Wishlist
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-12 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium cart-button"
                        onClick={handleShare}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                    
                    {/* Mobile Trust Indicators */}
                    <div className="mt-4 sm:hidden">
                      <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
                        <div className="flex items-center">
                          <Check className="h-3 w-3 text-green-500 mr-1" />
                          <span>Secure Payment</span>
                        </div>
                        <div className="flex items-center">
                          <Check className="h-3 w-3 text-green-500 mr-1" />
                          <span>Fast Delivery</span>
                        </div>
                        <div className="flex items-center">
                          <Check className="h-3 w-3 text-green-500 mr-1" />
                          <span>Easy Returns</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="mt-12 sm:mt-16">
                <Tabs defaultValue="reviews" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="reviews" className="text-xs sm:text-sm">Reviews ({reviewStats.totalReviews})</TabsTrigger>
                    <TabsTrigger value="write-review" className="text-xs sm:text-sm">Write Review</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="reviews" className="mt-6 space-y-6">
                    {reviewStats.totalReviews > 0 && (
                      <ReviewSummary stats={reviewStats} />
                    )}
                    
                    {reviewsLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : (
                      <ReviewList
                        reviews={reviews}
                        currentUserId={currentUser.id}
                        onHelpfulClick={handleHelpfulClick}
                      />
                    )}
                  </TabsContent>
                  
                  <TabsContent value="write-review" className="mt-6">
                    {!isLoggedIn ? (
                      <div className="bg-gray-50 rounded-lg p-8 text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Login Required
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Please login to write a review for this product.
                        </p>
                        <Button
                          onClick={() => navigate('/auth')}
                          className="bg-gradient-to-r from-subtle-400 to-sage-400 hover:from-subtle-500 hover:to-sage-500"
                        >
                          Login / Sign Up
                        </Button>
                      </div>
                    ) : userOrders.length > 0 ? (
                      <ReviewForm
                        productId={product._id}
                        userId={currentUser.id}
                        orderId={userOrders[0]} // Use first order as example
                        onReviewSubmitted={handleReviewSubmitted}
                        onCancel={() => setShowReviewForm(false)}
                      />
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-8 text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Purchase Required
                        </h3>
                        <p className="text-gray-600 mb-4">
                          You need to purchase this product before you can write a review.
                        </p>
                        <Button
                          onClick={handleAddToCart}
                          className="bg-gradient-to-r from-subtle-400 to-sage-400 hover:from-subtle-500 hover:to-sage-500"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>

             
{/* Related Products Section */}
<div className="mt-12 sm:mt-16">
  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 px-4 sm:px-0">You might also like</h2>
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 px-4 sm:px-0">
    {relatedProducts.map((relatedProduct) => (
      <div
        key={relatedProduct._id}
        className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
      >
        <div 
          onClick={() =>
            navigate(`/product/nails/${relatedProduct._id}`, {
              state: { product: relatedProduct },
            })
          }
          className="cursor-pointer"
        >
          <div className="w-full h-32 sm:h-40 md:h-48 flex items-center justify-center overflow-hidden">
            <img
              src={relatedProduct.image}
              alt={relatedProduct.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="p-3 sm:p-4">
            <h3 className="font-medium text-gray-900 truncate text-sm sm:text-base">{relatedProduct.name}</h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-2">Rs. {relatedProduct.price}</p>
          </div>
        </div>
        <div className="px-3 pb-3 sm:px-4 sm:pb-4">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              const productForCart = {
                id: relatedProduct._id,
                name: relatedProduct.name,
                image: relatedProduct.image,
                price: relatedProduct.price.toString(),
                rating: relatedProduct.rating,
                description: relatedProduct.description,
              };
              addToCart(productForCart, 1);
            }}
            className="w-full bg-gradient-to-r from-subtle-400 to-sage-400 hover:from-subtle-500 hover:to-sage-500 text-white text-xs sm:text-sm py-2"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    ))}
  </div>
</div>
            </>
          )
        )}
      </div>
    </PageLayout>
  );
};

export default ProductDetailPage;