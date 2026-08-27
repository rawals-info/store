"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles, Truck, Award, Copy, Check, Flame, ShieldCheck, ChevronRight } from "lucide-react"
import CountdownTimer from "@components/CountdownTimer"
import { usePromotion } from "@lib/context/promotion-context"
import { STORE_PROMOTION } from "@lib/config/promotions"

interface BannerItem {
  id: string
  icon: React.ReactNode
  text: string
  code?: string | null
  discount?: number
}

export default function PromotionalBanner() {
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeMobileIndex, setActiveMobileIndex] = useState(0)
  const { activePromo } = usePromotion()

  // Dynamic promotion from Medusa backend / central store config (NO hardcoding)
  const promoCode = activePromo?.code || (STORE_PROMOTION.enabled && STORE_PROMOTION.code ? STORE_PROMOTION.code : null)
  const promoDiscount = activePromo?.discountPercent || (STORE_PROMOTION.enabled && STORE_PROMOTION.discountPercent ? STORE_PROMOTION.discountPercent : 0)

  // Initialize dismissed state from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return
    const dismissed = localStorage.getItem("promotional-banner-dismissed") === "true"
    setBannerDismissed(dismissed)
  }, [])

  const handleBannerDismiss = () => {
    setBannerDismissed(true)
    if (typeof window !== "undefined") {
      localStorage.setItem("promotional-banner-dismissed", "true")
      window.dispatchEvent(new CustomEvent("bannerDismissed"))
    }
  }

  const handleShowBanner = () => {
    setBannerDismissed(false)
    if (typeof window !== "undefined") {
      localStorage.removeItem("promotional-banner-dismissed")
      window.dispatchEvent(new CustomEvent("bannerShown"))
    }
  }

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!promoCode) return
    navigator.clipboard.writeText(promoCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2400)
  }

  // Dynamic list of promotional items with icons and highlights (NO hardcoding)
  const bannerItems: BannerItem[] = useMemo(() => {
    const items: BannerItem[] = [
      {
        id: "shipping",
        icon: <Truck className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />,
        text: "Free Express Shipping on Orders Above ₹500",
      },
    ]

    if (promoCode && promoDiscount > 0) {
      items.push({
        id: "promo",
        icon: <Sparkles className="w-3.5 h-3.5 text-amber-300 flex-shrink-0 animate-pulse" />,
        text: `Use code ${promoCode} for ${promoDiscount}% OFF your order`,
        code: promoCode,
        discount: promoDiscount,
      })
    }

    items.push(
      {
        id: "authentic",
        icon: <Award className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />,
        text: "100% Authentic Agra Petha & Gourmet Dalmoth",
      },
      {
        id: "freshness",
        icon: <ShieldCheck className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />,
        text: "Handcrafted Fresh Daily in Agra — Delivered Nationwide",
      },
      {
        id: "dispatch",
        icon: <Flame className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />,
        text: "Same-Day Dispatch for orders placed before 2 PM IST",
      }
    )

    return items
  }, [promoCode, promoDiscount])

  // Mobile cycling highlights
  const mobileHighlights = useMemo(() => {
    const highlights = [
      {
        id: "timer",
        icon: (
          <span className="relative flex h-2 w-2 mr-0.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
        ),
        content: (
          <div className="flex items-center gap-1.5 font-jakarta text-[11px] font-semibold text-white">
            <span className="text-amber-200 font-bold uppercase tracking-wider text-[9.5px]">Cutoff:</span>
            <CountdownTimer className="text-[10.5px]" />
          </div>
        ),
      },
      {
        id: "shipping",
        icon: <Truck className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />,
        content: (
          <span className="font-jakarta text-[11px] font-medium text-white">
            <strong className="text-amber-200 font-bold">Free Express Shipping</strong> on ₹500+
          </span>
        ),
      },
    ]

    if (promoCode && promoDiscount > 0) {
      highlights.push({
        id: "promo",
        icon: <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse flex-shrink-0" />,
        content: (
          <div className="flex items-center gap-1 font-jakarta text-[11px] font-medium text-white">
            <span>{promoDiscount}% OFF</span>
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1 bg-amber-400/25 hover:bg-amber-400/40 active:scale-95 border border-amber-300/40 text-amber-100 font-mono font-bold px-1.5 py-0.5 rounded text-[10.5px] transition-all cursor-pointer shadow-sm ml-1"
              title="Tap to copy code"
            >
              {copied ? (
                <>
                  <Check className="w-2.5 h-2.5 text-emerald-300" />
                  <span className="text-emerald-300 font-semibold">COPIED</span>
                </>
              ) : (
                <>
                  <span>{promoCode}</span>
                  <Copy className="w-2.5 h-2.5 opacity-70" />
                </>
              )}
            </button>
          </div>
        ),
      })
    }

    highlights.push({
      id: "authentic",
      icon: <Award className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />,
      content: (
        <span className="font-jakarta text-[11px] font-medium text-white truncate max-w-[200px] xs:max-w-[240px]">
          100% Authentic Agra Petha & Dalmoth
        </span>
      ),
    })

    return highlights
  }, [promoCode, promoDiscount, copied])

  const totalMobileItems = mobileHighlights.length

  // Auto cycle mobile items every 3.8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMobileIndex((prev) => (prev + 1) % totalMobileItems)
    }, 3800)
    return () => clearInterval(timer)
  }, [totalMobileItems])

  // Advance to next highlight on mobile tap
  const handleMobileNext = useCallback(() => {
    setActiveMobileIndex((prev) => (prev + 1) % totalMobileItems)
  }, [totalMobileItems])

  return (
    <>
      {/* Main Luxury Announcement Bar */}
      <AnimatePresence>
        {!bannerDismissed && (
          <motion.div
            className="fixed top-0 inset-x-0 z-[50] h-12 bg-gradient-to-r from-[#341202] via-[#742b08] to-[#341202] text-white flex items-center overflow-hidden border-b border-amber-400/25 shadow-md select-none"
            initial={{ y: -48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -48, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Subtle Luxury Golden Ambient Shimmer Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent pointer-events-none" />

            <div className="relative w-full px-2.5 sm:px-5 lg:px-8 flex items-center justify-between max-w-screen-2xl mx-auto h-full">
              {/* Left: Fresh Batch Dispatch Cutoff Pill (Desktop & Tablet) */}
              <div className="hidden lg:flex items-center gap-2.5 flex-shrink-0 bg-black/25 hover:bg-black/35 transition-colors border border-amber-300/30 rounded-full py-1 px-3 backdrop-blur-sm shadow-inner">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>

                <div className="flex items-center gap-1.5 text-white font-jakarta">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-200">
                    Fresh Dispatch Cutoff:
                  </span>
                  <CountdownTimer />
                </div>
              </div>

              {/* Center Marquee on Desktop (Never resets on hover, pauses seamlessly) */}
              <div className="taj-marquee-container hidden md:flex flex-1 overflow-hidden mx-3 lg:mx-6 h-full items-center relative">
                <div className="animate-taj-marquee flex items-center gap-8">
                  {[0, 1].map((copyIndex) => (
                    <div key={copyIndex} className="flex items-center gap-8 flex-shrink-0">
                      {bannerItems.map((item, itemIdx) => (
                        <div
                          key={`${copyIndex}-${itemIdx}`}
                          className="flex items-center gap-2 font-jakarta text-xs text-white/95 font-medium hover:text-white transition-colors flex-shrink-0"
                        >
                          <div className="p-1 rounded-full bg-amber-500/20 border border-amber-400/20 flex-shrink-0">
                            {item.icon}
                          </div>

                          {"code" in item && item.code ? (
                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                              <span>Use code</span>
                              <button
                                onClick={handleCopyCode}
                                className="inline-flex items-center gap-1 bg-amber-400/20 hover:bg-amber-400/35 border border-amber-300/40 text-amber-100 hover:text-white font-mono font-bold px-1.5 py-0.5 rounded text-[11px] shadow-sm transition-all cursor-pointer group"
                                title="Click to copy promo code"
                              >
                                {copied ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-300" />
                                    <span className="text-emerald-300">COPIED!</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="tracking-wider">{String(item.code)}</span>
                                    <Copy className="w-2.5 h-2.5 opacity-70 group-hover:opacity-100" />
                                  </>
                                )}
                              </button>
                              <span>for {String(item.discount)}% OFF</span>
                            </div>
                          ) : (
                            <span className="whitespace-nowrap">{item.text}</span>
                          )}

                          <span className="text-amber-300/40 text-sm ml-4">•</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile / Small Screens View: Interactive Micro Pill Card with Auto-cycling animation */}
              <div
                onClick={handleMobileNext}
                className="md:hidden flex-1 flex items-center justify-center overflow-hidden py-1 px-1 cursor-pointer select-none active:scale-[0.99] transition-transform"
                title="Tap to view next highlight"
              >
                <div className="inline-flex items-center justify-center bg-black/20 hover:bg-black/30 border border-amber-300/25 rounded-full px-2.5 py-1 backdrop-blur-md shadow-inner max-w-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeMobileIndex}
                      initial={{ opacity: 0, y: 7, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -7, scale: 0.98 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="flex items-center gap-1.5 text-center min-w-0"
                    >
                      <div className="p-0.5 rounded-full bg-amber-500/25 flex-shrink-0">
                        {mobileHighlights[activeMobileIndex]?.icon}
                      </div>
                      {mobileHighlights[activeMobileIndex]?.content}
                    </motion.div>
                  </AnimatePresence>

                  {/* Micro indicator dots for mobile cycling */}
                  <div className="flex items-center gap-0.5 ml-2 opacity-60">
                    {mobileHighlights.map((_, idx) => (
                      <span
                        key={idx}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          idx === activeMobileIndex ? "w-2.5 bg-amber-300" : "w-1 bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Close / Dismiss Button */}
              <button
                onClick={handleBannerDismiss}
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-white/80 hover:text-white flex items-center justify-center transition-all duration-200 flex-shrink-0 cursor-pointer border border-white/10 ml-1.5"
                aria-label="Dismiss promotional banner"
                title="Dismiss banner"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Offer Pill when banner is dismissed */}
      <AnimatePresence>
        {bannerDismissed && (
          <motion.button
            onClick={handleShowBanner}
            className="fixed top-2 sm:top-2.5 left-1/2 -translate-x-1/2 z-[45] bg-gradient-to-r from-[#5c2409] via-[#8c3b0d] to-[#5c2409] hover:from-[#732f0c] hover:to-[#732f0c] text-white text-[11px] font-jakarta font-bold px-3.5 py-1.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 border border-amber-300/40 cursor-pointer whitespace-nowrap backdrop-blur-md"
            initial={{ y: -25, x: "-50%", opacity: 0, scale: 0.8 }}
            animate={{ y: 0, x: "-50%", opacity: 1, scale: 1 }}
            exit={{ y: -25, x: "-50%", opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.04, x: "-50%" }}
            whileTap={{ scale: 0.96, x: "-50%" }}
            aria-label="Show royal sweet offers"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: "6s" }} />
            <span>
              {promoCode ? `Special Offers • Code: ${promoCode}` : "Royal Sweet Offers"}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
