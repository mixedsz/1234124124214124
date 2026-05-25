'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  Terminal,
  Wrench,
  LifeBuoy,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
}

interface NavSection {
  title: string;
  icon: React.ReactNode;
  items: NavItem[];
  defaultOpen?: boolean;
}

const NAV: NavSection[] = [
  {
    title: 'Getting Started',
    icon: <BookOpen className="w-4 h-4" />,
    defaultOpen: true,
    items: [
      { title: 'Introduction', href: '/docs' },
      { title: 'FiveM Escrow Errors', href: '/docs/escrow-errors' },
    ],
  },
  {
    title: 'Scripts',
    icon: <Terminal className="w-4 h-4" />,
    defaultOpen: false,
    items: [
      { title: 'Vehicle Scripts', href: '/docs/scripts/vehicle' },
      { title: 'UI / HUD Scripts', href: '/docs/scripts/ui' },
      { title: 'Utility Scripts', href: '/docs/scripts/utility' },
    ],
  },
  {
    title: 'Configuration',
    icon: <Wrench className="w-4 h-4" />,
    defaultOpen: false,
    items: [
      { title: 'Config Files', href: '/docs/config' },
      { title: 'Frameworks', href: '/docs/frameworks' },
      { title: 'Locales', href: '/docs/locales' },
    ],
  },
  {
    title: 'Troubleshooting',
    icon: <LifeBuoy className="w-4 h-4" />,
    defaultOpen: false,
    items: [
      { title: 'Common Issues', href: '/docs/common-issues' },
      { title: 'Performance Tips', href: '/docs/performance' },
    ],
  },
];

function SidebarSection({ section, activePath }: { section: NavSection; activePath: string }) {
  const hasActive = section.items.some(i => i.href === activePath);
  const [open, setOpen] = useState(section.defaultOpen || hasActive);

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-neutral-400 hover:text-white transition text-xs font-semibold uppercase tracking-wider"
      >
        <span className="flex items-center gap-2">
          {section.icon}
          {section.title}
        </span>
        {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>

      {open && (
        <ul className="mt-1 ml-2 space-y-0.5">
          {section.items.map(item => {
            const isActive = activePath === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-3 py-1.5 rounded-lg text-sm transition ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 font-medium border-l-2 border-blue-500'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 flex-shrink-0 border-r border-neutral-800 sticky top-0 h-[calc(100vh-64px)] overflow-y-auto py-6 px-4">
      <div className="mb-6 px-2">
        <p className="text-xs text-neutral-600 uppercase tracking-widest font-semibold mb-0.5">Flake Development</p>
        <p className="text-white font-bold text-base">Documentation</p>
      </div>

      <nav className="space-y-3 flex-1">
        {NAV.map(section => (
          <SidebarSection key={section.title} section={section} activePath={pathname} />
        ))}
      </nav>

      <div className="mt-6 pt-6 border-t border-neutral-800 px-2 space-y-2">
        <a
          href="https://discord.gg/flakedev"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition"
        >
          <svg className="w-4 h-4 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
          </svg>
          Join Discord
        </a>
        <Link href="/support" className="flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition">
          <LifeBuoy className="w-4 h-4" />
          Open a Ticket
        </Link>
      </nav>

      <div className="mt-4">
        <a
          href="https://discord.gg/flakedev"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-neutral-600 hover:text-neutral-400 transition px-2"
        >
          <ExternalLink className="w-3 h-3" />
          discord.gg/flakedev
        </a>
      </div>
    </aside>
  );
}
