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
  { href: '#features',        label: 'Features' },
  { href: '#commands',        label: 'Commands' },
  { href: '#troubleshooting', label: 'Troubleshooting' },
];

export default function FlakeBodybagDocsPage() {
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
            <span className="text-neutral-400">Flake Bodybag</span>
          </div>

          {/* Hero */}
          <div className="relative rounded-2xl border border-neutral-700/40 bg-neutral-800/30 px-7 py-6 mb-10 overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-neutral-500/10 blur-3xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-700 flex items-center justify-center flex-shrink-0 text-xl">⚰️</div>
              <h1 className="text-3xl font-bold text-white">Flake Bodybag</h1>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4 max-w-xl">
              A professional bodybag, burial, and character-kill system for FiveM. Supports ESX, QBX, and QB-Core with ox_target, qb-target, or TextUI interaction modes.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'FiveM',          color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                { label: 'ESX · QBX · QB', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
                { label: 'oxmysql',        color: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
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
              Flake Bodybag is a comprehensive death-handling system designed for serious roleplay servers. It allows players and admins to bag deceased characters, place them in coffins, bury them at designated sites, or dump them into the ocean — with full character-kill (CK) backup and restoration support.
            </p>

            <SectionH3>What It Does</SectionH3>
            <ul className="space-y-2 text-sm text-neutral-400 mb-4 list-disc pl-5">
              <li><strong className="text-white">Bodybagging</strong> — Place dead players into a physical bodybag prop with progress-bar animations.</li>
              <li><strong className="text-white">Coffin Placement</strong> — Transfer a bodybagged player into a weighted coffin prop for transport.</li>
              <li><strong className="text-white">Burial</strong> — Bury bodybagged players at configured cemetery locations with shovel animations.</li>
              <li><strong className="text-white">Ocean Dumping</strong> — Push coffins into the water at pier locations for permanent disposal.</li>
              <li><strong className="text-white">Character Kill (CK)</strong> — Admins can permanently kill a character with full database backup.</li>
              <li><strong className="text-white">UnCK Restoration</strong> — Restore previously CKed characters from backup with one command.</li>
              <li><strong className="text-white">Gulag Integration</strong> — Optional compatibility with Flake Gulag for alternative sentencing.</li>
            </ul>

            <SectionH3>Requirements</SectionH3>
            <DocTable
              headers={['Dependency', 'Purpose', 'Required']}
              rows={[
                [<Inline key="oxmysql">oxmysql</Inline>, 'Database operations and CK backups', 'Yes'],
                [<Inline key="oxlib">ox_lib</Inline>, 'Progress bars, callbacks, menus, TextUI', 'Yes'],
                ['ESX / QBX / QB-Core', 'Framework for players, items, and jobs', 'Yes'],
                [<span key="target"><Inline>ox_target</Inline> or <Inline>qb-target</Inline></span>, 'Target system for interactions', 'Optional'],
              ]}
            />
            <Callout type="info">
              Target systems are optional. You can use <strong>TextUI</strong> mode instead by setting <Inline>Config.System = &quot;textui&quot;</Inline>.
            </Callout>
          </section>

          {/* ── Installation ─────────────────────────────────────────── */}
          <section id="installation">
            <SectionH2 id="installation">Installation</SectionH2>

            <SectionH3>Step 1 — Drop the Resource</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              Place the <Inline>flake_bodybag</Inline> folder into your server&apos;s <Inline>resources</Inline> directory and add to <Inline>server.cfg</Inline>:
            </p>
            <div className="bg-neutral-900 border border-neutral-700/60 rounded-xl px-4 py-3 font-mono text-sm text-green-400 mb-4">
              ensure flake_bodybag
            </div>

            <SectionH3>Step 2 — Database</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              The script auto-creates the <Inline>ck_backup</Inline> table on resource start. No manual SQL is required. Ensure <Inline>oxmysql</Inline> is running before <Inline>flake_bodybag</Inline>.
            </p>

            <SectionH3>Step 3 — Add Items</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-1">Add the following items to your inventory configuration if you want item requirements:</p>
            <ul className="space-y-1 text-sm text-neutral-400 mb-4 list-disc pl-5">
              <li><strong className="text-white">Bodybag</strong> — Required to bag a dead player (configurable).</li>
              <li><strong className="text-white">Coffin</strong> — Required to place a bodybagged player into a coffin (configurable).</li>
              <li><strong className="text-white">Shovel</strong> — Required to bury a body at a cemetery (configurable).</li>
            </ul>

            <SectionH3>Step 4 — Configure</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              Edit <Inline>config/config.lua</Inline> to match your framework, target system, and desired features.
            </p>
            <Callout type="success" title="Done">
              Restart your server. The script will auto-detect your framework and create the CK backup table on first start.
            </Callout>

            <SectionH3>File Structure</SectionH3>
            <div className="bg-neutral-900 border border-neutral-700/60 rounded-xl px-5 py-4 font-mono text-sm leading-7 mb-4">
              <span className="text-blue-400">flake_bodybag/</span>{'\n'}
              {'├── '}<span className="text-blue-400">client/</span>{'\n'}
              {'│   └── '}<span className="text-neutral-300">client.lua</span><span className="text-neutral-600">          — Client logic, animations, target zones</span>{'\n'}
              {'├── '}<span className="text-blue-400">server/</span>{'\n'}
              {'│   └── '}<span className="text-neutral-300">server.lua</span><span className="text-neutral-600">          — Server logic, CK backup, database I/O</span>{'\n'}
              {'├── '}<span className="text-blue-400">config/</span>{'\n'}
              {'│   ├── '}<span className="text-neutral-300">config.lua</span><span className="text-neutral-600">          — Main settings (escrow-ignored)</span>{'\n'}
              {'│   ├── '}<span className="text-neutral-300">edits.lua</span><span className="text-neutral-600">           — Notifications and TextUI (escrow-ignored)</span>{'\n'}
              {'│   └── '}<span className="text-neutral-300">dumpbury.lua</span><span className="text-neutral-600">        — Locations and animations (escrow-ignored)</span>{'\n'}
              {'└── '}<span className="text-neutral-300">fxmanifest.lua</span><span className="text-neutral-600">          — Resource manifest</span>
            </div>
          </section>

          {/* ── Configuration ────────────────────────────────────────── */}
          <section id="configuration">
            <SectionH2 id="configuration">Configuration</SectionH2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4">All configuration files are escrow-ignored and safe to modify.</p>

            <SectionH3>Framework Settings</SectionH3>
            <DocTable
              headers={['Setting', 'Default', 'Description']}
              rows={[
                [<Inline key="s">Config.System</Inline>, <Inline key="v">&quot;ox_target&quot;</Inline>, 'Interaction mode: ox_target, qb-target, or textui'],
                [<Inline key="d">Config.Debug</Inline>, <Inline key="f">false</Inline>, 'Enable debug prints in server console'],
                [<Inline key="a">Config.AdminGroups</Inline>, 'Array', 'Groups allowed to use /ck and /unck'],
                [<Inline key="c">Config.CheckDistance</Inline>, <Inline key="n">3.0</Inline>, 'Max distance to interact with a body'],
                [<Inline key="di">Config.Distance</Inline>, <Inline key="tw">2.0</Inline>, 'Target interaction distance'],
              ]}
            />

            <SectionH3>Items</SectionH3>
            <DocTable
              headers={['Setting', 'Description']}
              rows={[
                [<Inline key="b">Config.BodyBagItem</Inline>, 'Item name, amount, remove flag for bodybags'],
                [<Inline key="c">Config.CoffinItem</Inline>, 'Item name, required flag, remove flag for coffins'],
                [<Inline key="s">Config.Shovel</Inline>, 'Item name, required flag, remove flag for burial'],
              ]}
            />

            <SectionH3>Props</SectionH3>
            <DocTable
              headers={['Setting', 'Default', 'Description']}
              rows={[
                [<Inline key="b">Config.BodyBagProp</Inline>, <Inline key="bv">&quot;xm_prop_body_bag&quot;</Inline>, 'Prop model for bodybags'],
                [<Inline key="c">Config.WeightedCoffinProp</Inline>, <Inline key="cv">&quot;prop_coffin_01&quot;</Inline>, 'Prop model for coffins'],
              ]}
            />

            <SectionH3>Locations</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              Burial and dump sites are configured in <Inline>config/dumpbury.lua</Inline>. Each location supports:
            </p>
            <ul className="space-y-1 text-sm text-neutral-400 mb-4 list-disc pl-5">
              <li><Inline>coords</Inline> — <Inline>vec3(x, y, z)</Inline></li>
              <li><Inline>radius</Inline> — Zone radius for detection</li>
              <li><Inline>pedModel</Inline> — (dump only) NPC model for handoff</li>
              <li><Inline>waitTime</Inline> — (dump only) Delay before pickup</li>
              <li><Inline>label</Inline> — Display name for the location</li>
            </ul>

            <SectionH3>Discord Logging</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              All CK, bury, dump, and UnCK actions are logged to a configurable Discord webhook. Set <Inline>Config.Logs.enable</Inline> to <Inline>true</Inline> and provide your webhook URL.
            </p>
          </section>

          {/* ── Usage ────────────────────────────────────────────────── */}
          <section id="usage">
            <SectionH2 id="usage">Usage</SectionH2>

            <SectionH3>Bodybagging a Player</SectionH3>
            <ol className="space-y-1 text-sm text-neutral-400 mb-4 list-decimal pl-5">
              <li>Approach a dead player.</li>
              <li>Use your target system or press <kbd className="bg-neutral-800 border border-neutral-700 rounded px-1.5 py-0.5 text-xs text-neutral-300">E</kbd> (TextUI) to initiate bodybagging.</li>
              <li>Complete the progress-bar animation.</li>
              <li>The dead player is placed inside a bodybag prop and hidden from view.</li>
            </ol>

            <SectionH3>Placing in a Coffin</SectionH3>
            <ol className="space-y-1 text-sm text-neutral-400 mb-4 list-decimal pl-5">
              <li>Approach a bodybagged player.</li>
              <li>Select <strong className="text-white">Place in Coffin</strong> from the target menu.</li>
              <li>Complete the animation to replace the bodybag with a coffin prop.</li>
            </ol>

            <SectionH3>Burying a Body</SectionH3>
            <ol className="space-y-1 text-sm text-neutral-400 mb-4 list-decimal pl-5">
              <li>Carry or drag the bodybag to a burial site (marked on the map if blips are enabled).</li>
              <li>Use the target option or press <kbd className="bg-neutral-800 border border-neutral-700 rounded px-1.5 py-0.5 text-xs text-neutral-300">E</kbd> to begin burying.</li>
              <li>If configured, you must have a shovel in your inventory.</li>
              <li>Complete the digging animation to finish the burial.</li>
            </ol>

            <SectionH3>Dumping in the Ocean</SectionH3>
            <ol className="space-y-1 text-sm text-neutral-400 mb-4 list-decimal pl-5">
              <li>Transport the coffin to a dump pier (marked on the map if blips are enabled).</li>
              <li>Use the target option or press <kbd className="bg-neutral-800 border border-neutral-700 rounded px-1.5 py-0.5 text-xs text-neutral-300">E</kbd> to push the coffin into the water.</li>
              <li>The coffin is deleted and the player is permanently removed.</li>
            </ol>

            <Callout type="warning" title="Irreversible">
              Burial and dumping result in character deletion (or Gulag sentencing if configured). Always confirm the target before proceeding.
            </Callout>
          </section>

          {/* ── Features ─────────────────────────────────────────────── */}
          <section id="features">
            <SectionH2 id="features">Features</SectionH2>

            <SectionH3>Character Kill (CK) System</SectionH3>
            <ul className="space-y-2 text-sm text-neutral-400 mb-4 list-disc pl-5">
              <li><strong className="text-white">Full Backup</strong> — Character data, inventory snapshot, vehicles, and metadata are saved to <Inline>ck_backup</Inline>.</li>
              <li><strong className="text-white">Safe Deletion</strong> — The player is kicked first, then character and vehicle rows are deleted from the framework tables.</li>
              <li><strong className="text-white">Discord Audit</strong> — Every CK is logged with admin name, victim name, identifiers, and timestamp.</li>
              <li><strong className="text-white">Funeral Broadcast</strong> — A breaking-news announcement is shown to all online players.</li>
            </ul>

            <SectionH3>UnCK Restoration</SectionH3>
            <ul className="space-y-2 text-sm text-neutral-400 mb-4 list-disc pl-5">
              <li>Use <Inline>/unck</Inline> to open a searchable list of all CKed characters.</li>
              <li>Select a character and confirm restoration.</li>
              <li>Character data and vehicles are reinserted into the framework tables.</li>
              <li>The backup entry is deleted after successful restoration.</li>
            </ul>

            <SectionH3>Ambulance Compatibility</SectionH3>
            <ul className="space-y-1 text-sm text-neutral-400 mb-4 list-disc pl-5">
              <li>Wasabi Ambulance</li>
              <li>AK47 AmbulanceJob (ESX &amp; QB)</li>
              <li>QB-AmbulanceJob (metadata &amp; state bags)</li>
              <li>Native ped death checks (fallback)</li>
            </ul>

            <SectionH3>Gulag Integration</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4">
              If <Inline>flake_gulag</Inline> is installed and <Inline>Config.GulagScript</Inline> is enabled, burying or dumping will send the player to the gulag instead of deleting their character.
            </p>
          </section>

          {/* ── Commands ─────────────────────────────────────────────── */}
          <section id="commands">
            <SectionH2 id="commands">Commands</SectionH2>
            <DocTable
              headers={['Command', 'Access', 'Description']}
              rows={[
                [<Inline key="ck">/ck [id]</Inline>, 'Admin', "Permanently kill a player's character with full backup"],
                [<Inline key="unck">/unck [name]</Inline>, 'Admin', 'Open the CK restoration menu. Optional name filter.'],
              ]}
            />
            <Callout type="info" title="Tip">
              Command names are configurable via <Inline>Config.CKCommand</Inline> and <Inline>Config.UnCKCommand</Inline>. Chat suggestions are registered automatically.
            </Callout>
          </section>

          {/* ── Troubleshooting ──────────────────────────────────────── */}
          <section id="troubleshooting">
            <SectionH2 id="troubleshooting">Troubleshooting</SectionH2>
            <DocTable
              headers={['Issue', 'Fix']}
              rows={[
                ['Target options not showing', <span key="t">Ensure <Inline>ox_target</Inline> or <Inline>qb-target</Inline> is started and <Inline>Config.System</Inline> matches.</span>],
                ['Bodybag prop not spawning', 'Verify the prop model exists in your server build. Most use base-game props.'],
                ['CK command not working', <span key="c">Check that your player group is listed in <Inline>Config.AdminGroups</Inline>.</span>],
                ['Backup not saving', <span key="b">Ensure <Inline>oxmysql</Inline> is running and the <Inline>ck_backup</Inline> table was created.</span>],
                ['Discord logs not sending', <span key="d">Verify the webhook URL in <Inline>Config.Logs.webhook</Inline> and that <Inline>Config.Logs.enable</Inline> is <Inline>true</Inline>.</span>],
                ['Gulag not triggering', <span key="g">Ensure <Inline>flake_gulag</Inline> is started and <Inline>Config.GulagScript</Inline> is enabled.</span>],
                ['Player not detected as dead', 'Check that your ambulance script is supported or that native death checks are enabled.'],
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
