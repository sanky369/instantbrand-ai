'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Rocket, 
  Brain, 
  Palette, 
  Share2, 
  Video, 
  Zap, 
  Sparkles, 
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Users,
  Clock,
  Target,
  Globe,
  Smartphone,
  Monitor,
  Instagram,
  Twitter,
  Linkedin
} from 'lucide-react';
import BrandQuestionnaire from '@/components/brand-questionnaire';
import BrandGenerator from '@/components/brand-generator';
import { DetailedBrandRequest, BrandPackage } from '@/lib/types';
import { BrandStorage } from '@/lib/storage';


const FEATURES = [
  {
    icon: Target,
    title: 'Brand Strategy',
    description: 'AI analyzes your idea and creates comprehensive brand guidelines, positioning, and messaging that resonates with your target audience.',
    gradient: 'from-purple-500 to-indigo-600'
  },
  {
    icon: Sparkles,
    title: 'Visual Identity',
    description: 'Professional logos, color palettes, and mockups using cutting-edge AI models trained on the world\'s best design work.',
    gradient: 'from-blue-500 to-cyan-600'
  },
  {
    icon: Share2,
    title: 'Social Media',
    description: 'Platform-specific content for Instagram, LinkedIn, Twitter, and TikTok that drives engagement and builds community.',
    gradient: 'from-green-500 to-emerald-600'
  },
  {
    icon: Video,
    title: 'Video Content',
    description: 'Promotional videos, social media clips, and product demos that bring your brand to life and convert viewers to customers.',
    gradient: 'from-red-500 to-pink-600'
  }
];

const TRUST_LOGOS = [
  'TechCrunch', 'ProductHunt', 'Y Combinator', 'Stripe', 'Notion', 'Figma'
];

// Floating geometric shapes component
const FloatingShapes = () => {
  const shapes = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 20,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute rounded-full bg-gradient-to-r from-purple-400/10 to-pink-400/10 backdrop-blur-sm"
          style={{
            width: shape.size,
            height: shape.size,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Particle system component
const ParticleSystem = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 5,
    delay: Math.random() * 3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};


export default function Home() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -100]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const router = useRouter();
  
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<DetailedBrandRequest | null>(null);

  const handleQuestionnaireSubmit = (data: DetailedBrandRequest) => {
    setCurrentRequest(data);
    setShowQuestionnaire(false);
    setShowGenerator(true);
  };

  const handleGenerationComplete = (brandPackage: BrandPackage) => {
    // Save to storage
    BrandStorage.savePackage(brandPackage);
    
    // Redirect to dashboard
    router.push(`/dashboard/${brandPackage.id}`);
  };

  const openQuestionnaire = () => {
    setShowQuestionnaire(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Animated Background Elements */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <FloatingShapes />
          <ParticleSystem />
          
          {/* Gradient Orbs */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20"
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          <motion.div 
            className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20"
            animate={{ 
              scale: [1.2, 1, 1.2],
              x: [0, -40, 0],
              y: [0, 20, 0]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl opacity-20"
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 12, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 2
            }}
          />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <motion.div 
              className="flex items-center justify-center gap-2 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6 text-purple-400" />
              </motion.div>
              <span className="text-purple-400 font-medium">InstantBrand AI</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              From Startup Idea to{' '}
              <motion.span
                className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_100%]"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] 
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "linear" 
                }}
              >
                Complete Brand Package
              </motion.span>
              {' '}in 60 Seconds
            </motion.h1>
            
            <motion.p 
              className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              AI agents create your logo, website mockup, social posts, and promo video automatically
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mb-12"
          >
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={openQuestionnaire}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-2xl transition-all duration-300 inline-flex items-center gap-3 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Rocket className="w-6 h-6" />
              </motion.div>
              Generate My Brand Package
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div 
              className="flex items-center gap-2 text-gray-400"
              whileHover={{ scale: 1.05 }}
            >
              <Users className="w-5 h-5" />
              <span>Used by 10,000+ startups</span>
            </motion.div>
            
            <div className="flex flex-wrap justify-center gap-6 opacity-60">
              {TRUST_LOGOS.map((logo, index) => (
                <motion.div 
                  key={index} 
                  className="text-gray-400 font-medium"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                  whileHover={{ scale: 1.1, opacity: 1 }}
                >
                  {logo}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Demo Section */}

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-purple-50 to-pink-50 relative overflow-hidden">
        {/* Background Animation */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'] 
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          style={{
            background: 'linear-gradient(45deg, purple, transparent, pink, transparent)'
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              4 AI Agents, Unlimited Possibilities
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Our specialized AI agents work together to create a cohesive brand experience that converts
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.2,
                    type: "spring",
                    bounce: 0.4
                  }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    y: -10,
                    scale: 1.02,
                    boxShadow: "0 25px 50px rgba(0,0,0,0.1)"
                  }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                    style={{ background: `linear-gradient(135deg, ${feature.gradient.replace('from-', '').replace('to-', '').replace('-500', '').replace('-600', '')})` }}
                  />
                  <div className="flex items-start gap-4 relative z-10">
                    <motion.div 
                      className={`bg-gradient-to-r ${feature.gradient} p-3 rounded-lg shadow-lg`}
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.1
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <motion.h3 
                        className="text-xl font-bold text-gray-900 mb-2"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: index * 0.2 + 0.3 }}
                        viewport={{ once: true }}
                      >
                        {feature.title}
                      </motion.h3>
                      <motion.p 
                        className="text-gray-600"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: index * 0.2 + 0.4 }}
                        viewport={{ once: true }}
                      >
                        {feature.description}
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Results Preview Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              See What You Get
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Professional-grade brand assets that would normally take weeks and cost thousands
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { title: 'Logo Variations', icon: Sparkles, colors: ['purple', 'indigo'] },
              { title: 'Website Mockups', icon: Monitor, colors: ['blue', 'cyan'] },
              { title: 'Social Media Posts', icon: Instagram, colors: ['pink', 'rose'] },
              { title: 'Video Content', icon: Video, colors: ['red', 'orange'] }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.15,
                    type: "spring",
                    bounce: 0.4
                  }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -10,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                  }}
                  className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-500 cursor-pointer group relative overflow-hidden"
                >
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-r from-${item.colors[0]}-500 to-${item.colors[1]}-600 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg`}
                    whileHover={{ 
                      rotate: 360,
                      scale: 1.1
                    }}
                    transition={{ duration: 0.8 }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <motion.h3 
                    className="text-lg font-semibold text-gray-900 mb-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.15 + 0.3 }}
                    viewport={{ once: true }}
                  >
                    {item.title}
                  </motion.h3>
                  <motion.div 
                    className="w-full h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: "linear",
                        delay: index * 0.5
                      }}
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center items-center gap-8 text-sm text-gray-600">
              {[
                { icon: Clock, text: "47 seconds average generation time" },
                { icon: Star, text: "12+ assets created" },
                { icon: Brain, text: "4 AI models used" }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div 
                    key={index}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{stat.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-purple-900 to-pink-900 relative overflow-hidden">
        {/* Animated Background */}
        <motion.div 
          className="absolute inset-0"
          animate={{ 
            background: [
              'radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <motion.h2 
              className="text-4xl sm:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Start Creating Your Brand
            </motion.h2>
            <motion.p 
              className="text-xl text-purple-200 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Join thousands of startups who've transformed their ideas into professional brands in minutes
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(255,255,255,0.2)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={openQuestionnaire}
                className="bg-gradient-to-r from-white to-gray-100 hover:from-gray-100 hover:to-gray-200 text-purple-900 font-bold py-4 px-8 rounded-full text-lg shadow-2xl transition-all duration-300 inline-flex items-center gap-3 relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Rocket className="w-6 h-6" />
                </motion.div>
                Get Started Free
              </motion.button>
              
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.1)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={openQuestionnaire}
                className="border-2 border-white text-white hover:bg-white hover:text-purple-900 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 inline-flex items-center gap-3"
              >
                <Play className="w-5 h-5" />
                See Live Demo
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-purple-200 mb-4">
                <span className="font-semibold">Free trial</span> - Generate your first brand package
              </p>
              <p className="text-sm text-purple-300">
                30-day money-back guarantee • No credit card required
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="flex flex-col items-center justify-center text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </motion.div>
                <span className="text-xl font-bold text-white">InstantBrand AI</span>
              </div>
              <p className="text-gray-400">
                Transforming startup ideas into complete brand packages
              </p>
            </motion.div>
            
            <motion.div 
              className="flex gap-6 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {[
                { icon: Twitter, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Instagram, href: "#" }
              ].map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    whileHover={{ 
                      scale: 1.2,
                      color: "#a855f7"
                    }}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.a>
                );
              })}
            </motion.div>
            
            <motion.div 
              className="text-sm text-gray-500"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <p>&copy; 2024 InstantBrand AI. All rights reserved.</p>
            </motion.div>
          </motion.div>
        </div>
      </footer>

      {/* Questionnaire Modal */}
      <AnimatePresence>
        {showQuestionnaire && (
          <BrandQuestionnaire
            onSubmit={handleQuestionnaireSubmit}
            onClose={() => setShowQuestionnaire(false)}
          />
        )}
      </AnimatePresence>

      {/* Brand Generator Modal */}
      <AnimatePresence>
        {showGenerator && currentRequest && (
          <BrandGenerator
            request={currentRequest}
            onComplete={handleGenerationComplete}
            onClose={() => setShowGenerator(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}