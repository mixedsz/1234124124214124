import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      <Header />

      <main className="flex-1 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-8">Terms of Sale</h1>
          
          <div className="prose prose-invert max-w-none">
            <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                <p className="text-neutral-400">
                  By purchasing products from our store, you agree to be bound by these Terms of Sale. If you do not agree to these terms, please do not make a purchase.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Products and Licensing</h2>
                <p className="text-neutral-400 mb-4">
                  All scripts and digital products sold through our store are licensed, not sold. Upon purchase, you receive a license to use the product according to these terms:
                </p>
                <ul className="list-disc list-inside text-neutral-400 space-y-2">
                  <li>Products are licensed for use on servers you own or operate</li>
                  <li>Redistribution, resale, or sharing of products is prohibited</li>
                  <li>Modification is allowed for personal use only</li>
                  <li>You may not claim ownership or authorship of our products</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. Payment and Delivery</h2>
                <p className="text-neutral-400">
                  All payments are processed securely through Tebex. Upon successful payment, you will receive instant access to download your purchased products. Digital products are delivered electronically and no physical goods will be shipped.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Pricing</h2>
                <p className="text-neutral-400">
                  All prices are displayed in the currency selected and include applicable taxes. Prices are subject to change without notice. Promotional offers and discounts are valid only during the specified period.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Updates and Support</h2>
                <p className="text-neutral-400">
                  Purchased products include free updates for the lifetime of the product. Support is provided through our Discord server and support channels. We reserve the right to discontinue support for older versions of products.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Prohibited Use</h2>
                <p className="text-neutral-400 mb-4">You agree not to:</p>
                <ul className="list-disc list-inside text-neutral-400 space-y-2">
                  <li>Use products in violation of any applicable laws</li>
                  <li>Reverse engineer or decompile our products</li>
                  <li>Remove or alter any proprietary notices or labels</li>
                  <li>Use products to harm, threaten, or harass others</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
                <p className="text-neutral-400">
                  Our products are provided &quot;as is&quot; without warranty of any kind. We are not liable for any damages arising from the use or inability to use our products. Our maximum liability is limited to the amount you paid for the product.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Changes to Terms</h2>
                <p className="text-neutral-400">
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued use of our services after changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Contact</h2>
                <p className="text-neutral-400">
                  For questions about these Terms of Sale, please contact us through our Discord server or support page.
                </p>
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
