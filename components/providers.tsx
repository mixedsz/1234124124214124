'use client';

import { BasketProvider } from '@/contexts/basket-context';
import { CurrencyProvider } from '@/contexts/currency-context';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const GT_LANG: Record<string, string> = {
  'es': 'es', 'fr': 'fr', 'de': 'de', 'it': 'it',
  'nl': 'nl', 'pl': 'pl', 'pt-br': 'pt', 'pt-pt': 'pt',
  'ru': 'ru', 'uk': 'uk', 'tr': 'tr',
  'zh-cn': 'zh-CN', 'zh-tw': 'zh-TW', 'ja': 'ja', 'ko': 'ko',
};

function GoogleTranslateApplier() {
  const pathname = usePathname();

  useEffect(() => {
    const lang = typeof window !== 'undefined' ? localStorage.getItem('tebex_language') : null;
    if (!lang || lang === 'en' || lang === 'en-gb') return;
    const gtCode = GT_LANG[lang] ?? lang;
    let attempts = 0;
    const tryApply = () => {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (select && select.value !== gtCode) {
        select.value = gtCode;
        select.dispatchEvent(new Event('change'));
      } else if (!select && attempts < 15) {
        attempts++;
        setTimeout(tryApply, 400);
      }
    };
    setTimeout(tryApply, 300);
  }, [pathname]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CurrencyProvider>
      <BasketProvider>
        <GoogleTranslateApplier />
        {children}
      </BasketProvider>
    </CurrencyProvider>
  );
}
