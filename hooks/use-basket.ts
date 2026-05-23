import { useEffect, useState, useCallback } from 'react';
import { TebexBasket, createBasket, getBasket, addToBasket, removeFromBasket } from '@/lib/tebex';

const BASKET_STORAGE_KEY = 'tebex_basket_ident';

export function useBasket() {
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
      console.error('[useBasket] Error refreshing basket:', err);
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
            // Basket completed or expired, create new one
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
        console.error('[useBasket] Error initializing basket:', err);
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
      console.error('[useBasket] Error adding item:', err);
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
      console.error('[useBasket] Error removing item:', err);
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

  return {
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
  };
}
