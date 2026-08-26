import Link from "next/link"
import Breadcrumb from "@modules/common/components/breadcrumb"
import { Lock, ShieldCheck } from "lucide-react"
import { Metadata } from "next"

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: "Privacy Policy | 100% Data Protection | Taj Petha Agra",
  description: "Learn how Taj Petha protects your personal details, payment information, and delivery addresses with 256-bit SSL encryption.",
}

export default function PrivacyPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-16 font-jakarta">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="bg-white rounded-3xl border border-amber-100/90 p-8 sm:p-12 shadow-sm text-center">
          <Breadcrumb
            items={[{ label: "Privacy Policy", isCurrent: true }]}
            countryCode="in"
            className="p-0 bg-transparent border-0 mb-6 justify-center"
          />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-950 text-xs font-bold uppercase tracking-wider mb-4">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted Data Protection</span>
          </div>

          <h1 className="font-cormorant text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
            Privacy &amp; Data Security Policy
          </h1>
          <p className="text-xs text-slate-500 mt-2">Last updated: January 2025</p>
        </div>

        <div className="bg-white rounded-3xl border border-amber-100/90 p-6 sm:p-12 shadow-sm space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              1. Information We Collect
            </h2>
            <p>
              When you purchase sweets or register on Taj Petha, we collect information you provide including your name, shipping address, billing address, phone number, and email address solely for order fulfillment, dispatch updates, and customer support.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              2. Payment Information Security
            </h2>
            <p>
              We never store your credit/debit card details or UPI PINs on our servers. All financial transactions are processed securely through certified, PCI-DSS compliant payment gateways with bank-grade 256-bit SSL encryption.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              3. Zero Spam &amp; No Third-Party Selling
            </h2>
            <p>
              We respect your inbox. We will never sell, rent, or lease your personal information to third-party advertisers. You may unsubscribe from promotional email alerts at any time with a single click.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              4. Contact Us
            </h2>
            <p>
              If you have any questions regarding your personal data or wish to have your details removed, please reach out to <a href="mailto:support@tajpetha.in" className="text-petha-amber font-bold hover:underline">support@tajpetha.in</a>.
            </p>
          </section>
        </div>

      </div>
    </div>
  )
}