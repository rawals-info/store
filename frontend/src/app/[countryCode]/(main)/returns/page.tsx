import Link from "next/link"
import Breadcrumb from "@modules/common/components/breadcrumb"
import { ShieldCheck, RotateCcw, HelpCircle, Phone, Mail, CheckCircle2 } from "lucide-react"
import { Metadata } from "next"

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: "Returns & Refund Policy | 100% Satisfaction Guarantee | Taj Petha",
  description: "Read Taj Petha's perishable food returns, damaged package replacement, and customer satisfaction policy.",
}

export default function ReturnsPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-16 font-jakarta">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="bg-white rounded-3xl border border-amber-100/90 p-8 sm:p-12 shadow-sm text-center">
          <Breadcrumb
            items={[{ label: "Returns & Refund Policy", isCurrent: true }]}
            countryCode="in"
            className="p-0 bg-transparent border-0 mb-6 justify-center"
          />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-950 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Customer Satisfaction Guarantee</span>
          </div>

          <h1 className="font-cormorant text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
            Returns, Replacements &amp; Refunds
          </h1>

          <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
            Your happiness and sweet experience is our highest priority.
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl border border-amber-100/90 p-6 sm:p-12 shadow-sm space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              1. Perishable Food Products
            </h2>
            <p>
              Because Taj Petha products are freshly prepared, edible confections without artificial chemical preservatives, we cannot accept physical returns on opened sweet boxes. However, if your order arrives damaged, spoiled, or incorrect, we will replace or refund it immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              2. Hassle-Free Replacement Policy
            </h2>
            <p>
              You are eligible for a 100% free replacement or full refund under the following conditions:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-700">
              <li><strong>Transit Damage:</strong> Outer box or vacuum seal was compromised or torn during shipping.</li>
              <li><strong>Incorrect Items:</strong> You received a different flavor or weight than what was ordered.</li>
              <li><strong>Quality Issue:</strong> The sweets do not meet our freshness standard upon opening.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              3. How to Request a Replacement (In 2 Simple Steps)
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-slate-700">
              <li>Take 1–2 photos of the damaged or incorrect sweet box.</li>
              <li>Send an email to <a href="mailto:support@tajpetha.in" className="text-petha-amber font-bold hover:underline">support@tajpetha.in</a> or message us on WhatsApp at <a href="https://wa.me/919259418994" className="text-petha-amber font-bold hover:underline">+91 92594 18994</a> within 48 hours of delivery.</li>
            </ol>
            <p className="pt-2">
              Our support team will dispatch a fresh replacement batch or process your refund back to your original payment method within 24–48 hours.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}