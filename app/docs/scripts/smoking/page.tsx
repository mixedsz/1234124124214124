import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { DocsSidebar, DocsMobileNav } from '@/components/docs-sidebar';
import Link from 'next/link';
import { ChevronRight, AlertTriangle, Info, Zap, Check } from 'lucide-react';
import { CodeBlock } from '@/components/docs-code-block';

// ── Primitives ────────────────────────────────────────────────────────────────

function Inline({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded text-xs text-blue-300 font-mono">
      {children}
    </code>
  );
}

function Callout({ type = 'info', title, children }: { type?: 'info' | 'warning' | 'success' | 'danger'; title?: string; children: React.ReactNode }) {
  const s = {
    info:    { border: 'border-l-blue-500',   bg: 'bg-blue-500/5',   icon: <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />,             text: 'text-blue-400' },
    warning: { border: 'border-l-yellow-500', bg: 'bg-yellow-500/5', icon: <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />,  text: 'text-yellow-400' },
    success: { border: 'border-l-green-500',  bg: 'bg-green-500/5',  icon: <Check className="w-4 h-4 text-green-400 flex-shrink-0" />,           text: 'text-green-400' },
    danger:  { border: 'border-l-red-500',    bg: 'bg-red-500/5',    icon: <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />,     text: 'text-red-400' },
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

function FileTree() {
  const lines: { indent: number; type: 'dir' | 'file' | 'connector'; text: string; comment?: string }[] = [
    { indent: 0, type: 'dir',       text: 'flake_smoking/' },
    { indent: 1, type: 'connector', text: '├── ', },
    { indent: 1, type: 'dir',       text: 'client/' },
    { indent: 2, type: 'connector', text: '│   └── ' },
    { indent: 2, type: 'file',      text: 'client.lua',    comment: '-- Client-side smoking logic, effects, input' },
    { indent: 1, type: 'connector', text: '├── ' },
    { indent: 1, type: 'dir',       text: 'server/' },
    { indent: 2, type: 'connector', text: '│   └── ' },
    { indent: 2, type: 'file',      text: 'main.lua',      comment: '-- Framework bridges, items, server events' },
    { indent: 1, type: 'connector', text: '├── ' },
    { indent: 1, type: 'dir',       text: 'config/' },
    { indent: 2, type: 'connector', text: '│   ├── ' },
    { indent: 2, type: 'file',      text: 'config.lua',    comment: '-- Keybinds, vape settings, smoke items' },
    { indent: 2, type: 'connector', text: '│   ├── ' },
    { indent: 2, type: 'file',      text: 'edits.lua',     comment: '-- Notifications and stress trigger hook' },
    { indent: 2, type: 'connector', text: '│   └── ' },
    { indent: 2, type: 'file',      text: 'rolling.lua',   comment: '-- Rolling recipes, leaf items, crafting' },
    { indent: 1, type: 'connector', text: '├── ' },
    { indent: 1, type: 'dir',       text: '[install]/' },
    { indent: 2, type: 'connector', text: '│   ├── ' },
    { indent: 2, type: 'file',      text: 'ox-install - readme.md' },
    { indent: 2, type: 'connector', text: '│   ├── ' },
    { indent: 2, type: 'file',      text: 'qb-install - readme.md' },
    { indent: 2, type: 'connector', text: '│   └── ' },
    { indent: 2, type: 'dir',       text: 'images/',       comment: '-- Inventory icons for every item' },
    { indent: 1, type: 'connector', text: '└── ' },
    { indent: 1, type: 'file',      text: 'fxmanifest.lua', comment: '-- Resource manifest (cerulean, Lua 5.4)' },
  ];

  return (
    <div className="rounded-xl border border-neutral-700/60 bg-neutral-800/50 px-4 py-4 my-4 overflow-x-auto">
      <pre className="text-sm font-mono leading-6">
        {lines.map((line, i) => {
          if (line.type === 'connector') {
            return (
              <span key={i} className="text-neutral-600">{line.text}</span>
            );
          }
          if (line.type === 'dir') {
            return (
              <span key={i}>
                <span className="text-blue-400 font-medium">{line.text}</span>
                {line.comment && <span className="text-neutral-600">{'  ' + line.comment}</span>}
                {'\n'}
              </span>
            );
          }
          return (
            <span key={i}>
              <span className="text-neutral-300">{line.text}</span>
              {line.comment && <span className="text-neutral-600">{'  ' + line.comment}</span>}
              {'\n'}
            </span>
          );
        })}
      </pre>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="bg-neutral-800 border border-neutral-600 border-b-2 rounded px-1.5 py-0.5 text-xs font-mono text-neutral-200">
      {children}
    </kbd>
  );
}

const ON_THIS_PAGE = [
  { href: '#overview',       label: 'Overview' },
  { href: '#installation',   label: 'Installation' },
  { href: '#configuration',  label: 'Configuration' },
  { href: '#usage',          label: 'Usage & Controls' },
  { href: '#items',          label: 'Items' },
  { href: '#troubleshooting',label: 'Troubleshooting' },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function FlakeSmokingDocsPage() {
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
            <div className="flex items-center gap-1.5 text-xs text-neutral-600 mb-8 flex-wrap">
              <Link href="/" className="hover:text-neutral-400 transition">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/docs" className="hover:text-neutral-400 transition">Documentation</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/docs/scripts/smoking" className="hover:text-neutral-400 transition">Scripts</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-neutral-400">Flake Smoking & Vaping</span>
            </div>

            {/* Hero */}
            <div className="relative rounded-2xl border border-blue-500/20 bg-blue-500/5 px-7 py-6 mb-10 overflow-hidden">
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">Flake Smoking & Vaping</h1>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed mb-4 max-w-xl">
                A premium smoking and vaping script for FiveM. Built for ESX and QB-Core with dual inventory support, realistic particle effects, joint rolling, and a fully configurable item ecosystem.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'FiveM',         color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                  { label: 'ESX & QB-Core', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
                  { label: 'OX Inventory',  color: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
                  { label: 'Lua 5.4',       color: 'bg-neutral-700/60 text-neutral-300 border-neutral-600' },
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
                Flake Smoking is a standalone resource that brings a fully interactive smoking and vaping experience into your FiveM server. It handles everything from lighting a joint with a lighter, passing it to another player, rolling raw flower into blunts, to managing vape liquid refills through an OX Lib context menu.
              </p>
              <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                The script is framework-agnostic at its core — it auto-detects whether you&apos;re running <strong className="text-white">ESX</strong> or <strong className="text-white">QB-Core</strong> and adapts inventory and notification calls accordingly. All configuration lives in <Inline>config/</Inline> and is marked as escrow-ignored, meaning you can modify items, keybinds, effects, and animations without touching the core logic.
              </p>

              <SectionH3>Features</SectionH3>
              <ul className="space-y-2 text-sm text-neutral-400 mb-4">
                {[
                  ['Dual Framework Support', 'Auto-detects ESX or QB-Core on both client and server.'],
                  ['30+ Strains', 'Pre-configured with a wide catalog of raw flower and pre-rolled joint items.'],
                  ['Realistic Rolling', 'Convert raw flower into joints using Backwoods or Grabba Leaf.'],
                  ['Interactive Vape System', 'Refillable vape with juice flavors and liquid tracking.'],
                  ['Player-to-Player Giving', 'Hand off joints or vapes to nearby players with a confirmation prompt.'],
                  ['Dynamic Effects', 'Timecycle modifiers, motion blur, facial overrides, and movement clipsets that scale with usage.'],
                  ['Speed Multipliers', 'Certain strains apply temporary sprint speed boosts.'],
                  ['Particle Effects', 'Networked smoke particles for both prop and mouth exhale states.'],
                  ['Combat Disabling', 'Optional restriction of melee and aim controls while smoking.'],
                  ['Vehicle Integration', 'Automatically rolls down the driver window while smoking in a car.'],
                  ['Death & Water Cleanup', 'Props and effects are safely destroyed if the player dies or enters water.'],
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
                  [<Inline key="1">ox_lib</Inline>, 'Progress bars, context menus, callbacks, notifications', <span key="r" className="text-green-400 font-medium">Yes</span>],
                  [<Inline key="2">oxmysql</Inline>, 'MySQL wrapper (loaded by server)', <span key="r" className="text-green-400 font-medium">Yes</span>],
                  ['ESX or QB-Core', 'Framework for items, players, and inventory', <span key="r" className="text-green-400 font-medium">Yes</span>],
                  ['OX Inventory or QB-Inventory', 'Item storage and images', <span key="r" className="text-green-400 font-medium">Yes</span>],
                ]}
              />
              <Callout type="info" title="Note">
                The script uses <Inline>/assetpacks</Inline> as a dependency in the manifest for prop streaming. Ensure your server is configured to handle asset packs if you plan to use custom models.
              </Callout>
            </section>

            <hr className="border-neutral-800 my-10" />

            {/* ── Installation ─────────────────────────────────────────── */}
            <section id="installation">
              <SectionH2 id="installation">Installation</SectionH2>

              <SectionH3>Step 1 — Drop the Resource</SectionH3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-2">
                Place the <Inline>flake_smoking</Inline> folder into your server&apos;s <Inline>resources</Inline> directory. Add the following to your <Inline>server.cfg</Inline>:
              </p>
              <CodeBlock code="ensure flake_smoking" filename="server.cfg" whitespace py="py-4" my="my-4" />

              <SectionH3>Step 2 — Add Items</SectionH3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-2">Depending on your framework and inventory, add the provided item definitions:</p>
              <ul className="space-y-2 text-sm text-neutral-400 mb-4">
                <li className="flex gap-2"><span className="text-blue-500 flex-shrink-0">•</span><span><strong className="text-white">OX Inventory</strong> — Paste the contents of <Inline>[install]/ox-install - readme.md</Inline> into <Inline>ox_inventory/data/items.lua</Inline>.</span></li>
                <li className="flex gap-2"><span className="text-blue-500 flex-shrink-0">•</span><span><strong className="text-white">QB-Core</strong> — Paste the contents of <Inline>[install]/qb-install - readme.md</Inline> into <Inline>qb-core/shared/items.lua</Inline>.</span></li>
              </ul>

              <SectionH3>Step 3 — Add Images</SectionH3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-2">Copy all images from <Inline>[install]/images/</Inline> into your inventory&apos;s image folder:</p>
              <ul className="space-y-2 text-sm text-neutral-400 mb-4">
                <li className="flex gap-2"><span className="text-blue-500 flex-shrink-0">•</span><span><strong className="text-white">OX Inventory</strong> — <Inline>ox_inventory/web/build/images/</Inline></span></li>
                <li className="flex gap-2"><span className="text-blue-500 flex-shrink-0">•</span><span><strong className="text-white">QB-Inventory</strong> — <Inline>qb-inventory/html/images/</Inline></span></li>
              </ul>

              <SectionH3>Step 4 — Configure (Optional)</SectionH3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-3">
                Edit the files in <Inline>config/</Inline> to adjust keybinds, item stats, notifications, and rolling behavior. These files are escrow-ignored and safe to modify.
              </p>
              <Callout type="success" title="Done">
                Restart your server and players can begin using smokable items immediately. No database setup is required.
              </Callout>

            </section>

            <hr className="border-neutral-800 my-10" />

            {/* ── Configuration ────────────────────────────────────────── */}
            <section id="configuration">
              <SectionH2 id="configuration">Configuration</SectionH2>
              <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                All tunables are split across three config files. You should not need to edit anything outside of <Inline>config/</Inline> for normal usage.
              </p>

              <SectionH3>Controls & Keybinds</SectionH3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-3">
                Located in <Inline>config/config.lua</Inline>. Each value is a control index used by the native <Inline>IsControlJustPressed</Inline>.
              </p>
              <DocTable
                headers={['Config Key', 'Default', 'Action']}
                rows={[
                  [<Inline key="k">SmokeButton</Inline>,       <Kbd key="v">144 (F)</Kbd>,          'Take a puff / inhale'],
                  [<Inline key="k">ThrowButton</Inline>,       <Kbd key="v">73 (X)</Kbd>,           'Drop / throw the item'],
                  [<Inline key="k">MouthButton</Inline>,       <Kbd key="v">10 (Page Up)</Kbd>,     'Move item to mouth'],
                  [<Inline key="k">HandButton</Inline>,        <Kbd key="v">11 (Page Down)</Kbd>,   'Move item to hand'],
                  [<Inline key="k">GiveButton</Inline>,        <Kbd key="v">121 (Insert)</Kbd>,     'Initiate give to nearby player'],
                  [<Inline key="k">ConfirmGiveButton</Inline>, <Kbd key="v">38 (E)</Kbd>,           'Confirm giving the item'],
                  [<Inline key="k">CancelGiveButton</Inline>,  <Kbd key="v">73 (X)</Kbd>,           'Cancel giving'],
                  [<Inline key="k">RefillVapeButton</Inline>,  <Kbd key="v">10 (Page Up)</Kbd>,     'Open vape refill menu'],
                ]}
              />
              <Callout type="warning" title="Control Collision">
                By default, <Inline>ThrowButton</Inline> and <Inline>CancelGiveButton</Inline> share <Kbd>73 (X)</Kbd>. If you want separate binds, change one of them to a different control index.
              </Callout>

              <SectionH3>Smoke Items Schema</SectionH3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-2">
                Every smokable item is defined as a table entry inside <Inline>Config.Smoke</Inline>:
              </p>
              <CodeBlock filename="config/config.lua" whitespace py="py-4" my="my-4" code={`{
    Item            = "item_name",       -- Inventory item name
    Prop            = "prop_model",      -- GTA prop model name
    Health          = 25,                -- Health restored per puff
    Armor           = 50,                -- Armor restored per puff
    Stress          = 5,                 -- Stress relieved per puff
    Size            = 20,                -- Starting durability (joints)
    Type            = "joint",           -- "joint" | "vape"
    SpeedMultiplier = 1.50,              -- Optional sprint multiplier
    SpeedTime       = 120,               -- Multiplier duration (seconds)
    Time            = 120                -- Auto-burn countdown (joints only)
}`} />
              <p className="text-neutral-400 text-sm leading-relaxed">
                Joints consume <Inline>Size</Inline> per puff based on <Inline>Config.SizeRemove</Inline> (randomized min/max). Vapes consume a fixed <Inline>Config.VapeSizeRemove</Inline> per puff and must be refilled with juice items.
              </p>

              <SectionH3>Vape Settings</SectionH3>
              <DocTable
                headers={['Setting', 'Default', 'Description']}
                rows={[
                  [<Inline key="k">MaxLiquid</Inline>,        '10',  'Maximum liquid capacity per vape'],
                  [<Inline key="k">AddLiquidInVape</Inline>,  '3',   'Liquid added per juice item used'],
                  [<Inline key="k">VapeSizeRemove</Inline>,   '0.5', 'Liquid consumed per puff'],
                ]}
              />
              <p className="text-neutral-400 text-sm leading-relaxed">
                Vape juice flavors are defined in <Inline>Config.VapeJuices</Inline>. These must exist as inventory items and are consumed on refill.
              </p>

              <SectionH3>Rolling System</SectionH3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-2">
                Located in <Inline>config/rolling.lua</Inline>. Players use raw flower items to craft rolled joints. Each recipe requires:
              </p>
              <ul className="space-y-2 text-sm text-neutral-400 mb-3">
                <li className="flex gap-2"><span className="text-blue-500 flex-shrink-0">•</span><span>1× raw flower item (e.g. <Inline>white_runtz</Inline>)</span></li>
                <li className="flex gap-2"><span className="text-blue-500 flex-shrink-0">•</span><span>1× leaf item (Backwood or Grabba Leaf)</span></li>
              </ul>
              <p className="text-neutral-400 text-sm leading-relaxed">
                The output amount defaults to <Inline>Config.JointsGiven</Inline> (2) but can be overridden per-recipe with the <Inline>amount</Inline> field. Rolling plays a progress bar and animation before awarding the joint items.
              </p>

              <SectionH3>Notifications</SectionH3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                <Inline>config/edits.lua</Inline> contains the notification function and all user-facing strings. To swap <Inline>ox_lib</Inline> for another notification system, replace <Inline>Config.Notify</Inline> here. All messages can be localized or reworded via <Inline>Config.Notifications</Inline>.
              </p>
            </section>

            <hr className="border-neutral-800 my-10" />

            {/* ── Usage ───────────────────────────────────────────────── */}
            <section id="usage">
              <SectionH2 id="usage">Usage & Controls</SectionH2>
              <p className="text-neutral-400 text-sm leading-relaxed mb-3">
                When you use a joint or vape, the script enters a smoking loop. While active, you have full control over the item:
              </p>
              <ul className="space-y-2 text-sm text-neutral-400 mb-4">
                {[
                  ['Smoke', 'Press the configured smoke key to take a puff. Joints burn down over time; vapes consume liquid.'],
                  ['Hand / Mouth', 'Toggle where the item is held. Joints can sit in the mouth or hand. Vapes stay in hand.'],
                  ['Give', 'Target a nearby player and hand off the item. They receive it with the current burn/liquid level preserved.'],
                  ['Throw', 'Drop the item on the ground and exit the smoking state.'],
                  ['Refill Vape', 'Open the OX Lib context menu to select a juice flavor from your inventory.'],
                ].map(([t, d]) => (
                  <li key={t as string} className="flex gap-2">
                    <span className="text-blue-500 flex-shrink-0 mt-0.5">•</span>
                    <span><strong className="text-white">{t}</strong> — {d}</span>
                  </li>
                ))}
              </ul>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Effects stack with each puff. Once the effect level hits the threshold, the player will feel &quot;stoned enough&quot; and refuse to smoke more until the level decays. Effects fade automatically over time.
              </p>

              <SectionH3>Technical Notes</SectionH3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-2">
                The client tracks smoking state with <Inline>isSmoking</Inline>, <Inline>inHand</Inline>, <Inline>inMouth</Inline>, and <Inline>isGivingMode</Inline>. Props attach to different bones depending on state (hand: <Inline>64097</Inline>, mouth: <Inline>47419</Inline>, vape hand: <Inline>18905</Inline>). All props are network-synced so other players see them.
              </p>
              <p className="text-neutral-400 text-sm leading-relaxed mb-2">
                Smoke particles use the <Inline>core</Inline> asset and <Inline>exp_grd_bzgas_smoke</Inline> effect. Prop smoke loops on the joint itself; mouth smoke loops on a hidden prop during exhale. All particle events are broadcast through the server so every client sees the same timing.
              </p>
              <p className="text-neutral-400 text-sm leading-relaxed">
                When giving an item, the giver&apos;s client deletes the local prop and sends a server event to award the item metadata to the receiver. The receiver then spawns their own prop and re-enters the smoking loop.
              </p>
            </section>

            <hr className="border-neutral-800 my-10" />

            {/* ── Items ───────────────────────────────────────────────── */}
            <section id="items">
              <SectionH2 id="items">Items</SectionH2>
              <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                The script ships with 30+ strains, 11 vape juices, 5 leaf types, and 2 lighter variants.
              </p>

              {[
                {
                  title: 'Raw Flower',
                  items: 'white_runtz, cheetah_piss, gary_payton, gelatti, georgia_pie, jefe, whitecherry_gelato, blueberry_cruffin, snow_man, fine_china, pink_sandy, zushi, apple_gelato, biscotti, collins_ave, marathon, oreoz, pirckly_pear, runtz_og, blue_tomyz, ether, froties, gmo_cookies, ice_cream_cake_pack, khalifa_kush, la_confidential, marshmallow_og, moon_rock, sour_diesel, tahoe_og, cake_mix, cereal_milk',
                },
                {
                  title: 'Pre-Rolled Joints',
                  items: 'Each raw flower has a matching _joint suffix (e.g. white_runtz_joint).',
                  isNote: true,
                },
                {
                  title: 'Vape & Juice',
                  items: 'vape, blueberry_jam_cookie, butter_cookie, cookie_craze, get_figgy, key_lime_cookie, marshmallow_crisp, no_99, paris_fog, pogo, shamrock_cookie, strawberry_jam_cookie',
                },
                {
                  title: 'Leaf & Lighters',
                  items: 'grabba_leaf, backwoods_grape, backwoods_honey, backwoods_russian_cream, banana_backwoods, lighter, cheap_lighter',
                },
              ].map(section => (
                <div key={section.title} className="mb-6">
                  <SectionH3>{section.title}</SectionH3>
                  {section.isNote ? (
                    <p className="text-neutral-400 text-sm">{section.items}</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {section.items.split(', ').map(item => (
                        <span key={item} className="inline-flex px-2 py-0.5 rounded-md bg-blue-500/8 border border-blue-500/15 text-blue-300 text-xs font-mono">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </section>

            <hr className="border-neutral-800 my-10" />

            {/* ── Troubleshooting ──────────────────────────────────────── */}
            <section id="troubleshooting">
              <SectionH2 id="troubleshooting">Troubleshooting</SectionH2>
              <DocTable
                headers={['Issue', 'Fix']}
                rows={[
                  ['Items not usable',      'Ensure items are added to your framework and the resource is ensured after the framework.'],
                  ['Images not showing',    "Verify image paths match your inventory's expected directory and clear browser cache."],
                  ['No particle effects',   <span key="f">Make sure <Inline>core</Inline> particle asset is valid on your game build. The script requests and loads it automatically.</span>],
                  ['Stress not reducing',   <span key="f">Implement <Inline>StressTrigger</Inline> in <Inline>config/edits.lua</Inline> to wire to your HUD or status resource.</span>],
                  ['Prop not attaching',    'Check that the prop model exists in your server build. Most use base-game props.'],
                  ["Can't roll joints",     <span key="f">Confirm leaf items exist in inventory and are listed in <Inline>Config.LeafItems</Inline>.</span>],
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
        <div className="hidden xl:block w-52 flex-shrink-0 border-l border-neutral-800">
        <aside className="sticky top-0 h-[calc(100vh-64px)] overflow-y-auto py-10 px-5">
          <p className="text-xs text-neutral-600 uppercase tracking-widest font-semibold mb-4">On this page</p>
          <nav className="space-y-1">
            {ON_THIS_PAGE.map(({ href, label }) => (
              <a key={href} href={href} className="block text-xs text-neutral-500 hover:text-white py-1 transition">
                {label}
              </a>
            ))}
          </nav>
        </aside>
        </div>
      </div>

      <Footer showCta={false} />
    </div>
  );
}
