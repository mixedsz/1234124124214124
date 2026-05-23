import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { Gift, ArrowRight } from 'lucide-react';

export default function GiftCardsPage() {
  const giftCardAmounts = [10, 25, 50, 100];

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header basketCount={0} />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 lg:py-24 border-b border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-6">
              <Gift className="w-10 h-10 text-orange-500" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Gift Cards
            </h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Give the gift of choice. Let your friends and community members pick the scripts they want.
            </p>
          </div>
        </section>

        {/* Gift Cards */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {giftCardAmounts.map((amount) => (
                <div
                  key={amount}
                  className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden hover:border-orange-500/50 transition group"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-orange-500/20 to-orange-600/5 flex items-center justify-center p-8">
                    <div className="text-center">
                      <Gift className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                      <div className="text-4xl font-bold text-white">${amount}</div>
                      <div className="text-neutral-400 text-sm mt-1">Gift Card</div>
                    </div>
                  </div>
                  <div className="p-6">
                    <Link
                      href="/store"
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-neutral-800 group-hover:bg-orange-500 text-white font-semibold transition"
                    >
                      Purchase
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-16 bg-neutral-900/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              How Gift Cards Work
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: 'Purchase',
                  description: 'Choose an amount and complete your purchase. You will receive a unique gift card code.',
                },
                {
                  step: '2',
                  title: 'Share',
                  description: 'Send the gift card code to your friend via email, Discord, or any other method.',
                },
                {
                  step: '3',
                  title: 'Redeem',
                  description: 'The recipient enters the code at checkout to apply the gift card balance to their order.',
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-orange-500 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-neutral-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Redeem Section */}
        <section className="py-16">
          <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Have a Gift Card?
            </h2>
            <p className="text-neutral-400 mb-6">
              Enter your gift card code at checkout to apply your balance.
            </p>
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition"
            >
              Go to Cart
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
