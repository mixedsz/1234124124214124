import { useEffect, useState } from 'react';
import { TebexBasket, createBasket, getBasket, addToBasket, removeFromBasket } from '@/lib/tebex';

const BASKET_STORAGE_KEY = 'tebex_basket_ident';

export function useBasket() {
  const [basket, setBasket] = useState<TebexBasket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  // Initialize basket
  useEffect(() => {
    const initBasket = async () => {
      try {
        setLoading(true);
        const storedIdent = localStorage.getItem(BASKET_STORAGE_KEY);
        const storedUsername = localStorage.getItem('tebex_username');

        if (storedIdent && storedUsername) {
          // Try to fetch existing basket
          try {
            const existingBasket = await getBasket(storedIdent);
            setBasket(existingBasket);
            setUsername(storedUsername);
          } catch {
            // Basket expired, create new one
            const newBasket = await createBasket(storedUsername);
            setBasket(newBasket);
            setUsername(storedUsername);
            localStorage.setItem(BASKET_STORAGE_KEY, newBasket.ident);
          }
        } else {
          // Create new anonymous basket
          const newBasket = await createBasket('Player');
          setBasket(newBasket);
          localStorage.setItem(BASKET_STORAGE_KEY, newBasket.ident);
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
      // Create new basket with username
      const newBasket = await createBasket(newUsername);
      setBasket(newBasket);
      setUsername(newUsername);
      localStorage.setItem(BASKET_STORAGE_KEY, newBasket.ident);
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
      setBasket(updated);
      return updated;
    } catch (err) {
      console.error('[useBasket] Error adding item:', err);
      setError(err instanceof Error ? err : new Error('Failed to add item'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!basket) throw new Error('Basket not initialized');

    try {
      setLoading(true);
      const updated = await removeFromBasket(basket.ident, itemId);
      setBasket(updated);
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

  return {
    basket,
    loading,
    error,
    username,
    updateUsername,
    addItem,
    removeItem,
    getBasketIdent,
  };
}
