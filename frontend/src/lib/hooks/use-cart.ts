"use client"

import { useCallback, useEffect, useState, useRef } from "react"
import { HttpTypes } from "@medusajs/types"

const CACHE_TTL = 3000

// In-memory global cart cache
let cartCache: {
  data: HttpTypes.StoreCart | null
  timestamp: number
} | null = null

/**
 * Broadcasts cart updates across the application with instant in-memory hydration
 */
export function broadcastCartUpdate(cart?: HttpTypes.StoreCart | null, options?: { quantity?: number; forceOpen?: boolean }) {
  if (cart) {
    cartCache = {
      data: cart,
      timestamp: Date.now(),
    }
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("cartUpdated", {
        detail: {
          cart: cart || null,
          quantity: options?.quantity || 0,
          forceOpen: options?.forceOpen ?? false,
        },
      })
    )
  }
}

export function invalidateCartCache() {
  cartCache = null
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { forceRefresh: true } }))
  }
}

/**
 * Custom hook for fetching and managing live cart state
 */
export function useCart() {
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(cartCache?.data || null)
  const [loading, setLoading] = useState(!cartCache?.data)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdate, setLastUpdate] = useState<number>(cartCache?.timestamp || Date.now())

  const fetchCart = useCallback(async (forceUpdate = false) => {
    // If we already have fresh data in cache and not forcing, reuse it
    if (!forceUpdate && cartCache && Date.now() - cartCache.timestamp < CACHE_TTL) {
      if (cartCache.data) {
        setCart(cartCache.data)
        setLoading(false)
      }
      return
    }

    try {
      const cacheBuster = forceUpdate ? `?t=${Date.now()}` : ""
      const response = await fetch(`/api/cart${cacheBuster}`, {
        credentials: "include",
        cache: forceUpdate ? "no-store" : "default",
      })

      if (!response.ok) throw new Error("Failed to fetch cart")

      const { cart: cartData } = await response.json()

      // Empty-State Guard: If current cart has items and response is null/empty during a background fetch, protect existing cart
      if (cart?.items && cart.items.length > 0 && (!cartData || !cartData.items || cartData.items.length === 0) && !forceUpdate) {
        return
      }

      const now = Date.now()
      cartCache = {
        data: cartData,
        timestamp: now,
      }

      setCart(cartData)
      setLastUpdate(now)
      setError(null)
    } catch (err) {
      console.error("[useCart] Error fetching cart:", err)
      setError(err instanceof Error ? err : new Error("Unknown error"))
    } finally {
      setLoading(false)
    }
  }, [cart?.items])

  // Event listener for global cart updates
  useEffect(() => {
    fetchCart()

    const handleCartUpdate = (e: Event) => {
      const customEvent = e as CustomEvent
      // Instant hydration if cart payload is provided directly in event
      if (customEvent?.detail?.cart) {
        const directCart = customEvent.detail.cart as HttpTypes.StoreCart
        cartCache = {
          data: directCart,
          timestamp: Date.now(),
        }
        setCart(directCart)
        setLoading(false)
        return
      }

      // Otherwise fetch from API
      fetchCart(true)
    }

    if (typeof window !== "undefined") {
      window.addEventListener("cartUpdated", handleCartUpdate)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("cartUpdated", handleCartUpdate)
      }
    }
  }, [fetchCart])

  const totalItems = cart?.items?.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0) || 0

  return {
    cart,
    loading,
    error,
    refetch: () => fetchCart(true),
    lastUpdate,
    isEmpty: !cart?.items?.length,
    totalItems,
  }
}
 