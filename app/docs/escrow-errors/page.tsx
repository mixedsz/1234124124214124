'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { DocsSidebar, DocsMobileNav } from '@/components/docs-sidebar';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronRight, ChevronDown, AlertTriangle, Copy, Check, ExternalLink } from 'lucide-react';

// ── Primitives ────────────────────────────────────────────────────────────────

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl border border-yellow-500/40 bg-yellow-500/8 px-4 py-3 my-6">
      <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
      <div className="text-sm text-neutral-300 leading-relaxed">{children}</div>
    </div>
  );
}

function Inline({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-neutral-800 border border-neutral-700 px-1.5 py-0.5 rounded text-xs text-blue-300 font-mono">
      {children}
    </code>
  );
}

function LogBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="rounded-xl overflow-hidden border border-neutral-700/60 my-3">
      <div className="flex items-center justify-between bg-neutral-800 px-4 py-2 border-b border-neutral-700/60">
        <span className="text-neutral-400 text-xs font-mono">log</span>
        <button onClick={copy} className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-200 transition text-xs">
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="bg-neutral-800/50 px-4 py-3 overflow-x-auto text-xs leading-relaxed">
        <code className="text-red-400 font-mono">{code}</code>
      </pre>
    </div>
  );
}

function CodeBlock({ code, filename }: { code: string; filename?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="rounded-xl overflow-hidden border border-neutral-700/60 my-3">
      {filename && (
        <div className="flex items-center justify-between bg-neutral-800 px-4 py-2 border-b border-neutral-700/60">
          <span className="text-neutral-400 text-xs font-mono">{filename}</span>
          <button onClick={copy} className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-200 transition text-xs">
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}
      <pre className="bg-neutral-800/50 px-4 py-3 overflow-x-auto text-sm">
        <code className="text-green-400 font-mono">{code}</code>
      </pre>
    </div>
  );
}

// ── Accordion ─────────────────────────────────────────────────────────────────

function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-xl border overflow-hidden mb-3 transition-colors ${open ? 'border-blue-500/40' : 'border-neutral-700/60'}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-neutral-800/40 hover:bg-neutral-800/70 transition text-left gap-4"
      >
        <span className="text-white font-medium text-sm font-mono">{title}</span>
        <ChevronDown className={`w-4 h-4 text-neutral-500 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 py-5 border-t border-neutral-700/60 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h4 className="text-white font-semibold text-sm mb-2">{children}</h4>;
}

function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2 text-sm text-neutral-400">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="text-neutral-600 flex-shrink-0 mt-0.5">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EscrowErrorsPage() {
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
              <span className="text-neutral-400">FiveM Escrow Errors</span>
            </div>

            {/* Page title */}
            <h1 className="text-3xl font-bold text-white mb-2">FiveM Escrow Errors</h1>
            <p className="text-neutral-500 text-sm mb-10">
              Common escrow and Keymaster errors and how to fix them.
            </p>

            {/* Accordions */}
            <AccordionItem title={`Error parsing script… syntax error near '<\\1>'`}>
              <div>
                <SectionLabel>Error Example</SectionLabel>
                <LogBlock code={`[script:flake_drug] Error parsing script @flake_drugselling/server/sv-main.lua in resource flake_drugselling: @flake_drugselling/server/sv-main.lua:1: syntax error near '<\\1>'\n[    c-scripting-core] Failed to load script server/sv-main.lua.`} />
              </div>
              <div>
                <SectionLabel>Solutions</SectionLabel>
                <BulletList items={[
                  <><strong className="text-white">You are using FileZilla and files have been corrupted during transfer</strong> — try using an alternative FTP client such as <a href="https://winscp.net/eng/index.php" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">WinSCP</a>.</>,
                  <>You are transferring the folder to your server file by file — <strong className="text-white">you must upload the .zip file as-is</strong> and then extract it <strong className="text-white">after</strong> it has been transferred to your VPS.</>,
                  <>Your server artifact is too old. The minimum version is <Inline>7290</Inline>. Download updated artifacts <a href="https://runtime.fivem.net/artifacts/fivem/build_server_windows/master/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">here</a>.</>,
                ]} />
              </div>
            </AccordionItem>

            <AccordionItem title="Failed to verify protected resource">
              <div>
                <SectionLabel>Error Example</SectionLabel>
                <LogBlock code="[svadhesive] Failed to verify protected resource flake_drugselling" />
              </div>
              <div>
                <SectionLabel>Solutions</SectionLabel>
                <BulletList items={[
                  'Try fully restarting your server.',
                  <>You are transferring the folder file by file — you must upload the <Inline>.zip</Inline> file as-is and extract it <strong className="text-white">after</strong> it has been transferred to your VPS.</>,
                  <>You don&apos;t have a <Inline>.fxap</Inline> file in the script folder — try re-installing the script from your Cfx.re portal.</>,
                  <>You are using <strong className="text-white">FileZilla</strong> and files have been corrupted — try an alternative FTP client such as <a href="https://winscp.net/eng/index.php" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">WinSCP</a>.</>,
                ]} />
              </div>
            </AccordionItem>

            <AccordionItem title="You lack the required entitlement">
              <div>
                <SectionLabel>Error Example</SectionLabel>
                <LogBlock code="You lack the required entitlement to use flake_drugselling" />
              </div>

              <div>
                <SectionLabel>What does this mean?</SectionLabel>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  All Flake Development scripts use the FiveM escrow system, which means scripts are linked to your FiveM account — the account you used on Tebex. The script must run on a server using a <strong className="text-white">server key created by the same FiveM account</strong> you used to purchase.
                </p>
                <p className="text-sm text-neutral-400 leading-relaxed mt-2">
                  You can create a server key at <a href="https://keymaster.fivem.net/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">FiveM Keymaster</a>, then add it to your <Inline>server.cfg</Inline>:
                </p>
                <CodeBlock filename="server.cfg" code={`sv_licenseKey "your_license_key_here"`} />
              </div>

              <div>
                <SectionLabel>The script is on my friend&apos;s FiveM account</SectionLabel>
                <p className="text-sm text-neutral-400 leading-relaxed mb-3">
                  To transfer the script to another account, go to:{' '}
                  <a href="https://keymaster.fivem.net/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">FiveM Keymaster</a>
                  {' '}→ <strong className="text-white">Purchased Assets</strong> → <strong className="text-white">Transfer to another account</strong>.
                </p>
                <div className="flex gap-2 rounded-xl border border-red-500/30 bg-red-500/8 px-4 py-3">
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">
                    cfx.re only allows scripts to be transferred <strong>once</strong>. You will not be able to transfer it again after doing this.
                  </p>
                </div>
              </div>

              <div>
                <SectionLabel>ZAP-Hosting</SectionLabel>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  If you are on ZAP-Hosting, do <strong className="text-white">not</strong> enter your server key in <Inline>server.cfg</Inline>. Instead, add it directly in your ZAP control panel. Official instructions can be found{' '}
                  <a href="https://zap-hosting.com/guides/docs/en/fivem_licensekey/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">here <ExternalLink className="w-3 h-3 inline-block mb-0.5" /></a>.
                </p>
              </div>
            </AccordionItem>

            {/* Warning callout */}
            <Callout>
              Make sure you read all the instructions above <strong>very carefully</strong>. If you have tried everything and are still having issues, wait at least <strong>30 minutes</strong> after purchasing before trying again — this can sometimes fix entitlement issues. Always do a <strong>full server restart</strong> before concluding there is a problem.
            </Callout>

            {/* Footer nav */}
            <div className="flex items-center justify-between mt-10 pt-8 border-t border-neutral-800">
              <Link
                href="/docs"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 hover:text-white text-sm font-medium transition"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Previous: Introduction
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
              'syntax error near <\\1>',
              'Failed to verify resource',
              'You lack entitlement',
            ].map(label => (
              <p key={label} className="text-xs text-neutral-500 py-1 font-mono">{label}</p>
            ))}
          </nav>
        </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
