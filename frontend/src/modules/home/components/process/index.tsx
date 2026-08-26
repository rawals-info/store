"use client"

import { motion, useReducedMotion, useInView } from "framer-motion"
import { useRef } from "react"

const STEPS = [
  {
    num: "01",
    badge: "Sourcing",
    title: "Farm Fresh Gourd",
    desc: "Plump ash gourds hand-harvested every morning from certified organic farms around the Yamuna belt in Agra.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21m-6.364-6.364l1.06 1.06M6.343 17.657l1.06 1.06m0-13.414l-1.06 1.06m13.414 13.414l-1.06-1.06" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    num: "02",
    badge: "Slow Cooking",
    title: "Heritage Brass Woks",
    desc: "Slow simmered in brass kadhais with pure cane syrup, real Kashmiri saffron (Kesar), and natural kewra essence.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
      </svg>
    ),
  },
  {
    num: "03",
    badge: "Protection",
    title: "Aroma-Lock Sealing",
    desc: "Individually packed in airtight food-grade vacuum pouches within hours of preparation to retain 100% juicy freshness.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
  },
  {
    num: "04",
    badge: "Pan-India",
    title: "Express Fresh Dispatch",
    desc: "Packed in sturdy protective gift boxes and dispatched same day with end-to-end courier tracking across India.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
]

export default function Process() {
  const prefersReduced = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: "-60px" })

  return (
    <section
      id="process-section"
      ref={sectionRef}
      className="py-20 lg:py-28 bg-[#FAF8F5] border-y border-amber-900/5 relative overflow-hidden"
      aria-label="Our purity and preparation process"
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-10 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="font-jakarta text-xs uppercase tracking-[0.2em] text-petha-amber font-bold inline-block px-3 py-1 rounded-full bg-amber-100/60 mb-3">
            Pure Agra Purity
          </span>
          <h2 className="font-cormorant text-4xl lg:text-5xl font-semibold text-slate-900 leading-tight">
            How Authentic Petha is Made Fresh Daily
          </h2>
          <p className="font-jakarta text-sm text-slate-600 mt-3">
            From the fertile farms of Agra directly to your dining table in 4 meticulous quality steps.
          </p>
        </motion.div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={prefersReduced ? false : { opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Card Top Row */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/60 text-petha-amber flex items-center justify-center group-hover:bg-petha-amber group-hover:text-white transition-colors duration-300">
                    {step.icon}
                  </div>
                  <span className="font-mono text-2xl font-bold text-amber-200 group-hover:text-petha-amber transition-colors">
                    {step.num}
                  </span>
                </div>

                <span className="inline-block text-[11px] font-bold font-jakarta uppercase tracking-wider text-petha-amber mb-1.5">
                  {step.badge}
                </span>
                <h3 className="font-cormorant text-2xl font-semibold text-slate-900 mb-2 leading-tight">
                  {step.title}
                </h3>
                <p className="font-jakarta text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Bottom decorative bar */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-700 font-jakarta">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                100% Quality Checked
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
