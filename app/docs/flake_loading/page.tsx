import { DocsSidebar, DocsMobileNav } from '@/components/docs-sidebar';
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

function CodeSnip({ children }: { children: string }) {
  return (
    <pre className="bg-neutral-900 border border-neutral-700/60 rounded-xl px-5 py-4 text-sm font-mono text-neutral-300 overflow-x-auto mb-4 whitespace-pre-wrap">
      {children}
    </pre>
  );
}

const ON_THIS_PAGE = [
  { href: '#overview',        label: 'Overview' },
  { href: '#installation',    label: 'Installation' },
  { href: '#videos',          label: 'Video & Music' },
  { href: '#configuration',   label: 'Configuration' },
  { href: '#troubleshooting', label: 'Troubleshooting' },
];

export default function FlakeLoadingDocsPage() {
  return (
    <div className="flex flex-1 w-full max-w-[1400px] mx-auto">
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
            <span className="text-neutral-400">Flake Loading Screen</span>
          </div>

          {/* Hero */}
          <div className="relative rounded-2xl border border-blue-700/30 bg-blue-500/5 px-7 py-6 mb-10 overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center flex-shrink-0 text-xl">🎬</div>
              <h1 className="text-3xl font-bold text-white">Flake Loading Screen</h1>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4 max-w-xl">
              A modern, customizable FiveM loading screen with background video playback, audio controls, server info, rules, staff showcase, and social links.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'FiveM',          color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                { label: 'Video & Audio',  color: 'bg-green-500/10 text-green-400 border-green-500/20' },
                { label: 'HTML/JS',        color: 'bg-neutral-700/60 text-neutral-300 border-neutral-600' },
              ].map(b => (
                <span key={b.label} className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${b.color}`}>{b.label}</span>
              ))}
            </div>
          </div>

          {/* ── Overview ─────────────────────────────────────────────── */}
          <section id="overview">
            <SectionH2 id="overview">Overview</SectionH2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              Flake Loading Screen replaces the default FiveM loading screen with a sleek, media-rich experience. It supports background videos (MP4 or YouTube), background music with volume control, server branding, rules, staff cards, and social media links — all configurable through a single JavaScript file.
            </p>

            <SectionH3>Features</SectionH3>
            <ul className="space-y-2 text-sm text-neutral-400 mb-4 list-disc pl-5">
              <li><strong className="text-white">Background Videos</strong> — Play MP4s or YouTube videos behind the loading UI.</li>
              <li><strong className="text-white">Audio Control</strong> — Volume slider and skip-song button for video audio.</li>
              <li><strong className="text-white">Server Branding</strong> — Custom title, subtitle, and accent colour.</li>
              <li><strong className="text-white">Server Info &amp; Rules</strong> — Editable info blocks and rule list.</li>
              <li><strong className="text-white">Staff Showcase</strong> — Display team members with avatars and roles.</li>
              <li><strong className="text-white">Social Links</strong> — Discord, Website, YouTube, or any custom link.</li>
              <li><strong className="text-white">Localization</strong> — Customize all UI text strings.</li>
            </ul>
          </section>

          {/* ── Installation ─────────────────────────────────────────── */}
          <section id="installation">
            <SectionH2 id="installation">Installation</SectionH2>

            <SectionH3>Step 1 — Drop the Resource</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              Place the <Inline>flake_loading</Inline> folder into your server&apos;s <Inline>resources</Inline> directory and add to <Inline>server.cfg</Inline>:
            </p>
            <div className="bg-neutral-900 border border-neutral-700/60 rounded-xl px-4 py-3 font-mono text-sm text-green-400 mb-4">
              ensure flake_loading
            </div>

            <SectionH3>Step 2 — Verify Loadscreen Entry</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              The <Inline>fxmanifest.lua</Inline> already points to the correct HTML file. No changes are needed unless you rename the <Inline>web/build</Inline> folder.
            </p>

            <Callout type="success" title="Done">
              Restart your server and the loading screen will appear on next connect.
            </Callout>

            <SectionH3>File Structure</SectionH3>
            <div className="bg-neutral-900 border border-neutral-700/60 rounded-xl px-5 py-4 font-mono text-sm leading-7 mb-4">
              <span className="text-blue-400">flake_loading/</span>{'\n'}
              {'├── '}<span className="text-blue-400">web/build/</span>{'\n'}
              {'│   ├── '}<span className="text-neutral-300">index.html</span><span className="text-neutral-600">          — Main loading screen HTML</span>{'\n'}
              {'│   ├── '}<span className="text-neutral-300">config.js</span><span className="text-neutral-600">            — All settings (edit this)</span>{'\n'}
              {'│   ├── '}<span className="text-blue-400">css/</span><span className="text-neutral-600">                 — Stylesheets</span>{'\n'}
              {'│   ├── '}<span className="text-blue-400">js/</span><span className="text-neutral-600">                  — Application logic</span>{'\n'}
              {'│   └── '}<span className="text-blue-400">font/</span><span className="text-neutral-600">                — Custom fonts</span>{'\n'}
              {'├── '}<span className="text-blue-400">client/</span>{'\n'}
              {'│   └── '}<span className="text-neutral-300">main.lua</span>{'\n'}
              {'├── '}<span className="text-blue-400">server/</span>{'\n'}
              {'│   └── '}<span className="text-neutral-300">main.lua</span>{'\n'}
              {'└── '}<span className="text-neutral-300">fxmanifest.lua</span>
            </div>
          </section>

          {/* ── Videos ───────────────────────────────────────────────── */}
          <section id="videos">
            <SectionH2 id="videos">Video &amp; Music</SectionH2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              The loading screen supports two types of background media: <strong className="text-white">MP4 files</strong> (recommended) and <strong className="text-white">YouTube videos</strong>. MP4s allow full volume control; YouTube videos have restricted controls due to platform limitations.
            </p>

            <SectionH3>Uploading Your Media</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-2">We recommend using <strong className="text-white">Five Manage</strong> for fast, reliable video hosting:</p>
            <ol className="space-y-1 text-sm text-neutral-400 mb-4 list-decimal pl-5">
              <li>Create a Five Manage account at <span className="text-blue-400">fivemanage.com</span>.</li>
              <li>Go to the API Tokens section and create a token for <strong className="text-white">Media</strong>.</li>
              <li>Head to the Upload section and upload your MP4 videos or music files.</li>
              <li>Copy the direct file URL (ends in <Inline>.mp4</Inline>) and paste it into <Inline>config.js</Inline>.</li>
            </ol>
            <Callout type="info" title="Tip">
              You can use any direct MP4 URL — not just Five Manage. Make sure the URL supports CORS and hotlinking.
            </Callout>

            <SectionH3>Adding MP4 Videos</SectionH3>
            <CodeSnip>{`"videos": [
  "https://r2.fivemanage.com/your-account/video1.mp4",
  "https://r2.fivemanage.com/your-account/video2.mp4"
]`}</CodeSnip>

            <SectionH3>YouTube Videos</SectionH3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              YouTube links are supported but volume cannot be controlled due to API restrictions. Paste a standard watch or share URL:
            </p>
            <CodeSnip>{`"videos": [
  "https://www.youtube.com/watch?v=VIDEO_ID",
  "https://youtu.be/VIDEO_ID"
]`}</CodeSnip>

            <SectionH3>Default Volume</SectionH3>
            <CodeSnip>{`"default_volume": 30`}</CodeSnip>
          </section>

          {/* ── Configuration ────────────────────────────────────────── */}
          <section id="configuration">
            <SectionH2 id="configuration">Configuration</SectionH2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4">
              All settings are in <Inline>web/build/config.js</Inline>. No server restart is required — changes apply on next client connect.
            </p>

            <SectionH3>Accent Colour</SectionH3>
            <CodeSnip>{`"UIColor": "#81d0fdff"`}</CodeSnip>

            <SectionH3>Title &amp; Subtitle</SectionH3>
            <CodeSnip>{`"Title": {
  "enable": true,
  "title": "Flake Development",
  "subtitle": "Windy City Inspired Loading"
}`}</CodeSnip>

            <SectionH3>Server Information</SectionH3>
            <CodeSnip>{`"ServerInformation": {
  "enable": true,
  "title": "YOUR SERVER NAME",
  "subtitle": "",
  "infos": [
    {"info": "Content based roleplay server! Please read the rules..."}
  ]
}`}</CodeSnip>

            <SectionH3>Server Rules</SectionH3>
            <CodeSnip>{`"ServerRules": {
  "enable": true,
  "title": "SERVER RULES",
  "rules": [
    {"title": "Rule: 1", "description": "Stay In Character at all times."},
    {"title": "Rule: 2", "description": "Leave discord calls before loading in."}
  ]
}`}</CodeSnip>

            <SectionH3>Staff Members</SectionH3>
            <CodeSnip>{`"Staff": {
  "enable": true,
  "title": "STAFF",
  "members": [
    {
      "name": "Flake",
      "role": "Owner",
      "avatar": "https://cdn.discordapp.com/attachments/.../logo.png"
    }
  ]
}`}</CodeSnip>

            <SectionH3>Social Media</SectionH3>
            <CodeSnip>{`"SocialMedia": {
  "enable": true,
  "socials": [
    {
      "label": "Discord",
      "link": "https://discord.gg/flakedev",
      "icon": "fab fa-discord",
      "color": "linear-gradient(125.11deg, #5c8ed0 29.36%, #5c8ed0 90.83%)"
    }
  ]
}`}</CodeSnip>

            <SectionH3>Localization</SectionH3>
            <CodeSnip>{`"Locales": {
  "Welcome": "WELCOME TO FLAKE DEVELOPMENT",
  "Sound": "Volume",
  "Loading": "Loading in progress, please wait...",
  "Skip": "Skip Song"
}`}</CodeSnip>
          </section>

          {/* ── Troubleshooting ──────────────────────────────────────── */}
          <section id="troubleshooting">
            <SectionH2 id="troubleshooting">Troubleshooting</SectionH2>
            <DocTable
              headers={['Issue', 'Fix']}
              rows={[
                ['Video not playing', 'Ensure the URL is a direct MP4 link and supports CORS. Test in a browser tab first.'],
                ['YouTube video silent', 'YouTube volume cannot be controlled via code. Use MP4s for full audio control.'],
                ['Skip button missing', <span key="s">Ensure <Inline>config.js</Inline> is loaded and contains a valid <Inline>videos</Inline> array.</span>],
                ['Changes not showing', 'Clear your FiveM cache or reconnect. The loading screen is cached aggressively.'],
                ['Images not loading', 'Use HTTPS URLs for avatars and icons. Discord CDN links expire — use permanent hosting.'],
              ]}
            />
          </section>

          <div className="mt-12 pt-6 border-t border-neutral-800 text-xs text-neutral-600">
            Developed by <strong className="text-neutral-500">Flake Development</strong>. For support, open a ticket in our Discord.
          </div>
        </div>
      </main>

      {/* On this page */}
      <aside className="hidden xl:block w-56 flex-shrink-0 py-10 pr-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-4">On this page</p>
        <ul className="space-y-2">
          {ON_THIS_PAGE.map(item => (
            <li key={item.href}>
              <a href={item.href} className="text-xs text-neutral-500 hover:text-neutral-300 transition">{item.label}</a>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
