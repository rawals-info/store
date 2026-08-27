"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"

const STATS = [
  { target: 50000, suffix: "+", label: "Happy Customers", prefix: "" },
  { target: 4.9, suffix: "★", label: "Avg. Rating", prefix: "", decimals: 1 },
  { target: 100, suffix: "%", label: "Pure Vegetarian", prefix: "" },
  { target: 24, suffix: "hr", label: "Fresh Dispatch", prefix: "" },
  { target: 12, suffix: "+", label: "Authentic Varieties", prefix: "" },
]

function CountUp({ target, suffix, prefix = "", decimals = 0, duration = 2000 }: {
  target: number; suffix: string; prefix?: string; decimals?: number; duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (!inView || !ref.current || prefersReduced) {
      if (ref.current) ref.current.textContent = `${prefix}${target % 1 === 0 ? target.toLocaleString() : target.toFixed(decimals)}${suffix}`
      return
    }
    const start = Date.now()
    const update = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = target * eased
      const display = decimals > 0
        ? current.toFixed(decimals)
        : Math.round(current).toLocaleString()
      if (ref.current) ref.current.textContent = `${prefix}${display}${suffix}`
      if (progress < 1) requestAnimationFrame(update)
    }
    requestAnimationFrame(update)
  }, [inView, target, suffix, prefix, decimals, duration, prefersReduced])

  return <span ref={ref}>{prefix}0{suffix}</span>
}

export default function ProofBar() {
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: true, margin: "-80px" })

  return (
    <section className="w-full bg-white border-y border-amber-100/80 py-8 shadow-sm" aria-label="Customer trust proof">
      <div ref={containerRef} className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-0">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`flex flex-col items-center text-center py-2 ${
                i < STATS.length - 1 ? "lg:border-r lg:border-amber-100" : ""
              }`}
            >
              <span className="font-mono text-3xl lg:text-4xl font-bold text-petha-amber leading-none">
                <CountUp {...stat} />
              </span>
              <span className="font-jakarta text-xs text-slate-600 mt-2 font-bold uppercase tracking-wider">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
