import { DocsSidebar, DocsMobileNav } from '@/components/docs-sidebar';
import { DocsOnThisPage } from '@/components/docs-on-this-page';
import Link from 'next/link';
import { ChevronRight, AlertTriangle, Info, Zap, Check, Activity } from 'lucide-react';
import { CodeBlock } from '@/components/docs-code-block';


import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Flake Addiction Creator – FiveM Drug & Addiction Script' };
// ── Primitives ────────────────────────────────────────────────────────────────

function Inline({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded text-xs text-blue-300 font-mono">
      {children}
    </code>
  );
}

function Callout({
  type = 'info',
  title,
  children,
}: {
  type?: 'info' | 'warning' | 'success' | 'danger';
  title?: string;
  children: React.ReactNode;
}) {
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
  return (
    <h2 id={id} className="text-2xl font-bold text-white mt-12 mb-4 pb-3 border-b border-neutral-800 scroll-mt-8">
      {children}
    </h2>
  );
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
            {headers.map(h => (
              <th key={h} className="px-4 py-2.5 text-xs uppercase tracking-wider text-neutral-400 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {rows.map((row, ri) => (
            <tr key={ri} className="hover:bg-neutral-800/30 transition">
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-2.5 text-neutral-300 align-top">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const ON_THIS_PAGE = [
  { href: '#overview',           label: 'Overview' },
  { href: '#installation',       label: 'Installation' },
  { href: '#configuration',      label: 'Configuration' },
  { href: '#usage-effects',      label: 'Usage & Effects' },
  { href: '#items',              label: 'Items' },
  { href: '#addiction-creator',  label: 'Addiction Creator' },
  { href: '#database',           label: 'Database' },
  { href: '#events',             label: 'Events' },
  { href: '#commands',           label: 'Commands' },
  { href: '#troubleshooting',    label: 'Troubleshooting' },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function FlakeAddictionDocsPage() {
  return (
      <div className="flex flex-1 w-full">
        <DocsSidebar />

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <DocsMobileNav />
          <div className="max-w-3xl mx-auto px-6 lg:px-10 py-10">

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-neutral-600 mb-8 flex-wrap">
              <Link href="/" className="hover:text-neutral-400 transition">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/docs" className="hover:text-neutral-400 transition">Documentation</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/docs/addiction" className="hover:text-neutral-400 transition">Scripts</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-neutral-400">Flake Addiction</span>
            </div>

            {/* Hero */}
            <div className="relative rounded-2xl border border-blue-500/20 bg-blue-500/5 px-7 py-6 mb-10 overflow-hidden">
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">Flake Addiction</h1>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed mb-4 max-w-xl">
                A configurable drug addiction system for FiveM. Real-time immunity tracking, withdrawal effects, overdose mechanics, a medication system, and a full in-game admin creator — all persisted to MySQL.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'FiveM',          color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                  { label: 'ESX',            color: 'bg-green-500/10 text-green-400 border-green-500/20' },
                  { label: 'MySQL',          color: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
                  { label: 'Lua 5.4',        color: 'bg-neutral-700/60 text-neutral-300 border-neutral-600' },
                ].map(b => (
                  <span key={b.label} className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${b.color}`}>
                    {b.label}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Overview ─────────────────────────────────────────────── */}
            <section id="overview">
              <SectionH2 id="overview">Overview</SectionH2>
              <p className="text-neutral-400 text-sm leading-relaxed mb-3">
                Flake Addiction adds a persistent, server-authoritative drug addiction layer to your FiveM server. Every drug is registered with its own immunity timer, addiction chance, withdrawal strength, and overdose threshold. As players consume drugs, their immunity decays in real time — and once immunity expires, withdrawal effects kick in until medication is used or enough time passes.
              </p>
              <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                All addiction state is stored in <strong className="text-white">MySQL</strong> and synced back to clients on connection, meaning addiction persists across reconnects and server restarts. An in-game creator panel (<Inline>/addictioncreator</Inline>) lets admins configure every aspect of each drug without touching a single file.
              </p>

              <Callout type="warning" title="ESX Only">
                Flake Addiction currently supports the <strong className="text-white">ESX</strong> framework only. QB-Core support is not included. Ensure <Inline>es_extended</Inline> is started before <Inline>flake_addiction</Inline>.
              </Callout>

              <SectionH3>Features</SectionH3>
              <ul className="space-y-2 text-sm text-neutral-400 mb-4">
                {[
                  ['Dynamic Drug Registration',  'Register any number of drugs via the creator panel or config.json with full schema control.'],
                  ['Immunity System',            'Each drug tracks remaining immunity time per player. Immunity decays continuously server-side.'],
                  ['Addiction Timers',           'Configurable addiction duration per drug. Players become addicted once immunity depletes past the threshold.'],
                  ['Withdrawal Effects',         'Screen effects, movement penalties, and camera shake fire automatically during withdrawal state.'],
                  ['Medication System',          'Register medication items that reduce or clear addiction for specific drugs.'],
                  ['Admin Creator Panel',        'Full in-game UI (/addictioncreator) to create, edit, and remove drug definitions.'],
                  ['Persistent Storage',         'Addiction state saved to MySQL — survives server restarts and player reconnects.'],
                  ['Real-Time Config Sync',      'Config changes broadcast live to all connected clients via server events.'],
                  ['Overdose Handling',          'Configurable overdose at high drug strength — applies severe effects or kills the player.'],
                ].map(([title, desc]) => (
                  <li key={title as string} className="flex gap-2">
                    <span className="text-blue-500 flex-shrink-0 mt-0.5">•</span>
                    <span><strong className="text-white">{title}</strong> — {desc}</span>
                  </li>
                ))}
              </ul>

              <SectionH3>Requirements</SectionH3>
              <DocTable
                headers={['Dependency', 'Purpose', 'Required']}
                rows={[
                  [<Inline key="1">oxmysql</Inline>,                 'Async MySQL for addiction state persistence',       <span key="r" className="text-green-400 font-medium">Yes</span>],
                  ['ESX',                                            'Framework for players, items, and identity',       <span key="r" className="text-green-400 font-medium">Yes</span>],
                  ['ESX Inventory or OX Inventory',                  'Item consumption and usable item registration',    <span key="r" className="text-green-400 font-medium">Yes</span>],
                ]}
              />
            </section>

            <hr className="border-neutral-800 my-10" />

            {/* ── Installation ─────────────────────────────────────────── */}
            <section id="installation">
              <SectionH2 id="installation">Installation</SectionH2>

              <SectionH3>Step 1 — Ensure the Resource</SectionH3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-2">
                Place <Inline>flake_addiction</Inline> in your <Inline>resources</Inline> directory and add it to <Inline>server.cfg</Inline> after your framework and inventory:
              </p>
              <CodeBlock code="ensure flake_addiction" filename="server.cfg" whitespace py="py-4" my="my-4" />

              <SectionH3>Step 2 — Import the SQL</SectionH3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-2">
                Run the provided <Inline>flake_addiction.sql</Inline> file against your database:
              </p>
              <CodeBlock
                filename="flake_addiction.sql"
                whitespace
                py="py-4"
                my="my-4"
                code={`CREATE TABLE IF NOT EXISTS \`flake_addiction\` (
  \`identifier\`     VARCHAR(60)  NOT NULL,
  \`drug\`           VARCHAR(50)  NOT NULL,
  \`remaining_time\` INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (\`identifier\`, \`drug\`)
);`}
              />

              <SectionH3>Step 3 — Add Items to Your Inventory</SectionH3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-3">
                Add each drug and medication as a usable item in your inventory resource. The script registers usable callbacks automatically on startup — you only need the item definitions to exist. If you are using <strong className="text-white">Windy City Drugs</strong>, a pre-built <Inline>ox.txt</Inline> item list is included in the resource root.
              </p>
              <ul className="space-y-2 text-sm text-neutral-400 mb-4">
                <li className="flex gap-2"><span className="text-blue-500 flex-shrink-0">•</span><span><strong className="text-white">OX Inventory</strong> — import items from <Inline>windy city drugs ox.txt</Inline> or add your own to <Inline>ox_inventory/data/items.lua</Inline>.</span></li>
                <li className="flex gap-2"><span className="text-blue-500 flex-shrink-0">•</span><span><strong className="text-white">ESX Inventory</strong> — add items to your <Inline>es_extended</Inline> items table and restart the resource.</span></li>
              </ul>

              <SectionH3>Step 4 — Configure</SectionH3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-3">
                Edit <Inline>config.lua</Inline> for core settings (UI colour, admin groups, translations) and optionally edit <Inline>config.json</Inline> to pre-populate drug definitions before first launch.
              </p>

              <SectionH3>Step 5 — First-Run Setup</SectionH3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-3">
                On first launch the creator will prompt you to apply a preset or start from scratch. See the <a href="#addiction-creator" className="text-blue-400 hover:text-blue-300 transition">Addiction Creator</a> section for details.
              </p>

              <SectionH3>File Structure</SectionH3>
              <div className="rounded-xl border border-neutral-700/60 bg-neutral-800/50 px-4 py-4 my-4 overflow-x-auto">
                <pre className="text-sm font-mono leading-6">
                  <span className="text-blue-400 font-medium">{'flake_addiction/\n'}</span>
                  <span className="text-neutral-600">{'├── '}</span><span className="text-blue-400 font-medium">{'client/\n'}</span>
                  <span className="text-neutral-600">{'│   ├── '}</span><span className="text-neutral-300">{'main.lua'}</span><span className="text-neutral-600">{'  -- Effects, animations, immunity loop\n'}</span>
                  <span className="text-neutral-600">{'│   └── '}</span><span className="text-neutral-300">{'creator.lua'}</span><span className="text-neutral-600">{'  -- Admin creator panel client logic\n'}</span>
                  <span className="text-neutral-600">{'├── '}</span><span className="text-blue-400 font-medium">{'server/\n'}</span>
                  <span className="text-neutral-600">{'│   └── '}</span><span className="text-neutral-300">{'main.lua'}</span><span className="text-neutral-600">{'  -- DB reads/writes, sync, item registration\n'}</span>
                  <span className="text-neutral-600">{'├── '}</span><span className="text-neutral-300">{'config.lua'}</span><span className="text-neutral-600">{'  -- Core settings, admin groups, translations\n'}</span>
                  <span className="text-neutral-600">{'├── '}</span><span className="text-neutral-300">{'config.json'}</span><span className="text-neutral-600">{'  -- Drug definitions (edited via creator)\n'}</span>
                  <span className="text-neutral-600">{'├── '}</span><span className="text-neutral-300">{'flake_addiction.sql'}</span><span className="text-neutral-600">{'  -- Database schema\n'}</span>
                  <span className="text-neutral-600">{'├── '}</span><span className="text-neutral-300">{'fxmanifest.lua'}</span><span className="text-neutral-600">{'  -- Resource manifest\n'}</span>
                  <span className="text-neutral-600">{'└── '}</span><span className="text-neutral-300">{'windy city drugs ox.txt'}</span><span className="text-neutral-600">{'  -- Optional: OX item definitions\n'}</span>
                </pre>
              </div>

              <Callout type="success" title="Ready">
                Start your server and connect. Type <Inline>/addictioncreator</Inline> to open the panel and configure your drugs. No restart is required after saving changes.
              </Callout>
            </section>

            <hr className="border-neutral-800 my-10" />

            {/* ── Configuration ────────────────────────────────────────── */}
            <section id="configuration">
              <SectionH2 id="configuration">Configuration</SectionH2>
              <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                <Inline>config.lua</Inline> contains server-level settings. Drug definitions live in <Inline>config.json</Inline> and are managed through the in-game creator panel.
              </p>

              <SectionH3>Core Settings</SectionH3>
              <DocTable
                headers={['Key', 'Description']}
                rows={[
                  [<Inline key="k">Config.UIColor</Inline>,          'Hex colour for the creator panel accent (e.g. "#3b82f6")'],
                  [<Inline key="k">Config.AdminGroups</Inline>,       'ESX groups permitted to use /addictioncreator (e.g. { "admin", "superadmin" })'],
                  [<Inline key="k">Config.DrugImmunity</Inline>,      'Global immunity decay rate in seconds per server tick — controls how fast addiction builds'],
                  [<Inline key="k">Config.UsableDrugs</Inline>,       'Table of item names that trigger the addiction system when used from inventory'],
                  [<Inline key="k">Config.Medication</Inline>,        'Table of medication item names and which drug they treat, with immunity restore amount'],
                  [<Inline key="k">Config.Translations</Inline>,      'All player-facing strings — localise or rephrase as needed'],
                ]}
              />

              <SectionH3>Drug Schema</SectionH3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-2">
                Each drug entry in <Inline>config.json</Inline> follows this schema. The creator generates valid JSON automatically — edit manually only if needed:
              </p>
              <CodeBlock
                filename="config.json (drug entry)"
                whitespace
                py="py-4"
                my="my-4"
                code={`{
  "label": "Cocaine",
  "animation": "sniff",
  "drugStrength": 75,
  "healthEffects": {
    "healthBoost": 10,
    "armorBoost": 0
  },
  "addiction": {
    "chance": 0.65,
    "time": 3600
  },
  "effect": {
    "duration": 300,
    "screenFX": "DrugsMichaelAliensFight",
    "speedMultiplier": 1.3,
    "cameraShakeIntensity": 0.4
  }
}`}
              />

              <DocTable
                headers={['Field', 'Type', 'Description']}
                rows={[
                  [<Inline key="k">label</Inline>,                   'string',  'Display name shown in the creator UI and notifications'],
                  [<Inline key="k">animation</Inline>,               'string',  <span key="v">Use animation type: <Inline>pill</Inline>, <Inline>smoke</Inline>, <Inline>syringe</Inline>, or <Inline>sniff</Inline></span>],
                  [<Inline key="k">drugStrength</Inline>,            'number',  'Overdose threshold — reaching 100 triggers overdose mechanics'],
                  [<Inline key="k">healthEffects.healthBoost</Inline>,'number', 'HP added when the drug is consumed (0 for no boost)'],
                  [<Inline key="k">healthEffects.armorBoost</Inline>, 'number', 'Armor added when the drug is consumed (0 for no boost)'],
                  [<Inline key="k">addiction.chance</Inline>,        'float',   'Probability (0.0–1.0) that a single use increments the addiction counter'],
                  [<Inline key="k">addiction.time</Inline>,          'number',  'Immunity duration in seconds awarded per use'],
                  [<Inline key="k">effect.duration</Inline>,         'number',  'How long (seconds) the active effects persist after use'],
                  [<Inline key="k">effect.screenFX</Inline>,         'string',  'GTA timecycle / post-process effect name to apply while high'],
                  [<Inline key="k">effect.speedMultiplier</Inline>,  'float',   'Sprint speed multiplier during the effect window (1.0 = normal)'],
                  [<Inline key="k">effect.cameraShakeIntensity</Inline>,'float','Camera shake strength during the effect window (0.0 = none)'],
                ]}
              />

              <SectionH3>Medication Schema</SectionH3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-2">
                Medication items are registered under <Inline>Config.Medication</Inline> in <Inline>config.lua</Inline>:
              </p>
              <CodeBlock
                filename="config.lua (medication entry)"
                whitespace
                py="py-4"
                my="my-4"
                code={`Config.Medication = {
  {
    item       = "methadone",
    treatsDrug = "heroin",
    restores   = 1800,   -- seconds of immunity restored on use
    clears     = false,  -- set true to fully clear addiction
  },
  {
    item       = "rehab_pill",
    treatsDrug = "cocaine",
    restores   = 0,
    clears     = true,
  },
}`}
              />
            </section>

            <hr className="border-neutral-800 my-10" />

            {/* ── Usage & Effects ──────────────────────────────────────── */}
            <section id="usage-effects">
              <SectionH2 id="usage-effects">Usage & Effects</SectionH2>
              <p className="text-neutral-400 text-sm leading-relaxed mb-3">
                When a player uses a registered drug item, the script runs through the following pipeline:
              </p>

              <ol className="space-y-3 text-sm text-neutral-400 mb-6 list-none">
                {[
                  ['Item Used',         'The ESX usable callback fires and the server validates the player has the item.'],
                  ['Animation Plays',   'The client plays the appropriate use animation (pill swallow, smoke inhale, syringe inject, or sniff).'],
                  ['Effects Applied',   'Screen FX, speed multiplier, and camera shake activate for the configured duration.'],
                  ['Health / Armor',    'If healthEffects are configured, the boost is applied immediately after the animation.'],
                  ['Addiction Roll',    'The server rolls addiction.chance. On success, immunity time is credited to the player\'s row in flake_addiction.'],
                  ['Immunity Tracked',  'Immunity decays continuously. When remaining_time hits 0, the player enters withdrawal.'],
                  ['Overdose Check',    'If drugStrength accumulates to 100 within the effect window, overdose effects fire.'],
                ].map(([step, desc], i) => (
                  <li key={step as string} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs flex items-center justify-center font-semibold">
                      {i + 1}
                    </span>
                    <span><strong className="text-white">{step}</strong> — {desc}</span>
                  </li>
                ))}
              </ol>

              <SectionH3>Animations</SectionH3>
              <DocTable
                headers={['Type', 'Animation', 'Use Case']}
                rows={[
                  [<Inline key="t">pill</Inline>,    'Hand-to-mouth swallow animation',     'Pills, capsules, edibles'],
                  [<Inline key="t">smoke</Inline>,   'Lighter + inhale smoke animation',    'Crack pipes, cigarettes, blunts'],
                  [<Inline key="t">sniff</Inline>,   'Bent-down snort animation',           'Cocaine, ketamine, powders'],
                  [<Inline key="t">syringe</Inline>, 'Arm inject animation with prop',      'Heroin, meth, injectables'],
                ]}
              />

              <SectionH3>Overdose</SectionH3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-3">
                If a player&apos;s accumulated <Inline>drugStrength</Inline> reaches 100 within a single effect window, the overdose sequence triggers:
              </p>
              <ul className="space-y-2 text-sm text-neutral-400 mb-4">
                <li className="flex gap-2"><span className="text-blue-500 flex-shrink-0">•</span><span>Severe screen effects and maximum camera shake are applied.</span></li>
                <li className="flex gap-2"><span className="text-blue-500 flex-shrink-0">•</span><span>Movement is slowed to a crawl.</span></li>
                <li className="flex gap-2"><span className="text-blue-500 flex-shrink-0">•</span><span>Health drains at an accelerated rate.</span></li>
                <li className="flex gap-2"><span className="text-blue-500 flex-shrink-0">•</span><span>If health reaches zero before a medication item is used, the player dies.</span></li>
              </ul>
              <Callout type="danger" title="Overdose Kills">
                Overdose is fatal if left untreated. Ensure your server has a way for other players to administer medication or call EMS before enabling high <Inline>drugStrength</Inline> values.
              </Callout>

              <SectionH3>Withdrawal Effects</SectionH3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-3">
                Once <Inline>remaining_time</Inline> reaches zero for an addicted player, withdrawal begins automatically. The following effects are applied on a recurring server tick until immunity is restored:
              </p>
              <ul className="space-y-2 text-sm text-neutral-400 mb-4">
                <li className="flex gap-2"><span className="text-blue-500 flex-shrink-0">•</span><span>Periodic screen blur and desaturation effects.</span></li>
                <li className="flex gap-2"><span className="text-blue-500 flex-shrink-0">•</span><span>Randomised camera shaking at low intensity.</span></li>
                <li className="flex gap-2"><span className="text-blue-500 flex-shrink-0">•</span><span>Slow, gradual health drain (configurable per drug).</span></li>
                <li className="flex gap-2"><span className="text-blue-500 flex-shrink-0">•</span><span>Reduced movement speed.</span></li>
              </ul>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Withdrawal ends as soon as the player uses the drug again (restoring immunity) or uses an appropriate medication item.
              </p>
            </section>

            <hr className="border-neutral-800 my-10" />

            {/* ── Items ────────────────────────────────────────────────── */}
            <section id="items">
              <SectionH2 id="items">Items</SectionH2>
              <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                Flake Addiction does not ship with a fixed item list — drug items are whatever you register in <Inline>Config.UsableDrugs</Inline> and the creator panel. If your server uses <strong className="text-white">Windy City Drugs</strong>, a ready-made OX Inventory item definition file is included:
              </p>

              <div className="rounded-xl border border-neutral-700/60 bg-neutral-800/50 px-5 py-4 my-4">
                <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-3">Included item file</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-mono">windy city drugs ox.txt</p>
                    <p className="text-neutral-500 text-xs mt-0.5">Paste contents into <Inline>ox_inventory/data/items.lua</Inline></p>
                  </div>
                </div>
              </div>

              <Callout type="info" title="Custom Items">
                You can register any item name as a usable drug — the script is not locked to a specific item set. Add the item to your inventory, list it in <Inline>Config.UsableDrugs</Inline>, and create a matching entry in the creator panel.
              </Callout>
            </section>

            <hr className="border-neutral-800 my-10" />

            {/* ── Addiction Creator ─────────────────────────────────────── */}
            <section id="addiction-creator">
              <SectionH2 id="addiction-creator">Addiction Creator</SectionH2>
              <p className="text-neutral-400 text-sm leading-relaxed mb-3">
                The in-game creator panel is the primary interface for managing drug definitions. All changes are written to <Inline>config.json</Inline> and broadcast live to connected clients — no restart required.
              </p>

              <SectionH3>Opening the Panel</SectionH3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-3">
                Type <Inline>/addictioncreator</Inline> in chat. Access is restricted to groups defined in <Inline>Config.AdminGroups</Inline>.
              </p>

              <SectionH3>First-Run Setup</SectionH3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-3">
                On first launch (when <Inline>config.json</Inline> is empty) the panel prompts you to choose between two options:
              </p>
              <ul className="space-y-2 text-sm text-neutral-400 mb-4">
                <li className="flex gap-2">
                  <span className="text-blue-500 flex-shrink-0">•</span>
                  <span><strong className="text-white">Apply Preset</strong> — loads the bundled Windy City Drugs preset with pre-configured values for common drug items. Good starting point for most servers.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500 flex-shrink-0">•</span>
                  <span><strong className="text-white">Decline / Start Blank</strong> — opens an empty creator so you can build your drug list from scratch.</span>
                </li>
              </ul>
              <Callout type="info" title="Presets are Editable">
                Applying the preset does not lock you in. You can edit or delete any preset drug from the panel immediately after applying.
              </Callout>

              <SectionH3>Panel Features</SectionH3>
              <ul className="space-y-2 text-sm text-neutral-400 mb-4">
                <li className="flex gap-2"><span className="text-blue-500 flex-shrink-0">•</span><span>Create a new drug with full schema fields via guided form inputs.</span></li>
                <li className="flex gap-2"><span className="text-blue-500 flex-shrink-0">•</span><span>Edit any existing drug — changes save instantly to <Inline>config.json</Inline> and sync to clients.</span></li>
                <li className="flex gap-2"><span className="text-blue-500 flex-shrink-0">•</span><span>Delete a drug — removes it from <Inline>config.json</Inline> and clears it from active client configs.</span></li>
                <li className="flex gap-2"><span className="text-blue-500 flex-shrink-0">•</span><span>Preview animation type and screen FX name before saving.</span></li>
              </ul>

              <SectionH3>Reset Installation</SectionH3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-2">
                To trigger the first-run preset prompt again (e.g. to switch from a blank setup to the preset), use:
              </p>
              <CodeBlock code="/resetaddictioninstall" filename="in-game chat" whitespace py="py-4" my="my-4" />
              <p className="text-neutral-400 text-sm leading-relaxed">
                This clears the <Inline>config.json</Inline> and reopens the preset selection prompt on next <Inline>/addictioncreator</Inline> launch.
              </p>
            </section>

            <hr className="border-neutral-800 my-10" />

            {/* ── Database ─────────────────────────────────────────────── */}
            <section id="database">
              <SectionH2 id="database">Database</SectionH2>
              <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                The resource uses a single table — <Inline>flake_addiction</Inline> — to persist immunity state per player per drug. Each row represents one active addiction relationship.
              </p>

              <DocTable
                headers={['Column', 'Type', 'Key', 'Description']}
                rows={[
                  [<Inline key="c">identifier</Inline>,     'VARCHAR(60)',  <span key="k" className="text-yellow-400 text-xs font-medium">PRIMARY</span>,   'ESX player identifier (license, steam, etc.)'],
                  [<Inline key="c">drug</Inline>,           'VARCHAR(50)',  <span key="k" className="text-yellow-400 text-xs font-medium">PRIMARY</span>,   'Drug name matching the config.json key'],
                  [<Inline key="c">remaining_time</Inline>, 'INT',          '—',  'Remaining immunity in seconds. 0 = in withdrawal. Decrements each server tick.'],
                ]}
              />

              <Callout type="info" title="Composite Primary Key">
                The primary key spans both <Inline>identifier</Inline> and <Inline>drug</Inline>, so one player can be addicted to multiple drugs simultaneously with independent immunity timers.
              </Callout>

              <p className="text-neutral-400 text-sm leading-relaxed">
                Rows are inserted on first drug use and updated on each subsequent use. When <Inline>remaining_time</Inline> reaches 0 the server applies withdrawal events to that client. Rows are not deleted automatically — they remain as historical records unless you run <Inline>/clearaddiction [identifier]</Inline>.
              </p>
            </section>

            <hr className="border-neutral-800 my-10" />

            {/* ── Events ───────────────────────────────────────────────── */}
            <section id="events">
              <SectionH2 id="events">Events</SectionH2>
              <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                All events are prefixed with <Inline>flake_addiction:</Inline> and can be listened to for custom integrations.
              </p>

              <SectionH3>Client Events</SectionH3>
              <DocTable
                headers={['Event', 'Payload', 'Description']}
                rows={[
                  [<Inline key="e">useDrug</Inline>,        'drug (string)',                            'Triggers the use pipeline for the specified drug on the local client.'],
                  [<Inline key="e">useMedication</Inline>,  'item (string)',                            'Triggers the medication consumption flow for the specified item.'],
                  [<Inline key="e">data</Inline>,           'addictions (table)',                       'Delivers the player\'s full addiction data from the server on connect or refresh.'],
                  [<Inline key="e">syncConfig</Inline>,     'config (table)',                           'Pushes the latest drug config from config.json to all clients. Fired after creator saves.'],
                ]}
              />

              <SectionH3>Server Events</SectionH3>
              <DocTable
                headers={['Event', 'Payload', 'Description']}
                rows={[
                  [<Inline key="e">requestSync</Inline>,    '—',                                        'Client requests its addiction data on first load. Server responds with the data event.'],
                ]}
              />
              <Callout type="warning" title="Server-Side Validation">
                All immunity writes and addiction chance rolls happen server-side. Never trigger database writes directly from the client — route through the provided server events.
              </Callout>
            </section>

            <hr className="border-neutral-800 my-10" />

            {/* ── Commands ─────────────────────────────────────────────── */}
            <section id="commands">
              <SectionH2 id="commands">Commands</SectionH2>
              <DocTable
                headers={['Command', 'Arguments', 'Description', 'Permission']}
                rows={[
                  [<Inline key="c">/addictioncreator</Inline>,         '—',                 'Open the in-game addiction creator panel',                              <span key="p" className="text-yellow-400">Admin</span>],
                  [<Inline key="c">/clearaddiction</Inline>,           '[identifier]',      'Clear all addiction data for the specified player identifier',          <span key="p" className="text-yellow-400">Admin</span>],
                  [<Inline key="c">/resetaddictioninstall</Inline>,    '—',                 'Wipe config.json and re-trigger the first-run preset prompt',          <span key="p" className="text-yellow-400">Admin</span>],
                  [<Inline key="c">clearaddiction_console</Inline>,    '[identifier]',      'Server console command — same as /clearaddiction but from the console', <span key="p" className="text-neutral-400">Console</span>],
                ]}
              />
            </section>

            <hr className="border-neutral-800 my-10" />

            {/* ── Troubleshooting ──────────────────────────────────────── */}
            <section id="troubleshooting">
              <SectionH2 id="troubleshooting">Troubleshooting</SectionH2>
              <DocTable
                headers={['Issue', 'Fix']}
                rows={[
                  ['Drug item not usable',                  'Ensure the item is added to your inventory resource and matches the name in Config.UsableDrugs exactly (case-sensitive).'],
                  ['Addiction not saving across restarts',  <span key="f">Check that <Inline>oxmysql</Inline> is started before <Inline>flake_addiction</Inline> and that the SQL table was imported correctly.</span>],
                  ['No effects on drug use',               <span key="f">Verify the drug entry exists in <Inline>config.json</Inline> and the <Inline>screenFX</Inline> name is a valid GTA V effect string.</span>],
                  ['Withdrawal not triggering',            <span key="f">Confirm <Inline>addiction.time</Inline> is not set to an extremely high value and that the server tick is running. Check server console for errors.</span>],
                  ['/addictioncreator denied',             <span key="f">Your ESX group must be listed in <Inline>Config.AdminGroups</Inline>. Verify with <Inline>GetPlayerGroup</Inline> in the console.</span>],
                  ['Preset not loading on first run',      <span key="f">Run <Inline>/resetaddictioninstall</Inline> to wipe config.json and re-trigger the setup prompt.</span>],
                  ['Medication item has no effect',        <span key="f">Check that <Inline>treatsDrug</Inline> in the medication config exactly matches the drug key in config.json.</span>],
                  ['Overdose fires unexpectedly',          <span key="f">Lower <Inline>drugStrength</Inline> for the drug in the creator panel. A value below 30 makes overdose very unlikely in normal use.</span>],
                ]}
              />
            </section>

            <hr className="border-neutral-800 mt-10 mb-6" />
            <p className="text-neutral-600 text-xs">
              Developed by <strong className="text-neutral-500">Flake Development</strong>. For support, open a ticket in our Discord.
            </p>

            {/* Footer nav */}
            <div className="flex items-center mt-8">
              <Link
                href="/docs"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 hover:text-white text-sm font-medium transition"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Back to Docs
              </Link>
            </div>
          </div>
        </main>

        {/* Right sidebar */}
        <DocsOnThisPage items={ON_THIS_PAGE} />
      </div>
  );
}
