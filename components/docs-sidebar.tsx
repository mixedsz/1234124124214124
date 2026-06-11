'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { DOCS_SEARCH_INDEX } from '@/data/docs-search-index';
import {
  BookOpen,
  Terminal,
  LifeBuoy,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Search,
} from 'lucide-react';

interface NavSection {
  label: string;
  id: string;
}

interface NavItem {
  title: string;
  href: string;
  sections?: NavSection[];
}

interface NavGroup {
  title: string;
  icon: React.ReactNode;
  items: NavItem[];
}

const NAV: NavGroup[] = [
  {
    title: 'Getting Started',
    icon: <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />,
    items: [
      {
        title: 'Introduction',
        href: '/docs',
        sections: [
          { label: 'Browse Scripts', id: 'browse' },
          { label: 'Getting Started', id: 'getting-started' },
        ],
      },
    ],
  },
  {
    title: 'Scripts',
    icon: <Terminal className="w-3.5 h-3.5 flex-shrink-0" />,
    items: [
      {
        title: 'Flake Smoking & Vaping',
        href: '/docs/smoking',
        sections: [
          { label: 'Overview', id: 'overview' },
          { label: 'Installation', id: 'installation' },
          { label: 'Configuration', id: 'configuration' },
          { label: 'Usage & Controls', id: 'usage' },
          { label: 'Items', id: 'items' },
          { label: 'Troubleshooting', id: 'troubleshooting' },
        ],
      },
      {
        title: 'Flake Shops',
        href: '/docs/shops',
        sections: [
          { label: 'Overview', id: 'overview' },
          { label: 'Installation', id: 'installation' },
          { label: 'Configuration', id: 'configuration' },
          { label: 'Pickup System', id: 'pickup-system' },
          { label: 'Admin Panel', id: 'admin-panel' },
          { label: 'Events', id: 'events' },
          { label: 'Commands', id: 'commands' },
          { label: 'Troubleshooting', id: 'troubleshooting' },
        ],
      },
      {
        title: 'Flake Addiction',
        href: '/docs/addiction',
        sections: [
          { label: 'Overview', id: 'overview' },
          { label: 'Installation', id: 'installation' },
          { label: 'Configuration', id: 'configuration' },
          { label: 'Usage & Effects', id: 'usage-effects' },
          { label: 'Items', id: 'items' },
          { label: 'Addiction Creator', id: 'addiction-creator' },
          { label: 'Database', id: 'database' },
          { label: 'Events', id: 'events' },
          { label: 'Commands', id: 'commands' },
          { label: 'Troubleshooting', id: 'troubleshooting' },
        ],
      },
      {
        title: 'Flake Bodybag',
        href: '/docs/flake_bodybag',
        sections: [
          { label: 'Overview', id: 'overview' },
          { label: 'Installation', id: 'installation' },
          { label: 'Configuration', id: 'configuration' },
          { label: 'Usage', id: 'usage' },
          { label: 'Features', id: 'features' },
          { label: 'Commands', id: 'commands' },
          { label: 'Troubleshooting', id: 'troubleshooting' },
        ],
      },
      {
        title: 'Flake Loading Screen',
        href: '/docs/flake_loading',
        sections: [
          { label: 'Overview', id: 'overview' },
          { label: 'Installation', id: 'installation' },
          { label: 'Video & Music', id: 'videos' },
          { label: 'Configuration', id: 'configuration' },
          { label: 'Troubleshooting', id: 'troubleshooting' },
        ],
      },
      {
        title: 'Flake Physical Therapy',
        href: '/docs/flake_physicaltherapy',
        sections: [
          { label: 'Overview', id: 'overview' },
          { label: 'Installation', id: 'installation' },
          { label: 'Configuration', id: 'configuration' },
          { label: 'Usage', id: 'usage' },
          { label: 'Crutch Support', id: 'crutch' },
          { label: 'Adding Locations', id: 'locations' },
          { label: 'Troubleshooting', id: 'troubleshooting' },
        ],
      },
      {
        title: 'Flake One-Hand Weapons',
        href: '/docs/flake_onehandweapon',
        sections: [
          { label: 'Overview', id: 'overview' },
          { label: 'Installation', id: 'installation' },
          { label: 'Configuration', id: 'configuration' },
          { label: 'Commands', id: 'commands' },
          { label: 'Troubleshooting', id: 'troubleshooting' },
        ],
      },
      {
        title: 'Flake Blackmarkets',
        href: '/docs/flake_blackmarkets',
        sections: [
          { label: 'Overview', id: 'overview' },
          { label: 'Installation', id: 'installation' },
          { label: 'Configuration', id: 'configuration' },
          { label: 'Usage', id: 'usage' },
          { label: 'Commands', id: 'commands' },
          { label: 'Troubleshooting', id: 'troubleshooting' },
        ],
      },
      {
        title: 'Flake AI EMS',
        href: '/docs/flake_aiems',
        sections: [
          { label: 'Overview', id: 'overview' },
          { label: 'Installation', id: 'installation' },
          { label: 'Configuration', id: 'configuration' },
          { label: 'Framework Compatibility', id: 'frameworks' },
          { label: 'Troubleshooting', id: 'troubleshooting' },
        ],
      },
      {
        title: 'Flake Scoreboard',
        href: '/docs/flake_scoreboard',
        sections: [
          { label: 'Overview', id: 'overview' },
          { label: 'Installation', id: 'installation' },
          { label: 'Configuration', id: 'configuration' },
          { label: 'Customization', id: 'customization' },
          { label: 'Troubleshooting', id: 'troubleshooting' },
        ],
      },
      {
        title: 'Flake Wearables',
        href: '/docs/flake_wearables',
        sections: [
          { label: 'Overview', id: 'overview' },
          { label: 'Installation', id: 'installation' },
          { label: 'Configuration', id: 'configuration' },
          { label: 'Adding Items', id: 'adding-items' },
          { label: 'Troubleshooting', id: 'troubleshooting' },
        ],
      },
    ],
  },
  {
    title: 'Troubleshooting',
    icon: <LifeBuoy className="w-3.5 h-3.5 flex-shrink-0" />,
    items: [
      {
        title: 'FiveM Escrow Errors',
        href: '/docs/escrow-errors',
        sections: [
          { label: 'Syntax error near <\\1>', id: 'syntax' },
          { label: 'Failed to verify resource', id: 'verify' },
          { label: 'You lack entitlement', id: 'entitlement' },
        ],
      },
    ],
  },
];

interface SidebarContentProps {
  activePath: string;
  expandedPages: Set<string>;
  onTogglePage: (href: string) => void;
  filter: string;
  onNavigate?: () => void;
}

function SidebarContent({ activePath, expandedPages, onTogglePage, filter, onNavigate }: SidebarContentProps) {
  return (
    <nav className="space-y-5 flex-1">
      {NAV.map(group => {
        const filteredItems = filter
          ? group.items.filter(i => i.title.toLowerCase().includes(filter.toLowerCase()))
          : group.items;
        if (filter && filteredItems.length === 0) return null;

        return (
          <div key={group.title}>
            {/* Category header — always visible, no collapse */}
            <div className="flex items-center gap-2 px-2 py-1 mb-1">
              <span className="text-neutral-600">{group.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">
                {group.title}
              </span>
            </div>

            {/* Page items */}
            <ul className="space-y-0.5">
              {filteredItems.map(item => {
                const isActive = activePath === item.href;
                const hasSections = item.sections && item.sections.length > 0;
                const isExpanded = expandedPages.has(item.href);

                return (
                  <li key={item.href}>
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm transition truncate ${
                          isActive
                            ? 'bg-blue-600/15 text-blue-400 font-semibold border-l-2 border-blue-500'
                            : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                        }`}
                      >
                        {item.title}
                      </Link>
                      {hasSections && (
                        <button
                          onClick={() => onTogglePage(item.href)}
                          className="flex-shrink-0 p-1.5 mr-0.5 text-neutral-600 hover:text-neutral-400 transition rounded"
                          aria-label="Toggle sections"
                        >
                          <ChevronDown
                            className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? '' : '-rotate-90'}`}
                          />
                        </button>
                      )}
                    </div>

                    {/* Section sub-items */}
                    {hasSections && isExpanded && (
                      <ul className="ml-4 mt-0.5 mb-1.5 space-y-0.5 border-l border-neutral-800 pl-3">
                        {item.sections!.map(s => (
                          <li key={s.id}>
                            <a
                              href={`${item.href}#${s.id}`}
                              onClick={onNavigate}
                              className="block text-xs text-neutral-500 hover:text-neutral-300 py-1 transition truncate"
                            >
                              {s.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

function DocsSearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const results = query.trim()
    ? DOCS_SEARCH_INDEX.filter(entry => {
        const q = query.toLowerCase();
        return (
          entry.title.toLowerCase().includes(q) ||
          entry.content.toLowerCase().includes(q) ||
          (entry.section?.toLowerCase().includes(q) ?? false)
        );
      })
    : [];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-800">
          <svg className="w-4 h-4 text-neutral-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search across all pages…"
            className="flex-1 bg-transparent text-white placeholder-neutral-500 text-sm focus:outline-none"
          />
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-white transition text-[11px] font-mono"
          >
            ESC
          </button>
        </div>

        {/* Body */}
        <div className="max-h-80 overflow-y-auto">
          {query.trim() === '' ? (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-600">
              <svg className="w-10 h-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <span className="text-sm">Type to search across all pages…</span>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-600">
              <span className="text-sm">No results for &ldquo;{query}&rdquo;</span>
            </div>
          ) : (
            <div className="py-2">
              {results.map((entry, i) => {
                const q = query.toLowerCase();
                const idx = entry.content.toLowerCase().indexOf(q);
                let excerpt = '';
                if (idx !== -1) {
                  const start = Math.max(0, idx - 40);
                  const raw = entry.content.slice(start, idx + query.length + 60);
                  excerpt = (start > 0 ? '…' : '') + raw + (start + raw.length < entry.content.length ? '…' : '');
                } else {
                  excerpt = entry.content.slice(0, 100) + '…';
                }
                return (
                  <Link
                    key={i}
                    href={entry.href}
                    onClick={onClose}
                    className="flex flex-col px-4 py-3 hover:bg-neutral-800 transition border-b border-neutral-800/60 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-medium">{entry.title}</span>
                      {entry.section && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-600/20 text-blue-400 font-medium">{entry.section}</span>
                      )}
                    </div>
                    <span className="text-neutral-500 text-xs mt-1 leading-relaxed line-clamp-2">{excerpt}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function DocsSidebar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [expandedPages, setExpandedPages] = useState<Set<string>>(() => new Set([pathname]));

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === '/' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  function togglePage(href: string) {
    setExpandedPages(prev => {
      const next = new Set(prev);
      if (next.has(href)) next.delete(href);
      else next.add(href);
      return next;
    });
  }

  return (
    <div className="hidden lg:flex flex-col w-64 xl:w-72 flex-shrink-0 border-r border-blue-500/20 bg-blue-950/10">
      {searchOpen && <DocsSearchModal onClose={() => setSearchOpen(false)} />}
      <aside className="flex flex-col sticky top-16 h-[calc(100vh-64px)] overflow-y-auto py-6 px-4 docs-scrollbar">
        {/* Brand label */}
        <div className="mb-4 px-2">
          <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-bold mb-0.5">Flake Development</p>
          <p className="text-white font-bold text-base">Documentation</p>
        </div>

        {/* Search trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="mb-5 w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-neutral-800/60 border border-neutral-700/60 text-sm text-neutral-500 hover:border-neutral-600 hover:text-neutral-400 transition text-left"
        >
          <Search className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="flex-1">Search docs...</span>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-700/60 text-neutral-500 font-mono">/</kbd>
        </button>

        <SidebarContent
          activePath={pathname}
          expandedPages={expandedPages}
          onTogglePage={togglePage}
          filter=""
        />

        {/* Bottom links */}
        <div className="mt-6 pt-5 border-t border-neutral-800 px-2 space-y-1">
          <a
            href="https://discord.gg/flakedev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-neutral-500 hover:text-white hover:bg-neutral-800/60 transition"
          >
            <svg className="w-4 h-4 text-[#5865F2] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
            </svg>
            Join Discord
          </a>
          <Link
            href="/support"
            className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-neutral-500 hover:text-white hover:bg-neutral-800/60 transition"
          >
            <LifeBuoy className="w-4 h-4 flex-shrink-0" />
            Open a Ticket
          </Link>
        </div>
      </aside>
    </div>
  );
}

export function DocsMobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expandedPages, setExpandedPages] = useState<Set<string>>(() => new Set([pathname]));

  function togglePage(href: string) {
    setExpandedPages(prev => {
      const next = new Set(prev);
      if (next.has(href)) next.delete(href);
      else next.add(href);
      return next;
    });
  }

  // Prevent body scroll when mobile nav is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  let currentTitle = 'Documentation';
  for (const group of NAV) {
    for (const item of group.items) {
      if (item.href === pathname) {
        currentTitle = item.title;
        break;
      }
    }
  }

  return (
    <div className="lg:hidden border-b border-neutral-800 bg-neutral-900 sticky top-16 z-40">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-3"
      >
        <div className="flex items-center gap-2 text-sm min-w-0">
          <BookOpen className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span className="text-neutral-500 flex-shrink-0">Docs</span>
          <ChevronRight className="w-3 h-3 text-neutral-600 flex-shrink-0" />
          <span className="text-white font-medium truncate">{currentTitle}</span>
        </div>
        {open
          ? <X className="w-4 h-4 text-neutral-400 flex-shrink-0 ml-3" />
          : <Menu className="w-4 h-4 text-neutral-400 flex-shrink-0 ml-3" />
        }
      </button>

      {open && (
        <div className="border-t border-neutral-800 bg-neutral-900 max-h-[calc(100vh-8rem)] overflow-y-auto overscroll-contain">
          <div className="px-4 py-4">
            <SidebarContent
              activePath={pathname}
              expandedPages={expandedPages}
              onTogglePage={togglePage}
              filter=""
              onNavigate={() => setOpen(false)}
            />
            <div className="pt-4 mt-4 border-t border-neutral-800 space-y-1">
              <a
                href="https://discord.gg/flakedev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition py-1.5 px-2"
              >
                <svg className="w-4 h-4 text-[#5865F2] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                </svg>
                Join Discord
              </a>
              <Link
                href="/support"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition py-1.5 px-2"
              >
                <LifeBuoy className="w-4 h-4 flex-shrink-0" />
                Open a Ticket
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
