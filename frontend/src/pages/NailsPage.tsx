import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import ProductGrid from '@/components/products/ProductGrid';
import { fetchNailsByCategory, fetchNails } from '@/assets/data';
import { Loader2 } from 'lucide-react';

const NailsPage: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        let data;
        if (category) {
          data = await fetchNailsByCategory(category);
        } else {
          data = await fetchNails();
        }
        setProducts(data);
      } catch (error) {
        console.error('Error loading nail products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [category]);

  // Handle product click to navigate to ProductDetailPage
  const handleProductClick = (product, category) => {
    navigate(`/product/${category}/${product._id}`, { state: { product } });
  };

  const getPageTitle = () => {
    if (!category) return 'All Nail Products';
    
    switch (category) {
      case 'gel-nails':
        return 'Gel Nails';
      case 'acrylic-nails':
        return 'Acrylic Nails';
      case 'nail-art':
        return 'Nail Art';
      case 'nail-care':
        return 'Nail Care';
      default:
        return 'Nail Products';
    }
  };

  const getPageDescription = () => {
    if (!category) return 'Discover our complete collection of premium nail products';
    
    switch (category) {
      case 'gel-nails':
        return 'Professional gel nail products for long-lasting shine and durability';
      case 'acrylic-nails':
        return 'High-quality acrylic nail systems for strength and style';
      case 'nail-art':
        return 'Creative nail art supplies and decorative elements';
      case 'nail-care':
        return 'Essential nail care products for healthy, beautiful nails';
      default:
        return 'Premium nail products for every need';
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading nail products...</span>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-playfair mb-4">{getPageTitle()}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {getPageDescription()}
          </p>
        </div>
        
        {products.length > 0 ? (
          <ProductGrid 
            products={products} 
            category={category || 'nails'} 
            onProductClick={(product) => handleProductClick(product, category || 'nails')}
          />
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products found in this category.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default NailsPage;
