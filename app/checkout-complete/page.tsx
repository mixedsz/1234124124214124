import { Header } from '@/components/header';
import { TebexLegalFooter } from '@/components/tebex-legal-footer';
import Link from 'next/link';
import { CheckCircle, Download, Home, ShoppingBag, Headphones } from 'lucide-react';

export const metadata = { title: 'Order Complete' };

const CFX_ASSETS_URL =
  'https://portal.cfx.re/assets/granted-assets?page=1&sort=asset.updated_at&direction=asc&search=flake';

export default function CheckoutCompletePage() {
  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-xl text-center">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-400" strokeWidth={1.5} />
              </div>
              <div className="absolute -inset-2 rounded-full bg-green-400/5 blur-xl" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Thank You!</h1>
          <p className="text-neutral-400 text-lg mb-10 max-w-md mx-auto">
            Your order was placed successfully. Your scripts are ready to download right now.
          </p>

          {/* Download CTA */}
          <a
            href={CFX_ASSETS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-xl transition shadow-lg shadow-blue-600/20 mb-4"
          >
            <Download className="w-5 h-5" />
            Download Your Scripts
          </a>
          <p className="text-neutral-500 text-sm mb-10">
            Opens your CFX.re Asset Portal — log in with the FiveM account you used to purchase.
          </p>

          {/* What's Next card */}
          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-7 mb-8 text-left">
            <h2 className="text-base font-semibold text-white mb-5 text-center">What happens next?</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/15 flex items-center justify-center mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5 text-green-400" strokeWidth={2.5} />
                </span>
                <div>
                  <p className="text-white text-sm font-medium">Scripts delivered instantly</p>
                  <p className="text-neutral-400 text-xs mt-0.5">
                    Your scripts have been granted to your CFX.re account and are ready to download.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/15 flex items-center justify-center mt-0.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-blue-400" strokeWidth={2.5} />
                </span>
                <div>
                  <p className="text-white text-sm font-medium">Check your email</p>
                  <p className="text-neutral-400 text-xs mt-0.5">
                    A receipt and order confirmation has been sent to the email on your account.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/15 flex items-center justify-center mt-0.5">
                  <Headphones className="w-3.5 h-3.5 text-purple-400" strokeWidth={2.5} />
                </span>
                <div>
                  <p className="text-white text-sm font-medium">Need help setting up?</p>
                  <p className="text-neutral-400 text-xs mt-0.5">
                    Visit our{' '}
                    <Link href="/docs" className="text-blue-400 hover:underline">documentation</Link>
                    {' '}or{' '}
                    <Link href="/support" className="text-blue-400 hover:underline">open a support ticket</Link>.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold rounded-xl transition text-sm"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <Link
              href="/scripts"
              className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-600 hover:border-neutral-400 text-neutral-300 hover:text-white font-semibold rounded-xl transition text-sm"
            >
              Continue Shopping
            </Link>
          </div>

          <p className="text-neutral-600 text-xs mt-8">
            Need support?{' '}
            <a href="mailto:flakedev@gmail.com" className="text-neutral-500 hover:text-neutral-300 transition">
              flakedev@gmail.com
            </a>
          </p>
        </div>
      </main>

      <TebexLegalFooter />
    </div>
  );
}
