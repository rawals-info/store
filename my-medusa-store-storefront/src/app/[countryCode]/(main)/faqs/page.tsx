"use client"

import { useState } from "react"
import Head from "next/head"

const faqs = [
  {
    question: "Do you offer wholesale pricing?",
    answer: (
      <span>
        Yes, we do offer wholesale opportunities. For wholesale inquiries, please get in touch with us at <a href="mailto:support@imperialcraft.in" className="text-luxury-gold underline hover:text-luxury-darkgold">support@imperialcraft.in</a>.
      </span>
    ),
  },
  {
    question: "How long does shipping take?",
    answer: (
      <span>
        Standard shipping via DHL or FedEx takes approximately <span className="font-semibold">10 business days</span> to most destinations. Oversized items shipped by sea may take <span className="font-semibold">6–8 weeks</span>.
      </span>
    ),
  },
  {
    question: "Are your products insured during shipping?",
    answer: (
      <span>
        Yes, all shipments are <span className="font-semibold">fully insured</span> against loss and damage. Please inspect your package upon arrival and contact us immediately if there are any issues.
      </span>
    ),
  },
  {
    question: "Can I return or exchange my order?",
    answer: (
      <span>
        Yes, you may request a return within <span className="font-semibold">7 calendar days</span> of delivery, provided the item is unused and in its original packaging. See our <a href="/returns" className="text-luxury-gold underline hover:text-luxury-darkgold">Return & Refund Policy</a> for details.
      </span>
    ),
  },
  {
    question: "Do you ship internationally?",
    answer: (
      <span>
        Yes, we ship worldwide via DHL, FedEx, and India Post (where available). Customs duties and taxes are the responsibility of the customer.
      </span>
    ),
  },
  {
    question: "How are your products packaged?",
    answer: (
      <span>
        We use professional-grade packaging: air shipments are packed in reinforced boxes with foam and bubble wrap; sea shipments are crated in wood for maximum protection.
      </span>
    ),
  },
  {
    question: "How do I care for my marble product?",
    answer: (
      <span>
        Clean with a soft, damp cloth. Avoid acidic or abrasive cleaners. For detailed care instructions, see our <a href="/care" className="text-luxury-gold underline hover:text-luxury-darkgold">Product Care Guide</a>.
      </span>
    ),
  },
  {
    question: "Can I request a custom or personalized order?",
    answer: (
      <span>
        Absolutely! We welcome custom commissions. Please email <a href="mailto:support@imperialcraft.in" className="text-luxury-gold underline hover:text-luxury-darkgold">support@imperialcraft.in</a> with your requirements.
      </span>
    ),
  },
  {
    question: "How can I contact you?",
    answer: (
      <span>
        Email: <a href="mailto:support@imperialcraft.in" className="text-luxury-gold underline hover:text-luxury-darkgold">support@imperialcraft.in</a><br />
        Phone: +91&nbsp;XXXXXXXXXX<br />
        Business Hours: Mon–Fri, 10&nbsp;AM–6&nbsp;PM IST
      </span>
    ),
  },
]

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      {faqs.map((faq, idx) => (
        <div key={idx} className="border border-luxury-gold/30 rounded-lg bg-white/70 shadow-sm overflow-hidden">
          <button
            className={`w-full text-left px-6 py-4 flex items-center justify-between font-serif text-lg md:text-xl text-luxury-charcoal focus:outline-none transition-colors duration-200 ${openIndex === idx ? 'bg-luxury-cream/40' : 'hover:bg-luxury-cream/20'}`}
            aria-expanded={openIndex === idx}
            aria-controls={`faq-panel-${idx}`}
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
          >
            <span>{faq.question}</span>
            <span className={`ml-4 transition-transform duration-300 ${openIndex === idx ? 'rotate-180 text-luxury-gold' : 'text-luxury-gold/60'}`}>▼</span>
          </button>
          <div
            id={`faq-panel-${idx}`}
            className={`px-6 pb-4 text-base text-luxury-charcoal/90 transition-all duration-300 ${openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
            style={{
              transitionProperty: 'max-height, opacity',
            }}
            aria-hidden={openIndex !== idx}
          >
            {openIndex === idx && <div className="pt-2">{faq.answer}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function FaqsPage() {
  return (
    <div className="content-container py-12">
      <Head>
        <title>FAQs | Imperial Craft Of India</title>
        <meta name="description" content="Frequently asked questions about Imperial Craft Of India. Shipping, returns, wholesale, and more." />
      </Head>
      <div className="flex flex-col items-center text-center mb-16">
        <h1 className="font-display text-4xl text-luxury-gold mb-4 tracking-wide uppercase">Frequently Asked Questions</h1>
        <div className="h-px w-20 bg-luxury-gold mb-8"></div>
        <p className="text-luxury-charcoal/70 text-base max-w-2xl mx-auto">
          Answers to our most common questions about shipping, returns, custom orders, and more. If you need further assistance, please contact our team.
        </p>
      </div>
      <div className="max-w-3xl mx-auto">
        <FaqAccordion />
      </div>
    </div>
  )
} 