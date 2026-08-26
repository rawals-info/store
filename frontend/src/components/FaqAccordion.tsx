"use client"

import { useState, ReactNode } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export interface FaqItem {
  question: string
  answer: ReactNode
}

export default function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  if (!faqs || faqs.length === 0) return null

  return (
    <div className="space-y-3 font-jakarta">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx

        return (
          <div
            key={idx}
            className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
              isOpen
                ? "bg-amber-50/40 border-amber-300/80 shadow-xs"
                : "bg-white border-amber-100/90 hover:border-amber-200 shadow-xs"
            }`}
          >
            <button
              type="button"
              className="w-full text-left px-5 sm:px-6 py-4 flex items-center justify-between gap-4 font-jakarta text-sm sm:text-base font-bold text-slate-900 hover:text-petha-amber transition-colors cursor-pointer"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${idx}`}
              onClick={() => setOpenIndex(isOpen ? null : idx)}
            >
              <span className="leading-snug">{faq.question}</span>
              <ChevronDown
                className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-petha-amber" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-panel-${idx}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 sm:px-6 pb-4 sm:pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-amber-100/60 font-normal">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}