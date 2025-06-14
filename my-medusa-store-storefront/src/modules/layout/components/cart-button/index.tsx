"use client"

import { useEffect, useState } from "react"
import CartDropdown from "../cart-dropdown"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@lib/hooks/use-cart"

export default function CartButton() {
  const { cart, loading, totalItems } = useCart()
  const [isAdded, setIsAdded] = useState(false)
  
  // Listen for cart updates to show animation
  useEffect(() => {
    const handleCartUpdate = () => {
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 1500)
    }
    
    window.addEventListener('cartUpdated', handleCartUpdate)
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [])

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
      
      {/* Cart item added animation */}
      <AnimatePresence>
        {isAdded && (
          <motion.div 
            className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-luxury-gold/90 text-luxury-ivory py-1 px-3 rounded-sm text-xs whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            Item added to cart
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
