import { useEffect, useState } from 'react';
import { TebexBasket, createBasket, getBasket, addToBasket, removeFromBasket } from '@/lib/tebex';

const BASKET_STORAGE_KEY = 'tebex_basket_ident';

export function useBasket() {
  const [basket, setBasket] = useState<TebexBasket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  // Helper to create basket with proper URLs
  const createNewBasket = async () => {
    const returnUrl = typeof window !== 'undefined' ? `${window.location.origin}/cart` : '';
    const completeUrl = typeof window !== 'undefined' ? `${window.location.origin}/checkout-complete` : '';
    return await createBasket(returnUrl, completeUrl);
  };

  // Initialize basket
  useEffect(() => {
    const initBasket = async () => {
      try {
        setLoading(true);
        const storedIdent = localStorage.getItem(BASKET_STORAGE_KEY);
        const storedUsername = localStorage.getItem('tebex_username');

        if (storedIdent) {
          // Try to fetch existing basket
          const existingBasket = await getBasket(storedIdent);
          if (existingBasket && !existingBasket.complete) {
            setBasket(existingBasket);
            if (storedUsername) {
              setUsername(storedUsername);
            }
          } else {
            // Basket completed or expired, create new one
            const newBasket = await createNewBasket();
            if (newBasket) {
              setBasket(newBasket);
              localStorage.setItem(BASKET_STORAGE_KEY, newBasket.ident);
            }
          }
        } else {
          // Create new basket
          const newBasket = await createNewBasket();
          if (newBasket) {
            setBasket(newBasket);
            localStorage.setItem(BASKET_STORAGE_KEY, newBasket.ident);
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

  const updateUsername = async (newUsername: string) => {
    try {
      setLoading(true);
      setUsername(newUsername);
      localStorage.setItem('tebex_username', newUsername);
    } catch (err) {
      console.error('[useBasket] Error updating username:', err);
      setError(err instanceof Error ? err : new Error('Failed to update username'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (packageId: number, quantity: number = 1) => {
    if (!basket) throw new Error('Basket not initialized');

    try {
      setLoading(true);
      const updated = await addToBasket(basket.ident, packageId, quantity);
      if (updated) {
        setBasket(updated);
      }
      return updated;
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

  const refreshBasket = async () => {
    if (!basket) return;
    try {
      const updated = await getBasket(basket.ident);
      if (updated) {
        setBasket(updated);
      }
    } catch (err) {
      console.error('[useBasket] Error refreshing basket:', err);
    }
  };

  const getBasketIdent = () => {
    return basket?.ident || localStorage.getItem(BASKET_STORAGE_KEY) || null;
  };

  const itemCount = basket?.packages?.length || 0;

  return {
    basket,
    loading,
    error,
    username,
    itemCount,
    updateUsername,
    addItem,
    removeItem,
    refreshBasket,
    getBasketIdent,
  };
}
