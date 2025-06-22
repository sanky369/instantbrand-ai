import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'InstantBrand AI - Transform Your Startup Idea Into a Complete Brand Package',
  description: 'AI-powered creative studio that transforms startup ideas into complete brand packages in 60 seconds. Get logos, website mockups, social posts, and promo videos instantly.',
  keywords: 'AI branding, startup branding, logo generator, brand package, AI design, startup marketing',
  openGraph: {
    title: 'InstantBrand AI - From Idea to Brand in 60 Seconds',
    description: 'Transform your startup idea into a complete brand package with AI-powered creative agents.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}