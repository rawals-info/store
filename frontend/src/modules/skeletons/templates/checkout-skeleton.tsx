"use client"

import { Skeleton } from "@medusajs/ui"

const CheckoutSkeleton = () => {
  return (
    <div className="w-full grid grid-cols-1 gap-y-8 animate-pulse">
      {/* Addresses Section */}
      <div className="bg-luxury-ivory p-8 rounded-md shadow-luxury-sm border border-luxury-lightgold/30">
        {/* Gold line at top */}
        <div className="h-0.5 w-full gold-gradient mb-6"></div>
        
        <Skeleton className="w-40 h-7 mb-6" />
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <Skeleton className="w-32 h-5 mb-3" />
            <Skeleton className="w-full h-10 rounded-md" />
          </div>
          <div>
            <Skeleton className="w-32 h-5 mb-3" />
            <Skeleton className="w-full h-10 rounded-md" />
          </div>
        </div>
        
        <div className="mb-6">
          <Skeleton className="w-32 h-5 mb-3" />
          <Skeleton className="w-full h-10 rounded-md" />
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <Skeleton className="w-32 h-5 mb-3" />
            <Skeleton className="w-full h-10 rounded-md" />
          </div>
          <div>
            <Skeleton className="w-32 h-5 mb-3" />
            <Skeleton className="w-full h-10 rounded-md" />
          </div>
        </div>
      </div>
      
      {/* Shipping Section */}
      <div className="bg-luxury-ivory p-8 rounded-md shadow-luxury-sm border border-luxury-lightgold/30">
        {/* Gold line at top */}
        <div className="h-0.5 w-full gold-gradient mb-6"></div>
        
        <Skeleton className="w-40 h-7 mb-6" />
        
        <div className="flex flex-col gap-4 mb-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border border-gray-200 rounded-md">
              <div className="w-5 h-5 rounded-full bg-gray-200"></div>
              <div className="flex-1">
                <Skeleton className="w-40 h-5 mb-2" />
                <Skeleton className="w-24 h-4" />
              </div>
              <Skeleton className="w-16 h-5" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Payment Section */}
      <div className="bg-luxury-ivory p-8 rounded-md shadow-luxury-sm border border-luxury-lightgold/30">
        {/* Gold line at top */}
        <div className="h-0.5 w-full gold-gradient mb-6"></div>
        
        <Skeleton className="w-40 h-7 mb-6" />
        
        <div className="flex flex-col gap-4 mb-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border border-gray-200 rounded-md">
              <div className="w-5 h-5 rounded-full bg-gray-200"></div>
              <div className="flex-1">
                <Skeleton className="w-40 h-5" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Review Section */}
      <div className="bg-luxury-ivory p-8 rounded-md shadow-luxury-sm border border-luxury-lightgold/30">
        {/* Gold line at top */}
        <div className="h-0.5 w-full gold-gradient mb-6"></div>
        
        <Skeleton className="w-40 h-7 mb-6" />
        
        <div className="mb-8">
          <Skeleton className="w-full h-5 mb-3" />
          <Skeleton className="w-full h-5 mb-3" />
          <Skeleton className="w-1/2 h-5" />
        </div>
        
        <Skeleton className="w-full h-12 rounded-md" />
      </div>
    </div>
  )
}

export default CheckoutSkeleton 