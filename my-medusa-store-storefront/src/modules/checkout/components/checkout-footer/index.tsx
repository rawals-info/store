"use client"

import { useEffect, useState } from "react"

/**
 * A lightweight footer component specifically for the checkout page
 * This is loaded lazily to improve initial page load performance
 */
const CheckoutFooter = () => {
  const [mounted, setMounted] = useState(false)
  
  // Only show component after mounting to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="mt-12 border-t border-luxury-lightgold/20 pt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Payment methods */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-sm font-medium text-luxury-charcoal mb-4">Secure Payment Methods</h3>
          <div className="flex items-center gap-x-3">
            <img src="/visa.svg" alt="Visa" className="h-8 w-auto" />
            <img src="/mastercard.svg" alt="Mastercard" className="h-8 w-auto" />
            <img src="/amex.svg" alt="American Express" className="h-8 w-auto" />
            <img src="/paypal.svg" alt="PayPal" className="h-8 w-auto" />
          </div>
        </div>
        
        {/* Security */}
        <div className="flex flex-col items-center">
          <h3 className="text-sm font-medium text-luxury-charcoal mb-4">Secure Checkout</h3>
          <div className="flex items-center gap-x-2 text-luxury-charcoal/70">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M19 11H5V21H19V11Z" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M17 11V7C17 5.93913 16.5786 4.92172 15.8284 4.17157C15.0783 3.42143 14.0609 3 13 3H11C9.93913 3 8.92172 3.42143 8.17157 4.17157C7.42143 4.92172 7 5.93913 7 7V11" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M12 16.5C12.8284 16.5 13.5 15.8284 13.5 15C13.5 14.1716 12.8284 13.5 12 13.5C11.1716 13.5 10.5 14.1716 10.5 15C10.5 15.8284 11.1716 16.5 12 16.5Z" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xs">SSL Encrypted Payment</span>
          </div>
        </div>
        
        {/* Trust badges */}
        <div className="flex flex-col items-center md:items-end">
          <h3 className="text-sm font-medium text-luxury-charcoal mb-4">Trusted By</h3>
          <div className="flex items-center gap-x-3">
            <div className="text-xs px-2 py-1 bg-luxury-ivory border border-luxury-lightgold/20 text-luxury-charcoal/70 rounded">
              Verified
            </div>
            <div className="text-xs px-2 py-1 bg-luxury-ivory border border-luxury-lightgold/20 text-luxury-charcoal/70 rounded">
              TrustPilot
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-xs text-luxury-charcoal/60">
        By proceeding with your order, you agree to our <a href="/terms" className="underline hover:text-luxury-gold transition-colors">Terms & Conditions</a> and <a href="/privacy" className="underline hover:text-luxury-gold transition-colors">Privacy Policy</a>
      </div>
    </div>
  )
}

export default CheckoutFooter 