import React from "react"
import { ShimmerBlock, ProductCardSkeleton } from "./product-grid-skeleton"

export default function HomepageSkeleton() {
  return (
    <div className="w-full bg-[#FAF8F5] overflow-hidden">
      {/* 1. HERO SECTION SKELETON */}
      <section className="relative w-full bg-[#FAF8F5] overflow-hidden flex items-center pt-24 sm:pt-28 lg:pt-32 pb-12 lg:pb-16">
        <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-10 w-full">
          <div className="grid lg:grid-cols-[55%_45%] gap-12 lg:gap-8 items-center w-full">
            {/* LEFT: Text & CTAs Skeleton */}
            <div className="flex flex-col">
              {/* Eyebrow badge */}
              <div className="mb-5">
                <ShimmerBlock className="h-7 w-52 rounded-full" />
              </div>

              {/* Main Headline Skeleton */}
              <div className="space-y-3 mb-4">
                <ShimmerBlock className="h-12 sm:h-14 lg:h-16 w-4/5 rounded-2xl" />
                <ShimmerBlock className="h-12 sm:h-14 lg:h-16 w-3/5 rounded-2xl" />
              </div>

              {/* Subheadline */}
              <div className="space-y-2 mb-6 max-w-lg">
                <ShimmerBlock className="h-4 w-full rounded" />
                <ShimmerBlock className="h-4 w-5/6 rounded" />
                <ShimmerBlock className="h-4 w-4/6 rounded" />
              </div>

              {/* Trust pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <ShimmerBlock key={i} className="h-8 w-28 rounded-full" />
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3.5">
                <ShimmerBlock className="h-14 w-full sm:w-52 rounded-full" />
                <ShimmerBlock className="h-14 w-full sm:w-48 rounded-full" />
              </div>
            </div>

            {/* RIGHT: Hero Image Card Skeleton */}
            <div className="relative">
              <div className="relative w-full aspect-[4/3.8] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-amber-50/50">
                <ShimmerBlock className="w-full h-full" />
                {/* Guarantee badge at bottom */}
                <div className="absolute bottom-5 left-5 right-5 p-3.5 bg-white/95 rounded-2xl border border-amber-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShimmerBlock className="w-10 h-10 rounded-xl" />
                    <div className="space-y-1">
                      <ShimmerBlock className="h-4 w-28 rounded" />
                      <ShimmerBlock className="h-3 w-20 rounded" />
                    </div>
                  </div>
                  <ShimmerBlock className="h-7 w-16 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SOCIAL PROOF STATS BAR SKELETON */}
      <div className="w-full bg-white border-y border-amber-100/80 py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`flex flex-col items-center gap-2 py-2 ${
                  i < 4 ? "lg:border-r lg:border-amber-100/60" : ""
                }`}
              >
                <ShimmerBlock className="h-8 w-24 rounded-lg" />
                <ShimmerBlock className="h-4 w-28 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. BESTSELLERS SECTION SKELETON */}
      <section className="py-12 sm:py-16 bg-white border-b border-amber-100/60">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <ShimmerBlock className="h-5 w-28 rounded-full mb-2" />
              <ShimmerBlock className="h-9 w-64 rounded-xl" />
            </div>
            <ShimmerBlock className="h-9 w-28 rounded-xl" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. CATEGORIES STRIP SKELETON */}
      <section className="py-12 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <ShimmerBlock className="h-8 w-56 rounded-xl mb-6 mx-auto" />
          <div className="flex flex-wrap justify-center gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ShimmerBlock key={i} className="h-10 w-32 rounded-full" />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
