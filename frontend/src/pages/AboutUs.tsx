import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, Users, Award } from 'lucide-react';
import owner1 from '@/assets/anoushay.jpg';
import owner2 from '@/assets/emaan.jpg';

const AboutUs = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const founders = [
    {
      id: 1,
      name: "Anoushay Javed",
      role: "Founder & Creative Director",
      image: owner1,
      description: "Passionate about nail art and beauty, Wajiha brings creativity and innovation to every collection. With years of experience in the beauty industry, she ensures every product meets the highest standards of quality and style.",
      specialties: ["Nail Art Design", "Product Curation", "Brand Vision"],
      quote: "Beauty is about expressing your unique self through every detail."
    },
    {
      id: 2,
      name: "Emaan",
      role: "Operations & Strategy",
      image: owner2,
      description: "Our strategic mind behind the brand's growth and customer satisfaction. She focuses on ensuring that every customer receives exceptional service and quality products that exceed expectations.",
      specialties: ["Business Strategy", "Customer Experience", "Quality Assurance"],
      quote: "Excellence is not just a goal, it's our commitment to every customer."
    }
  ];

  const stats = [
    { icon: Users, label: "Happy Customers", value: "5000+" },
    { icon: Star, label: "5-Star Reviews", value: "4.9/5" },
    { icon: Award, label: "Years Experience", value: "3+" },
    { icon: Heart, label: "Products Sold", value: "10K+" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
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
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
        {/* Hero Section */}
        <motion.section 
          className="py-20 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold font-playfair mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-black bg-clip-text text-transparent">
                About Nazakat
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
                Where passion meets artistry in the world of nail beauty
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full"></div>
            </motion.div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-pink-200 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-16 h-16 bg-purple-200 rounded-full opacity-60 animate-pulse delay-1000"></div>
        </motion.section>

        {/* Story Section */}
        <motion.section 
          className="py-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4">
            <motion.div variants={itemVariants} className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-bold font-playfair mb-8 text-gray-800">Our Story</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Welcome to <span className="font-semibold text-pink-600">Nazakat Nails</span>! We are passionate about providing the best nail collections, 
                with a focus on quality, creativity, and customer satisfaction. Our journey began with a simple vision: 
                to make beautiful, professional-quality nail products accessible to everyone.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our curated collections are designed to help you express your unique style. Whether you love bold designs 
                or classic elegance, our products are crafted to inspire confidence and beauty in every application.
              </p>
            </motion.div>

            {/* Stats Section */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
              variants={containerVariants}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-4 text-pink-600" />
                  <div className="text-2xl font-bold text-gray-800 mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Founders Section */}
        <motion.section 
          className="py-16 bg-white/50"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4">
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-4xl font-bold font-playfair mb-4 text-gray-800">Meet Our Founders</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The visionary minds behind Nazakat, dedicated to bringing you the finest nail art experience
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {founders.map((founder) => (
                <motion.div
                  key={founder.id}
                  variants={itemVariants}
                  onHoverStart={() => setHoveredCard(founder.id)}
                  onHoverEnd={() => setHoveredCard(null)}
                  className="group cursor-pointer"
                >
                  <Card className="overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border-0">
                    <div className="relative">
                      <motion.div
                        className="relative h-80 overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src={founder.image}
                          alt={founder.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Quote overlay */}
                        <motion.div
                          className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={{ y: 20 }}
                          whileHover={{ y: 0 }}
                        >
                          <p className="text-sm italic font-medium">"{founder.quote}"</p>
                        </motion.div>
                      </motion.div>
                    </div>
                    
                    <CardContent className="p-8">
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{founder.name}</h3>
                        <Badge variant="secondary" className="bg-pink-100 text-pink-700 hover:bg-pink-200">
                          {founder.role}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {founder.description}
                      </p>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Specialties</h4>
                        <div className="flex flex-wrap gap-2">
                          {founder.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-pink-200 text-pink-700">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Mission Section */}
        <motion.section 
          className="py-20 bg-gradient-to-r from-pink-600 to-purple-600 text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold font-playfair mb-8">Our Mission</h2>
              <p className="text-xl leading-relaxed max-w-4xl mx-auto mb-8">
                At Nazakat, we believe that beautiful nails are more than just an accessory – they're a form of 
                self-expression, confidence, and artistry. Our mission is to provide premium nail products that 
                empower individuals to showcase their unique style and personality.
              </p>
              <motion.div
                className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Heart className="w-5 h-5" />
                <span className="font-medium">Thank you for choosing Nazakat</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </PageLayout>
  );
};

export default AboutUs;
