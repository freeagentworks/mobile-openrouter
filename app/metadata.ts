import { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://your-domain.com'), // Change this to your actual domain
  title: 'OpenRouter AI Chat',
  description: 'A modern AI chat application powered by OpenRouter API',
  keywords: ['AI', 'Chat', 'OpenRouter', 'LLM', 'GPT', 'Claude', 'Gemini'],
  authors: [{ name: 'OpenRouter AI Chat' }],
  creator: 'OpenRouter AI Chat',
  publisher: 'OpenRouter AI Chat',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/mobileopenrouter.png', sizes: '32x32', type: 'image/png' },
      { url: '/mobileopenrouter.png', sizes: '16x16', type: 'image/png' },
      { url: '/mobileopenrouter.png', sizes: '192x192', type: 'image/png' }
    ],
    shortcut: '/mobileopenrouter.png',
    apple: [
      { url: '/mobileopenrouter.png', sizes: '180x180', type: 'image/png' }
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://your-domain.com',
    title: 'OpenRouter AI Chat',
    description: 'A modern AI chat application powered by OpenRouter API',
    siteName: 'OpenRouter AI Chat',
    images: [
      {
        url: '/mobileopenrouter.png',
        width: 772,
        height: 760,
        alt: 'OpenRouter AI Chat Logo',
        type: 'image/png',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenRouter AI Chat',
    description: 'A modern AI chat application powered by OpenRouter API',
    images: ['/mobileopenrouter.png'],
    creator: '@openrouter',
    site: '@openrouter',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#00D4D4',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};
