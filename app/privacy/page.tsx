import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      <Header />

      <main className="flex-1 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
          
          <div className="prose prose-invert max-w-none">
            <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Introduction</h2>
                <p className="text-neutral-400">
                  This Privacy Policy explains how we collect, use, and protect your personal information when you use our website and services. By using our services, you agree to the collection and use of information in accordance with this policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Information We Collect</h2>
                <p className="text-neutral-400 mb-4">We collect information that you provide directly to us, including:</p>
                <ul className="list-disc list-inside text-neutral-400 space-y-2">
                  <li>Account information (username, email address)</li>
                  <li>Payment information (processed securely by Tebex)</li>
                  <li>Communication data when you contact support</li>
                  <li>Usage data and preferences</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">How We Use Your Information</h2>
                <p className="text-neutral-400 mb-4">We use the collected information to:</p>
                <ul className="list-disc list-inside text-neutral-400 space-y-2">
                  <li>Process your purchases and deliver products</li>
                  <li>Provide customer support</li>
                  <li>Send important updates about your purchases</li>
                  <li>Improve our products and services</li>
                  <li>Send marketing communications (with your consent)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Data Security</h2>
                <p className="text-neutral-400">
                  We implement appropriate security measures to protect your personal information. Payment processing is handled by Tebex, which uses industry-standard encryption and security practices.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Services</h2>
                <p className="text-neutral-400">
                  We use Tebex as our payment processor. When you make a purchase, your payment information is handled directly by Tebex according to their privacy policy. We recommend reviewing their privacy policy for more information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Cookies</h2>
                <p className="text-neutral-400">
                  We use cookies and similar technologies to enhance your experience, analyze site usage, and assist in our marketing efforts. You can control cookie preferences through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Your Rights</h2>
                <p className="text-neutral-400 mb-4">You have the right to:</p>
                <ul className="list-disc list-inside text-neutral-400 space-y-2">
                  <li>Access your personal data</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Data portability</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
                <p className="text-neutral-400">
                  If you have any questions about this Privacy Policy, please contact us through our Discord server or support page.
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
