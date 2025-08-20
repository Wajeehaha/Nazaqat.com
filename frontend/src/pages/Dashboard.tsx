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
        <section className="py-12 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-playfair text-center mb-8">
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
          <section className="py-16 bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold font-playfair text-gray-900 mb-4">
                  Premium Nail Collection
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Discover our curated selection of high-quality nail products, from glamorous gels to professional acrylics
                </p>
              </div>
              
              {/* Combined Products Grid */}
              <div className="mb-12">
                <ProductGrid
                  products={[...trendingProducts.COLLECTION1, ...trendingProducts.COLLECTION2]}
                  category="nails"
                  onProductClick={(product) => handleProductClick(product, 'nails')}
                />
              </div>
              
              {/* Collection Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow group">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-2xl font-bold text-white">1</span>
                    </div>
                    <h3 className="text-2xl font-bold font-playfair mb-3">Dilnasheen</h3>
                    <p className="text-gray-600 mb-6">Elegant gel nails and artistic designs for every occasion</p>
                    <Button 
                      className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
                      onClick={() => navigate('/collections/collection1')}
                    >
                      Explore Collection
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow group">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-2xl font-bold text-white">2</span>
                    </div>
                    <h3 className="text-2xl font-bold font-playfair mb-3">Narmeen</h3>
                    <p className="text-gray-600 mb-6">Professional acrylics and premium nail care essentials</p>
                    <Button 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
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
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">1K+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">4.9</div>
                  <div className="text-gray-600">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">2</div>
                  <div className="text-gray-600">Premium Collections</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">24/7</div>
                  <div className="text-gray-600">Customer Support</div>
                </div>
              </div>
              
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold font-playfair text-gray-900 mb-4">
                  Why Choose Our Nail Products?
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">💎</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Premium Quality</h3>
                  <p className="text-gray-600">Professional-grade formulas that deliver salon-quality results at home</p>
                </div>
                
                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">⏰</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Long-Lasting</h3>
                  <p className="text-gray-600">Chip-resistant technology ensures your manicure stays perfect for weeks</p>
                </div>
                
                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">🎨</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Endless Creativity</h3>
                  <p className="text-gray-600">From classic elegance to bold artistic designs, express your unique style</p>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-16 bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold font-playfair text-gray-900 mb-4">
                  What Our Customers Say
                </h2>
                <p className="text-gray-600">Join thousands of satisfied customers who love our nail products</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="flex text-pink-400">
                      {'★'.repeat(5)}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "The quality is amazing! My gel manicure lasted for 3 weeks without chipping. Definitely ordering again!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      S
                    </div>
                    <div>
                      <p className="font-semibold">Sarah Johnson</p>
                      <p className="text-sm text-gray-500">Verified Customer</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="flex text-pink-400">
                      {'★'.repeat(5)}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "Professional salon quality at home! The application is smooth and the colors are gorgeous."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      M
                    </div>
                    <div>
                      <p className="font-semibold">Maria Garcia</p>
                      <p className="text-sm text-gray-500">Verified Customer</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="flex text-pink-400">
                      {'★'.repeat(5)}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "Fast shipping and excellent customer service. The nail care kit transformed my nails completely!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      A
                    </div>
                    <div>
                      <p className="font-semibold">Anna Smith</p>
                      <p className="text-sm text-gray-500">Verified Customer</p>
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