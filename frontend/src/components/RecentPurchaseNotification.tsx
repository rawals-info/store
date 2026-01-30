"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star } from "lucide-react"

interface ReviewNotification {
  id: string
  city: string
  name: string
  productName: string
  rating: number
  reviewSnippet: string
}

// Indian cities for notifications
const indianCities = [
  "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata",
  "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Agra",
  "Chandigarh", "Indore", "Surat", "Nagpur", "Hyderabad"
]

// Indian first names with last initial
const customerNames = [
  "Priya S.", "Rahul M.", "Anjali K.", "Amit P.", "Neha R.",
  "Vikram T.", "Pooja G.", "Sanjay B.", "Kavita D.", "Rohit V.",
  "Meera J.", "Arun C.", "Divya N.", "Karan A.", "Sunita L."
]

// Product names
const productNames = [
  "Kesar Dry Petha", "Angoori Petha", "Paan Petha",
  "Chocolate Petha", "Taj Classic Petha", "Special Agra Dalmoth"
]

// Authentic-feeling review snippets
const reviewSnippets = [
  "Absolutely authentic taste, just like Agra!",
  "Fresh and delicious. Will order again.",
  "Perfect for gifting. Everyone loved it.",
  "The best petha I've had outside Agra.",
  "Excellent quality and packaging.",
  "Melt-in-mouth texture. Highly recommend.",
  "Arrived fresh and well-packed.",
  "True to the traditional taste.",
  "My family's new favorite sweet.",
  "Worth every rupee. Premium quality."
]

// Generate review notification
const generateReview = (): ReviewNotification => {
  const city = indianCities[Math.floor(Math.random() * indianCities.length)]
  const name = customerNames[Math.floor(Math.random() * customerNames.length)]
  const product = productNames[Math.floor(Math.random() * productNames.length)]
  const review = reviewSnippets[Math.floor(Math.random() * reviewSnippets.length)]
  // Ratings between 4-5 stars (satisfied customers)
  const rating = Math.random() > 0.3 ? 5 : 4

  return {
    id: Date.now().toString(),
    city,
    name,
    productName: product,
    rating,
    reviewSnippet: review
  }
}

export default function RecentPurchaseNotification() {
  const [notification, setNotification] = useState<ReviewNotification | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show first notification after 8 seconds
    const initialTimer = setTimeout(() => {
      showNotification()
    }, 8000)

    // Then show a new notification every 25-40 seconds (less frequent)
    const interval = setInterval(() => {
      showNotification()
    }, Math.random() * 15000 + 25000)

    return () => {
      clearTimeout(initialTimer)
      clearInterval(interval)
    }
  }, [])

  const showNotification = () => {
    const newNotification = generateReview()
    setNotification(newNotification)
    setIsVisible(true)

    // Hide after 7 seconds
    setTimeout(() => {
      setIsVisible(false)
    }, 7000)
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && notification && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto z-50 sm:max-w-sm"
        >
          <div className="bg-white rounded border border-luxury-charcoal/10 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-luxury-ivory px-4 py-2 border-b border-luxury-charcoal/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-medium text-luxury-charcoal/80 uppercase tracking-wide">
                  Verified Review
                </span>
              </div>
              <button
                onClick={handleClose}
                className="text-luxury-charcoal/40 hover:text-luxury-charcoal/60 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < notification.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                  />
                ))}
              </div>

              {/* Review text */}
              <p className="text-sm text-luxury-charcoal leading-relaxed mb-3">
                "{notification.reviewSnippet}"
              </p>

              {/* Customer info */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-luxury-charcoal">
                    {notification.name}
                  </p>
                  <p className="text-[11px] text-luxury-charcoal/50">
                    {notification.city} · {notification.productName}
                  </p>
                </div>
              </div>
            </div>

            {/* Subtle progress bar */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 7, ease: "linear" }}
              className="h-0.5 bg-luxury-gold/40"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
