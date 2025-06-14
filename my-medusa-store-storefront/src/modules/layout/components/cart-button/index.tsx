"use client"

import { useEffect, useState } from "react"
import { retrieveCart } from "@lib/data/cart"
import CartDropdown from "../cart-dropdown"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { motion, AnimatePresence } from "framer-motion"
import { HttpTypes } from "@medusajs/types"

export default function CartButton() {
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdded, setIsAdded] = useState(false)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartData = await retrieveCart()
        setCart(cartData)
      } catch (error) {
        console.error("Error fetching cart:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [])
  
  // Listen for cart updates from localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const lastAddedTime = localStorage.getItem('last_cart_addition')
      
      if (lastAddedTime && Date.now() - parseInt(lastAddedTime) < 2000) {
        // Show animation if item was added in the last 2 seconds
        setIsAdded(true)
        
        setTimeout(() => {
          setIsAdded(false)
        }, 1500)
        
        // Refresh cart data
        retrieveCart().then(cartData => setCart(cartData))
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    // Also check on mount
    handleStorageChange()
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
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
        </span>
        <span className="text-xs sm:text-sm">Cart</span>
        <span className="absolute -bottom-px left-0 w-0 h-px bg-luxury-gold group-hover:w-full transition-all duration-300 ease-in-out"></span>
      </LocalizedClientLink>
    )
  }

  return (
    <div className="relative z-[100]">
      <CartDropdown cart={cart} />
      
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
