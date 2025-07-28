'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2 } from 'lucide-react';
import { useGeneration } from '@/components/generation-context';
import { BrandSpinner } from '@/components/brand-generator';

export default function MinimizedGenerationIndicator() {
  const { state, restore } = useGeneration();

  if (state.status !== 'in_progress' || !state.minimized) {
    return null;
  }

  const progress = state.progress?.overall_progress ?? 0;
  const companyName = state.result?.strategy?.company_name ??
    state.progress?.result?.strategy?.company_name ??
    'Generating brand…';

  return (
    <AnimatePresence>
      <motion.div
        key="generation-indicator"
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        transition={{ duration: 0.25 }}
        onClick={restore}
        className="
          fixed top-4 right-4 z-[1000] cursor-pointer
          backdrop-blur-lg bg-white/30 dark:bg-gray-800/30
          border border-white/40 dark:border-gray-700/40
          shadow-xl rounded-xl px-4 py-3 flex items-center gap-3
          hover:bg-white/40 dark:hover:bg-gray-800/40
        "
      >
        {/* Spinner */}
        <BrandSpinner size={32} />

        {/* Text */}
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-1">
            {companyName}
          </span>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {progress}% complete
          </span>
        </div>

        {/* Restore Icon */}
        <Maximize2 className="w-4 h-4 text-gray-700 dark:text-gray-300 ml-1" />
      </motion.div>
    </AnimatePresence>
  );
}