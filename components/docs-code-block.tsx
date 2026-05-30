'use client';

import { useState } from 'react';
import { Copy, Check, ChevronDown } from 'lucide-react';

export function CodeBlock({
  code,
  filename,
  whitespace = false,
  py = 'py-3',
  my = 'my-3',
}: {
  code: string;
  filename?: string;
  whitespace?: boolean;
  py?: string;
  my?: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className={`rounded-xl overflow-hidden border border-neutral-700/60 ${my}`}>
      {filename && (
        <div className="flex items-center justify-between bg-neutral-800 px-4 py-2 border-b border-neutral-700/60">
          <span className="text-neutral-400 text-xs font-mono">{filename}</span>
          <button
            onClick={copy}
            className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-200 transition text-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}
      <pre className={`bg-neutral-800/50 px-4 ${py} overflow-x-auto text-sm leading-relaxed`}>
        <code className={`text-green-400 font-mono${whitespace ? ' whitespace-pre' : ''}`}>{code}</code>
      </pre>
    </div>
  );
}

export function LogBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="rounded-xl overflow-hidden border border-neutral-700/60 my-3">
      <div className="flex items-center justify-between bg-neutral-800 px-4 py-2 border-b border-neutral-700/60">
        <span className="text-neutral-400 text-xs font-mono">log</span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-200 transition text-xs"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="bg-neutral-800/50 px-4 py-3 overflow-x-auto text-xs leading-relaxed">
        <code className="text-red-400 font-mono">{code}</code>
      </pre>
    </div>
  );
}

export function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`rounded-xl border overflow-hidden mb-3 transition-colors ${
        open ? 'border-blue-500/40' : 'border-neutral-700/60'
      }`}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-neutral-800/40 hover:bg-neutral-800/70 transition text-left gap-4"
      >
        <span className="text-white font-medium text-sm font-mono">{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-neutral-500 flex-shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && (
        <div className="px-5 py-5 border-t border-neutral-700/60 space-y-4">{children}</div>
      )}
    </div>
  );
}
