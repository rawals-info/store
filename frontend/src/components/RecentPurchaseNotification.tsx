"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag } from "lucide-react"

interface PurchaseNotification {
  id: string
  city: string
  productName: string
  timeAgo: string
}

// Indian cities for realistic notifications
const indianCities = [
  "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", 
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
  "Agra", "Kanpur", "Nagpur", "Indore", "Surat", "Bhopal", "Vadodara", "Indore", "Chandigarh", "Jaipur", "Raipur", "Rajasthan"
]

// Sample product names
const productNames = [
  "Kesar Dry Petha", "Angoori Petha", "Paan Petha", "Chocolate Petha","Taj Classic Petha", "Kesar Angoori Petha", "Special Agra Dalmoth", "Masala Peanuts"
]

// Generate random notification
const generateNotification = (): PurchaseNotification => {
  const city = indianCities[Math.floor(Math.random() * indianCities.length)]
  const product = productNames[Math.floor(Math.random() * productNames.length)]
  const timeOptions = ["2 minutes ago", "5 minutes ago", "10 minutes ago", "15 minutes ago", "just now", "Today", "1 hour ago", "2 hours ago", "3 hours ago", "4 hours ago", "5 hours ago", "6 hours ago", "7 hours ago", "8 hours ago", "9 hours ago", "10 hours ago", "11 hours ago", "12 hours ago", "13 hours ago", "14 hours ago", "15 hours ago", "16 hours ago", "17 hours ago", "18 hours ago"]
  const time = timeOptions[Math.floor(Math.random() * timeOptions.length)]
  
  return {
    id: Date.now().toString(),
    city,
    productName: product,
    timeAgo: time
  }
}

export default function RecentPurchaseNotification() {
  const [notification, setNotification] = useState<PurchaseNotification | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show first notification after 5 seconds
    const initialTimer = setTimeout(() => {
      showNotification()
    }, 5000)

    // Then show a new notification every 15-25 seconds
    const interval = setInterval(() => {
      showNotification()
    }, Math.random() * 10000 + 15000) // 15-25 seconds

    return () => {
      clearTimeout(initialTimer)
      clearInterval(interval)
    }
  }, [])

  const showNotification = () => {
    const newNotification = generateNotification()
    setNotification(newNotification)
    setIsVisible(true)

    // Hide after 6 seconds
    setTimeout(() => {
      setIsVisible(false)
    }, 6000)
  }

  return (
    <AnimatePresence>
      {isVisible && notification && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: -50 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 50, x: -50 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto z-50 sm:max-w-sm"
        >
          <div className="bg-white rounded-lg shadow-2xl border border-luxury-gold/20 p-3 sm:p-4 backdrop-blur-sm">
            <div className="flex items-start gap-2 sm:gap-3">
              {/* Icon - Smaller on mobile */}
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              
              {/* Content - Mobile optimized */}
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-luxury-charcoal mb-0.5 sm:mb-1">
                  Someone in {notification.city} just purchased
                </p>
                <p className="text-[11px] sm:text-xs text-luxury-charcoal/70 font-medium truncate">
                  {notification.productName}
                </p>
                <p className="text-[10px] sm:text-xs text-luxury-charcoal/50 mt-0.5 sm:mt-1">
                  {notification.timeAgo}
                </p>
              </div>
              
              {/* Pulse indicator */}
              <div className="flex-shrink-0">
                <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-green-500"></span>
                </span>
              </div>
            </div>
            
            {/* Progress bar */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 6, ease: "linear" }}
              className="h-0.5 bg-gradient-to-r from-luxury-gold to-green-500 mt-3 rounded-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

