import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import axios from 'axios';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get('m_payment_id');

  useEffect(() => {
    const checkOrderStatus = async () => {
      if (orderId) {
        try {
          const response = await axios.get(`http://localhost:3000/api/payment/status/${orderId}`);
          setOrderStatus(response.data);
          
          // Clear cart after successful payment verification
          if (response.data.status === 'Paid') {
            console.log('Payment confirmed, clearing cart...');
            await clearCart();
            console.log('Cart cleared successfully after payment');
          }
        } catch (error) {
          console.error('Error checking order status:', error);
        }
      }
      setLoading(false);
    };

    checkOrderStatus();
  }, [orderId, clearCart]);

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-16">
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
                  <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-3xl md:text-4xl font-bold font-playfair text-gray-900 mb-4"
                >
                  Payment Successful! 🎉
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="text-gray-600 mb-6 text-lg"
                >
                  Thank you for your purchase! Your order has been confirmed and will be processed shortly.
                </motion.p>

                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  </div>
                ) : orderStatus ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    className="bg-green-50 p-6 rounded-lg mb-6"
                  >
                    <h3 className="font-semibold text-green-800 mb-2">Order Details</h3>
                    <div className="text-left space-y-1">
                      <p><span className="font-medium">Order ID:</span> {orderStatus.orderId}</p>
                      <p><span className="font-medium">Status:</span> <span className="text-green-600">{orderStatus.status}</span></p>
                      <p><span className="font-medium">Total Amount:</span> PKR {orderStatus.totalAmount?.toFixed(2)}</p>
                      {orderStatus.paymentDetails && (
                        <p><span className="font-medium">Payment ID:</span> {orderStatus.paymentDetails.pfPaymentId}</p>
                      )}
                    </div>
                  </motion.div>
                ) : null}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                  className="space-y-4"
                >
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">What's Next?</h4>
                    <ul className="text-blue-700 text-sm space-y-1 text-left">
                      <li>• You'll receive an order confirmation email shortly</li>
                      <li>• Your order will be processed within 1-2 business days</li>
                      <li>• You'll get a tracking notification once shipped</li>
                      <li>• Delivery typically takes 3-7 business days</li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => navigate('/orders')}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      View Orders
                    </Button>
                    <Button
                      onClick={() => navigate('/')}
                      variant="outline"
                      className="border-pink-300 text-pink-600 hover:bg-pink-50"
                    >
                      Continue Shopping
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              className="mt-8 text-center"
            >
              <p className="text-gray-500 text-sm">
                Need help? Contact us at{' '}
                <a href="mailto:shopnazaqat.co@gmail.com" className="text-pink-600 hover:underline">
                  shopnazaqat.co@gmail.com
                </a>
                {' '}or{' '}
                <a href="tel:+923332306480" className="text-pink-600 hover:underline">
                  +92 333 2306480
                </a>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PaymentSuccessPage;
