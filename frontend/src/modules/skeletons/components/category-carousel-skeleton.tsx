"use client"

import { Skeleton } from "@medusajs/ui"

export default function CategoryCarouselSkeleton() {
  return (
    <section className="py-16 bg-luxury-cream/30">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section title skeleton */}
        <div className="text-center mb-12">
          <Skeleton className="h-8 md:h-10 w-64 mx-auto mb-4" />
          <div className="h-px w-24 bg-gray-200 mx-auto"></div>
        </div>
        
        {/* Category carousel skeleton */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="group animate-pulse">
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-200 relative">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                    <Skeleton className="h-6 w-32 mb-3" />
                    <Skeleton className="h-4 w-24 mb-6" />
                    <Skeleton className="h-10 w-28 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation buttons skeleton */}
          <div className="flex justify-center mt-8 gap-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  )
} 