import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Flake Scoreboard', alternates: { canonical: 'https://flakedev.com/docs/flake_scoreboard' } };

import { DocsSidebar, DocsMobileNav } from '@/components/docs-sidebar';
import { DocsOnThisPage } from '@/components/docs-on-this-page';
import Link from 'next/link';
import { ChevronRight, AlertTriangle, Info, Check, LayoutList } from 'lucide-react';
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
  { href: '#customization',   label: 'Customization' },
  { href: '#troubleshooting', label: 'Troubleshooting' },
];

export default function FlakeScoreboardDocsPage() {
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
            <Link href="/docs/flake_scoreboard" className="hover:text-neutral-400 transition">Scripts</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-neutral-400">Flake Scoreboard</span>
          </div>

          {/* Hero */}
          <div className="relative rounded-2xl border border-blue-500/20 bg-blue-500/5 px-7 py-6 mb-10 overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                <LayoutList className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">Flake Scoreboard</h1>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4 max-w-xl">
              An advanced player scoreboard for FiveM with job counters, player history, staff badges, and a modern NUI interface. Supports ESX and QBCore with full search and context menu functionality.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'FiveM',         color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                { label: 'ESX · QBCore',  color: 'bg-green-500/10 text-green-400 border-green-500/20' },
                { label: 'oxmysql',       color: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
                { label: 'Lua 5.4',       color: 'bg-neutral-700/60 text-neutral-300 border-neutral-600' },
              ].map(b => (
                <span key={b.label} className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${b.color}`}>
                  {b.label}
                </span>
              ))}
            </div>
          </div>

          {/* Purchase link */}
          <Link
            href="/product/7121057"
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
              Flake Scoreboard replaces the default FiveM player list with a rich, interactive scoreboard. Players press <Kbd>F10</Kbd> (or type <Inline>/scoreboard</Inline>) to open a sleek interface showing all online players, grouped job counters, staff badges, ping indicators, and a searchable player history log.
            </p>

            <SectionH3>Features</SectionH3>
            <ul className="space-y-2 text-sm text-neutral-400 mb-4">
              {[
                ['Modern NUI Interface', 'Clean HTML/JS/CSS overlay with smooth animations and responsive grid layout.'],
                ['Job Counters', 'Live counters for Police, Medics, Mechanics, Civilians, and Staff.'],
                ['Player History', 'Tracks and displays previously connected players with timestamps.'],
                ['Context Menu', 'Right-click any player to copy their ID, character name, FiveM name, Discord, or all identifiers.'],
                ['Search & Sort', 'Instantly search players by name or ID; click counters to filter by job.'],
                ['Staff Badges', 'Crown icon for staff members with configurable rank lists.'],
                ['Framework Support', 'Works with ESX and QBCore out of the box.'],
                ['Configurable UI', 'Server name, icon, colors, icons, and visibility toggles are all adjustable.'],
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
                [<Inline key="1">oxmysql</Inline>, 'Database queries for player history', <span key="r" className="text-green-400 font-medium">Yes</span>],
                ['ESX or QBCore', 'Framework for players, jobs, and permissions', <span key="r" className="text-green-400 font-medium">Yes</span>],
              ]}
            />
          </section>

          <hr className="border-neutral-800 my-10" />

          {/* ── Installation ─────────────────────────────────────────── */}
          <section id="installation">
            <SectionH2 id="installation">Installation</SectionH2>

            <SectionH3>Step 1 — Drop the Resource</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-2">
              Place the <Inline>flake-scoreboard</Inline> folder into your server&apos;s <Inline>resources</Inline> directory and add the following to your <Inline>server.cfg</Inline>:
            </p>
            <CodeBlock code="ensure flake-scoreboard" filename="server.cfg" whitespace py="py-4" my="my-4" />

            <SectionH3>Step 2 — Import Database</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-2">
              Open <Inline>installation.sql</Inline> in your database tool (HeidiSQL, phpMyAdmin, etc.) and run the appropriate section for your framework. This adds the <Inline>last_seen</Inline> column used by the history feature.
            </p>
            <Callout type="info" title="ESX Users">
              Run the <Inline>ALTER TABLE users</Inline> query. Make sure the <Inline>last_seen</Inline> column type is <Inline>INT(11)</Inline>, not <Inline>TIMESTAMP</Inline>.
            </Callout>
            <Callout type="info" title="QBCore Users">
              QBCore usually already has a <Inline>last_updated</Inline> column. If it does not exist, uncomment and run the provided <Inline>ALTER TABLE players</Inline> query.
            </Callout>

            <SectionH3>Step 3 — Configure</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              Edit <Inline>config.lua</Inline> to match your framework, server name, job categories, and staff ranks. See the Configuration section below.
            </p>
            <Callout type="success" title="Done">
              Restart your server and press <Kbd>F10</Kbd> (or type <Inline>/scoreboard</Inline>) to open the scoreboard.
            </Callout>

            <SectionH3>File Structure</SectionH3>
            <div className="rounded-xl border border-neutral-700/60 bg-neutral-800/50 px-4 py-4 my-4 overflow-x-auto">
              <pre className="text-sm font-mono leading-6">{[
                { text: 'flake-scoreboard/', type: 'dir' },
                { text: '├── ', type: 'conn' },
                { text: 'client/', type: 'dir' },
                { text: '│   └── ', type: 'conn' },
                { text: 'main.lua', type: 'file', comment: '-- Client-side logic (escrowed)' },
                { text: '├── ', type: 'conn' },
                { text: 'server/', type: 'dir' },
                { text: '│   └── ', type: 'conn' },
                { text: 'main.lua', type: 'file', comment: '-- Server-side logic, callbacks, DB queries (escrowed)' },
                { text: '├── ', type: 'conn' },
                { text: 'ui/', type: 'dir' },
                { text: '│   ├── ', type: 'conn' },
                { text: 'index.html', type: 'file', comment: '-- NUI interface markup' },
                { text: '│   ├── ', type: 'conn' },
                { text: 'style.css', type: 'file', comment: '-- NUI styles' },
                { text: '│   └── ', type: 'conn' },
                { text: 'script.js', type: 'file', comment: '-- NUI JavaScript' },
                { text: '├── ', type: 'conn' },
                { text: 'config.lua', type: 'file', comment: '-- All editable settings (escrow-ignored)' },
                { text: '├── ', type: 'conn' },
                { text: 'installation.sql', type: 'file', comment: '-- Database setup script' },
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

            <SectionH3>Framework</SectionH3>
            <CodeBlock filename="config.lua" whitespace py="py-4" my="my-4" code={`Config.Framework = "esx"          -- "esx" or "qbcore"
Config.UseCharacterNames = true     -- Use character names instead of FiveM names`} />

            <SectionH3>Server Information</SectionH3>
            <CodeBlock filename="config.lua" whitespace py="py-4" my="my-4" code={`Config.ServerName = "HoodVille RP"
Config.ServerIcon = "https://i.postimg.cc/TYSmbXV1/TEXT.png"
Config.MaxPlayers = 250             -- Max shown in the player counter`} />

            <SectionH3>Controls</SectionH3>
            <DocTable
              headers={['Setting', 'Default', 'Description']}
              rows={[
                [<Inline key="k">Config.OpenKey</Inline>,     <Kbd key="v">F10</Kbd>,           'Key to open the scoreboard'],
                [<Inline key="k">Config.Command</Inline>,     <Inline key="v">&quot;scoreboard&quot;</Inline>, 'Chat command to open the scoreboard'],
                [<Inline key="k">Config.CloseOnEsc</Inline>,  'true',                            'Allow closing with ESC key'],
                [<Inline key="k">Config.RefreshRate</Inline>, '5000',                            'Player list update interval in ms'],
              ]}
            />

            <SectionH3>Display Settings</SectionH3>
            <CodeBlock filename="config.lua" whitespace py="py-4" my="my-4" code={`Config.Display = {
    showIds = true,           -- Show player IDs
    showPing = true,          -- Show player ping
    showStaffBadge = true,    -- Show crown icon for staff
    showStaffCounter = true,  -- Show staff member counter (ESX only)
    maxListHeight = 600,      -- Max height of player list in pixels
}`} />

            <SectionH3>Job Categories</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-2">
              Jobs are grouped into categories for counters and filtering. Add or remove job names in each list to match your server:
            </p>
            <CodeBlock filename="config.lua" whitespace py="py-4" my="my-4" code={`Config.JobCategories = {
    police    = { "police", "sheriff", "fbi", "swat", "statepolice" },
    ambulance = { "ambulance", "doctor", "emergency", "paramedic", "nurse" },
    mechanic  = { "mechanic", "repair", "auto", "technician" },
}`} />

            <SectionH3>Staff Ranks</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-2">
              Players with these ranks are flagged as staff and shown the crown badge. Define separate lists for each framework:
            </p>
            <CodeBlock filename="config.lua" whitespace py="py-4" my="my-4" code={`Config.StaffRanks = {
    esx    = { "owner", "admin", "superadmin", "mod", "support" },
    qbcore = { "admin", "god", "mod", "moderator" },
}`} />

            <SectionH3>Icons &amp; Colors</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-2">
              All icons use Font Awesome classes. Colors accept any valid CSS color value.
            </p>
            <CodeBlock filename="config.lua" whitespace py="py-4" my="my-4" code={`Config.CounterIcons = {
    police  = "fas fa-shield-alt",
    medic   = "fas fa-notes-medical",
    civilian = "fas fa-user",
    staff   = "fas fa-user-shield",
    history = "fas fa-user-clock"
}

Config.CounterColors = {
    police  = "#4a8cff",
    medic   = "#ff4a4a",
    civilian = "#585e57",
    staff   = "#ffd700",
    history = "#8b8d91"
}

Config.JobColors = {
    police    = "#5c77ff",
    ambulance = "#ff5c5c",
    mechanic  = "#f1c40f",
    staff     = "#ffd700",
    civilian  = "#585e57"
}

Config.JobIcons = {
    police    = "fas fa-shield-alt",
    ambulance = "fas fa-kit-medical",
    mechanic  = "fas fa-wrench",
    staff     = "fas fa-user-shield",
    civilian  = "fas fa-user"
}`} />
          </section>

          <hr className="border-neutral-800 my-10" />

          {/* ── Customization ────────────────────────────────────────── */}
          <section id="customization">
            <SectionH2 id="customization">Customization</SectionH2>

            <SectionH3>Adding a New Job Category</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              To add a new category (e.g. <strong className="text-white">Taxi</strong>), follow these steps:
            </p>
            <p className="text-neutral-400 text-sm leading-relaxed mb-1 font-medium text-white">Step 1 — Add the job list</p>
            <CodeBlock filename="config.lua" whitespace py="py-4" my="my-4" code={`Config.JobCategories = {
    police    = { "police", "sheriff", "fbi", "swat", "statepolice" },
    ambulance = { "ambulance", "doctor", "emergency", "paramedic", "nurse" },
    mechanic  = { "mechanic", "repair", "auto", "technician" },
    taxi      = { "taxi", "cab", "uber" },  -- new
}`} />
            <p className="text-neutral-400 text-sm leading-relaxed mb-1 font-medium text-white">Step 2 — Add colors &amp; icons</p>
            <CodeBlock filename="config.lua" whitespace py="py-4" my="my-4" code={`Config.JobColors.taxi       = "#f1c40f"
Config.JobIcons.taxi        = "fas fa-taxi"
Config.CounterIcons.taxi    = "fas fa-taxi"
Config.CounterColors.taxi   = "#f1c40f"`} />
            <Callout type="warning" title="Counter UI Limitation">
              The NUI <Inline>index.html</Inline> defines the visible counter buttons. Adding a new category to the config will not automatically add a new button in the UI — the built-in counters are Police, Medic, Mechanic, Civilian, Staff, and History. Job grouping still works for sorting and color-coding in the player list.
            </Callout>

            <SectionH3>Changing Server Icon</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Replace the <Inline>Config.ServerIcon</Inline> URL with a direct image link (PNG or JPG). Recommended size: 42×42 px.
            </p>

            <SectionH3>Test Mode</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-2">
              Enable fake players to test the UI without real players online:
            </p>
            <CodeBlock filename="config.lua" whitespace py="py-4" my="my-4" code={`Config.TestMode = {
    enabled     = false,
    playerCount = 21,
    staffChance = 5   -- percent chance a fake player is staff
}`} />
          </section>

          <hr className="border-neutral-800 my-10" />

          {/* ── Troubleshooting ──────────────────────────────────────── */}
          <section id="troubleshooting">
            <SectionH2 id="troubleshooting">Troubleshooting</SectionH2>
            <DocTable
              headers={['Issue', 'Fix']}
              rows={[
                ['Scoreboard does not open', <span key="f">Verify <Inline>ensure flake-scoreboard</Inline> is in <Inline>server.cfg</Inline> and that your framework is running before it.</span>],
                ['History shows "Never" for everyone', <span key="f">Run the <Inline>installation.sql</Inline> queries and ensure the <Inline>last_seen</Inline> column exists as <Inline>INT(11)</Inline>.</span>],
                ['Staff badges not showing', <span key="f">Check that <Inline>Config.StaffRanks</Inline> matches the group/permission names your framework uses exactly.</span>],
                ['Job colors are wrong', <span key="f">Verify the job key in <Inline>Config.JobColors</Inline> matches the job name returned by your framework.</span>],
                ['Player list duplicates or flickers', <span key="f">Make sure <Inline>oxmysql</Inline> is installed and started before <Inline>flake-scoreboard</Inline>.</span>],
                ['Server uptime stuck at "0m"', 'Uptime is pushed by the server script. If the resource recently restarted, uptime resets — this is normal.'],
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
