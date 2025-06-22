'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Rocket, 
  Target, 
  Users, 
  Sparkles,
  Globe,
  Calendar,
  DollarSign,
  Palette,
  Building2,
  CheckCircle
} from 'lucide-react';
import { DetailedBrandRequest } from '@/lib/types';

interface QuestionnaireProps {
  onSubmit: (data: DetailedBrandRequest) => void;
  onClose: () => void;
}

const BUSINESS_MODELS = [
  { value: 'b2b-saas', label: 'B2B SaaS', icon: Building2, description: 'Software for businesses' },
  { value: 'd2c', label: 'D2C', icon: Users, description: 'Direct to consumer' },
  { value: 'marketplace', label: 'Marketplace', icon: Globe, description: 'Connect buyers & sellers' },
  { value: 'service', label: 'Service', icon: Sparkles, description: 'Professional services' },
  { value: 'fintech', label: 'FinTech', icon: DollarSign, description: 'Financial technology' },
  { value: 'healthtech', label: 'HealthTech', icon: Target, description: 'Healthcare solutions' }
];

const BRAND_PERSONALITIES = [
  'Innovative', 'Trustworthy', 'Playful', 'Professional', 'Bold', 
  'Friendly', 'Sophisticated', 'Minimalist', 'Energetic', 'Reliable',
  'Creative', 'Modern', 'Classic', 'Approachable', 'Premium'
];

const VISUAL_STYLES = [
  { value: 'modern-minimal', label: 'Modern & Minimal' },
  { value: 'bold-colorful', label: 'Bold & Colorful' },
  { value: 'classic-elegant', label: 'Classic & Elegant' },
  { value: 'playful-friendly', label: 'Playful & Friendly' },
  { value: 'tech-futuristic', label: 'Tech & Futuristic' },
  { value: 'organic-natural', label: 'Organic & Natural' }
];

interface FormData {
  startup_idea: string;
  business_model: string;
  industry_vertical: string;
  target_demographics: string;
  key_differentiators: string;
  competitors: string;
  brand_personality_preferences: string[];
  visual_style_preferences: string;
  budget_constraints: string;
  timeline: string;
}

export default function BrandQuestionnaire({ onSubmit, onClose }: QuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    startup_idea: '',
    business_model: '',
    industry_vertical: '',
    target_demographics: '',
    key_differentiators: '',
    competitors: '',
    brand_personality_preferences: [],
    visual_style_preferences: '',
    budget_constraints: '',
    timeline: ''
  });

  const steps = [
    {
      title: "Tell us about your startup",
      description: "What problem are you solving?",
      fields: ['startup_idea']
    },
    {
      title: "Business details",
      description: "Help us understand your business model",
      fields: ['business_model', 'industry_vertical']
    },
    {
      title: "Target audience",
      description: "Who are your ideal customers?",
      fields: ['target_demographics', 'key_differentiators']
    },
    {
      title: "Competition",
      description: "Who are you competing against?",
      fields: ['competitors']
    },
    {
      title: "Brand personality",
      description: "How should your brand feel?",
      fields: ['brand_personality_preferences', 'visual_style_preferences']
    },
    {
      title: "Timeline & budget",
      description: "What are your constraints?",
      fields: ['budget_constraints', 'timeline']
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit the form
      const request: DetailedBrandRequest = {
        ...formData,
        competitors: formData.competitors.split(',').map(c => c.trim()).filter(c => c)
      };
      onSubmit(request);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    const currentFields = steps[currentStep].fields;
    return currentFields.every(field => {
      const value = formData[field as keyof FormData];
      if (Array.isArray(value)) return value.length > 0;
      return value && value.toString().trim() !== '';
    });
  };

  const renderField = (field: string) => {
    switch (field) {
      case 'startup_idea':
        return (
          <textarea
            value={formData.startup_idea}
            onChange={(e) => updateFormData('startup_idea', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
            rows={4}
            placeholder="Describe your startup idea in detail. What problem does it solve? What makes it unique?"
            maxLength={1000}
          />
        );

      case 'business_model':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {BUSINESS_MODELS.map((model) => {
              const Icon = model.icon;
              return (
                <button
                  key={model.value}
                  onClick={() => updateFormData('business_model', model.label)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.business_model === model.label
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                  <div className="font-medium">{model.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{model.description}</div>
                </button>
              );
            })}
          </div>
        );

      case 'industry_vertical':
        return (
          <input
            type="text"
            value={formData.industry_vertical}
            onChange={(e) => updateFormData('industry_vertical', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="e.g., Healthcare, Education, Finance, E-commerce, etc."
          />
        );

      case 'target_demographics':
        return (
          <textarea
            value={formData.target_demographics}
            onChange={(e) => updateFormData('target_demographics', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
            rows={3}
            placeholder="Describe your target audience: age, location, income level, interests, pain points, etc."
          />
        );

      case 'key_differentiators':
        return (
          <textarea
            value={formData.key_differentiators}
            onChange={(e) => updateFormData('key_differentiators', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
            rows={3}
            placeholder="What makes your solution unique? Why would customers choose you over alternatives?"
          />
        );

      case 'competitors':
        return (
          <input
            type="text"
            value={formData.competitors}
            onChange={(e) => updateFormData('competitors', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="List your main competitors (comma-separated)"
          />
        );

      case 'brand_personality_preferences':
        return (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {BRAND_PERSONALITIES.map((personality) => (
              <button
                key={personality}
                onClick={() => {
                  const current = formData.brand_personality_preferences;
                  if (current.includes(personality)) {
                    updateFormData('brand_personality_preferences', 
                      current.filter(p => p !== personality)
                    );
                  } else if (current.length < 5) {
                    updateFormData('brand_personality_preferences', 
                      [...current, personality]
                    );
                  }
                }}
                className={`px-3 py-2 rounded-full text-sm transition-all ${
                  formData.brand_personality_preferences.includes(personality)
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {personality}
              </button>
            ))}
          </div>
        );

      case 'visual_style_preferences':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {VISUAL_STYLES.map((style) => (
              <button
                key={style.value}
                onClick={() => updateFormData('visual_style_preferences', style.label)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.visual_style_preferences === style.label
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">{style.label}</div>
              </button>
            ))}
          </div>
        );

      case 'budget_constraints':
        return (
          <select
            value={formData.budget_constraints}
            onChange={(e) => updateFormData('budget_constraints', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="">Select budget level</option>
            <option value="bootstrap">Bootstrap (&lt; $10k)</option>
            <option value="seed">Seed ($10k - $100k)</option>
            <option value="funded">Funded ($100k - $1M)</option>
            <option value="enterprise">Enterprise ($1M+)</option>
          </select>
        );

      case 'timeline':
        return (
          <select
            value={formData.timeline}
            onChange={(e) => updateFormData('timeline', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="">Select timeline</option>
            <option value="asap">ASAP (Within 1 week)</option>
            <option value="month">Within 1 month</option>
            <option value="quarter">Within 3 months</option>
            <option value="planning">Just planning</option>
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Create Your Brand</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          <div className="mt-2 text-sm opacity-90">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold mb-2">{steps[currentStep].title}</h3>
              <p className="text-gray-600 mb-6">{steps[currentStep].description}</p>
              
              <div className="space-y-6">
                {steps[currentStep].fields.map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      {field === 'brand_personality_preferences' && (
                        <span className="text-gray-500 ml-2">(Select up to 5)</span>
                      )}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                isStepValid()
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <Rocket className="w-4 h-4" />
                  Generate Brand
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}