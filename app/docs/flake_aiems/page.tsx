import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Flake AI EMS', alternates: { canonical: 'https://flakedev.com/docs/flake_aiems' } };

import { DocsSidebar, DocsMobileNav } from '@/components/docs-sidebar';
import { DocsOnThisPage } from '@/components/docs-on-this-page';
import Link from 'next/link';
import { ChevronRight, AlertTriangle, Info, Check, Activity } from 'lucide-react';
import { CodeBlock } from '@/components/docs-code-block';

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

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="bg-neutral-800 border border-neutral-600 border-b-2 rounded px-1.5 py-0.5 text-xs font-mono text-neutral-200">
      {children}
    </kbd>
  );
}

const ON_THIS_PAGE = [
  { href: '#overview',        label: 'Overview' },
  { href: '#installation',    label: 'Installation' },
  { href: '#configuration',   label: 'Configuration' },
  { href: '#frameworks',      label: 'Framework Compatibility' },
  { href: '#troubleshooting', label: 'Troubleshooting' },
];

export default function FlakeAIEMSDocsPage() {
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
            <Link href="/docs/flake_aiems" className="hover:text-neutral-400 transition">Scripts</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-neutral-400">Flake AI EMS</span>
          </div>

          {/* Hero */}
          <div className="relative rounded-2xl border border-blue-500/20 bg-blue-500/5 px-7 py-6 mb-10 overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">Flake AI EMS</h1>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4 max-w-xl">
              An AI-driven EMS revival system for FiveM. When no ambulance players are online, downed players can request an AI paramedic to arrive, provide CPR, and revive them for a fee. Supports ESX and QBCore with multiple ambulance resource compatibility.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'FiveM',        color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                { label: 'ESX · QBCore', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
                { label: 'ox_lib',       color: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
                { label: 'Lua 5.4',      color: 'bg-neutral-700/60 text-neutral-300 border-neutral-600' },
              ].map(b => (
                <span key={b.label} className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${b.color}`}>
                  {b.label}
                </span>
              ))}
            </div>
          </div>

          {/* Purchase link */}
          <Link
            href="/product/7072839"
            className="flex items-center gap-3 mb-10 px-4 py-3 rounded-xl border border-neutral-700/60 bg-neutral-800/40 hover:border-blue-500/50 hover:bg-neutral-800/80 transition group"
          >
            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-neutral-700/60 flex items-center justify-center text-neutral-400 group-hover:text-blue-400 transition">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium group-hover:text-blue-400 transition">Purchase Script</div>
              <div className="text-neutral-500 text-xs mt-0.5">flakedev.com</div>
            </div>
            <span className="flex-shrink-0 text-neutral-600 group-hover:text-blue-400 transition">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </span>
          </Link>

          {/* ── Overview ─────────────────────────────────────────────── */}
          <section id="overview">
            <SectionH2 id="overview">Overview</SectionH2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              Flake AI EMS gives players a fallback option when real paramedics are unavailable. After typing <Inline>/emshelp</Inline> while downed, an AI paramedic spawns in an ambulance, drives to the player&apos;s location, performs CPR, and revives them. The service includes a payment menu (cash or card), optional crutch injury system, and restricted zone support.
            </p>

            <SectionH3>Features</SectionH3>
            <ul className="space-y-2 text-sm text-neutral-400 mb-4">
              {[
                ['AI-Driven Revival', 'Spawns a paramedic NPC with an ambulance, drives to the player, performs CPR animation, then revives.'],
                ['Dynamic Spawning', 'Spawns near the player on a valid road, or falls back to the nearest hospital.'],
                ['Payment System', 'Cash or card payment with configurable costs. Free revival for on-duty EMS/fire.'],
                ['Ambulance Presence Check', 'Automatically disables AI EMS when real ambulance players are online.'],
                ['Crutch Integration', 'Optionally applies a temporary crutch injury after revival (Wasabi, AK47 ESX/QB).'],
                ['Restricted Zones', 'Block AI EMS in hospitals, police stations, prison, military base, and custom areas.'],
                ['Framework Auto-Detection', 'Detects ESX or QBCore automatically, or can be forced manually.'],
                ['Blip Tracking', 'Live ambulance blip so players can see the AI EMS approaching.'],
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
                [<Inline key="1">ox_lib</Inline>, 'Notifications, progress bars, context menus', <span key="r" className="text-green-400 font-medium">Yes</span>],
                ['ESX or QBCore', 'Framework for jobs, money, metadata, player data', <span key="r" className="text-green-400 font-medium">Yes</span>],
                [<Inline key="3">wasabi_crutch</Inline>, 'Optional crutch system after revival', <span key="r" className="text-neutral-500">No</span>],
                [<Inline key="4">ak47_crutch / ak47_qb_crutch</Inline>, 'Optional AK47 crutch system', <span key="r" className="text-neutral-500">No</span>],
                [<Inline key="5">wasabi_ambulance</Inline>, 'Compatible ambulance script', <span key="r" className="text-neutral-500">No</span>],
                [<Inline key="6">qb-ambulancejob / ak47_ambulancejob</Inline>, 'Compatible ambulance script', <span key="r" className="text-neutral-500">No</span>],
              ]}
            />
          </section>

          <hr className="border-neutral-800 my-10" />

          {/* ── Installation ─────────────────────────────────────────── */}
          <section id="installation">
            <SectionH2 id="installation">Installation</SectionH2>

            <SectionH3>Step 1 — Drop the Resource</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-2">
              Place the <Inline>flake_aiems</Inline> folder into your server&apos;s <Inline>resources</Inline> directory and add the following to your <Inline>server.cfg</Inline>:
            </p>
            <CodeBlock code="ensure flake_aiems" filename="server.cfg" whitespace py="py-4" my="my-4" />

            <SectionH3>Step 2 — Verify Dependencies</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-2">
              Make sure <Inline>ox_lib</Inline> and your framework are started before <Inline>flake_aiems</Inline>:
            </p>
            <CodeBlock filename="server.cfg" whitespace py="py-4" my="my-4" code={`ensure ox_lib
ensure es_extended   -- or: ensure qb-core
ensure flake_aiems`} />

            <SectionH3>Step 3 — Configure</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              Edit <Inline>config.lua</Inline> to set your framework, command, costs, hospital locations, and restricted zones. See the Configuration section below.
            </p>
            <Callout type="success" title="Done">
              Restart your server and type <Kbd>/emshelp</Kbd> while downed to request AI EMS.
            </Callout>

            <SectionH3>File Structure</SectionH3>
            <div className="rounded-xl border border-neutral-700/60 bg-neutral-800/50 px-4 py-4 my-4 overflow-x-auto">
              <pre className="text-sm font-mono leading-6">{[
                { text: 'flake_aiems/', type: 'dir' },
                { text: '├── ', type: 'conn' },
                { text: 'client/', type: 'dir' },
                { text: '│   └── ', type: 'conn' },
                { text: 'client.lua', type: 'file', comment: '-- Client-side logic (escrowed)' },
                { text: '├── ', type: 'conn' },
                { text: 'server/', type: 'dir' },
                { text: '│   └── ', type: 'conn' },
                { text: 'server.lua', type: 'file', comment: '-- Server-side logic (escrowed)' },
                { text: '├── ', type: 'conn' },
                { text: 'config.lua', type: 'file', comment: '-- All editable settings (escrow-ignored)' },
                { text: '└── ', type: 'conn' },
                { text: 'fxmanifest.lua', type: 'file', comment: '-- Resource manifest' },
              ].map((line, i) => {
                if (line.type === 'conn') return <span key={i} className="text-neutral-600">{line.text}</span>;
                if (line.type === 'dir') return (
                  <span key={i}>
                    <span className="text-blue-400 font-medium">{line.text}</span>
                    {line.comment && <span className="text-neutral-600">{'  '}{line.comment}</span>}
                    {'\n'}
                  </span>
                );
                return (
                  <span key={i}>
                    <span className="text-neutral-300">{line.text}</span>
                    {line.comment && <span className="text-neutral-600">{'  '}{line.comment}</span>}
                    {'\n'}
                  </span>
                );
              })}</pre>
            </div>
          </section>

          <hr className="border-neutral-800 my-10" />

          {/* ── Configuration ────────────────────────────────────────── */}
          <section id="configuration">
            <SectionH2 id="configuration">Configuration</SectionH2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4">
              All settings live in <Inline>config.lua</Inline>, which is escrow-ignored and safe to edit. Client and server files are escrow-protected.
            </p>

            <SectionH3>Command &amp; Costs</SectionH3>
            <CodeBlock filename="config.lua" whitespace py="py-4" my="my-4" code={`Config.Command = 'emshelp'
Config.RevivalCost = {
    cash = 5000,   -- Cash price
    card = 7500,   -- Card/bank price
}`} />

            <SectionH3>AI EMS Settings</SectionH3>
            <DocTable
              headers={['Setting', 'Default', 'Description']}
              rows={[
                [<Inline key="k">Config.EMSModel</Inline>,       <Inline key="v">&apos;s_m_m_paramedic_01&apos;</Inline>, 'Ped model for the AI paramedic'],
                [<Inline key="k">Config.AmbulanceModel</Inline>, <Inline key="v">&apos;ambulance&apos;</Inline>,           'Vehicle model for the AI ambulance'],
                [<Inline key="k">Config.EMSSpeed</Inline>,       '35.0',                                                   'Cruise speed (m/s, ~126 km/h)'],
                [<Inline key="k">Config.EMSTimeout</Inline>,     '300000',                                                 'Request timeout in ms (5 minutes)'],
              ]}
            />

            <SectionH3>Dynamic Spawn</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-2">
              When enabled, the AI ambulance spawns on a valid road near the player instead of at the nearest hospital:
            </p>
            <CodeBlock filename="config.lua" whitespace py="py-4" my="my-4" code={`Config.DynamicSpawn = {
    enabled     = true,
    minDistance = 150.0, -- Minimum spawn distance (meters)
    maxDistance = 300.0, -- Maximum spawn distance (meters)
    searchRadius = 50.0  -- Radius to search for a valid road
}`} />

            <SectionH3>Animation &amp; Progress Bar</SectionH3>
            <CodeBlock filename="config.lua" whitespace py="py-4" my="my-4" code={`Config.CPRAnimation = {
    dict     = 'mini@cpr@char_a@cpr_str',
    anim     = 'cpr_pumpchest',
    duration = 10000  -- 10 seconds
}

Config.ProgressBarDuration = 10000
Config.ProgressBarLabel    = 'Receiving medical assistance...'`} />

            <SectionH3>Crutch System</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-2">
              After revival, a temporary crutch/injury can be applied. Supports auto-detection or manual selection:
            </p>
            <CodeBlock filename="config.lua" whitespace py="py-4" my="my-4" code={`Config.CrutchSystem = {
    enabled  = true,
    duration = 60000,  -- Duration in ms (1 minute)
    system   = 'auto'  -- 'auto', 'wasabi_crutch', 'ak47_crutch', 'ak47_qb_crutch'
}

-- Jobs exempt from crutches
Config.CrutchExemptJobs = {
    'police', 'sheriff', 'bcso', 'sasp', 'state',
    'ambulance', 'ems', 'fire'
}`} />

            <SectionH3>Free Revival</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-2">
              Players with certain jobs can bypass payment entirely:
            </p>
            <CodeBlock filename="config.lua" whitespace py="py-4" my="my-4" code={`Config.FreeRevival = {
    enabled = false,
    jobs    = { 'ambulance', 'fire' }
}`} />

            <SectionH3>Ambulance Online Check</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-2">
              AI EMS is disabled automatically when real ambulance players are online:
            </p>
            <CodeBlock filename="config.lua" whitespace py="py-4" my="my-4" code={`Config.CheckAmbulanceOnline  = true
Config.MinAmbulanceRequired = 1

-- Jobs counted as ambulance personnel
Config.AmbulanceJobs = {
    'ambulance',
    -- 'ems',
    -- 'medic',
}`} />

            <SectionH3>Hospital Locations</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-2">
              Fallback spawn points used when dynamic spawning is disabled:
            </p>
            <CodeBlock filename="config.lua" whitespace py="py-4" my="my-4" code={`Config.HospitalLocations = {
    { x = 298.67,  y = -584.50,  z = 43.26, heading = 70.0  },  -- Pillbox Medical
    { x = -254.88, y = 6331.23,  z = 32.58, heading = 45.0  },  -- Paleto Bay Medical
    { x = 1839.15, y = 3672.99,  z = 34.28, heading = 210.0 },  -- Sandy Shores Medical
    { x = -449.67, y = -340.83,  z = 34.50, heading = 82.0  },  -- Mount Zonah Medical
}`} />
            <Callout type="info" title="Adding More Hospitals">
              Add new entries to <Inline>Config.HospitalLocations</Inline> with <Inline>x</Inline>, <Inline>y</Inline>, <Inline>z</Inline>, and <Inline>heading</Inline> values. Use a tool like <strong className="text-white">vMenu</strong> or <Inline>/coords</Inline> to get your coordinates.
            </Callout>

            <SectionH3>Restricted Zones</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-2">
              Block AI EMS from responding in specific areas:
            </p>
            <CodeBlock filename="config.lua" whitespace py="py-4" my="my-4" code={`Config.RestrictedZones = {
    enabled = true,
    zones = {
        {
            name    = "Pillbox Medical Center",
            coords  = vector3(298.67, -584.50, 43.26),
            radius  = 100.0,
            message = "AI EMS is not available inside medical facilities."
        },
        {
            name    = "Prison",
            coords  = vector3(1845.0, 2585.0, 45.0),
            radius  = 200.0,
            message = "AI EMS is not available in restricted government areas."
        }
    }
}`} />

            <SectionH3>Notifications</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-2">
              All display text is customizable:
            </p>
            <CodeBlock filename="config.lua" whitespace py="py-4" my="my-4" code={`Config.Notifications = {
    noMoney          = 'You do not have enough money for medical assistance!',
    emsOnWay         = 'AI EMS is on the way to your location!',
    emsArrived       = 'AI EMS has arrived. Choose your payment method.',
    revived          = 'You have been revived by AI EMS!',
    alreadyRequested = 'You have already requested AI EMS assistance!',
    notDead          = 'You are not in need of medical assistance!',
    paymentSuccess   = 'Payment successful! Receiving medical treatment...',
    crutchApplied    = 'You are injured and need to use crutches for recovery.',
    restrictedZone   = 'AI EMS is not available in this area.',
    freeRevival      = 'AI EMS is providing on-duty medical assistance at no charge.',
}`} />

            <SectionH3>Debug Mode</SectionH3>
            <CodeBlock filename="config.lua" whitespace py="py-4" my="my-4" code={`Config.Debug = false  -- Enable console prints for troubleshooting`} />
          </section>

          <hr className="border-neutral-800 my-10" />

          {/* ── Framework Compatibility ───────────────────────────────── */}
          <section id="frameworks">
            <SectionH2 id="frameworks">Framework Compatibility</SectionH2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4">
              Flake AI EMS supports multiple frameworks and ambulance resources out of the box.
            </p>

            <SectionH3>Framework Detection</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-2">
              Set <Inline>Config.Framework</Inline> to control how the resource initializes:
            </p>
            <CodeBlock filename="config.lua" whitespace py="py-4" my="my-4" code={`Config.Framework = 'auto'   -- 'esx', 'qb', or 'auto'`} />
            <p className="text-neutral-400 text-sm leading-relaxed">
              In <Inline>auto</Inline> mode, the script checks if <Inline>es_extended</Inline> or <Inline>qb-core</Inline> is started and initializes accordingly.
            </p>

            <SectionH3>Supported Ambulance Resources</SectionH3>
            <DocTable
              headers={['Resource', 'Framework', 'Dead Check', 'Revive Event']}
              rows={[
                [<Inline key="1">wasabi_ambulance</Inline>,      'ESX / QB', <span key="y" className="text-green-400">Yes</span>, <span key="y" className="text-green-400">Yes</span>],
                [<Inline key="2">qb-ambulancejob</Inline>,       'QBCore',   <span key="y" className="text-green-400">Yes</span>, <span key="y" className="text-green-400">Yes</span>],
                [<Inline key="3">ak47_ambulancejob</Inline>,     'ESX',      <span key="y" className="text-green-400">Yes</span>, <span key="y" className="text-green-400">Yes</span>],
                [<Inline key="4">ak47_qb_ambulancejob</Inline>,  'QBCore',   <span key="y" className="text-green-400">Yes</span>, <span key="y" className="text-green-400">Yes</span>],
                [<Inline key="5">esx_ambulancejob</Inline>,      'ESX',      <span key="n" className="text-neutral-500">No</span>,  <span key="y" className="text-green-400">Yes</span>],
              ]}
            />

            <SectionH3>Supported Crutch Resources</SectionH3>
            <DocTable
              headers={['Resource', 'Framework', 'System Name']}
              rows={[
                [<Inline key="1">wasabi_crutch</Inline>,    'ESX / QB', <Inline key="v">&apos;wasabi_crutch&apos;</Inline>],
                [<Inline key="2">ak47_crutch</Inline>,      'ESX',      <Inline key="v">&apos;ak47_crutch&apos;</Inline>],
                [<Inline key="3">ak47_qb_crutch</Inline>,   'QBCore',   <Inline key="v">&apos;ak47_qb_crutch&apos;</Inline>],
              ]}
            />
            <Callout type="warning" title="Crutch Auto-Detect">
              When <Inline>Config.CrutchSystem.system = &apos;auto&apos;</Inline>, the script tries Wasabi first, then AK47 ESX, then AK47 QB. If none are found, no crutch is applied and a debug message is printed (if debug mode is enabled).
            </Callout>
          </section>

          <hr className="border-neutral-800 my-10" />

          {/* ── Troubleshooting ──────────────────────────────────────── */}
          <section id="troubleshooting">
            <SectionH2 id="troubleshooting">Troubleshooting</SectionH2>
            <DocTable
              headers={['Issue', 'Fix']}
              rows={[
                [<span key="i">Nothing happens when typing <Inline>/emshelp</Inline></span>, <span key="f">Ensure <Inline>ox_lib</Inline> is started before <Inline>flake_aiems</Inline>. Check your framework is running and the command is not already registered by another resource.</span>],
                ['AI ambulance never arrives', <span key="f">Enable <Inline>Config.Debug = true</Inline> and check the F8 console for spawn or pathfinding errors. Try disabling <Inline>DynamicSpawn</Inline> to use hospital spawns instead.</span>],
                ['Player is not revived after CPR', 'Verify your ambulance resource is compatible. Check if the resource name matches one of the supported names in the Framework Compatibility table.'],
                ['Payment fails but money is taken', 'Ensure your framework money functions are working correctly. Check the server console for callback errors.'],
                ['Crutch is not applied after revival', <span key="f">Verify the crutch resource is started and the system name in <Inline>Config.CrutchSystem.system</Inline> matches. Try <Inline>&apos;auto&apos;</Inline> if unsure.</span>],
                ['AI EMS responds inside hospitals', <span key="f">Add hospital coordinates to <Inline>Config.RestrictedZones</Inline> with an appropriate radius.</span>],
                ['Ambulance players online but AI EMS still works', <span key="f">Check <Inline>Config.AmbulanceJobs</Inline> matches the exact job names your server uses. Enable debug to see the counted players.</span>],
                ['Free revival not working for EMS', <span key="f">Enable <Inline>Config.FreeRevival.enabled = true</Inline> and ensure the job name is in <Inline>Config.FreeRevival.jobs</Inline>.</span>],
              ]}
            />
          </section>

          <hr className="border-neutral-800 mt-10 mb-6" />
          <p className="text-neutral-600 text-xs">
            Developed by <strong className="text-neutral-500">Flake Development</strong>. For support, open a ticket in our Discord.
          </p>

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

      <DocsOnThisPage items={ON_THIS_PAGE} />
    </div>
  );
}
