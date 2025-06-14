import { HttpTypes } from "@medusajs/types"
import { useCallback, useEffect, useState } from "react"

/**
 * Custom hook for fetching and managing cart data
 * Provides reactive cart updates across components
 */
export function useCart() {
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now())

  const fetchCart = useCallback(async (forceUpdate = false) => {
    // Don't show loading indicator for refreshes, only initial load
    const showLoading = !cart || forceUpdate
    if (showLoading) setLoading(true)
    
    try {
      const response = await fetch('/api/cart', { 
        credentials: 'include',
        cache: 'no-store',
        headers: { 
          'pragma': 'no-cache', 
          'cache-control': 'no-cache',
          // Force a unique URL to bypass fetch cache
          'x-timestamp': Date.now().toString()
        }
      })
      
      if (!response.ok) throw new Error('Failed to fetch cart')
      
      const { cart: cartData } = await response.json()
      setCart(cartData)
      setLastUpdate(Date.now())
    } catch (error) {
      console.error("Error fetching cart:", error)
      setError(error instanceof Error ? error : new Error('Unknown error'))
    } finally {
      if (showLoading) setLoading(false)
    }
  }, [cart])

  // Listen for cart updates with improved responsiveness
  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCart(true)
    }
    
    window.addEventListener('storage', handleCartUpdate)
    window.addEventListener('cartUpdated', handleCartUpdate)
    
    // Initial fetch
    fetchCart()
    
    return () => {
      window.removeEventListener('storage', handleCartUpdate)
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [fetchCart])

  // Force a refresh every 30 seconds if the page is active
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchCart(false)
      }
    }, 30000)
    
    return () => clearInterval(intervalId)
  }, [fetchCart])

  return {
    cart,
    loading,
    error,
    refetch: () => fetchCart(true),
    lastUpdate,
    isEmpty: !cart?.items?.length,
    totalItems: cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0,
  }
} 