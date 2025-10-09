"use client"

import { useCallback, useEffect, useState, useRef } from "react"
import { addCartListener } from "@lib/cart/events"
import { DEFAULT_CURRENCY } from "@lib/config/defaults"
import { HttpTypes } from "@medusajs/types"

// ✅ Improved cache management with shorter TTL and better invalidation
const CACHE_TTL = 1000; // Reduced from 3000ms to 1000ms for fresher data

// Cache the last fetched cart response in memory
let cartCache: {
  data: HttpTypes.StoreCart | null;
  timestamp: number;
} | null = null;

// Export function to invalidate cart cache (called on mutations)
export function invalidateCartCache() {
  cartCache = null;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  }
}

/**
 * Custom hook for fetching and managing cart data
 * Provides reactive cart updates across components
 * Fixed: Removed dependency loop, improved cache invalidation
 */
export function useCart() {
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(cartCache?.data || null)
  const [loading, setLoading] = useState(!cartCache)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdate, setLastUpdate] = useState<number>(cartCache?.timestamp || Date.now())
  
  // Use ref to track initialization to avoid checking stale cart state
  const initializedFromCache = useRef(false)

  const fetchCart = useCallback(async (forceUpdate = false) => {
    // Simple cart fetching with optimized API call
    // Use cache if available and not forcing update
    if (!forceUpdate && cartCache && (Date.now() - cartCache.timestamp < CACHE_TTL)) {
      // Only set from cache if we haven't initialized yet
      if (!initializedFromCache.current) {
        setCart(cartCache?.data || null);
        setLastUpdate(cartCache?.timestamp || Date.now());
        setLoading(false);
        initializedFromCache.current = true;
      }
      return;
    }

    setLoading(true);
    
    try {
      // Use optimized cart API call with cache busting
      const cacheBuster = forceUpdate ? `?t=${Date.now()}` : '';
      const response = await fetch(`/api/cart${cacheBuster}`, { 
        credentials: 'include',
        cache: forceUpdate ? 'no-store' : 'default'
      });
      
      if (!response.ok) throw new Error('Failed to fetch cart');
      
      const { cart: cartData } = await response.json();
      
      // Update cache with fresh data
      const now = Date.now();
      cartCache = {
        data: cartData,
        timestamp: now,
      };

      setCart(cartData);
      setLastUpdate(now);
      initializedFromCache.current = true;
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError(error instanceof Error ? error : new Error('Unknown error'));
      // Don't clear cache on error - keep showing stale data
    } finally {
      setLoading(false);
    }
  }, []); // ✅ FIXED: Removed cart dependency to prevent infinite loop

  // Initial fetch and event listeners
  useEffect(() => {
    fetchCart();
    
    const handleCartUpdate = () => fetchCart(true);
    
    // Ensure window is defined (SSR safety)
    if (typeof window !== 'undefined') {
      window.addEventListener('cartUpdated', handleCartUpdate);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('cartUpdated', handleCartUpdate);
      }
    };
  }, [fetchCart]); // Now stable because fetchCart has no dependencies

  return {
    cart,
    loading,
    error,
    refetch: () => fetchCart(true),
    lastUpdate,
    isEmpty: !cart?.items?.length,
    totalItems: cart?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0,
  }
} 