'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Approximate rates relative to USD — actual price shown at Tebex checkout
const RATES: Record<string, number> = {
  USD: 1,
  GBP: 0.79,
  EUR: 0.92,
  AUD: 1.53,
  CAD: 1.36,
  PLN: 3.95,
};

interface CurrencyContextType {
  currency: string;
  setCurrency: (c: string) => void;
  formatPrice: (usdAmount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  setCurrency: () => {},
  formatPrice: (n) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n),
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState('USD');

  useEffect(() => {
    const stored = localStorage.getItem('preferred_currency');
    if (stored && RATES[stored]) setCurrencyState(stored);
  }, []);

  const setCurrency = (c: string) => {
    if (!RATES[c]) return;
    setCurrencyState(c);
    localStorage.setItem('preferred_currency', c);
  };

  const formatPrice = useCallback(
    (usdAmount: number) => {
      const converted = usdAmount * (RATES[currency] ?? 1);
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(converted);
    },
    [currency],
  );

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
