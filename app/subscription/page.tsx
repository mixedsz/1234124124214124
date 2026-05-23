import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';

export default function SubscriptionPage() {
  const features = [
    'Access to all current scripts',
    'Access to all future scripts',
    'Priority support',
    'Early access to new features',
    'Exclusive Discord channels',
    'Script customization help',
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header basketCount={0} />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 lg:py-24 border-b border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 text-orange-400 text-sm font-medium mb-6">
              <span>Best Value</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Get Everything for One Price
            </h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Subscribe and get instant access to our entire script collection, plus all future releases.
            </p>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 bg-neutral-900/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Monthly */}
              <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2">Monthly</h3>
                  <p className="text-neutral-400 text-sm">Cancel anytime</p>
                </div>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">$35</span>
                  <span className="text-neutral-400">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-neutral-300">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/store"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold transition"
                >
                  Subscribe Monthly
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Annual */}
              <div className="bg-neutral-900 rounded-2xl border-2 border-orange-500 p-8 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-orange-500 text-white text-sm font-bold rounded-full">
                  SAVE 20%
                </div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2">Annual</h3>
                  <p className="text-neutral-400 text-sm">Best value</p>
                </div>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">$336</span>
                  <span className="text-neutral-400">/year</span>
                  <p className="text-sm text-neutral-500 mt-1">$28/month when billed annually</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-neutral-300">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/store"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition"
                >
                  Subscribe Annually
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: 'How does the subscription work?',
                  a: 'Once you subscribe, you get instant access to download all scripts in our collection. Your access remains active as long as your subscription is active.',
                },
                {
                  q: 'Can I cancel anytime?',
                  a: 'Yes, you can cancel your subscription at any time. You will retain access until the end of your current billing period.',
                },
                {
                  q: 'Do I get updates?',
                  a: 'Yes, all subscribers get free updates to all scripts as long as their subscription is active.',
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'We accept all major credit cards, PayPal, and various other payment methods through Tebex.',
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
      </main>

      <Footer />
    </div>
  );
}
