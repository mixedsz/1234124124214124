'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

const RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.36,
  AUD: 1.53,
  NZD: 1.63,
  CHF: 0.89,
  SEK: 10.4,
  NOK: 10.8,
  DKK: 6.9,
  PLN: 3.95,
  BRL: 5.05,
  MXN: 17.2,
  JPY: 150,
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
