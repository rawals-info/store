"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles, CheckCircle2, Copy, ArrowRight, ShieldCheck, Gift } from "lucide-react"
import { usePromotion } from "@lib/context/promotion-context"

const STORAGE_KEY = "taj_offer_popup_dismissed"
const DISMISS_DAYS = 14

export default function DiscountPopup() {
  const { activePromo } = usePromotion()
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")
  const [copied, setCopied] = useState(false)

  const promoCode = activePromo?.code || "TAJ10"
  const discountPercent = activePromo?.discountPercent || 10

  const handleDismiss = useCallback(() => {
    setIsOpen(false)
    try {
      const expiry = Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ expiry }))
    } catch {
      // safe fallback
    }
  }, [])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const { expiry } = JSON.parse(stored)
        if (Date.now() < expiry) {
          return // User already dismissed or subscribed recently
        }
      }
    } catch {
      // safe fallback
    }

    let hasTriggered = false

    const triggerPopup = () => {
      if (hasTriggered) return
      hasTriggered = true
      setIsOpen(true)
    }

    // 1. Timer trigger: 12 seconds
    const timer = setTimeout(() => {
      triggerPopup()
    }, 12000)

    // 2. Scroll trigger: 45% page depth
    const handleScroll = () => {
      if (hasTriggered) return
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0 && scrollY / docHeight > 0.45) {
        triggerPopup()
      }
    }

    // 3. Desktop Exit-Intent
    const handleMouseLeave = (e: MouseEvent) => {
      if (hasTriggered) return
      if (e.clientY <= 10 && window.innerWidth > 768) {
        triggerPopup()
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) return

    setStatus("loading")

    try {
      await fetch("https://formsubmit.co/ajax/support@tajpetha.in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          _subject: `🎉 New Discount Popup Subscriber (${discountPercent}% OFF)!`,
          _template: "table",
          _captcha: "false",
          source: "Welcome Offer Popup",
          promo_revealed: promoCode,
          subscribed_at: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        }),
      })
    } catch {
      // Non-blocking fallback
    }

    setStatus("success")
    try {
      localStorage.setItem("taj_applied_discount_code", promoCode)
    } catch {}
  }

  const handleCopyCode = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(promoCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
          
          {/* Backdrop Click to Close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="absolute inset-0"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative w-full sm:max-w-lg bg-[#FAF8F5] border border-amber-200/80 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden z-10"
          >
            {/* Top Amber Accent Strip */}
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700" />

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              aria-label="Close offer modal"
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 border border-amber-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 sm:p-8">
              {status !== "success" ? (
                <div>
                  {/* Offer Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300/80 text-amber-900 text-xs font-bold font-jakarta mb-3">
                    <Gift className="w-3.5 h-3.5 text-amber-700" />
                    <span>Exclusive First-Order Offer</span>
                  </div>

                  {/* Heading */}
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-2">
                    Get {discountPercent}% OFF Your First Agra Sweets Box
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-slate-600 font-jakarta leading-relaxed mb-6">
                    Enter your email to unlock instant savings on authentic Agra Petha &amp; gourmet Dalmoth, delivered fresh to your doorstep.
                  </p>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address..."
                        className="w-full px-4 py-3.5 rounded-xl bg-white border border-amber-200 text-slate-900 placeholder:text-slate-400 text-sm font-jakarta focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-jakarta font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-75"
                    >
                      {status === "loading" ? (
                        <span>Unlocking Code...</span>
                      ) : (
                        <>
                          <span>Claim {discountPercent}% OFF Now</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Trust Footer */}
                  <div className="mt-4 flex items-center justify-center gap-3 text-[11px] text-slate-500 font-jakarta">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Zero spam
                    </span>
                    <span>&bull;</span>
                    <span>Instant coupon reveal</span>
                    <span>&bull;</span>
                    <button
                      onClick={handleDismiss}
                      className="underline hover:text-slate-800 cursor-pointer"
                    >
                      No thanks
                    </button>
                  </div>
                </div>
              ) : (
                /* Success State */
                <div className="text-center py-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto mb-3 text-emerald-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-slate-900 mb-1">
                    Your {discountPercent}% OFF Code Is Ready!
                  </h3>
                  <p className="text-xs text-slate-600 font-jakarta mb-5">
                    Use this code during checkout to apply your discount.
                  </p>

                  {/* Coupon Display Box */}
                  <div className="p-4 bg-white border-2 border-dashed border-amber-300 rounded-2xl mb-5 flex items-center justify-between">
                    <div className="text-left">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-jakarta">
                        Coupon Code
                      </div>
                      <div className="font-mono text-xl font-extrabold text-amber-700 tracking-wider">
                        {promoCode}
                      </div>
                    </div>

                    <button
                      onClick={handleCopyCode}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold font-jakarta flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    onClick={handleDismiss}
                    className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-jakarta font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Shop Fresh Agra Sweets Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
