import Link from "next/link"
import Breadcrumb from "@modules/common/components/breadcrumb"
import { ShieldCheck, Truck, Package, Clock, AlertCircle, Phone, AlertTriangle, Scale, Lock, HeartPulse } from "lucide-react"
import { Metadata } from "next"

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: "Terms & Conditions | Taj Petha Agra",
  description: "Read the official Terms of Service, perishable goods policy, allergen disclaimer, health liability waiver, transit insurance, and order conditions of Taj Petha.",
}

export default function TermsPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-6 sm:py-10 font-jakarta">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
        
        <div className="bg-white rounded-3xl border border-amber-100/90 p-5 sm:p-7 shadow-xs text-center">
          <Breadcrumb
            items={[{ label: "Terms of Service", isCurrent: true }]}
            countryCode="in"
            className="p-0 bg-transparent border-0 mb-3 justify-center"
          />

          <h1 className="font-cormorant text-2xl sm:text-4xl font-bold text-slate-900 leading-tight">
            Terms of Service &amp; Conditions
          </h1>
          <p className="text-xs text-slate-500 mt-1.5">Last updated: October 2026</p>
        </div>

        <div className="bg-white rounded-3xl border border-amber-100/90 p-5 sm:p-8 shadow-xs space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              1. Overview &amp; Acceptance of Terms
            </h2>
            <p>
              This website is owned and operated by Taj Petha Confectioners, Agra, Uttar Pradesh, India (FSSAI Registration Number: <strong>22725113001738</strong>). Throughout this document, the terms &quot;we&quot;, &quot;us&quot;, &quot;our&quot;, and &quot;Taj Petha&quot; refer to Taj Petha Confectioners. By visiting our site, accessing content, or placing an order, you agree to be bound by these Terms of Service, our Privacy Policy, and our Cancellation, Returns &amp; Transit Claims Policy. If you do not agree to all terms, you must not access or use our platform.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              2. Artisanal Confectionery &amp; Natural Variations
            </h2>
            <p>
              All products (Petha, Dalmoth, Peanuts, Namkeen, Ghazak) are handcrafted in Agra in small daily batches using natural winter melon (ash gourd), sugar syrup, dry fruits, and aromatic spices. Because our products are prepared without chemical bleaching or artificial stabilizers, slight variations in natural translucency, fruit syrup saturation, slice thickness, and shape are authentic hallmarks of artisanal halwai craftsmanship and do not constitute defective merchandise.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              3. Pricing, Taxes &amp; Secure Payment Processing
            </h2>
            <p>
              All product prices are stated in Indian Rupees (INR) and are inclusive of applicable Goods and Services Tax (GST). Payments are securely processed through RBI-authorized payment aggregators (e.g. Razorpay) supporting UPI, Credit/Debit Cards, and NetBanking under PCI-DSS Level 1 compliance. Taj Petha does not store banking credentials, card numbers, or UPI PINs. Promotional coupon codes (such as <code className="bg-amber-100/70 text-amber-900 px-1.5 py-0.5 rounded text-xs font-mono">SWEET20</code>) are promotional concessions that may be modified or withdrawn at any time.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              4. Perishable Food Products &amp; Zero Return Policy
            </h2>
            <p>
              In accordance with the <strong>Food Safety and Standards Authority of India (FSSAI)</strong> mandates and the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>, all confections and savouries are classified as perishable goods. <strong>We strictly do not accept physical returns, exchanges, or taste-based refund requests once an order has been delivered and received.</strong> Orders cannot be returned or refunded based on personal taste, sweetness preference, or change of mind.
            </p>
          </section>

          {/* Section 5: Allergen & Cross-Contamination */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0" />
              <h2 className="font-cormorant text-2xl sm:text-3xl font-bold">
                5. Allergen Warning, Facility Cross-Contamination &amp; Customer Responsibility
              </h2>
            </div>
            <p>
              Our confections and namkeens are prepared in kitchens where <strong>tree nuts (cashews, almonds, pistachios), peanuts, dairy/milk solids (khoya, mawa, ghee), melon seeds (magaz), sesame seeds, and trace wheat/gluten</strong> are handled. While we maintain rigorous hygiene practices, we cannot guarantee that any item is 100% free of trace allergens.
            </p>
            <p>
              It is the sole responsibility of the customer and final consumer to carefully review ingredient descriptions prior to purchase and consumption. <strong>Taj Petha strictly disclaims all liability for any allergic reactions, hypersensitivity, medical emergencies, or anaphylaxis resulting from consumption.</strong>
            </p>
          </section>

          {/* Section 6: Health Conditions & Dietary Restrictions */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <HeartPulse className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <h2 className="font-cormorant text-2xl sm:text-3xl font-bold">
                6. Pre-Existing Health Conditions &amp; Voluntary Consumption
              </h2>
            </div>
            <p>
              Taj Petha sweets are traditional Indian confections rich in natural sugars, glucose, ghee, and dense nutrition. Customers with <strong>diabetes, hypertension, cardiac conditions, lactose intolerance, nut allergies, pregnancy-related dietary restrictions, or other medical conditions</strong> must consult their treating physician before consuming our products. Consumption is strictly voluntary and undertaken at the consumer&apos;s own risk. Taj Petha shall not be held liable for any adverse health complications arising from consumption.
            </p>
          </section>

          {/* Section 7: Storage & Spoilage */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <Package className="w-5 h-5 text-emerald-700 flex-shrink-0" />
              <h2 className="font-cormorant text-2xl sm:text-3xl font-bold">
                7. Storage Guidelines &amp; Post-Delivery Spoilage Disclaimer
              </h2>
            </div>
            <p>
              Because our sweets contain zero synthetic chemical preservatives, proper post-delivery storage is critical. Unopened vacuum-sealed packs must be stored in a cool, dry place away from heat and sunlight. Once opened, sweets must immediately be transferred to an airtight container, refrigerated, and consumed within 7–10 days. <strong>Taj Petha accepts zero liability for fermentation, mold development, or gastrointestinal illness resulting from improper home storage, failure to refrigerate, or consumption past the recommended period.</strong>
            </p>
          </section>

          {/* Section 8: 30-Minute Cancellation */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <Clock className="w-5 h-5 text-amber-700 flex-shrink-0" />
              <h2 className="font-cormorant text-2xl sm:text-3xl font-bold">
                8. Order Cancellation Policy (Strict 30-Minute Window)
              </h2>
            </div>
            <p>
              Orders may only be cancelled within <strong>30 minutes of order placement</strong> by immediately notifying our WhatsApp desk at <a href="https://wa.me/919259418994" className="text-petha-amber font-bold hover:underline">+91 92594 18994</a>. After 30 minutes, orders are irreversibly assigned to fresh batch preparation, packaging, and courier manifest creation. <strong>No cancellations, no order modifications, and no refunds will be permitted once the 30-minute window has passed.</strong>
            </p>
          </section>

          {/* Section 9: Courier Transit Insurance & Pure Unboxing Video */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <Truck className="w-5 h-5 text-petha-amber flex-shrink-0" />
              <h2 className="font-cormorant text-2xl sm:text-3xl font-bold">
                9. Third-Party Courier Transit Insurance &amp; Pure Unboxing Video Protocol
              </h2>
            </div>
            <p>
              Every consignment dispatched from our Agra facility is transit-insured through our logistics partners (BlueDart, Delhivery, DTDC). In the event of physical parcel damage, tampering, or transit loss:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li><strong>24-Hour Notice Window:</strong> Claims must be formally submitted within <strong>24 hours of delivery</strong> as tracked on the courier portal.</li>
              <li><strong>Mandatory Pure Unboxing Video:</strong> The customer must provide an uninterrupted, unedited, single-shot video recorded <em>before</em> any courier tape is cut, showing a 360-degree view of the sealed box, the AWB shipping label clearly in focus, and real-time unboxing. Edited, paused, or post-opening videos will result in immediate claim rejection.</li>
              <li><strong>Courier Investigation:</strong> Taj Petha lodges an insurance claim with the courier partner. Corrective action (replacement dispatch or insurance claim credit) is strictly subject to the courier&apos;s verified survey findings. Taj Petha does not issue unconditional instant payouts prior to carrier investigation.</li>
            </ul>
          </section>

          {/* Section 10: Address Accuracy & RTO */}
          <section className="space-y-3">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              10. Customer Delivery Information &amp; Return to Origin (RTO)
            </h2>
            <p>
              The customer is solely responsible for providing an accurate shipping address with landmarks, PIN code, and active telephone number. If a parcel is returned to origin (RTO) due to an incorrect address, recipient unavailability, or refusal to accept delivery at the doorstep, no refund or free reshipment will be granted, as returned perishable confections cannot be restocked and are destroyed upon arrival in Agra.
            </p>
          </section>

          {/* Section 11: Limitation of Liability */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <Scale className="w-5 h-5 text-slate-800 flex-shrink-0" />
              <h2 className="font-cormorant text-2xl sm:text-3xl font-bold">
                11. Limitation of Liability
              </h2>
            </div>
            <p>
              To the maximum extent permitted by applicable Indian law, the total cumulative liability of Taj Petha for any claim, dispute, delivery delay, or damage arising out of any purchase shall be <strong>strictly limited to the actual purchase price paid by the customer for that specific order</strong>. Under no circumstances shall Taj Petha be liable for indirect, incidental, punitive, or consequential damages, including loss of festive celebration, gifting inconvenience, or emotional distress.
            </p>
          </section>

          {/* Section 12: Force Majeure */}
          <section className="space-y-3">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              12. Force Majeure &amp; Festive Logistics Delays
            </h2>
            <p>
              Estimated delivery timelines (e.g. 24–48 hours) are courier transit approximations and do not constitute contractually guaranteed arrival dates. Taj Petha is not liable for carrier delays caused by airline cargo congestion, adverse weather, highway blockades, national holidays, strikes, or peak festive rush (such as Rakhi, Diwali, or Holi). Courier transit delays do not entitle the customer to cancel dispatched consignments or demand instant refunds.
            </p>
          </section>

          {/* Section 13: Anti-Defamation & Chargeback Fraud */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <Lock className="w-5 h-5 text-rose-700 flex-shrink-0" />
              <h2 className="font-cormorant text-2xl sm:text-3xl font-bold">
                13. Anti-Blackmail &amp; Fraudulent Chargeback Policy
              </h2>
            </div>
            <p>
              Filing unjustified bank chargebacks without providing mandatory unboxing documentation, or threatening defamatory reviews and social media extortion to coerce instant cash refunds for consumable goods, constitutes a material breach of these Terms. Taj Petha reserves the right to blacklist offending accounts, report fraudulent transactions to payment gateways, and pursue remedies under Indian civil and cyber laws.
            </p>
          </section>

          {/* Section 14: Indemnification */}
          <section className="space-y-3">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              14. Indemnification &amp; Gifting Liability
            </h2>
            <p>
              The customer assumes full personal responsibility for how purchased sweets are stored, handled, and distributed to third parties, including family members, children, guests, or gift recipients. The customer agrees to indemnify, defend, and hold harmless Taj Petha Confectioners, its owners, and staff from any third-party claims, notices, medical costs, or damages arising from post-delivery food handling, allergen exposure, or consumption.
            </p>
          </section>

          {/* Section 15: Governing Law & Jurisdiction */}
          <section className="space-y-3">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              15. Governing Law &amp; Exclusive Territorial Jurisdiction
            </h2>
            <p>
              These Terms of Service and all transactions conducted on this website shall be governed by and construed in accordance with the laws of the Republic of India. Any dispute, controversy, or claim arising out of or relating to your purchase shall be subject to the <strong>exclusive territorial jurisdiction of the competent courts in Agra, Uttar Pradesh, India</strong>.
            </p>
          </section>

          {/* Section 16: Contact */}
          <section className="space-y-3">
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              16. Customer Support &amp; Grievances
            </h2>
            <p>
              For inquiries or assistance regarding these Terms, please contact our customer desk at{" "}
              <a href="mailto:support@tajpetha.in" className="text-petha-amber font-bold hover:underline">
                support@tajpetha.in
              </a>{" "}
              or via WhatsApp at{" "}
              <a href="https://wa.me/919259418994" className="text-petha-amber font-bold hover:underline">
                +91 92594 18994
              </a>
              .
            </p>
          </section>

        </div>

      </div>
    </div>
  )
}