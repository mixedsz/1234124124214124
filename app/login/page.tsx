'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useBasket } from '@/hooks/use-basket';
import { getAuthUrl } from '@/lib/tebex';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const { basket, itemCount, refreshBasket } = useBasket();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();

  // Check if returning from auth callback
  useEffect(() => {
    if (searchParams.get('callback') === 'true') {
      setSuccess(true);
      refreshBasket();
    }
  }, [searchParams, refreshBasket]);

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
        // Fallback: redirect to checkout which handles auth
        if (basket.links?.checkout) {
          window.location.href = basket.links.checkout;
        } else {
          setError('Unable to connect to authentication service. Please try again later.');
        }
      }
    } catch (err) {
      console.error('[LoginPage] Error:', err);
      setError('Failed to initiate login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Header basketCount={itemCount} />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Successfully Connected</h1>
            <p className="text-neutral-400 mb-6">
              Your FiveM account has been linked. You can now make purchases.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/store"
                className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition"
              >
                Browse Scripts
              </Link>
              <Link
                href="/cart"
                className="px-6 py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold transition"
              >
                View Cart
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header basketCount={itemCount} />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
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
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-neutral-700 text-white font-semibold transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
              {loading ? 'Connecting...' : basket ? 'Login with FiveM' : 'Initializing...'}
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-500">
                By signing in, you agree to our{' '}
                <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
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
