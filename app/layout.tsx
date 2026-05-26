import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });

const META_TITLE = 'Flake Development | QBCore, Qbox & ESX FiveM Scripts';
const META_DESC = 'The most popular premium scripts for your FiveM server by Flake Development. Compatible with QBCore, Qbox & ESX.';
const META_IMAGE = '/fd-logo.jpg';

export const metadata: Metadata = {
  metadataBase: new URL('https://flakedev.com'),
  title: {
    default: META_TITLE,
    template: '%s | Flake Development',
  },
  description: META_DESC,
  keywords: ['FiveM scripts', 'QBCore scripts', 'ESX scripts', 'Qbox scripts', 'FiveM server', 'premium FiveM', 'Flake Development'],
  authors: [{ name: 'Flake Development', url: 'https://flakedev.com' }],
  creator: 'Flake Development',
  publisher: 'Flake Development',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: {
    icon: [
      { url: '/fd-logo-clean.svg', type: 'image/svg+xml' },
      { url: '/fd-favicon.png', type: 'image/png' },
    ],
    apple: '/fd-favicon.png',
  },
  // Open Graph — used by Discord, Facebook, LinkedIn, Slack, iMessage
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://flakedev.com',
    siteName: 'Flake Development',
    title: META_TITLE,
    description: META_DESC,
    images: [{ url: META_IMAGE, width: 512, height: 512, alt: 'Flake Development logo' }],
  },
  // Twitter / X card
  twitter: {
    card: 'summary',
    site: '@flakedevelopment',
    creator: '@flakedevelopment',
    title: META_TITLE,
    description: META_DESC,
    images: [{ url: META_IMAGE, alt: 'Flake Development logo' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-black">
      <head>
        <script src="https://js.tebex.io/v/1.js" defer></script>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var titleEl = document.querySelector('title');
            var origTitle = titleEl ? titleEl.textContent : '';
            var restoring = false;
            if (titleEl) {
              titleEl.setAttribute('translate', 'no');
              new MutationObserver(function() {
                if (restoring) return;
                if (document.title !== origTitle) {
                  restoring = true;
                  document.title = origTitle;
                  restoring = false;
                }
              }).observe(titleEl, { childList: true, characterData: true, subtree: true });
            }
            // Capture-phase intercept: fires before GT's own element-level listeners.
            // Stops GT from ever adding the hover highlight to translated <font> elements.
            document.addEventListener('mouseover', function(e) {
              if (e.target && e.target.tagName === 'FONT') {
                e.stopImmediatePropagation();
              }
            }, true);
          })();
          window.googleTranslateElementInit = function() {
            new google.translate.TranslateElement({ pageLanguage: 'en', autoDisplay: false }, 'google_translate_element');
          };
        `}} />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-black text-white min-h-screen`}>
        <div id="google_translate_element" style={{ position: 'fixed', top: 0, left: '-9999px', height: 0, overflow: 'hidden' }} />
        <Providers>
          {children}
        </Providers>
        <Script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" />
      </body>
    </html>
  )
}
