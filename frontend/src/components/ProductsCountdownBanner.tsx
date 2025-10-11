"use client"

import CountdownTimer from "./CountdownTimer"

export default function ProductsCountdownBanner() {
  return (
    <div className="bg-gradient-to-r from-luxury-gold/10 to-orange-100 border border-luxury-gold/30 rounded-lg px-3 py-2 sm:px-4 sm:py-3 inline-flex items-center gap-2 text-sm sm:text-base shadow-md">
      <span className="text-luxury-charcoal font-medium flex items-center gap-1.5">
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-luxury-gold" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        <span className="text-luxury-gold font-semibold">Sale ends in</span>
      </span>
      <CountdownTimer inline className="text-luxury-charcoal" />
    </div>
  )
}

