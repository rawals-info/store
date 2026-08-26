"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"

const OCCASIONS = [
  { label: "Diwali", icon: "🪔" },
  { label: "Raksha Bandhan", icon: "🎁" },
  { label: "Corporate Gifting", icon: "🏢" },
  { label: "Weddings", icon: "💐" },
]

export default function GiftingBanner({ countryCode }: { countryCode: string }) {
  const prefersReduced = useReducedMotion()

  return (
    <section className="py-0 overflow-hidden" aria-label="Gifting and festive occasions">
      <div className="relative min-h-[360px] flex items-center">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/gift_box_hero.jpg"
            alt="Premium Taj Petha gift hampers for festive occasions"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Dark + amber gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-10 py-10 w-full">
          <div className="max-w-xl">
            {/* Eyebrow */}
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="h-px w-10 bg-petha-saffron" />
              <span className="font-jakarta text-xs uppercase tracking-[0.2em] text-petha-saffron font-semibold">
                Festive &amp; Corporate
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={prefersReduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-cormorant text-4xl lg:text-5xl font-semibold text-white leading-tight mb-5"
            >
              Make Every Celebration
              <br />
              <span className="text-petha-saffron italic">Sweeter</span>
            </motion.h2>

            {/* Body */}
            <motion.p
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="font-jakarta text-base text-white/80 leading-relaxed mb-8"
            >
              From personalised Diwali hampers to bulk corporate orders — we handle everything.
              Custom branding, premium packaging, pan-India delivery.
            </motion.p>

            {/* Occasion pills */}
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-2 mb-10"
            >
              {OCCASIONS.map(o => (
                <span
                  key={o.label}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white font-jakarta text-xs font-medium backdrop-blur-sm"
                >
                  <span>{o.icon}</span>
                  {o.label}
                </span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link href={`/${countryCode}/products`} id="gifting-cta-shop">
                <motion.span
                  whileHover={prefersReduced ? {} : { scale: 1.03 }}
                  whileTap={prefersReduced ? {} : { scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-petha-saffron text-white font-jakarta font-semibold text-sm tracking-wide hover:bg-petha-amber transition-colors cursor-pointer shadow-lg"
                >
                  Shop Gift Boxes
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
                  </svg>
                </motion.span>
              </Link>
              <a
                href={`https://wa.me/919259418994?text=${encodeURIComponent("Hi! I'm interested in corporate/bulk gifting from Taj Petha. Can you help me?")}`}
                target="_blank"
                rel="noopener noreferrer"
                id="gifting-cta-whatsapp"
              >
                <motion.span
                  whileHover={prefersReduced ? {} : { scale: 1.02 }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-white/40 text-white font-jakarta font-semibold text-sm tracking-wide hover:border-white/70 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Bulk Enquiry
                </motion.span>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
