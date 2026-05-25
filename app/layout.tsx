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
          (function() {
            document.querySelector('title')?.setAttribute('translate', 'no');
            document.addEventListener('mouseover', function(e) {
              var el = e.target;
              if (el && el.classList && el.classList.contains('goog-text-highlight')) {
                el.style.setProperty('background-color', 'transparent', 'important');
                el.style.setProperty('box-shadow', 'none', 'important');
              }
            });
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
