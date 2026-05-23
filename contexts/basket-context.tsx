'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { TebexBasket, createBasket, getBasket, addToBasket, removeFromBasket } from '@/lib/tebex';

const BASKET_STORAGE_KEY = 'tebex_basket_ident';

interface BasketContextType {
  basket: TebexBasket | null;
  loading: boolean;
  error: Error | null;
  username: string | null;
  isAuthenticated: boolean;
  itemCount: number;
  addItem: (packageId: number, quantity?: number) => Promise<TebexBasket | undefined>;
  removeItem: (packageId: number) => Promise<TebexBasket | null | undefined>;
  refreshBasket: () => Promise<TebexBasket | null>;
  getBasketIdent: () => string | null;
}

const BasketContext = createContext<BasketContextType | null>(null);

export function BasketProvider({ children }: { children: ReactNode }) {
  const [basket, setBasket] = useState<TebexBasket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Helper to create basket with proper URLs
  const createNewBasket = async () => {
    const returnUrl = typeof window !== 'undefined' ? `${window.location.origin}/cart` : '';
    const completeUrl = typeof window !== 'undefined' ? `${window.location.origin}/checkout-complete` : '';
    return await createBasket(returnUrl, completeUrl);
  };

  const refreshBasket = useCallback(async () => {
    const storedIdent = localStorage.getItem(BASKET_STORAGE_KEY);
    if (!storedIdent) return null;
    
    try {
      const updated = await getBasket(storedIdent);
      if (updated) {
        setBasket(updated);
        // Check if basket has username (authenticated)
        const authenticated = !!(updated.username && updated.username_id);
        setIsAuthenticated(authenticated);
        return updated;
      }
    } catch (err) {
      console.error('[BasketProvider] Error refreshing basket:', err);
    }
    return null;
  }, []);

  // Initialize basket
  useEffect(() => {
    const initBasket = async () => {
      try {
        setLoading(true);
        const storedIdent = localStorage.getItem(BASKET_STORAGE_KEY);

        if (storedIdent) {
          // Try to fetch existing basket
          const existingBasket = await getBasket(storedIdent);
          
          if (existingBasket && !existingBasket.complete) {
            setBasket(existingBasket);
            // Check if basket has username (authenticated)
            const authenticated = !!(existingBasket.username && existingBasket.username_id);
            setIsAuthenticated(authenticated);
          } else {
            // Basket completed, expired, or not found (404) - create new one
            localStorage.removeItem(BASKET_STORAGE_KEY);
            const newBasket = await createNewBasket();
            if (newBasket) {
              setBasket(newBasket);
              localStorage.setItem(BASKET_STORAGE_KEY, newBasket.ident);
              setIsAuthenticated(false);
            }
          }
        } else {
          // Create new basket
          const newBasket = await createNewBasket();
          if (newBasket) {
            setBasket(newBasket);
            localStorage.setItem(BASKET_STORAGE_KEY, newBasket.ident);
            setIsAuthenticated(false);
          }
        }
      } catch (err) {
        console.error('[BasketProvider] Error initializing basket:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize basket'));
      } finally {
        setLoading(false);
      }
    };

    initBasket();
  }, []);

  const addItem = async (packageId: number, quantity: number = 1) => {
    if (!basket) throw new Error('Basket not initialized');

    try {
      setLoading(true);
      const updated = await addToBasket(basket.ident, packageId, quantity);
      if (updated) {
        setBasket(updated);
        return updated;
      } else {
        // If add failed, it might be because user needs to login
        throw new Error('Failed to add item. You may need to login first.');
      }
    } catch (err) {
      console.error('[BasketProvider] Error adding item:', err);
      setError(err instanceof Error ? err : new Error('Failed to add item'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (packageId: number) => {
    if (!basket) throw new Error('Basket not initialized');

    try {
      setLoading(true);
      const updated = await removeFromBasket(basket.ident, packageId);
      if (updated) {
        setBasket(updated);
      }
      return updated;
    } catch (err) {
      console.error('[BasketProvider] Error removing item:', err);
      setError(err instanceof Error ? err : new Error('Failed to remove item'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBasketIdent = () => {
    return basket?.ident || localStorage.getItem(BASKET_STORAGE_KEY) || null;
  };

  const itemCount = basket?.packages?.length || 0;
  const username = basket?.username || null;

  return (
    <BasketContext.Provider value={{
      basket,
      loading,
      error,
      username,
      isAuthenticated,
      itemCount,
      addItem,
      removeItem,
      refreshBasket,
      getBasketIdent,
    }}>
      {children}
    </BasketContext.Provider>
  );
}

export function useBasket() {
  const context = useContext(BasketContext);
  if (!context) {
    // Return default values when context is not available (SSR/outside provider)
    return {
      basket: null,
      loading: true,
      error: null,
      username: null,
      isAuthenticated: false,
      itemCount: 0,
      addItem: async () => { throw new Error('Basket not initialized'); },
      removeItem: async () => { throw new Error('Basket not initialized'); },
      refreshBasket: async () => null,
      getBasketIdent: () => null,
    } as BasketContextType;
  }
  return context;
}
