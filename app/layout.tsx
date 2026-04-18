import type { Metadata, Viewport } from 'next';
import './globals.css';
import Nav from '../components/Nav';
import ThemeBoot from '../components/ThemeBoot';

export const metadata: Metadata = {
  title: 'Stack — Peptide Protocol Tracker',
  description: 'Track your peptide protocols and compare outcomes.',
  manifest: '/manifest.json',
  applicationName: 'Stack',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Stack',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Stack" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-screen bg-bg text-ink">
        <ThemeBoot />
        <div className="mx-auto flex min-h-screen max-w-md flex-col safe-top safe-bottom">
          <main className="flex-1 px-4 pb-24 pt-4">{children}</main>
          <Nav />
        </div>
      </body>
    </html>
  );
}
