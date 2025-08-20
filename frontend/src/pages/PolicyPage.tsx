import React from 'react';
import { motion } from 'framer-motion';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, Truck, RefreshCw, CreditCard, Lock, Mail } from 'lucide-react';

const PolicyPage = () => {
  const policies = [
    {
      icon: Shield,
      title: "Privacy Policy",
      content: [
        {
          heading: "Information We Collect",
          text: "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. This includes your name, email address, phone number, shipping address, and payment information."
        },
        {
          heading: "How We Use Your Information",
          text: "We use your information to process orders, communicate with you about your purchases, provide customer support, and improve our services. We may also send you promotional emails about new products and special offers."
        },
        {
          heading: "Information Sharing",
          text: "We do not sell, trade, or otherwise transfer your personal information to third parties except as described in this policy. We may share information with trusted service providers who help us operate our website and conduct business."
        },
        {
          heading: "Data Security",
          text: "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All payment transactions are processed through secure, encrypted connections."
        }
      ]
    },
    {
      icon: Truck,
      title: "Shipping Policy",
      content: [
        {
          heading: "Shipping Areas",
          text: "We currently ship within Pakistan. Delivery is available in major cities including Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, and other major urban areas."
        },
        {
          heading: "Processing Time",
          text: "Orders are typically processed within 1-2 business days. During peak seasons or promotional periods, processing may take up to 3-4 business days."
        },
        {
          heading: "Delivery Time",
          text: "Standard delivery takes 3-7 business days within major cities and 5-10 business days for other areas. Express delivery options are available for urgent orders."
        },
        {
          heading: "Shipping Costs",
          text: "Shipping costs are calculated based on your location and order value. Free shipping is available on orders above PKR 2,000 within major cities."
        }
      ]
    },
    {
      icon: RefreshCw,
      title: "Return & Exchange Policy",
      content: [
        {
          heading: "Return Window",
          text: "You may return unused, unopened nail products within 7 days of delivery. For hygiene reasons, opened nail products cannot be returned unless defective."
        },
        {
          heading: "Return Process",
          text: "To initiate a return, contact our customer service team with your order number and reason for return. We'll provide you with return instructions and a tracking number."
        },
        {
          heading: "Refund Processing",
          text: "Refunds are processed within 5-7 business days after we receive and inspect the returned items. Refunds will be issued to your original payment method."
        },
        {
          heading: "Exchange Policy",
          text: "Exchanges are available for different shades or designs within the same product category, subject to availability. Exchange requests must be made within 7 days of delivery."
        }
      ]
    },
    {
      icon: CreditCard,
      title: "Payment Policy",
      content: [
        {
          heading: "Accepted Payment Methods",
          text: "We accept major credit cards (Visa, Mastercard), debit cards, bank transfers, and cash on delivery (COD) for orders within Pakistan."
        },
        {
          heading: "Payment Security",
          text: "All online payments are processed through secure, encrypted payment gateways. We do not store your credit card information on our servers."
        },
        {
          heading: "Cash on Delivery",
          text: "COD is available for orders within major cities. A small COD fee may apply. Payment must be made in exact change when possible."
        },
        {
          heading: "Order Confirmation",
          text: "You will receive an order confirmation email immediately after payment. If you don't receive confirmation within 30 minutes, please contact our support team."
        }
      ]
    },
    {
      icon: Lock,
      title: "Terms of Service",
      content: [
        {
          heading: "Website Usage",
          text: "By using our website, you agree to comply with all applicable laws and regulations. You must not use our site for any unlawful purposes or in any way that could damage our business."
        },
        {
          heading: "Product Information",
          text: "We strive to provide accurate product descriptions and images. However, colors may appear differently on various devices. Please contact us if you have questions about any product."
        },
        {
          heading: "Intellectual Property",
          text: "All content on this website, including images, text, logos, and designs, is the property of Nazakat Nail Store and is protected by copyright and trademark laws."
        },
        {
          heading: "Limitation of Liability",
          text: "Our liability is limited to the maximum extent permitted by law. We are not responsible for any indirect, incidental, or consequential damages arising from your use of our products or website."
        }
      ]
    },
    {
      icon: Mail,
      title: "Contact Information",
      content: [
        {
          heading: "Customer Support",
          text: "Our customer support team is available Monday to Saturday, 9:00 AM to 6:00 PM (PKT). We strive to respond to all inquiries within 24 hours."
        },
        {
          heading: "Contact Details",
          text: "Email: shopnazaqat.co@gmail.com | Phone: +92 3332306480 | Address: Riwind Road, Lahore, Pakistan"
        },
        {
          heading: "Policy Updates",
          text: "We may update these policies from time to time. Changes will be posted on this page with the updated date. Continued use of our website constitutes acceptance of any changes."
        },
        {
          heading: "Dispute Resolution",
          text: "Any disputes arising from your use of our website or purchase of our products will be resolved through good faith negotiations or, if necessary, through the courts of Pakistan."
        }
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
        {/* Hero Section */}
        <motion.section 
          className="py-16 bg-gradient-to-r from-pink-600 to-purple-600 text-white"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="container mx-auto px-4 text-center">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold font-playfair mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Policies & Terms
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Your trust is important to us. Read our comprehensive policies to understand how we protect and serve you.
            </motion.p>
          </div>
        </motion.section>

        {/* Policies Content */}
        <motion.section 
          className="py-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="container mx-auto px-4">
            <div className="space-y-12">
              {policies.map((policy, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-t-lg">
                      <CardTitle className="flex items-center space-x-3 text-2xl font-playfair">
                        <policy.icon className="h-8 w-8" />
                        <span>{policy.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        {policy.content.map((section, sectionIndex) => (
                          <div key={sectionIndex}>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 font-playfair">
                              {section.heading}
                            </h3>
                            <p className="text-gray-600 leading-relaxed mb-4">
                              {section.text}
                            </p>
                            {sectionIndex < policy.content.length - 1 && (
                              <Separator className="my-4" />
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Contact Section */}
            <motion.div 
              className="mt-16 text-center"
              variants={itemVariants}
            >
              <Card className="bg-gradient-to-r from-pink-100 to-purple-100 border-0 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold font-playfair text-gray-800 mb-4">
                    Have Questions About Our Policies?
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Our customer support team is here to help. Contact us for any clarifications 
                    about our policies or if you need assistance with your order.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <div className="flex items-center space-x-2 text-gray-700">
                      <Mail className="h-5 w-5 text-pink-500" />
                      <span>shopnazaqat.co@gmail.com</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700">
                      <span className="text-pink-500">📞</span>
                      <span>+92 3332306480</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Last Updated */}
            <motion.div 
              className="mt-8 text-center text-gray-500"
              variants={itemVariants}
            >
              <p className="text-sm">
                Last updated: August 20, 2025
              </p>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </PageLayout>
  );
};

export default PolicyPage;
