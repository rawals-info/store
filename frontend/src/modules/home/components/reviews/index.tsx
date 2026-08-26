"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useRef } from "react"

const REVIEWS = [
  {
    id: 1,
    name: "Priya Sharma",
    city: "Delhi",
    rating: 5,
    text: "Ordered the kesar petha for Diwali gifting and everyone loved it! The packaging was gorgeous and the petha was melt-in-mouth fresh. Will definitely order again.",
    product: "Kesar Petha Box",
    verified: true,
    initials: "PS",
    color: "bg-amber-100 text-amber-700",
  },
  {
    id: 2,
    name: "Rahul Mehta",
    city: "Mumbai",
    rating: 5,
    text: "Finally found authentic Agra petha online. My family is from UP and we've been looking for this quality for years. The namkeen is equally good.",
    product: "Agra Special Petha",
    verified: true,
    initials: "RM",
    color: "bg-green-100 text-green-700",
  },
  {
    id: 3,
    name: "Anita Joshi",
    city: "Bangalore",
    rating: 5,
    text: "I've tried 4 different petha brands online. Taj Petha is hands down the best. The packaging is eco-friendly and the petha stays fresh.",
    product: "Assorted Petha Pack",
    verified: true,
    initials: "AJ",
    color: "bg-rose-100 text-rose-700",
  },
  {
    id: 4,
    name: "Vikram Singh",
    city: "Jaipur",
    rating: 5,
    text: "Sent as a gift to my parents in Lucknow. They said it was exactly like what they used to get in Agra in the old days. High quality and fast delivery.",
    product: "Gift Hamper",
    verified: true,
    initials: "VS",
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: 5,
    name: "Deepa Nair",
    city: "Chennai",
    rating: 5,
    text: "The dry petha is incredible — not too sweet. My kids are addicted to it. The dalmoth namkeen is also a hit. 5 stars without question.",
    product: "Dry Petha + Namkeen",
    verified: true,
    initials: "DN",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: 6,
    name: "Suresh Agarwal",
    city: "Hyderabad",
    rating: 5,
    text: "Corporate order of 50 gift boxes for our office Diwali. Seamlessly handled, beautiful presentation, consistent quality. Will order again for Holi.",
    product: "Corporate Gift Boxes",
    verified: true,
    initials: "SA",
    color: "bg-orange-100 text-orange-700",
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-petha-saffron fill-current" : "text-gray-200 fill-current"}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Reviews() {
  const prefersReduced = useReducedMotion()

  return (
    <section className="py-8 lg:py-14 bg-petha-cream" aria-label="Customer reviews">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        {/* Header */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="text-center mb-8"
        >
          <span className="font-jakarta text-xs uppercase tracking-[0.2em] text-petha-amber font-semibold">
            Real People, Real Reviews
          </span>
          <h2 className="font-cormorant text-4xl lg:text-5xl font-semibold text-petha-text mt-3 leading-tight">
            What Our Customers Say
          </h2>
          {/* Overall rating bar */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <StarRating rating={5} />
            <span className="font-mono text-xl font-bold text-petha-text">4.9</span>
            <span className="font-jakarta text-sm text-petha-subtle">from 2,800+ reviews</span>
          </div>
        </motion.div>

        {/* Review masonry grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.id}
              initial={prefersReduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="break-inside-avoid"
            >
              <div className="bg-white rounded-2xl border border-petha-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                {/* Header row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${review.color} flex items-center justify-center font-jakarta text-xs font-bold flex-shrink-0`}>
                      {review.initials}
                    </div>
                    <div>
                      <p className="font-jakarta text-sm font-semibold text-petha-text">{review.name}</p>
                      <p className="font-jakarta text-xs text-petha-subtle">{review.city}</p>
                    </div>
                  </div>
                  {review.verified && (
                    <span className="flex items-center gap-1 text-[10px] font-jakarta font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>

                <StarRating rating={review.rating} />

                <p className="font-jakarta text-sm text-petha-subtle leading-relaxed mt-3">
                  &ldquo;{review.text}&rdquo;
                </p>

                <p className="font-jakarta text-xs text-petha-amber font-medium mt-4">
                  Purchased: {review.product}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-14"
        >
          {/* Google Reviews badge simulation */}
          <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-xl border border-petha-border shadow-sm">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <div>
              <div className="flex items-center gap-1">
                <StarRating rating={5} />
                <span className="font-mono text-sm font-bold text-petha-text ml-1">4.9</span>
              </div>
              <p className="font-jakarta text-[10px] text-petha-subtle">Google Reviews</p>
            </div>
          </div>
          <span className="font-jakarta text-sm text-petha-subtle">|</span>
          <p className="font-jakarta text-sm text-petha-subtle">
            Rated <strong className="text-petha-text">#1 Petha Brand</strong> by customers on Google Shopping
          </p>
        </motion.div>
      </div>
    </section>
  )
}
