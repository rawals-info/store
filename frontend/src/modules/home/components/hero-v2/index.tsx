"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion, AnimatePresence } from "framer-motion"

const TRUST_PILLS = [
  { icon: "🌱", label: "100% Vegetarian" },
  { icon: "🛡️", label: "FSSAI Certified" },
  { icon: "📦", label: "Same-Day Dispatch" },
  { icon: "⭐", label: "4.8★ Rated" },
]

const WORDS = ["Heritage", "Legend", "Freshness", "Tradition"]

export default function HeroV2({ countryCode }: { countryCode: string }) {
  const prefersReduced = useReducedMotion()
  const [wordIdx, setWordIdx] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setWordIdx(i => (i + 1) % WORDS.length)
    }, 2500)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  const shopLink = `/${countryCode}/products`

  return (
    <section
      className="relative w-full bg-[#FAF8F5] overflow-hidden flex items-center pt-24 lg:pt-32 pb-16 lg:pb-24"
      aria-label="Hero section — Taj Petha"
    >
      {/* Warm ambient glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 65% 55% at 50% 30%, rgba(217,119,6,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-10 w-full">
        <div className="grid lg:grid-cols-[55%_45%] gap-12 lg:gap-8 items-center w-full">

          {/* LEFT: Commercial Pitch & CTAs */}
          <div className="flex flex-col">
            {/* Eyebrow badge */}
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-2 mb-5"
            >
              <span className="px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200/60 font-jakarta text-xs uppercase tracking-wider text-petha-amber font-bold flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                Fresh Batch Made Daily in Agra
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={prefersReduced ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-cormorant text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-4"
            >
              Taste the Authentic
              <br />
              <span className="relative inline-block text-petha-amber">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIdx}
                    initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.35 }}
                    className="inline-block"
                  >
                    {WORDS[wordIdx]}
                  </motion.span>
                </AnimatePresence>
              </span>
              {" "}of Agra Petha
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="font-jakarta text-base lg:text-lg text-slate-600 max-w-lg leading-relaxed mb-6"
            >
              Melt-in-mouth Agra Petha, fresh crispy namkeen &amp; royal Dalmoth crafted with pure ingredients and vacuum-sealed for doorstep delivery across India in 24–48 hours.
            </motion.p>

            {/* Trust pills */}
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.4 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {TRUST_PILLS.map(p => (
                <span
                  key={p.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-amber-200/60 text-xs font-jakarta font-semibold text-slate-700 shadow-sm"
                >
                  <span>{p.icon}</span>
                  {p.label}
                </span>
              ))}
            </motion.div>

            {/* High-Converting CTAs */}
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3.5"
            >
              <Link href={shopLink} id="hero-shop-cta">
                <motion.span
                  whileHover={prefersReduced ? {} : { scale: 1.03 }}
                  whileTap={prefersReduced ? {} : { scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-petha-amber text-white font-jakarta font-bold text-sm tracking-wide shadow-lg hover:bg-petha-saffron transition-all duration-200 cursor-pointer"
                >
                  Order Fresh Sweets Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.span>
              </Link>

              <Link href={`/${countryCode}/categories/petha`} id="hero-explore-cta">
                <motion.span
                  whileHover={prefersReduced ? {} : { scale: 1.02 }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white border-2 border-amber-300 text-slate-800 font-jakarta font-bold text-sm tracking-wide hover:border-petha-amber hover:text-petha-amber transition-all duration-200 cursor-pointer shadow-sm"
                >
                  Explore Petha Varieties
                </motion.span>
              </Link>
            </motion.div>
          </div>

          {/* RIGHT: Hero Image Card Showcase */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.3 }}
            className="relative"
          >
            {/* Visual Frame */}
            <div className="relative w-full aspect-[4/3.8] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-amber-50">
              <Image
                src="/hero_image.webp"
                alt="Fresh authentic Agra Petha collection"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
                quality={90}
              />
              
              {/* Bottom gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Purity Guarantee Badge */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-lg border border-amber-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl">
                    🍬
                  </div>
                  <div>
                    <p className="font-jakarta text-xs font-bold text-slate-900">Agra GI-Tagged Authentic Petha</p>
                    <p className="font-jakarta text-[11px] text-emerald-700 font-semibold">100% Pure &amp; Naturally Preserved</p>
                  </div>
                </div>

                <Link
                  href={shopLink}
                  className="px-3.5 py-1.5 rounded-xl bg-petha-amber hover:bg-petha-saffron text-white font-jakarta text-xs font-bold transition-colors"
                >
                  Shop →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
