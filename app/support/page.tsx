import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { HelpCircle, MessageCircle, FileText, ExternalLink } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header basketCount={0} />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 lg:py-24 border-b border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-10 h-10 text-orange-500" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Support Center
            </h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Need help? We are here to assist you with any questions or issues.
            </p>
          </div>
        </section>

        {/* Support Options */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Discord */}
              <a
                href="https://discord.gg/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-neutral-900 rounded-2xl border border-neutral-800 p-8 hover:border-orange-500/50 transition group"
              >
                <MessageCircle className="w-12 h-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-orange-400 transition">
                  Discord Community
                </h3>
                <p className="text-neutral-400 mb-4">
                  Join our Discord server for real-time support from our team and community members.
                </p>
                <span className="inline-flex items-center gap-2 text-orange-400 text-sm font-medium">
                  Join Discord
                  <ExternalLink className="w-4 h-4" />
                </span>
              </a>

              {/* Documentation */}
              <Link
                href="/docs"
                className="bg-neutral-900 rounded-2xl border border-neutral-800 p-8 hover:border-orange-500/50 transition group"
              >
                <FileText className="w-12 h-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-orange-400 transition">
                  Documentation
                </h3>
                <p className="text-neutral-400 mb-4">
                  Browse our comprehensive documentation for installation guides and configuration help.
                </p>
                <span className="inline-flex items-center gap-2 text-orange-400 text-sm font-medium">
                  View Docs
                  <ExternalLink className="w-4 h-4" />
                </span>
              </Link>

              {/* FAQ */}
              <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-8">
                <HelpCircle className="w-12 h-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  FAQ
                </h3>
                <p className="text-neutral-400 mb-4">
                  Find answers to the most commonly asked questions about our scripts and services.
                </p>
                <span className="inline-flex items-center gap-2 text-neutral-500 text-sm font-medium">
                  See below
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-neutral-900/50">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: 'How do I install a script?',
                  a: 'After purchase, download the script from your account. Extract the files to your server resources folder, add the resource to your server.cfg, and restart your server.',
                },
                {
                  q: 'My script is not working. What should I do?',
                  a: 'First, check the documentation for your script. Make sure all dependencies are installed and configured correctly. If the issue persists, join our Discord for support.',
                },
                {
                  q: 'Can I get a refund?',
                  a: 'We offer refunds within 14 days of purchase if the product does not work as described. Please see our refund policy for more details.',
                },
                {
                  q: 'Do scripts work with QBCore/ESX/QBOX?',
                  a: 'Most of our scripts support multiple frameworks. Check the product page for compatibility information.',
                },
                {
                  q: 'How do I update a script?',
                  a: 'Re-download the script from your account to get the latest version. Make sure to backup your config files before updating.',
                },
                {
                  q: 'Can I use scripts on multiple servers?',
                  a: 'License terms vary by product. Check the product page or contact support for specific licensing information.',
                },
              ].map((faq, i) => (
                <div key={i} className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
                  <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                  <p className="text-neutral-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16">
          <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Still Need Help?
            </h2>
            <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-8">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition"
                    placeholder="What can we help with?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition resize-none"
                    placeholder="Describe your issue..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
