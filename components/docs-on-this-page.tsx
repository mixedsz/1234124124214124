'use client';

import { useEffect, useState } from 'react';

interface TOCItem {
  href: string;
  label: string;
}

export function DocsOnThisPage({ items }: { items: TOCItem[] }) {
  const [activeId, setActiveId] = useState<string>(items[0]?.href.slice(1) ?? '');

  useEffect(() => {
    const ids = items.map(i => i.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost intersecting heading
        const visible = entries.filter(e => e.isIntersecting).map(e => e.target.id);
        if (visible.length > 0) {
          const first = ids.find(id => visible.includes(id));
          if (first) setActiveId(first);
        }
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 }
    );

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <div className="hidden xl:block w-52 flex-shrink-0 border-l border-neutral-800">
      <aside className="sticky top-16 h-[calc(100vh-64px)] overflow-y-auto py-10 px-5 docs-scrollbar">
        <p className="text-xs text-neutral-600 uppercase tracking-widest font-semibold mb-4">On this page</p>
        <nav className="space-y-0.5">
          {items.map(({ href, label }) => {
            const id = href.slice(1);
            const isActive = activeId === id;
            return (
              <a
                key={href}
                href={href}
                className={`block text-xs py-1.5 transition-colors ${
                  isActive
                    ? 'text-blue-400 font-semibold'
                    : 'text-neutral-500 hover:text-neutral-200'
                }`}
              >
                {label}
              </a>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
