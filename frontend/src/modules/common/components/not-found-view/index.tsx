"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Search, Home, ShoppingBag, ArrowRight, Sparkles, MapPin, MessageCircle, Phone, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

const POPULAR_CATEGORIES = [
  { label: "Classic Petha", href: "/in/products?category=petha", emoji: "🍬" },
  { label: "Agra Dalmoth", href: "/in/products?category=dalmoth", emoji: "🫘" },
  { label: "Crispy Namkeen", href: "/in/products?category=namkeen", emoji: "🥜" },
  { label: "Gift Hampers", href: "/in/products", emoji: "🎁" },
  { label: "City Express Delivery", href: "/in/city", emoji: "⚡" },
]

export default function NotFoundView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [recommendations, setRecommendations] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch("/api/products/popular?limit=3&countryCode=in")
      .then((res) => res.json())
      .then((data) => {
        if (data?.products) {
          setRecommendations(data.products)
        }
      })
      .catch((err) => console.error("Error loading 404 recommendations:", err))
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/in/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="relative min-h-[85vh] bg-[#FAF8F5] flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
        
        {/* Floating Playful Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 font-jakarta text-xs font-bold shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-petha-amber animate-pulse" />
          <span>Looks like this sweet box went missing!</span>
        </motion.div>

        {/* 404 Royal Number with Sweet Aesthetic */}
        <div className="space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-cormorant text-8xl sm:text-9xl font-bold text-slate-900 tracking-tight leading-none"
          >
            4<span className="text-petha-amber italic font-serif">0</span>4
          </motion.h1>
          <h2 className="font-cormorant text-2xl sm:text-4xl font-bold text-slate-800">
            Page Not Found in the Sweet Kitchen
          </h2>
          <p className="font-jakarta text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
            The page you are looking for may have been moved or is fresh out of the kitchen. Let&apos;s get you back to the finest Agra sweets!
          </p>
        </div>

        {/* Live Search Bar */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-xl mx-auto relative flex items-center bg-white rounded-2xl border border-amber-200/90 shadow-lg p-2 focus-within:ring-2 focus-within:ring-petha-amber/40 transition-all"
        >
          <Search className="w-5 h-5 text-amber-600 ml-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search sweets (e.g. Kesar Petha, Dalmoth, Masala Peanuts)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-sm font-jakarta text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-petha-amber hover:bg-petha-saffron text-white font-jakarta text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer flex-shrink-0"
          >
            Find Sweets
          </button>
        </motion.form>

        {/* Quick Category Chips */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-jakarta block">
            Popular Sweet Categories
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {POPULAR_CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-amber-50 border border-amber-200 text-xs font-bold text-slate-700 hover:text-petha-amber font-jakarta shadow-xs transition-all"
              >
                <span>{cat.emoji} {cat.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 3 Popular Delicacies Quick Recommendations */}
        {recommendations.length > 0 && (
          <div className="pt-6 border-t border-amber-100/80">
            <div className="flex items-center justify-between mb-4">
              <span className="font-cormorant text-xl font-bold text-slate-900">
                Fresh Agra Delicacies You Might Crave:
              </span>
              <Link
                href="/in/products"
                className="text-xs font-bold text-petha-amber hover:text-petha-saffron font-jakarta flex items-center gap-1"
              >
                <span>View All Menu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recommendations.map((item: any) => (
                <Link
                  key={item.id}
                  href={`/in/products/${item.handle}`}
                  className="group bg-white rounded-2xl p-3 border border-amber-100/90 shadow-sm hover:shadow-md hover:border-amber-300 transition-all flex items-center gap-3 text-left"
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-amber-50 border border-amber-100 flex-shrink-0">
                    <Image
                      src={item.thumbnail || "/hero_image.webp"}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-petha-amber uppercase block font-jakarta">
                      Fresh Batch
                    </span>
                    <h4 className="font-cormorant text-base font-bold text-slate-900 truncate">
                      {item.title}
                    </h4>
                    <span className="font-mono text-xs font-bold text-slate-800">
                      {item.priceFormatted || `₹${item.price}`}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/in"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-jakarta text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/in/products"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-petha-amber hover:bg-petha-saffron text-white font-jakarta text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore All Sweets</span>
          </Link>
        </div>

        {/* Support Pill */}
        <p className="text-xs text-slate-500 font-jakarta pt-2">
          Need assistance or placing a bulk order?{" "}
          <Link href="/in/contact" className="font-bold text-petha-amber hover:underline">
            Contact Taj Petha Concierge
          </Link>
        </p>
      </div>
    </div>
  )
}
