'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getPackage, TebexPackage, TebexPackageVariable } from '@/lib/tebex';
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ShoppingCart, AlertCircle, Check } from 'lucide-react';
import { useBasket } from '@/contexts/basket-context';
import { useCurrency } from '@/contexts/currency-context';
import { marked } from 'marked';

// Configure marked for safe rendering
marked.use({
  breaks: true,
  gfm: true,
});

// Helper to parse description - handles both HTML and markdown
function parseDescription(description: string): string {
  if (!description) return '';

  // If already HTML, apply styling and also convert any inline markdown within it
  if (description.includes('<p>') || description.includes('<br') || description.includes('<ul>')) {
    return description
      // Convert **bold** markdown that Tebex sometimes leaves in HTML descriptions
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
      // Convert bare `- item` lines that aren't inside <ul> tags
      .replace(/^- (.+)$/gm, '<span class="block ml-4 text-neutral-300 before:content-[\'•\'] before:mr-2">$1</span>')
      .replace(/<a /g, '<a class="text-blue-400 hover:text-blue-300 underline" ')
      .replace(/<strong(?! class)/g, '<strong class="font-bold text-white"')
      .replace(/<ul>/g, '<ul class="list-disc list-inside space-y-1 my-2">')
      .replace(/<li>/g, '<li class="text-neutral-300">');
  }

  // Pre-process plain text / markdown: ensure blank line before list items
  const processed = description
    .replace(/(?<!\n)\n([-*] )/g, '\n\n$1');

  // Parse as markdown
  const html = marked.parse(processed, { async: false }) as string;

  // Add styling classes
  return html
    .replace(/<a /g, '<a class="text-blue-400 hover:text-blue-300 underline" ')
    .replace(/<strong>/g, '<strong class="font-bold text-white">')
    .replace(/<ul>/g, '<ul class="list-disc list-inside space-y-1 my-2">')
    .replace(/<li>/g, '<li class="text-neutral-300">')
    .replace(/<h1>/g, '<h1 class="text-xl font-bold text-white mt-4 mb-2">')
    .replace(/<h2>/g, '<h2 class="text-lg font-bold text-white mt-3 mb-2">')
    .replace(/<h3>/g, '<h3 class="text-base font-bold text-white mt-2 mb-1">')
    .replace(/<p>/g, '<p class="mb-2">');
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [pkg, setPkg] = useState<TebexPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [errorDetail, setErrorDetail] = useState<{ status: number; body: unknown; raw: string } | null>(null);
  const [showErrorDetail, setShowErrorDetail] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [discordLinked, setDiscordLinked] = useState(false);
  const [discordId, setDiscordId] = useState<string | null>(null);
  const [discordVarIdentifier, setDiscordVarIdentifier] = useState<string | null>(null);
  const [needsDiscord, setNeedsDiscord] = useState(false);
  const { addItem, isAuthenticated, username, basket, refreshBasket } = useBasket();
  const { formatPrice } = useCurrency();
  const searchParams = useSearchParams();

  // Handle return from Tebex Discord ident via our ident-callback
  const discordLinkedParam = searchParams.get('discord_linked') === '1';
  const discordIdParam = searchParams.get('discord_id');
  useEffect(() => {
    if (!basket?.ident) return;

    // Restore from localStorage if same basket
    const storedBasket = localStorage.getItem('discord_linked_basket');
    const storedId = localStorage.getItem('discord_ident_id');
    if (storedBasket === basket.ident) {
      setDiscordLinked(true);
      if (storedId) setDiscordId(storedId);
      return;
    }

    if (discordLinkedParam) {
      setDiscordLinked(true);
      localStorage.setItem('discord_linked_basket', basket.ident);
      if (discordIdParam) {
        setDiscordId(discordIdParam);
        localStorage.setItem('discord_ident_id', discordIdParam);
        console.log('[ProductPage] Discord ID from Tebex ident:', discordIdParam);
      }
      refreshBasket();
      const url = new URL(window.location.href);
      url.searchParams.delete('discord_linked');
      url.searchParams.delete('discord_id');
      window.history.replaceState({}, '', url.toString());
    }
  }, [basket?.ident, discordLinkedParam, discordIdParam, refreshBasket]);

  useEffect(() => {
    const loadPackage = async () => {
      try {
        setLoading(true);
        const resolvedParams = await params;
        const data = await getPackage(Number(resolvedParams.id));
        setPkg(data);
        // Detect Discord requirement from package variables
        const discordVar = data?.variables?.find((v: TebexPackageVariable) =>
          v.identifier?.toLowerCase().includes('discord') ||
          v.description?.toLowerCase().includes('discord')
        );
        if (discordVar) {
          setNeedsDiscord(true);
          setDiscordVarIdentifier(discordVar.identifier);
          console.log('[ProductPage] Discord variable identifier:', discordVar.identifier, '| description:', discordVar.description);
        }
      } catch (err) {
        console.error('[ProductPage] Error:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadPackage();
  }, [params]);

  // Variables that are NOT discord (those get the OAuth button, not a text input)
  const requiredVariables: TebexPackageVariable[] = (pkg?.variables ?? []).filter(
    (v: TebexPackageVariable) =>
      (v.required || v.required === 1) &&
      !v.identifier?.toLowerCase().includes('discord') &&
      !v.description?.toLowerCase().includes('discord'),
  );

  const handleAddToCart = useCallback(async () => {
    if (!pkg) return;

    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    // Validate non-discord required variables
    for (const variable of requiredVariables) {
      if (!variableValues[variable.identifier]?.trim()) {
        setError(`Please fill in "${variable.description || variable.identifier}" before adding to cart.`);
        return;
      }
    }

    // If Discord is needed but not linked via Tebex yet, block and prompt
    if (needsDiscord && !discordLinked) {
      setError('This package requires your Discord account. Connect Discord below to continue.');
      return;
    }

    try {
      setAdding(true);
      setError(null);
      setErrorDetail(null);
      setShowErrorDetail(false);

      const varData: Record<string, string> = { ...variableValues };

      // Pass discord_id under the exact variable identifier Tebex expects
      if (discordLinked && discordId && discordVarIdentifier) {
        varData[discordVarIdentifier] = discordId;
        console.log('[ProductPage] Passing discord variable:', discordVarIdentifier, '=', discordId);
      } else if (discordLinked && discordId) {
        varData.discord_id = discordId;
      }

      await addItem(pkg.id, quantity, Object.keys(varData).length > 0 ? varData : undefined);
      setAdded(true);
      setTimeout(() => setAdded(false), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add to cart';
      const detail = (err as Error & { tebexDetail?: { status: number; body: { title?: string; detail?: string }; raw: string } }).tebexDetail;
      setError(message);
      if (detail) {
        setErrorDetail(detail as { status: number; body: unknown; raw: string });
        // Detect Discord requirement from Tebex error title
        const title = (detail.body as { title?: string }).title?.toLowerCase() ?? '';
        if (title.includes('discord')) {
          setNeedsDiscord(true);
        }
      }
    } finally {
      setAdding(false);
    }
  }, [pkg, isAuthenticated, setShowLoginModal, requiredVariables, variableValues, needsDiscord, discordLinked, discordId, discordVarIdentifier, addItem, quantity]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex flex-col">
        <Header />
        <div className="flex items-center justify-center flex-1">
          <div className="text-neutral-400">Loading product...</div>
        </div>
      </div>
    );
  }

  if (!pkg && !loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex flex-col">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-12 w-full">
          <Link href="/scripts" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 transition">
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
          <div className="bg-red-900/20 border border-red-900 rounded-xl p-8 text-red-200">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Product Not Found</h3>
                <p>The product you are looking for does not exist or has been removed.</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const hasDiscount = pkg.discount > 0;
  const parsedDescription = parseDescription(pkg.description);

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        <Link href="/scripts" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-10 transition">
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Image */}
          <div>
            <div className="bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-700 aspect-video">
              {pkg.image ? (
                <img src={pkg.image} alt={pkg.name} className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-blue-600/10">
                  <span className="text-6xl font-bold text-blue-500/50">{pkg.name.charAt(0)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-blue-400 text-sm font-medium mb-2">{pkg.category?.name}</p>
                
                {/* Framework Badges - Light variant style like Mantine */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2.5 py-1 bg-red-500/15 text-red-400 text-xs font-semibold rounded">QBCore</span>
                  <span className="px-2.5 py-1 bg-yellow-500/15 text-yellow-400 text-xs font-semibold rounded">Qbox</span>
                  <span className="px-2.5 py-1 bg-orange-500/15 text-orange-400 text-xs font-semibold rounded">ESX</span>
                </div>

                <h1 className="text-3xl font-bold text-white">{pkg.name}</h1>
              </div>
              {hasDiscount && (
                <span className="bg-green-500 text-white px-3 py-1 rounded text-sm font-bold flex-shrink-0 ml-4">
                  SALE
                </span>
              )}
            </div>

            {/* Price */}
            <div className="mb-8 pb-8 border-b border-neutral-800">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-white">
                  {pkg.total_price === 0 ? 'Free' : formatPrice(pkg.total_price)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-neutral-600 line-through">
                    {formatPrice(pkg.base_price)}
                  </span>
                )}
              </div>
              <p className="text-neutral-500 text-sm mt-1">Tax included</p>
            </div>

            {/* Trust badges */}
            <div className="flex flex-col gap-2 mb-6 text-sm text-neutral-400">
              <div className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/>
                  <path d="M9 12l2 2l4 -4"/>
                </svg>
                <span>7 day money-back guarantee</span>
                <sup className="text-blue-400 font-normal text-[10px] flex items-center gap-0.5 cursor-pointer">
                  <Link href="/refunds" className="hover:text-blue-300">Subject to T&Cs</Link>
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 7l-10 10"/><path d="M8 7l9 0l0 9"/>
                  </svg>
                </sup>
              </div>
              <div className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z"/>
                  <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"/>
                  <path d="M8 11v-4a4 4 0 1 1 8 0v4"/>
                </svg>
                <span>Protected by Cfx.re asset escrow</span>
              </div>
            </div>

            {/* Description with proper markdown rendering */}
            <div className="mb-8 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              <div
                className="text-neutral-400 leading-relaxed text-sm prose prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: parsedDescription }}
              />
            </div>

            {/* Login required notice */}
            {!username && (
              <div className="mb-4 bg-blue-900/20 border border-blue-800 rounded-xl p-4 text-blue-300 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                  </svg>
                  <span>
                    You need to{' '}
                    <Link href="/login" className="underline hover:text-blue-200 font-medium">login with FiveM</Link>
                    {' '}before adding items to your cart.
                  </span>
                </div>
              </div>
            )}

            {/* Feedback */}
            {error && !(needsDiscord && !discordLinked) && (
              <div className="mb-4 bg-red-900/20 border border-red-900 rounded-xl p-4 text-red-300 text-sm">
                <div className="flex gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="flex-1">{error}</span>
                  {errorDetail && (
                    <button
                      onClick={() => setShowErrorDetail((v) => !v)}
                      className="text-red-400 hover:text-red-200 underline text-xs flex-shrink-0"
                    >
                      {showErrorDetail ? 'Hide' : 'Details'}
                    </button>
                  )}
                </div>
                {errorDetail && showErrorDetail && (
                  <pre className="mt-3 bg-neutral-900/60 rounded-lg p-3 text-xs text-red-200 overflow-x-auto whitespace-pre-wrap break-all">
                    {`HTTP ${errorDetail.status}\n\n${typeof errorDetail.body === 'object' ? JSON.stringify(errorDetail.body, null, 2) : errorDetail.raw}`}
                  </pre>
                )}
              </div>
            )}
            {added && (
              <div className="mb-4 bg-green-900/20 border border-green-800 rounded-xl p-4 text-green-300 text-sm flex gap-2">
                <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                Added to cart successfully!{' '}
                <Link href="/cart" className="underline hover:text-green-200">View Cart →</Link>
              </div>
            )}

            {/* Discord connect — shown when package needs Discord (uses Tebex ident bot) */}
            {needsDiscord && (
              <div className="mb-5">
                {discordLinked ? (
                  <div className="flex items-center justify-between bg-[#5865F2]/10 border border-[#5865F2]/30 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#5865F2] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                      </svg>
                      <div>
                        <p className="text-sm text-white font-medium">Discord connected</p>
                        <p className="text-xs text-neutral-400">{discordId ? `ID: ${discordId}` : 'Authorized via Tebex'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        localStorage.removeItem('discord_linked_basket');
                        setDiscordLinked(false);
                      }}
                      className="text-xs text-neutral-500 hover:text-white transition"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <a
                    href={basket && typeof window !== 'undefined'
                      ? `https://ident.tebex.io/discord/?basketIdent=${basket.ident}&return=${encodeURIComponent(`${window.location.origin}/api/discord/ident-callback?basketIdent=${basket.ident}&returnTo=${encodeURIComponent(window.location.pathname)}`)}`
                      : '#'}
                    className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold transition"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                    </svg>
                    Connect Discord to Purchase
                  </a>
                )}
              </div>
            )}

            {/* Required package variables (non-discord) */}
            {requiredVariables.length > 0 && (
              <div className="mb-6 space-y-3">
                <p className="text-neutral-300 text-sm font-medium">Required information:</p>
                {requiredVariables.map((variable) => (
                  <div key={variable.identifier}>
                    <label className="block text-neutral-400 text-xs mb-1">
                      {variable.description || variable.identifier}
                    </label>
                    {variable.type === 'dropdown' && variable.options && variable.options.length > 0 ? (
                      <select
                        value={variableValues[variable.identifier] || ''}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setVariableValues((prev: Record<string, string>) => ({ ...prev, [variable.identifier]: e.target.value }))}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Select an option...</option>
                        {variable.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.name}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={variableValues[variable.identifier] || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVariableValues((prev: Record<string, string>) => ({ ...prev, [variable.identifier]: e.target.value }))}
                        placeholder={variable.description || variable.identifier}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {!pkg.disable_quantity && (
                <div className="flex items-center gap-4 mb-4">
                  <label className="text-neutral-300 text-sm font-medium">Quantity:</label>
                  <div className="flex items-center border border-neutral-700 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                    >
                      -
                    </button>
                    <span className="w-12 py-2 text-center text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {adding ? 'Adding to Cart...' : isAuthenticated ? 'Add to Cart' : 'Login to Purchase'}
              </button>

              <Link
                href="/cart"
                className="w-full flex items-center justify-center border border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-white font-medium py-3 rounded-xl transition"
              >
                View Cart
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* FiveM Login Modal */}
      {showLoginModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowLoginModal(false); }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden border border-neutral-800">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <h2 className="text-xl font-bold text-white">Login with FiveM</h2>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-neutral-400 hover:text-white transition p-1"
              >
                <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                  <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
            {/* Body */}
            <div className="px-6 pb-6">
              <p className="text-neutral-300 mb-4 leading-relaxed">
                Before you can add this to your basket, we need you to log in with your Cfx.re/FiveM account. This is so we know which Keymaster to send the assets to after checkout.
              </p>
              <p className="text-neutral-400 text-sm mb-6">
                Click the button below, it&apos;ll take just a couple of seconds!
              </p>
              <div className="flex justify-center">
                <Link
                  href="/login"
                  onClick={() => setShowLoginModal(false)}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-lg bg-white/10 hover:bg-white/15 text-neutral-100 border border-white/10 transition"
                >
                  <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 0C4.03 0 0 4.03 0 9C0 13.97 4.03 18 9 18C13.97 18 18 13.97 18 9C18 4.03 13.97 0 9 0ZM9 2.7C10.49 2.7 11.7 3.91 11.7 5.4C11.7 6.89 10.49 8.1 9 8.1C7.51 8.1 6.3 6.89 6.3 5.4C6.3 3.91 7.51 2.7 9 2.7ZM9 15.48C6.75 15.48 4.76 14.33 3.6 12.59C3.63 10.84 7.2 9.882 9 9.882C10.791 9.882 14.37 10.84 14.4 12.59C13.24 14.33 11.25 15.48 9 15.48Z" fill="currentColor"/>
                  </svg>
                  Login with FiveM
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
