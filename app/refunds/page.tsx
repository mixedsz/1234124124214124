import type { Metadata } from 'next'
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Link from 'next/link';


export const metadata: Metadata = {
  title: 'Refund Policy | Flake Development | QBCore, Qbox & ESX FiveM Scripts',
}
export default function RefundsPage() {
  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      <Header />

      <main className="flex-1 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-8">Refund Policy</h1>
          
          <div className="prose prose-invert max-w-none">
            <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Overview</h2>
                <p className="text-neutral-400">
                  We want you to be completely satisfied with your purchase. This refund policy outlines the conditions under which refunds may be granted for digital products purchased through our store.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Refund Eligibility</h2>
                <p className="text-neutral-400 mb-4">
                  You may be eligible for a refund if:
                </p>
                <ul className="list-disc list-inside text-neutral-400 space-y-2">
                  <li>The product does not function as described</li>
                  <li>You experience a technical issue that cannot be resolved</li>
                  <li>The refund request is made within 14 days of purchase</li>
                  <li>You have not violated our terms of service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Non-Refundable Situations</h2>
                <p className="text-neutral-400 mb-4">
                  Refunds will not be granted in the following cases:
                </p>
                <ul className="list-disc list-inside text-neutral-400 space-y-2">
                  <li>Change of mind after purchase</li>
                  <li>Failure to read product descriptions or requirements</li>
                  <li>Issues caused by incompatible server configurations</li>
                  <li>Requests made after 14 days from purchase date</li>
                  <li>Products that have been used or downloaded multiple times</li>
                  <li>Subscription services after the billing period has started</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">How to Request a Refund</h2>
                <p className="text-neutral-400 mb-4">
                  To request a refund, please follow these steps:
                </p>
                <ol className="list-decimal list-inside text-neutral-400 space-y-2">
                  <li>Contact our support team through Discord or email</li>
                  <li>Provide your order number and purchase email</li>
                  <li>Explain the reason for your refund request</li>
                  <li>Provide any relevant screenshots or error logs</li>
                </ol>
                <p className="text-neutral-400 mt-4">
                  We aim to respond to all refund requests within 48 hours.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Refund Process</h2>
                <p className="text-neutral-400">
                  If your refund is approved, the amount will be credited back to your original payment method within 5-10 business days. Refunds are processed through Tebex, and processing times may vary depending on your payment provider.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Partial Refunds</h2>
                <p className="text-neutral-400">
                  In some cases, we may offer partial refunds. This may apply to bundles where only some products meet the refund criteria, or in special circumstances determined on a case-by-case basis.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
                <p className="text-neutral-400 mb-4">
                  If you have questions about our refund policy or need to request a refund, please contact us:
                </p>
                <Link
                  href="/support"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition"
                >
                  Contact Support
                </Link>
              </section>

              <section>
                <p className="text-neutral-500 text-sm">
                  Last updated: January 2026
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
