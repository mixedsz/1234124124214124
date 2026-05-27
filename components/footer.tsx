'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useBasket } from '@/contexts/basket-context';
import { Globe } from 'lucide-react';
import { TebexLegalFooter } from '@/components/tebex-legal-footer';

interface FooterProps {
  storeName?: string;
  showCta?: boolean;
}

const LANGUAGES = [
  { code: 'en',    flag: '🇺🇸', label: 'English (US)' },
  { code: 'en-gb', flag: '🇬🇧', label: 'English (UK)' },
  { code: 'es',    flag: '🇪🇸', label: 'Spanish' },
  { code: 'fr',    flag: '🇫🇷', label: 'French' },
  { code: 'de',    flag: '🇩🇪', label: 'German' },
  { code: 'it',    flag: '🇮🇹', label: 'Italian' },
  { code: 'nl',    flag: '🇳🇱', label: 'Dutch' },
  { code: 'pl',    flag: '🇵🇱', label: 'Polish' },
  { code: 'pt-br', flag: '🇧🇷', label: 'Portuguese (Brazil)' },
  { code: 'pt-pt', flag: '🇵🇹', label: 'Portuguese (Portugal)' },
  { code: 'ru',    flag: '🇷🇺', label: 'Russian' },
  { code: 'uk',    flag: '🇺🇦', label: 'Ukrainian' },
  { code: 'tr',    flag: '🇹🇷', label: 'Turkish' },
  { code: 'zh-cn', flag: '🇨🇳', label: 'Chinese (Simplified)' },
  { code: 'zh-tw', flag: '🇹🇼', label: 'Chinese (Traditional)' },
  { code: 'ja',    flag: '🇯🇵', label: 'Japanese' },
  { code: 'ko',    flag: '🇰🇷', label: 'Korean' },
];

const GT_LANG: Record<string, string> = {
  'es': 'es', 'fr': 'fr', 'de': 'de', 'it': 'it',
  'nl': 'nl', 'pl': 'pl', 'pt-br': 'pt', 'pt-pt': 'pt',
  'ru': 'ru', 'uk': 'uk', 'tr': 'tr',
  'zh-cn': 'zh-CN', 'zh-tw': 'zh-TW', 'ja': 'ja', 'ko': 'ko',
};

function applyTranslation(code: string) {
  if (code === 'en' || code === 'en-gb') {
    document.cookie = 'googtrans=; path=/; max-age=0';
    document.cookie = `googtrans=; domain=.${location.hostname}; path=/; max-age=0`;
    window.location.reload();
    return;
  }
  const gtCode = GT_LANG[code] ?? code;
  const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
  if (select) {
    select.value = gtCode;
    select.dispatchEvent(new Event('change'));
  } else {
    document.cookie = `googtrans=/en/${gtCode}; path=/`;
    window.location.reload();
  }
}

export function Footer({ storeName = 'Flake Development', showCta = true }: FooterProps) {
  const { username } = useBasket();
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [ownerAvatar] = useState('https://cdn.discordapp.com/avatars/498945637539381252/9c2021803d4c9d6a007f91e31d3d6bfb.webp?size=128');
  const langDropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const stored = localStorage.getItem('tebex_language');
    if (stored) setSelectedLanguage(stored);
  }, []);

  const handleSetLanguage = (code: string) => {
    setSelectedLanguage(code);
    localStorage.setItem('tebex_language', code);
    setLangOpen(false);
    applyTranslation(code);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLang = LANGUAGES.find(l => l.code === selectedLanguage) ?? LANGUAGES[0];

  return (
    <footer className="bg-neutral-900 border-t border-neutral-800 overflow-hidden w-full max-w-full">
      {/* Support CTA Section */}
      {showCta && <div className="bg-neutral-900 py-16 overflow-hidden">
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
      </div>}

      {/* Main Footer */}
      <div className="py-12 border-t border-neutral-800 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1 overflow-hidden">
              <div className="mb-3 overflow-hidden max-w-full" style={{height: '46px', width: 'min(220px, 100%)'}}>
                <img
                  src="/fd-wordmark.png"
                  alt="Flake Development"
                  className="max-w-none"
                  style={{
                    width: '461px',
                    height: '307px',
                    marginLeft: '-113px',
                    marginTop: '-119px',
                  }}
                />
              </div>
              <p className="text-sm text-neutral-400 mb-4">
                The most popular scripts for your FiveM server.
              </p>

              {/* Language dropdown */}
              <div className="flex items-center gap-2 text-sm text-neutral-500 mt-2 relative" ref={langDropdownRef} translate="no">
                <span>Language:</span>
                <button
                  onClick={() => setLangOpen(o => !o)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-lg text-white text-sm font-bold transition"
                >
                  <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="text-base leading-none">{activeLang.flag}</span>
                  <span className="text-xs">{activeLang.code.toUpperCase()}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M6 9l6 6l6 -6"/>
                  </svg>
                </button>
                {langOpen && (
                  <div className="absolute bottom-full mb-1 left-0 bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl py-1 z-50 w-56 max-h-64 overflow-y-auto scrollbar-hide">
                    {LANGUAGES.map(l => (
                      <button
                        key={l.code}
                        onClick={() => handleSetLanguage(l.code)}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-700 transition text-left ${selectedLanguage === l.code ? 'text-blue-400' : 'text-neutral-300'}`}
                      >
                        <span>{l.flag}</span>
                        <span className="font-medium">{l.label}</span>
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
                <li><Link href="/scripts" className="text-sm text-neutral-400 hover:text-white transition">All Scripts</Link></li>
                <li><Link href="/subscription" className="text-sm text-neutral-400 hover:text-white transition">Subscription</Link></li>
                <li><Link href="/docs" className="text-sm text-neutral-400 hover:text-white transition">Documentation</Link></li>
                <li><Link href="/support" className="text-sm text-neutral-400 hover:text-white transition">Support</Link></li>
                <li><Link href="/about" className="text-sm text-neutral-400 hover:text-white transition">About</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-sm text-neutral-400 hover:text-white transition">Terms of Sale</Link></li>
                <li><Link href="/privacy" className="text-sm text-neutral-400 hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/refunds" className="text-sm text-neutral-400 hover:text-white transition">Refunds</Link></li>
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
                <li><Link href="/docs" className="text-sm text-neutral-400 hover:text-white transition">Documentation</Link></li>
                <li><Link href="/subscription" className="text-sm text-neutral-400 hover:text-white transition">Subscription Plans</Link></li>
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
            <div className="flex justify-center mt-6">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition">
                <img
                  src={ownerAvatar}
                  alt="flakedev"
                  className="w-7 h-7 rounded-lg flex-shrink-0 object-cover"
                />
                <div className="flex flex-col leading-none">
                  <span className="text-[9px] text-neutral-500 uppercase tracking-widest">Designed &amp; Built by</span>
                  <span className="text-xs font-bold text-white mt-0.5 tracking-wide">@flakedev</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tebex Legal Footer (required by Tebex Terms) */}
      <TebexLegalFooter />
    </footer>
  );
}
