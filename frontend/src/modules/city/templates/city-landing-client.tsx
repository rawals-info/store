"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { CityDeliveryInfo } from "@lib/seo"
import { trackCityPageView } from "@lib/analytics/google-analytics"
import { getProductPrice } from "@lib/util/get-product-price"
import { formatIndianPrice } from "@lib/util/money"
import { STORE_PROMOTION, calculateDiscountedPrice } from "@lib/config/promotions"
import { MapPin, Zap, ShieldCheck, Truck, Sparkles, ChevronRight, Star, Award, HeartHandshake, CheckCircle2, HelpCircle, ChevronDown, PackageCheck, Flame } from "lucide-react"
import QuickBuyModal from "@components/QuickBuyModal"
import { motion, AnimatePresence } from "framer-motion"

import Breadcrumb from "@modules/common/components/breadcrumb"

interface CityLandingClientProps {
  city: CityDeliveryInfo
  allCities: CityDeliveryInfo[]
  countryCode: string
  products: any[]
}

export default function CityLandingClient({
  city,
  allCities,
  countryCode,
  products,
}: CityLandingClientProps) {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const [quickBuyOpen, setQuickBuyOpen] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  useEffect(() => {
    if (city?.name) {
      trackCityPageView(city.name, city.region)
    }
  }, [city?.name, city?.region])

  const handleOpenQuickBuy = (product: any) => {
    setSelectedProduct(product)
    setQuickBuyOpen(true)
  }

  const otherCities = allCities.filter((c) => c.slug !== city.slug)

  const cityFaqs = [
    {
      q: `Do you deliver fresh authentic Agra Petha to ${city.name}?`,
      a: `Yes! We air-ship daily batches directly from our traditional Agra kitchens across all ${city.pinCodesCount} in ${city.name}, including ${city.popularAreas.slice(0, 4).join(", ")}, and surrounding areas.`
    },
    {
      q: `What is the delivery time for orders in ${city.name}?`,
      a: `Orders to ${city.name} arrive within ${city.deliveryTime}. All orders placed before 2 PM are freshly vacuum-packed and handed over to express air couriers the same afternoon.`
    },
    {
      q: `How does the petha stay fresh during transit to ${city.name}?`,
      a: `Every sweet is packed in food-grade 3-layer vacuum multi-barrier sealed packaging that seals in moisture and natural taste without any preservatives or artificial stabilizers. It stays fresh for up to 30 days.`
    },
    {
      q: `Is there free delivery available in ${city.name}?`,
      a: `Yes! We offer FREE Shipping to ${city.name} on all orders above ₹500.${
        STORE_PROMOTION.enabled && STORE_PROMOTION.discountPercent > 0 && STORE_PROMOTION.code
          ? ` You can also use code ${STORE_PROMOTION.code} at checkout for an extra ${STORE_PROMOTION.discountPercent}% discount on your order.`
          : ""
      }`
    },
    {
      q: `What if my sweet box gets damaged in transit to ${city.name}?`,
      a: `We provide a 100% Safe Transit Guarantee. In the rare event of transit damage, simply WhatsApp our support team with your order ID within 48 hours for an instant replacement.`
    }
  ]

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: "Delivery Locations", href: `/${countryCode}/city` },
          { label: city.name, isCurrent: true },
        ]}
        countryCode={countryCode}
        className="bg-white/90"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/80 via-white to-[#FAF8F5] py-12 sm:py-20 border-b border-amber-100/60">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Heading & Localized Info */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-300/60 text-amber-900 text-xs font-bold font-jakarta shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-petha-amber" />
                <span>Express Doorstep Delivery in {city.name} ({city.state})</span>
              </div>

              <h1 className="font-cormorant text-4xl sm:text-6xl font-bold text-slate-900 leading-tight">
                Authentic Agra Petha & Dalmoth Delivered to{" "}
                <span className="text-petha-amber italic font-serif">{city.name}</span>
              </h1>

              <p className="font-jakarta text-slate-600 text-base sm:text-lg leading-relaxed">
                Craving the legendary melt-in-mouth taste of real Agra Petha? We prepare daily batches in our Agra master kitchens and express air-freight them directly to your doorstep in <strong>{city.name}</strong> with sealed vacuum freshness.
              </p>

              {/* Delivery Badges & Promo Row */}
              <div className="flex flex-wrap gap-3 pt-1">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-emerald-200 shadow-xs text-xs font-bold text-emerald-800 font-jakarta">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <span>{city.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-amber-200 shadow-xs text-xs font-bold text-amber-900 font-jakarta">
                  <PackageCheck className="w-4 h-4 text-petha-amber" />
                  <span>{city.pinCodesCount} Covered</span>
                </div>
                {STORE_PROMOTION.enabled && STORE_PROMOTION.discountPercent > 0 && STORE_PROMOTION.code ? (
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600 text-white shadow-xs text-xs font-bold font-jakarta">
                    <Flame className="w-4 h-4 text-amber-200" />
                    <span>Use {STORE_PROMOTION.code} ({STORE_PROMOTION.discountPercent}% OFF)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-700 text-white shadow-xs text-xs font-bold font-jakarta">
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>100% Authentic Agra Recipe</span>
                  </div>
                )}
              </div>

              {/* Popular Neighborhoods */}
              <div className="pt-4 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-jakarta block">
                  Delivering Across All Major {city.name} Neighborhoods:
                </span>
                <div className="flex flex-wrap gap-2">
                  {city.popularAreas.map((area) => (
                    <span
                      key={area}
                      className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 font-jakarta shadow-xs"
                    >
                      📍 {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-xl space-y-6">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-amber-50 border border-amber-100 shadow-inner">
                  <Image
                    src="/hero_petha_square.webp"
                    alt={`Fresh Agra Petha delivery in ${city.name}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-600 text-white font-jakarta text-xs font-bold shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>GI Heritage Authenticity</span>
                  </div>
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm text-white font-mono text-xs font-bold">
                    {city.rating} ({city.ordersCount})
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 font-jakarta border-b border-slate-100 pb-3">
                    <span>Dispatch Origin:</span>
                    <span className="text-petha-amber">🏛️ Agra Heritage Kitchen</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 font-jakarta border-b border-slate-100 pb-3">
                    <span>Transit Mode:</span>
                    <span className="text-slate-900">✈️ Express Air Cargo</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 font-jakarta">
                    <span>Destination:</span>
                    <span className="text-emerald-700">🏠 Your {city.name} Doorstep</span>
                  </div>
                </div>

                <Link
                  href={`/${countryCode}/products?category=petha`}
                  className="w-full py-3.5 rounded-2xl bg-petha-amber hover:bg-petha-saffron text-white font-jakarta text-sm font-bold uppercase tracking-wider text-center block shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Order Fresh Petha for {city.name} →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Sweet Menu & Instant Quick Buy Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="font-jakarta text-xs uppercase tracking-widest text-petha-amber font-bold">
              Popular in {city.name}
            </span>
            <h2 className="font-cormorant text-3xl sm:text-5xl font-bold text-slate-900 mt-1">
              Top Agra Delicacies Ordered by {city.name} Residents
            </h2>
          </div>
          <Link
            href={`/${countryCode}/products`}
            className="font-jakarta text-sm font-bold text-petha-amber hover:text-petha-saffron flex items-center gap-1 w-fit"
          >
            <span>Explore All 15+ Varieties</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => {
            const { cheapestPrice } = getProductPrice({ product })
            const rawPrice = cheapestPrice?.calculated_price_number || product.variants?.[0]?.calculated_price?.calculated_amount || 249
            const { discountedPrice, isDiscounted, discountPercent } = calculateDiscountedPrice(rawPrice)

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl p-4 sm:p-5 border border-amber-100/90 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-amber-50/50 border border-amber-100">
                    <Image
                      src={product.thumbnail || "/hero_image.webp"}
                      alt={`${product.title} delivery in ${city.name}`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-emerald-600 text-white font-jakarta text-[10px] font-bold shadow-xs">
                      ⚡ 24h Air Ship
                    </span>
                    <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-md bg-white border border-emerald-600 flex items-center justify-center shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    </span>
                  </div>

                  <div>
                    <h3 className="font-cormorant text-lg sm:text-xl font-bold text-slate-900 line-clamp-2 leading-tight">
                      {product.title}
                    </h3>
                    <p className="font-jakarta text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {product.description || "Authentic traditional Agra recipe"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-mono text-sm sm:text-lg font-bold text-slate-900 leading-tight">
                      ₹{formatIndianPrice(discountedPrice)}
                    </span>
                    {isDiscounted && (
                      <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                        <span className="font-mono text-[10px] sm:text-xs text-slate-400 line-through">
                          ₹{formatIndianPrice(rawPrice)}
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded font-jakarta whitespace-nowrap">
                          {discountPercent}% OFF
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenQuickBuy(product)}
                    className="px-2.5 sm:px-3.5 py-1.5 rounded-full bg-petha-amber hover:bg-petha-saffron text-white font-jakarta text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer flex-shrink-0"
                  >
                    + Add
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Why Choose Section for This City */}
      <section className="py-16 bg-white border-t border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="font-jakarta text-xs uppercase tracking-widest text-petha-amber font-bold">
              The Royal Agra Standard
            </span>
            <h2 className="font-cormorant text-3xl sm:text-5xl font-bold text-slate-900">
              Why Sweet Lovers in {city.name} Choose Taj Petha
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FFFDF9] rounded-3xl p-8 border border-amber-100/90 shadow-sm space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100/90 flex items-center justify-center text-petha-amber">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="font-cormorant text-2xl font-bold text-slate-900">
                100% Traditional Agra Halwai Recipe
              </h3>
              <p className="font-jakarta text-sm text-slate-600 leading-relaxed">
                Handcrafted using heirloom recipes dating back to the Mughal era. Made with fresh ash gourd fruit, pure desi sugar syrup, and real Kashmiri saffron.
              </p>
            </div>

            <div className="bg-[#FFFDF9] rounded-3xl p-8 border border-amber-100/90 shadow-sm space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100/90 flex items-center justify-center text-petha-amber">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-cormorant text-2xl font-bold text-slate-900">
                0% Chemical Preservatives
              </h3>
              <p className="font-jakarta text-sm text-slate-600 leading-relaxed">
                Unlike mass-market supermarket sweets, our products contain no artificial sweeteners or preservatives. Pure, healthy, and 100% vegetarian.
              </p>
            </div>

            <div className="bg-[#FFFDF9] rounded-3xl p-8 border border-amber-100/90 shadow-sm space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100/90 flex items-center justify-center text-petha-amber">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="font-cormorant text-2xl font-bold text-slate-900">
                {city.deliveryTime} Express Air Freight
              </h3>
              <p className="font-jakarta text-sm text-slate-600 leading-relaxed">
                Direct air delivery ensures that the sweet box arriving at your door in {city.name} was made in Agra just hours earlier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* City FAQs Section */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-2">
          <span className="font-jakarta text-xs uppercase tracking-widest text-petha-amber font-bold">
            Frequently Asked Questions
          </span>
          <h2 className="font-cormorant text-3xl sm:text-4xl font-bold text-slate-900">
            Agra Petha Delivery in {city.name}
          </h2>
        </div>

        <div className="space-y-4">
          {cityFaqs.map((faq, index) => {
            const isOpen = openFaqIndex === index

            return (
              <div
                key={faq.q}
                className="bg-white rounded-2xl border border-amber-100 overflow-hidden shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-jakarta text-sm sm:text-base font-bold text-slate-900 hover:text-petha-amber transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-petha-amber" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-6 pb-5 font-jakarta text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </section>

      {/* Explore Other Delivery Cities */}
      <section className="py-14 bg-[#FBF9F5] border-t border-amber-100/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-cormorant text-2xl font-bold text-slate-900">
              Other Express Delivery Cities in India
            </h3>
            <Link
              href={`/${countryCode}/city`}
              className="text-xs font-bold text-petha-amber hover:text-petha-saffron font-jakarta"
            >
              View All 200+ Cities →
            </Link>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {otherCities.map((otherCity) => (
              <Link
                key={otherCity.slug}
                href={`/${countryCode}/city/${otherCity.slug}`}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-amber-200/70 text-xs font-bold text-slate-700 hover:text-petha-amber hover:border-amber-400 font-jakarta shadow-xs transition-colors"
              >
                📍 {otherCity.name} ({otherCity.deliveryTime})
              </Link>
            ))}
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
