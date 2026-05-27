import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });

const META_TITLE = 'Flake Development | QBCore, Qbox & ESX FiveM Scripts';
const META_DESC = 'Premium FiveM scripts trusted by Grizzley World, District 10, and hundreds of top servers. QBCore, Qbox & ESX compatible. Body bags, addiction systems, loading screens, black markets & more — instant Cfx.re delivery, free updates forever.';
const OG_DESC = 'The most popular premium scripts for your FiveM server by Flake Development. Compatible with QBCore, Qbox & ESX.';
const META_IMAGE = 'https://flakedev.com/fd.png';

export const metadata: Metadata = {
  metadataBase: new URL('https://flakedev.com'),
  title: {
    default: META_TITLE,
    template: '%s | Flake Development | QBCore, Qbox & ESX FiveM Scripts',
  },
  description: META_DESC,
  keywords: [
    // Core FiveM terms
    'FiveM scripts', 'FiveM RP scripts', 'FiveM roleplay scripts', 'FiveM resources',
    'FiveM mods', 'FiveM MLO', 'FiveM developer', 'FiveM development',
    'GTA V roleplay scripts', 'GTA RP scripts', 'GTAV FiveM',
    // Framework specific
    'QBCore scripts', 'QBCore resources', 'QBCore framework scripts', 'qb-core scripts',
    'ESX scripts', 'ESX resources', 'ESX framework scripts', 'es_extended scripts',
    'Qbox scripts', 'Qbox resources', 'Qbox framework',
    // Brand & trust
    'premium FiveM scripts', 'Flake Development', 'flakedev', 'Flake scripts',
    'Grizzley World scripts', 'District 10 scripts', 'Windy City scripts',
    // Product types
    'FiveM server scripts', 'cfx.re scripts', 'tebex FiveM',
    'FiveM body bag script', 'FiveM addiction script', 'FiveM drug system',
    'FiveM loading screen', 'FiveM drug script', 'FiveM smoking script',
    'FiveM black market', 'FiveM shop script', 'FiveM wearables script',
    'FiveM inventory script', 'FiveM job script', 'FiveM gang script',
    // Purchase intent
    'buy FiveM scripts', 'best FiveM scripts', 'free FiveM scripts',
    'cheap FiveM scripts', 'FiveM scripts for sale', 'download FiveM scripts',
    // Long-tail
    'FiveM roleplay server scripts', 'FiveM serious RP scripts',
    'FiveM scripts 2024', 'FiveM scripts 2025', 'FiveM scripts 2026',
    'how to install FiveM scripts', 'best QBCore scripts',
  ],
  authors: [{ name: 'Flake Development', url: 'https://flakedev.com' }],
  creator: 'Flake Development',
  publisher: 'Flake Development',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  alternates: {
    canonical: 'https://flakedev.com',
  },
  category: 'gaming',
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
    description: OG_DESC,
    images: [{ url: META_IMAGE, width: 800, height: 800, alt: 'Flake Development - Premium FiveM Scripts' }],
  },
  // Twitter / X card - 'summary' gives small thumbnail on right in Discord
  twitter: {
    card: 'summary',
    site: '@flakedevelopment',
    creator: '@flakedevelopment',
    title: META_TITLE,
    description: OG_DESC,
    images: [{ url: META_IMAGE, alt: 'Flake Development - Premium FiveM Scripts' }],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Flake Development',
              alternateName: ['FlakeDev', 'Flake Development FiveM', 'Flake Scripts'],
              url: 'https://flakedev.com',
              description: 'Premium FiveM scripts for QBCore, Qbox & ESX roleplay servers. Trusted by Grizzley World, District 10, and hundreds of top servers.',
              inLanguage: 'en-US',
              potentialAction: {
                '@type': 'SearchAction',
                target: { '@type': 'EntryPoint', urlTemplate: 'https://flakedev.com/scripts?search={search_term_string}' },
                'query-input': 'required name=search_term_string',
              },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'Organization',
              '@id': 'https://flakedev.com/#organization',
              name: 'Flake Development',
              alternateName: ['FlakeDev', 'Flake Scripts', 'Flake FiveM'],
              url: 'https://flakedev.com',
              logo: {
                '@type': 'ImageObject',
                url: 'https://flakedev.com/fd.png',
                width: 1340,
                height: 893,
              },
              image: 'https://flakedev.com/fd.png',
              description: 'Premium FiveM scripts and resources for QBCore, Qbox & ESX frameworks. Instant Cfx.re escrow delivery with free lifetime updates.',
              foundingDate: '2020',
              sameAs: [
                'https://www.youtube.com/@flakedevelopment',
                'https://discord.gg/flakedev',
                'https://flekdev.tebex.io',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer support',
                url: 'https://discord.gg/flakedev',
                availableLanguage: 'English',
              },
              knowsAbout: [
                'FiveM Scripts',
                'FiveM Development',
                'QBCore Framework',
                'ESX Framework',
                'Qbox Framework',
                'GTA V Roleplay',
                'Cfx.re Resources',
                'Lua Scripting',
              ],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Flake Development FiveM Scripts',
              applicationCategory: 'GameApplication',
              operatingSystem: 'FiveM Server',
              offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'USD',
                lowPrice: '0',
                highPrice: '50',
                offerCount: '20+',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                ratingCount: '500',
                bestRating: '5',
                worstRating: '1',
              },
              description: 'Premium FiveM scripts compatible with QBCore, Qbox & ESX frameworks. Body bags, addiction systems, loading screens, black markets, and more.',
              brand: {
                '@type': 'Brand',
                name: 'Flake Development',
              },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'What FiveM frameworks do Flake Development scripts support?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'All Flake Development scripts are compatible with QBCore, Qbox, and ESX frameworks. Most scripts auto-detect your framework and work out of the box.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How do I get my scripts after purchase?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'All scripts are delivered instantly via Cfx.re escrow system. After purchase, you can access and download your scripts directly through your Cfx.re keymaster.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Do Flake Development scripts include free updates?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! All Flake Development scripts include free lifetime updates. When we release new features or bug fixes, you get them automatically.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Which servers use Flake Development scripts?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Our scripts are trusted by hundreds of top FiveM servers including Grizzley World, District 10, Windy City, and many more popular roleplay communities.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Are there free FiveM scripts available?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, Flake Development offers several free scripts alongside our premium collection. Check our scripts page to see all available free resources.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Can I buy an unencrypted version of the scripts?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! We offer fully unencrypted (source available) versions of our scripts for purchase. Contact us through Discord or email to inquire about unencrypted versions and pricing.',
                  },
                },
              ],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://flakedev.com',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'FiveM Scripts',
                  item: 'https://flakedev.com/scripts',
                },
              ],
            },
          ]) }}
        />
        <div id="google_translate_element" style={{ position: 'fixed', top: 0, left: '-9999px', height: 0, overflow: 'hidden' }} />
        <Providers>
          {children}
        </Providers>
        <Script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" />
      </body>
    </html>
  )
}
