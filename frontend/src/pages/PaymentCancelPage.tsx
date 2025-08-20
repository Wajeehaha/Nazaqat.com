import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react';

const PaymentCancelPage = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card className="shadow-xl border-0 overflow-hidden">
              <CardContent className="p-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                  className="mb-6"
                >
                  <XCircle className="h-20 w-20 text-orange-500 mx-auto" />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-3xl md:text-4xl font-bold font-playfair text-gray-900 mb-4"
                >
                  Payment Cancelled
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="text-gray-600 mb-6 text-lg"
                >
                  Your payment was cancelled. Don't worry, no charges were made to your account.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  className="bg-orange-50 p-6 rounded-lg mb-6"
                >
                  <h3 className="font-semibold text-orange-800 mb-2">What happened?</h3>
                  <p className="text-orange-700 text-sm">
                    The payment process was interrupted or cancelled. This could happen if:
                  </p>
                  <ul className="text-orange-700 text-sm mt-2 space-y-1 text-left">
                    <li>• You clicked the back button during payment</li>
                    <li>• The payment window was closed</li>
                    <li>• You chose to cancel the transaction</li>
                    <li>• There was a network connectivity issue</li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                  className="space-y-4"
                >
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Want to try again?</h4>
                    <p className="text-blue-700 text-sm">
                      Your items are still in your cart. You can review your order and attempt payment again.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => navigate('/cart')}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Cart
                    </Button>
                    <Button
                      onClick={() => navigate('/')}
                      variant="outline"
                      className="border-pink-300 text-pink-600 hover:bg-pink-50"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Continue Shopping
                    </Button>
                  </div>
                </motion.div>
              </CardContent>
            </Card>

            {/* Support Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              className="mt-8 text-center"
            >
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-2">Need Help?</h4>
                <p className="text-gray-600 text-sm mb-2">
                  If you're experiencing issues with payment, our support team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
                  <a 
                    href="mailto:shopnazaqat.co@gmail.com" 
                    className="text-pink-600 hover:underline"
                  >
                    📧 shopnazaqat.co@gmail.com
                  </a>
                  <span className="hidden sm:inline text-gray-400">|</span>
                  <a 
                    href="tel:+923332306480" 
                    className="text-pink-600 hover:underline"
                  >
                    📞 +92 333 2306480
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PaymentCancelPage;
