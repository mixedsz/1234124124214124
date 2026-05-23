'use client';

import { BasketProvider } from '@/contexts/basket-context';
import { CurrencyProvider } from '@/contexts/currency-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CurrencyProvider>
      <BasketProvider>
        {children}
      </BasketProvider>
    </CurrencyProvider>
  );
}
