import Link from "next/link"
import Breadcrumb from "@modules/common/components/breadcrumb"
import { Truck, ShieldCheck, Clock, MapPin, Sparkles, AlertCircle, Video } from "lucide-react"
import { Metadata } from "next"

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: "Shipping & Nationwide Delivery Policy | Taj Petha Agra",
  description: "Learn about Taj Petha's temperature-sealed air express packaging, transit insurance, 30-minute cancellation cutoff, and nationwide delivery timelines.",
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
            <span>Pan-India Transit Insured Air Logistics</span>
          </div>

          <h1 className="font-cormorant text-2xl sm:text-4xl font-bold text-slate-900 leading-tight">
            Shipping &amp; Fresh Delivery Policy
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto">
            Packed fresh daily in Agra and delivered to your doorstep in sealed, food-grade packaging with complete carrier transit insurance.
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl border border-amber-100/90 p-5 sm:p-8 shadow-xs space-y-7 text-sm sm:text-base text-slate-700 leading-relaxed">
          
          {/* Quick Perks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-8 border-b border-slate-100">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-1">
              <span className="font-bold text-xs uppercase tracking-wider text-amber-900 block">Dispatch Time</span>
              <p className="font-bold text-base text-slate-900">Same-Day Dispatch</p>
              <p className="text-xs text-slate-500">For orders before 2:00 PM IST</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-1">
              <span className="font-bold text-xs uppercase tracking-wider text-amber-900 block">Express Delivery</span>
              <p className="font-bold text-base text-slate-900">24–48 Hours</p>
              <p className="text-xs text-slate-500">Via premium air cargo couriers</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-1">
              <span className="font-bold text-xs uppercase tracking-wider text-amber-900 block">Transit Insurance</span>
              <p className="font-bold text-base text-slate-900">100% Insured</p>
              <p className="text-xs text-slate-500">Covered by logistics carriers</p>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              1. 30-Minute Cancellation Cutoff Before Dispatch
            </h2>
            <p>
              Because our sweets are made fresh daily without artificial preservatives, orders enter preparation and custom box sealing immediately. Customers may only cancel or modify an order within <strong>30 minutes of order placement</strong> by contacting our WhatsApp desk at <a href="https://wa.me/919259418994" className="text-petha-amber font-bold hover:underline">+91 92594 18994</a>. After 30 minutes, orders are irreversibly assigned to halwai packing and courier manifestation, and cannot be cancelled.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              2. Packaging &amp; Sealed Freshness
            </h2>
            <p>
              Because Agra Petha is a delicate, juicy confection, we take special precautions to preserve its melt-in-mouth texture. Every batch is vacuum-sealed in multi-layer food-grade pouches immediately after cooling. These pouches are enclosed in reinforced protective boxes to prevent any damage or leakage during transit.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              3. Estimated Delivery Timelines by Region
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-700">
              <li><strong>Delhi NCR, Uttar Pradesh &amp; North India:</strong> 1–2 business days.</li>
              <li><strong>Major Metros (Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Pune):</strong> 2–3 business days.</li>
              <li><strong>Rest of India (Tier 2/3 Cities &amp; States):</strong> 3–5 business days.</li>
              <li><strong>Remote &amp; North-East Locations:</strong> 5–7 business days.</li>
            </ul>
            <p className="text-xs text-slate-500 pt-1">
              *Please note that delivery timelines are courier transit estimates. Delays caused by weather, festive rush (Diwali, Rakhi), or airline cargo congestion are beyond our direct control and do not constitute grounds for instant cancellation of dispatched shipments.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              4. Third-Party Courier Transit Insurance &amp; Damage Claims
            </h2>
            <p>
              All shipments from Taj Petha are insured against transit loss or physical damage through our logistics partners (BlueDart, Delhivery, DTDC). If an outer carton arrives damaged or tampered:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>Customers must record a continuous <strong>Pure Unboxing Video</strong> (unedited, single-shot, showing sealed outer box before cutting).</li>
              <li>Notify our desk within <strong>24 hours of delivery</strong> with the video and photos.</li>
              <li>Taj Petha lodges an insurance claim with the courier partner; resolutions are issued upon verification of the courier&apos;s survey report.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              5. Delivery Address Accuracy &amp; Failed Deliveries (RTO)
            </h2>
            <p>
              Customers must ensure the full address with landmarks, PIN code, and active mobile number are provided. If a shipment is returned to origin (RTO) due to an incorrect address, non-availability of the recipient, or refusal to accept at the doorstep, no refunds or free re-shipments will be provided because perishable sweets spoil during return transit.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              6. Order Tracking &amp; Customer Support
            </h2>
            <p>
              As soon as your package is dispatched from our Agra facility, you will receive an automated WhatsApp and email notification with your live tracking number (AWB). For express assistance, contact our helpline at <a href="https://wa.me/919259418994" className="text-petha-amber font-bold hover:underline">+91 92594 18994</a> or email <a href="mailto:support@tajpetha.in" className="text-petha-amber font-bold hover:underline">support@tajpetha.in</a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}