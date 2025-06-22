import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download,
  Maximize2,
  X,
  Palette,
  Monitor,
  Info
} from 'lucide-react';
import { GeneratedAsset, BrandStrategy } from '@/lib/types';

interface VisualAssetsProps {
  assets: GeneratedAsset[];
  strategy: BrandStrategy;
  onDownload: (url: string, filename: string) => void;
}

export default function VisualAssets({ assets, strategy, onDownload }: VisualAssetsProps) {
  const [selectedAsset, setSelectedAsset] = useState<GeneratedAsset | null>(null);

  const logo = assets.find(a => a.type === 'logo');
  const mockup = assets.find(a => a.type === 'mockup');

  return (
    <div className="space-y-8">
      {/* Logo Section */}
      {logo && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-600" />
              Logo Design
            </h3>
            <button
              onClick={() => onDownload(logo.url, logo.filename)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Logo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Preview */}
            <div>
              <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center">
                <img 
                  src={logo.url} 
                  alt={`${strategy.company_name} logo`}
                  className="max-w-full max-h-64 cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setSelectedAsset(logo)}
                />
              </div>
              <button
                onClick={() => setSelectedAsset(logo)}
                className="mt-3 text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                <Maximize2 className="w-4 h-4" />
                View full size
              </button>
            </div>

            {/* Logo Details */}
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Logo Style</h4>
                <p className="text-gray-600">{strategy.logo_style}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Usage Guidelines</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    Minimum size: 32px height for digital, 0.5" for print
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    Clear space: Maintain padding equal to the x-height
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    Use on white or light backgrounds for best visibility
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    Do not distort, rotate, or apply effects
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">File Formats Needed</h4>
                <div className="flex flex-wrap gap-2">
                  {['PNG', 'SVG', 'PDF', 'EPS'].map(format => (
                    <span key={format} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      .{format.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Website Mockup Section */}
      {mockup && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Monitor className="w-5 h-5 text-purple-600" />
              Website Mockup
            </h3>
            <button
              onClick={() => onDownload(mockup.url, mockup.filename)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Mockup
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <img 
              src={mockup.url} 
              alt={`${strategy.company_name} website mockup`}
              className="w-full rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => setSelectedAsset(mockup)}
            />
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Implementation Tips</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• Use this mockup as a reference for your web developer</li>
                  <li>• The layout follows {strategy.industry} best practices</li>
                  <li>• Ensure all CTAs use the brand colors consistently</li>
                  <li>• Consider A/B testing different headline variations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Design System Preview */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Quick Design System</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Colors */}
          <div>
            <h4 className="font-medium mb-3">Colors</h4>
            <div className="space-y-2">
              {Object.entries(strategy.color_scheme).map(([name, color]) => (
                <div key={name} className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                  <div>
                    <p className="text-sm font-medium capitalize">{name}</p>
                    <p className="text-xs text-gray-500">{color}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div>
            <h4 className="font-medium mb-3">Typography</h4>
            {strategy.typography_recommendations ? (
              <div className="space-y-3">
                <div>
                  <p className="text-2xl font-bold">Headline</p>
                  <p className="text-sm text-gray-600">{strategy.typography_recommendations.primary}</p>
                </div>
                <div>
                  <p className="text-base">Body text sample</p>
                  <p className="text-sm text-gray-600">{strategy.typography_recommendations.secondary}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Typography guidelines coming soon</p>
            )}
          </div>

          {/* Visual Elements */}
          <div>
            <h4 className="font-medium mb-3">Visual Style</h4>
            <div className="space-y-2">
              {strategy.visual_elements.slice(0, 4).map((element, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full" />
                  <span className="text-sm">{element}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full Size Image Modal */}
      {selectedAsset && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedAsset(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="relative max-w-5xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedAsset(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            
            <img 
              src={selectedAsset.url} 
              alt={selectedAsset.filename}
              className="max-w-full max-h-[90vh] object-contain"
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <p className="text-white font-medium">{selectedAsset.filename}</p>
              <button
                onClick={() => {
                  onDownload(selectedAsset.url, selectedAsset.filename);
                  setSelectedAsset(null);
                }}
                className="mt-2 flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}