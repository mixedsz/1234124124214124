import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { DocsSidebar, DocsMobileNav } from '@/components/docs-sidebar';
import Link from 'next/link';
import { ChevronRight, AlertTriangle, ExternalLink, BookOpen, Check } from 'lucide-react';

export const metadata: Metadata = { title: 'Docs' };

// ── Shared primitives ─────────────────────────────────────────────────────────

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

// ── Stepper ───────────────────────────────────────────────────────────────────

function StepperStep({ n, emoji, title, children }: { n: number; emoji: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-5 relative">
      {/* Connector line */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm z-10 flex-shrink-0">
          {n}
        </div>
        <div className="w-px flex-1 bg-neutral-800 mt-2 mb-0" />
      </div>

      {/* Content */}
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DocsIntroPage() {
  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      <Header />

      <div className="flex flex-1 w-full max-w-[1400px] mx-auto">
        <DocsSidebar />

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <DocsMobileNav />
          <div className="max-w-3xl mx-auto px-6 lg:px-10 py-10">

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-neutral-600 mb-8">
              <Link href="/" className="hover:text-neutral-400 transition">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/docs" className="hover:text-neutral-400 transition">Documentation</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-neutral-400">Introduction</span>
            </div>

            {/* Page title */}
            <h1 className="text-3xl font-bold text-white mb-2">Claim Purchase</h1>
            <p className="text-neutral-500 text-sm mb-10">
              Follow these steps after purchasing to get your Flake Development script installed and running.
            </p>

            {/* Stepper */}
            <div>
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
                  To download your purchased asset, head over to the <strong className="text-white font-semibold">Cfx.re Portal</strong>, linked below. Log in, then head to the{' '}
                  <strong className="text-white font-semibold">Assets</strong> tab, then{' '}
                  <strong className="text-white font-semibold">Granted Assets</strong>.
                </p>
                <p>
                  If you have many assets, you can search for <Inline>flake_</Inline>, which is the prefix used for all of our scripts. Please note: after purchase, it may take up to{' '}
                  <strong className="text-white font-semibold">5 minutes</strong> to appear in your portal account.
                </p>
                <EmbedCard
                  title="Cfx.re Portal — Granted Assets"
                  url="https://portal.cfx.re/assets/granted-assets"
                />
              </StepperStep>

              <StepperStep n={3} emoji="📂" title="Extracting the zip">
                <p>
                  Extract/open the zip file you just downloaded — it should end in <Inline>.pack.zip</Inline>. It should contain a folder ending in <Inline>-bundle</Inline>, such as{' '}
                  <Inline>flake_drugselling-bundle</Inline>.
                </p>
                <Callout type="warning">
                  Do <strong>NOT</strong> drag the bundle folder directly into your server — open it first. The folders <em>inside</em> are the resources that go into your server&apos;s resources folder.
                </Callout>
              </StepperStep>

              <StepperStep n={4} emoji="🔄" title="Restart your server">
                <p>
                  Fully restart your FiveM server. If you only start the script via the console or txAdmin while the server is already running, you will likely encounter a{' '}
                  <strong className="text-white font-semibold">Keymaster escrow error</strong>.
                </p>
                <p>
                  A full server restart ensures your server picks up the new license correctly.
                </p>
              </StepperStep>

              <StepperStep n={5} emoji="☑️" title="Done!">
                <p>
                  Now that the script files are on your server, see the installation instructions for your specific script in the sidebar. You&apos;ll also find exports, guides, and common errors documented there.
                </p>
                <p>Have fun! 🎉</p>
              </StepperStep>
            </div>

            {/* Discord CTA */}
            <div className="mt-4 pt-8 border-t border-neutral-800">
              <p className="text-neutral-500 text-sm">
                If you need more help, join our Discord:{' '}
                <a
                  href="https://discord.gg/flakedev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline transition"
                >
                  discord.gg/flakedev
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

        {/* Right sidebar */}
        <div className="hidden xl:block w-52 flex-shrink-0 border-l border-neutral-800">
        <aside className="sticky top-0 h-[calc(100vh-64px)] overflow-y-auto py-10 px-5">
          <p className="text-xs text-neutral-600 uppercase tracking-widest font-semibold mb-4">On this page</p>
          <nav className="space-y-1">
            {[
              'Check server artifacts',
              'Downloading your script',
              'Extracting the zip',
              'Restart your server',
              'Done!',
            ].map(label => (
              <p key={label} className="text-xs text-neutral-500 py-1">{label}</p>
            ))}
          </nav>
        </aside>
        </div>
      </div>

      <Footer showCta={false} />
    </div>
  );
}
