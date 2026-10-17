import Link from "next/link"
import Breadcrumb from "@modules/common/components/breadcrumb"
import { Lock, ShieldCheck, Database, Truck, MessageSquare, UserCheck } from "lucide-react"
import { Metadata } from "next"

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: "Privacy & Data Protection Policy | Taj Petha Agra",
  description: "Learn how Taj Petha protects your personal details, payment information, and delivery data in compliance with Indian DPDP Act standards.",
}

export default function PrivacyPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-6 sm:py-10 font-jakarta">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
        
        <div className="bg-white rounded-3xl border border-amber-100/90 p-5 sm:p-7 shadow-xs text-center">
          <Breadcrumb
            items={[{ label: "Privacy Policy", isCurrent: true }]}
            countryCode="in"
            className="p-0 bg-transparent border-0 mb-3 justify-center"
          />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-950 text-[11px] font-bold uppercase tracking-wider mb-3">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted Data Protection &amp; DPDP Compliant</span>
          </div>

          <h1 className="font-cormorant text-2xl sm:text-4xl font-bold text-slate-900 leading-tight">
            Privacy &amp; Data Security Policy
          </h1>
          <p className="text-xs text-slate-500 mt-1.5">Last updated: October 2026</p>
        </div>

        <div className="bg-white rounded-3xl border border-amber-100/90 p-5 sm:p-8 shadow-xs space-y-7 text-sm sm:text-base text-slate-700 leading-relaxed">
          
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900">
              <Database className="w-5 h-5 text-petha-amber flex-shrink-0" />
              <h2 className="font-cormorant text-2xl sm:text-3xl font-bold">
                1. Information We Collect
              </h2>
            </div>
            <p>
              When you visit or place an order on Taj Petha (FSSAI Reg. No. 22725113001738), we collect personal information you provide to fulfill your orders and deliver exceptional customer care:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li><strong>Contact Details:</strong> Full name, telephone/mobile number, and email address.</li>
              <li><strong>Delivery Information:</strong> Full shipping address, landmarks, city, state, and 6-digit postal PIN code.</li>
              <li><strong>Order History:</strong> Confectionery items purchased, quantities, billing receipts, and transactional timestamps.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <h2 className="font-cormorant text-2xl sm:text-3xl font-bold">
                2. Financial Data Security (No Card or PIN Storage)
              </h2>
            </div>
            <p>
              We prioritize your financial safety. <strong>Taj Petha never captures, views, or stores your credit/debit card numbers, CVVs, netbanking passwords, or UPI PINs.</strong> All payments are processed directly through certified, RBI-authorized payment aggregators (e.g. Razorpay) compliant with global PCI-DSS Level 1 standards using 256-bit bank-grade SSL encryption.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <Truck className="w-5 h-5 text-amber-700 flex-shrink-0" />
              <h2 className="font-cormorant text-2xl sm:text-3xl font-bold">
                3. Third-Party Logistics &amp; Carrier Data Sharing
              </h2>
            </div>
            <p>
              To ensure timely pan-India delivery of perishable sweets, we share your name, shipping address, and telephone number with our contracted logistics partners (BlueDart Express, Delhivery, DTDC, and air cargo carriers). This data sharing is strictly limited to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>Dispatch routing, parcel delivery, and doorstep handoff.</li>
              <li>Delivery OTP verification and live consignment tracking.</li>
              <li>Processing carrier transit insurance claims in the event of package loss or damage.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <MessageSquare className="w-5 h-5 text-emerald-700 flex-shrink-0" />
              <h2 className="font-cormorant text-2xl sm:text-3xl font-bold">
                4. Consent for Transactional Communications
              </h2>
            </div>
            <p>
              By placing an order on Taj Petha, you expressly consent to receive essential transactional communications via <strong>WhatsApp, SMS, and Email</strong> regarding:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>Order confirmation, payment receipts, and kitchen preparation status.</li>
              <li>Courier dispatch alerts, AWB live tracking links, and estimated delivery dates.</li>
              <li>Carrier delivery OTPs and transit claim survey updates.</li>
            </ul>
            <p className="text-xs text-slate-500 pt-1">
              *We will never sell or rent your personal data to third-party telemarketers or external advertisers.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <UserCheck className="w-5 h-5 text-slate-800 flex-shrink-0" />
              <h2 className="font-cormorant text-2xl sm:text-3xl font-bold">
                5. Data Retention &amp; User Rights (DPDP Act, 2023)
              </h2>
            </div>
            <p>
              We retain transactional and delivery records only as long as necessary to satisfy taxation, audit, accounting, and legal requirements under Indian law. You have the right to request access to your stored personal information, request corrections, or request account data erasure by contacting our Grievance Desk.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              6. Grievance Officer &amp; Contact Information
            </h2>
            <p>
              In accordance with the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023, for questions, feedback, or data privacy concerns, please contact our Grievance Officer:
            </p>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs sm:text-sm text-slate-700 space-y-1">
              <p><strong>Grievance Desk:</strong> Taj Petha Confectioners</p>
              <p><strong>Location:</strong> Noori Gate, Near Taj Mahal, Agra, Uttar Pradesh 282001, India</p>
              <p><strong>Email:</strong> <a href="mailto:support@tajpetha.in" className="text-petha-amber font-bold hover:underline">support@tajpetha.in</a></p>
              <p><strong>WhatsApp Support:</strong> <a href="https://wa.me/919259418994" className="text-petha-amber font-bold hover:underline">+91 92594 18994</a></p>
            </div>
          </section>

        </div>

      </div>
    </div>
  )
}