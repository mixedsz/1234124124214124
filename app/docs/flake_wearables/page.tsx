import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Flake Wearables' };

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
  { href: '#overview',      label: 'Overview' },
  { href: '#installation',  label: 'Installation' },
  { href: '#configuration', label: 'Configuration' },
  { href: '#adding-items',  label: 'Adding Items' },
  { href: '#troubleshooting', label: 'Troubleshooting' },
];

export default function FlakeWearablesDocsPage() {
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
            <span className="text-neutral-400">Flake Wearables</span>
          </div>

          {/* Hero */}
          <div className="relative rounded-2xl border border-neutral-700/40 bg-neutral-800/30 px-7 py-6 mb-10 overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-neutral-500/10 blur-3xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-700 flex items-center justify-center flex-shrink-0 text-xl">👕</div>
              <h1 className="text-3xl font-bold text-white">Flake Wearables</h1>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4 max-w-xl">
              A wearable accessories system for FiveM. Players equip chains, watches, bags, bulletproof vests, decals, and t-shirts through an ox_lib context menu, with full illenium-appearance integration.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'FiveM',          color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                { label: 'ESX · QBX · QB', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
                { label: 'ox_lib',         color: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
                { label: 'Lua 5.4',        color: 'bg-neutral-700/60 text-neutral-300 border-neutral-600' },
              ].map(b => (
                <span key={b.label} className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${b.color}`}>{b.label}</span>
              ))}
            </div>
            <div className="mt-5">
              <Link
                href="/product/6855783"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                Purchase Script
              </Link>
            </div>
          </div>

          {/* ── Overview ─────────────────────────────────────────────── */}
          <section id="overview">
            <SectionH2 id="overview">Overview</SectionH2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              Flake Wearables adds equippable clothing accessories to your server. Players use an item to open a context menu, select from available presets, and the component is applied directly to their ped through illenium-appearance. Items are removed from inventory on equip and restored on unequip.
            </p>

            <SectionH3>Features</SectionH3>
            <ul className="space-y-2 text-sm text-neutral-400 mb-4 list-disc pl-5">
              <li><strong className="text-white">Six Categories</strong> — Chains, Watches, Bags, Bulletproof Vests, Decals, T-Shirts.</li>
              <li><strong className="text-white">Context Menu UI</strong> — Clean ox_lib menu for browsing and equipping.</li>
              <li><strong className="text-white">Gender Support</strong> — Separate male and female drawable/texture presets.</li>
              <li><strong className="text-white">illenium-appearance</strong> — Saves and restores wearables with player outfits.</li>
              <li><strong className="text-white">Item-Based</strong> — Each wearable is a usable inventory item.</li>
              <li><strong className="text-white">Easy Presets</strong> — Add new styles by editing simple Lua tables.</li>
            </ul>

            <SectionH3>Requirements</SectionH3>
            <DocTable
              headers={['Dependency', 'Purpose', 'Required']}
              rows={[
                [<Inline key="oxl">ox_lib</Inline>, 'Callbacks, context menus, notifications', 'Yes'],
                [<Inline key="oxi">ox_inventory</Inline>, 'Item storage and usable item registration', 'Yes'],
                [<Inline key="ill">illenium-appearance</Inline>, 'Ped component application and outfit saving', 'Yes'],
                ['ESX / QBX / QB-Core', 'Framework for players and items', 'Yes'],
              ]}
            />
          </section>

          {/* ── Installation ─────────────────────────────────────────── */}
          <section id="installation">
            <SectionH2 id="installation">Installation</SectionH2>

            <SectionH3>Step 1 — Drop the Resource</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              Place the <Inline>flake_wearables</Inline> folder into your server&apos;s <Inline>resources</Inline> directory and add to <Inline>server.cfg</Inline>:
            </p>
            <div className="bg-neutral-900 border border-neutral-700/60 rounded-xl px-4 py-3 font-mono text-sm text-green-400 mb-4">
              ensure flake_wearables
            </div>

            <SectionH3>Step 2 — Add Items</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              Add each wearable item to your <Inline>ox_inventory/data/items.lua</Inline> (or QB inventory equivalent). Each item requires:
            </p>
            <ul className="space-y-1 text-sm text-neutral-400 mb-3 list-disc pl-5">
              <li><Inline>usable = true</Inline></li>
              <li><Inline>close = true</Inline> (optional — closes inventory on use)</li>
            </ul>
            <pre className="bg-neutral-900 border border-neutral-700/60 rounded-xl px-5 py-4 text-sm font-mono text-neutral-300 overflow-x-auto mb-4 whitespace-pre-wrap">{`['chain_gold'] = {
    label  = 'Gold Chain',
    weight = 100,
    stack  = false,
    close  = true,
    usable = true,
},`}</pre>

            <SectionH3>Step 3 — Configure</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              Edit <Inline>shared.lua</Inline> to map your inventory item names to wearable categories. See the <a href="#adding-items" className="text-blue-400 hover:text-blue-300 underline">Adding Items</a> section below.
            </p>
            <Callout type="success" title="Done">
              Restart your server and players can use wearable items from their inventory.
            </Callout>

            <SectionH3>File Structure</SectionH3>
            <div className="bg-neutral-900 border border-neutral-700/60 rounded-xl px-5 py-4 font-mono text-sm leading-7 mb-4">
              <span className="text-blue-400">flake_wearables/</span>{'\n'}
              {'├── '}<span className="text-blue-400">wearables/</span>{'\n'}
              {'│   ├── '}<span className="text-neutral-300">chains.lua</span><span className="text-neutral-600">          — Chain presets (escrow-ignored)</span>{'\n'}
              {'│   ├── '}<span className="text-neutral-300">watches.lua</span><span className="text-neutral-600">         — Watch presets (escrow-ignored)</span>{'\n'}
              {'│   ├── '}<span className="text-neutral-300">bag.lua</span><span className="text-neutral-600">             — Bag presets (escrow-ignored)</span>{'\n'}
              {'│   ├── '}<span className="text-neutral-300">bproof.lua</span><span className="text-neutral-600">          — Bulletproof vest presets (escrow-ignored)</span>{'\n'}
              {'│   ├── '}<span className="text-neutral-300">decals.lua</span><span className="text-neutral-600">          — Decal presets (escrow-ignored)</span>{'\n'}
              {'│   └── '}<span className="text-neutral-300">tshirt.lua</span><span className="text-neutral-600">          — T-shirt presets (escrow-ignored)</span>{'\n'}
              {'├── '}<span className="text-blue-400">client/</span>{'\n'}
              {'│   └── '}<span className="text-neutral-300">main.lua</span><span className="text-neutral-600">            — Menu logic, component application</span>{'\n'}
              {'├── '}<span className="text-blue-400">server/</span>{'\n'}
              {'│   └── '}<span className="text-neutral-300">main.lua</span><span className="text-neutral-600">            — Item registration, callbacks</span>{'\n'}
              {'├── '}<span className="text-neutral-300">shared.lua</span><span className="text-neutral-600">              — Item-to-category mapping (escrow-ignored)</span>{'\n'}
              {'└── '}<span className="text-neutral-300">fxmanifest.lua</span><span className="text-neutral-600">          — Resource manifest</span>
            </div>
          </section>

          {/* ── Configuration ────────────────────────────────────────── */}
          <section id="configuration">
            <SectionH2 id="configuration">Configuration</SectionH2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4">
              All preset files and <Inline>shared.lua</Inline> are escrow-ignored and fully editable.
            </p>

            <SectionH3>Item Mapping</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              <Inline>shared.lua</Inline> maps inventory item names to wearable categories. When a player uses any item in the list, the script opens the context menu for that category.
            </p>
            <pre className="bg-neutral-900 border border-neutral-700/60 rounded-xl px-5 py-4 text-sm font-mono text-neutral-300 overflow-x-auto mb-4 whitespace-pre-wrap">{`Config.Chains = {
    Items = {
        'chain_gold',
        'chain_silver',
        'chain_diamond',
    },
}`}</pre>

            <SectionH3>Categories</SectionH3>
            <DocTable
              headers={['Category', 'Component', 'Preset File']}
              rows={[
                ['Chains',            'Neck / Torso accessory', <Inline key="c">wearables/chains.lua</Inline>],
                ['Watches',           'Left wrist',             <Inline key="w">wearables/watches.lua</Inline>],
                ['Bags',              'Backpack / duffle',      <Inline key="b">wearables/bag.lua</Inline>],
                ['Bulletproof Vests', 'Body armour',            <Inline key="bp">wearables/bproof.lua</Inline>],
                ['Decals',            'Torso overlay',          <Inline key="d">wearables/decals.lua</Inline>],
                ['T-Shirts',          'Undershirt',             <Inline key="t">wearables/tshirt.lua</Inline>],
              ]}
            />
          </section>

          {/* ── Adding Items ─────────────────────────────────────────── */}
          <section id="adding-items">
            <SectionH2 id="adding-items">Adding Items</SectionH2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              Adding a new wearable style takes three steps.
            </p>

            <SectionH3>Step 1 — Add Inventory Item</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              Register the item in your inventory config:
            </p>
            <pre className="bg-neutral-900 border border-neutral-700/60 rounded-xl px-5 py-4 text-sm font-mono text-neutral-300 overflow-x-auto mb-4 whitespace-pre-wrap">{`['chain_ruby'] = {
    label  = 'Ruby Chain',
    weight = 100,
    stack  = false,
    close  = true,
    usable = true,
},`}</pre>

            <SectionH3>Step 2 — Map to Category</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              Add the item name to the correct list in <Inline>shared.lua</Inline>:
            </p>
            <pre className="bg-neutral-900 border border-neutral-700/60 rounded-xl px-5 py-4 text-sm font-mono text-neutral-300 overflow-x-auto mb-4 whitespace-pre-wrap">{`Config.Chains.Items = {
    'chain_gold',
    'chain_silver',
    'chain_ruby',  -- new
}`}</pre>

            <SectionH3>Step 3 — Add Preset</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              Open the corresponding preset file (e.g. <Inline>wearables/chains.lua</Inline>) and add the drawable data:
            </p>
            <pre className="bg-neutral-900 border border-neutral-700/60 rounded-xl px-5 py-4 text-sm font-mono text-neutral-300 overflow-x-auto mb-4 whitespace-pre-wrap">{`Config.Chains.Presets.Chains.chain_ruby = {
    male = {
        drawable = 15,
        texture  = 0,
    },
    female = {
        drawable = 15,
        texture  = 0,
    },
}`}</pre>
            <Callout type="info" title="Finding Drawable IDs">
              Use a tool like <strong>vMenu</strong> or <strong>Menyoo</strong> to browse component drawables on your ped. Note the component index, drawable ID, and texture ID, then map them to the correct category.
            </Callout>
            <Callout type="warning" title="Gender Support">
              You can omit the <Inline>male</Inline> or <Inline>female</Inline> block if a style only exists for one gender. The script skips missing genders gracefully.
            </Callout>
          </section>

          {/* ── Troubleshooting ──────────────────────────────────────── */}
          <section id="troubleshooting">
            <SectionH2 id="troubleshooting">Troubleshooting</SectionH2>
            <DocTable
              headers={['Issue', 'Fix']}
              rows={[
                ['Item not usable', <span key="u">Ensure <Inline>usable = true</Inline> is set in your inventory item definition.</span>],
                ['Menu not opening', <span key="m">Verify the item name matches exactly in <Inline>shared.lua</Inline> and your inventory config.</span>],
                ['Component not showing', 'Double-check the drawable and texture IDs. Some drawables require a specific component slot.'],
                ['Component disappears on relog', <span key="r">Ensure <Inline>illenium-appearance</Inline> is saving outfits correctly and the player saves after equipping.</span>],
                ['Wrong component applied', 'Verify you are editing the correct preset file for the category. Chains and Decals use different component indices.'],
                ['Female drawables not working', 'Female ped models often use different drawable IDs. Test on both genders or omit unsupported blocks.'],
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
