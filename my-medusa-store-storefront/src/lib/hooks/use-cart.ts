import { HttpTypes } from "@medusajs/types"
import { useCallback, useEffect, useState } from "react"
import { addCartListener } from "@lib/cart/events"

// Cache the last fetched cart response in memory
let cartCache: {
  data: HttpTypes.StoreCart | null;
  timestamp: number;
} | null = null;

// New: Persist key
const CART_SNAPSHOT_KEY = "cart_snapshot"

// Load snapshot on init if no cache
if (!cartCache && typeof window !== "undefined") {
  try {
    const snap = localStorage.getItem(CART_SNAPSHOT_KEY)
    if (snap) {
      const parsed = JSON.parse(snap)
      cartCache = { data: parsed.data, timestamp: parsed.timestamp }
    }
  } catch {}
}

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

  useEffect(() => {
    // Persist to localStorage whenever cart changes
    if (cart) {
      try {
        localStorage.setItem(
          CART_SNAPSHOT_KEY,
          JSON.stringify({ data: cart, timestamp: Date.now() })
        )
      } catch {}
    }
  }, [cart])

  // Listen for cart updates coming from other components (e.g. product page)
  // and perform an *optimistic* local update so the UI (badge, dropdown, etc.)
  // reflects the change instantly. We still trigger `fetchCart(true)` so the
  // real cart state from the backend reconciles once the network call
  // completes.
  useEffect(() => {
    const remove = addCartListener((detail) => {
      if (detail?.variantId && detail.quantity) {
        setCart((prev) => {
          // If we have an existing cart object, clone it and add/update the
          // relevant line-item locally. Otherwise create a minimal placeholder
          // cart so header badge can update immediately.
          const baseCart: any = prev || {
            id: "optimistic-cart",
            currency_code: "usd",
            items: [],
            subtotal: 0,
            total: 0,
          }

          // Shallow copy items so we don't mutate state directly
          const items = [...(baseCart.items ?? [])]

          const existing = items.find((i: any) => i.variant_id === detail.variantId)
          if (existing) {
            existing.quantity += detail.quantity
          } else {
            items.push({
              id: `optimistic-${detail.variantId}-${Date.now()}`,
              variant_id: detail.variantId,
              quantity: detail.quantity,
              total: 0,
              original_total: 0,
              thumbnail: "",
              variant: null,
            })
          }

          return {
            ...baseCart,
            items,
          }
        })
      }

      // Always fetch the canonical cart afterwards to reconcile
      fetchCart(true)
    })
    return remove
  }, [fetchCart])

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