import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import highlightImage from './Dilnasheen-naaz-5.jpg';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-subtle-50 via-subtle-100 to-sage-50 py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-6 sm:mb-8 md:mb-0 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-playfair mb-3 sm:mb-4">
              Discover Your <span className="bg-gradient-to-r from-subtle-500 to-sage-500 bg-clip-text text-transparent">Perfect Nails</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-6 sm:mb-8 max-w-md mx-auto md:mx-0">
              Explore our premium collection of nail products across 4 categories in 2 exclusive collections. From gel nails to nail art, find everything for beautiful nails.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-subtle-400 to-sage-400 hover:from-subtle-500 hover:to-sage-500 text-white transition-colors w-full sm:w-auto"
                onClick={() => navigate('/nails')}
              >
                <span className="flex items-center justify-center">
                  Shop Nails
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-subtle-400 text-subtle-600 hover:bg-gradient-to-r hover:from-subtle-400 hover:to-sage-400 hover:text-white hover:border-transparent w-full sm:w-auto"
                onClick={() => navigate('/collections/collection1')}
              >
                View Collections
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              {/* Circular Container */}
              <div className="bg-gradient-to-br from-subtle-100 via-sage-100 to-subtle-200 rounded-full w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 flex items-center justify-center shadow-lg overflow-hidden">
                <img
                  src={highlightImage}
                  alt="Nail Products"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-0 -right-2 sm:-right-4 bg-gradient-to-r from-subtle-500 to-sage-500 text-white rounded-full shadow-lg p-2 sm:p-3 animate-bounce">
                <span className="font-medium text-xs sm:text-sm">New!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;