import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Scripts', alternates: { canonical: 'https://flakedev.com/scripts' } };
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
