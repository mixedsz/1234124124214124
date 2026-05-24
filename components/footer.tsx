'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useCurrency } from '@/contexts/currency-context';
import { useBasket } from '@/contexts/basket-context';

interface FooterProps {
  storeName?: string;
}

const currencies = [
  { code: 'USD', flag: '🇺🇸', label: 'US Dollar' },
  { code: 'GBP', flag: '🇬🇧', label: 'British Pound' },
  { code: 'EUR', flag: '🇪🇺', label: 'Euro' },
  { code: 'AUD', flag: '🇦🇺', label: 'Australian Dollar' },
  { code: 'CAD', flag: '🇨🇦', label: 'Canadian Dollar' },
  { code: 'PLN', flag: '🇵🇱', label: 'Polish Złoty' },
];

export function Footer({ storeName = 'Flake Development' }: FooterProps) {
  const { currency: selectedCurrency, setCurrency } = useCurrency();
  const { username } = useBasket();
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCurrencyOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <footer className="bg-neutral-900 border-t border-neutral-800">
      {/* Support CTA Section */}
      <div className="bg-neutral-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-12 px-10 rounded-3xl bg-gradient-to-br from-blue-950/60 to-neutral-900 border border-blue-900/20 text-center">
            <div className="bg-white/5 rounded-full relative w-[70px] h-[70px] p-[5px] mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500">
                <path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm0 13a1 1 0 0 0 -.993 .883l-.007 .117l.007 .127a1 1 0 0 0 1.986 0l.007 -.117l-.007 -.127a1 1 0 0 0 -.993 -.883zm1.368 -6.673a2.98 2.98 0 0 0 -3.631 .728a1 1 0 0 0 1.44 1.383l.171 -.18a.98 .98 0 0 1 1.11 -.15a1 1 0 0 1 -.34 1.886l-.232 .012a1 1 0 0 0 .111 1.994a3 3 0 0 0 1.371 -5.673z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-white mb-5">Got a Question?</h2>
            <p className="text-neutral-400 mb-8 max-w-lg text-lg">
              Our support center offers FAQs, links to helpful guides, and direct contact options if you need further assistance.
            </p>
            <Link
              href="/support"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-neutral-100 transition"
            >
              Get Support
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12 border-t border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="mb-3 overflow-hidden" style={{height: '46px', width: '220px'}}>
                <img
                  src="/fd-wordmark.png"
                  alt="Flake Development"
                  style={{
                    width: '461px',
                    height: '307px',
                    maxWidth: 'none',
                    marginLeft: '-113px',
                    marginTop: '-119px',
                  }}
                />
              </div>
              <p className="text-sm text-neutral-400 mb-4">
                The most popular scripts for your FiveM server.
              </p>

              {/* Currency dropdown */}
              <div className="flex items-center gap-2 text-sm text-neutral-500 mt-2 relative" ref={dropdownRef}>
                <span>Currency:</span>
                <button
                  onClick={() => setCurrencyOpen(o => !o)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-lg text-white text-sm font-bold transition"
                >
                  <span className="text-base leading-none">{currencies.find(c => c.code === selectedCurrency)?.flag}</span>
                  <span>{selectedCurrency}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M6 9l6 6l6 -6"/>
                  </svg>
                </button>
                {currencyOpen && (
                  <div className="absolute bottom-full mb-1 left-0 bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl py-1 z-50 w-48">
                    {currencies.map(c => (
                      <button
                        key={c.code}
                        onClick={() => { setCurrency(c.code); setCurrencyOpen(false); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-700 transition text-left ${selectedCurrency === c.code ? 'text-blue-400' : 'text-neutral-300'}`}
                      >
                        <span>{c.flag}</span>
                        <span className="font-medium">{c.code}</span>
                        <span className="text-neutral-500 text-xs ml-auto">{c.label}</span>
                      </button>
                    ))}
                  </div>
                )}
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
                  <Link href="/subscription" className="text-sm text-neutral-400 hover:text-white transition">
                    Subscription
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
              </ul>
            </div>

            {/* Socials */}
            <div>
              <h3 className="font-semibold text-white mb-4">Socials</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://discord.gg/flakedev" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-400 hover:text-white transition">
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    href={username ? `https://forum.cfx.re/u/${username}` : 'https://cfx.re/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-400 hover:text-white transition"
                  >
                    Cfx.re Profile
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/@flakedevelopment/videos" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-400 hover:text-white transition">
                    YouTube
                  </a>
                </li>
              </ul>
            </div>

            {/* More */}
            <div>
              <h3 className="font-semibold text-white mb-4">More</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/docs" className="text-sm text-neutral-400 hover:text-white transition">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/subscription" className="text-sm text-neutral-400 hover:text-white transition">
                    Subscription Plans
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 pt-8 border-t border-neutral-800">
            <p className="text-xs text-neutral-500 text-center">
              Copyright © 2026 Flake Development. Not affiliated with or endorsed by Rockstar North, Take-Two Interactive or other rights holders. FiveM® is a copyright and registered trademark of Take-Two Interactive Software, Inc.
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
