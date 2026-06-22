import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rinneagan — Developer',
  description: 'Full-stack developer building thoughtful software.',
  keywords: ['developer', 'portfolio', 'full-stack', 'react', 'next.js', 'typescript'],
  authors: [{ name: 'Rinneagan' }],
  openGraph: {
    title: 'Rinneagan — Developer',
    description: 'Full-stack developer building thoughtful software.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

