"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import Breadcrumb from "@modules/common/components/breadcrumb"
import { Sparkles, ChevronDown, Search, ArrowRight, ShoppingBag, HelpCircle, Phone, MessageSquare } from "lucide-react"

type FaqItem = {
  id: string
  category: "all" | "petha" | "freshness" | "shipping" | "diet" | "gifting"
  question: string
  answer: string
  productLinks?: {
    title: string
    handle: string
    emoji: string
  }[]
}

const FAQ_DATA: FaqItem[] = [
  {
    id: "faq-1",
    category: "petha",
    question: "What exactly is Agra Petha and what is it made of?",
    answer:
      "Agra Petha is an iconic, centuries-old Indian confectionery created from fresh winter melon (ash gourd / petha kaddu). The peeled fruit is diced and simmered in a pure sugar syrup infused with royal Kashmiri saffron, kewra water, rose extracts, or cardamom. It is completely translucent, tender, and juicy.",
    productLinks: [
      { title: "Taj Famous White Petha", handle: "taj-famous-white-petha", emoji: "🍬" },
      { title: "Kesar Dry Petha", handle: "kesar-dry-petha", emoji: "✨" },
    ],
  },
  {
    id: "faq-2",
    category: "petha",
    question: "What flavors and varieties of Agra Petha do you make?",
    answer:
      "We prepare all traditional royal Agra variations including Classic Taj White Petha, Kesar Angoori (grape-sized spherical juicy balls), Kesar Dry Petha, Paan Petha (filled with aromatic gulkand & dry fruits), Lal Petha, and Chocolate Glazed Petha for modern sweet lovers.",
    productLinks: [
      { title: "Kesar Angoori Petha", handle: "kesar-angoori-petha", emoji: "🍯" },
      { title: "Paan Petha", handle: "paan-petha", emoji: "🍃" },
      { title: "Chocolate Petha", handle: "chocolate-petha", emoji: "🍫" },
    ],
  },
  {
    id: "faq-3",
    category: "freshness",
    question: "How long does Taj Petha stay fresh, and how should I store it?",
    answer:
      "In our airtight, vacuum-sealed packaging, unopened boxes remain fresh for 30–45 days at normal room temperature. Once opened, we suggest transferring any remaining pieces to an airtight container or refrigerator and enjoying within 10–14 days to preserve maximum juiciness and tender bite.",
  },
  {
    id: "faq-4",
    category: "freshness",
    question: "Do you use chemical preservatives or artificial bleaching agents?",
    answer:
      "No! At Taj Petha, our natural preservation comes from our traditional slow-reduction sugar boiling process. We use zero artificial colorants, zero chemical bleaching, and only natural food-grade extracts strictly conforming to FSSAI standards.",
  },
  {
    id: "faq-5",
    category: "shipping",
    question: "How fast is shipping across India?",
    answer:
      "Every box is prepared daily in Agra and dispatched via Air Express within 24 hours of receiving your order. Tier-1 metro cities (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Pune) receive their delivery within 2–3 business days. All other pin codes are delivered within 3–5 business days.",
  },
  {
    id: "faq-6",
    category: "shipping",
    question: "Is there a minimum order for Free Shipping?",
    answer:
      "Yes! All orders above ₹500 qualify for 100% Free Nationwide Delivery. For smaller trial orders below ₹500, a nominal shipping charge is calculated automatically at checkout.",
  },
  {
    id: "faq-7",
    category: "diet",
    question: "Are all Taj Petha sweets and namkeens 100% Pure Vegetarian?",
    answer:
      "Yes, 100% of our products are strictly vegetarian, free from eggs, gelatin, and animal by-products. Our dedicated confectionery facilities follow strict vegetarian hygiene and are FSSAI certified.",
    productLinks: [
      { title: "Special Agra Dalmoth", handle: "special-agra-dalmoth", emoji: "🥜" },
      { title: "Special Masala Peanuts", handle: "special-masala-peanuts", emoji: "🌶️" },
    ],
  },
  {
    id: "faq-8",
    category: "gifting",
    question: "Can I place bulk orders for weddings, festivals, or corporate gifting?",
    answer:
      "Absolutely! We design customized royal gift hampers for weddings, Diwali, Rakhi, and corporate celebrations. We offer custom branding, personalized greeting notes, and tiered volume discounts for orders of 25+ boxes.",
    productLinks: [
      { title: "Combo Dalmoth & Petha Box", handle: "combo-dalmoth-petha", emoji: "🎁" },
    ],
  },
  {
    id: "faq-9",
    category: "gifting",
    question: "Can I pair Agra Petha with Agra Dalmoth in one gift box?",
    answer:
      "Yes! Pairing sweet translucent Kesar Petha with spicy, crispy Agra Dalmoth (fried lentil snack with musk melon seeds and cashew nuts) is the time-honored traditional way Agra treats are served.",
    productLinks: [
      { title: "Combo Dalmoth & Petha", handle: "combo-dalmoth-petha", emoji: "🎁" },
    ],
  },
]

const CATEGORIES = [
  { id: "all", label: "✨ All FAQs" },
  { id: "petha", label: "🍬 Petha & Varieties" },
  { id: "freshness", label: "⏱️ Freshness & Storage" },
  { id: "shipping", label: "🚚 Express Shipping" },
  { id: "diet", label: "🌱 100% Veg & Safety" },
  { id: "gifting", label: "🎁 Bulk & Gifting" },
]

export default function FaqClient({ countryCode }: { countryCode: string }) {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [openIds, setOpenIds] = useState<string[]>(["faq-1", "faq-3", "faq-5"])

  const toggleFaq = (id: string) => {
    setOpenIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const filteredFaqs = FAQ_DATA.filter((faq) => {
    const matchesCat = activeCategory === "all" || faq.category === activeCategory
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-16 font-jakarta">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Hero */}
        <div className="bg-white rounded-3xl border border-amber-100/90 p-8 sm:p-14 shadow-sm text-center relative overflow-hidden">
          <Breadcrumb
            items={[{ label: "Frequently Asked Questions", isCurrent: true }]}
            countryCode={countryCode}
            className="p-0 bg-transparent border-0 mb-6 justify-center"
          />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-200 text-amber-950 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-petha-amber" />
            <span>Customer Knowledge Base</span>
          </div>

          <h1 className="font-cormorant text-4xl sm:text-6xl font-bold text-slate-900 leading-tight">
            Frequently Asked Questions
          </h1>

          <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about our authentic Agra recipes, 30-day vacuum freshness guarantee, pan-India express air dispatch, and bulk gifting.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-lg mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword (e.g. shelf life, delivery, ingredients, Dalmoth)..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-petha-amber focus:bg-white transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 pb-2">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer shadow-xs ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "bg-white hover:bg-amber-50 border border-slate-200 text-slate-700"
                  }`}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-amber-100 space-y-3">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-cormorant text-2xl font-bold text-slate-800">No matching questions found</h3>
              <p className="text-xs text-slate-500">Try searching for a different keyword or explore our full sweet catalog.</p>
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory("all") }}
                className="px-4 py-2 rounded-xl bg-petha-amber text-white font-bold text-xs"
              >
                Reset Search
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openIds.includes(faq.id)
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-amber-100/90 shadow-xs overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-amber-50/30 transition-colors"
                  >
                    <span className="font-jakarta font-bold text-sm sm:text-base text-slate-900 leading-snug">
                      {faq.question}
                    </span>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "bg-amber-100 rotate-180 text-petha-amber" : "bg-slate-100 text-slate-500"
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 font-jakarta leading-relaxed space-y-4 border-t border-slate-50">
                          <p>{faq.answer}</p>

                          {/* Interlinked Direct Product Chips */}
                          {faq.productLinks && faq.productLinks.length > 0 && (
                            <div className="pt-2">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                                Recommended Fresh Sweets &amp; Snacks:
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {faq.productLinks.map((link) => (
                                  <Link
                                    key={link.handle}
                                    href={`/${countryCode}/products/${link.handle}`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-petha-amber hover:text-white border border-amber-200/80 text-amber-950 font-bold text-xs transition-all shadow-xs group"
                                  >
                                    <span>{link.emoji}</span>
                                    <span>{link.title}</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })
          )}
        </div>

        {/* Still Have Questions? Banner */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-amber-500/20 text-center space-y-6">
          <span className="font-bold text-xs uppercase tracking-wider text-amber-300">
            💬 Dedicated Sweet Concierge
          </span>
          
          <h3 className="font-cormorant text-3xl sm:text-4xl font-bold text-white leading-tight">
            Still Have Questions? We’re Here to Help!
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Our Agra confectionery team is available 7 days a week for immediate order support, flavor consultations, and gift box inquiries.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="https://wa.me/919259418994?text=Hello%20Taj%20Petha%2C%20I%20have%20a%20question."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>

            <Link
              href={`/${countryCode}/contact`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              <span>Contact Us Form</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
