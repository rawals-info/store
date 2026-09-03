"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles, CheckCircle2, Copy, ArrowRight, ShieldCheck, Gift } from "lucide-react"
import { usePromotion } from "@lib/context/promotion-context"

const PILL_DISMISS_KEY = "taj_gift_pill_dismissed"

export default function DiscountPopup() {
  const { activePromo } = usePromotion()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPillVisible, setIsPillVisible] = useState(true)
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")
  const [copied, setCopied] = useState(false)

  const promoCode = activePromo?.code || "TAJ10"
  const discountPercent = activePromo?.discountPercent || 10

  // Check if user previously dismissed the floating pill permanently
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PILL_DISMISS_KEY)
      if (stored) {
        const { expiry } = JSON.parse(stored)
        if (Date.now() < expiry) {
          setIsPillVisible(false)
        }
      }
    } catch {}
  }, [])

  const handleDismissPill = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsPillVisible(false)
    try {
      // Hide pill for 7 days
      const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000
      localStorage.setItem(PILL_DISMISS_KEY, JSON.stringify({ expiry }))
    } catch {}
  }

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
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
          _subject: `🎉 New Discount Subscriber (${discountPercent}% OFF)!`,
          _template: "table",
          _captcha: "false",
          source: "Floating Gift Pill Offer",
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
    <>
      {/* 1. NON-INTRUSIVE FLOATING GIFT PILL (Always accessible, never blocks screen) */}
      <AnimatePresence>
        {isPillVisible && !isModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-40 font-jakarta"
          >
            <div
              onClick={() => setIsModalOpen(true)}
              role="button"
              tabIndex={0}
              aria-label={`Unlock ${discountPercent}% discount offer`}
              className="group relative flex items-center gap-2.5 pl-3.5 pr-2.5 py-2 rounded-full bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white shadow-[0_6px_24px_rgba(180,83,9,0.35)] hover:shadow-[0_8px_30px_rgba(180,83,9,0.5)] border border-amber-300/50 hover:border-amber-200 transition-all duration-300 cursor-pointer active:scale-95"
            >
              {/* Subtle Pulsing Ping Glow */}
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-200" />
              </span>

              {/* Gift Icon & Label */}
              <div className="flex items-center gap-1.5">
                <span className="text-base group-hover:rotate-12 transition-transform duration-200">🎁</span>
                <span className="text-xs font-extrabold tracking-wide text-amber-50">
                  Get <strong className="text-amber-200 font-black">{discountPercent}% OFF</strong>
                </span>
              </div>

              {/* Dismiss button on the pill */}
              <button
                type="button"
                onClick={handleDismissPill}
                className="w-5 h-5 ml-1 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                aria-label="Dismiss discount badge"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. RICH REVEAL MODAL (Triggered ONLY on intentional user click) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs font-jakarta">
            {/* Backdrop Click to Close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative w-full sm:max-w-md bg-[#FAF8F5] border border-amber-200/90 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden z-10"
            >
              {/* Top Accent Strip */}
              <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700" />

              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                aria-label="Close offer modal"
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 border border-amber-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer shadow-2xs"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-6 sm:p-7">
                {status !== "success" ? (
                  <div>
                    {/* Offer Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300/80 text-amber-900 text-xs font-bold mb-3 shadow-2xs">
                      <Gift className="w-3.5 h-3.5 text-amber-700" />
                      <span>Exclusive First-Order Offer</span>
                    </div>

                    {/* Heading */}
                    <h3 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-2">
                      Get {discountPercent}% OFF Your First Agra Sweets Box
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed mb-5">
                      Enter your email to reveal your instant coupon for authentic Agra Petha &amp; gourmet Dalmoth dispatch.
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
                          className="w-full px-4 py-3 rounded-xl bg-white border border-amber-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-xs"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-75 active:scale-98"
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

                    {/* Direct Code Reveal Shortcut */}
                    <div className="mt-4 pt-4 border-t border-amber-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Already have code?</span>
                      <button
                        type="button"
                        onClick={() => setStatus("success")}
                        className="text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer"
                      >
                        Reveal {promoCode} Code →
                      </button>
                    </div>

                    {/* Trust Footer */}
                    <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Zero spam
                      </span>
                      <span>&bull;</span>
                      <span>Instant coupon reveal</span>
                    </div>
                  </div>
                ) : (
                  /* Success State */
                  <div className="text-center py-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto mb-3 text-emerald-600 shadow-2xs">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>

                    <h3 className="font-cormorant text-2xl font-bold text-slate-900 mb-1">
                      Your {discountPercent}% OFF Code Is Ready!
                    </h3>
                    <p className="text-xs text-slate-600 mb-5">
                      Use this code during checkout to apply your discount.
                    </p>

                    {/* Coupon Display Box */}
                    <div className="p-4 bg-white border-2 border-dashed border-amber-300 rounded-2xl mb-5 flex items-center justify-between shadow-2xs">
                      <div className="text-left">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Coupon Code
                        </div>
                        <div className="font-mono text-xl font-extrabold text-amber-700 tracking-wider">
                          {promoCode}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
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
                      type="button"
                      onClick={handleCloseModal}
                      className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <span>Continue Shopping</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
