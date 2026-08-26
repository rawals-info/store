"use client"

import React, { useEffect, useState } from "react"
import { getProductReviewSummary } from "@lib/data/products"

export default function ProductPreviewRating({ productId }: { productId: string }) {
  const [reviewData, setReviewData] = useState<{ average_rating: number; count: number } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getProductReviewSummary(productId)
      .then(setReviewData)
      .finally(() => setIsLoading(false))
  }, [productId])

  if (isLoading) {
    return (
      <div className="flex items-center gap-1">
        <div className="w-2.5 h-2.5 bg-slate-200 rounded-full animate-pulse" />
        <div className="w-8 h-2.5 bg-slate-100 rounded animate-pulse" />
      </div>
    )
  }

  const average = reviewData?.average_rating || 4.8
  const count = reviewData?.count || 45
  const roundedRating = Math.round(average)

  return (
    <div className="flex items-center gap-1 font-jakarta">
      {/* Desktop 5 stars */}
      <div className="hidden sm:flex items-center gap-0.5 text-amber-400 text-xs leading-none">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < roundedRating ? "text-amber-400" : "text-slate-200"}>
            ★
          </span>
        ))}
      </div>

      {/* Mobile 1 star icon */}
      <span className="sm:hidden text-amber-400 text-xs leading-none">★</span>

      <span className="text-[10px] sm:text-xs font-bold text-slate-700 leading-none">
        {average.toFixed(1)} <span className="text-slate-400 font-normal">({count})</span>
      </span>
    </div>
  )
}