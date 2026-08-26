"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion, useInView } from "framer-motion"
import { useRef } from "react"
import { HttpTypes } from "@medusajs/types"
import { CATEGORIES, CategoryConfig } from "@lib/config/categories"

type CategoryStripProps = {
  categories: HttpTypes.StoreProductCategory[]
  countryCode: string
}

const CIRCULAR_CHIPS = [
  { label: "Classic Petha", emoji: "🍬", handle: "petha", img: "/hero_petha_square.webp" },
  { label: "Agra Dalmoth", emoji: "🫘", handle: "dalmoth", img: "/images/dalmoth.webp" },
  { label: "Special Namkeen", emoji: "🥜", handle: "namkeen", img: "/images/namkeen.webp" },
  { label: "Gift Hampers", emoji: "🎁", handle: "store", img: "/gift_box_hero.webp" },
  { label: "All Sweets", emoji: "✨", handle: "store", img: "/hero_image.webp" },
]

const CATEGORY_META: Record<string, { emoji: string; tagline: string; exploreLabel: string; badge: string }> = {
  petha:   { emoji: "🍬", tagline: "Melt-in-Mouth Agra Petha", exploreLabel: "Explore 12+ Varieties", badge: "AUTHENTIC AGRA" },
  namkeen: { emoji: "🥜", tagline: "Crispy, Spiced & Fresh", exploreLabel: "Explore Fresh Batches", badge: "CRISPY FRESH" },
  dalmoth: { emoji: "🫘", tagline: "Traditional Cashew Dalmoth", exploreLabel: "Agra Signature Snack", badge: "ROYAL AGRA" },
}

export default function CategoryStrip({ countryCode }: CategoryStripProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const prefersReduced = useReducedMotion()
  const cats: CategoryConfig[] = Object.values(CATEGORIES)

  return (
    <section className="py-8 lg:py-12 bg-[#FCFAF6] border-b border-amber-100/60" aria-label="Shop by category">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">

        {/* Circular quick chips bar (Mobile + Desktop) */}
        <div className="mb-6 pb-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-start sm:justify-center gap-4 sm:gap-8 min-w-max px-2">
            {CIRCULAR_CHIPS.map((chip, idx) => (
              <Link
                key={chip.label}
                href={chip.handle === "store" ? `/${countryCode}/products` : `/${countryCode}/categories/${chip.handle}`}
                className="flex flex-col items-center gap-2 group text-center"
              >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 border-2 border-amber-300 group-hover:border-petha-amber bg-white shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200 overflow-hidden">
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <Image
                      src={chip.img}
                      alt={chip.label}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
                <span className="font-jakarta text-xs font-semibold text-slate-800 group-hover:text-petha-amber transition-colors flex items-center gap-1">
                  <span>{chip.emoji}</span>
                  {chip.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Section Header */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          ref={ref}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10"
        >
          <div>
            <span className="font-jakarta text-xs uppercase tracking-[0.2em] text-petha-amber font-bold inline-block px-3 py-1 rounded-full bg-amber-100/70">
              Curated Collections
            </span>
            <h2 className="font-cormorant text-4xl lg:text-5xl font-semibold text-slate-900 mt-2 leading-tight">
              Explore by Sweet &amp; Snack Type
            </h2>
          </div>
          <Link
            href={`/${countryCode}/products`}
            className="mt-4 sm:mt-0 font-jakarta text-sm font-bold text-petha-amber hover:text-petha-saffron underline-offset-4 hover:underline flex items-center gap-1.5"
          >
            View All Products
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
            </svg>
          </Link>
        </motion.div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
          {cats.map((cat, i) => {
            const meta = CATEGORY_META[cat.handle] ?? { emoji: "✨", tagline: "Agra Specialty", exploreLabel: "Explore Collection", badge: "SPECIAL" }
            return (
              <motion.div
                key={cat.handle}
                initial={prefersReduced ? false : { opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={`/${countryCode}/categories/${cat.handle}`}
                  id={`cat-${cat.handle}`}
                  className="group block relative overflow-hidden rounded-3xl bg-white border border-amber-100/80 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300"
                  aria-label={`Shop ${cat.displayName}`}
                >
                  {/* Image container */}
                  <div className="relative aspect-[4/4.8] overflow-hidden bg-amber-50">
                    <Image
                      src={cat.imageSrc || "/hero_image.webp"}
                      alt={cat.displayName}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                    />
                    
                    {/* Dark/Warm gradient for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/25 to-transparent" />

                    {/* Top Tag */}
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-slate-800 shadow-sm">
                      {meta.badge}
                    </div>

                    {/* Category Details at Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                      <span className="block font-jakarta text-xs font-semibold text-amber-200 mb-1">
                        {meta.tagline}
                      </span>
                      <div className="flex items-end justify-between">
                        <div>
                          <h3 className="font-cormorant text-3xl font-bold text-white leading-tight">
                            {cat.displayName}
                          </h3>
                          <span className="inline-block mt-1 font-jakarta text-xs font-semibold text-amber-300">
                            {meta.exploreLabel} →
                          </span>
                        </div>
                        
                        <div className="w-10 h-10 rounded-full bg-petha-amber group-hover:bg-petha-saffron text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-200 flex-shrink-0">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
