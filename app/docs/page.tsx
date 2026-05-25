import type { Metadata } from 'next';
import { DocsSidebar, DocsMobileNav } from '@/components/docs-sidebar';
import Link from 'next/link';
import { ChevronRight, AlertTriangle, ExternalLink, BookOpen, Check, ArrowRight, Zap } from 'lucide-react';

export const metadata: Metadata = { title: 'Docs' };

function Callout({ type = 'warning', children }: { type?: 'warning' | 'info' | 'tip'; children: React.ReactNode }) {
  const s = {
    warning: { border: 'border-yellow-500/40', bg: 'bg-yellow-500/8',  icon: <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" /> },
    info:    { border: 'border-blue-500/40',   bg: 'bg-blue-500/8',    icon: <BookOpen className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" /> },
    tip:     { border: 'border-green-500/40',  bg: 'bg-green-500/8',   icon: <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" /> },
  }[type];
  return (
    <div className={`flex gap-3 rounded-xl border ${s.border} ${s.bg} px-4 py-3 my-4`}>
      {s.icon}
      <div className="text-sm text-neutral-300 leading-relaxed">{children}</div>
    </div>
  );
}

function EmbedCard({ title, url }: { title: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-4 my-3 rounded-xl border border-neutral-700 hover:border-blue-500/50 bg-neutral-800/40 hover:bg-neutral-800/80 transition group"
    >
      <div className="w-8 h-8 rounded-lg bg-neutral-700 flex items-center justify-center flex-shrink-0">
        <ExternalLink className="w-4 h-4 text-neutral-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium group-hover:text-blue-400 transition">{title}</p>
        <p className="text-neutral-500 text-xs mt-0.5 truncate">{url}</p>
      </div>
      <ExternalLink className="w-4 h-4 text-neutral-600 group-hover:text-blue-400 transition flex-shrink-0" />
    </a>
  );
}

function Inline({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-neutral-800 border border-neutral-700 px-1.5 py-0.5 rounded text-xs text-blue-300 font-mono">
      {children}
    </code>
  );
}

function StepperStep({ n, emoji, title, children }: { n: number; emoji: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-5 relative">
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm z-10 flex-shrink-0">
          {n}
        </div>
        <div className="w-px flex-1 bg-neutral-800 mt-2 mb-0" />
      </div>
      <div className="flex-1 pb-10 min-w-0">
        <h3 className="text-white font-semibold text-base mb-3">
          <span className="mr-1.5">{emoji}</span>
          {title}
        </h3>
        <div className="text-neutral-400 text-sm leading-relaxed space-y-2">
          {children}
        </div>
      </div>
    </div>
  );
}

const SCRIPTS = [
  {
    emoji: '🚬',
    title: 'Flake Smoking & Vaping',
    desc: 'Realistic smoking and vaping system with animations, items, and health effects.',
    tags: ['QBCore', 'Qbox', 'ESX'],
    href: '/docs/smoking',
    color: 'from-blue-600/20 to-blue-900/10',
    border: 'border-blue-700/30',
  },
  {
    emoji: '🛒',
    title: 'Flake Shops',
    desc: 'Fully configurable shop system with custom UI, stock management, and job restrictions.',
    tags: ['QBCore', 'Qbox', 'ESX'],
    href: '/docs/shops',
    color: 'from-purple-600/20 to-purple-900/10',
    border: 'border-purple-700/30',
  },
  {
    emoji: '💊',
    title: 'Flake Addiction',
    desc: 'Drug addiction and withdrawal system with configurable substances and effects.',
    tags: ['QBCore', 'Qbox'],
    href: '/docs/addiction',
    color: 'from-rose-600/20 to-rose-900/10',
    border: 'border-rose-700/30',
  },
];

export default function DocsIntroPage() {
  return (
    <div className="flex flex-1 w-full max-w-[1400px] mx-auto">
      <DocsSidebar />

      <main className="flex-1 min-w-0">
        <DocsMobileNav />

        {/* Hero */}
        <div className="border-b border-neutral-800 bg-gradient-to-b from-neutral-800/30 to-transparent">
          <div className="max-w-3xl mx-auto px-6 lg:px-10 pt-12 pb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-5">
              <Zap className="w-3 h-3" />
              Documentation
            </div>
            <h1 className="text-4xl font-black text-white mb-4 leading-tight">
              Everything you need to{' '}
              <span className="text-blue-400">get started</span>
            </h1>
            <p className="text-neutral-400 text-base leading-relaxed mb-8 max-w-xl">
              Follow the guides below to install and configure your Flake Development scripts. Each script has its own dedicated page with full configuration reference.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                href="#getting-started"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition"
              >
                Quick Start
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://discord.gg/flakedev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 text-sm font-semibold transition"
              >
                <svg className="w-4 h-4 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                </svg>
                Join Discord
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 border-t border-neutral-800 pt-6">
              {[
                { value: '40K+', label: 'Sales' },
                { value: '3+', label: 'Years' },
                { value: '400+', label: 'Five-Star Reviews' },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-white font-black text-xl">{s.value}</p>
                  <p className="text-neutral-600 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 lg:px-10 py-10">

          {/* Script cards */}
          <h2 className="text-xs text-neutral-500 uppercase tracking-widest font-bold mb-4">Browse Scripts</h2>
          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            {SCRIPTS.map(s => (
              <Link
                key={s.href}
                href={s.href}
                className={`group flex flex-col p-4 rounded-xl bg-gradient-to-br ${s.color} border ${s.border} hover:border-blue-500/50 transition`}
              >
                <span className="text-2xl mb-3">{s.emoji}</span>
                <p className="text-white font-semibold text-sm mb-1.5 group-hover:text-blue-400 transition leading-tight">{s.title}</p>
                <p className="text-neutral-500 text-xs leading-relaxed mb-3 flex-1">{s.desc}</p>
                <div className="flex flex-wrap gap-1">
                  {s.tags.map(tag => (
                    <span key={tag} className="px-1.5 py-0.5 rounded bg-neutral-800/80 text-neutral-400 text-[10px] font-medium border border-neutral-700/60">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>

          {/* Getting Started stepper */}
          <div id="getting-started">
            <h2 className="text-xs text-neutral-500 uppercase tracking-widest font-bold mb-6">Getting Started</h2>

            <StepperStep n={1} emoji="⚠️" title="Check your server artifacts">
              <p>
                Double check you are not using a broken, out of date or incompatible artifact.
                At an absolute minimum, our scripts require artifact <strong className="text-white font-semibold">7290</strong>, but we strongly recommend using the latest recommended artifact.
              </p>
              <EmbedCard
                title="FiveM Server Artifacts"
                url="https://runtime.fivem.net/artifacts/fivem/build_server_windows/master/"
              />
            </StepperStep>

            <StepperStep n={2} emoji="⬇️" title="Downloading your script">
              <p>
                Head over to the <strong className="text-white font-semibold">Cfx.re Portal</strong>, log in, then go to the{' '}
                <strong className="text-white font-semibold">Assets</strong> tab →{' '}
                <strong className="text-white font-semibold">Granted Assets</strong>.
              </p>
              <p>
                Search for <Inline>flake_</Inline> to filter our scripts. After purchase, allow up to{' '}
                <strong className="text-white font-semibold">5 minutes</strong> for the asset to appear.
              </p>
              <EmbedCard
                title="Cfx.re Portal — Granted Assets"
                url="https://portal.cfx.re/assets/granted-assets"
              />
            </StepperStep>

            <StepperStep n={3} emoji="📂" title="Extracting the zip">
              <p>
                Extract the <Inline>.pack.zip</Inline> you downloaded. It contains a folder ending in <Inline>-bundle</Inline> such as{' '}
                <Inline>flake_drugselling-bundle</Inline>.
              </p>
              <Callout type="warning">
                Do <strong>NOT</strong> drag the bundle folder directly into your server — open it first. The folders <em>inside</em> are the resources that belong in your server&apos;s resources folder.
              </Callout>
            </StepperStep>

            <StepperStep n={4} emoji="🔄" title="Restart your server">
              <p>
                Fully restart your FiveM server. Starting a script via console or txAdmin while the server is live will likely cause a{' '}
                <strong className="text-white font-semibold">Keymaster escrow error</strong>.
              </p>
            </StepperStep>

            <StepperStep n={5} emoji="☑️" title="Done!">
              <p>
                Script files are on your server — head to the specific script page in the sidebar for installation instructions, exports, and troubleshooting. Have fun! 🎉
              </p>
            </StepperStep>
          </div>

          {/* Discord CTA */}
          <div className="mt-2 pt-8 border-t border-neutral-800">
            <p className="text-neutral-500 text-sm">
              Need help?{' '}
              <a
                href="https://discord.gg/flakedev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline transition"
              >
                Join our Discord
              </a>
            </p>
          </div>

          {/* Footer nav */}
          <div className="flex items-center justify-end mt-10">
            <Link
              href="/docs/escrow-errors"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 hover:text-white text-sm font-medium transition"
            >
              Next: FiveM Escrow Errors
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      {/* Right TOC sidebar */}
      <div className="hidden xl:block w-52 flex-shrink-0 border-l border-neutral-800">
        <aside className="sticky top-16 h-[calc(100vh-64px)] overflow-y-auto py-10 px-5">
          <p className="text-xs text-neutral-600 uppercase tracking-widest font-semibold mb-4">On this page</p>
          <nav className="space-y-1">
            {[
              { label: 'Browse Scripts', href: '#browse' },
              { label: 'Check server artifacts', href: '#getting-started' },
              { label: 'Downloading your script', href: '#getting-started' },
              { label: 'Extracting the zip', href: '#getting-started' },
              { label: 'Restart your server', href: '#getting-started' },
            ].map(({ label, href }) => (
              <a key={label} href={href} className="block text-xs text-neutral-500 hover:text-white py-1 transition">
                {label}
              </a>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  );
}
