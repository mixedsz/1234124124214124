'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, ChevronDown, HelpCircle, FileText, ExternalLink, Mail, Copy, Check } from 'lucide-react';

const faqs = [
  {
    q: 'Where do I access my script after purchase?',
    a: 'Immediately after purchase, your asset(s) will be available in the Cfx.re Portal of the account you logged into the store with. You can access Portal by going to portal.cfx.re.',
  },
  {
    q: 'Can I get a refund?',
    a: 'Absolutely, we offer a 7 day money-back guarantee in case you change your mind, or something goes wrong with your purchase. In some select cases, we can also offer a refund after 7 days in case there is something we cannot fix, or you are unable to get the script working despite our best efforts. Please note, subscriptions are not eligible for refunds. This is subject to our refund terms and conditions.',
  },
  {
    q: 'Can I transfer my purchase to another account?',
    a: "Yes, you can transfer the script ONCE to another Cfx.re Keymaster of your choice after purchase. After the transfer, the script is now locked inside of that account forever. There are no tools provided to us to get the script back to you after this has been done. If you are looking to buy for a friend, we highly recommend using the 'Gift Package' option.",
  },
  {
    q: 'Can I buy an unencrypted version?',
    a: 'We do not offer any fully source available versions of our scripts. All our scripts by default come included with a source available bridge that contains all framework-related events and un-encrypted function files which include many various functions that can be customized or edited to your liking.',
  },
  {
    q: 'What frameworks are compatible?',
    a: 'The purchase page of the script will outline which framework(s) it is compatible with. Our scripts are typically compatible with QBCore, Qbox & ESX Legacy (v1.3 or later).',
  },
  {
    q: 'How do I cancel my subscription?',
    a: "To cancel your subscription, navigate to checkout.tebex.io/payment-history. After logging in, simply navigate to the 'Subscriptions' tab to cancel.",
  },
  {
    q: 'How do I contact support?',
    a: 'We have a support team active 7 days a week. We offer support primarily through our Discord (discord.gg/flakedev), but we can also provide support via email: support@flakedev.com',
  },
];

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = 'Support | Flake Development | QBCore, Qbox & ESX FiveM Scripts';
  }, []);

  const filtered = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('support@flakedev.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-14 border-b border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Support Center</h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Need help? We&apos;re here for you.
            </p>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-2">FAQs</h2>
            <p className="text-neutral-400 mb-8">You&apos;ve got questions? We&apos;ve got answers.</p>

            {/* Search */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setOpenIndex(null); }}
                placeholder="Search frequently asked questions..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-11 pr-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition text-sm"
              />
            </div>

            {/* Accordion */}
            <div className="space-y-3">
              {filtered.length === 0 ? (
                <p className="text-neutral-500 text-center py-10">No results for &quot;{search}&quot;</p>
              ) : (
                filtered.map((faq, i) => (
                  <div key={i} className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenIndex(openIndex === i ? null : i)}
                      className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-neutral-800/80 transition"
                    >
                      <HelpCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <span className="flex-1 font-medium text-white text-sm">{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-neutral-400 flex-shrink-0 transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {openIndex === i && (
                      <div className="px-5 pb-5">
                        <p className="pl-8 text-neutral-400 text-sm leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Documentation */}
        <section className="pb-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/20 via-blue-500/10 to-transparent border border-blue-500/20 p-8">
              <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/5 rounded-full -translate-y-1/3 translate-x-1/4 pointer-events-none" />
              <div className="relative flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <span className="inline-block px-2.5 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full mb-3">Recommended</span>
                  <h3 className="text-xl font-bold text-white mb-2">Documentation</h3>
                  <p className="text-neutral-400 text-sm mb-5">
                    Browse our comprehensive guides for installation, configuration, and troubleshooting for every script we offer.
                  </p>
                  <Link
                    href="/docs"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition"
                  >
                    View Docs
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact cards */}
        <section className="border-t border-neutral-800 py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Discord */}
              <a
                href="https://discord.gg/flakedev"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600/15 to-blue-600/5 border border-indigo-500/25 hover:border-indigo-500/50 p-8 transition flex flex-col"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#5865F2]/20 flex items-center justify-center mb-5">
                  <svg className="w-7 h-7 text-[#7289da]" viewBox="0 0 71 55" fill="currentColor">
                    <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.44077 45.4204 0.52529C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.52529C25.5141 0.44359 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Discord Community</h3>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6 flex-1">
                  Join our Discord server for real-time support from our team. We have a support team active 7 days a week ready to help you with any issues.
                </p>
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5865F2]/20 hover:bg-[#5865F2]/30 border border-[#5865F2]/30 text-[#7289da] group-hover:text-[#8da0e1] font-semibold text-sm transition w-fit">
                  Join Discord
                  <ExternalLink className="w-4 h-4" />
                </span>
              </a>

              {/* Email */}
              <div className="rounded-2xl bg-white/5 border border-neutral-700/50 p-8 flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-neutral-700 flex items-center justify-center mb-5">
                  <Mail className="w-7 h-7 text-neutral-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Email Support</h3>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6 flex-1">
                  Prefer email? Send us a message and our support team will get back to you as soon as possible, typically within 24 hours.
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-neutral-300 text-sm font-mono bg-neutral-800 px-3 py-2 rounded-lg border border-neutral-700">
                    support@flakedev.com
                  </span>
                  <button
                    onClick={handleCopyEmail}
                    className="p-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-neutral-400 hover:text-white transition flex-shrink-0"
                    title="Copy email"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
