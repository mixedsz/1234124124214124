import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Flake One Hand Weapon – FiveM Script' };

import { DocsSidebar, DocsMobileNav } from '@/components/docs-sidebar';
import { DocsOnThisPage } from '@/components/docs-on-this-page';
import Link from 'next/link';
import { ChevronRight, AlertTriangle, Info, Check } from 'lucide-react';

function Inline({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded text-xs text-blue-300 font-mono">
      {children}
    </code>
  );
}

function Callout({ type = 'info', title, children }: { type?: 'info' | 'warning' | 'success' | 'danger'; title?: string; children: React.ReactNode }) {
  const s = {
    info:    { border: 'border-l-blue-500',   bg: 'bg-blue-500/5',   icon: <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />,            text: 'text-blue-400' },
    warning: { border: 'border-l-yellow-500', bg: 'bg-yellow-500/5', icon: <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />, text: 'text-yellow-400' },
    success: { border: 'border-l-green-500',  bg: 'bg-green-500/5',  icon: <Check className="w-4 h-4 text-green-400 flex-shrink-0" />,          text: 'text-green-400' },
    danger:  { border: 'border-l-red-500',    bg: 'bg-red-500/5',    icon: <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />,    text: 'text-red-400' },
  }[type];
  return (
    <div className={`flex gap-3 border-l-[3px] ${s.border} ${s.bg} rounded-r-xl px-4 py-3 my-4`}>
      <div className="mt-0.5">{s.icon}</div>
      <div>
        {title && <p className={`font-semibold text-sm ${s.text} mb-1`}>{title}</p>}
        <div className="text-sm text-neutral-300 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function SectionH2({ id, children }: { id: string; children: React.ReactNode }) {
  return <h2 id={id} className="text-2xl font-bold text-white mt-12 mb-4 pb-3 border-b border-neutral-800 scroll-mt-8">{children}</h2>;
}

function SectionH3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold text-white mt-8 mb-3">{children}</h3>;
}

function DocTable({ headers, rows }: { headers: string[]; rows: (React.ReactNode)[][] }) {
  return (
    <div className="rounded-xl border border-neutral-700/60 overflow-hidden my-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-neutral-800/80 text-left">
            {headers.map(h => <th key={h} className="px-4 py-2.5 text-xs uppercase tracking-wider text-neutral-400 font-semibold">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {rows.map((row, ri) => (
            <tr key={ri} className="hover:bg-neutral-800/30 transition">
              {row.map((cell, ci) => <td key={ci} className="px-4 py-2.5 text-neutral-300 align-top">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const ON_THIS_PAGE = [
  { href: '#overview',        label: 'Overview' },
  { href: '#installation',    label: 'Installation' },
  { href: '#configuration',   label: 'Configuration' },
  { href: '#commands',        label: 'Commands' },
  { href: '#troubleshooting', label: 'Troubleshooting' },
];

export default function FlakeOneHandWeaponDocsPage() {
  return (
    <div className="flex flex-1 w-full">
      <DocsSidebar />
      <main className="flex-1 min-w-0">
        <DocsMobileNav />
        <div className="max-w-3xl mx-auto px-6 lg:px-10 py-10">

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-600 mb-8 flex-wrap">
            <Link href="/" className="hover:text-neutral-400 transition">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/docs" className="hover:text-neutral-400 transition">Documentation</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-neutral-400">Flake One-Hand Weapons</span>
          </div>

          {/* Hero */}
          <div className="relative rounded-2xl border border-neutral-700/40 bg-neutral-800/30 px-7 py-6 mb-10 overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-neutral-500/10 blur-3xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-700 flex items-center justify-center flex-shrink-0 text-xl">🔫</div>
              <h1 className="text-3xl font-bold text-white">Flake One-Hand Weapons</h1>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4 max-w-xl">
              A lightweight one-handed weapon holding system for FiveM. Toggle a realistic one-hand animation for any weapon via keybind or keep it always on.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'FiveM',            color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                { label: 'Standalone',       color: 'bg-green-500/10 text-green-400 border-green-500/20' },
                { label: 'ox_lib Optional',  color: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
                { label: 'Lua 5.4',          color: 'bg-neutral-700/60 text-neutral-300 border-neutral-600' },
              ].map(b => (
                <span key={b.label} className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${b.color}`}>{b.label}</span>
              ))}
            </div>
          </div>

          {/* ── Overview ─────────────────────────────────────────────── */}
          <section id="overview">
            <SectionH2 id="overview">Overview</SectionH2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              Applies a jerrycan-style movement clipset to make your character hold weapons in one hand. Works with any weapon (or a custom list) and supports both toggle and always-on modes.
            </p>

            <SectionH3>Features</SectionH3>
            <ul className="space-y-2 text-sm text-neutral-400 mb-4 list-disc pl-5">
              <li><strong className="text-white">Toggle or Always-On</strong> — Choose between a keybind toggle or permanent one-hand stance.</li>
              <li><strong className="text-white">All Weapons or Whitelist</strong> — Apply to every weapon or only specific ones.</li>
              <li><strong className="text-white">Custom Weapons Supported</strong> — Add any custom weapon hash to the list.</li>
              <li><strong className="text-white">ox_lib Notifications</strong> — Optional styled notifications instead of GTA feed.</li>
              <li><strong className="text-white">Admin Commands</strong> — Force enable/disable/list player states from console.</li>
              <li><strong className="text-white">Rebindable Key</strong> — Players can change the toggle key in GTA settings.</li>
            </ul>

            <SectionH3>Requirements</SectionH3>
            <DocTable
              headers={['Dependency', 'Purpose', 'Required']}
              rows={[
                [<Inline key="oxlib">ox_lib</Inline>, 'Styled notifications (optional)', 'No'],
              ]}
            />
          </section>

          {/* ── Installation ─────────────────────────────────────────── */}
          <section id="installation">
            <SectionH2 id="installation">Installation</SectionH2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              Place the <Inline>flake_onehandweapon</Inline> folder into your server&apos;s <Inline>resources</Inline> directory and add to <Inline>server.cfg</Inline>:
            </p>
            <div className="bg-neutral-900 border border-neutral-700/60 rounded-xl px-4 py-3 font-mono text-sm text-green-400 mb-4">
              ensure flake_onehandweapon
            </div>
            <Callout type="success" title="Done">
              Restart your server and press <kbd className="bg-neutral-800 border border-neutral-700 rounded px-1.5 py-0.5 text-xs text-neutral-300">M</kbd> (or your configured key) to toggle one-hand holding.
            </Callout>

            <SectionH3>File Structure</SectionH3>
            <div className="bg-neutral-900 border border-neutral-700/60 rounded-xl px-5 py-4 font-mono text-sm leading-7 mb-4">
              <span className="text-blue-400">flake_onehandweapon/</span>{'\n'}
              {'├── '}<span className="text-neutral-300">config.lua</span><span className="text-neutral-600">          — Settings (escrow-ignored)</span>{'\n'}
              {'├── '}<span className="text-blue-400">client/</span>{'\n'}
              {'│   └── '}<span className="text-neutral-300">main.lua</span><span className="text-neutral-600">        — Animation logic</span>{'\n'}
              {'├── '}<span className="text-blue-400">server/</span>{'\n'}
              {'│   └── '}<span className="text-neutral-300">main.lua</span><span className="text-neutral-600">        — Admin commands</span>{'\n'}
              {'└── '}<span className="text-neutral-300">fxmanifest.lua</span><span className="text-neutral-600">      — Resource manifest</span>
            </div>
          </section>

          {/* ── Configuration ────────────────────────────────────────── */}
          <section id="configuration">
            <SectionH2 id="configuration">Configuration</SectionH2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4">
              All settings live in <Inline>config.lua</Inline> and are escrow-ignored.
            </p>

            <SectionH3>Main Settings</SectionH3>
            <DocTable
              headers={['Setting', 'Default', 'Description']}
              rows={[
                [<Inline key="mo">Config.Mode</Inline>, <Inline key="mov">&quot;keybind&quot;</Inline>, '"keybind" (toggle) or "always" (permanent)'],
                [<Inline key="wc">Config.WeaponCheckMode</Inline>, <Inline key="wcv">&quot;all&quot;</Inline>, '"all" (any weapon) or "list" (whitelist only)'],
                [<Inline key="tk">Config.ToggleKey</Inline>, <Inline key="tkv">&quot;M&quot;</Inline>, 'Key to toggle one-hand holding (keybind mode only)'],
                [<Inline key="tc">Config.ToggleCooldown</Inline>, <Inline key="tcv">2000</Inline>, 'Minimum milliseconds between toggles'],
                [<Inline key="uo">Config.UseOxLib</Inline>, <Inline key="uov">false</Inline>, 'Use ox_lib notifications instead of GTA feed'],
              ]}
            />

            <SectionH3>Supported Weapons</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              When <Inline>Config.WeaponCheckMode = &quot;list&quot;</Inline>, only these weapons receive the animation. Add custom weapons by their spawn name.
            </p>
            <pre className="bg-neutral-900 border border-neutral-700/60 rounded-xl px-5 py-4 text-sm font-mono text-neutral-300 overflow-x-auto mb-4 whitespace-pre-wrap">{`Config.SupportedWeapons = {
    "WEAPON_ASSAULTRIFLE",
    "WEAPON_COMBATPISTOL",
    "WEAPON_CARBINERIFLE",
    "WEAPON_APPISTOL"
}`}</pre>

            <SectionH3>ox_lib Notification Options</SectionH3>
            <pre className="bg-neutral-900 border border-neutral-700/60 rounded-xl px-5 py-4 text-sm font-mono text-neutral-300 overflow-x-auto mb-4 whitespace-pre-wrap">{`Config.OxLibNotify = {
    position = 'top-right',
    duration = 4000,
    icon     = 'gun'
}`}</pre>
          </section>

          {/* ── Commands ─────────────────────────────────────────────── */}
          <section id="commands">
            <SectionH2 id="commands">Commands</SectionH2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              These commands require ace permissions and are intended for server console or admin use.
            </p>
            <DocTable
              headers={['Command', 'Access', 'Description']}
              rows={[
                [<Inline key="c1">/onehand_check &lt;id&gt;</Inline>, 'Ace', "Check a player's current toggle state"],
                [<Inline key="c2">/onehand_enable &lt;id&gt;</Inline>, 'Ace', 'Force-enable one-hand for a player'],
                [<Inline key="c3">/onehand_disable &lt;id&gt;</Inline>, 'Ace', 'Force-disable one-hand for a player'],
                [<Inline key="c4">/onehand_list</Inline>, 'Ace', 'List all players with one-hand enabled'],
              ]}
            />
            <Callout type="info" title="Ace Permissions">
              Add these to your <Inline>server.cfg</Inline> to grant access: <Inline>add_ace group.admin command.onehand_check allow</Inline> (and similarly for the other commands).
            </Callout>
          </section>

          {/* ── Troubleshooting ──────────────────────────────────────── */}
          <section id="troubleshooting">
            <SectionH2 id="troubleshooting">Troubleshooting</SectionH2>
            <DocTable
              headers={['Issue', 'Fix']}
              rows={[
                ['Animation not applying on spawn', 'Fixed in v2.0 — the script now waits for the ped to exist before applying the clipset.'],
                ['Keybind not working', <span key="k">Ensure <Inline>Config.Mode</Inline> is <Inline>&quot;keybind&quot;</Inline>. Players can rebind the key in GTA settings.</span>],
                ['Custom weapon not working', <span key="cw">Add the weapon spawn name to <Inline>Config.SupportedWeapons</Inline> and set mode to <Inline>&quot;list&quot;</Inline>.</span>],
                ['ox_lib notifications not showing', <span key="ox">Ensure ox_lib is started and <Inline>Config.UseOxLib</Inline> is <Inline>true</Inline>.</span>],
                ['Admin commands not working', 'Grant the corresponding ace permission to your admin group in server.cfg.'],
              ]}
            />
          </section>

          <div className="mt-12 pt-6 border-t border-neutral-800 text-xs text-neutral-600">
            Developed by <strong className="text-neutral-500">Flake Development</strong>. For support, open a ticket in our Discord.
          </div>
        </div>
      </main>

      {/* Right sidebar */}
      <DocsOnThisPage items={ON_THIS_PAGE} />
    </div>
  );
}
