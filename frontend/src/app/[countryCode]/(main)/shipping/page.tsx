import Link from "next/link"
import Breadcrumb from "@modules/common/components/breadcrumb"
import { Truck, ShieldCheck, Clock, MapPin, Sparkles, ArrowRight } from "lucide-react"
import { Metadata } from "next"

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: "Shipping & Nationwide Delivery Policy | Taj Petha Agra",
  description: "Learn about Taj Petha's temperature-sealed air express packaging, 24-hour dispatch, and free nationwide shipping on orders above ₹500.",
}

export default function ShippingPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-6 sm:py-10 font-jakarta">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-3xl border border-amber-100/90 p-5 sm:p-7 shadow-xs text-center">
          <Breadcrumb
            items={[{ label: "Shipping & Delivery Policy", isCurrent: true }]}
            countryCode="in"
            className="p-0 bg-transparent border-0 mb-3 justify-center"
          />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-amber-950 text-[11px] font-bold uppercase tracking-wider mb-3">
            <Truck className="w-3.5 h-3.5 text-petha-amber" />
            <span>Pan-India Air Express Logistics</span>
          </div>

          <h1 className="font-cormorant text-2xl sm:text-4xl font-bold text-slate-900 leading-tight">
            Shipping &amp; Fresh Delivery Policy
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto">
            Packed fresh daily in Agra and delivered to your doorstep in sealed, food-grade packaging.
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl border border-amber-100/90 p-5 sm:p-8 shadow-xs space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
          
          {/* Quick Perks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-8 border-b border-slate-100">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-1">
              <span className="font-bold text-xs uppercase tracking-wider text-amber-900 block">Dispatch Time</span>
              <p className="font-bold text-base text-slate-900">Within 24 Hours</p>
              <p className="text-xs text-slate-500">Cooked fresh on day of order</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-1">
              <span className="font-bold text-xs uppercase tracking-wider text-amber-900 block">Metro Delivery</span>
              <p className="font-bold text-base text-slate-900">2–3 Business Days</p>
              <p className="text-xs text-slate-500">Via premium air cargo couriers</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-1">
              <span className="font-bold text-xs uppercase tracking-wider text-amber-900 block">Free Shipping</span>
              <p className="font-bold text-base text-slate-900">On Orders ₹500+</p>
              <p className="text-xs text-slate-500">All locations across India</p>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              1. Packaging &amp; Sealed Freshness
            </h2>
            <p>
              Because Agra Petha is a delicate, juicy confection, we take special precautions to preserve its melt-in-mouth texture. Every batch is vacuum-sealed in multi-layer food-grade pouches immediately after cooling. These pouches are enclosed in reinforced protective boxes to prevent any damage or leakage during transit.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              2. Delivery Timelines by Region
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-700">
              <li><strong>Delhi NCR, Uttar Pradesh &amp; North India:</strong> 1–2 business days.</li>
              <li><strong>Major Metros (Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Pune):</strong> 2–3 business days.</li>
              <li><strong>Rest of India (Tier 2/3 Cities &amp; States):</strong> 3–5 business days.</li>
              <li><strong>Remote &amp; North-East Locations:</strong> 5–7 business days.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              3. Order Tracking &amp; Notifications
            </h2>
            <p>
              As soon as your package is dispatched from our Agra facility, you will receive an SMS and email notification with your live tracking number (BlueDart, Delhivery, DTDC, or Express Cargo).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              4. Need Express Assistance?
            </h2>
            <p>
              If you require urgent delivery for a wedding, festival, or corporate celebration, contact our Agra helpline at <a href="tel:+919259418994" className="text-petha-amber font-bold hover:underline">+91 92594 18994</a> or email <a href="mailto:support@tajpetha.in" className="text-petha-amber font-bold hover:underline">support@tajpetha.in</a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}