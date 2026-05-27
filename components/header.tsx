'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, ShoppingCart, ChevronDown, LogOut, User, Loader2, Package } from 'lucide-react';
import { useBasket } from '@/contexts/basket-context';
import { useCurrency } from '@/contexts/currency-context';
import { createBasket, getAuthUrl } from '@/lib/tebex';

const BASKET_KEY = 'tebex_basket_ident';
const DISCORD_SERVER_ID = '1056710846938361976'; // flakedev Discord server ID

declare global {
  interface Window {
    Tebex?: {
      checkout: { init: (c: { ident: string }) => void; launch: () => void; on: (e: string, cb: (d?: unknown) => void) => void; close: () => void; };
      portal?: { init: (c: { token: string; theme?: string; colors?: { name: string; color: string }[] }) => void; launch: () => void; };
    };
  }
}

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
  </svg>
);

const CURRENCIES = [
  { code: 'USD', flag: '🇺🇸', label: 'US Dollar' },
  { code: 'EUR', flag: '🇪🇺', label: 'Euro' },
  { code: 'GBP', flag: '🇬🇧', label: 'British Pound' },
  { code: 'CAD', flag: '🇨🇦', label: 'Canadian Dollar' },
  { code: 'AUD', flag: '🇦🇺', label: 'Australian Dollar' },
  { code: 'NZD', flag: '🇳🇿', label: 'NZ Dollar' },
  { code: 'CHF', flag: '🇨🇭', label: 'Swiss Franc' },
  { code: 'SEK', flag: '🇸🇪', label: 'Swedish Krona' },
  { code: 'NOK', flag: '🇳🇴', label: 'Norwegian Krone' },
  { code: 'DKK', flag: '🇩🇰', label: 'Danish Krone' },
  { code: 'PLN', flag: '🇵🇱', label: 'Polish Złoty' },
  { code: 'BRL', flag: '🇧🇷', label: 'Brazilian Real' },
  { code: 'MXN', flag: '🇲🇽', label: 'Mexican Peso' },
  { code: 'JPY', flag: '🇯🇵', label: 'Japanese Yen' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [discordHover, setDiscordHover] = useState(false);
  const [discordMembers, setDiscordMembers] = useState<number | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  const { itemCount, isAuthenticated, username, loading } = useBasket();
  const { currency, setCurrency } = useCurrency();

  const activeCurrency = CURRENCIES.find(c => c.code === currency) ?? CURRENCIES[0];

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Fetch Discord member count
  useEffect(() => {
    fetch(`https://discord.com/api/v9/invites/flakedev?with_counts=true`)
      .then(r => r.json())
      .then(data => {
        if (data.approximate_member_count) {
          setDiscordMembers(data.approximate_member_count);
        }
      })
      .catch(() => {});
  }, []);

  // Avatar with localStorage caching — no flicker on navigation
  useEffect(() => {
    if (!username) { setAvatarUrl(null); return; }
    const cacheKey = `fivem_avatar_${username}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) { setAvatarUrl(cached); return; }
    fetch(`/api/fivem-avatar?username=${encodeURIComponent(username)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.url) { setAvatarUrl(d.url); localStorage.setItem(cacheKey, d.url); }
        else setAvatarUrl(null);
      })
      .catch(() => setAvatarUrl(null));
  }, [username]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setCurrencyOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFiveMLogin = async () => {
    setLoginLoading(true);
    try {
      let ident = localStorage.getItem(BASKET_KEY);
      if (!ident) {
        const origin = window.location.origin;
        const b = await createBasket(`${origin}/cart`, `${origin}/checkout-complete`);
        if (!b) throw new Error('Could not create session');
        ident = b.ident;
        localStorage.setItem(BASKET_KEY, ident);
      }
      // Use /scripts without query params - Tebex will add its own success indicator
      const returnUrl = `${window.location.origin}/scripts`;
      const authUrl = await getAuthUrl(ident, returnUrl);
      if (!authUrl) throw new Error('Could not get auth URL');
      window.location.replace(authUrl);
    } catch {
      setLoginLoading(false);
    }
  };

  const handleOpenPortal = () => {
    setProfileOpen(false);
    if (window.Tebex?.portal) {
      window.Tebex.portal.init({
        token: process.env.NEXT_PUBLIC_TEBEX_PUBLIC_TOKEN || '',
        theme: 'dark',
        colors: [{ name: 'primary', color: '#3B82F6' }],
      });
      window.Tebex.portal.launch();
    } else {
      window.open('https://checkout.tebex.io/account', '_blank');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(BASKET_KEY);
    window.location.href = '/scripts';
  };

  const showProfile = !loading && isAuthenticated && username;

  return (
    <header className="sticky top-0 z-50 bg-neutral-900 border-b border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/fd-square.png" alt="Flake Development" width={40} height={40} className="rounded-sm" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/subscription" className="text-sm font-medium text-neutral-300 hover:text-white transition">Subscription</Link>
            <Link href="/scripts" className="text-sm font-medium text-neutral-300 hover:text-white transition">Scripts</Link>
            <Link href="/docs" className="text-sm font-medium text-neutral-300 hover:text-white transition">Docs</Link>
            <Link href="/support" className="text-sm font-medium text-neutral-300 hover:text-white transition">Support</Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">

            {/* Currency selector */}
            <div className="relative hidden sm:block" ref={currencyRef} translate="no">
              <button
                onClick={() => setCurrencyOpen(o => !o)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition text-sm"
                title="Select currency"
              >
                <span className="text-base leading-none">{activeCurrency.flag}</span>
                <span className="font-medium text-xs">{activeCurrency.code}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${currencyOpen ? 'rotate-180' : ''}`} />
              </button>
              {currencyOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl py-1 z-50 max-h-72 overflow-y-auto scrollbar-hide">
                  {CURRENCIES.map(c => (
                    <button
                      key={c.code}
                      onClick={() => { setCurrency(c.code); setCurrencyOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-neutral-700 transition text-left ${currency === c.code ? 'text-blue-400' : 'text-neutral-300'}`}
                    >
                      <span className="text-base leading-none">{c.flag}</span>
                      <span className="font-semibold">{c.code}</span>
                      <span className="text-neutral-500 text-xs ml-auto">{c.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Discord */}
            <div className="relative hidden sm:block">
              <a
                href="https://discord.gg/flakedev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex p-2 text-neutral-400 hover:text-[#5865F2] transition"
                onMouseEnter={() => setDiscordHover(true)}
                onMouseLeave={() => setDiscordHover(false)}
              >
                <DiscordIcon className="w-5 h-5" />
              </a>
              {discordHover && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-[#5865F2] rounded-lg shadow-xl whitespace-nowrap z-50 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-white text-xs font-medium">
                      {discordMembers ? `${discordMembers.toLocaleString()} members` : 'Join Discord'}
                    </span>
                  </div>
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#5865F2] rotate-45" />
                </div>
              )}
            </div>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-neutral-300 hover:text-white transition">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold bg-blue-600 text-white rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Profile or Login Button */}
            {loading ? (
              <div className="hidden lg:block w-32 h-9 bg-neutral-800 rounded-lg animate-pulse" />
            ) : showProfile ? (
              <div className="relative hidden lg:block" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium transition"
                >
                  <div className="w-7 h-7 rounded-full bg-neutral-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={username ?? ''} className="w-full h-full object-cover" onError={() => setAvatarUrl(null)} />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <span>{username}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-neutral-800 border border-neutral-700 shadow-xl overflow-hidden">
                    <div className="py-2">
                      <button
                        onClick={handleOpenPortal}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white transition w-full text-left"
                      >
                        <Package className="w-4 h-4" />
                        Manage Orders &amp; Subscriptions
                      </button>
                      <a
                        href="https://discord.gg/flakedev"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white transition"
                      >
                        <DiscordIcon className="w-4 h-4" />
                        Connect with Discord
                      </a>
                      <div className="my-2 border-t border-neutral-700" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-neutral-700 hover:text-red-300 transition w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleFiveMLogin}
                disabled={loginLoading}
                className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-medium transition"
              >
                {loginLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                  </svg>
                )}
                {loginLoading ? 'Connecting...' : 'Login with FiveM'}
              </button>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 text-neutral-300 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-neutral-800">
            <nav className="flex flex-col gap-4">
              <Link href="/subscription" className="text-sm font-medium text-neutral-300 hover:text-white transition" onClick={() => setMobileMenuOpen(false)}>Subscription</Link>
              <Link href="/scripts" className="text-sm font-medium text-neutral-300 hover:text-white transition" onClick={() => setMobileMenuOpen(false)}>Scripts</Link>
              <Link href="/docs" className="text-sm font-medium text-neutral-300 hover:text-white transition" onClick={() => setMobileMenuOpen(false)}>Docs</Link>
              <Link href="/support" className="text-sm font-medium text-neutral-300 hover:text-white transition" onClick={() => setMobileMenuOpen(false)}>Support</Link>

              {/* Mobile currency */}
              <div className="pt-2 border-t border-neutral-800" translate="no">
                <p className="text-xs text-neutral-500 mb-2">Currency</p>
                <div className="flex flex-wrap gap-2">
                  {CURRENCIES.map(c => (
                    <button
                      key={c.code}
                      onClick={() => { setCurrency(c.code); setMobileMenuOpen(false); }}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${currency === c.code ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}
                    >
                      <span>{c.flag}</span>
                      <span>{c.code}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Profile/Login */}
              {showProfile ? (
                <>
                  <div className="pt-2 border-t border-neutral-800">
                    <div className="flex items-center gap-2 px-2 py-2 text-white">
                      <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt={username ?? ''} className="w-full h-full object-cover" onError={() => setAvatarUrl(null)} />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                      <span className="font-medium">{username}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => { setMobileMenuOpen(false); handleOpenPortal(); }}
                    className="flex items-center gap-2 text-sm font-medium text-neutral-300 hover:text-white transition text-left"
                  >
                    <Package className="w-4 h-4" />
                    Manage Orders
                  </button>
                  <a
                    href="https://discord.gg/flakedev"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium text-neutral-300 hover:text-white transition"
                  >
                    <DiscordIcon className="w-4 h-4" />
                    Connect with Discord
                  </a>
                  <button
                    onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                    className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setMobileMenuOpen(false); handleFiveMLogin(); }}
                  disabled={loginLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-70 text-white text-sm font-medium transition w-fit"
                >
                  {loginLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                    </svg>
                  )}
                  Login with FiveM
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
