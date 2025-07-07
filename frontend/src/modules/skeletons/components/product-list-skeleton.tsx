"use client"

import { Skeleton } from "@medusajs/ui"

const ProductListSkeleton = ({ count = 4 }: { count?: number }) => {
  return (
    <ul
      className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
      data-testid="skeleton-product-list"
    >
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="animate-pulse">
          <div className="group relative">
            <div className="bg-gray-100 aspect-square w-full overflow-hidden rounded-md">
              <Skeleton className="h-full w-full object-cover object-center" />
            </div>
            <div className="mt-5">
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default ProductListSkeleton 