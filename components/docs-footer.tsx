import Link from 'next/link';

export function DocsFooter() {
  return (
    <footer className="border-t border-neutral-800 py-6 mt-auto flex-shrink-0">
      <div className="max-w-[1400px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-neutral-600">© 2026 Flake Development</p>
        <div className="flex items-center gap-5">
          <Link href="/privacy" className="text-xs text-neutral-600 hover:text-neutral-400 transition">Privacy</Link>
          <Link href="/terms" className="text-xs text-neutral-600 hover:text-neutral-400 transition">Terms</Link>
          <Link href="/refunds" className="text-xs text-neutral-600 hover:text-neutral-400 transition">Refunds</Link>
          <a
            href="https://discord.gg/flakedev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-neutral-600 hover:text-neutral-400 transition"
          >
            Discord
          </a>
        </div>
      </div>
    </footer>
  );
}
