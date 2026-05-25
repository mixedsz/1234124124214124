import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });

export const metadata: Metadata = {
  title: {
    default: 'Flake Development | QBCore, Qbox & ESX FiveM Scripts',
    template: '%s | Flake Development | QBCore, Qbox & ESX FiveM Scripts',
  },
  description: 'The most popular premium scripts for your FiveM server by Flake Development. Compatible with QBCore, Qbox & ESX.',
  icons: {
    icon: [
      { url: '/fd-logo-clean.svg', type: 'image/svg+xml' },
      { url: '/fd-favicon.png', type: 'image/png' },
    ],
    apple: '/fd-favicon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
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
          // Prevent Google Translate from translating the page title
          (function() {
            var t = document.querySelector('title');
            if (t) t.setAttribute('translate', 'no');
          })();

          // Nuke the GT "Original text" balloon as soon as it's added to the DOM
          (function() {
            var observer = new MutationObserver(function(mutations) {
              mutations.forEach(function(m) {
                m.addedNodes.forEach(function(node) {
                  if (node.nodeType !== 1) return;
                  var el = node;
                  var id = el.id || '';
                  var cls = (el.className && typeof el.className === 'string') ? el.className : '';
                  if (
                    id === 'goog-gt-tt' ||
                    cls.indexOf('goog-te-balloon') !== -1 ||
                    cls.indexOf('goog-tooltip') !== -1 ||
                    cls.indexOf('goog-te-bubble') !== -1
                  ) {
                    el.style.cssText = 'display:none!important';
                  }
                  // Also check children (GT sometimes nests inside a wrapper)
                  var inner = el.querySelectorAll && el.querySelectorAll('#goog-gt-tt, .goog-te-balloon-frame, .goog-tooltip, .goog-te-bubble');
                  if (inner) inner.forEach(function(n) { n.style.cssText = 'display:none!important'; });
                });
              });
            });
            document.addEventListener('DOMContentLoaded', function() {
              observer.observe(document.body, { childList: true, subtree: true });
            });
          })();

          window.googleTranslateElementInit = function() {
            new google.translate.TranslateElement({
              pageLanguage: 'en',
              autoDisplay: false,
            }, 'google_translate_element');
          };
        `}} />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-black text-white min-h-screen`}>
        <div id="google_translate_element" style={{ position: 'fixed', top: 0, left: '-9999px', height: 0, overflow: 'hidden' }} />
        <Providers>
          {children}
        </Providers>
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
