'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Download, 
  Share2, 
  Copy, 
  CheckCircle, 
  ArrowLeft,
  Palette,
  Video,
  Globe,
  FileText,
  Sparkles,
  Instagram,
  Twitter,
  Linkedin,
  ExternalLink,
  Zap,
  History
} from 'lucide-react';
import { BrandPackage, GeneratedAsset } from '@/lib/types';
import { BrandStorage } from '@/lib/storage';
import BrandOverview from '@/components/dashboard/brand-overview';
import VisualAssets from '@/components/dashboard/visual-assets';
import SocialContent from '@/components/dashboard/social-content';
import VideoSection from '@/components/dashboard/video-section';
import ImplementationGuide from '@/components/dashboard/implementation-guide';

export default function DashboardClient() {
  const params = useParams();
  const router = useRouter();
  const [brandPackage, setBrandPackage] = useState<BrandPackage | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [recentPackages, setRecentPackages] = useState<BrandPackage[]>([]);

  useEffect(() => {
    // Load brand package using BrandStorage utility
    const packageId = params.id as string;
    const foundPackage = BrandStorage.getPackageById(packageId);
    
    if (foundPackage) {
      setBrandPackage(foundPackage);
    } else {
      // Package not found, redirect to home
      router.push('/');
    }

    // Load recent packages for navigation
    const recent = BrandStorage.getRecentPackages(5);
    setRecentPackages(recent);
  }, [params.id, router]);

  const handleCopy = (text: string, itemId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(itemId);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleDownload = (url: string, filename: string) => {
    // Create a temporary anchor element to trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${brandPackage?.strategy.company_name} Brand Package`,
        text: `Check out my new brand created with InstantBrand AI!`,
        url: window.location.href
      });
    } else {
      handleCopy(window.location.href, 'share-url');
    }
  };

  const handleAssetUpdate = (newAsset: GeneratedAsset) => {
    if (!brandPackage) return;
    
    // Update the asset in the brand package
    const updatedAssets = brandPackage.assets.map(asset => {
      // For social posts, match by type and platform
      if (asset.type === 'social_post' && newAsset.type === 'social_post') {
        return asset.metadata?.platform === newAsset.metadata?.platform ? newAsset : asset;
      }
      // For other assets, just match by type
      return asset.type === newAsset.type ? newAsset : asset;
    });

    const updatedPackage = {
      ...brandPackage,
      assets: updatedAssets
    };

    setBrandPackage(updatedPackage);
    
    // Update in storage
    BrandStorage.savePackage(updatedPackage);
  };

  if (!brandPackage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your brand package...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'visuals', label: 'Visual Assets', icon: Palette },
    { id: 'social', label: 'Social Media', icon: Share2 },
    { id: 'video', label: 'Video', icon: Video },
    { id: 'implementation', label: 'Implementation', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <span className="text-lg font-bold text-gray-900">InstantBrand AI</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Zap className="w-4 h-4" />
                New Brand
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <BrandOverview 
              strategy={brandPackage.strategy} 
              onCopy={handleCopy}
              copiedItem={copiedItem}
            />
          )}
          
          {activeTab === 'visuals' && (
            <VisualAssets 
              assets={brandPackage.assets.filter(a => a.type === 'logo' || a.type === 'mockup')}
              strategy={brandPackage.strategy}
              onDownload={handleDownload}
              onAssetUpdate={handleAssetUpdate}
            />
          )}
          
          {activeTab === 'social' && (
            <SocialContent 
              assets={brandPackage.assets.filter(a => a.type === 'social_post')}
              strategy={brandPackage.strategy}
              onDownload={handleDownload}
              onCopy={handleCopy}
              copiedItem={copiedItem}
              onAssetUpdate={handleAssetUpdate}
            />
          )}
          
          {activeTab === 'video' && (
            <VideoSection 
              asset={brandPackage.assets.find(a => a.type === 'video')}
              strategy={brandPackage.strategy}
              onDownload={handleDownload}
              onAssetUpdate={handleAssetUpdate}
            />
          )}
          
          {activeTab === 'implementation' && (
            <ImplementationGuide 
              strategy={brandPackage.strategy}
              onCopy={handleCopy}
              copiedItem={copiedItem}
            />
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-900">InstantBrand AI</span>
              <span className="text-gray-500">•</span>
              <span className="text-sm text-gray-600">Brand package generated on {new Date().toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <button
                onClick={() => router.push('/')}
                className="hover:text-purple-600 transition-colors"
              >
                Create New Brand
              </button>
              <span className="text-gray-300">|</span>
              <span>© 2024 InstantBrand AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}