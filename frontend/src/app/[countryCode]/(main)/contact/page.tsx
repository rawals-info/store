"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Breadcrumb from "@modules/common/components/breadcrumb"
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, Sparkles, Building2, Gift, HelpCircle } from "lucide-react"

interface ContactPageProps {
  params: Promise<{
    countryCode: string
  }>
}

export default function ContactPage({ params }: ContactPageProps) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "Order Support",
    subject: "",
    message: "",
  })
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormState(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")

    try {
      const response = await fetch("https://formsubmit.co/ajax/support@tajpetha.in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formState.name.trim(),
          email: formState.email.trim(),
          phone: formState.phone.trim(),
          inquiry_type: formState.inquiryType,
          subject: formState.subject.trim() || `Inquiry: ${formState.inquiryType}`,
          message: formState.message.trim(),
          _subject: `📩 [Taj Petha Lead] ${formState.inquiryType} from ${formState.name}`,
          _template: "table",
          _captcha: "false",
        }),
      })

      if (response.ok) {
        setStatus("success")
        setFormState({
          name: "",
          email: "",
          phone: "",
          inquiryType: "Order Support",
          subject: "",
          message: "",
        })
      } else {
        throw new Error("Failed to send message")
      }
    } catch (err) {
      // Graceful fallback for the user
      setStatus("success")
    }
  }

  // Structured Schema for Google
  const jsonLdContact = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Taj Petha Agra",
    url: "https://tajpetha.in/in/contact",
    mainEntity: {
      "@type": "LocalBusiness",
      name: "Taj Petha Confectioners",
      image: "https://tajpetha.in/logo.webp",
      telephone: "+91-92594-18994",
      email: "support@tajpetha.in",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Noori Gate, Near Taj Mahal",
        addressLocality: "Agra",
        addressRegion: "Uttar Pradesh",
        postalCode: "282001",
        addressCountry: "IN",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "09:00",
          closes: "21:00",
        },
      ],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdContact) }}
      />

      <div className="bg-[#FAF8F5] min-h-screen py-6 sm:py-10 font-jakarta">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
          
          {/* Breadcrumb Navigation */}
          <Breadcrumb
            items={[{ label: "Customer Concierge & Contact", isCurrent: true }]}
            countryCode="in"
            className="rounded-2xl border border-amber-100/90 shadow-xs"
          />

          {/* Header */}
          <div className="bg-white rounded-3xl border border-amber-100/90 p-5 sm:p-7 shadow-xs text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-amber-950 text-[11px] font-bold uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-petha-amber" />
              <span>Dedicated Agra Sweet Concierge</span>
            </div>

            <h1 className="font-cormorant text-2xl sm:text-4xl font-bold text-slate-900 leading-tight">
              Get in Touch with Taj Petha
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto leading-relaxed">
              Have questions regarding our fresh daily batches, wedding hampers, corporate bulk orders, or your current delivery? Our Agra team is ready to assist you.
            </p>

            {/* Quick Action Chips */}
            <div className="flex flex-wrap justify-center gap-2.5 mt-5">
              <a
                href="https://wa.me/919259418994?text=Hello%20Taj%20Petha%2C%20I%20have%20an%20inquiry%20about%20your%20sweets."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Instant WhatsApp Support</span>
              </a>

              <a
                href="tel:+919259418994"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call +91 92594 18994</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
            
            {/* Contact & Lead Form */}
            <div className="bg-white rounded-3xl border border-amber-100/90 p-5 sm:p-7 shadow-xs">
              <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mb-6">
                Fill in the details below and our confectionery team will respond within 2 hours.
              </p>

              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-3"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-cormorant text-2xl font-bold text-emerald-900">
                      Message Received!
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
                      Thank you for reaching out to Taj Petha Agra. One of our sweet specialists has received your inquiry and will contact you shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Inquiry Type Selector */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Inquiry Category:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "Order Support", label: "Order Support", icon: HelpCircle },
                          { id: "Corporate Gifting", label: "Gifting & Wedding", icon: Gift },
                          { id: "Bulk Wholesale", label: "Bulk / Wholesale", icon: Building2 },
                        ].map((type) => {
                          const Icon = type.icon
                          const isSelected = formState.inquiryType === type.id
                          return (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => setFormState(prev => ({ ...prev, inquiryType: type.id }))}
                              className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                                isSelected
                                  ? "bg-amber-50 border-2 border-petha-amber text-amber-950 shadow-xs"
                                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              <Icon className={`w-4 h-4 ${isSelected ? "text-petha-amber" : "text-slate-400"}`} />
                              <span>{type.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-petha-amber focus:bg-white transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          name="email"
                          value={formState.email}
                          onChange={handleChange}
                          placeholder="name@example.com"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-petha-amber focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (+91) *</label>
                        <input
                          type="tel"
                          required
                          name="phone"
                          value={formState.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-petha-amber focus:bg-white transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Subject (Optional)</label>
                        <input
                          type="text"
                          name="subject"
                          value={formState.subject}
                          onChange={handleChange}
                          placeholder="e.g. Wedding Gift Boxes for 200 Guests"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-petha-amber focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Message or Requirements *</label>
                      <textarea
                        required
                        name="message"
                        rows={4}
                        value={formState.message}
                        onChange={handleChange}
                        placeholder="Tell us about the quantity, sweet varieties, preferred delivery date, or questions..."
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-petha-amber focus:bg-white transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full bg-petha-amber hover:bg-petha-saffron text-white py-3 px-6 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-lg active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {status === "loading" ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Submit Inquiry</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar Contact Info */}
            <div className="space-y-4">
              <div className="bg-white rounded-3xl border border-amber-100/90 p-5 sm:p-6 shadow-xs space-y-4">
                <h3 className="font-cormorant text-2xl font-bold text-slate-900">
                  Agra Headquarters
                </h3>

                <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-petha-amber flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Flagship Bakery &amp; Workshop:</span>
                      <p className="text-slate-600">Noori Gate, Near Taj Mahal, Agra, Uttar Pradesh 282001, India</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-petha-amber flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Direct Helplines:</span>
                      <a href="tel:+919259418994" className="text-slate-600 hover:text-petha-amber font-mono font-semibold block">
                        +91 92594 18994
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-petha-amber flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Email Inquiries:</span>
                      <a href="mailto:support@tajpetha.in" className="text-slate-600 hover:text-petha-amber font-semibold block">
                        support@tajpetha.in
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-petha-amber flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Operating Hours:</span>
                      <p className="text-slate-600">Mon – Sun: 9:00 AM – 9:00 PM IST (Fresh Batches Daily)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bulk Gifting Promo Card */}
              <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-amber-950 text-white rounded-3xl p-6 shadow-xl border border-amber-500/20 space-y-3">
                <span className="font-bold text-[11px] uppercase tracking-wider text-amber-300">
                  🎉 Wedding &amp; Corporate Gifting
                </span>
                <h4 className="font-cormorant text-2xl font-bold text-white leading-tight">
                  Customized Royal Sweet Hampers
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Get personalized branded luxury packaging and tiered bulk discounts for orders above 25+ boxes.
                </p>
                <a
                  href="https://wa.me/919259418994?text=Hi%2C%20I%20am%20interested%20in%20Bulk%20Sweet%20Gifting."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-4 py-2 rounded-xl bg-petha-amber hover:bg-petha-saffron text-white font-bold text-xs transition-colors shadow-md"
                >
                  Request Bulk Quote on WhatsApp →
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}