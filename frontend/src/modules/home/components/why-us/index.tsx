"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { useRef } from "react"

const ROWS = [
  {
    img: "/hero_image.webp",
    imgAlt: "Agra artisan sweets craftsmanship",
    eyebrow: "01 / Heritage",
    heading: "Agra's Legacy in\nEvery Bite",
    body: "Our recipes have been passed down through three generations of Agra's finest halwais. Each piece of petha carries centuries of tradition — unchanged, uncompromised.",
    chips: ["3 Generations", "Traditional Recipe", "Agra Craft"],
    imgLeft: true,
  },
  {
    img: "/hero_petha_square.webp",
    imgAlt: "Fresh authentic Agra petha crafted with pure saffron and natural ash gourd",
    eyebrow: "02 / Freshness",
    heading: "Zero Compromise\non Freshness",
    body: "We make every batch fresh — daily. No preservatives. No artificial colours. Just farm-fresh ash gourd, cane sugar, rose water, and pure saffron. What you get is as fresh as it gets.",
    chips: ["No Preservatives", "Made Daily", "FSSAI Certified"],
    imgLeft: false,
    isPurityCard: true,
  },
  {
    img: "/gift_box_hero.webp",
    imgAlt: "Premium royal Agra sweet box packaging",
    eyebrow: "03 / Delivery",
    heading: "From Agra to\nYour Doorstep",
    body: "Vacuum-sealed for maximum freshness. Packed with food-grade material. Shipped with care across all 28 states. We track every order until it reaches you.",
    chips: ["Vacuum Sealed", "Nationwide", "24-48hr Delivery"],
    imgLeft: true,
  },
]

export default function WhyUs() {
  const prefersReduced = useReducedMotion()

  return (
    <section className="py-8 lg:py-14 bg-white" aria-label="Why choose Taj Petha">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        {/* Section header */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="text-center mb-8"
        >
          <span className="font-jakarta text-xs uppercase tracking-[0.2em] text-petha-amber font-semibold">
            The Taj Promise
          </span>
          <h2 className="font-cormorant text-3xl lg:text-4xl font-semibold text-petha-text mt-2 leading-tight">
            Why 50,000+ Indians Choose Us
          </h2>
        </motion.div>

        {/* Alternating rows */}
        <div className="flex flex-col gap-8 lg:gap-12">
          {ROWS.map((row, i) => (
            <div
              key={row.eyebrow}
              className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${row.imgLeft ? "" : "lg:[&>*:first-child]:order-2"}`}
            >
              {/* Image column */}
              <motion.div
                initial={prefersReduced ? false : { opacity: 0, x: row.imgLeft ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl"
              >
                <Image
                  src={row.img}
                  alt={row.imgAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                {/* Subtle amber corner accent */}
                <div className="absolute bottom-4 right-4 w-16 h-16 rounded-full border-2 border-white/40" />
              </motion.div>

              {/* Text column */}
              <motion.div
                initial={prefersReduced ? false : { opacity: 0, x: row.imgLeft ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="font-mono text-sm font-semibold text-petha-amber">{row.eyebrow}</span>
                <h3 className="font-cormorant text-3xl lg:text-4xl font-semibold text-petha-text mt-3 mb-5 leading-tight whitespace-pre-line">
                  {row.heading}
                </h3>
                <p className="font-jakarta text-base text-petha-subtle leading-relaxed mb-7">
                  {row.body}
                </p>
                {/* Feature chips */}
                <div className="flex flex-wrap gap-2">
                  {row.chips.map(chip => (
                    <span
                      key={chip}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-petha-warm border border-petha-border font-jakarta text-xs font-semibold text-petha-slate"
                    >
                      <svg className="w-3 h-3 text-petha-amber" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {chip}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
