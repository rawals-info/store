"use client"

import { Skeleton } from "@medusajs/ui"

const CartSkeleton = () => {
  return (
    <div className="py-12 animate-pulse">
      <div className="content-container">
        <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-8 small:gap-x-16">
          <div className="flex flex-col bg-luxury-ivory border border-luxury-lightgold/30 shadow-luxury-sm py-6 gap-y-6">
            {/* Cart items skeleton */}
            <div className="flex flex-col gap-y-4 px-6">
              <div className="flex items-center justify-between">
                <Skeleton className="w-32 h-6" />
                <Skeleton className="w-24 h-5" />
              </div>
              
              {/* Cart item skeletons */}
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="grid grid-cols-[122px_1fr] gap-x-4 py-8 border-b border-luxury-lightgold/20">
                  <div className="w-full h-[120px] bg-gray-100 rounded-md"></div>
                  <div className="flex flex-col justify-between">
                    <div>
                      <Skeleton className="w-2/3 h-6 mb-2" />
                      <Skeleton className="w-1/2 h-5 mb-4" />
                      <Skeleton className="w-1/3 h-5" />
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <Skeleton className="w-24 h-8 rounded-full" />
                      <Skeleton className="w-20 h-6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Cart summary skeleton */}
          <div className="relative">
            <div className="flex flex-col gap-y-8 sticky top-12">
              <div className="bg-luxury-ivory border border-luxury-lightgold/30 shadow-luxury-sm py-6">
                {/* Gold line at top */}
                <div className="h-0.5 w-full gold-gradient mb-4"></div>
                
                <div className="flex flex-col gap-y-4 px-6">
                  <Skeleton className="w-full h-8 mb-2" />
                  
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="w-24 h-5" />
                    <Skeleton className="w-16 h-5" />
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="w-28 h-5" />
                    <Skeleton className="w-16 h-5" />
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="w-20 h-5" />
                    <Skeleton className="w-16 h-5" />
                  </div>
                  
                  <div className="h-px w-full bg-gray-200 my-4"></div>
                  
                  <div className="flex items-center justify-between font-medium">
                    <Skeleton className="w-24 h-6" />
                    <Skeleton className="w-20 h-6" />
                  </div>
                  
                  <Skeleton className="w-full h-12 mt-4 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartSkeleton 