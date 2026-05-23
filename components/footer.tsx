import Link from 'next/link';

interface FooterProps {
  storeName?: string;
}

export function Footer({ storeName = 'Store' }: FooterProps) {
  return (
    <footer className="bg-black border-t border-neutral-800">
      {/* Support CTA Section */}
      <div className="bg-neutral-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/20 text-orange-500 mb-4">
            <span className="text-2xl">?</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Got a Question?</h2>
          <p className="text-neutral-400 mb-6 max-w-lg mx-auto">
            Our support center offers FAQs, links to helpful guides, and direct contact options if you need further assistance.
          </p>
          <Link
            href="/support"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-neutral-200 transition"
          >
            Get Support
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <p className="text-xs text-neutral-500 mb-2">Powered by</p>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded bg-orange-500 flex items-center justify-center text-white font-bold">
                  {storeName.charAt(0)}
                </div>
              </div>
              <p className="text-sm text-neutral-400 mb-4">
                The most popular vehicle scripts for your FiveM server.
              </p>
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <span>Currency:</span>
                <span className="px-2 py-1 bg-neutral-800 rounded text-white text-xs">GBP</span>
              </div>
            </div>

            {/* Pages */}
            <div>
              <h3 className="font-semibold text-white mb-4">Pages</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/store" className="text-sm text-neutral-400 hover:text-white transition">
                    All Scripts
                  </Link>
                </li>
                <li>
                  <Link href="/gift-cards" className="text-sm text-neutral-400 hover:text-white transition">
                    Gift Cards
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="text-sm text-neutral-400 hover:text-white transition">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-sm text-neutral-400 hover:text-white transition">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-sm text-neutral-400 hover:text-white transition">
                    About
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-sm text-neutral-400 hover:text-white transition">
                    Terms of Sale
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm text-neutral-400 hover:text-white transition">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/refunds" className="text-sm text-neutral-400 hover:text-white transition">
                    Refunds
                  </Link>
                </li>
                <li>
                  <Link href="/impressum" className="text-sm text-neutral-400 hover:text-white transition">
                    Tebex Impressum
                  </Link>
                </li>
              </ul>
            </div>

            {/* Socials */}
            <div>
              <h3 className="font-semibold text-white mb-4">Socials</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://discord.gg/" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-400 hover:text-white transition">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="https://cfx.re/" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-400 hover:text-white transition">
                    Cfx.re Profile
                  </a>
                </li>
                <li>
                  <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-400 hover:text-white transition">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-400 hover:text-white transition">
                    YouTube
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-400 hover:text-white transition">
                    X (formerly Twitter)
                  </a>
                </li>
              </ul>
            </div>

            {/* More */}
            <div>
              <h3 className="font-semibold text-white mb-4">More</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-sm text-neutral-400 hover:text-white transition">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/themes" className="text-sm text-neutral-400 hover:text-white transition">
                    HUD Themes
                  </Link>
                </li>
                <li>
                  <Link href="/configurator" className="text-sm text-neutral-400 hover:text-white transition">
                    Configurator
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 pt-8 border-t border-neutral-800">
            <p className="text-xs text-neutral-500 text-center">
              Copyright © 2026 {storeName}. Not affiliated with or endorsed by Rockstar North, Take-Two Interactive or other rights holders. FiveM® is a copyright and registered trademark of Take-Two Interactive Software, Inc.
            </p>
            <p className="text-xs text-neutral-500 text-center mt-2">
              Our checkout process is owned & operated by Tebex Limited, who handle product fulfillment, billing support and refunds. Displayed prices may be estimates using a conversion rate; updated prices will be shown in your checkout before purchase.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
