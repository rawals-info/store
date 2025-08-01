"use client"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"

export default function ProductsListLoading() {
  return (
    <div className="content-container py-12">
      <SkeletonProductGrid numberOfProducts={8} />
    </div>
  )
} 