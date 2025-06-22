import React from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, 
  CheckCircle, 
  Target,
  Users,
  Zap,
  Heart,
  Shield,
  TrendingUp,
  Globe,
  Palette
} from 'lucide-react';
import { BrandStrategy } from '@/lib/types';

interface BrandOverviewProps {
  strategy: BrandStrategy;
  onCopy: (text: string, itemId: string) => void;
  copiedItem: string | null;
}

export default function BrandOverview({ strategy, onCopy, copiedItem }: BrandOverviewProps) {
  const CopyButton = ({ text, itemId }: { text: string; itemId: string }) => (
    <button
      onClick={() => onCopy(text, itemId)}
      className="p-1 hover:bg-gray-100 rounded transition-colors"
    >
      {copiedItem === itemId ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4 text-gray-400" />
      )}
    </button>
  );

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">{strategy.company_name}</h2>
        <p className="text-xl opacity-90 mb-4">{strategy.tagline}</p>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
            {strategy.industry}
          </span>
          <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
            {strategy.brand_archetype}
          </span>
        </div>
      </div>

      {/* Alternative Names */}
      {strategy.alternative_names && strategy.alternative_names.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-600" />
            Alternative Name Options
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {strategy.alternative_names.map((name, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{name}</span>
                <CopyButton text={name} itemId={`alt-name-${index}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Positioning Statement */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-600" />
          Positioning Statement
        </h3>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-gray-800 leading-relaxed">{strategy.positioning_statement}</p>
          <div className="mt-2 flex justify-end">
            <CopyButton text={strategy.positioning_statement} itemId="positioning" />
          </div>
        </div>
      </div>

      {/* Value Proposition & Competitive Advantage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Unique Value Proposition
          </h3>
          <p className="text-gray-700">{strategy.unique_value_proposition}</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            Competitive Advantage
          </h3>
          <p className="text-gray-700">{strategy.competitive_advantage}</p>
        </div>
      </div>

      {/* Customer Pain Points */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          Problems We Solve
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {strategy.customer_pain_points.map((pain, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="text-3xl mb-2">{['😤', '😩', '😓'][index % 3]}</div>
              <p className="text-gray-700">{pain}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Brand Story */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-purple-600" />
          Brand Story
        </h3>
        <p className="text-gray-700 leading-relaxed">{strategy.brand_story}</p>
      </div>

      {/* Brand Values */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Core Values</h3>
        <div className="space-y-4">
          {strategy.brand_values.map((value, index) => (
            <div key={index} className="border-l-4 border-purple-600 pl-4">
              <h4 className="font-semibold text-gray-900">{value.value}</h4>
              <p className="text-gray-600 mt-1">{value.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Identity */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-600" />
          Visual Identity
        </h3>
        
        {/* Color Scheme */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">Color Palette</h4>
          <div className="flex gap-4">
            {Object.entries(strategy.color_scheme).map(([name, color]) => (
              <div key={name} className="text-center">
                <div 
                  className="w-20 h-20 rounded-lg shadow-md mb-2"
                  style={{ backgroundColor: color }}
                />
                <p className="text-sm font-medium capitalize">{name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <code className="text-xs bg-gray-100 px-1 rounded">{color}</code>
                  <CopyButton text={color} itemId={`color-${name}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typography */}
        {strategy.typography_recommendations && (
          <div className="mb-6">
            <h4 className="font-medium mb-3">Typography</h4>
            <div className="space-y-2">
              <div>
                <span className="text-gray-600">Headlines: </span>
                <span className="font-semibold">{strategy.typography_recommendations.primary}</span>
              </div>
              <div>
                <span className="text-gray-600">Body Text: </span>
                <span className="font-semibold">{strategy.typography_recommendations.secondary}</span>
              </div>
            </div>
          </div>
        )}

        {/* Visual Elements */}
        <div>
          <h4 className="font-medium mb-3">Visual Elements</h4>
          <div className="flex flex-wrap gap-2">
            {strategy.visual_elements.map((element, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
              >
                {element}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Target Audience */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" />
          Target Audience
        </h3>
        <p className="text-gray-700">{strategy.target_audience}</p>
      </div>

      {/* Brand Personality */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Brand Personality</h3>
        <div className="flex flex-wrap gap-3">
          {strategy.brand_personality.map((trait, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full font-medium"
            >
              {trait}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}