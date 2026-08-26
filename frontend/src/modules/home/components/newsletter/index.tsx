"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const prefersReduced = useReducedMotion()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      setStatus("error")
      return
    }
    setStatus("loading")
    // Simulate submission — replace with real integration
    setTimeout(() => {
      setStatus("success")
      setEmail("")
    }, 1200)
  }

  const WHATSAPP_URL = `https://wa.me/919259418994?text=${encodeURIComponent(
    "Hi Taj Petha! I'd like to know more about your products. 🙏"
  )}`

  return (
    <section className="py-8 lg:py-12 bg-petha-warm border-t border-petha-border" aria-label="Newsletter and contact">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Left: Email subscribe */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
          >
            <span className="font-jakarta text-xs uppercase tracking-[0.2em] text-petha-amber font-semibold">
              Join the Sweet Life
            </span>
            <h2 className="font-cormorant text-3xl lg:text-4xl font-semibold text-petha-text mt-2 mb-2 leading-tight">
              Get 10% Off Your First Order
            </h2>
            <p className="font-jakarta text-sm text-petha-subtle mb-6 leading-relaxed">
              Subscribe for exclusive offers, new arrivals, and sweet updates. No spam — ever.
            </p>

            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 px-5 py-4 bg-green-50 border border-green-200 rounded-xl"
              >
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-jakarta text-sm font-semibold text-green-800">You&apos;re subscribed! 🎉</p>
                  <p className="font-jakarta text-xs text-green-600 mt-0.5">Check your email for your 10% off coupon.</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} id="newsletter-form" className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    id="newsletter-email"
                    name="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); if (status === "error") setStatus("idle") }}
                    placeholder="Enter your email"
                    required
                    className={`w-full px-4 py-3.5 rounded-xl border font-jakarta text-sm text-petha-text placeholder:text-petha-subtle/60 bg-white focus:outline-none focus:ring-2 transition-all duration-200 ${
                      status === "error"
                        ? "border-red-300 focus:ring-red-200"
                        : "border-petha-border focus:ring-petha-amber/30 focus:border-petha-amber"
                    }`}
                  />
                  {status === "error" && (
                    <p className="absolute -bottom-5 left-0 font-jakarta text-xs text-red-500">Please enter a valid email</p>
                  )}
                </div>
                <motion.button
                  type="submit"
                  id="newsletter-submit"
                  disabled={status === "loading"}
                  whileHover={prefersReduced ? {} : { scale: 1.03 }}
                  whileTap={prefersReduced ? {} : { scale: 0.97 }}
                  className="px-6 py-3.5 rounded-xl bg-petha-amber text-white font-jakarta font-semibold text-sm hover:bg-petha-saffron transition-colors disabled:opacity-60 flex-shrink-0 shadow-sm"
                >
                  {status === "loading" ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : "Subscribe"}
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Right: WhatsApp CTA */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <div className="bg-white rounded-2xl border border-petha-border p-8 shadow-sm flex flex-col sm:flex-row gap-6 items-center">
              {/* WhatsApp icon */}
              <div className="w-16 h-16 rounded-2xl bg-[#25D366] flex items-center justify-center flex-shrink-0 shadow-md">
                <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-cormorant text-xl font-semibold text-petha-text mb-1">
                  Chat with Us Instantly
                </h3>
                <p className="font-jakarta text-sm text-petha-subtle mb-4 leading-relaxed">
                  Questions about orders, bulk enquiries, custom gifting? We reply within minutes.
                </p>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" id="newsletter-whatsapp-cta">
                  <motion.span
                    whileHover={prefersReduced ? {} : { scale: 1.03 }}
                    whileTap={prefersReduced ? {} : { scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white font-jakarta font-semibold text-sm hover:bg-[#20BA5A] transition-colors cursor-pointer shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Chat on WhatsApp
                  </motion.span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
