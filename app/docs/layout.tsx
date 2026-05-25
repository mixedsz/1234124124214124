import { DocsTopbar } from '@/components/docs-topbar';
import { DocsFooter } from '@/components/docs-footer';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      <DocsTopbar />
      {children}
      <DocsFooter />
    </div>
  );
}
