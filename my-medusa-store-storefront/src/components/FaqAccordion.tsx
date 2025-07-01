"use client"

import { useState, ReactNode } from "react"

export interface FaqItem {
  question: string
  answer: ReactNode
}

export default function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      {faqs.map((faq, idx) => (
        <div
          key={idx}
          className="border border-luxury-gold/30 rounded-lg bg-white/70 shadow-sm overflow-hidden"
        >
          <button
            className={`w-full text-left px-6 py-4 flex items-center justify-between font-serif text-lg md:text-xl text-luxury-charcoal focus:outline-none transition-colors duration-200 ${openIndex === idx ? "bg-luxury-cream/40" : "hover:bg-luxury-cream/20"}`}
            aria-expanded={openIndex === idx}
            aria-controls={`faq-panel-${idx}`}
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
          >
            <span>{faq.question}</span>
            <span
              className={`ml-4 transition-transform duration-300 ${openIndex === idx ? "rotate-180 text-luxury-gold" : "text-luxury-gold/60"}`}
            >
              ▼
            </span>
          </button>
          <div
            id={`faq-panel-${idx}`}
            className={`px-6 pb-4 text-base text-luxury-charcoal/90 transition-all duration-300 ${openIndex === idx ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
            style={{ transitionProperty: "max-height, opacity" }}
            aria-hidden={openIndex !== idx}
          >
            {openIndex === idx && <div className="pt-2">{faq.answer}</div>}
          </div>
        </div>
      ))}
    </div>
  )
} 