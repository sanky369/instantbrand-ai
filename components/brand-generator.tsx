'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Palette, 
  Share2, 
  Video, 
  Zap, 
  Sparkles, 
  CheckCircle,
  X,
  Clock,
  AlertCircle,
  Rocket
} from 'lucide-react';
import { brandAPI } from '@/lib/api';
import { useGeneration } from '@/components/generation-context';
import { ProgressUpdate } from '@/lib/types';

const AI_AGENTS = [
  { name: 'Brand Director', icon: Brain, description: 'Analyzing startup concept...', color: 'text-purple-500', bgColor: 'bg-purple-500' },
  { name: 'Visual Creator', icon: Palette, description: 'Generating logo & mockups...', color: 'text-blue-500', bgColor: 'bg-blue-500' },
  { name: 'Social Media Agent', icon: Share2, description: 'Creating social content...', color: 'text-green-500', bgColor: 'bg-green-500' },
  { name: 'Video Creator', icon: Video, description: 'Producing promo video...', color: 'text-red-500', bgColor: 'bg-red-500' }
];

// Enhanced loading spinner
export const BrandSpinner = ({ size = 40 }: { size?: number }) => (
  <div className="flex items-center justify-center">
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
    >
      <motion.div
        className="absolute inset-0 border-4 border-purple-200 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-0 border-4 border-transparent border-t-purple-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
        animate={{ scale: [1, 0.8, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  </div>
);

export default function BrandGenerator() {
  const { state, minimize } = useGeneration();
  const progress = state.progress;
  const error = state.error;

  // Helper to get current agent progress from context state
  const getCurrentAgentProgress = () => {
    if (!progress) return null;
    return progress.agents.find((agent) => agent.status === 'in_progress');
  };

  const getAgentByName = (name: string) => {
    return AI_AGENTS.find(agent => agent.name === name) || AI_AGENTS[0];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={minimize}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Creating Your Brand Package</h2>
              <p className="opacity-90">
                AI agents are working together to create your complete brand identity
              </p>
            </div>
            <button
              onClick={minimize}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {state.status === 'idle' && (
            <div className="text-center py-12">
              <BrandSpinner size={60} />
              <p className="mt-4 text-gray-600">Connecting to AI agents...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Generation Failed</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={minimize}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {state.status === 'in_progress' && !error && (
            <div className="space-y-8">
              {/* Overall Progress */}
              <div className="text-center">
                <div className="mb-4">
                  <BrandSpinner size={80} />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {progress?.message || 'Initializing AI agents...'}
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <motion.div
                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress?.overall_progress || 0}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-gray-600">
                  {progress?.overall_progress || 0}% complete • {getCurrentAgentProgress()?.agent_name || 'Starting...'}
                </p>
              </div>

              {/* Agent Progress */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {AI_AGENTS.map((agent, index) => {
                  const agentProgress = progress?.agents.find(a => a.agent_name === agent.name);
                  const Icon = agent.icon;
                  
                  return (
                    <motion.div
                      key={agent.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`
                        p-6 rounded-xl border-2 transition-all duration-500
                        ${agentProgress?.status === 'completed' 
                          ? 'border-green-200 bg-green-50' 
                          : agentProgress?.status === 'in_progress'
                          ? 'border-purple-200 bg-purple-50 shadow-lg'
                          : agentProgress?.status === 'failed'
                          ? 'border-red-200 bg-red-50'
                          : 'border-gray-200 bg-gray-50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <motion.div
                          className={`
                            w-12 h-12 rounded-full flex items-center justify-center text-white
                            ${agent.bgColor}
                          `}
                          animate={agentProgress?.status === 'in_progress' ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Icon className="w-6 h-6" />
                        </motion.div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{agent.name}</h4>
                          <p className="text-sm text-gray-600">
                            {agentProgress?.message || 'Waiting...'}
                          </p>
                        </div>
                        {agentProgress?.status === 'completed' && (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        )}
                      </div>
                      
                      {/* Agent Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full ${
                            agentProgress?.status === 'completed' 
                              ? 'bg-green-500' 
                              : agentProgress?.status === 'in_progress'
                              ? 'bg-purple-500'
                              : agentProgress?.status === 'failed'
                              ? 'bg-red-500'
                              : 'bg-gray-300'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${agentProgress?.progress || 0}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {agentProgress?.progress || 0}% complete
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Status Messages */}
              <div className="text-center">
                <p className="text-gray-600">
                  Estimated time remaining: {Math.max(1, Math.ceil((100 - (progress?.overall_progress || 0)) / 2))} minutes
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}