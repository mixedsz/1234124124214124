import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getWebstore } from '@/lib/tebex';
import Link from 'next/link';
import { Users, Award, Code, Heart } from 'lucide-react';

export default async function AboutPage() {
  const webstore = await getWebstore();
  const storeName = webstore?.name || 'Our Store';

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 lg:py-24 border-b border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              About {storeName}
            </h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              We create high-quality scripts and resources for the FiveM community.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-neutral-400">
                <p>
                  We started as passionate FiveM players who wanted to enhance the gaming experience for ourselves and our community. What began as small personal projects quickly grew into something much bigger.
                </p>
                <p>
                  Today, we are proud to be one of the leading script creators on the platform, serving thousands of servers worldwide. Our commitment to quality, performance, and customer satisfaction drives everything we do.
                </p>
                <p>
                  We believe in creating scripts that are not only functional but also beautifully designed and optimized for performance. Every line of code is written with care, ensuring our customers receive the best possible products.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-neutral-900/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <Users className="w-10 h-10 text-blue-500 mx-auto mb-4" />
                <div className="text-4xl font-bold text-white mb-2">10k+</div>
                <div className="text-neutral-400">Happy Customers</div>
              </div>
              <div>
                <Code className="w-10 h-10 text-blue-500 mx-auto mb-4" />
                <div className="text-4xl font-bold text-white mb-2">50+</div>
                <div className="text-neutral-400">Scripts Created</div>
              </div>
              <div>
                <Award className="w-10 h-10 text-blue-500 mx-auto mb-4" />
                <div className="text-4xl font-bold text-white mb-2">3+</div>
                <div className="text-neutral-400">Years Experience</div>
              </div>
              <div>
                <Heart className="w-10 h-10 text-blue-500 mx-auto mb-4" />
                <div className="text-4xl font-bold text-white mb-2">500+</div>
                <div className="text-neutral-400">5-Star Reviews</div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Quality First</h3>
                <p className="text-neutral-400">
                  We never compromise on quality. Every script is thoroughly tested and optimized before release to ensure the best experience for our customers.
                </p>
              </div>
              <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Community Driven</h3>
                <p className="text-neutral-400">
                  Our community shapes what we build. We actively listen to feedback and incorporate suggestions into our development process.
                </p>
              </div>
              <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Exceptional Support</h3>
                <p className="text-neutral-400">
                  We stand behind our products with dedicated support. Our team is always ready to help you get the most out of our scripts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-neutral-900/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-neutral-400 mb-8 max-w-xl mx-auto">
              Browse our collection of scripts and take your FiveM server to the next level.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/store"
                className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition"
              >
                Browse Scripts
              </Link>
              <Link
                href="/support"
                className="px-6 py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer storeName={storeName} />
    </div>
  );
}
