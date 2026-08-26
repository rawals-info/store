"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, MapPin, Zap, ShieldCheck, Truck, Sparkles, ChevronRight, Star, Award, HeartHandshake } from "lucide-react"
import { CityDeliveryInfo } from "@lib/seo"
import QuickBuyModal from "@components/QuickBuyModal"
import { motion, AnimatePresence } from "framer-motion"

import Breadcrumb from "@modules/common/components/breadcrumb"

interface CityDirectoryClientProps {
  cities: CityDeliveryInfo[]
  countryCode: string
  products: any[]
}

const REGIONS = ["All Cities", "North", "South", "West", "East", "Central"] as const

export default function CityDirectoryClient({
  cities,
  countryCode,
  products,
}: CityDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState<string>("All Cities")
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const [quickBuyOpen, setQuickBuyOpen] = useState(false)

  const filteredCities = useMemo(() => {
    return cities.filter((city) => {
      const matchesSearch =
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.popularAreas.some((area) =>
          area.toLowerCase().includes(searchQuery.toLowerCase())
        )

      const matchesRegion =
        selectedRegion === "All Cities" || city.region === selectedRegion

      return matchesSearch && matchesRegion
    })
  }, [cities, searchQuery, selectedRegion])

  const handleOpenQuickBuy = (product: any) => {
    setSelectedProduct(product)
    setQuickBuyOpen(true)
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[{ label: "Express Delivery Locations", isCurrent: true }]}
        countryCode={countryCode}
        className="bg-white/90"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/70 via-white to-[#FAF8F5] py-14 sm:py-20 border-b border-amber-100/60">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial from-amber-200/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/80 border border-amber-300/60 text-amber-900 text-xs font-bold font-jakarta shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-petha-amber animate-pulse" />
            <span>Direct Express Air Freight from Agra to 200+ Cities</span>
          </div>

          <h1 className="font-cormorant text-4xl sm:text-6xl font-bold text-slate-900 leading-tight">
            Fresh Authentic Agra Petha Delivered to{" "}
            <span className="text-petha-amber italic font-serif">Your City</span>
          </h1>

          <p className="font-jakarta text-slate-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Handcrafted daily in our traditional Agra kitchens with 100% pure ash gourd, real Kashmiri saffron, and zero preservatives. Shipped in food-grade vacuum freshness packs with express delivery across India.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto pt-4">
            <div className="relative flex items-center bg-white rounded-2xl shadow-lg border border-amber-200/80 p-2 focus-within:ring-2 focus-within:ring-petha-amber/40 transition-all">
              <Search className="w-5 h-5 text-amber-600 ml-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by city (e.g., Hyderabad, Mumbai, Bangalore, Pune, Delhi)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm sm:text-base font-jakarta text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mr-2 text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-100 px-2 py-1 rounded-lg"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Region Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {REGIONS.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-jakarta transition-all cursor-pointer ${
                  selectedRegion === region
                    ? "bg-slate-900 text-white shadow-md scale-105"
                    : "bg-white text-slate-600 border border-amber-200/60 hover:bg-amber-50"
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* City Directory Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-cormorant text-3xl font-bold text-slate-900">
              {selectedRegion === "All Cities" ? "All Major Cities Served" : `${selectedRegion} India Delivery Hubs`}
            </h2>
            <p className="font-jakarta text-xs text-slate-500 mt-1">
              Showing {filteredCities.length} express delivery locations
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold font-jakarta">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            24–48h Air Delivery Active
          </span>
        </div>

        {filteredCities.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-amber-100 shadow-sm max-w-xl mx-auto space-y-4">
            <MapPin className="w-12 h-12 text-amber-500 mx-auto" />
            <h3 className="font-cormorant text-2xl font-bold text-slate-900">
              City Not in Quick List?
            </h3>
            <p className="font-jakarta text-sm text-slate-600">
              We deliver to <strong>all 28 States and 19,000+ PIN Codes</strong> across India! You can still order any sweet, and our automated courier network will deliver to your exact PIN code.
            </p>
            <Link
              href={`/${countryCode}/products`}
              className="inline-block px-6 py-3 rounded-xl bg-petha-amber text-white font-jakarta text-sm font-bold shadow-md hover:bg-petha-saffron transition-colors"
            >
              Shop All Sweets for India Delivery →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.map((city) => (
              <motion.div
                key={city.slug}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                className="group bg-white rounded-3xl p-6 border border-amber-100/90 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-petha-amber bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full font-jakarta">
                      <Zap className="w-3 h-3 text-petha-amber" />
                      {city.deliveryTime}
                    </span>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                      {city.rating} ({city.ordersCount})
                    </span>
                  </div>

                  {/* City Name & State */}
                  <Link
                    href={`/${countryCode}/city/${city.slug}`}
                    className="block group-hover:text-petha-amber transition-colors"
                  >
                    <h3 className="font-cormorant text-2xl font-bold text-slate-900 leading-tight">
                      {city.name}
                    </h3>
                    <p className="font-jakarta text-xs text-slate-500 font-semibold mt-0.5">
                      {city.state} • {city.pinCodesCount}
                    </p>
                  </Link>

                  {/* Tagline */}
                  <p className="font-jakarta text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                    {city.tagline}
                  </p>

                  {/* Popular Neighborhoods Pill Cloud */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-jakarta block mb-2">
                      Popular Hubs Served:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {city.popularAreas.slice(0, 5).map((area) => (
                        <span
                          key={area}
                          className="text-[11px] font-jakarta bg-slate-50 text-slate-700 border border-slate-200/60 px-2 py-0.5 rounded-md"
                        >
                          {area}
                        </span>
                      ))}
                      {city.popularAreas.length > 5 && (
                        <span className="text-[11px] font-jakarta text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-md font-semibold">
                          +{city.popularAreas.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom CTA Link */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/${countryCode}/city/${city.slug}`}
                    className="inline-flex items-center gap-1.5 font-jakarta text-xs font-bold text-slate-900 group-hover:text-petha-amber transition-colors"
                  >
                    <span>View {city.name} Delivery Details</span>
                    <ChevronRight className="w-4 h-4 text-petha-amber group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href={`/${countryCode}/products?category=petha`}
                    className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    Order Petha →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Delicacies for Nationwide Order */}
      {products && products.length > 0 && (
        <section className="bg-white py-16 border-t border-b border-amber-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <span className="font-jakarta text-xs uppercase tracking-widest text-petha-amber font-bold">
                  Agra's Bestselling Delicacies
                </span>
                <h2 className="font-cormorant text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
                  Popular Sweets Air-Shipped Across India Daily
                </h2>
              </div>
              <Link
                href={`/${countryCode}/products`}
                className="font-jakarta text-sm font-bold text-petha-amber hover:text-petha-saffron flex items-center gap-1 w-fit"
              >
                <span>View Full Menu</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {products.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  className="bg-[#FFFDF9] rounded-3xl p-4 sm:p-5 border border-amber-100/90 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-amber-50/50 border border-amber-100">
                      <Image
                        src={product.thumbnail || "/hero_image.webp"}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-emerald-600 text-white font-jakarta text-[10px] font-bold shadow-xs">
                        ⚡ 24h Air Ship
                      </span>
                    </div>

                    <div>
                      <h3 className="font-cormorant text-lg sm:text-xl font-bold text-slate-900 line-clamp-1">
                        {product.title}
                      </h3>
                      <p className="font-jakarta text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {product.description || "Authentic traditional Agra recipe"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between">
                    <span className="font-mono text-base sm:text-lg font-bold text-slate-900">
                      ₹{product.variants?.[0]?.calculated_price?.calculated_amount || 249}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenQuickBuy(product)}
                      className="px-3.5 py-1.5 rounded-xl bg-petha-amber hover:bg-petha-saffron text-white font-jakarta text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust & Nationwide Delivery Guarantee Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="font-jakarta text-xs uppercase tracking-widest text-petha-amber font-bold">
            The Taj Petha Guarantee
          </span>
          <h2 className="font-cormorant text-3xl sm:text-4xl font-bold text-slate-900">
            How Fresh Agra Sweets Reach Your City in Pristine Condition
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/80 flex items-center justify-center text-petha-amber">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-cormorant text-xl font-bold text-slate-900">
              1. Daily Fresh Batches
            </h3>
            <p className="font-jakarta text-xs text-slate-600 leading-relaxed">
              Every order is prepared and packed the same morning in Agra using 100% natural ash gourd and pure ingredients.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/80 flex items-center justify-center text-petha-amber">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-cormorant text-xl font-bold text-slate-900">
              2. Food-Grade Vacuum Seal
            </h3>
            <p className="font-jakarta text-xs text-slate-600 leading-relaxed">
              Our 3-layer multi-barrier packaging locks in moisture and natural aroma while locking out air and contaminants.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/80 flex items-center justify-center text-petha-amber">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-cormorant text-xl font-bold text-slate-900">
              3. Express Air Cargo
            </h3>
            <p className="font-jakarta text-xs text-slate-600 leading-relaxed">
              Partnered with top air freight carriers for 24-48 hour delivery to metro hubs and tier 1/2 cities across India.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/80 flex items-center justify-center text-petha-amber">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-cormorant text-xl font-bold text-slate-900">
              4. 100% Safe Delivery Guarantee
            </h3>
            <p className="font-jakarta text-xs text-slate-600 leading-relaxed">
              Full transit protection. If any package arrives damaged, our support team replaces it immediately with no hassle.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Buy Modal */}
      {selectedProduct && (
        <QuickBuyModal
          product={selectedProduct}
          isOpen={quickBuyOpen}
          onClose={() => setQuickBuyOpen(false)}
        />
      )}
    </div>
  )
}
