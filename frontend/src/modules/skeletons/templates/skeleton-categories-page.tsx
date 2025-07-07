"use client"

import { Heading, Text, Skeleton } from "@medusajs/ui"

const SkeletonCategoriesPage = () => {
  return (
    <div className="py-12 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero section skeleton */}
      <div className="text-center mb-16">
        <div className="mb-4 mx-auto">
          <Skeleton className="h-10 w-3/4 max-w-lg mx-auto" />
        </div>
        <div className="h-px w-32 bg-gray-200 mx-auto mb-6"></div>
        <Skeleton className="h-5 w-2/3 max-w-xl mx-auto mb-2" />
        <Skeleton className="h-5 w-1/2 max-w-lg mx-auto" />
      </div>

      {/* Categories grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="aspect-[4/3] rounded-lg overflow-hidden relative bg-gray-100">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <Skeleton className="h-6 w-1/2 mb-3" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-2/3 mb-6" />
              <Skeleton className="h-9 w-32 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Elegant divider skeleton */}
      <div className="relative my-16">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center">
          <div className="bg-white px-6">
            <div className="w-6 h-6 rounded-full bg-gray-200"></div>
          </div>
        </div>
      </div>

      {/* Bottom message skeleton */}
      <div className="text-center mb-8">
        <Skeleton className="h-5 w-3/5 max-w-md mx-auto" />
      </div>
    </div>
  )
}

export default SkeletonCategoriesPage 