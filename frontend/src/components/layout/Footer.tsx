
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Music } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-subtle-900 text-white pt-8 sm:pt-12 pb-6 sm:pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="text-lg sm:text-xl font-playfair font-semibold mb-3 sm:mb-4 bg-gradient-to-r from-subtle-300 to-sage-300 bg-clip-text text-transparent">Nazakat</h3>
            <p className="text-sm sm:text-base text-gray-300 mb-4">
              Premium nail products and collections crafted to enhance your beauty and personal style with elegance and sophistication.
            </p>
          </div>
          
          <div>
            <h4 className="text-base sm:text-lg font-playfair font-semibold mb-3 sm:mb-4 text-subtle-200">Quick Links</h4>
            <ul className="space-y-1 sm:space-y-2">
              <li><Link to="/" className="text-sm sm:text-base text-gray-300 hover:text-subtle-200 transition-colors">Home</Link></li>
              <li><Link to="/nails" className="text-sm sm:text-base text-gray-300 hover:text-subtle-200 transition-colors">All Nails</Link></li>
              <li><Link to="/collections/collection1" className="text-sm sm:text-base text-gray-300 hover:text-subtle-200 transition-colors">Dilnasheen</Link></li>
              <li><Link to="/collections/collection2" className="text-sm sm:text-base text-gray-300 hover:text-subtle-200 transition-colors">Narmeen</Link></li>
              <li><Link to="/about" className="text-sm sm:text-base text-gray-300 hover:text-subtle-200 transition-colors">About Us</Link></li>
              <li><Link to="/policy" className="text-sm sm:text-base text-gray-300 hover:text-subtle-200 transition-colors">Policies</Link></li>
              {/* <li><Link to="/perfumes" className="text-gray-400 hover:text-white transition-colors">Perfumes</Link></li>
              <li><Link to="/deodorants" className="text-gray-400 hover:text-white transition-colors">Deodorants</Link></li>
              <li><Link to="/lotions" className="text-gray-400 hover:text-white transition-colors">Lotions</Link></li> */}
            </ul>
          </div>
          
          <div>
            <h4 className="text-base sm:text-lg font-playfair font-semibold mb-3 sm:mb-4 text-subtle-200">Contact Us</h4>
            <address className="not-italic text-gray-300 text-sm sm:text-base space-y-1">
              <p>Email: shopnazaqat.co@gmail.com</p>
              <p>Phone: +92 302 1007534</p>
              {/* <p>Address: Lahore Riwind Road Lahore</p> */}
            </address>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-playfair font-semibold mb-3 sm:mb-4 text-subtle-200">Follow Us</h4>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <a 
                href="https://www.instagram.com/shopnazaqat.co/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-subtle-300 transition-colors group"
                aria-label="Follow us on Instagram"
              >
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gradient-to-r hover:from-subtle-800 hover:to-sage-800 transition-all">
                  <Instagram size={20} className="sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-sm sm:text-base">Instagram</span>
                </div>
              </a>
              
              <a 
                href="https://tiktok.com/@nazakat" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-sage-300 transition-colors group"
                aria-label="Follow us on TikTok"
              >
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gradient-to-r hover:from-sage-800 hover:to-subtle-800 transition-all">
                  <Music size={20} className="sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-sm sm:text-base">TikTok</span>
                </div>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gradient-to-r from-subtle-700 to-sage-700 mt-6 sm:mt-8 pt-4 sm:pt-6 text-center text-gray-300 text-xs sm:text-sm">
          <p>&copy; {new Date().getFullYear()} Nazakat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
