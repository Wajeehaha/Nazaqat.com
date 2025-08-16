import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import ProductGrid from '@/components/products/ProductGrid';
import { fetchNailsByCollection } from '@/assets/data';
import { Loader2 } from 'lucide-react';

const CollectionsPage: React.FC = () => {
  const { collection } = useParams<{ collection: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      if (!collection) return;
      
      setLoading(true);
      try {
        const data = await fetchNailsByCollection(collection.toUpperCase());
        setProducts(data);
      } catch (error) {
        console.error('Error loading collection products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [collection]);

  // Handle product click to navigate to ProductDetailPage
  const handleProductClick = (product) => {
    navigate(`/product/nails/${product._id}`, { state: { product } });
  };

  const getCollectionTitle = () => {
    switch (collection?.toUpperCase()) {
      case 'COLLECTION1':
        return 'Collection 1 - Premium Series';
      case 'COLLECTION2':
        return 'Collection 2 - Artistic Series';
      default:
        return 'Nail Collection';
    }
  };

  const getCollectionDescription = () => {
    switch (collection?.toUpperCase()) {
      case 'COLLECTION1':
        return 'Our premium collection featuring high-end nail products for professional results';
      case 'COLLECTION2':
        return 'Artistic collection with creative nail products for unique and stylish looks';
      default:
        return 'Explore our curated nail product collection';
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading collection...</span>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-playfair mb-4">{getCollectionTitle()}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {getCollectionDescription()}
          </p>
        </div>
        
        {products.length > 0 ? (
          <ProductGrid 
            products={products} 
            category="nails" 
            onProductClick={handleProductClick}
          />
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products found in this collection.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default CollectionsPage;
