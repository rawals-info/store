"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

/**
 * Shows a single-time notice for visitors whose country is not directly
 * supported by a dedicated storefront (e.g. Nigeria → /us).
 * The Edge middleware sets a non-HTTP-only cookie `unsupported_country` when
 * a visitor is redirected. This component reads that cookie, clears it, and
 * displays a friendly banner.
 */
const WorldwidePopup = () => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof document === "undefined") return

    const hasSeen = localStorage.getItem("worldwide_notice_seen")
    if (hasSeen) return

    // Look for the marker cookie set by the middleware
    const cookieMatch = document.cookie.match(/(?:^|; )unsupported_country=([^;]+)/)
    if (cookieMatch) {
      // Clear the cookie so we don't show on every navigation
      document.cookie = "unsupported_country=; Path=/; Max-Age=0"
      setShow(true)
      localStorage.setItem("worldwide_notice_seen", "1")
    }
  }, [])

  if (!show) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-4 left-0 right-0 mx-4 sm:left-1/2 sm:right-auto sm:mx-0 sm:-translate-x-1/2 sm:transform z-50 max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="bg-luxury-ivory border border-luxury-gold/30 shadow-lg rounded-md p-4 mx-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-display text-luxury-charcoal text-lg">
              We ship worldwide!
            </h3>
            <button
              onClick={() => setShow(false)}
              className="text-luxury-charcoal/60 hover:text-luxury-gold transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <p className="text-sm text-luxury-charcoal/80 mb-4">
            You are shopping in USD. All prices include worldwide delivery.
          </p>
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={() => setShow(false)}
              className="px-4 py-2 text-sm font-serif bg-luxury-gold text-white rounded-sm hover:bg-luxury-gold/90 transition-colors"
            >
              Continue shopping
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default WorldwidePopup 