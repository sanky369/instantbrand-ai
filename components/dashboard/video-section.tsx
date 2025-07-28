import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download,
  Play,
  Pause,
  Video,
  FileText,
  Music,
  MessageSquare,
  Youtube,
  Share2,
  Palette,
  Instagram,
  Sparkles
} from 'lucide-react';
import { GeneratedAsset, BrandStrategy } from '@/lib/types';
import RegenerateModal from './regenerate-modal';

interface VideoSectionProps {
  asset?: GeneratedAsset;
  strategy: BrandStrategy;
  onDownload: (url: string, filename: string) => void;
  onAssetUpdate?: (newAsset: GeneratedAsset) => void;
}

export default function VideoSection({ asset: initialAsset, strategy, onDownload, onAssetUpdate }: VideoSectionProps) {
  const [asset, setAsset] = useState(initialAsset);
  const [isPlaying, setIsPlaying] = useState(false);
  const [regenerateModalOpen, setRegenerateModalOpen] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAssetRegenerated = (newAsset: GeneratedAsset) => {
    setAsset(newAsset);
    if (onAssetUpdate) {
      onAssetUpdate(newAsset);
    }
    setRegenerateModalOpen(false);
  };

  if (!asset) {
    return (
      <div className="bg-white rounded-lg p-8 shadow-sm text-center">
        <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No video content available</p>
      </div>
    );
  }

  const script = asset.metadata?.script;

  return (
    <div className="space-y-8">
      {/* Video Player */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Video className="w-5 h-5 text-purple-600" />
            Promotional Video
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setRegenerateModalOpen(true)}
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

        <div className="relative bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            src={asset.url}
            className="w-full"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            controls
          />
          
          {/* Custom Play Button Overlay */}
          {!isPlaying && (
            <button
              onClick={handlePlayPause}
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
            >
              <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                <Play className="w-8 h-8 text-purple-600 ml-1" />
              </div>
            </button>
          )}
        </div>

        {/* Video Info */}
        <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
          <span>Duration: 5 seconds</span>
          <span>Format: MP4</span>
          <span>Aspect Ratio: 16:9</span>
        </div>
      </div>

      {/* Video Script */}
      {script && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Video Script
          </h3>
          
          <div className="space-y-4">
            {/* Scene Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2 text-purple-700">Hook (0-1s)</h4>
                <p className="text-sm text-gray-700">{script.hook}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2 text-blue-700">Problem (1-2s)</h4>
                <p className="text-sm text-gray-700">{script.problem_visualization}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2 text-green-700">Solution (2-3s)</h4>
                <p className="text-sm text-gray-700">{script.solution_reveal}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2 text-pink-700">Benefit (3-4s)</h4>
                <p className="text-sm text-gray-700">{script.benefit_demonstration}</p>
              </div>
            </div>

            {/* CTA */}
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium mb-2">Call to Action (4-5s)</h4>
              <p className="text-lg font-semibold text-purple-700">{script.cta}</p>
            </div>

            {/* Key Messages */}
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Text Overlays
              </h4>
              <div className="flex flex-wrap gap-2">
                {script.key_messages.map((message: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                    {message}
                  </span>
                ))}
              </div>
            </div>

            {/* Style Direction */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Palette className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Visual Style</h4>
                  <p className="text-sm text-gray-600 mt-1">{script.visual_directions}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Music className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Music Mood</h4>
                  <p className="text-sm text-gray-600 mt-1">{script.music_mood}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Distribution Tips */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-purple-600" />
          Video Distribution Strategy
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <Youtube className="w-6 h-6 text-red-600 mb-2" />
            <h4 className="font-medium mb-2">YouTube Shorts</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Upload as a Short</li>
              <li>• Add closed captions</li>
              <li>• Use trending audio</li>
              <li>• Include #Shorts</li>
            </ul>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <Instagram className="w-6 h-6 text-purple-600 mb-2" />
            <h4 className="font-medium mb-2">Instagram Reels</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Post as Reel</li>
              <li>• Add trending music</li>
              <li>• Use 3-5 hashtags</li>
              <li>• Share to Stories</li>
            </ul>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <Video className="w-6 h-6 text-blue-600 mb-2" />
            <h4 className="font-medium mb-2">Website Hero</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Autoplay muted</li>
              <li>• Add play button</li>
              <li>• Compress for web</li>
              <li>• Mobile fallback</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Video Specs */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Resolution</p>
            <p className="font-medium">1920 x 1080</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Frame Rate</p>
            <p className="font-medium">30 FPS</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Codec</p>
            <p className="font-medium">H.264</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Bitrate</p>
            <p className="font-medium">5 Mbps</p>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Pro tip:</strong> Create different aspect ratio versions (9:16 for Stories, 1:1 for feed posts) 
            to maximize reach across all platforms.
          </p>
        </div>
      </div>

      {/* Regenerate Modal */}
      {regenerateModalOpen && asset && (
        <RegenerateModal
          isOpen={regenerateModalOpen}
          onClose={() => setRegenerateModalOpen(false)}
          asset={asset}
          strategy={strategy}
          onSuccess={handleAssetRegenerated}
        />
      )}
    </div>
  );
}