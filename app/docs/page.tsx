'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Terminal,
  Wrench,
  LifeBuoy,
  Copy,
  Check,
  Info,
  AlertTriangle,
  ExternalLink,
  Hash,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
}

interface NavSection {
  title: string;
  icon: React.ReactNode;
  items: NavItem[];
  defaultOpen?: boolean;
}

// ── Sidebar data ──────────────────────────────────────────────────────────────

const NAV: NavSection[] = [
  {
    title: 'Getting Started',
    icon: <BookOpen className="w-4 h-4" />,
    defaultOpen: true,
    items: [
      { title: 'Introduction', href: '#intro' },
      { title: 'Installation Guide', href: '#installation' },
      { title: 'Server Requirements', href: '#requirements' },
      { title: 'Configuration Basics', href: '#configuration' },
    ],
  },
  {
    title: 'Scripts',
    icon: <Terminal className="w-4 h-4" />,
    defaultOpen: false,
    items: [
      { title: 'Vehicle Scripts', href: '#vehicle' },
      { title: 'UI / HUD Scripts', href: '#ui' },
      { title: 'Utility Scripts', href: '#utility' },
    ],
  },
  {
    title: 'Configuration',
    icon: <Wrench className="w-4 h-4" />,
    defaultOpen: false,
    items: [
      { title: 'Config Files', href: '#config-files' },
      { title: 'Frameworks', href: '#frameworks' },
      { title: 'Locales', href: '#locales' },
    ],
  },
  {
    title: 'Troubleshooting',
    icon: <LifeBuoy className="w-4 h-4" />,
    defaultOpen: false,
    items: [
      { title: 'Common Issues', href: '#common-issues' },
      { title: 'Error Messages', href: '#errors' },
      { title: 'Performance Tips', href: '#performance' },
    ],
  },
];

// ── Code block ────────────────────────────────────────────────────────────────

function CodeBlock({ code, lang = 'bash', filename }: { code: string; lang?: string; filename?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="rounded-xl overflow-hidden border border-neutral-700/60 my-4">
      <div className="flex items-center justify-between bg-neutral-800 px-4 py-2.5 border-b border-neutral-700/60">
        <span className="text-neutral-400 text-xs font-mono">{filename ?? lang}</span>
        <button onClick={copy} className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-200 transition text-xs">
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="bg-neutral-800/60 px-4 py-4 overflow-x-auto text-sm leading-relaxed">
        <code className="text-green-400 font-mono">{code}</code>
      </pre>
    </div>
  );
}

// ── Callout ───────────────────────────────────────────────────────────────────

function Callout({ type = 'info', children }: { type?: 'info' | 'warning' | 'tip'; children: React.ReactNode }) {
  const styles = {
    info:    { border: 'border-blue-500/30',   bg: 'bg-blue-500/5',   icon: <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />,            label: 'Info' },
    warning: { border: 'border-yellow-500/30', bg: 'bg-yellow-500/5', icon: <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />, label: 'Note' },
    tip:     { border: 'border-green-500/30',  bg: 'bg-green-500/5',  icon: <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />,          label: 'Tip' },
  }[type];
  return (
    <div className={`flex gap-3 rounded-xl border ${styles.border} ${styles.bg} px-4 py-3 my-4`}>
      {styles.icon}
      <div className="text-sm text-neutral-300 leading-relaxed">{children}</div>
    </div>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="group flex items-center gap-2 text-2xl font-bold text-white mt-12 mb-4 scroll-mt-24">
      {children}
      <a href={`#${id}`} className="opacity-0 group-hover:opacity-40 hover:!opacity-100 transition">
        <Hash className="w-5 h-5" />
      </a>
    </h2>
  );
}

function H3({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24">
      {children}
    </h3>
  );
}

// ── Step card ─────────────────────────────────────────────────────────────────

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold mt-0.5">
        {n}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-white mb-2">{title}</p>
        <div className="text-neutral-400 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

// ── Sidebar section ───────────────────────────────────────────────────────────

function SidebarSection({ section, active }: { section: NavSection; active: string }) {
  const [open, setOpen] = useState(section.defaultOpen ?? false);
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
          {section.items.map(item => (
            <li key={item.href}>
              <a
                href={item.href}
                className={`block px-3 py-1.5 rounded-lg text-sm transition ${
                  active === item.href
                    ? 'bg-blue-600/15 text-blue-400 font-medium border-l-2 border-blue-500'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DocsPage() {
  const [active] = useState('#intro');

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      <Header />

      <div className="flex flex-1 max-w-[1400px] mx-auto w-full">

        {/* ── Left sidebar ────────────────────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-64 xl:w-72 flex-shrink-0 border-r border-neutral-800 sticky top-0 h-[calc(100vh-64px)] overflow-y-auto py-6 px-4">
          <div className="mb-6 px-2">
            <p className="text-xs text-neutral-600 uppercase tracking-widest font-semibold mb-0.5">Flake Development</p>
            <p className="text-white font-bold text-base">Documentation</p>
          </div>

          <nav className="space-y-3 flex-1">
            {NAV.map(section => (
              <SidebarSection key={section.title} section={section} active={active} />
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
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0">
          <div className="max-w-3xl mx-auto px-6 lg:px-10 py-10">

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-neutral-600 mb-8">
              <Link href="/" className="hover:text-neutral-400 transition">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-neutral-400">Documentation</span>
            </div>

            {/* ── Introduction ─────────────────────────────────────────── */}
            <section id="intro" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                </div>
                <h1 className="text-3xl font-bold text-white">Documentation</h1>
              </div>
              <p className="text-neutral-400 text-base leading-relaxed mb-4">
                Welcome to the Flake Development documentation. Everything you need to install, configure, and get the most out of our FiveM scripts.
              </p>
              <Callout type="tip">
                All scripts come with free lifetime updates. If you run into an issue, open a ticket in our{' '}
                <a href="https://discord.gg/flakedev" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300">Discord server</a>{' '}
                and our team will help you out.
              </Callout>
            </section>

            <hr className="border-neutral-800 my-10" />

            {/* ── Installation ─────────────────────────────────────────── */}
            <section id="installation" className="scroll-mt-24">
              <H2 id="installation">Installation Guide</H2>
              <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                Follow these steps to get any Flake Development script running on your server.
              </p>

              <Step n={1} title="Purchase & Download">
                After purchasing from our store, log into your{' '}
                <a href="https://tebex.io" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Tebex account</a>{' '}
                and download the script. You will receive a <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-xs text-green-400 font-mono">.zip</code> containing all resource files.
              </Step>

              <Step n={2} title="Extract to Resources">
                Unzip the archive and move the resource folder into your server&apos;s resources directory.
                <CodeBlock
                  filename="server directory"
                  code="/resources/[scripts]/your-script-name/"
                />
              </Step>

              <Step n={3} title="Add to server.cfg">
                Ensure the resource starts with your server by adding it to <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-xs text-green-400 font-mono">server.cfg</code>.
                <CodeBlock filename="server.cfg" code="ensure your-script-name" />
              </Step>

              <Step n={4} title="Configure the Script">
                Open <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-xs text-green-400 font-mono">config.lua</code> inside the resource folder. Every option includes a comment explaining what it does.
              </Step>

              <Callout type="warning">
                Always restart your server fully after adding a new resource. Hot-reloading with <code className="bg-neutral-800 px-1 py-0.5 rounded text-xs font-mono">ensure</code> alone can cause unexpected issues.
              </Callout>
            </section>

            <hr className="border-neutral-800 my-10" />

            {/* ── Requirements ─────────────────────────────────────────── */}
            <section id="requirements" className="scroll-mt-24">
              <H2 id="requirements">Server Requirements</H2>
              <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                All Flake Development scripts are designed to run on modern FiveM servers. The table below outlines the minimum setup.
              </p>

              <div className="rounded-xl border border-neutral-800 overflow-hidden my-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-800/60 text-left">
                      <th className="px-4 py-3 text-neutral-300 font-semibold">Requirement</th>
                      <th className="px-4 py-3 text-neutral-300 font-semibold">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {[
                      ['Framework', 'QBCore, Qbox, or ESX'],
                      ['FiveM Build', '4755 or newer (latest recommended)'],
                      ['oxmysql', 'Required for database scripts'],
                      ['ox_lib', 'Required for UI scripts'],
                    ].map(([req, det]) => (
                      <tr key={req} className="hover:bg-neutral-800/30 transition">
                        <td className="px-4 py-3 text-neutral-300 font-medium">{req}</td>
                        <td className="px-4 py-3 text-neutral-500">{det}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <hr className="border-neutral-800 my-10" />

            {/* ── Configuration ─────────────────────────────────────────── */}
            <section id="configuration" className="scroll-mt-24">
              <H2 id="configuration">Configuration Basics</H2>
              <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                Every script ships with a well-commented <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-xs text-green-400 font-mono">config.lua</code>. Below is a typical structure.
              </p>
              <CodeBlock
                filename="config.lua"
                lang="lua"
                code={`Config = {}

-- Framework: 'qb-core', 'qbox', or 'esx'
Config.Framework = 'qb-core'

-- Enable/disable debug output
Config.Debug = false

-- Notification system: 'qb', 'ox_lib', 'esx'
Config.Notify = 'qb'`}
              />
              <H3>Switching Frameworks</H3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Change <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-xs text-green-400 font-mono">Config.Framework</code> to match your server. The script will automatically load the correct bridge file.
              </p>
              <Callout type="info">
                QBCore and Qbox share the same bridge. If you are on Qbox, set <code className="bg-neutral-800 px-1 py-0.5 rounded text-xs font-mono">Config.Framework = &#39;qbox&#39;</code> — the script handles the rest.
              </Callout>
            </section>

            <hr className="border-neutral-800 my-10" />

            {/* ── Common Issues ────────────────────────────────────────── */}
            <section id="common-issues" className="scroll-mt-24">
              <H2 id="common-issues">Common Issues</H2>

              <H3>Script not starting</H3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-2">
                Check your <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-xs font-mono">server.cfg</code> to confirm the resource name matches the folder exactly (case-sensitive on Linux). Run:
              </p>
              <CodeBlock code="ensure flake-scriptname" />

              <H3>nil value errors on startup</H3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-2">
                Usually means a dependency isn&apos;t started first. Add dependencies before your script:
              </p>
              <CodeBlock filename="server.cfg" code={`ensure oxmysql\nensure ox_lib\nensure flake-scriptname`} />

              <H3>UI not appearing</H3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Make sure <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-xs font-mono">ox_lib</code> is up-to-date. Run <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-xs font-mono">refresh</code> and re-ensure the resource in the server console.
              </p>
            </section>

            {/* ── Footer nav ───────────────────────────────────────────── */}
            <div className="flex items-center justify-between mt-16 pt-8 border-t border-neutral-800">
              <div />
              <Link
                href="/support"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-600/30 text-blue-400 text-sm font-semibold transition"
              >
                Still need help? Open a ticket
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </main>

        {/* ── Right "On this page" sidebar ─────────────────────────────────── */}
        <aside className="hidden xl:block w-56 flex-shrink-0 border-l border-neutral-800 sticky top-0 h-[calc(100vh-64px)] overflow-y-auto py-10 px-5">
          <p className="text-xs text-neutral-600 uppercase tracking-widest font-semibold mb-4">On this page</p>
          <nav className="space-y-1">
            {[
              { href: '#intro', label: 'Introduction' },
              { href: '#installation', label: 'Installation Guide' },
              { href: '#requirements', label: 'Server Requirements' },
              { href: '#configuration', label: 'Configuration Basics' },
              { href: '#common-issues', label: 'Common Issues' },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="block text-xs text-neutral-500 hover:text-white py-1 transition"
              >
                {label}
              </a>
            ))}
          </nav>
        </aside>
      </div>

      <Footer />
    </div>
  );
}
