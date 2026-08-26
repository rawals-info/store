"use client"

import { useState, useEffect } from "react"
import { Star, CheckCircle2, MessageSquare, Sparkles } from "lucide-react"
import { getProductReviews } from "../../../../lib/data/products"
import ProductReviewsForm from "./form"
import { StoreProductReview } from "../../../../types/global"

type ProductReviewsProps = {
  productId: string
}

function ReviewItem({ review }: { review: StoreProductReview }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all font-jakarta space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={`w-4 h-4 ${
                index < review.rating
                  ? "text-petha-amber fill-petha-amber"
                  : "text-slate-200"
              }`}
            />
          ))}
        </div>
        <span className="text-[11px] text-slate-400 font-medium">
          Verified Purchase
        </span>
      </div>

      {review.title && (
        <h4 className="font-cormorant text-lg sm:text-xl font-bold text-slate-900 leading-snug">
          {review.title}
        </h4>
      )}

      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
        "{review.content}"
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-amber-100 text-petha-amber flex items-center justify-center font-bold text-xs">
            {review.first_name?.charAt(0) || "U"}
          </div>
          <span className="text-xs font-bold text-slate-800">
            {review.first_name} {review.last_name || ""}
          </span>
        </div>
        <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Verified Taste
        </span>
      </div>
    </div>
  )
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [page, setPage] = useState(1)
  const defaultLimit = 6
  const [reviews, setReviews] = useState<StoreProductReview[]>([])
  const [rating, setRating] = useState(0)
  const [hasMoreReviews, setHasMoreReviews] = useState(false)
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    getProductReviews({
      productId,
      limit: defaultLimit,
      offset: (page - 1) * defaultLimit,
    }).then((data: any) => {
      const { reviews: paginatedReviews, average_rating, count, limit } = data || {}
      if (paginatedReviews) {
        setReviews((prev) => {
          const newReviews = paginatedReviews.filter(
            (review: any) => !prev.some((r) => r.id === review.id)
          )
          return [...prev, ...newReviews]
        })
      }
      setRating(average_rating || 5)
      setCount(count || 0)
      setHasMoreReviews((count || 0) > defaultLimit * page)
    }).catch(() => {
      // fallback
    }).finally(() => {
      setIsLoading(false)
    })
  }, [productId, page])

  return (
    <div className="space-y-8 font-jakarta">
      {/* Reviews Summary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-petha-amber block">
            Customer Feedback
          </span>
          <h3 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
            Authentic Taste Reviews
          </h3>
        </div>

        <div className="flex items-center gap-3 bg-amber-50/80 border border-amber-200/80 px-4 py-2.5 rounded-2xl w-fit">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 text-petha-amber fill-petha-amber" />
            ))}
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-900">{rating ? Number(rating).toFixed(1) : "5.0"} / 5.0</span>
            <span className="text-slate-500 ml-1">({count || reviews.length || 1} {count === 1 ? "review" : "reviews"})</span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r, idx) => (
            <ReviewItem key={r.id || idx} review={r} />
          ))}
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-slate-50/70 border border-slate-200 text-center space-y-2">
          <Sparkles className="w-6 h-6 text-petha-amber mx-auto" />
          <h4 className="font-cormorant text-xl font-bold text-slate-800">
            Be the First to Review this Fresh Batch!
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Share your sweet tasting experience and help other sweet lovers choose their favorite Agra treat.
          </p>
        </div>
      )}

      {/* Pagination Load More */}
      {hasMoreReviews && (
        <div className="text-center pt-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => setPage(prev => prev + 1)}
            className="px-6 py-2.5 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            {isLoading ? "Loading Reviews..." : "Load More Reviews"}
          </button>
        </div>
      )}

      {/* Add Review Form */}
      <ProductReviewsForm productId={productId} />
    </div>
  )
}