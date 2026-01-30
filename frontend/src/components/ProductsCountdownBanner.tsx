"use client"

import CountdownTimer from "./CountdownTimer"

export default function ProductsCountdownBanner() {
  return (
    <div className="bg-luxury-ivory border border-luxury-charcoal/10 rounded px-4 py-3 inline-flex flex-col sm:flex-row items-center gap-3 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-luxury-charcoal text-sm font-medium">
          Order now for same-day dispatch
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-luxury-charcoal/60 text-xs uppercase tracking-wide">Ships in</span>
        <CountdownTimer className="text-luxury-charcoal" />
      </div>
    </div>
  )
}
