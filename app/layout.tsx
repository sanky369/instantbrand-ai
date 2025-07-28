'use client';

import React from 'react';
import './globals.css'; // keep global styles if it exists – adjust/remove if not present
import { GenerationProvider } from '@/components/generation-context';
import MinimizedGenerationIndicator from '@/components/minimized-generation-indicator';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GenerationProvider>
          {children}
          {/* Floating progress indicator visible while generation is minimised */}
          <MinimizedGenerationIndicator />
        </GenerationProvider>
      </body>
    </html>
  );
}