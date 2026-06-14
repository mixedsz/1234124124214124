import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Support', alternates: { canonical: 'https://flakedev.com/support' } };
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
