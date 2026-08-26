"use client"

import { useState, useEffect } from "react"
import { retrieveCustomer } from "../../../../lib/data/customer"
import { HttpTypes } from "@medusajs/types"
import { addProductReview } from "../../../../lib/data/products"
import Link from "next/link"
import { Star, Sparkles, CheckCircle2, User, Lock, Send, MessageSquare } from "lucide-react"

type ProductReviewsFormProps = {
  productId: string
}

const RATING_LABELS: Record<number, string> = {
  1: "1 Star · Needs Improvement",
  2: "2 Stars · Fair Experience",
  3: "3 Stars · Good & Fresh",
  4: "4 Stars · Delicious & Authentic",
  5: "5 Stars · Divine Royal Agra Taste!",
}

export default function ProductReviewsForm({ productId }: ProductReviewsFormProps) {
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    retrieveCustomer().then(setCustomer).catch(() => setCustomer(null))
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!content || !rating) {
      setError("Please select a star rating and share your thoughts.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await addProductReview({
        title: title.trim() || "Authentic & Delicious!",
        content: content.trim(),
        rating,
        first_name: customer?.first_name || "Sweet",
        last_name: customer?.last_name || "Lover",
        product_id: productId,
      })

      setSubmitted(true)
      setShowForm(false)
      setTitle("")
      setContent("")
      setRating(5)
    } catch (err) {
      setError("An error occurred while submitting your review. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // If customer is not logged in, show quick sign-in prompt
  if (!customer) {
    return (
      <div className="mt-8 p-6 rounded-3xl bg-amber-50/70 border border-amber-200/80 text-center font-jakarta space-y-3">
        <div className="w-10 h-10 rounded-full bg-white border border-amber-300 flex items-center justify-center mx-auto text-petha-amber">
          <MessageSquare className="w-5 h-5" />
        </div>
        <h4 className="font-cormorant text-xl font-bold text-slate-900">
          Have You Tasted This Fresh Batch?
        </h4>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Sign in to your Taj Petha account to share your tasting experience with sweet lovers across India.
        </p>
        <div>
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In to Leave a Review</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 font-jakarta">
      {submitted && (
        <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-2 mb-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h4 className="font-cormorant text-2xl font-bold text-slate-900">
            Thank You for Your Sweet Review!
          </h4>
          <p className="text-xs text-slate-600">
            Your review has been submitted and verified. It will appear on this product page shortly.
          </p>
        </div>
      )}

      {!showForm && !submitted && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-petha-amber" />
            <span>Write a Customer Review</span>
          </button>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-3xl border border-amber-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-petha-amber block">
                Verified Sweet Connoisseur
              </span>
              <h3 className="font-cormorant text-2xl font-bold text-slate-900">
                Share Your Tasting Experience
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 w-fit">
              <User className="w-3.5 h-3.5 text-petha-amber" />
              <span>Posting as <strong>{customer.first_name} {customer.last_name || ""}</strong></span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Interactive Star Rating */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Overall Taste &amp; Freshness Rating *
              </label>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const activeRating = hoverRating || rating
                    const isFilled = star <= activeRating
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 text-2xl transition-transform hover:scale-125 cursor-pointer focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            isFilled
                              ? "text-petha-amber fill-petha-amber drop-shadow-xs"
                              : "text-slate-300"
                          }`}
                        />
                      </button>
                    )
                  })}
                </div>

                <span className="text-xs font-bold text-slate-700 ml-2">
                  {RATING_LABELS[hoverRating || rating]}
                </span>
              </div>
            </div>

            {/* Headline / Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Review Headline (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Melt-in-mouth juicy white petha! Best I've tasted outside Agra."
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-petha-amber focus:bg-white transition-all"
              />
            </div>

            {/* Review Comment */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Review &amp; Texture Comments *
              </label>
              <textarea
                rows={4}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="How was the freshness, sweetness balance, saffron aroma, or packaging? Would you recommend this to sweet lovers?"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-petha-amber focus:bg-white transition-all resize-none"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 rounded-full bg-petha-amber hover:bg-petha-saffron text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
