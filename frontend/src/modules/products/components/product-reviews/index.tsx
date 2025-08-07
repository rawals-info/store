"use client"

import { useState, useEffect } from "react"
import { Button } from "@medusajs/ui"
import { Star, StarSolid } from "@medusajs/icons"

import { getProductReviews } from "../../../../lib/data/products"
import ProductReviewsForm from "./form"
import { StoreProductReview } from "../../../../types/global"

type ProductReviewsProps = {
  productId: string
}

function Review({ review, index }: { review: StoreProductReview; index: number }) {
  return (
    <div 
      className="bg-luxury-ivory/30 backdrop-blur-sm border border-luxury-gold/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Review Header */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center justify-between">
          {review.title && (
            <h4 className="font-semibold text-luxury-charcoal text-lg leading-tight">
              {review.title}
            </h4>
          )}
          <div className="flex gap-x-1 ml-auto">
            {Array.from({ length: 5 }).map((_, index) => (
              <span key={index}>
                {index < review.rating ? (
                  <StarSolid className="text-luxury-gold w-4 h-4" />
                ) : (
                  <Star className="text-luxury-gold/30 w-4 h-4" />
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Review Content */}
      <div className="mb-4">
        <p className="text-luxury-charcoal/80 leading-relaxed text-base">
          "{review.content}"
        </p>
      </div>

      {/* Review Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-luxury-gold/20">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-luxury-gold/20 rounded-full flex items-center justify-center">
            <span className="text-luxury-gold font-semibold text-sm">
              {review.first_name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-luxury-charcoal text-sm">
              {review.first_name} {review.last_name}
            </p>
            <p className="text-luxury-charcoal/60 text-xs">
              Verified Customer
            </p>
          </div>
        </div>
        <div className="text-luxury-charcoal/50 text-xs">
          Recent
        </div>
      </div>
    </div>
  )
}

export default function ProductReviews({
  productId,
}: ProductReviewsProps) {
  const [page, setPage] = useState(1)
  const defaultLimit = 6 // Reduced for better UX
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
      const { reviews: paginatedReviews, average_rating, count, limit } = data
      setReviews((prev) => {
        const newReviews = paginatedReviews.filter(
          (review: any) => !prev.some((r) => r.id === review.id)
        )
        return [...prev, ...newReviews]
      })
      setRating(average_rating) // Use actual average_rating instead of Math.round
      setHasMoreReviews(count > limit * page)
      setCount(count)
    }).finally(() => {
      setIsLoading(false)
    })
  }, [page, productId])

  const handleLoadMore = () => {
    setPage(page + 1)
  }

  if (count === 0) {
    return (
      <div className="product-page-constraint">
        <div className="flex flex-col items-center text-center py-16">
          <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mb-6">
            <Star className="text-luxury-gold w-8 h-8" />
          </div>
          <h3 className="font-display text-xl text-luxury-charcoal mb-2">
            No Reviews Yet
          </h3>
          <p className="text-luxury-charcoal/70 max-w-md">
            Be the first to share your experience with this product
          </p>
        </div>
        <ProductReviewsForm productId={productId} />
      </div>
    )
  }

  return (
    <div className="product-page-constraint" id="customer-reviews">
      {/* Review Summary Header */}
      <div className="flex flex-col items-center text-center mb-12">
        <span className="font-serif text-sm uppercase tracking-[0.3em] text-luxury-gold mb-6">
          Customer Reviews
        </span>
        <h2 className="font-display text-2xl lg:text-3xl text-luxury-charcoal max-w-lg mb-6">
          See what our customers are saying about this product.
        </h2>
        
        {/* Enhanced Rating Display */}
        <div className="flex flex-col items-center space-y-3 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex gap-x-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index}>
                  {!rating || index >= Math.round(rating) ? (
                    <Star className="text-luxury-gold/30 w-6 h-6" />
                  ) : (
                    <StarSolid className="text-luxury-gold w-6 h-6" />
                  )}
                </span>
              ))}
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-luxury-charcoal">
                {rating.toFixed(1)}
              </div>
              <div className="text-sm text-luxury-charcoal/70">
                out of 5
              </div>
            </div>
          </div>
          <p className="text-base text-luxury-charcoal/70">
            Based on {count} customer review{count !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="h-px w-24 bg-luxury-gold mx-auto"></div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {reviews.map((review, index) => (
          <Review key={review.id} review={review} index={index} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMoreReviews && (
        <div className="flex justify-center mb-12">
          <Button 
            variant="secondary" 
            onClick={handleLoadMore}
            disabled={isLoading}
            className="luxury-btn-outline px-8 py-3 rounded-full font-medium transition-all duration-300 hover:bg-luxury-gold hover:text-luxury-ivory disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-luxury-gold border-t-transparent"></div>
                <span>Loading...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>Load more reviews</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            )}
          </Button>
        </div>
      )}

      {/* Review Form */}
      <ProductReviewsForm productId={productId} />
      
      <div className="text-center mt-8">
        <p className="text-sm font-medium text-luxury-gold/80 italic">
          💡 Please note: you must be signed in to leave a review.
        </p>
      </div>
    </div>
  )
}