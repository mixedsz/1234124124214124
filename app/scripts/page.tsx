import { Header } from '@/components/header';
import { getCategories, TebexCategory } from '@/lib/tebex';
import { Footer } from '@/components/footer';
import { Suspense } from 'react';
import { StoreContent } from './store-content';

// Revalidate every 5 minutes so products stay fresh
export const revalidate = 300;

export default async function StorePage() {
  let initialCategories: TebexCategory[] = [];
  try {
    const cats = await getCategories();
    initialCategories = cats.filter((cat: TebexCategory) =>
      !cat.name.toLowerCase().includes('subscription') &&
      !cat.name.toLowerCase().includes('recurring')
    );
  } catch {
    // Client will attempt its own fetch as fallback
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      <Header />

      {/* Page Header */}
      <section className="border-b border-neutral-800 bg-neutral-900/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold text-white mb-4">Scripts</h1>
          <p className="text-neutral-400">Browse all available scripts and resources</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <Suspense fallback={
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 animate-pulse">
                <div className="aspect-[4/3] bg-neutral-800" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-neutral-800 rounded w-3/4" />
                  <div className="h-4 bg-neutral-800 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        }>
          <StoreContent initialCategories={initialCategories} />
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}
