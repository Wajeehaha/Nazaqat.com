import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageLayout from '@/components/layout/PageLayout';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertCircle, CreditCard, Truck, Tag, Check, X, Shield, Lock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import axios from 'axios';

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

interface CouponValidation {
  isValid: boolean;
  discountAmount: number;
  message: string;
  coupon?: any;
}

const CheckoutPage = () => {
  const { cartItems, subtotal, clearCart, refreshUserId } = useCart();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [couponCode, setCouponCode] = useState('');
  const [couponValidation, setCouponValidation] = useState<CouponValidation | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const userId = localStorage.getItem('userId');
  const shippingCost = subtotal >= 2000 ? 0 : 200;
  const orderSubtotal = subtotal + shippingCost;
  const discount = couponValidation?.isValid ? couponValidation.discountAmount : 0;
  const total = orderSubtotal - discount;

  // Redirect if not logged in
  useEffect(() => {
    if (!userId) {
      toast.error('Please login to continue with checkout');
      navigate('/auth');
    }
  }, [userId, navigate]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponValidation(null);
      return;
    }

    setIsValidatingCoupon(true);
    try {
      const response = await axios.post('http://localhost:3000/api/coupons/validate', {
        code: couponCode.trim(),
        orderAmount: orderSubtotal
      });

      if (response.data.success) {
        setCouponValidation({
          isValid: true,
          discountAmount: response.data.orderSummary.discount,
          message: response.data.message,
          coupon: response.data.coupon
        });
        toast.success(`Coupon Applied! 🎉 You saved PKR ${response.data.orderSummary.discount}`);
      }
    } catch (error: any) {
      setCouponValidation({
        isValid: false,
        discountAmount: 0,
        message: error.response?.data?.message || 'Invalid coupon code'
      });
      toast.error(error.response?.data?.message || 'Coupon code is not valid');
    }
    setIsValidatingCoupon(false);
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponValidation(null);
    toast.info('Coupon removed');
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address'];
    for (const field of required) {
      if (!customerInfo[field].trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Refresh userId to ensure we have the latest value
    refreshUserId();
    
    setIsLoading(true);

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('Please log in to place an order');
        navigate('/auth');
        return;
      }

      console.log('Placing order for userId:', userId);
      
      const orderData = {
        userId,
        customerInfo,
        paymentMethod,
        couponCode: couponValidation?.isValid ? couponCode : undefined
      };

      const response = await axios.post('http://localhost:3000/api/payment/create', orderData);

      if (response.data.success) {
        if (paymentMethod === 'cod') {
          // COD order placed successfully
          console.log('COD order successful, clearing cart...');
          await clearCart();
          console.log('Cart cleared, showing success message...');
          toast.success('Order Placed! 📦 Your order has been confirmed. We\'ll deliver it soon!');
          navigate('/orders');
        } else {
          // Redirect to PayFast for online payment
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = response.data.paymentUrl;

          Object.keys(response.data.paymentData).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = response.data.paymentData[key];
            form.appendChild(input);
          });

          document.body.appendChild(form);
          form.submit();
        }
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold font-playfair text-gray-900 mb-2">
                Checkout
              </h1>
              <p className="text-gray-600">Complete your order details</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="h-12 w-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">PKR {(Number(item.price) * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}

                    <Separator />

                    {/* Coupon Section */}
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="flex-1"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={validateCoupon}
                          disabled={isValidatingCoupon || !couponCode.trim()}
                        >
                          {isValidatingCoupon ? 'Validating...' : 'Apply'}
                        </Button>
                      </div>

                      {couponValidation && (
                        <div className={`p-3 rounded-lg border ${
                          couponValidation.isValid 
                            ? 'bg-green-50 border-green-200 text-green-800' 
                            : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {couponValidation.isValid ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                              <span className="text-sm font-medium">{couponValidation.message}</span>
                            </div>
                            {couponValidation.isValid && (
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm"
                                onClick={removeCoupon}
                                className="h-6 p-1"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Price Breakdown */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>PKR {subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>{shippingCost === 0 ? 'Free' : `PKR ${shippingCost.toFixed(2)}`}</span>
                      </div>
                      {subtotal >= 2000 && (
                        <p className="text-green-600 text-sm">🎉 Free shipping on orders over PKR 2,000!</p>
                      )}
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span>-PKR {discount.toFixed(2)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between text-xl font-bold">
                        <span>Total:</span>
                        <span>PKR {total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Available Coupons Info */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800 font-medium">💡 Available Coupons:</p>
                      <ul className="text-xs text-blue-700 mt-1 space-y-1">
                        <li>• WELCOME10 - 10% off on orders above PKR 500</li>
                        <li>• SAVE50 - PKR 50 off on orders above PKR 1000</li>
                        <li>• NAIL20 - 20% off on nail products</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Checkout Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Customer Information */}
                  <Card className="shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                      <CardTitle>Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            value={customerInfo.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={customerInfo.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={customerInfo.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            value={customerInfo.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            required
                            className="mt-1"
                            placeholder="+92 XXX XXXXXXX"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="address">Complete Address *</Label>
                          <Input
                            id="address"
                            value={customerInfo.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            required
                            className="mt-1"
                            placeholder="House/Flat No, Street, Area"
                          />
                        </div>
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={customerInfo.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className="mt-1"
                            placeholder="e.g., Karachi, Lahore"
                          />
                        </div>
                        <div>
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input
                            id="postalCode"
                            value={customerInfo.postalCode}
                            onChange={(e) => handleInputChange('postalCode', e.target.value)}
                            className="mt-1"
                            placeholder="e.g., 75500"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Method */}
                  <Card className="shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <CardTitle>Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <RadioGroup 
                        value={paymentMethod} 
                        onValueChange={(value: 'online' | 'cod') => setPaymentMethod(value)}
                        className="space-y-4"
                      >
                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="online" id="online" />
                          <div className="flex items-center space-x-3 flex-1">
                            <CreditCard className="h-8 w-8 text-blue-600" />
                            <div>
                              <Label htmlFor="online" className="font-medium cursor-pointer">
                                Online Payment
                              </Label>
                              <p className="text-sm text-gray-600">
                                Pay securely using PayFast (Credit/Debit Card, Bank Transfer)
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="secondary">Secure</Badge>
                                <Badge variant="secondary">Instant</Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="cod" id="cod" />
                          <div className="flex items-center space-x-3 flex-1">
                            <Truck className="h-8 w-8 text-green-600" />
                            <div>
                              <Label htmlFor="cod" className="font-medium cursor-pointer">
                                Cash on Delivery (COD)
                              </Label>
                              <p className="text-sm text-gray-600">
                                Pay when you receive your order at your doorstep
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="secondary">No Advance Payment</Badge>
                                <Badge variant="secondary">Convenient</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </RadioGroup>

                      {paymentMethod === 'cod' && (
                        <Alert className="mt-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Please keep the exact amount ready. Our delivery partner will collect the payment at your doorstep.
                          </AlertDescription>
                        </Alert>
                      )}

                      {paymentMethod === 'online' && (
                        <div className="bg-green-50 p-4 rounded-lg mt-4">
                          <div className="flex items-start space-x-2">
                            <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                              <p className="text-green-800 font-medium text-sm">Secure Payment</p>
                              <p className="text-green-600 text-xs">
                                Your payment is processed securely through PayFast with SSL encryption
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Submit Button */}
                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isLoading}
                      className="w-full md:w-auto px-12 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Processing...</span>
                        </div>
                      ) : paymentMethod === 'cod' ? (
                        'Place Order (COD)'
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Lock className="h-4 w-4" />
                          <span>Pay PKR {total.toFixed(2)} Online</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CheckoutPage;
