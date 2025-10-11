"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import { HttpTypes } from "@medusajs/types"
import { ProductTrustBadges } from "@components/TrustBadges"

const CartClientWrapper = ({
  initialCart,
  customer,
}: {
  initialCart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const [cart, setCart] = useState(initialCart)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()

  // ✅ Listen for cart updates and refresh immediately
  useEffect(() => {
    console.log("[CartPage] Setting up cartUpdated event listener")
    
    const handleCartUpdate = async (event?: Event) => {
      console.log("[CartPage] ✅ Cart updated event received! Refreshing cart...")
      setIsRefreshing(true)
      
      // ✅ FIX: Longer delay to ensure backend has processed the mutation
      await new Promise(resolve => setTimeout(resolve, 500))
      
      try {
        // Fetch latest cart data with cache busting
        const cacheBuster = Date.now()
        console.log("[CartPage] Fetching cart with cache buster:", cacheBuster)
        
        const response = await fetch(`/api/cart?t=${cacheBuster}`, {
          credentials: 'include',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        })
        
        if (response.ok) {
          const { cart: updatedCart } = await response.json()
          console.log("[CartPage] ✅ Cart fetched, items count:", updatedCart?.items?.length || 0)
          setCart(updatedCart)
        } else {
          console.error("[CartPage] ❌ Failed to fetch cart, status:", response.status)
          router.refresh()
        }
      } catch (error) {
        console.error("[CartPage] ❌ Error fetching cart:", error)
        router.refresh()
      } finally {
        setIsRefreshing(false)
      }
    }

    // Listen for cart update events
    window.addEventListener('cartUpdated', handleCartUpdate)
    console.log("[CartPage] Event listener registered successfully")
    
    return () => {
      console.log("[CartPage] Cleaning up event listener")
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [router])
  
  // ✅ Sync cart state with initial cart when it changes (after router.refresh)
  useEffect(() => {
    if (initialCart !== cart && initialCart !== undefined) {
      console.log("[CartPage] Initial cart changed, updating state")
      setCart(initialCart)
    }
  }, [initialCart])

  return (
    <div className="py-12">
      <div className="content-container" data-testid="cart-container">
        {/* Show overlay when refreshing */}
        {isRefreshing && (
          <div className="fixed inset-0 bg-black/10 z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-white rounded-lg shadow-lg px-6 py-4 flex items-center gap-3">
              <svg className="animate-spin h-5 w-5 text-luxury-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-luxury-charcoal font-medium">Updating cart...</span>
            </div>
          </div>
        )}
        
        {cart && cart.items && cart.items.length > 0 ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-8 small:gap-x-16">
            <div className="cart-ivory-panel flex flex-col border border-luxury-lightgold/30 shadow-luxury-sm py-6 gap-y-6" style={{ backgroundColor: "#FFFAF2" }}>
              {!customer && (
                <>
                  <SignInPrompt />
                  <div className="h-px bg-luxury-gold/20 mx-6"></div>
                </>
              )}
              <ItemsTemplate cart={cart} />
            </div>
            <div className="relative">
              <div className="flex flex-col gap-y-8 sticky top-12">
                {cart && cart.region && (
                  <>
                    <div className="cart-ivory-panel border border-luxury-lightgold/30 shadow-luxury-sm py-6" style={{ backgroundColor: "#FFFAF2" }}>
                      {/* Gold line at top */}
                      <div className="h-0.5 w-full gold-gradient mb-4"></div>
                      <Summary cart={cart as any} />
                    </div>
                    
                    {/* Trust Badges for Cart */}
                    <ProductTrustBadges />
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartClientWrapper

