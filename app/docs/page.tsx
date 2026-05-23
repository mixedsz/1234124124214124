import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { Book, ExternalLink, Search } from 'lucide-react';

export default function DocsPage() {
  const docCategories = [
    {
      title: 'Getting Started',
      items: [
        { title: 'Installation Guide', href: '#installation' },
        { title: 'Server Requirements', href: '#requirements' },
        { title: 'Configuration Basics', href: '#configuration' },
      ],
    },
    {
      title: 'Scripts',
      items: [
        { title: 'Vehicle Scripts', href: '#vehicle' },
        { title: 'UI/HUD Scripts', href: '#ui' },
        { title: 'Utility Scripts', href: '#utility' },
      ],
    },
    {
      title: 'Troubleshooting',
      items: [
        { title: 'Common Issues', href: '#common-issues' },
        { title: 'Error Messages', href: '#errors' },
        { title: 'Performance Tips', href: '#performance' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      <Header basketCount={0} />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 border-b border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Book className="w-6 h-6 text-blue-500" />
              </div>
              <h1 className="text-4xl font-bold text-white">Documentation</h1>
            </div>
            <p className="text-xl text-neutral-400 max-w-2xl">
              Everything you need to install, configure, and customize our scripts.
            </p>

            {/* Search */}
            <div className="mt-8 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Doc Categories */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {docCategories.map((category) => (
                <div key={category.title} className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">{category.title}</h2>
                  <ul className="space-y-3">
                    {category.items.map((item) => (
                      <li key={item.title}>
                        <Link
                          href={item.href}
                          className="flex items-center justify-between text-neutral-400 hover:text-blue-400 transition"
                        >
                          {item.title}
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="py-16 bg-neutral-900/50" id="installation">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8">Quick Start Guide</h2>
            
            <div className="prose prose-invert max-w-none">
              <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">1. Download Your Script</h3>
                <p className="text-neutral-400">
                  After purchasing, go to your Tebex account and download the script files. You will receive a .zip file containing all necessary resources.
                </p>
              </div>

              <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">2. Extract to Resources</h3>
                <p className="text-neutral-400 mb-4">
                  Extract the contents to your server&apos;s resources folder:
                </p>
                <pre className="bg-neutral-900 rounded-lg p-4 overflow-x-auto">
                  <code className="text-green-400">
                    /resources/[scripts]/your-script-name/
                  </code>
                </pre>
              </div>

              <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">3. Configure server.cfg</h3>
                <p className="text-neutral-400 mb-4">
                  Add the resource to your server.cfg:
                </p>
                <pre className="bg-neutral-900 rounded-lg p-4 overflow-x-auto">
                  <code className="text-green-400">
                    ensure your-script-name
                  </code>
                </pre>
              </div>

              <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">4. Configure the Script</h3>
                <p className="text-neutral-400">
                  Open the config.lua file in the script folder and adjust settings to your preferences. Each option is documented with comments explaining its purpose.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Need Help */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Need More Help?</h2>
            <p className="text-neutral-400 mb-6">
              Our support team is ready to assist you with any questions.
            </p>
            <Link
              href="/support"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition"
            >
              Contact Support
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
