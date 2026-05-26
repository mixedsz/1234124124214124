import { DocsSidebar, DocsMobileNav } from '@/components/docs-sidebar';
import { DocsOnThisPage } from '@/components/docs-on-this-page';
import Link from 'next/link';
import { ChevronRight, AlertTriangle, Info, Zap, Check, ShoppingBag } from 'lucide-react';
import { CodeBlock } from '@/components/docs-code-block';


import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Flake Shops' };
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
  { href: '#overview',       label: 'Overview' },
  { href: '#installation',   label: 'Installation' },
  { href: '#configuration',  label: 'Configuration' },
  { href: '#pickup-system',  label: 'Pickup System' },
  { href: '#admin-panel',    label: 'Admin Panel' },
  { href: '#events',         label: 'Events' },
  { href: '#commands',       label: 'Commands' },
  { href: '#troubleshooting',label: 'Troubleshooting' },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function FlakeShopsDocsPage() {
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
              <Link href="/docs/shops" className="hover:text-neutral-400 transition">Scripts</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-neutral-400">Flake Shops</span>
            </div>

            {/* Hero */}
            <div className="relative rounded-2xl border border-blue-500/20 bg-blue-500/5 px-7 py-6 mb-10 overflow-hidden">
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">Flake Shops</h1>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed mb-4 max-w-xl">
                A dynamic, database-driven shop system for FiveM. Build and manage custom shops entirely in-game with dual ESX &amp; QB-Core support, multi-currency, pickup mechanics, shop peds, map blips, analytics, and Discord logging.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'FiveM',          color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                  { label: 'ESX & QB-Core',  color: 'bg-green-500/10 text-green-400 border-green-500/20' },
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
                Flake Shops is a fully dynamic shop resource that lets server owners and admins create, edit, and delete shops entirely from within the game — no config file editing required. Every shop is stored in MySQL and pushed to all connected clients in real time, meaning changes take effect immediately without a resource restart.
              </p>
              <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                The script detects your framework automatically and bridges item purchases through <strong className="text-white">ESX</strong> or <strong className="text-white">QB-Core</strong>. It supports multi-currency transactions (cash, bank, or black-money), optional pickup mechanics that spawn a ped and a timed blip, shop NPCs, and full map blip support. Analytics tables record visits, purchases, popular items, and daily revenue for server-side reporting.
              </p>

              <SectionH3>Features</SectionH3>
              <ul className="space-y-2 text-sm text-neutral-400 mb-4">
                {[
                  ['Dual Framework Support',  'Auto-detects ESX or QB-Core with no manual configuration.'],
                  ['In-Game Creator',         'Use /shopscreator to open a full create/edit/delete admin UI without touching any files.'],
                  ['Database Driven',         'All shop data is persisted in MySQL and broadcast to clients on demand.'],
                  ['Multi-Currency',          'Charge purchases in cash, bank, or black-money on a per-shop or per-item basis.'],
                  ['Pickup System',           'Optional delivery mechanic — items are collected from a timed blip location instead of handed directly.'],
                  ['Shop Peds',               'Attach an NPC ped to any shop for immersive storefront presentation.'],
                  ['Map Blips',               'Each shop can display a labelled blip on the map for easy navigation.'],
                  ['Analytics',              'Optional tables track visits, purchases, popular items, and daily revenue.'],
                  ['Discord Logging',         'Purchase and admin events are forwarded to a configurable Discord webhook.'],
                  ['Custom UI',               'Fully styled HTML/CSS shop interface with item previews and quantity selectors.'],
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
                  [<Inline key="1">mysql-async</Inline>,          'MySQL wrapper for shop data persistence',          <span key="r" className="text-green-400 font-medium">Yes</span>],
                  ['ESX or QB-Core',                              'Framework for players, inventories, and currency',  <span key="r" className="text-green-400 font-medium">Yes</span>],
                  ['OX Inventory or QB-Inventory',                'Item storage and image rendering',                  <span key="r" className="text-green-400 font-medium">Yes</span>],
                  [<Inline key="4">ox_lib</Inline>,               'TextUI prompts during pickup interactions',          <span key="r" className="text-neutral-400 font-medium">No</span>],
                ]}
              />
              <Callout type="info" title="Framework Detection">
                The script detects your framework on startup. No <Inline>Config.Framework</Inline> flag is required — simply ensure either <Inline>es_extended</Inline> or <Inline>qb-core</Inline> is started before <Inline>flake_shops</Inline>.
              </Callout>
            </section>

            <hr className="border-neutral-800 my-10" />

            {/* ── Installation ─────────────────────────────────────────── */}
            <section id="installation">
              <SectionH2 id="installation">Installation</SectionH2>

              <SectionH3>Step 1 — Ensure the Resource</SectionH3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-2">
                Place the <Inline>flake_shops</Inline> folder in your <Inline>resources</Inline> directory and add the following line to <Inline>server.cfg</Inline>:
              </p>
              <CodeBlock code="ensure flake_shops" filename="server.cfg" whitespace py="py-4" my="my-4" />

              <SectionH3>Step 2 — Import the Core SQL</SectionH3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-2">
                Run the following SQL in your database to create the main shops table:
              </p>
              <CodeBlock
                filename="flake_shops.sql"
                whitespace
                py="py-4"
                my="my-4"
                code={`CREATE TABLE IF NOT EXISTS \`shops\` (
  \`id\`          INT            NOT NULL AUTO_INCREMENT,
  \`shop_name\`   VARCHAR(100)   NOT NULL,
  \`shop_data\`   LONGTEXT       NOT NULL,
  \`created_at\`  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\`  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
);`}
              />

              <SectionH3>Step 3 — Import Analytics Tables (Optional)</SectionH3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-2">
                These tables are optional but enable the analytics dashboard. Import them only if you intend to use the reporting features:
              </p>
              <CodeBlock
                filename="flake_shops_analytics.sql"
                whitespace
                py="py-4"
                my="my-4"
                code={`CREATE TABLE IF NOT EXISTS \`shop_visits\` (
  \`id\`        INT       NOT NULL AUTO_INCREMENT,
  \`shop_id\`   INT       NOT NULL,
  \`identifier\` VARCHAR(60),
  \`visited_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
);

CREATE TABLE IF NOT EXISTS \`shop_purchases\` (
  \`id\`          INT         NOT NULL AUTO_INCREMENT,
  \`shop_id\`     INT         NOT NULL,
  \`identifier\`  VARCHAR(60),
  \`item\`        VARCHAR(80),
  \`quantity\`    INT         DEFAULT 1,
  \`price\`       INT         DEFAULT 0,
  \`purchased_at\` TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
);

CREATE TABLE IF NOT EXISTS \`shop_popular_items\` (
  \`item\`        VARCHAR(80) NOT NULL,
  \`total_sold\`  INT         DEFAULT 0,
  PRIMARY KEY (\`item\`)
);

CREATE TABLE IF NOT EXISTS \`shop_daily_revenue\` (
  \`date\`     DATE NOT NULL,
  \`revenue\`  INT  DEFAULT 0,
  PRIMARY KEY (\`date\`)
);`}
              />

              <SectionH3>Step 4 — Edit the Config</SectionH3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-3">
                Open <Inline>config/config.lua</Inline> and adjust debug mode, UI colour, admin groups, draw distance, inventory image URLs, currency, and pickup settings to match your server. See the <a href="#configuration" className="text-blue-400 hover:text-blue-300 transition">Configuration</a> section for all available keys.
              </p>

              <SectionH3>File Structure</SectionH3>
              <div className="rounded-xl border border-neutral-700/60 bg-neutral-800/50 px-4 py-4 my-4 overflow-x-auto">
                <pre className="text-sm font-mono leading-6">
                  <span className="text-blue-400 font-medium">{'flake_shops/\n'}</span>
                  <span className="text-neutral-600">{'├── '}</span><span className="text-blue-400 font-medium">{'client/\n'}</span>
                  <span className="text-neutral-600">{'│   ├── '}</span><span className="text-neutral-300">{'main.lua'}</span><span className="text-neutral-600">{'  -- Shop UI, blips, peds, pickup flow\n'}</span>
                  <span className="text-neutral-600">{'│   └── '}</span><span className="text-neutral-300">{'creator.lua'}</span><span className="text-neutral-600">{'  -- In-game creator panel client logic\n'}</span>
                  <span className="text-neutral-600">{'├── '}</span><span className="text-blue-400 font-medium">{'server/\n'}</span>
                  <span className="text-neutral-600">{'│   ├── '}</span><span className="text-neutral-300">{'main.lua'}</span><span className="text-neutral-600">{'  -- Purchases, DB reads/writes, Discord logs\n'}</span>
                  <span className="text-neutral-600">{'│   └── '}</span><span className="text-neutral-300">{'analytics.lua'}</span><span className="text-neutral-600">{'  -- Visit & revenue tracking\n'}</span>
                  <span className="text-neutral-600">{'├── '}</span><span className="text-blue-400 font-medium">{'config/\n'}</span>
                  <span className="text-neutral-600">{'│   └── '}</span><span className="text-neutral-300">{'config.lua'}</span><span className="text-neutral-600">{'  -- All tunables (escrow-ignored)\n'}</span>
                  <span className="text-neutral-600">{'├── '}</span><span className="text-blue-400 font-medium">{'html/\n'}</span>
                  <span className="text-neutral-600">{'│   ├── '}</span><span className="text-neutral-300">{'index.html'}</span><span className="text-neutral-600">{'  -- Shop UI entry point\n'}</span>
                  <span className="text-neutral-600">{'│   ├── '}</span><span className="text-neutral-300">{'style.css'}</span><span className="text-neutral-600">{'  -- UI styles\n'}</span>
                  <span className="text-neutral-600">{'│   └── '}</span><span className="text-neutral-300">{'script.js'}</span><span className="text-neutral-600">{'  -- UI logic and NUI messaging\n'}</span>
                  <span className="text-neutral-600">{'└── '}</span><span className="text-neutral-300">{'fxmanifest.lua'}</span><span className="text-neutral-600">{'  -- Resource manifest\n'}</span>
                </pre>
              </div>

              <Callout type="success" title="Ready to Go">
                After importing SQL and ensuring the resource, start your server. Use <Inline>/shopscreator</Inline> in-game to create your first shop — no restart needed.
              </Callout>
            </section>

            <hr className="border-neutral-800 my-10" />

            {/* ── Configuration ────────────────────────────────────────── */}
            <section id="configuration">
              <SectionH2 id="configuration">Configuration</SectionH2>
              <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                All settings live in <Inline>config/config.lua</Inline>. This file is escrow-ignored and safe to edit freely.
              </p>

              <SectionH3>Core Settings</SectionH3>
              <DocTable
                headers={['Key', 'Default', 'Description']}
                rows={[
                  [<Inline key="k">Config.Debug</Inline>,            <span key="v" className="font-mono text-neutral-400">false</span>,          'Print debug output to the server console'],
                  [<Inline key="k">Config.UiColor</Inline>,          <span key="v" className="font-mono text-neutral-400">"#3b82f6"</span>,       'Primary accent colour used throughout the shop UI'],
                  [<Inline key="k">Config.AdminGroups</Inline>,      <span key="v" className="font-mono text-neutral-400">{"{ \"admin\", \"superadmin\" }"}</span>, 'ESX groups (or QB permissions) allowed to open /shopscreator'],
                  [<Inline key="k">Config.DrawDistance</Inline>,     <span key="v" className="font-mono text-neutral-400">10.0</span>,            'Distance in metres at which shop peds and blips become interactive'],
                  [<Inline key="k">Config.InventoryImgUrl</Inline>,  <span key="v" className="font-mono text-neutral-400">"nui://ox_inventory/web/build/images/"</span>, 'Base URL for item thumbnail images in the shop UI'],
                ]}
              />

              <SectionH3>Currency Config</SectionH3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-2">
                Each shop and each item can specify a payment method. The supported values are:
              </p>
              <ul className="space-y-2 text-sm text-neutral-400 mb-4">
                <li className="flex gap-2"><span className="text-blue-500 flex-shrink-0">•</span><span><Inline>cash</Inline> — deducted from the player&apos;s on-hand cash balance.</span></li>
                <li className="flex gap-2"><span className="text-blue-500 flex-shrink-0">•</span><span><Inline>bank</Inline> — deducted from the player&apos;s bank account.</span></li>
                <li className="flex gap-2"><span className="text-blue-500 flex-shrink-0">•</span><span><Inline>black_money</Inline> — deducted from the player&apos;s dirty money balance (ESX) or marked money (QB).</span></li>
              </ul>
              <Callout type="info" title="Per-Item Override">
                Currency is set at the shop level by default. Individual items in the creator can override the shop currency if your server needs mixed-payment shops.
              </Callout>

              <SectionH3>Pickup Config</SectionH3>
              <DocTable
                headers={['Key', 'Default', 'Description']}
                rows={[
                  [<Inline key="k">Config.UsePickup</Inline>,         <span key="v" className="font-mono text-neutral-400">false</span>, 'Enable the pickup delivery mechanic for shops that opt in'],
                  [<Inline key="k">Config.PickupRadius</Inline>,       <span key="v" className="font-mono text-neutral-400">200.0</span>, 'Maximum metres from the shop at which a pickup location may spawn'],
                  [<Inline key="k">Config.PickupWaitTime</Inline>,     <span key="v" className="font-mono text-neutral-400">120</span>,   'Seconds the pickup blip stays active before expiring'],
                  [<Inline key="k">Config.PickupPedModel</Inline>,     <span key="v" className="font-mono text-neutral-400">"a_m_y_acult_01"</span>, 'Ped model spawned at the pickup location'],
                  [<Inline key="k">Config.PickupBlipSprite</Inline>,   <span key="v" className="font-mono text-neutral-400">521</span>,   'GTA V blip sprite ID for the pickup marker'],
                  [<Inline key="k">Config.PickupBlipColor</Inline>,    <span key="v" className="font-mono text-neutral-400">2</span>,     'GTA V blip colour index for the pickup marker'],
                ]}
              />
            </section>

            <hr className="border-neutral-800 my-10" />

            {/* ── Pickup System ────────────────────────────────────────── */}
            <section id="pickup-system">
              <SectionH2 id="pickup-system">Pickup System</SectionH2>
              <p className="text-neutral-400 text-sm leading-relaxed mb-3">
                When <Inline>Config.UsePickup</Inline> is enabled on a shop, purchased items are not delivered to the player&apos;s inventory immediately. Instead, they trigger a timed delivery event:
              </p>

              <ol className="space-y-3 text-sm text-neutral-400 mb-4 list-none">
                {[
                  ['Purchase Confirmed',     'The server validates payment and triggers the pickup flow instead of awarding items directly.'],
                  ['Random Location Chosen', 'A random coordinate within Config.PickupRadius of the shop origin is selected server-side.'],
                  ['Blip Spawned',           'The client receives the location and spawns a temporary blip on the player\'s map (PickupBlipSprite / PickupBlipColor).'],
                  ['Timer Starts',           'The player has Config.PickupWaitTime seconds to reach the location before the pickup expires.'],
                  ['Ped Spawns',             'On arrival, a ped (Config.PickupPedModel) spawns at the exact coordinate holding the order.'],
                  ['Items Collected',        'The player interacts with the ped via ox_lib TextUI. On confirm, items are added to inventory and the ped and blip are cleaned up.'],
                ].map(([step, desc], i) => (
                  <li key={step as string} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs flex items-center justify-center font-semibold">
                      {i + 1}
                    </span>
                    <span><strong className="text-white">{step}</strong> — {desc}</span>
                  </li>
                ))}
              </ol>

              <Callout type="warning" title="Pickup Expiry">
                If the player does not reach the pickup location within <Inline>Config.PickupWaitTime</Inline> seconds, the blip is removed and items are forfeited. Currency is still deducted. Consider setting an appropriate timer based on your server&apos;s map size.
              </Callout>

              <Callout type="info" title="ox_lib Dependency">
                The pickup interaction prompt requires <Inline>ox_lib</Inline> for TextUI. If you do not have ox_lib, either disable the pickup system or replace the TextUI call in <Inline>client/main.lua</Inline> with your preferred prompt resource.
              </Callout>
            </section>

            <hr className="border-neutral-800 my-10" />

            {/* ── Admin Panel ──────────────────────────────────────────── */}
            <section id="admin-panel">
              <SectionH2 id="admin-panel">Admin Panel</SectionH2>
              <p className="text-neutral-400 text-sm leading-relaxed mb-3">
                Flake Shops ships with a full in-game admin creator so shops can be built and managed without editing any files. Access is gated by the groups listed in <Inline>Config.AdminGroups</Inline>.
              </p>

              <SectionH3>Opening the Creator</SectionH3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-3">
                Type <Inline>/shopscreator</Inline> in chat. The UI opens as an overlay on the current camera position. From here you can:
              </p>
              <ul className="space-y-2 text-sm text-neutral-400 mb-4">
                <li className="flex gap-2"><span className="text-blue-500 flex-shrink-0">•</span><span><strong className="text-white">Create</strong> a new shop — set name, location, ped model, blip, currency, items, and pickup toggle.</span></li>
                <li className="flex gap-2"><span className="text-blue-500 flex-shrink-0">•</span><span><strong className="text-white">Edit</strong> an existing shop — modify any property and save back to the database instantly.</span></li>
                <li className="flex gap-2"><span className="text-blue-500 flex-shrink-0">•</span><span><strong className="text-white">Delete</strong> a shop — removes the record from MySQL and de-spawns all associated peds and blips for every connected client.</span></li>
              </ul>

              <SectionH3>Admin Commands</SectionH3>
              <DocTable
                headers={['Command', 'Description', 'Permission Required']}
                rows={[
                  [<Inline key="c">/shopscreator</Inline>,       'Open the in-game shop creator/editor panel',               <span key="r" className="text-yellow-400">Admin</span>],
                  [<Inline key="c">/listshops</Inline>,          'Print a list of all shops and their IDs to your chat',     <span key="r" className="text-yellow-400">Admin</span>],
                  [<Inline key="c">/gotoshop [id]</Inline>,      'Teleport to the spawn coordinates of the specified shop',   <span key="r" className="text-yellow-400">Admin</span>],
                ]}
              />
              <Callout type="info" title="Permission Check">
                Commands perform a server-side group check. Players not in <Inline>Config.AdminGroups</Inline> receive a denied notification and the command has no effect.
              </Callout>
            </section>

            <hr className="border-neutral-800 my-10" />

            {/* ── Events ───────────────────────────────────────────────── */}
            <section id="events">
              <SectionH2 id="events">Events</SectionH2>
              <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                The following events are used internally and can be listened to for custom integrations. All events are prefixed with <Inline>flake_shops:</Inline>.
              </p>

              <SectionH3>Client Events</SectionH3>
              <DocTable
                headers={['Event', 'Payload', 'Description']}
                rows={[
                  [<Inline key="e">updateShops</Inline>,         'shops (table)',                            'Fired when the shop list is refreshed from the server. Triggers ped and blip re-spawn.'],
                  [<Inline key="e">createPickupBlip</Inline>,    'coords (vector3), expiry (number)',        'Creates the timed pickup blip on the client map.'],
                  [<Inline key="e">pickupReady</Inline>,         'coords (vector3), items (table)',          'Signals that the delivery ped has spawned and items are ready to collect.'],
                  [<Inline key="e">notify</Inline>,              'message (string), type (string)',          'Displays a notification to the player (success / error / info).'],
                ]}
              />

              <SectionH3>Server Events</SectionH3>
              <DocTable
                headers={['Event', 'Payload', 'Description']}
                rows={[
                  [<Inline key="e">requestShops</Inline>,        '—',                                       'Client requests the full shop list. Server responds with updateShops.'],
                  [<Inline key="e">buyItems</Inline>,            'shopId (number), items (table)',           'Validates payment and either awards items or initiates the pickup flow.'],
                  [<Inline key="e">pickupItems</Inline>,         'pickupId (string)',                        'Confirms item collection at the pickup location and cleans up the ped/blip.'],
                ]}
              />
              <Callout type="warning" title="Event Security">
                Never trigger <Inline>buyItems</Inline> or <Inline>pickupItems</Inline> from client-side without going through the provided NUI callbacks. All currency checks and inventory writes are done server-side.
              </Callout>
            </section>

            <hr className="border-neutral-800 my-10" />

            {/* ── Commands ─────────────────────────────────────────────── */}
            <section id="commands">
              <SectionH2 id="commands">Commands</SectionH2>
              <DocTable
                headers={['Command', 'Arguments', 'Description']}
                rows={[
                  [<Inline key="c">/shopscreator</Inline>,       '—',            'Open the in-game admin shop creator panel'],
                  [<Inline key="c">/listshops</Inline>,          '—',            'List all shops and their database IDs in chat'],
                  [<Inline key="c">/gotoshop</Inline>,           '[id]',         'Teleport to the coordinate of the specified shop ID'],
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
                  ['Shop UI does not open',           'Ensure flake_shops is started after your framework and that NUI focus is not blocked by another resource.'],
                  ['Items not appearing in shop',     <span key="f">Confirm the item names in the creator match your inventory exactly — item names are case-sensitive.</span>],
                  ['Images not showing in UI',        <span key="f">Verify <Inline>Config.InventoryImgUrl</Inline> points to the correct path for your inventory resource.</span>],
                  ['Cannot afford / wrong currency',  <span key="f">Check the currency type set per-shop in the creator. Ensure the player has funds in the selected account (cash / bank / black_money).</span>],
                  ['Pickup blip does not appear',     <span key="f">Confirm <Inline>Config.UsePickup</Inline> is <Inline>true</Inline> for the shop and that <Inline>ox_lib</Inline> is started.</span>],
                  ['/shopscreator denied',            <span key="f">Verify your in-game group is listed in <Inline>Config.AdminGroups</Inline> (ESX) or that you have the correct QB permission.</span>],
                  ['Database error on startup',       'Ensure mysql-async (or oxmysql) is started before flake_shops in server.cfg and the SQL schema has been imported.'],
                  ['Peds / blips not spawning',       <span key="f">Run <Inline>/listshops</Inline> to confirm shops are in the database. If empty, shops may not have saved correctly — check server console for SQL errors.</span>],
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
