import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download,
  Copy,
  CheckCircle,
  Instagram,
  Twitter,
  Linkedin,
  MessageSquare,
  Calendar,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { GeneratedAsset, BrandStrategy } from '@/lib/types';
import RegenerateModal from './regenerate-modal';

interface SocialContentProps {
  assets: GeneratedAsset[];
  strategy: BrandStrategy;
  onDownload: (url: string, filename: string) => void;
  onCopy: (text: string, itemId: string) => void;
  copiedItem: string | null;
  onAssetUpdate?: (newAsset: GeneratedAsset) => void;
}

const platformIcons = {
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin
};

const platformColors = {
  instagram: 'from-purple-600 to-pink-600',
  twitter: 'from-blue-400 to-blue-600',
  linkedin: 'from-blue-600 to-blue-800'
};

export default function SocialContent({ assets: initialAssets, strategy, onDownload, onCopy, copiedItem, onAssetUpdate }: SocialContentProps) {
  const [assets, setAssets] = useState(initialAssets);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [regenerateAsset, setRegenerateAsset] = useState<GeneratedAsset | null>(null);

  // Group assets by platform
  const assetsByPlatform = assets.reduce((acc, asset) => {
    const platform = asset.metadata?.platform || 'unknown';
    if (!acc[platform]) acc[platform] = [];
    acc[platform].push(asset);
    return acc;
  }, {} as Record<string, GeneratedAsset[]>);

  const handleAssetRegenerated = (newAsset: GeneratedAsset) => {
    // Update the local assets array
    setAssets(prevAssets => {
      const updatedAssets = prevAssets.filter(a => 
        !(a.type === newAsset.type && a.metadata?.platform === newAsset.metadata?.platform)
      );
      return [...updatedAssets, newAsset];
    });
    
    // Notify parent component if callback provided
    if (onAssetUpdate) {
      onAssetUpdate(newAsset);
    }
    
    setRegenerateAsset(null);
  };

  const CopyButton = ({ text, itemId }: { text: string; itemId: string }) => (
    <button
      onClick={() => onCopy(text, itemId)}
      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
      {/* Platform Tabs */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Social Media Content</h3>
        <div className="flex gap-2 mb-6">
          {Object.keys(assetsByPlatform).map(platform => {
            const Icon = platformIcons[platform as keyof typeof platformIcons] || MessageSquare;
            return (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform === selectedPlatform ? null : platform)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                  ${selectedPlatform === platform 
                    ? 'bg-gradient-to-r text-white shadow-md ' + platformColors[platform as keyof typeof platformColors]
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="capitalize">{platform}</span>
              </button>
            );
          })}
        </div>

        {/* Platform Content */}
        {selectedPlatform && assetsByPlatform[selectedPlatform] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {assetsByPlatform[selectedPlatform].map((asset, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                {/* Post Image */}
                <div className="bg-gray-50 p-4">
                  <img 
                    src={asset.url} 
                    alt={asset.filename}
                    className="w-full max-w-md mx-auto rounded-lg shadow-md"
                  />
                </div>

                {/* Post Copy */}
                {asset.metadata?.copy && (
                  <div className="p-4 bg-white">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">Post Copy</h4>
                      <CopyButton 
                        text={asset.metadata.copy} 
                        itemId={`copy-${selectedPlatform}-${index}`} 
                      />
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="whitespace-pre-wrap text-sm text-gray-700">
                        {asset.metadata.copy}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="p-4 bg-gray-50 border-t flex gap-2">
                  <button
                    onClick={() => setRegenerateAsset(asset)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    Regenerate
                  </button>
                  <button
                    onClick={() => onDownload(asset.url, asset.filename)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {!selectedPlatform && (
          <p className="text-center text-gray-500 py-8">
            Select a platform above to view and download social media content
          </p>
        )}
      </div>

      {/* Content Calendar Suggestions */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          Content Calendar Suggestions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium mb-2">Week 1: Launch</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Announce your brand launch</li>
              <li>• Share your mission statement</li>
              <li>• Introduce the team</li>
            </ul>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">Week 2-3: Education</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Share industry insights</li>
              <li>• Explain your solution</li>
              <li>• Customer pain points</li>
            </ul>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium mb-2">Week 4: Engagement</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Run a giveaway</li>
              <li>• Share testimonials</li>
              <li>• Call-to-action posts</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Engagement Tips */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          Platform-Specific Tips
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Instagram className="w-5 h-5 text-pink-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Instagram</h4>
              <p className="text-sm text-gray-600 mt-1">
                Post at 11 AM or 2 PM for best engagement. Use 5-10 relevant hashtags. 
                Create Instagram Stories to complement your posts.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Linkedin className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium">LinkedIn</h4>
              <p className="text-sm text-gray-600 mt-1">
                Post Tuesday-Thursday, 8-10 AM. Focus on professional insights. 
                Engage with comments within the first hour.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Twitter className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium">Twitter/X</h4>
              <p className="text-sm text-gray-600 mt-1">
                Tweet 3-5 times daily. Use 1-2 hashtags max. 
                Engage with replies and retweet relevant content.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hashtag Suggestions */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Suggested Hashtags</h3>
        <div className="flex flex-wrap gap-2">
          {[
            `#${strategy.company_name.replace(/\s/g, '')}`,
            `#${strategy.industry}`,
            '#startup',
            '#innovation',
            `#${strategy.industry.toLowerCase()}tech`,
            '#entrepreneurship',
            '#newbrand',
            '#launching'
          ].map((tag, index) => (
            <div key={index} className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
              <span className="text-sm">{tag}</span>
              <CopyButton text={tag} itemId={`hashtag-${index}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Regenerate Modal */}
      {regenerateAsset && (
        <RegenerateModal
          isOpen={!!regenerateAsset}
          onClose={() => setRegenerateAsset(null)}
          asset={regenerateAsset}
          strategy={strategy}
          onSuccess={handleAssetRegenerated}
        />
      )}
    </div>
  );
}