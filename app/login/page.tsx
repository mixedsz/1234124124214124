'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getAuthUrl, createBasket } from '@/lib/tebex';
import { useState } from 'react';
import { Loader2, LogIn } from 'lucide-react';

const BASKET_KEY = 'tebex_basket_ident';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiveMLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      let ident = localStorage.getItem(BASKET_KEY);

      if (!ident) {
        const origin = window.location.origin;
        const basket = await createBasket(`${origin}/cart`, `${origin}/checkout-complete`);
        if (!basket) {
          throw new Error('Could not create a session. Please try again.');
        }
        ident = basket.ident;
        localStorage.setItem(BASKET_KEY, ident);
      }

      const returnUrl = `${window.location.origin}/store`;
      const authUrl = await getAuthUrl(ident, returnUrl);

      if (!authUrl) {
        throw new Error('Could not get authentication URL. Check that your Tebex token is configured correctly.');
      }

      window.location.href = authUrl;
    } catch (err) {
      console.error('[Login] Auth error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-10 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-600/20 mx-auto mb-6">
              <LogIn className="w-8 h-8 text-blue-400" />
            </div>

            <h1 className="text-3xl font-bold text-white mb-3">Sign In</h1>
            <p className="text-neutral-400 mb-8 text-sm leading-relaxed">
              Connect your FiveM account to manage purchases, access your downloads, and link scripts to your server.
            </p>

            {error && (
              <div className="mb-6 bg-red-900/20 border border-red-800 rounded-xl p-4 text-red-300 text-sm text-left">
                {error}
              </div>
            )}

            <button
              onClick={handleFiveMLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-lg transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                  </svg>
                  Login with FiveM
                </>
              )}
            </button>

            <p className="mt-6 text-xs text-neutral-600">
              By signing in you agree to our{' '}
              <a href="/terms" className="text-neutral-500 hover:text-white underline transition">Terms of Sale</a>{' '}
              and{' '}
              <a href="/privacy" className="text-neutral-500 hover:text-white underline transition">Privacy Policy</a>.
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-neutral-600">
            Need help?{' '}
            <a href="https://discord.gg/flakedev" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition underline">
              Join our Discord
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
