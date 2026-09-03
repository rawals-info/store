import React from "react"

export function ShimmerBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-amber-100/50 ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-amber-100/80 overflow-hidden shadow-sm flex flex-col justify-between">
      {/* Top Image area */}
      <div className="relative aspect-square w-full bg-amber-50/40 overflow-hidden">
        {/* Shimmer Image */}
        <ShimmerBlock className="w-full h-full" />
        {/* Top badge skeleton */}
        <div className="absolute top-3 left-3">
          <ShimmerBlock className="h-5 w-20 rounded-full" />
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between gap-3">
        <div>
          {/* Review stars skeleton */}
          <div className="flex items-center gap-1.5 mb-2">
            <ShimmerBlock className="h-3.5 w-16 rounded" />
            <ShimmerBlock className="h-3 w-8 rounded" />
          </div>

          {/* Title skeleton */}
          <ShimmerBlock className="h-5 w-4/5 rounded mb-1.5" />
          <ShimmerBlock className="h-3.5 w-3/5 rounded" />
        </div>

        {/* Pricing & CTA */}
        <div className="pt-2 border-t border-amber-50/80 flex items-center justify-between gap-2">
          <div>
            <ShimmerBlock className="h-3 w-10 rounded mb-1" />
            <ShimmerBlock className="h-5 w-16 rounded" />
          </div>
          <ShimmerBlock className="h-9 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export default function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
