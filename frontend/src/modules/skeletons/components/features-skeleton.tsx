"use client"

import { Skeleton } from "@medusajs/ui"

export default function FeaturesSkeleton() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section title skeleton */}
        <div className="text-center mb-12">
          <Skeleton className="h-8 md:h-10 w-72 mx-auto mb-4" />
          <div className="h-px w-24 bg-gray-200 mx-auto mb-6"></div>
          <Skeleton className="h-5 w-96 mx-auto" />
        </div>
        
        {/* Features grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="text-center animate-pulse">
              <div className="flex justify-center mb-6">
                <Skeleton className="w-16 h-16 rounded-full" />
              </div>
              <Skeleton className="h-6 w-32 mx-auto mb-3" />
              <Skeleton className="h-4 w-48 mx-auto mb-2" />
              <Skeleton className="h-4 w-40 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 