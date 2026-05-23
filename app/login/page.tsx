'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useBasket } from '@/hooks/use-basket';
import { getAuthUrl } from '@/lib/tebex';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const { basket, itemCount } = useBasket();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiveMLogin = async () => {
    if (!basket) {
      setError('Please wait for the session to initialize');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const returnUrl = `${window.location.origin}/login?callback=true`;
      const authUrl = await getAuthUrl(basket.ident, returnUrl);
      
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        setError('Failed to get authentication URL. Please try again.');
      }
    } catch (err) {
      console.error('[LoginPage] Error:', err);
      setError('Failed to initiate login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header basketCount={itemCount} />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Sign In</h1>
              <p className="text-neutral-400">
                Connect your FiveM account to manage purchases and access your downloads.
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-900/20 border border-red-900 rounded-lg p-4 text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleFiveMLogin}
              disabled={loading || !basket}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:bg-neutral-700 text-white font-semibold transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
              {loading ? 'Connecting...' : 'Login with FiveM'}
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-500">
                By signing in, you agree to our{' '}
                <Link href="/terms" className="text-orange-400 hover:text-orange-300">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-orange-400 hover:text-orange-300">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-neutral-400 hover:text-white transition text-sm">
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
