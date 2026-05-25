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

          // Block GT "Original text" balloon (#goog-gt-tt).
          // GT pre-creates the element hidden then shows it by mutating its inline style,
          // so we lock it by watching its style attribute directly.
          (function() {
            function lockGTTooltip(el) {
              el.style.cssText = 'display:none!important';
              new MutationObserver(function() {
                el.style.cssText = 'display:none!important';
              }).observe(el, { attributes: true, attributeFilter: ['style'] });
            }
            function findAndLock() {
              var el = document.getElementById('goog-gt-tt');
              if (el) { lockGTTooltip(el); return; }
              var bodyObs = new MutationObserver(function(_, obs) {
                var found = document.getElementById('goog-gt-tt');
                if (found) { lockGTTooltip(found); obs.disconnect(); }
              });
              bodyObs.observe(document.body, { childList: true, subtree: true });
            }
            if (document.body) { findAndLock(); }
            else { document.addEventListener('DOMContentLoaded', findAndLock); }
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
