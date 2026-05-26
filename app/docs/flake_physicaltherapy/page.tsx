import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Flake Physical Therapy – FiveM Rehabilitation Script' };

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
  { href: '#crutch',          label: 'Crutch Support' },
  { href: '#locations',       label: 'Adding Locations' },
  { href: '#troubleshooting', label: 'Troubleshooting' },
];

export default function FlakePhysicalTherapyDocsPage() {
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
            <span className="text-neutral-400">Flake Physical Therapy</span>
          </div>

          {/* Hero */}
          <div className="relative rounded-2xl border border-neutral-700/40 bg-neutral-800/30 px-7 py-6 mb-10 overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-neutral-500/10 blur-3xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-700 flex items-center justify-center flex-shrink-0 text-xl">🏥</div>
              <h1 className="text-3xl font-bold text-white">Flake Physical Therapy</h1>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4 max-w-xl">
              A physical therapy and rehabilitation system for FiveM. Players complete guided exercise steps to recover from injuries and remove crutches.
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
          </div>

          {/* ── Overview ─────────────────────────────────────────────── */}
          <section id="overview">
            <SectionH2 id="overview">Overview</SectionH2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              Physical therapy brings immersive rehabilitation to your server. Injured players visit a therapy location, complete guided exercise steps, and have crutches removed upon completion.
            </p>

            <SectionH3>Features</SectionH3>
            <ul className="space-y-2 text-sm text-neutral-400 mb-4 list-disc pl-5">
              <li><strong className="text-white">Dual Framework</strong> — Auto-detects ESX, QBX, or QB-Core.</li>
              <li><strong className="text-white">Multi-Step Therapy</strong> — Configurable 3-step exercise chain per location.</li>
              <li><strong className="text-white">Crutch Integration</strong> — Compatible with Wasabi Crutch and AK47 Crutch.</li>
              <li><strong className="text-white">Doctor Slip Item</strong> — Optional item to bypass payment.</li>
              <li><strong className="text-white">EMS Check</strong> — Require minimum EMS online or allow always.</li>
              <li><strong className="text-white">Cooldown System</strong> — Prevent spam with per-player cooldowns.</li>
              <li><strong className="text-white">Flexible Interaction</strong> — ox_target, qb-target, or TextUI + E key.</li>
              <li><strong className="text-white">Per-Location Pricing</strong> — Set different costs for each therapy site.</li>
              <li><strong className="text-white">Custom Animations</strong> — Each step supports its own animation dictionary and clip.</li>
            </ul>

            <SectionH3>Requirements</SectionH3>
            <DocTable
              headers={['Dependency', 'Purpose', 'Required']}
              rows={[
                [<Inline key="oxlib">ox_lib</Inline>, 'Progress bars, callbacks, notifications, TextUI', 'Yes'],
                ['ESX / QBX / QB-Core', 'Framework for players, jobs, money, items', 'Yes'],
                [<span key="target"><Inline>ox_target</Inline> or <Inline>qb-target</Inline></span>, 'Target interaction system', 'Optional'],
                ['Wasabi Crutch / AK47 Crutch', 'Crutch system integration', 'Optional'],
              ]}
            />
            <Callout type="info">
              Target systems are optional. Set <Inline>Config.System = &quot;textui&quot;</Inline> to use TextUI prompts with the E key instead.
            </Callout>
          </section>

          {/* ── Installation ─────────────────────────────────────────── */}
          <section id="installation">
            <SectionH2 id="installation">Installation</SectionH2>

            <SectionH3>Step 1 — Ensure the Resource</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              Place the <Inline>flake_physicaltherapy</Inline> folder into your server&apos;s <Inline>resources</Inline> directory and add to <Inline>server.cfg</Inline>:
            </p>
            <div className="bg-neutral-900 border border-neutral-700/60 rounded-xl px-4 py-3 font-mono text-sm text-green-400 mb-4">
              ensure flake_physicaltherapy
            </div>

            <SectionH3>Step 2 — Add Items (Optional)</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              If you want to use the doctor slip item bypass, add the configured item to your inventory:
            </p>
            <pre className="bg-neutral-900 border border-neutral-700/60 rounded-xl px-5 py-4 text-sm font-mono text-neutral-300 overflow-x-auto mb-4 whitespace-pre-wrap">{`Config.DoctorSlipItem = {
    enable = true,
    item   = 'docslip'
}`}</pre>

            <SectionH3>Step 3 — Configure</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              Edit <Inline>config/config.lua</Inline> to set your framework, interaction system, EMS jobs, locations, and pricing.
            </p>
            <Callout type="success" title="Done">
              Restart your server and therapy locations will spawn with NPCs and markers.
            </Callout>

            <SectionH3>File Structure</SectionH3>
            <div className="bg-neutral-900 border border-neutral-700/60 rounded-xl px-5 py-4 font-mono text-sm leading-7 mb-4">
              <span className="text-blue-400">flake_physicaltherapy/</span>{'\n'}
              {'├── '}<span className="text-blue-400">client/</span>{'\n'}
              {'│   ├── '}<span className="text-neutral-300">client.lua</span><span className="text-neutral-600">          — Therapy logic, animations, steps</span>{'\n'}
              {'│   └── '}<span className="text-neutral-300">cl_notifications.lua</span><span className="text-neutral-600"> — Notification overrides</span>{'\n'}
              {'├── '}<span className="text-blue-400">server/</span>{'\n'}
              {'│   ├── '}<span className="text-neutral-300">server.lua</span><span className="text-neutral-600">          — EMS checks, money, cooldowns</span>{'\n'}
              {'│   └── '}<span className="text-neutral-300">sv_notifications.lua</span><span className="text-neutral-600"> — Notification server bridge</span>{'\n'}
              {'├── '}<span className="text-blue-400">config/</span>{'\n'}
              {'│   ├── '}<span className="text-neutral-300">config.lua</span><span className="text-neutral-600">          — Main settings (escrow-ignored)</span>{'\n'}
              {'│   └── '}<span className="text-neutral-300">editable.lua</span><span className="text-neutral-600">        — Notifications and TextUI (escrow-ignored)</span>{'\n'}
              {'└── '}<span className="text-neutral-300">fxmanifest.lua</span><span className="text-neutral-600">          — Resource manifest</span>
            </div>
          </section>

          {/* ── Configuration ────────────────────────────────────────── */}
          <section id="configuration">
            <SectionH2 id="configuration">Configuration</SectionH2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4">
              All tunables live in <Inline>config/config.lua</Inline> and <Inline>config/editable.lua</Inline>. These files are escrow-ignored.
            </p>

            <SectionH3>Framework &amp; Interaction</SectionH3>
            <DocTable
              headers={['Setting', 'Default', 'Description']}
              rows={[
                [<Inline key="s">Config.System</Inline>, <Inline key="sv">&quot;textui&quot;</Inline>, 'Interaction mode: ox_target, qb-target, or textui'],
                [<Inline key="d">Config.Debug</Inline>, <Inline key="dv">false</Inline>, 'Enable debug prints and cooldown list command'],
                [<Inline key="di">Config.Distance</Inline>, <Inline key="div">2.0</Inline>, 'Interaction distance for TextUI mode'],
              ]}
            />

            <SectionH3>EMS &amp; Availability</SectionH3>
            <DocTable
              headers={['Setting', 'Default', 'Description']}
              rows={[
                [<Inline key="ej">Config.EMSJobs</Inline>, <Inline key="ejv">&#123; &apos;ambulance&apos;, &apos;ems&apos; &#125;</Inline>, 'Job names counted as EMS'],
                [<Inline key="ec">Config.EMSCount</Inline>, <Inline key="ecv">0</Inline>, 'Minimum EMS online required (0 = always available)'],
              ]}
            />

            <SectionH3>Cooldowns</SectionH3>
            <pre className="bg-neutral-900 border border-neutral-700/60 rounded-xl px-5 py-4 text-sm font-mono text-neutral-300 overflow-x-auto mb-4 whitespace-pre-wrap">{`Config.Cooldown = {
    enable = true,
    time   = 600  -- seconds (10 minutes)
}`}</pre>

            <SectionH3>Doctor Slip</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              When enabled, players with the item skip payment entirely. The item is consumed on use.
            </p>
            <pre className="bg-neutral-900 border border-neutral-700/60 rounded-xl px-5 py-4 text-sm font-mono text-neutral-300 overflow-x-auto mb-4 whitespace-pre-wrap">{`Config.DoctorSlipItem = {
    enable = true,
    item   = 'docslip'
}`}</pre>

            <SectionH3>Location Settings</SectionH3>
            <DocTable
              headers={['Field', 'Type', 'Description']}
              rows={[
                [<Inline key="co">coords</Inline>, 'vec4', 'Marker / blip location'],
                [<Inline key="cs">cost</Inline>, 'Number', 'Price for therapy at this location'],
                [<Inline key="sb">showBlip</Inline>, 'Boolean', 'Show map blip for this location'],
                [<Inline key="pm">ped.model</Inline>, 'String', 'NPC model name'],
                [<Inline key="pc">ped.coords</Inline>, 'vec4', 'NPC spawn position and heading'],
                [<Inline key="st">steps</Inline>, 'Array', 'Up to 3 therapy steps'],
              ]}
            />

            <SectionH3>Step Configuration</SectionH3>
            <pre className="bg-neutral-900 border border-neutral-700/60 rounded-xl px-5 py-4 text-sm font-mono text-neutral-300 overflow-x-auto mb-4 whitespace-pre-wrap">{`{
    coords = vec4(322.37, -592.38, 43.28, 68.94),
    progress = {
        duration  = 20000,
        label     = 'Leg Stretching...',
        canCancel = false,
        disable   = { move = true, combat = true },
        anim = {
            dict = 'mini@triathlon',
            clip = 'idle_e',
            flag = 7
        }
    }
}`}</pre>
          </section>

          {/* ── Usage ────────────────────────────────────────────────── */}
          <section id="usage">
            <SectionH2 id="usage">Usage</SectionH2>

            <SectionH3>Starting Therapy</SectionH3>
            <ol className="space-y-1 text-sm text-neutral-400 mb-4 list-decimal pl-5">
              <li>Visit a therapy location (marked with a green blip if enabled).</li>
              <li>Approach the NPC and interact via target or press <kbd className="bg-neutral-800 border border-neutral-700 rounded px-1.5 py-0.5 text-xs text-neutral-300">E</kbd> (TextUI).</li>
              <li>The server validates EMS count, cooldown, and payment / doctor slip.</li>
              <li>If approved, follow the yellow markers to each exercise step.</li>
              <li>Complete all steps to finish therapy and have your crutch removed.</li>
            </ol>

            <SectionH3>Payment Flow</SectionH3>
            <ul className="space-y-1 text-sm text-neutral-400 mb-4 list-disc pl-5">
              <li>If you have a doctor slip, it is consumed and therapy is free.</li>
              <li>Otherwise, the location&apos;s cost is deducted from your cash.</li>
              <li>If you cannot afford it, the session is denied.</li>
            </ul>

            <SectionH3>Step Markers</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4">
              Each therapy step spawns a yellow marker visible from 50 meters. Stand within 2 meters and press <kbd className="bg-neutral-800 border border-neutral-700 rounded px-1.5 py-0.5 text-xs text-neutral-300">E</kbd> to begin the progress bar animation. Movement and combat are disabled during each step.
            </p>
          </section>

          {/* ── Crutch Support ───────────────────────────────────────── */}
          <section id="crutch">
            <SectionH2 id="crutch">Crutch Support</SectionH2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              Integrates with popular crutch scripts to automatically remove crutches after therapy completion.
            </p>

            <SectionH3>Supported Scripts</SectionH3>
            <DocTable
              headers={['Script', 'Resource Name', 'Auto-Remove']}
              rows={[
                [
                  <a key="wasabi" href="https://wasabi-scripts.tebex.io/package/5453692" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Wasabi Crutch</a>,
                  <Inline key="wn">wasabi_crutch</Inline>,
                  'Yes'
                ],
                [
                  <a key="ak47esx" href="https://menanak47.tebex.io/package/6419367" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">AK47 Crutch (ESX)</a>,
                  <Inline key="ane">ak47_crutch</Inline>,
                  'Yes'
                ],
                [
                  <a key="ak47qb" href="https://menanak47.tebex.io/package/6419368" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">AK47 Crutch (QB)</a>,
                  <Inline key="anq">ak47_qb_crutch</Inline>,
                  'Yes'
                ],
              ]}
            />
            <Callout type="info" title="Don't have a crutch system?">
              Click any script name above to purchase it from the original store. Flake Physical Therapy works out of the box with all three.
            </Callout>

            <SectionH3>Crutch Requirement</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4">
              When <Inline>wasabi_crutch</Inline> is running, therapy can only be started if the player is actively using a crutch. Other crutch systems do not expose an active check and will allow therapy regardless.
            </p>

            <SectionH3>Doctor Slip Removal</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4">
              Players can also use a doctor slip item to remove their crutch immediately without visiting a therapy location.
            </p>
          </section>

          {/* ── Adding Locations ─────────────────────────────────────── */}
          <section id="locations">
            <SectionH2 id="locations">Adding Locations</SectionH2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              New therapy sites can be added by copying the existing location block in <Inline>config/config.lua</Inline>:
            </p>
            <pre className="bg-neutral-900 border border-neutral-700/60 rounded-xl px-5 py-4 text-sm font-mono text-neutral-300 overflow-x-auto mb-4 whitespace-pre-wrap">{`Config.TherapyLocations = {
    MyNewLocation = {
        coords   = vec4(100.0, 200.0, 30.0, 90.0),
        cost     = 1000,
        showBlip = true,
        ped = {
            model  = 's_m_m_doctor_01',
            coords = vec4(100.0, 200.0, 30.0, 90.0),
        },
        steps = {
            {
                coords = vec4(102.0, 202.0, 30.0, 0.0),
                progress = {
                    duration  = 15000,
                    label     = 'Warm Up...',
                    canCancel = false,
                    disable   = { move = true, combat = true },
                    anim = {
                        dict = 'mini@triathlon',
                        clip = 'idle_e',
                        flag = 7,
                    },
                },
            },
            -- Add up to 3 steps
        },
    },
}`}</pre>
            <Callout type="info" title="Tip">
              Locations with fewer than 3 steps skip the missing ones automatically. You can create 1-step, 2-step, or 3-step therapy sites.
            </Callout>
          </section>

          {/* ── Troubleshooting ──────────────────────────────────────── */}
          <section id="troubleshooting">
            <SectionH2 id="troubleshooting">Troubleshooting</SectionH2>
            <DocTable
              headers={['Issue', 'Fix']}
              rows={[
                ['NPC not spawning', 'Ensure the ped model exists in your server build. Most use base-game models.'],
                ['Target option not showing', <span key="t">Verify <Inline>Config.System</Inline> matches your installed target resource.</span>],
                ['Therapy denied — EMS', <span key="e">Check <Inline>Config.EMSCount</Inline> and <Inline>Config.EMSJobs</Inline>. Set count to 0 to disable the check.</span>],
                ['Therapy denied — cooldown', 'Wait for the cooldown to expire or disable it in config.'],
                ['Therapy denied — no money', 'Ensure the player has enough cash (not bank) for the location cost.'],
                ['Crutch not removed after therapy', 'Verify the crutch resource is named correctly and started. Check console for errors.'],
                ['Step markers not appearing', 'Ensure step coordinates are within the world bounds and not underground.'],
                ['Animation not playing', 'Verify the animation dictionary exists. Use a tool like GTA5 Animations to confirm.'],
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
