'use client';

import { BasketProvider } from '@/contexts/basket-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BasketProvider>
      {children}
    </BasketProvider>
  );
}
