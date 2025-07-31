"use client"

import { useCallback, useEffect, useState } from "react"
import { addCartListener } from "@lib/cart/events"
import { DEFAULT_CURRENCY } from "@lib/config/defaults"
import { HttpTypes } from "@medusajs/types"

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
    // Simple cart fetching with optimized API call
    if (!forceUpdate && cartCache && (Date.now() - cartCache.timestamp < 3000)) {
      if (!cart) {
        setCart(cartCache?.data || null);
        setLastUpdate(cartCache?.timestamp || Date.now());
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    
    try {
      // Use optimized cart API call
      const response = await fetch('/api/cart', { 
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch cart');
      
      const { cart: cartData } = await response.json();
      
      cartCache = {
        data: cartData,
        timestamp: Date.now(),
      };

      setCart(cartData);
      setLastUpdate(Date.now());
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [cart]);

  // Initial fetch and event listeners
  useEffect(() => {
    fetchCart();
    
    const handleCartUpdate = () => fetchCart(true);
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [fetchCart]);

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