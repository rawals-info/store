import Link from "next/link"
import Breadcrumb from "@modules/common/components/breadcrumb"
import { ShieldCheck } from "lucide-react"
import { Metadata } from "next"

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: "Terms & Conditions | Taj Petha Agra",
  description: "Read the official Terms of Service and Conditions for ordering authentic sweets and snacks on Taj Petha.",
}

export default function TermsPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-16 font-jakarta">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="bg-white rounded-3xl border border-amber-100/90 p-8 sm:p-12 shadow-sm text-center">
          <Breadcrumb
            items={[{ label: "Terms of Service", isCurrent: true }]}
            countryCode="in"
            className="p-0 bg-transparent border-0 mb-6 justify-center"
          />

          <h1 className="font-cormorant text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
            Terms of Service &amp; Conditions
          </h1>
          <p className="text-xs text-slate-500 mt-2">Last updated: January 2025</p>
        </div>

        <div className="bg-white rounded-3xl border border-amber-100/90 p-6 sm:p-12 shadow-sm space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              1. Overview
            </h2>
            <p>
              This website is operated by Taj Petha Confectioners Agra. Throughout the site, the terms "we", "us" and "our" refer to Taj Petha. By visiting our site or purchasing from us, you agree to be bound by these terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              2. Products &amp; Authenticity
            </h2>
            <p>
              All sweets (Petha, Dalmoth, Peanuts, Namkeen) are handcrafted in Agra in small daily batches. While we strive to display our products as accurately as possible, slight variations in color and natural fruit shape are a hallmark of artisanal halwai craftsmanship.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              3. Pricing &amp; Promotions
            </h2>
            <p>
              All prices are displayed in Indian Rupees (INR) and are inclusive of applicable GST taxes. We reserve the right to modify pricing, special discount codes (such as `SWEET20`), and promotional offers at any time without prior notice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              4. Contact Information
            </h2>
            <p>
              Questions regarding these Terms of Service should be sent to <a href="mailto:support@tajpetha.in" className="text-petha-amber font-bold hover:underline">support@tajpetha.in</a>.
            </p>
          </section>
        </div>

      </div>
    </div>
  )
}