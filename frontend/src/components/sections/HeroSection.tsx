import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import highlightImage from './highlight_section.jpg';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold font-playfair mb-4">
              Discover Your <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Perfect Nails</span>
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-md">
              Explore our premium collection of nail products across 4 categories in 2 exclusive collections. From gel nails to nail art, find everything for beautiful nails.
            </p>
            <div className="flex space-x-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white transition-colors"
                onClick={() => navigate('/nails')}
              >
                <span className="flex items-center">
                  Shop Nails
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-pink-500 text-pink-500 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white hover:border-transparent"
                onClick={() => navigate('/collections/collection1')}
              >
                View Collections
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              {/* Circular Container */}
              <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-rose-100 rounded-full w-64 h-64 md:w-80 md:h-80 flex items-center justify-center shadow-lg overflow-hidden">
                <img
                  src={highlightImage}
                  alt="Nail Products"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-0 -right-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg p-3 animate-bounce">
                <span className="font-medium">New!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;