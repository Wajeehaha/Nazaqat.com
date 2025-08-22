import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import HeroSection from '@/components/sections/HeroSection';
import FeaturedCategory from '@/components/sections/FeaturedCategory';
import { fetchTrendingProducts } from '@/assets/data.js'; // Import the API function
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ProductGrid from '@/components/products/ProductGrid';

const Dashboard = () => {
  const [activeCategory, setActiveCategory] = useState('COLLECTION1');
  const [trendingProducts, setTrendingProducts] = useState({
    COLLECTION1: [],
    COLLECTION2: [],
  });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const location = useLocation(); // For extracting the search query
  const navigate = useNavigate(); // For navigation

  // Fetch trending products when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTrendingProducts();
      // Expecting data to have COLLECTION1 and COLLECTION2 for nails
      if (data) {
        setTrendingProducts(data);
      }
    };
    fetchData();
  }, []);

  // Extract the search query from the URL and filter products
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('search');

    if (searchQuery) {
      const allProducts = [
        ...trendingProducts.COLLECTION1,
        ...trendingProducts.COLLECTION2,
      ];

      const filtered = allProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [location.search, trendingProducts]);

  // Handle product click to navigate to ProductDetailPage
  const handleProductClick = (product, category) => {
    navigate(`/product/${category}/${product._id}`, { state: { product } });
  };

  return (
    <PageLayout>
      <HeroSection />

      {/* Search Results Section */}
      {filteredProducts.length > 0 ? (
        <section className="py-8 sm:py-12 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold font-playfair text-center mb-6 sm:mb-8">
              Search Results
            </h2>
            <ProductGrid
              products={filteredProducts}
              category="nails"
              onProductClick={(product) => handleProductClick(product, 'nails')}
            />
          </div>
        </section>
      ) : (
        <>
          {/* Featured Products Section */}
          <section className="py-12 sm:py-16 bg-gradient-to-br from-subtle-50 via-subtle-100 to-sage-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-playfair text-gray-900 mb-4">
                  Premium Nail Collection
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                  Discover our curated selection of high-quality nail products, from glamorous gels to professional acrylics
                </p>
              </div>
              
              {/* Combined Products Grid */}
              <div className="mb-8 sm:mb-12">
                <ProductGrid
                  products={[...trendingProducts.COLLECTION1, ...trendingProducts.COLLECTION2]}
                  category="nails"
                  onProductClick={(product) => handleProductClick(product, 'nails')}
                />
              </div>
              
              {/* Collection Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-12 sm:mt-16 px-4">
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow group">
                  <div className="text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-subtle-400 to-sage-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-xl sm:text-2xl font-bold text-white">1</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-playfair mb-3">Dilnasheen</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Elegant gel nails and artistic designs for every occasion</p>
                    <Button 
                      className="bg-gradient-to-r from-subtle-400 to-sage-400 hover:from-subtle-500 hover:to-sage-500 text-white w-full sm:w-auto"
                      onClick={() => navigate('/collections/collection1')}
                    >
                      Explore Collection
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow group">
                  <div className="text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-sage-400 to-subtle-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-xl sm:text-2xl font-bold text-white">2</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-playfair mb-3">Narmeen</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Professional acrylics and premium nail care essentials</p>
                    <Button 
                      className="bg-gradient-to-r from-sage-400 to-subtle-400 hover:from-sage-500 hover:to-subtle-500 text-white w-full sm:w-auto"
                      onClick={() => navigate('/collections/collection2')}
                    >
                      Explore Collection
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-12 sm:py-16 bg-white">
            <div className="container mx-auto px-4">
              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-subtle-500 to-sage-500 bg-clip-text text-transparent mb-2">1K+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-subtle-500 to-sage-500 bg-clip-text text-transparent mb-2">4.5</div>
                  <div className="text-xs sm:text-sm text-gray-600">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-subtle-500 to-sage-500 bg-clip-text text-transparent mb-2">2</div>
                  <div className="text-xs sm:text-sm text-gray-600">Premium Collections</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-subtle-500 to-sage-500 bg-clip-text text-transparent mb-2">24/7</div>
                  <div className="text-xs sm:text-sm text-gray-600">Customer Support</div>
                </div>
              </div>
              
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold font-playfair text-gray-900 mb-4">
                  Why Choose Our Nail Products?
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 px-4">
                <div className="text-center group">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-subtle-200 to-sage-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-2xl sm:text-3xl">💎</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Premium Quality</h3>
                  <p className="text-sm sm:text-base text-gray-600">Professional-grade formulas that deliver salon-quality results at home</p>
                </div>
                
                <div className="text-center group">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-subtle-200 to-sage-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-2xl sm:text-3xl">⏰</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Long-Lasting</h3>
                  <p className="text-sm sm:text-base text-gray-600">Chip-resistant technology ensures your manicure stays perfect for weeks</p>
                </div>
                
                <div className="text-center group">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-subtle-200 to-sage-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-2xl sm:text-3xl">🎨</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Endless Creativity</h3>
                  <p className="text-sm sm:text-base text-gray-600">From classic elegance to bold artistic designs, express your unique style</p>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-12 sm:py-16 bg-gradient-to-br from-subtle-50 via-subtle-100 to-sage-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold font-playfair text-gray-900 mb-4">
                  What Our Customers Say
                </h2>
                <p className="text-sm sm:text-base text-gray-600">Join thousands of satisfied customers who love our nail products</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4">
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="flex text-subtle-400 text-sm sm:text-base">
                      {'★'.repeat(5)}
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 italic">
                    "The quality is amazing! My nails lasted for 3 weeks without chipping. Definitely ordering again!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-subtle-300 to-sage-300 rounded-full flex items-center justify-center text-white font-bold mr-3 text-sm sm:text-base">
                      S
                    </div>
                    <div>
                      <p className="font-semibold text-sm sm:text-base">Wajeeha Zulfiqar</p>
                      <p className="text-xs sm:text-sm text-gray-500">Verified Customer</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="flex text-subtle-400 text-sm sm:text-base">
                      {'★'.repeat(5)}
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 italic">
                    "Professional salon quality at home! The application is smooth and the colors are gorgeous."
                  </p>
                  <div className="flex items-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-sage-300 to-subtle-300 rounded-full flex items-center justify-center text-white font-bold mr-3 text-sm sm:text-base">
                      M
                    </div>
                    <div>
                      <p className="font-semibold text-sm sm:text-base">Abeer Fatima</p>
                      <p className="text-xs sm:text-sm text-gray-500">Verified Customer</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="flex text-subtle-400 text-sm sm:text-base">
                      {'★'.repeat(5)}
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 italic">
                    "Fast shipping and excellent customer service. The nail care kit transformed my nails completely!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-subtle-300 to-sage-400 rounded-full flex items-center justify-center text-white font-bold mr-3 text-sm sm:text-base">
                      A
                    </div>
                    <div>
                      <p className="font-semibold text-sm sm:text-base">Saphia Yaseen</p>
                      <p className="text-xs sm:text-sm text-gray-500">Verified Customer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </PageLayout>
  );
};

export default Dashboard;