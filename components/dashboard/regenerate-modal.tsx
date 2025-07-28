import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { GeneratedAsset, BrandStrategy } from '@/lib/types';
import { brandAPI } from '@/lib/api';

interface RegenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: GeneratedAsset;
  strategy: BrandStrategy;
  onSuccess: (newAsset: GeneratedAsset) => void;
}

export default function RegenerateModal({ 
  isOpen, 
  onClose, 
  asset, 
  strategy, 
  onSuccess 
}: RegenerateModalProps) {
  const [prompt, setPrompt] = useState(asset.metadata?.custom_prompt || asset.metadata?.prompt || '');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const getAssetTypeDisplay = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'logo': 'Logo',
      'mockup': 'Website Mockup',
      'social_post': 'Social Media Post',
      'video': 'Promotional Video'
    };
    return typeMap[type] || type;
  };

  const getDefaultPrompt = () => {
    switch (asset.type) {
      case 'logo':
        return `Modern logo for ${strategy.company_name}, ${strategy.industry} company. Style: ${strategy.logo_style}. Colors: ${Object.values(strategy.color_scheme).join(', ')}`;
      case 'mockup':
        return `Landing page for ${strategy.company_name}. Tagline: "${strategy.tagline}". Show ${strategy.target_audience} using the product. Modern, clean design.`;
      case 'social_post':
        return `${asset.metadata?.platform || 'Instagram'} post for ${strategy.company_name}. ${strategy.tagline}. Professional, engaging design.`;
      case 'video':
        return `8-second promotional video for ${strategy.company_name}. Show the problem, reveal the solution, demonstrate benefits. Dynamic and engaging.`;
      default:
        return '';
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await brandAPI.regenerateAsset({
        asset_type: asset.type,
        original_prompt: asset.metadata?.prompt || '',
        new_prompt: prompt,
        brand_strategy: strategy,
        metadata: asset.metadata
      });

      if (response.success && response.asset) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess(response.asset!);
          onClose();
        }, 1500);
      } else {
        setError(response.error || 'Failed to regenerate asset');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsRegenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6" />
                <h2 className="text-xl font-bold">Regenerate {getAssetTypeDisplay(asset.type)}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Current Asset Preview */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Current {getAssetTypeDisplay(asset.type)}</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                {asset.type === 'video' ? (
                  <video 
                    src={asset.url} 
                    className="w-full max-h-48 object-contain rounded"
                    controls
                  />
                ) : (
                  <img 
                    src={asset.url} 
                    alt={asset.filename}
                    className="w-full max-h-48 object-contain rounded"
                  />
                )}
              </div>
            </div>

            {/* Prompt Editor */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={getDefaultPrompt()}
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  disabled={isRegenerating}
                />
                <p className="mt-2 text-xs text-gray-500">
                  Describe what you want to see. Be specific about style, colors, composition, and mood.
                </p>
              </div>

              {/* Suggestions */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-purple-900 mb-2">Tips for better results:</h4>
                <ul className="space-y-1 text-sm text-purple-700">
                  <li>• Be specific about visual style (modern, minimal, bold, etc.)</li>
                  <li>• Mention specific colors or use brand colors</li>
                  <li>• Describe the mood or feeling you want to convey</li>
                  {asset.type === 'logo' && <li>• Specify if you want text, symbol, or combination mark</li>}
                  {asset.type === 'mockup' && <li>• Describe the layout and key sections you want</li>}
                  {asset.type === 'video' && <li>• Outline the story or sequence you want to show</li>}
                </ul>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Regeneration failed</p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </motion.div>
              )}

              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-medium text-green-900">
                    Successfully regenerated! Updating your dashboard...
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={isRegenerating}
            >
              Cancel
            </button>
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating || !prompt.trim()}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isRegenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Regenerate
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}