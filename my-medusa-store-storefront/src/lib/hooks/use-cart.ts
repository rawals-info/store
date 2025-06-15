import { HttpTypes } from "@medusajs/types"
import { useCallback, useEffect, useState } from "react"

// Cache the last fetched cart response in memory
let cartCache: {
  data: HttpTypes.StoreCart | null;
  timestamp: number;
} | null = null;

/**
 * Custom hook for fetching and managing cart data
 * Provides reactive cart updates across components
 */
export function useCart() {
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(cartCache?.data || null)
  const [loading, setLoading] = useState(!cartCache)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdate, setLastUpdate] = useState<number>(cartCache?.timestamp || Date.now())

  const fetchCart = useCallback(async (forceUpdate = false) => {
    // Check if we have a cached response that's less than 3 seconds old
    const now = Date.now();
    const cacheIsValid = cartCache && (now - cartCache.timestamp < 3000);
    
    // Use cache unless force update is requested or cache is invalid
    if (!forceUpdate && cacheIsValid) {
      if (!cart) {
        setCart(cartCache?.data || null);
        setLastUpdate(cartCache?.timestamp || now);
        setLoading(false);
      }
      return;
    }

    // Don't show loading indicator for refreshes, only initial load
    const showLoading = !cart || forceUpdate;
    if (showLoading) setLoading(true);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch('/api/cart', { 
        credentials: 'include',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error('Failed to fetch cart');
      
      const { cart: cartData } = await response.json();
      
      // Update memory cache
      cartCache = {
        data: cartData,
        timestamp: now
      };
      
      setCart(cartData);
      setLastUpdate(now);
    } catch (error) {
      // Only log actual errors, not aborted requests
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        console.error("Error fetching cart:", error);
        setError(error instanceof Error ? error : new Error('Unknown error'));
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [cart]);

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCart(true);
    };
    
    window.addEventListener('storage', handleCartUpdate);
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    // Initial fetch
    fetchCart();
    
    return () => {
      window.removeEventListener('storage', handleCartUpdate);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [fetchCart]);

  // Force a refresh periodically but only if the page is active
  useEffect(() => {
    // Use a longer interval of 2 minutes instead of 30 seconds
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchCart(false);
      }
    }, 120000); // 2 minute interval
    
    // Also refresh cart when tab becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchCart(false);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchCart]);

  return {
    cart,
    loading,
    error,
    refetch: () => fetchCart(true),
    lastUpdate,
    isEmpty: !cart?.items?.length,
    totalItems: cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0,
  };
} 