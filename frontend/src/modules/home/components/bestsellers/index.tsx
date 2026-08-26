"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion, useInView } from "framer-motion"
import { useRef, useState, useMemo } from "react"
import { HttpTypes } from "@medusajs/types"
import ProductPreviewRating from "@modules/products/components/product-preview/rating-client"
import QuickBuyModal from "@components/QuickBuyModal"
import { getProductPrice } from "@lib/util/get-product-price"
import { formatIndianPrice } from "@lib/util/money"

type BestsellerProps = {
  products: any[]
  countryCode: string
  region: HttpTypes.StoreRegion | null
}

const BADGE_CONFIG = [
  { label: "BESTSELLER", bg: "bg-amber-600 text-white" },
  { label: "AGRA SPECIAL", bg: "bg-amber-800 text-white" },
  { label: "TOP RATED", bg: "bg-emerald-700 text-white" },
  { label: "FRESH BATCH", bg: "bg-slate-800 text-white" },
]

function CommercialProductCard({
  product,
  index,
  countryCode,
  region,
}: {
  product: any
  index: number
  countryCode: string
  region: HttpTypes.StoreRegion | null
}) {
  const prefersReduced = useReducedMotion()
  const badge = BADGE_CONFIG[index % BADGE_CONFIG.length]
  const [quickBuyOpen, setQuickBuyOpen] = useState(false)

  // Compute lowest starting price and original price dynamically
  const { cheapestPrice, cheapestVariant } = getProductPrice({ product })
  
  let priceAmount = cheapestPrice?.calculated_price_number || 0
  let originalPrice = cheapestPrice?.original_price_number || 0

  if (priceAmount === 0 && cheapestVariant) {
    priceAmount = Number(cheapestVariant.calculated_price?.calculated_amount || cheapestVariant.prices?.[0]?.amount || 0)
    originalPrice = priceAmount * 1.2
  }

  if (originalPrice <= priceAmount && priceAmount > 0) {
    originalPrice = priceAmount * 1.2
  }

  const discountPercent = originalPrice > priceAmount && priceAmount > 0
    ? Math.round(((originalPrice - priceAmount) / originalPrice) * 100)
    : 15

  return (
    <>
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, delay: (index % 4) * 0.05 }}
        className="group bg-white rounded-3xl border border-amber-100/80 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
      >
        {/* Top Image area */}
        <div className="relative">
          <Link href={`/${countryCode}/products/${product.handle}`} className="block relative aspect-square overflow-hidden bg-amber-50/30">
            {/* Promo Badge */}
            <div className={`absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full text-[10px] font-jakarta font-bold uppercase tracking-wider ${badge.bg} shadow-sm`}>
              {badge.label}
            </div>

            {/* Veg Symbol */}
            <div className="absolute top-3 right-3 z-10 w-5 h-5 rounded-md bg-white border border-emerald-600 flex items-center justify-center shadow-sm" title="100% Pure Vegetarian">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            </div>

            {/* Product Image */}
            <Image
              src={product.thumbnail || "/hero_image.webp"}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/hero_image.webp" }}
            />
          </Link>
        </div>

        {/* Product Details */}
        <div className="p-3 sm:p-5 flex flex-col flex-1 justify-between">
          <div>
            {/* Ratings & reviews */}
            <div className="mb-1.5 flex items-center justify-between gap-1">
              <ProductPreviewRating productId={product.id} />
              <span className="text-[9px] sm:text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded-full font-jakarta whitespace-nowrap">
                ⚡ 24h Air Ship
              </span>
            </div>

            {/* Title */}
            <Link href={`/${countryCode}/products/${product.handle}`}>
              <h3 className="font-cormorant text-base sm:text-2xl font-bold text-slate-900 line-clamp-2 h-[2.5rem] sm:h-auto group-hover:text-petha-amber transition-colors leading-tight sm:leading-snug">
                {product.title}
              </h3>
            </Link>

            {/* Description / Weight - desktop only to save vertical room on mobile */}
            <p className="hidden sm:block font-jakarta text-xs text-slate-500 mt-1 mb-2 line-clamp-1">
              {product.description || "Authentic Agra specialty handcrafted with pure ingredients."}
            </p>
          </div>

          {/* Price & Add to Cart row */}
          <div className="pt-2 sm:pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
            <div className="flex flex-col min-w-0 flex-1">
              {priceAmount > 0 ? (
                <>
                  <div className="font-mono text-sm sm:text-lg font-bold text-slate-900 leading-tight">
                    ₹{formatIndianPrice(priceAmount)}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                    {originalPrice > priceAmount && (
                      <span className="font-mono text-[10px] sm:text-xs text-slate-400 line-through">
                        ₹{formatIndianPrice(originalPrice)}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="text-[9px] sm:text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded font-jakarta whitespace-nowrap">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <span className="text-xs font-bold text-petha-amber font-jakarta">
                  View Options
                </span>
              )}
            </div>

            {/* Direct Commercial "+ ADD" Button */}
            <button
              type="button"
              onClick={() => setQuickBuyOpen(true)}
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-petha-amber hover:bg-petha-saffron text-white font-jakarta text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-0.5 sm:gap-1 shadow-sm hover:shadow transition-all duration-200 cursor-pointer active:scale-95 flex-shrink-0"
            >
              <span className="text-sm font-black leading-none">+</span>
              <span>ADD</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick Buy Modal */}
      {region && (
        <QuickBuyModal
          product={product}
          region={region}
          isOpen={quickBuyOpen}
          onClose={() => setQuickBuyOpen(false)}
        />
      )}
    </>
  )
}

export default function Bestsellers({ products, countryCode, region }: BestsellerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const prefersReduced = useReducedMotion()
  const [activeTab, setActiveTab] = useState<string>("all")

  // Filter products by active tab
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return []
    if (activeTab === "all") return products
    
    return products.filter((p) => {
      const title = (p.title || "").toLowerCase()
      const handle = (p.handle || "").toLowerCase()
      
      if (activeTab === "petha") {
        return title.includes("petha") || handle.includes("petha")
      }
      if (activeTab === "namkeen") {
        return title.includes("namkeen") || title.includes("dalmoth") || handle.includes("namkeen") || handle.includes("dalmoth")
      }
      if (activeTab === "gift") {
        return title.includes("gift") || title.includes("box") || title.includes("combo") || handle.includes("gift") || handle.includes("combo")
      }
      return true
    })
  }, [products, activeTab])

  if (!products || products.length === 0) return null

  const tabs = [
    { id: "all", label: `All Sweets (${products.length})`, emoji: "✨" },
    { id: "petha", label: "Petha Specials", emoji: "🍬" },
    { id: "namkeen", label: "Namkeen & Dalmoth", emoji: "🥜" },
    { id: "gift", label: "Gift Packs", emoji: "🎁" },
  ]

  return (
    <section className="py-16 lg:py-24 bg-[#FFFDF9] border-b border-amber-100/60" aria-label="Authentic Products Catalog">
      <div className="max-w-7xl mx-auto px-5 lg:px-10" ref={ref}>
        
        {/* Section Header */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-jakarta text-xs uppercase tracking-[0.2em] text-petha-amber font-bold inline-block px-3 py-1 rounded-full bg-amber-100/80">
                Fresh Agra Kitchen Batches
              </span>
              <span className="font-jakarta text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Dispatches in 24 hrs
              </span>
            </div>
            <h2 className="font-cormorant text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              Order Authentic Agra Sweets &amp; Snacks
            </h2>
            <p className="font-jakarta text-sm text-slate-600 mt-1.5 max-w-xl">
              Freshly made in small batches with pure cane sugar, Kashmiri saffron, and premium nuts. Vacuum-sealed for 30-day freshness.
            </p>
          </div>

          <Link
            href={`/${countryCode}/products`}
            className="font-jakarta text-xs font-bold text-petha-amber hover:text-petha-saffron flex items-center gap-1.5 uppercase tracking-wider"
          >
            Browse Full Store ({products.length}) →
          </Link>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-jakarta font-bold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-700 hover:bg-amber-50 border border-amber-200/70"
              }`}
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid — 2 cols mobile, 3 tablet, 4 desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {(filteredProducts.length > 0 ? filteredProducts : products).map((product, index) => (
            <CommercialProductCard
              key={product.id || index}
              product={product}
              index={index}
              countryCode={countryCode}
              region={region}
            />
          ))}
        </div>

        {/* Bottom Trust CTA Strip */}
        <div className="mt-12 p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-100/40 to-amber-500/10 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📦</span>
            <div>
              <p className="font-jakarta text-sm font-bold text-slate-900">
                100% Damage-Proof Airtight Packaging
              </p>
              <p className="font-jakarta text-xs text-slate-600">
                Packed with food-grade moisture absorbers to guarantee fresh taste upon delivery.
              </p>
            </div>
          </div>
          <Link
            href={`/${countryCode}/products`}
            className="px-6 py-3 rounded-full bg-petha-amber hover:bg-petha-saffron text-white font-jakarta text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex-shrink-0"
          >
            Order Now →
          </Link>
        </div>
      </div>
    </section>
  )
}
