"use client"

import { Skeleton } from "@medusajs/ui"

const SkeletonProductPage = () => {
  return (
    <div className="content-container py-12 px-4">
      {/* Info banner */}
      <div className="bg-gray-100 h-8 w-full animate-pulse mb-8 rounded"></div>
      
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Left column - Image gallery */}
        <div className="flex-1">
          <div className="aspect-square bg-gray-100 w-full animate-pulse rounded"></div>
          <div className="grid grid-cols-4 gap-2 mt-4">
            {Array.from({length: 4}).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded"></div>
            ))}
          </div>
        </div>
        
        {/* Right column - Product info */}
        <div className="flex-1">
          <div className="animate-pulse">
            <Skeleton className="h-10 w-2/3 mb-4" />
            <Skeleton className="h-6 w-1/3 mb-6" />
            
            <div className="space-y-2 mb-8">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            
            <div className="pt-8 border-t border-gray-200">
              <div className="flex flex-col gap-4">
                <Skeleton className="h-6 w-1/3 mb-2" />
                <div className="flex gap-2">
                  {Array.from({length: 3}).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-20 rounded-full" />
                  ))}
                </div>
                
                <Skeleton className="h-6 w-1/3 mt-4 mb-2" />
                <div className="flex gap-2">
                  {Array.from({length: 4}).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-10 rounded-full" />
                  ))}
                </div>
                
                <Skeleton className="h-12 w-full mt-8 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product details */}
      <div className="mt-16 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
      
      {/* Related products skeleton */}
      <div className="mt-16">
        <Skeleton className="h-8 w-48 mx-auto mb-12" />
        <div className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
          {Array.from({length: 4}).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-100 aspect-square w-full rounded-md"></div>
              <Skeleton className="h-4 w-2/3 mt-4 mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SkeletonProductPage 