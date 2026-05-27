'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getPackage, TebexPackage, TebexPackageVariable, createBasket, getAuthUrl, addToBasket } from '@/lib/tebex';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ShoppingCart, AlertCircle, Check, Gift, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
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

  // HTML from Tebex — convert any leftover **bold** markdown, let .prose CSS handle the rest
  if (description.includes('<p>') || description.includes('<br') || description.includes('<ul>')) {
    return description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }

  // Markdown / plain text — ensure blank line before list items so marked parses them correctly
  const processed = description.replace(/(?<!\n)\n([-*] )/g, '\n\n$1');
  return marked.parse(processed, { async: false }) as string;
}

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m?.[1] ?? null;
}

function buildMediaItems(pkg: TebexPackage): string[] {
  const seen = new Set<string>();
  const items: string[] = [];
  const add = (url: string) => {
    const normalized = url.trim();
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      items.push(normalized);
    }
  };

  if (pkg.media && pkg.media.length > 0) {
    // Primary items first, then non-primary
    for (const m of pkg.media.filter(m => m.primary)) add(m.url);
    for (const m of pkg.media.filter(m => !m.primary)) add(m.url);
  } else if (pkg.image) {
    add(pkg.image);
  }

  return items;
}

// ── Requirements extraction ────────────────────────────────────────────────────

const KNOWN_DEP_URLS: Record<string, string> = {
  oxmysql:              'https://github.com/overextended/oxmysql/releases/latest',
  ox_lib:               'https://github.com/overextended/ox_lib/releases/latest',
  ox_inventory:         'https://github.com/overextended/ox_inventory/releases/latest',
  ox_target:            'https://github.com/overextended/ox_target/releases/latest',
  ox_doorlock:          'https://github.com/overextended/ox_doorlock/releases/latest',
  oxlib:                'https://github.com/overextended/ox_lib/releases/latest',
  wasabi_ambulance:     'https://www.wasabiscripts.com/product/7242186',
  wasabi_crutch:        'https://www.wasabiscripts.com/product/5453692',
  ak47_ambulancejob:    'https://menanak47.tebex.io/package/5884442',
  ak47_qbambulancejob:  'https://menanak47.tebex.io/package/5893947',
  ak47_crutch:          'https://menanak47.tebex.io/package/6419367',
  ak47_qbcrutch:        'https://menanak47.tebex.io/package/6419368',
  esx_ambulancejob:     'https://github.com/esx-framework/ESX-Legacy-Addons/tree/main/%5Besx_addons%5D/esx_ambulancejob',
};

const KNOWN_FRAMEWORK_URLS: Record<string, string> = {
  esx:        'https://github.com/esx-framework/esx_core',
  esextended: 'https://github.com/esx-framework/esx_core',
  qbcore:     'https://github.com/qbcore-framework/qb-core',
  qbox:       'https://github.com/Qbox-project/qbx_core',
};

function getFrameworkUrl(name: string): string | null {
  const norm = name.toLowerCase().replace(/[-_/ ]/g, '');
  for (const [key, url] of Object.entries(KNOWN_FRAMEWORK_URLS)) {
    if (norm.includes(key)) return url;
  }
  return null;
}

function getDepUrl(item: string): string | null {
  const norm = item.toLowerCase().replace(/[-_ ]/g, '');
  for (const [key, url] of Object.entries(KNOWN_DEP_URLS)) {
    if (norm.includes(key.replace(/[-_]/g, ''))) return url;
  }
  const m = item.match(/https?:\/\/[^\s)>\]]+/);
  return m ? m[0] : null;
}

type ReqType = 'framework' | 'onesync' | 'server' | 'dependency' | 'default';
function getReqType(item: string): ReqType {
  const lo = item.toLowerCase();
  if (lo.includes('qbcore') || lo.includes('esx') || lo.includes('qbox') || lo.includes('framework')) return 'framework';
  if (lo.includes('onesync') || lo.includes('one sync')) return 'onesync';
  if (lo.match(/server\s*v\d|artifact|v7290|fxserver|\d{4}\s*or\s*(newer|later)/)) return 'server';
  if (getDepUrl(item)) return 'dependency';
  return 'default';
}

const KNOWN_SECTIONS = new Set([
  'requirements', 'requirement', 'dependencies', 'dependency',
  'compatible with', 'compatible', 'compatibles',
  'framework', 'frameworks', 'preview',
]);

function normalizeLine(text: string) {
  return text
    .replace(/<[^>]+>/g, '')       // strip inline HTML tags like <a>
    .replace(/^\*{1,3}|\*{1,3}$/g, '')  // strip bold/italic markers
    .replace(/^#+\s*/, '')          // strip # heading markers
    .replace(/[:\s]+$/, '')         // strip trailing colon/whitespace
    .replace(/^\[|\]$/g, '')        // strip surrounding [brackets]
    .trim().toLowerCase();
}

function extractSection(raw: string, heading: string): { items: string[]; stripped: string } {
  const items: string[] = [];
  const hClean = heading.replace(/\?$/, '');
  const hLower = hClean.toLowerCase();
  const hLowerSingular = hLower.endsWith('s') ? hLower.slice(0, -1) : hLower;

  const matchHead = (text: string) => {
    const t = normalizeLine(text);
    return t === hLower || t === hLowerSingular;
  };

  const isNextSection = (text: string) => {
    const plain = text.replace(/<[^>]+>/g, '').trim();
    const t = normalizeLine(plain);
    return KNOWN_SECTIONS.has(t) || /^[A-Z][^:]{0,40}:\s*$/.test(plain);
  };

  // Only use DOM for block-level HTML (p, div, ul, li, h1-6, br).
  // Plain text with inline tags like <a> must go through line-based path.
  const hasBlockHTML = /<(?:p|div|ul|ol|li|h[1-6]|br)\b/i.test(raw);

  if (hasBlockHTML && typeof document !== 'undefined') {
    const wrap = document.createElement('div');
    wrap.innerHTML = raw;

    // Returns text of an element BEFORE the first <br> child node.
    // Needed because Tebex sometimes puts heading + first item in one <p> like:
    //   <p><strong>Dependencies</strong><br>- ox_lib</p>
    const textBeforeBr = (el: Element): string => {
      let t = '';
      for (const node of Array.from(el.childNodes)) {
        if (node.nodeName.toLowerCase() === 'br') break;
        t += node.textContent ?? '';
      }
      return t;
    };

    // Returns items packed after the first <br> inside the same element.
    const itemsAfterBr = (el: Element): string[] => {
      const result: string[] = [];
      let seenBr = false;
      for (const node of Array.from(el.childNodes)) {
        if (node.nodeName.toLowerCase() === 'br') { seenBr = true; continue; }
        if (seenBr) {
          const t = (node.textContent ?? '').trim();
          const clean = t.replace(/^[-*•]\s*/, '').trim();
          if (clean) result.push(clean);
        }
      }
      return result;
    };

    let headEl: Element | null = null;
    let inlineItems: string[] = [];

    for (const el of Array.from(wrap.children)) {
      if (matchHead(textBeforeBr(el))) {
        headEl = el;
        inlineItems = itemsAfterBr(el);
        break;
      }
    }

    if (headEl) {
      const toRemove: Element[] = [headEl];
      items.push(...inlineItems);

      let sibling = headEl.nextElementSibling;
      while (sibling && items.length < 12) {
        const text = (sibling.textContent ?? '').trim();
        const inner = sibling.innerHTML.trim().toLowerCase();
        if (!text || inner === '<br>' || inner === '<br/>') {
          toRemove.push(sibling);
          sibling = sibling.nextElementSibling;
          continue;
        }
        if (isNextSection(textBeforeBr(sibling))) break;
        const clean = text.replace(/^[-*•]\s*/, '').trim();
        if (clean) { items.push(clean); toRemove.push(sibling); }
        sibling = sibling.nextElementSibling;
      }

      if (items.length > 0) {
        for (const el of toRemove) el.parentNode?.removeChild(el);
        return { items, stripped: wrap.innerHTML.trim() };
      }
    }

    return { items: [], stripped: raw };
  }

  // Line-by-line fallback: handles markdown, plain text, and text mixed with inline HTML.
  // Skips blank lines between heading and items (Tebex markdown has blank lines between each item).
  const lines = raw.split('\n');
  let headIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    if (matchHead(lines[i])) { headIdx = i; break; }
  }

  if (headIdx >= 0) {
    let lastItemIdx = headIdx;

    for (let i = headIdx + 1; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (!trimmed) continue; // skip blank lines between items
      if (isNextSection(trimmed)) break;
      const clean = trimmed.replace(/<[^>]+>/g, '').replace(/^[-*•]\s*/, '').trim();
      if (clean.length > 0) {
        items.push(clean);
        lastItemIdx = i;
      }
      if (items.length >= 12) break;
    }

    if (items.length > 0) {
      // Remove heading through last item, plus any trailing blank lines
      let removeEnd = lastItemIdx;
      while (removeEnd + 1 < lines.length && !lines[removeEnd + 1].trim()) removeEnd++;
      const stripped = [...lines.slice(0, headIdx), ...lines.slice(removeEnd + 1)].join('\n').trim();
      return { items, stripped };
    }
  }

  return { items: [], stripped: raw };
}

export default function ProductClientPage({ params }: { params: Promise<{ id: string }> }) {
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
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [discordLinked, setDiscordLinked] = useState(false);
  const [discordId, setDiscordId] = useState<string | null>(null);
  const [discordVarIdentifier, setDiscordVarIdentifier] = useState<string | null>(null);
  const [needsDiscord, setNeedsDiscord] = useState(false);
  const [discordToast, setDiscordToast] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [giftUsername, setGiftUsername] = useState('');
  const [giftLoading, setGiftLoading] = useState(false);
  const [giftError, setGiftError] = useState<string | null>(null);
  const [giftErrorDetail, setGiftErrorDetail] = useState<{ status: number; body: unknown; raw: string } | null>(null);
  const [showGiftErrorDetail, setShowGiftErrorDetail] = useState(false);
  const [giftAdded, setGiftAdded] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [activeMedia, setActiveMedia] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [pendingAutoAdd, setPendingAutoAdd] = useState(false);
  const [fiveMToast, setFiveMToast] = useState(false);
  const [fiveMToastUsername, setFiveMToastUsername] = useState<string | null>(null);
  const [showDiscordModal, setShowDiscordModal] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  const handleAddToCartRef = useRef<() => void>(() => {});
  const { addItem, isAuthenticated, username, basket, refreshBasket } = useBasket();
  const { formatPrice } = useCurrency();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!username) { setAvatarUrl(null); return; }
    fetch(`/api/fivem-avatar?username=${encodeURIComponent(username)}`)
      .then((r) => r.json())
      .then((d) => setAvatarUrl(d.url || null))
      .catch(() => setAvatarUrl(null));
  }, [username]);

  useEffect(() => {
    setActiveMedia(0);
  }, [pkg?.id]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightboxOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxOpen]);

  useEffect(() => {
    const el = actionsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setShowStickyBar(!entry.isIntersecting), { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [pkg?.id]);

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
      setDiscordToast(true);
      setTimeout(() => setDiscordToast(false), 4000);
      localStorage.setItem('discord_linked_basket', basket.ident);
      if (discordIdParam) {
        setDiscordId(discordIdParam);
        localStorage.setItem('discord_ident_id', discordIdParam);
      }
      refreshBasket();
      const url = new URL(window.location.href);
      url.searchParams.delete('discord_linked');
      url.searchParams.delete('discord_id');
      window.history.replaceState({}, '', url.toString());
      // Auto-add if the user had clicked Add to Cart before connecting Discord
      const pendingPkg = localStorage.getItem('tebex_pending_add_pkg');
      if (pendingPkg) {
        localStorage.removeItem('tebex_pending_add_pkg');
        setPendingAutoAdd(true);
      }
    }
  }, [basket?.ident, discordLinkedParam, discordIdParam, refreshBasket]);

  // Detect return from FiveM auth — no URL params, use localStorage flag
  useEffect(() => {
    if (!isAuthenticated || !username) return;
    const pending = localStorage.getItem('tebex_fivem_auth_pending');
    if (!pending) return;
    localStorage.removeItem('tebex_fivem_auth_pending');
    setFiveMToastUsername(username);
    setFiveMToast(true);
    setTimeout(() => setFiveMToast(false), 4000);
    const pendingPkg = localStorage.getItem('tebex_pending_add_pkg');
    if (pendingPkg) {
      localStorage.removeItem('tebex_pending_add_pkg');
      setPendingAutoAdd(true);
    }
  }, [isAuthenticated, username]);

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

  useEffect(() => {
    if (pkg?.name) {
      document.title = `${pkg.name} | Flake Development | QBCore, Qbox & ESX FiveM Scripts`;
      return () => { document.title = 'Flake Development | QBCore, Qbox & ESX FiveM Scripts'; };
    }
  }, [pkg?.name]);

  // Variables that are NOT discord (those get the OAuth button, not a text input)
  const requiredVariables: TebexPackageVariable[] = (pkg?.variables ?? []).filter(
    (v: TebexPackageVariable) =>
      (v.required || v.required === 1) &&
      !v.identifier?.toLowerCase().includes('discord') &&
      !v.description?.toLowerCase().includes('discord'),
  );

  const handleFiveMLogin = async () => {
    setLoginLoading(true);
    setLoginError(null);
    try {
      const BASKET_KEY = 'tebex_basket_ident';
      let ident = localStorage.getItem(BASKET_KEY);
      if (!ident) {
        const origin = window.location.origin;
        const basket = await createBasket(`${origin}/cart`, `${origin}/checkout-complete`);
        if (!basket) throw new Error('Could not create a session. Please try again.');
        ident = basket.ident;
        localStorage.setItem(BASKET_KEY, ident);
      }
      const returnUrl = `${window.location.origin}${window.location.pathname}`;
      const authUrl = await getAuthUrl(ident, returnUrl);
      if (!authUrl) throw new Error('Could not get authentication URL. Please try again.');
      localStorage.setItem('tebex_fivem_auth_pending', '1');
      window.location.replace(authUrl);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      setLoginLoading(false);
    }
  };

  const handleGift = async () => {
    if (!pkg || !basket || !giftUsername.trim()) return;
    if (needsDiscord && !discordLinked) return;
    setGiftLoading(true);
    setGiftError(null);
    setGiftErrorDetail(null);
    setShowGiftErrorDetail(false);
    try {
      const varData: Record<string, string> = {};
      if (discordLinked && discordId && discordVarIdentifier) {
        varData[discordVarIdentifier] = discordId;
      } else if (discordLinked && discordId) {
        varData.discord_id = discordId;
      }
      await addToBasket(basket.ident, pkg.id, 1, Object.keys(varData).length > 0 ? varData : undefined, giftUsername.trim());
      await refreshBasket();
      setGiftAdded(true);
      setShowGiftModal(false);
      setGiftUsername('');
      setTimeout(() => setGiftAdded(false), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to gift item';
      const detail = (err as Error & { tebexDetail?: { status: number; body: unknown; raw: string } }).tebexDetail;
      setGiftError(message);
      if (detail) setGiftErrorDetail(detail);
    } finally {
      setGiftLoading(false);
    }
  };

  const handleAddToCart = useCallback(async () => {
    if (!pkg) return;

    if (!isAuthenticated) {
      if (pkg) localStorage.setItem('tebex_pending_add_pkg', String(pkg.id));
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
      setTimeout(() => setAdded(false), 5000);
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

  // Keep ref in sync so the auto-add effect always has the latest version
  useEffect(() => { handleAddToCartRef.current = handleAddToCart; }, [handleAddToCart]);

  // After Discord/FiveM connect, auto-add if there was a pending intent
  useEffect(() => {
    if (!pendingAutoAdd || !pkg) return;
    if (needsDiscord && !discordLinked) return;
    setPendingAutoAdd(false);
    setTimeout(() => handleAddToCartRef.current(), 100);
  }, [pendingAutoAdd, needsDiscord, discordLinked, pkg]);

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
  // discount field = dollar amount off (not percentage)
  const salePrice = hasDiscount ? Math.max(0, pkg.base_price - pkg.discount) : pkg.total_price;

  // Strip Requirements / Dependencies / Compatible sections before rendering description
  const req1 = extractSection(pkg.description || '', 'Requirements?');
  const req2 = extractSection(req1.stripped, 'Dependencies');
  const compat1 = extractSection(req2.stripped, 'Compatible with');
  const compat2 = extractSection(compat1.stripped, 'Compatibles');
  const compat3 = extractSection(compat2.stripped, 'Compatible');
  const fw1 = extractSection(compat3.stripped, 'Framework');
  const fw2 = extractSection(fw1.stripped, 'Frameworks');
  const requirementItems = req1.items;
  const dependencyItems = req2.items;
  const compatibleItems = [...compat1.items, ...compat2.items, ...compat3.items];
  const frameworkItems = [...fw1.items, ...fw2.items];
  const parsedDescription = parseDescription(fw2.stripped);

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Breadcrumb */}
        <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white/5 text-[#666] text-sm font-semibold mb-8">
          <Link href="/" className="flex items-center gap-1.5 hover:text-neutral-400 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.707 2.293l9 9c.63 .63 .184 1.707 -.707 1.707h-1v6a3 3 0 0 1 -3 3h-1v-7a3 3 0 0 0 -2.824 -2.995l-.176 -.005h-2a3 3 0 0 0 -3 3v7h-1a3 3 0 0 1 -3 -3v-6h-1c-.89 0 -1.337 -1.077 -.707 -1.707l9 -9a1 1 0 0 1 1.414 0m.293 11.707a1 1 0 0 1 1 1v7h-4v-7a1 1 0 0 1 .883 -.993l.117 -.007z" />
            </svg>
            Home
          </Link>
          <span>/</span>
          <Link href="/scripts" className="hover:text-neutral-400 transition">Scripts</Link>
          <span>/</span>
          <span className="text-neutral-500 truncate max-w-[200px] sm:max-w-xs">{pkg.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Media carousel */}
          <div className="md:sticky md:top-20 self-start">
            {(() => {
              const mediaItems = buildMediaItems(pkg);
              const cur = mediaItems[activeMedia] ?? '';
              const ytId = cur ? getYouTubeId(cur) : null;
              const isVideo = !!ytId;
              return (
                <>
                  <div className="relative bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-700 aspect-video group">
                    {mediaItems.length === 0 ? (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-blue-600/10">
                        <span className="text-6xl font-bold text-blue-500/50">{pkg.name.charAt(0)}</span>
                      </div>
                    ) : isVideo ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${ytId}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={pkg.name}
                      />
                    ) : (
                      <>
                        <img
                          src={cur}
                          alt={pkg.name}
                          className="w-full h-full object-contain cursor-zoom-in"
                          onClick={() => setLightboxOpen(true)}
                        />
                        <button
                          onClick={() => setLightboxOpen(true)}
                          className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {/* Prev/Next arrows */}
                    {mediaItems.length > 1 && (
                      <>
                        <button
                          onClick={() => setActiveMedia(i => (i - 1 + mediaItems.length) % mediaItems.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setActiveMedia(i => (i + 1) % mediaItems.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {/* Slide counter */}
                    {mediaItems.length > 1 && (
                      <div className="absolute bottom-3 right-3 bg-black/60 rounded-md px-2 py-0.5 text-xs text-white font-medium">
                        {activeMedia + 1} / {mediaItems.length}
                      </div>
                    )}
                  </div>

                  {/* Thumbnail strip */}
                  {mediaItems.length > 1 && (
                    <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                      {mediaItems.map((item, i) => {
                        const tid = getYouTubeId(item);
                        const thumb = tid
                          ? `https://img.youtube.com/vi/${tid}/mqdefault.jpg`
                          : item;
                        return (
                          <button
                            key={i}
                            onClick={() => setActiveMedia(i)}
                            className={`relative flex-shrink-0 w-16 h-11 rounded-lg overflow-hidden border-2 transition ${i === activeMedia ? 'border-blue-500' : 'border-neutral-700 hover:border-neutral-500'}`}
                          >
                            <img src={thumb} alt="" className="w-full h-full object-cover" />
                            {tid && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <div className="w-5 h-5 rounded-full bg-white/90 flex items-center justify-center">
                                  <svg className="w-2.5 h-2.5 text-black ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                </div>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Lightbox — rendered via portal on document.body to escape stacking contexts */}
                  {lightboxOpen && !isVideo && typeof document !== 'undefined' && createPortal(
                    <div
                      className="fixed inset-0 bg-black flex items-center justify-center p-4"
                      style={{ zIndex: 2147483647 }}
                      onClick={() => setLightboxOpen(false)}
                    >
                      <img
                        src={cur}
                        alt={pkg.name}
                        className="max-w-full max-h-full object-contain rounded-xl"
                        onClick={e => e.stopPropagation()}
                      />
                      <button
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
                        style={{ zIndex: 2147483647 }}
                      >
                        <X className="w-5 h-5" />
                      </button>
                      {mediaItems.length > 1 && (
                        <>
                          <button
                            onClick={e => { e.stopPropagation(); setActiveMedia(i => (i - 1 + mediaItems.length) % mediaItems.length); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); setActiveMedia(i => (i + 1) % mediaItems.length); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>
                        </>
                      )}
                    </div>,
                    document.body
                  )}
                </>
              );
            })()}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-blue-400 text-sm font-medium mb-2">{pkg.category?.name}</p>

                {/* Framework Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {(frameworkItems.length > 0 ? frameworkItems : ['QBCore', 'Qbox', 'ESX']).map((fw, i) => {
                    const lo = fw.toLowerCase();
                    const cls = lo.includes('esx') ? 'bg-orange-500/15 text-orange-400'
                      : lo.includes('qbox') ? 'bg-yellow-500/15 text-yellow-400'
                      : lo.includes('qb') ? 'bg-red-500/15 text-red-400'
                      : 'bg-blue-500/15 text-blue-400';
                    return <span key={i} className={`px-2.5 py-1 ${cls} text-xs font-semibold rounded`}>{fw}</span>;
                  })}
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
            <div className="mb-4 pb-4 border-b border-neutral-800">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-white">
                  {salePrice === 0 ? 'Free' : formatPrice(salePrice)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-neutral-600 line-through">
                    {formatPrice(pkg.base_price)}
                  </span>
                )}
              </div>
              <p className="text-neutral-500 text-sm mt-1">Tax included</p>
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
                </div>
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
                  <button
                    onClick={() => setShowDiscordModal(true)}
                    className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/30 hover:border-[#5865F2]/50 text-[#7289da] hover:text-[#8da0e1] font-semibold transition"
                  >
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 71 55" fill="currentColor">
                      <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.44077 45.4204 0.52529C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.52529C25.5141 0.44359 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"/>
                    </svg>
                    Connect Discord to Purchase
                  </button>
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
            <div className="space-y-3" ref={actionsRef}>
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

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-700 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {adding ? 'Adding...' : isAuthenticated ? 'Add to Cart' : 'Login to Purchase'}
                </button>

                {!pkg.disable_gifting && (
                  <button
                    onClick={() => { if (!isAuthenticated) { setShowLoginModal(true); } else { setShowGiftModal(true); } }}
                    className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-neutral-700 hover:border-blue-500/50 bg-neutral-800/50 hover:bg-blue-600/10 text-neutral-300 hover:text-blue-300 font-semibold transition"
                  >
                    <Gift className="w-4 h-4" />
                    Gift
                  </button>
                )}
              </div>
            </div>

            <div className="my-6 border-t border-neutral-800" />

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

            {/* Requirements card */}
            {requirementItems.length > 0 && (
              <div className="mb-5 border border-neutral-700/60 rounded-xl p-4 bg-neutral-800/30">
                <p className="uppercase tracking-wide text-neutral-500 text-xs font-bold mb-3">Requirements</p>
                <div className="space-y-2">
                  {requirementItems.map((item, i) => {
                    const type = getReqType(item);
                    const url = getDepUrl(item);
                    const label = item.replace(/https?:\/\/[^\s)>\]]+/g, '').replace(/[()[\]]/g, '').trim();
                    return (
                      <div key={i} className="flex items-center gap-2 text-sm text-neutral-300">
                        {type === 'framework' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400 flex-shrink-0">
                            <path d="M14 4h6v6h-6z"/><path d="M4 14h6v6h-6z"/><path d="M17 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M7 7m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>
                          </svg>
                        )}
                        {type === 'onesync' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400 flex-shrink-0">
                            <path d="M9.828 9.172a4 4 0 1 0 0 5.656a10 10 0 0 0 2.172 -2.828a10 10 0 0 1 2.172 -2.828a4 4 0 1 1 0 5.656a10 10 0 0 1 -2.172 -2.828a10 10 0 0 0 -2.172 -2.828"/>
                          </svg>
                        )}
                        {type === 'server' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400 flex-shrink-0">
                            <path d="M12 9v4"/><path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z"/><path d="M12 16h.01"/>
                          </svg>
                        )}
                        {(type === 'dependency' || type === 'default') && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400 flex-shrink-0">
                            <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2"/>
                          </svg>
                        )}
                        {url ? (
                          <a href={url} target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition flex items-center gap-0.5">
                            {label}
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 -ml-0.5">
                              <path d="M17 7l-10 10"/><path d="M8 7l9 0l0 9"/>
                            </svg>
                          </a>
                        ) : (
                          <span>{label}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Dependencies card */}
            {dependencyItems.length > 0 && (
              <div className="mb-5 border border-neutral-700/60 rounded-xl p-4 bg-neutral-800/30">
                <p className="uppercase tracking-wide text-neutral-500 text-xs font-bold mb-3">Dependencies</p>
                <div className="space-y-2">
                  {dependencyItems.map((item, i) => {
                    const url = getDepUrl(item);
                    const label = item.replace(/https?:\/\/[^\s)>\]]+/g, '').replace(/[()[\]]/g, '').trim();
                    return (
                      <div key={i} className="flex items-center gap-2 text-sm text-neutral-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400 flex-shrink-0">
                          <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2"/>
                        </svg>
                        {url ? (
                          <a href={url} target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition flex items-center gap-0.5">
                            {label}
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 -ml-0.5">
                              <path d="M17 7l-10 10"/><path d="M8 7l9 0l0 9"/>
                            </svg>
                          </a>
                        ) : (
                          <span>{label}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Framework card */}
            {frameworkItems.length > 0 && (
              <div className="mb-5 border border-neutral-700/60 rounded-xl p-4 bg-neutral-800/30">
                <p className="uppercase tracking-wide text-neutral-500 text-xs font-bold mb-3">Framework</p>
                <div className="space-y-2">
                  {frameworkItems.map((fw, i) => {
                    const url = getFrameworkUrl(fw);
                    const label = fw.replace(/[()[\]]/g, '').trim();
                    return (
                      <div key={i} className="flex items-center gap-2 text-sm text-neutral-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400 flex-shrink-0">
                          <path d="M14 4h6v6h-6z"/><path d="M4 14h6v6h-6z"/><path d="M17 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M7 7m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>
                        </svg>
                        {url ? (
                          <a href={url} target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition flex items-center gap-0.5">
                            {label}
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 -ml-0.5">
                              <path d="M17 7l-10 10"/><path d="M8 7l9 0l0 9"/>
                            </svg>
                          </a>
                        ) : (
                          <span>{label}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Compatible With card */}
            {compatibleItems.length > 0 && (
              <div className="mb-5 border border-neutral-700/60 rounded-xl p-4 bg-neutral-800/30">
                <p className="uppercase tracking-wide text-neutral-500 text-xs font-bold mb-3">Compatible With</p>
                <div className="space-y-2">
                  {compatibleItems.map((item, i) => {
                    const url = getDepUrl(item);
                    const label = item.replace(/https?:\/\/[^\s)>\]]+/g, '').replace(/[()[\]]/g, '').trim();
                    return (
                      <div key={i} className="flex items-center gap-2 text-sm text-neutral-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400 flex-shrink-0">
                          <path d="M12 3a9 9 0 1 0 0 18A9 9 0 0 0 12 3z"/><path d="M9 12l2 2l4-4"/>
                        </svg>
                        {url ? (
                          <a href={url} target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition flex items-center gap-0.5">
                            {label}
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 -ml-0.5">
                              <path d="M17 7l-10 10"/><path d="M8 7l9 0l0 9"/>
                            </svg>
                          </a>
                        ) : (
                          <span>{label}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Description with proper markdown rendering */}
            <div className="mb-8">
              <div
                className="text-neutral-400 leading-relaxed text-sm prose prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: parsedDescription }}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Cart added notification — drops down from top center */}
      {(added || giftAdded) && !lightboxOpen && (
        <div className="fixed top-4 inset-x-0 z-[60] flex justify-center px-4 pointer-events-none">
          <div className="w-full max-w-md pointer-events-auto animate-in slide-in-from-top-3 duration-300 drop-shadow-2xl">
            <div className="bg-neutral-900 border border-blue-600/40 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {pkg?.image ? (
                    <img src={pkg.image} alt={pkg?.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-neutral-800" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                      <ShoppingCart className="w-6 h-6 text-blue-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-green-400" />
                      </div>
                      <span className="text-green-400 text-xs font-bold uppercase tracking-wide">
                        {giftAdded ? 'Gift Added to Cart!' : 'Added to Cart!'}
                      </span>
                    </div>
                    <p className="text-white font-bold text-sm leading-snug truncate">{pkg?.name}</p>
                    {pkg && <p className="text-neutral-500 text-xs mt-0.5">{salePrice === 0 ? 'Free' : formatPrice(salePrice)}</p>}
                  </div>
                  <button
                    onClick={() => { setAdded(false); setGiftAdded(false); }}
                    className="text-neutral-600 hover:text-neutral-300 transition p-0.5 flex-shrink-0 mt-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-2 mt-3">
                  <Link
                    href="/cart"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    View Cart
                  </Link>
                  <Link
                    href="/scripts"
                    onClick={() => { setAdded(false); setGiftAdded(false); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-white font-semibold text-sm transition"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky bottom bar — appears when Add to Cart scrolls out of view */}
      {showStickyBar && !lightboxOpen && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-neutral-900/95 backdrop-blur-sm border-t border-neutral-800 py-3 animate-in slide-in-from-bottom-2 duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {pkg.image && (
                <img src={pkg.image} alt={pkg.name} className="w-11 h-11 rounded-xl object-cover flex-shrink-0 border border-neutral-700" />
              )}
              <div className="min-w-0">
                <p className="text-white font-semibold text-sm leading-tight truncate">{pkg.name}</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-blue-400 font-bold text-sm">{salePrice === 0 ? 'Free' : formatPrice(salePrice)}</span>
                  {hasDiscount && <span className="text-neutral-600 text-xs line-through">{formatPrice(pkg.base_price)}</span>}
                </div>
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="flex-shrink-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-700 text-white font-bold px-6 py-2.5 rounded-xl transition text-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              {adding ? 'Adding...' : isAuthenticated ? 'Add to Cart' : 'Login to Purchase'}
            </button>
          </div>
        </div>
      )}

      {/* Discord connected toast - top right slide in */}
      {discordToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-[#5865F2]/20 border border-[#5865F2]/40 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-2xl animate-slide-in-right">
          <svg className="w-7 h-7 text-[#5865F2] flex-shrink-0" viewBox="0 0 71 55" fill="currentColor">
            <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.44077 45.4204 0.52529C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.52529C25.5141 0.44359 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"/>
          </svg>
          <div>
            <p className="text-white font-semibold text-sm">Discord Connected!</p>
            <p className="text-[#7289da] text-xs mt-0.5">{discordId ? `Account ID: ${discordId}` : 'Your account has been linked'}</p>
          </div>
        </div>
      )}

      {/* FiveM connected toast - top right slide in */}
      {fiveMToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-orange-500/15 border border-orange-500/30 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-2xl animate-slide-in-right">
          <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 48 48" fill="#F97316" xmlns="http://www.w3.org/2000/svg">
            <polygon points="5,45 9,34 21,22 15,45"/>
            <polygon points="25,18 33,45 43,45 32,12"/>
            <polygon points="16.059,14.164 20,3 28,3"/>
            <polygon points="10.731,29.002 23,17 23,15 11.58,26.667"/>
            <polygon points="15.142,16.429 13,22 29.724,5.725 28.818,3.178"/>
            <polygon points="23.932,14.055 24.377,15.626 30.941,9.178 30.385,7.702"/>
          </svg>
          <div>
            <p className="text-white font-semibold text-sm">FiveM Connected!</p>
            <p className="text-orange-300 text-xs mt-0.5">{fiveMToastUsername ? `Logged in as ${fiveMToastUsername}` : 'Authentication successful'}</p>
          </div>
        </div>
      )}

      {/* Discord Integration Modal */}
      {showDiscordModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowDiscordModal(false); }}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm bg-[#313338] rounded-xl shadow-2xl overflow-hidden animate-fade-in">
            {/* Discord-style header */}
            <div className="relative bg-[#5865F2] h-16">
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                <div className="w-16 h-16 rounded-full bg-[#5865F2] border-[6px] border-[#313338] flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 71 55" fill="currentColor">
                    <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.44077 45.4204 0.52529C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.52529C25.5141 0.44359 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"/>
                  </svg>
                </div>
              </div>
              {/* Close button */}
              <button 
                onClick={() => setShowDiscordModal(false)} 
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white/70 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pt-12 pb-6 text-center">
              <h2 className="text-xl font-bold text-white mb-1">Connect Discord</h2>
              <p className="text-[#B5BAC1] text-sm mb-6">Link your Discord account to automatically receive server roles and exclusive perks with your purchase.</p>

              {/* Status indicator */}
              <div className="bg-[#2B2D31] rounded-lg p-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1E1F22] flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#B5BAC1]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium text-sm">Not Connected</p>
                    <p className="text-[#949BA4] text-xs">Click below to link your Discord</p>
                  </div>
                  <div className="ml-auto w-3 h-3 rounded-full bg-[#F0B232]" />
                </div>
              </div>

              {/* Connect button - Discord style with filled icon */}
              <button
                onClick={() => {
                  if (pkg) localStorage.setItem('tebex_pending_add_pkg', String(pkg.id));
                  const url = basket
                    ? `https://ident.tebex.io/discord/?basketIdent=${basket.ident}&return=${encodeURIComponent(`${window.location.origin}/api/discord/ident-callback?basketIdent=${basket.ident}&returnTo=${encodeURIComponent(window.location.pathname)}`)}`
                    : '#';
                  window.location.href = url;
                }}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-md bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium transition text-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 71 55" fill="currentColor">
                  <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.44077 45.4204 0.52529C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.52529C25.5141 0.44359 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"/>
                </svg>
                Authorize with Discord
              </button>

              {/* Only show skip option if Discord is NOT required */}
              {!needsDiscord && (
                <>
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-[#3F4147]" />
                    <span className="text-[#949BA4] text-xs">or</span>
                    <div className="flex-1 h-px bg-[#3F4147]" />
                  </div>
                  <button
                    onClick={() => setShowDiscordModal(false)}
                    className="w-full py-2.5 px-4 rounded-md bg-[#4E5058] hover:bg-[#6D6F78] text-white font-medium transition text-sm"
                  >
                    Skip for now
                  </button>
                </>
              )}

              {/* Back button - always show */}
              <button
                onClick={() => setShowDiscordModal(false)}
                className="mt-3 text-[#00A8FC] hover:underline text-sm font-medium"
              >
                Go Back
              </button>

              {needsDiscord && (
                <p className="text-[#F23F43] text-xs mt-4 flex items-center justify-center gap-1.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4" />
                    <path d="M12 16h.01" />
                  </svg>
                  Discord connection is required for this product
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Gift Modal */}
      {showGiftModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowGiftModal(false); }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden border border-neutral-800">
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600/15 flex items-center justify-center">
                  <Gift className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white leading-tight">Gift This Script</h2>
                  <p className="text-neutral-500 text-xs">Enter the recipient&apos;s FiveM username</p>
                </div>
              </div>
              <button onClick={() => setShowGiftModal(false)} className="text-neutral-400 hover:text-white transition p-1">
                <svg viewBox="0 0 15 15" fill="none" className="w-5 h-5">
                  <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
            <div className="px-6 pb-6">
              <input
                type="text"
                value={giftUsername}
                onChange={(e) => setGiftUsername(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleGift(); }}
                placeholder="e.g. FlakePlayer123"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition text-sm mb-3"
                autoFocus
              />
              {/* FiveM / Discord / Gifting-to info rows */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 divide-y divide-neutral-800 mb-3">
                {username && (
                  <div className="flex items-center gap-2 px-4 py-2.5">
                    <div className="w-4 h-4 rounded bg-red-600 overflow-hidden flex items-center justify-center flex-shrink-0">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={username} className="w-full h-full object-cover" onError={() => setAvatarUrl(null)} />
                      ) : (
                        <span className="text-white font-bold text-[9px] leading-none">M</span>
                      )}
                    </div>
                    <span className="text-neutral-500 text-xs">FiveM:</span>
                    <span className="text-white text-xs">{username}</span>
                  </div>
                )}
                {needsDiscord && (
                  discordLinked ? (
                    <div className="flex items-center gap-2 px-4 py-2.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-400 flex-shrink-0">
                        <path d="M14.983 3l.123 .006c2.014 .214 3.527 .672 4.966 1.673a1 1 0 0 1 .371 .488c1.876 5.315 2.373 9.987 1.451 12.28c-1.003 2.005 -2.606 3.553 -4.394 3.553c-.732 0 -1.693 -.968 -2.328 -2.045a21.512 21.512 0 0 0 2.103 -.493a1 1 0 1 0 -.55 -1.924c-3.32 .95 -6.13 .95 -9.45 0a1 1 0 0 0 -.55 1.924c.717 .204 1.416 .37 2.103 .494c-.635 1.075 -1.596 2.044 -2.328 2.044c-1.788 0 -3.391 -1.548 -4.428 -3.629c-.888 -2.217 -.39 -6.89 1.485 -12.204a1 1 0 0 1 .371 -.488c1.439 -1.001 2.952 -1.459 4.966 -1.673a1 1 0 0 1 .935 .435l.063 .107l.651 1.285l.137 -.016a12.97 12.97 0 0 1 2.643 0l.134 .016l.65 -1.284a1 1 0 0 1 .754 -.54l.122 -.009zm-5.983 7a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15zm6 0a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15z"/>
                      </svg>
                      <span className="text-neutral-500 text-xs">Discord:</span>
                      <span className="text-indigo-300 text-xs font-semibold">Connected</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-400 flex-shrink-0">
                        <path d="M14.983 3l.123 .006c2.014 .214 3.527 .672 4.966 1.673a1 1 0 0 1 .371 .488c1.876 5.315 2.373 9.987 1.451 12.28c-1.003 2.005 -2.606 3.553 -4.394 3.553c-.732 0 -1.693 -.968 -2.328 -2.045a21.512 21.512 0 0 0 2.103 -.493a1 1 0 1 0 -.55 -1.924c-3.32 .95 -6.13 .95 -9.45 0a1 1 0 0 0 -.55 1.924c.717 .204 1.416 .37 2.103 .494c-.635 1.075 -1.596 2.044 -2.328 2.044c-1.788 0 -3.391 -1.548 -4.428 -3.629c-.888 -2.217 -.39 -6.89 1.485 -12.204a1 1 0 0 1 .371 -.488c1.439 -1.001 2.952 -1.459 4.966 -1.673a1 1 0 0 1 .935 .435l.063 .107l.651 1.285l.137 -.016a12.97 12.97 0 0 1 2.643 0l.134 .016l.65 -1.284a1 1 0 0 1 .754 -.54l.122 -.009zm-5.983 7a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15zm6 0a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15z"/>
                      </svg>
                      <span className="text-neutral-500 text-xs">Discord:</span>
                      <a
                        href={basket && typeof window !== 'undefined'
                          ? `https://ident.tebex.io/discord/?basketIdent=${basket.ident}&return=${encodeURIComponent(`${window.location.origin}/api/discord/ident-callback?basketIdent=${basket.ident}&returnTo=${encodeURIComponent(window.location.pathname)}`)}`
                          : '#'}
                        className="text-blue-400 text-xs font-semibold hover:text-blue-300 transition"
                      >
                        Connect to gift
                      </a>
                    </div>
                  )
                )}
                {giftUsername.trim() && (
                  <div className="flex items-center gap-2 px-4 py-2.5">
                    <Gift className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span className="text-neutral-500 text-xs">Gifting to:</span>
                    <span className="text-white text-xs font-semibold">{giftUsername.trim()}</span>
                  </div>
                )}
              </div>
              {giftError && !(!discordLinked) && (
                <div className="mb-3 bg-red-900/20 border border-red-900 rounded-xl p-3 text-red-300 text-sm">
                  <div className="flex gap-2 items-start">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span className="flex-1">{giftError}</span>
                  </div>
                </div>
              )}
              <p className="text-neutral-600 text-xs mb-4">
                {pkg?.name}{' '}will be delivered to this player&apos;s Cfx.re account after checkout.
              </p>
              <button
                onClick={handleGift}
                disabled={giftLoading || !giftUsername.trim() || !discordLinked}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-neutral-700 hover:border-blue-500/50 bg-blue-600/5 hover:bg-blue-600/15 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-300 hover:text-blue-300 font-bold transition"
              >
                {giftLoading ? (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                ) : (
                  <Gift className="w-4 h-4" />
                )}
                {giftLoading ? 'Adding gift...' : 'Add Gift to Cart'}
              </button>
              {!discordLinked && (
                <a
                  href={basket && typeof window !== 'undefined'
                    ? `https://ident.tebex.io/discord/?basketIdent=${basket.ident}&return=${encodeURIComponent(`${window.location.origin}/api/discord/ident-callback?basketIdent=${basket.ident}&returnTo=${encodeURIComponent(window.location.pathname)}`)}`
                    : '#'}
                  className="mt-3 flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/30 hover:border-[#5865F2]/50 text-[#7289da] hover:text-[#8da0e1] font-semibold transition"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 71 55" fill="currentColor">
                    <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.44077 45.4204 0.52529C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.52529C25.5141 0.44359 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"/>
                  </svg>
                  Connect Discord
                </a>
              )}
            </div>
          </div>
        </div>
      )}

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
              {loginError && (
                <p className="mb-4 text-red-400 text-sm text-center">{loginError}</p>
              )}
              <div className="flex justify-center">
                <button
                  onClick={handleFiveMLogin}
                  disabled={loginLoading}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white transition"
                >
                  {loginLoading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 0C4.03 0 0 4.03 0 9C0 13.97 4.03 18 9 18C13.97 18 18 13.97 18 9C18 4.03 13.97 0 9 0ZM9 2.7C10.49 2.7 11.7 3.91 11.7 5.4C11.7 6.89 10.49 8.1 9 8.1C7.51 8.1 6.3 6.89 6.3 5.4C6.3 3.91 7.51 2.7 9 2.7ZM9 15.48C6.75 15.48 4.76 14.33 3.6 12.59C3.63 10.84 7.2 9.882 9 9.882C10.791 9.882 14.37 10.84 14.4 12.59C13.24 14.33 11.25 15.48 9 15.48Z" fill="currentColor"/>
                      </svg>
                      Login with FiveM
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
