import { Header } from '@/components/header';
import Link from 'next/link';
import { CheckCircle, Home } from 'lucide-react';

export default function CheckoutCompletePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Header />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <CheckCircle className="w-24 h-24 text-green-400 mx-auto mb-8" />
          
          <h1 className="text-5xl font-bold text-white mb-4">
            Thank You!
          </h1>
          
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Your order has been placed successfully. Check your email for confirmation and delivery details.
          </p>

          <div className="bg-slate-900 rounded-lg border border-slate-800 p-8 mb-8 max-w-md mx-auto">
            <h2 className="text-lg font-semibold text-white mb-4">What&apos;s Next?</h2>
            <ul className="text-left space-y-3 text-slate-400">
              <li className="flex items-start gap-3">
                <span className="text-green-400 font-bold mt-0.5">✓</span>
                <span>Check your email for order confirmation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 font-bold mt-0.5">✓</span>
                <span>Your items will be delivered to your account immediately</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 font-bold mt-0.5">✓</span>
                <span>Join our community and enjoy premium content</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
            <Link
              href="/store"
              className="inline-flex items-center gap-2 px-8 py-3 border border-blue-600 text-blue-400 hover:bg-blue-600/10 font-semibold rounded-lg transition"
            >
              Continue Shopping
            </Link>
          </div>

          <p className="text-slate-500 text-sm mt-8">
            If you need support, contact us at support@example.com
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 mt-24">
        <div className="mx-auto max-w-7xl text-center text-slate-400">
          <p>© 2024 FiveM Store. All rights reserved. Powered by Tebex.</p>
        </div>
      </footer>
    </div>
  );
}
