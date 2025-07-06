"use client"

import { useEffect, useRef, useState } from "react"
import CartDropdown from "../cart-dropdown"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@lib/hooks/use-cart"

export default function CartButton() {
  const { cart, loading, totalItems } = useCart()
  /**
   * `isHighlighted` controls a short-lived luxury glow animation around the
   * cart icon. It fires when items are added _or_ when the shopper refreshes
   * and already has items in the cart.
   */
  const [isHighlighted, setIsHighlighted] = useState(false)

  // Track first-load so we can trigger the highlight once after the initial
  // data fetch if the cart isn't empty.
  const didFirstHighlight = useRef(false)

  // Listen for cart updates to show animation
  useEffect(() => {
    const triggerHighlight = () => {
      setIsHighlighted(true)
      setTimeout(() => setIsHighlighted(false), 1500)
    }

    const handleCartUpdate = () => {
      triggerHighlight()
    }
    
    window.addEventListener('cartUpdated', handleCartUpdate)
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [])

  // Run once after the cart has loaded to highlight if it already contains items
  useEffect(() => {
    if (!loading && totalItems > 0 && !didFirstHighlight.current) {
      didFirstHighlight.current = true
      // Give the UI a single paint before triggering so the glow is visible
      requestAnimationFrame(() => {
        setIsHighlighted(true)
        setTimeout(() => setIsHighlighted(false), 1500)
      })
    }
  }, [loading, totalItems])

  if (loading) {
    return (
      <LocalizedClientLink
        className="hover:text-luxury-gold transition-colors duration-300 flex items-center gap-1 uppercase tracking-wider text-small-semi relative group whitespace-nowrap"
        href="/cart"
        data-testid="nav-cart-link"
      >
        <span className="relative">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-luxury-gold rounded-full flex items-center justify-center text-[10px] text-luxury-ivory font-medium">
              {totalItems}
            </span>
          )}
        </span>
        <span className="text-xs sm:text-sm">Cart</span>
        <span className="absolute -bottom-px left-0 w-0 h-px bg-luxury-gold group-hover:w-full transition-all duration-300 ease-in-out"></span>
      </LocalizedClientLink>
    )
  }

  return (
    <div className="relative z-[100]">
      <CartDropdown />
      
      {/* Luxurious glow animation */}
      <AnimatePresence>
        {isHighlighted && (
          <motion.span
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="absolute w-10 h-10 rounded-full bg-luxury-gold/20 blur-sm animate-ping"></span>
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}
