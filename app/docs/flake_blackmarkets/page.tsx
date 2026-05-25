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
  { href: '#usage',           label: 'Usage' },
  { href: '#pickup',          label: 'Pickup System' },
  { href: '#troubleshooting', label: 'Troubleshooting' },
];

export default function FlakeBlackmarketsDocsPage() {
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
            <span className="text-neutral-400">Flake Blackmarkets</span>
          </div>

          {/* Hero */}
          <div className="relative rounded-2xl border border-neutral-700/40 bg-neutral-800/30 px-7 py-6 mb-10 overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-neutral-500/10 blur-3xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-700 flex items-center justify-center flex-shrink-0 text-xl">🕵️</div>
              <h1 className="text-3xl font-bold text-white">Flake Blackmarkets</h1>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4 max-w-xl">
              A fully configurable black market system for FiveM with dual framework support, direct or pickup delivery, custom currencies, and per-market peds.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'FiveM',           color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                { label: 'ESX & QB-Core',   color: 'bg-green-500/10 text-green-400 border-green-500/20' },
                { label: 'ox_lib',          color: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
                { label: 'Lua 5.4',         color: 'bg-neutral-700/60 text-neutral-300 border-neutral-600' },
              ].map(b => (
                <span key={b.label} className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${b.color}`}>{b.label}</span>
              ))}
            </div>
          </div>

          {/* ── Overview ─────────────────────────────────────────────── */}
          <section id="overview">
            <SectionH2 id="overview">Overview</SectionH2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              Create multiple black market locations across the map, each with its own inventory, prices, accepted currencies, and delivery method.
            </p>

            <SectionH3>Features</SectionH3>
            <ul className="space-y-2 text-sm text-neutral-400 mb-4 list-disc pl-5">
              <li><strong className="text-white">Dual Framework</strong> — Auto-detects ESX or QB-Core.</li>
              <li><strong className="text-white">Multiple Markets</strong> — Define as many black markets as you want in config.</li>
              <li><strong className="text-white">Direct or Pickup</strong> — Per-market choice: instant delivery or delayed pickup.</li>
              <li><strong className="text-white">Custom Currencies</strong> — Accept cash, bank, black money, or any item as currency.</li>
              <li><strong className="text-white">Shop Peds</strong> — Optional NPCs at market locations with scenarios.</li>
              <li><strong className="text-white">Map Blips</strong> — Configurable blips per market.</li>
              <li><strong className="text-white">Server-Side Validation</strong> — Prices, items, and funds are validated on the server.</li>
              <li><strong className="text-white">Discord Logging</strong> — Optional webhook logging for purchases.</li>
            </ul>

            <SectionH3>Requirements</SectionH3>
            <DocTable
              headers={['Dependency', 'Purpose', 'Required']}
              rows={[
                [<Inline key="oxlib">ox_lib</Inline>, 'Callbacks, notifications', 'Yes'],
                ['ESX or QB-Core', 'Framework for players, money, items', 'Yes'],
              ]}
            />
          </section>

          {/* ── Installation ─────────────────────────────────────────── */}
          <section id="installation">
            <SectionH2 id="installation">Installation</SectionH2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              Place the <Inline>flake_blackmarkets</Inline> folder into your server&apos;s <Inline>resources</Inline> directory and add to <Inline>server.cfg</Inline>:
            </p>
            <div className="bg-neutral-900 border border-neutral-700/60 rounded-xl px-4 py-3 font-mono text-sm text-green-400 mb-4">
              ensure flake_blackmarkets
            </div>
            <Callout type="success" title="Done">
              Restart your server and black market blips will appear on the map.
            </Callout>

            <SectionH3>File Structure</SectionH3>
            <div className="bg-neutral-900 border border-neutral-700/60 rounded-xl px-5 py-4 font-mono text-sm leading-7 mb-4">
              <span className="text-blue-400">flake_blackmarkets/</span>{'\n'}
              {'├── '}<span className="text-blue-400">client/</span>{'\n'}
              {'│   └── '}<span className="text-neutral-300">client.lua</span><span className="text-neutral-600">      — Shop UI, peds, blips, pickup logic</span>{'\n'}
              {'├── '}<span className="text-blue-400">server/</span>{'\n'}
              {'│   └── '}<span className="text-neutral-300">server.lua</span><span className="text-neutral-600">      — Purchase validation, money, items</span>{'\n'}
              {'├── '}<span className="text-blue-400">config/</span>{'\n'}
              {'│   ├── '}<span className="text-neutral-300">config.lua</span><span className="text-neutral-600">      — Framework, settings, notifications (escrow-ignored)</span>{'\n'}
              {'│   ├── '}<span className="text-neutral-300">edits.lua</span><span className="text-neutral-600">       — Notification overrides (escrow-ignored)</span>{'\n'}
              {'│   └── '}<span className="text-neutral-300">sv_config.lua</span><span className="text-neutral-600">   — Markets, items, prices, pickups (escrow-ignored)</span>{'\n'}
              {'├── '}<span className="text-blue-400">html/</span>{'\n'}
              {'│   └── '}<span className="text-blue-400">build/</span><span className="text-neutral-600">          — Shop UI files</span>{'\n'}
              {'└── '}<span className="text-neutral-300">fxmanifest.lua</span><span className="text-neutral-600">      — Resource manifest</span>
            </div>
          </section>

          {/* ── Configuration ────────────────────────────────────────── */}
          <section id="configuration">
            <SectionH2 id="configuration">Configuration</SectionH2>

            <SectionH3>Main Settings</SectionH3>
            <DocTable
              headers={['Setting', 'Default', 'Description']}
              rows={[
                [<Inline key="db">Config.Debug</Inline>, <Inline key="dbv">false</Inline>, 'Enable debug prints in console'],
                [<Inline key="dd">Config.DrawDistance</Inline>, <Inline key="ddv">25</Inline>, 'Marker draw distance'],
                [<Inline key="sz">Config.Size</Inline>, <Inline key="szv">&#123; x=0.4, y=0.4, z=0.2 &#125;</Inline>, 'Marker size'],
                [<Inline key="co">Config.Color</Inline>, <Inline key="cov">&#123; r=0, g=128, b=255 &#125;</Inline>, 'Marker RGB colour'],
                [<Inline key="ty">Config.Type</Inline>, <Inline key="tyv">2</Inline>, 'Marker type index'],
                [<Inline key="iu">Config.InventoryImgUrl</Inline>, <Inline key="iuv">ox_inventory/web/images/</Inline>, 'Path to inventory images'],
              ]}
            />

            <SectionH3>Market Configuration</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              Markets are defined in <Inline>config/sv_config.lua</Inline>:
            </p>
            <pre className="bg-neutral-900 border border-neutral-700/60 rounded-xl px-5 py-4 text-sm font-mono text-neutral-300 overflow-x-auto mb-4 whitespace-pre-wrap">{`Config.BlackMarkets = {
    MyMarket = {
        Label    = "Black Market",
        SaleType = "direct",   -- "direct" or "pickup"

        Blip = {
            sprite     = 459,
            scale      = 0.8,
            colour     = 3,
            shortRange = true,
            name       = "Black Market",
        },

        Items = {
            { label = "Glock 17", item = "WEAPON_GLOCK17", price = 35000 },
        },

        Pos = {
            vector3(927.93, -1488.07, 30.49),
        },

        Currencies = {
            { name = "black_money", label = "Dirty Money" },
        },

        UsePickup = false,
        UsePed    = true,
        ShopPed   = {
            model    = "s_m_y_dealer_01",
            heading  = 180.0,
            scenario = "WORLD_HUMAN_DRUG_DEALER",
        },
        ShopLogo = "blackmarket.png",
    },
}`}</pre>

            <SectionH3>Schema Reference</SectionH3>
            <DocTable
              headers={['Field', 'Type', 'Required', 'Description']}
              rows={[
                [<Inline key="la">Label</Inline>, 'String', 'Yes', 'Display name for the market'],
                [<Inline key="st">SaleType</Inline>, 'String', 'Yes', '"direct" (instant) or "pickup" (delayed)'],
                [<Inline key="it">Items</Inline>, 'Array', 'Yes', 'Items for sale with label, item name, and price'],
                [<Inline key="po">Pos</Inline>, 'Array', 'Yes', 'Market locations (vector3)'],
                [<Inline key="cu">Currencies</Inline>, 'Array', 'Yes', 'Accepted payment types with display labels'],
                [<Inline key="up">UsePickup</Inline>, 'Boolean', 'No', 'Enable delayed pickup for this market'],
                [<Inline key="upe">UsePed</Inline>, 'Boolean', 'No', 'Spawn an NPC at the location'],
                [<Inline key="sp">ShopPed</Inline>, 'Object', 'No', 'Ped model, heading, and scenario'],
                [<Inline key="sl">ShopLogo</Inline>, 'String', 'No', 'Image filename from html/img/'],
                [<Inline key="bl">Blip</Inline>, 'Object', 'No', 'Map blip configuration'],
              ]}
            />

            <SectionH3>Pickup Locations</SectionH3>
            <pre className="bg-neutral-900 border border-neutral-700/60 rounded-xl px-5 py-4 text-sm font-mono text-neutral-300 overflow-x-auto mb-4 whitespace-pre-wrap">{`Config.PickUpLocations = {
    [1] = {
        coords   = vector4(950.5, -203.6, 73.2, 296.1),
        pedModel = "g_m_y_mexgang_01",
        waitTime = 30,  -- seconds
        label    = "BROKEN MOTELS"
    },
}`}</pre>

            <SectionH3>Accepted Currencies</SectionH3>
            <DocTable
              headers={['Framework', 'Currency Name', 'Description']}
              rows={[
                ['QBCore', <Inline key="qc1">cash, bank, markedbills</Inline>, 'Built-in money types'],
                ['QBCore', 'Any item name', 'Item-based currency (e.g., crypto)'],
                ['ESX', <Inline key="es1">money, bank, black_money</Inline>, 'Built-in account types'],
                ['ESX', 'Any item name', 'Item-based currency (e.g., blackdiamond)'],
              ]}
            />
          </section>

          {/* ── Usage ────────────────────────────────────────────────── */}
          <section id="usage">
            <SectionH2 id="usage">Usage</SectionH2>

            <SectionH3>Shopping Flow</SectionH3>
            <ol className="space-y-1 text-sm text-neutral-400 mb-4 list-decimal pl-5">
              <li>Approach the market marker or ped.</li>
              <li>Press <kbd className="bg-neutral-800 border border-neutral-700 rounded px-1.5 py-0.5 text-xs text-neutral-300">E</kbd> to open the shop UI.</li>
              <li>Add items to your cart.</li>
              <li>Select a payment method and confirm purchase.</li>
              <li>If the market uses Direct, items go straight to inventory.</li>
              <li>If the market uses Pickup, a blip spawns and you must wait before collecting.</li>
            </ol>

            <SectionH3>Server-Side Validation</SectionH3>
            <ul className="space-y-1 text-sm text-neutral-400 mb-4 list-disc pl-5">
              <li>Item prices are checked against the server config — client cannot modify them.</li>
              <li>Payment method must be in the market&apos;s accepted currency list.</li>
              <li>Player funds are verified before deducting.</li>
              <li>Invalid items are rejected and logged as potential cheating.</li>
            </ul>
          </section>

          {/* ── Pickup System ────────────────────────────────────────── */}
          <section id="pickup">
            <SectionH2 id="pickup">Pickup System</SectionH2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              When <Inline>UsePickup = true</Inline> on a market, purchased items are not given immediately. Instead, the player receives a blip to a random pickup location.
            </p>

            <SectionH3>How It Works</SectionH3>
            <ol className="space-y-1 text-sm text-neutral-400 mb-4 list-decimal pl-5">
              <li>Player completes purchase.</li>
              <li>A random pickup location is selected from <Inline>Config.PickUpLocations</Inline>.</li>
              <li>A blip is created on the player&apos;s map.</li>
              <li>After <Inline>waitTime</Inline> seconds, a ped spawns and the order becomes ready.</li>
              <li>Player approaches the ped and presses <kbd className="bg-neutral-800 border border-neutral-700 rounded px-1.5 py-0.5 text-xs text-neutral-300">E</kbd> to collect items.</li>
            </ol>
            <Callout type="warning" title="Important">
              Pickup orders are stored in server memory and will be lost if the server restarts before collection. Orders are also cleared when the player disconnects.
            </Callout>
          </section>

          {/* ── Troubleshooting ──────────────────────────────────────── */}
          <section id="troubleshooting">
            <SectionH2 id="troubleshooting">Troubleshooting</SectionH2>
            <DocTable
              headers={['Issue', 'Fix']}
              rows={[
                ['Markets not appearing', 'Ensure the resource is ensured after the framework. Check console for errors.'],
                ['Images not loading', <span key="img">Verify <Inline>Config.InventoryImgUrl</Inline> matches your inventory&apos;s image directory.</span>],
                ['Purchases failing', 'Check that the currency exists in the player\'s account/inventory and the item is valid.'],
                ['Pickup not working', <span key="pu">Ensure <Inline>Config.PickUpLocations</Inline> has at least one entry and the market has <Inline>UsePickup = true</Inline>.</span>],
                ['Peds not spawning', 'Confirm the ped model exists in your server build. Most use base-game models.'],
                ['Discord logs not sending', 'Verify the webhook URL in config.lua and that logging is enabled.'],
                ['Shop UI not opening', 'Ensure ox_lib is running and the HTML build folder is intact.'],
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
