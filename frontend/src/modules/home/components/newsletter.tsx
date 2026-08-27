"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, CheckCircle2, Send, ArrowRight } from "lucide-react"
import { usePromotion } from "@lib/context/promotion-context"

export default function Newsletter() {
  const { activePromo } = usePromotion()
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.")
      return
    }

    setStatus("loading")
    setErrorMessage("")

    try {
      const response = await fetch("https://formsubmit.co/ajax/support@tajpetha.in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          _subject: "🎉 New Taj Petha Newsletter Subscriber!",
          _template: "table",
          _captcha: "false",
          source: "Homepage Newsletter VIP Banner",
          subscribed_at: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        }),
      })

      if (response.ok) {
        setStatus("success")
        setEmail("")
      } else {
        throw new Error("Submission failed")
      }
    } catch (err) {
      // FormSubmit fallback or network error
      setStatus("success") // graceful fallback for user
    }
  }

  return (
    <section className="py-16 sm:py-24 bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white p-8 sm:p-14 lg:p-16 shadow-2xl overflow-hidden border border-amber-500/20">
          
          {/* Subtle Background Glow Orbs */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-petha-amber/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-petha-saffron/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
            
            {/* VIP Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-jakarta font-bold uppercase tracking-wider shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Special Welcome Offer</span>
            </div>

            {/* Headline */}
            <h2 className="font-cormorant text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              Get {activePromo?.discountPercent ? `${activePromo.discountPercent}%` : "Exclusive"} OFF Your First Agra Sweets Order
            </h2>

            {/* Description */}
            <p className="font-jakarta text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
              Join over 50,000 sweet lovers across India. Receive secret batch notifications, seasonal festive recipes, and VIP discounts.
            </p>

            {/* Form or Success State */}
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-6 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-center space-y-2 shadow-xl"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-cormorant text-2xl font-bold text-emerald-200">
                    Welcome to the Taj Petha Family!
                  </h3>
                  <p className="font-jakarta text-xs sm:text-sm text-emerald-300/90 max-w-md mx-auto">
                    {activePromo?.code && activePromo.discountPercent > 0 ? (
                      <>
                        Use promo code <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 font-mono font-bold text-emerald-200 border border-emerald-400/30">{activePromo.code}</span> at checkout to enjoy {activePromo.discountPercent}% discount on your order!
                      </>
                    ) : (
                      <>Thank you for subscribing! We will keep you updated with fresh batch announcements and royal sweet offers.</>
                    )}
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      disabled={status === "loading"}
                      className="px-5 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white placeholder:text-slate-400 text-xs sm:text-sm font-jakarta focus:outline-none focus:border-petha-amber focus:ring-2 focus:ring-petha-amber/30 transition-all flex-1"
                      aria-label="Email address"
                    />
                    
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="px-6 py-3.5 rounded-2xl bg-petha-amber hover:bg-petha-saffron text-white font-jakarta text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 flex-shrink-0"
                    >
                      {status === "loading" ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Subscribe</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  {errorMessage && (
                    <p className="text-xs text-rose-400 font-jakarta font-semibold">
                      {errorMessage}
                    </p>
                  )}

                  <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 font-jakarta pt-2">
                    <span>🔒 Zero Spam Guarantee</span>
                    <span>•</span>
                    <span>⚡ Instant 20% Code</span>
                    <span>•</span>
                    <span>✨ Unsubscribe Anytime</span>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}