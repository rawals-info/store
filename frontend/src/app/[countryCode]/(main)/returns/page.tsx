import Link from "next/link"
import Breadcrumb from "@modules/common/components/breadcrumb"
import { ShieldCheck, Package, AlertCircle, Clock, Truck, FileText, Video, Camera, Ban } from "lucide-react"
import { Metadata } from "next"

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: "Cancellation, Returns & Transit Claims Policy | Taj Petha",
  description: "Official cancellation, perishable food non-returnability, 30-minute cutoff, mandatory unboxing video, and courier transit insurance claims policy of Taj Petha.",
}

export default function ReturnsPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-6 sm:py-10 font-jakarta">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-3xl border border-amber-100/90 p-5 sm:p-7 shadow-xs text-center">
          <Breadcrumb
            items={[{ label: "Cancellation & Transit Claims", isCurrent: true }]}
            countryCode="in"
            className="p-0 bg-transparent border-0 mb-3 justify-center"
          />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-amber-950 text-[11px] font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-petha-amber" />
            <span>Transit Insured Shipments &amp; Food Safety Standards</span>
          </div>

          <h1 className="font-cormorant text-2xl sm:text-4xl font-bold text-slate-900 leading-tight">
            Cancellation, Returns &amp; Transit Claims Policy
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto">
            Strict terms governing fresh perishable sweets, mandatory 30-minute cancellation cutoff, pure unboxing video requirements, and courier transit insurance claims.
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl border border-amber-100/90 p-5 sm:p-8 shadow-xs space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
          
          {/* Section 1: 30-Minute Cancellation Window */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <Clock className="w-5 h-5 text-amber-700 flex-shrink-0" />
              <h2 className="font-cormorant text-2xl sm:text-3xl font-bold">
                1. Strict 30-Minute Order Cancellation Policy
              </h2>
            </div>
            <p>
              Because Taj Petha products are freshly cooked daily and packed in custom protective vacuum boxes, orders enter the kitchen preparation and packaging queue immediately upon order placement:
            </p>
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 space-y-2">
              <p className="font-bold text-amber-950">
                Cancellation Window: Strictly within 30 minutes of placing your order.
              </p>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                You may request a cancellation only by immediately contacting our customer desk via WhatsApp at{" "}
                <a href="https://wa.me/919259418994" className="text-petha-amber font-bold hover:underline">
                  +91 92594 18994
                </a>{" "}
                within 30 minutes of checkout.
              </p>
              <p className="text-xs font-semibold text-rose-700 pt-1">
                *After 30 minutes, orders are permanently assigned to halwai batch cooking and packaging. No cancellations, no order modifications, and no refunds will be accepted under any circumstances once the 30-minute window has elapsed.
              </p>
            </div>
          </section>

          {/* Section 2: Perishable Food Exemption */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <Ban className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <h2 className="font-cormorant text-2xl sm:text-3xl font-bold">
                2. Perishable Food Products (No Return / No Replacement)
              </h2>
            </div>
            <p>
              All sweets (Petha, Dalmoth, Namkeen, Peanuts) are artisanal, edible foodstuffs prepared without artificial chemical preservatives. Under the <strong>Food Safety and Standards Authority of India (FSSAI)</strong> mandates and the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>Edible food products are strictly non-returnable, non-exchangeable, and non-refundable once delivered.</li>
              <li>We cannot accept returns or issue refunds based on subjective taste preference, personal sweetness expectations, texture preferences, or incorrect items selected by the customer.</li>
              <li>Orders once accepted from the delivery carrier cannot be returned for food hygiene and contamination-prevention reasons.</li>
            </ul>
          </section>

          {/* Section 3: Pure Unboxing Video Mandate */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <Video className="w-5 h-5 text-petha-amber flex-shrink-0" />
              <h2 className="font-cormorant text-2xl sm:text-3xl font-bold">
                3. Mandatory &quot;Pure Unboxing Video&quot; Requirement
              </h2>
            </div>
            <p>
              To eliminate fraudulent damage claims and satisfy insurance survey criteria, any claim regarding transit damage, leakage, or missing contents strictly requires a <strong>Pure Unboxing Video</strong>. The video must adhere to all of the following rules:
            </p>
            <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-2.5 text-xs sm:text-sm text-slate-800">
              <p className="font-bold text-slate-900">Strict Video Verification Standards:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Continuous Single Shot:</strong> The recording must be one continuous, unedited, uncut video from beginning to end. Videos with cuts, pauses, fast-forwarding, or post-production edits are immediately disqualified.</li>
                <li><strong>Pre-Opening View:</strong> The video must start <em>before</em> any courier tape, outer seal, or packaging material is cut or tampered with.</li>
                <li><strong>360-Degree Box Inspection:</strong> The customer must rotate the sealed parcel in front of the camera, clearly demonstrating that all sides are intact and uncut.</li>
                <li><strong>AWB Label in Clear Focus:</strong> The courier shipping label (showing the tracking barcode, recipient name, address, and consignment number) must be shown clearly in focus.</li>
                <li><strong>Real-Time Unboxing:</strong> The actual opening of the outer box, removal of protective wrapping, and inspection of the sealed sweet boxes must be captured inside the continuous shot.</li>
              </ul>
              <p className="text-rose-700 font-semibold pt-1">
                Notice: Videos captured after the outer packaging has already been cut or opened, paused videos, blurry clips, or poorly lit recordings will be rejected, and the transit claim will be automatically invalidated.
              </p>
            </div>
          </section>

          {/* Section 4: Required Photos */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <Camera className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <h2 className="font-cormorant text-2xl sm:text-3xl font-bold">
                4. Mandatory Packaging &amp; Product Photographs
              </h2>
            </div>
            <p>
              Along with the continuous unboxing video, customers must submit multiple clear, high-resolution photographs:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-slate-700">
              <li>A clear photo of the outer cardboard carton displaying the printed courier shipping label (AWB).</li>
              <li>Close-up photos of the specific damaged, crushed, torn, or leaking section of the outer box.</li>
              <li>A photo of the inner vacuum-sealed sweet box showing whether the seal integrity was compromised.</li>
              <li>A photo showing the product batch details and manufacturing seal printed on the sweet container.</li>
            </ol>
          </section>

          {/* Section 5: Courier Transit Insurance & Investigation */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <Truck className="w-5 h-5 text-petha-amber flex-shrink-0" />
              <h2 className="font-cormorant text-2xl sm:text-3xl font-bold">
                5. Third-Party Courier Transit Insurance &amp; Claim Process
              </h2>
            </div>
            <p>
              Every consignment dispatched from our Agra facility is insured through our third-party logistics partners (BlueDart, Delhivery, DTDC). In the event of transit loss or physical damage:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-700">
              <li>
                <strong>24-Hour Strict Notice:</strong> The claim, video, and photos must be submitted to our customer desk within <strong>24 hours of delivery</strong> as recorded on the courier tracking portal. Claims submitted after 24 hours are time-barred due to food perishability.
              </li>
              <li>
                <strong>Courier Insurance Survey:</strong> Taj Petha forwards the evidence directly to the courier partner&apos;s insurance and survey claims department to initiate an official investigation.
              </li>
              <li>
                <strong>Action Dependent on Courier Findings:</strong> Any action (such as dispatching a replacement batch or issuing a claim credit) is taken strictly based on the courier partner&apos;s verified survey report. Taj Petha does not issue instant out-of-pocket cash payouts prior to carrier verification.
              </li>
              <li>
                <strong>Resolution Timeline:</strong> Carrier insurance surveys typically conclude within 3–5 business days following formal claim submission.
              </li>
            </ul>
          </section>

          {/* Section 6: Storage & Spoilage Disclaimer */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <h2 className="font-cormorant text-2xl sm:text-3xl font-bold">
                6. Post-Delivery Storage &amp; Spoilage Disclaimer
              </h2>
            </div>
            <p>
              Our confections are made without chemical preservatives. Upon receipt, customers are strictly responsible for storing unopened packs in a cool, dry place away from heat and sunlight. Once opened, sweets must be transferred to an airtight container and refrigerated, to be consumed within 7–10 days. Taj Petha disclaims all liability for sweets that spoil, ferment, or develop mold due to improper home storage, failure to refrigerate, exposure to moisture, or consumption past the recommended period.
            </p>
          </section>

          {/* Section 7: Failed Deliveries & RTO */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <Package className="w-5 h-5 text-slate-700 flex-shrink-0" />
              <h2 className="font-cormorant text-2xl sm:text-3xl font-bold">
                7. Incorrect Address &amp; Return to Origin (RTO) Policy
              </h2>
            </div>
            <p>
              Customers must supply an accurate shipping address with landmarks, PIN code, and active telephone number. If a parcel is returned to origin (RTO) due to an incomplete address, phone unreachable, recipient unavailable, or refusal to accept at the doorstep, no refund or free reshipment will be issued. Because perishable sweets spoil during extended return transit, all RTO parcels are destroyed upon arrival in Agra.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}