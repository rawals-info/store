import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shipping Policy | Imperial Craft Of India",
  description: "Read our luxury shipping policy for Imperial Craft Of India. Learn about couriers, packaging, insurance, and international delivery.",
}

export default function ShippingPage() {
  return (
    <div className="content-container py-12">
      {/* Hero section */}
      <div className="flex flex-col items-center text-center mb-20">
        <h1 className="font-display text-4xl text-luxury-gold mb-4 tracking-wide uppercase">Shipping Policy</h1>
        <div className="h-px w-20 bg-luxury-gold mb-8"></div>
        <p className="text-luxury-charcoal/70 text-sm italic">Last updated: June 29, 2025</p>
      </div>

      {/* Policy Content */}
      <div className="max-w-3xl mx-auto text-luxury-charcoal text-base md:text-lg space-y-12">
        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">Imperial Craft of India – Shipping Policy</h2>
        </section>

        <section>
          <h3 className="font-serif text-xl text-luxury-gold mb-2">1. Shipping Methods & Partners</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><span className="font-semibold text-luxury-gold">Primary Couriers:</span> DHL & FedEx
              <ul className="list-disc pl-6">
                <li><span className="font-semibold">Transit Time:</span> Approximately <span className="font-semibold">10 business days</span> to most destinations.</li>
                <li><span className="font-semibold">Tracking:</span> Real‑time tracking provided upon dispatch.</li>
              </ul>
            </li>
            <li><span className="font-semibold text-luxury-gold">Alternate Carrier:</span> India Post
              <ul className="list-disc pl-6">
                <li>Used when DHL/FedEx cannot service your area.</li>
                <li>Transit times vary by destination.</li>
              </ul>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="font-serif text-xl text-luxury-gold mb-2">2. Special‑Case Shipments</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><span className="font-semibold text-luxury-gold">Oversized Parcels (Over 48″ Diameter):</span>
              <ul className="list-disc pl-6">
                <li><span className="font-semibold">Sea Cargo:</span> Delivered to the <span className="font-semibold">nearest seaport</span> specified by the buyer.</li>
                <li><span className="font-semibold">Transit Time:</span> <span className="font-semibold">6–8 weeks</span> from dispatch.</li>
                <li><span className="font-semibold">Port‑to‑Door:</span>
                  <ul className="list-disc pl-6">
                    <li>Buyer arranges inland delivery from seaport, or</li>
                    <li>We can handle door delivery for an <span className="font-semibold">additional fee</span>—email <a href="mailto:support@imperialcraft.in" className="text-luxury-gold underline hover:text-luxury-darkgold">support@imperialcraft.in</a> with your full address and chosen seaport for a quote.</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li><span className="font-semibold text-luxury-gold">PO Boxes & Restricted Destinations:</span>
              <ul className="list-disc pl-6">
                <li>Deliveries to PO Boxes are <span className="font-semibold">not</span> accepted.</li>
                <li><span className="font-semibold">Russia & Brazil:</span> Shipments require a <span className="font-semibold">firm or business name</span>—we cannot ship to individual names.</li>
              </ul>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="font-serif text-xl text-luxury-gold mb-2">3. Packaging Standards</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><span className="font-semibold text-luxury-gold">By Air (≤ 48″ Diameter):</span>
              <ul className="list-disc pl-6">
                <li>Corrugated and PVC box, reinforced with bubble wrap and foam sheets.</li>
              </ul>
            </li>
            <li><span className="font-semibold text-luxury-gold">By Sea (&gt; 48″ Diameter):</span>
              <ul className="list-disc pl-6">
                <li>Wrapped in wood wool, secured with rope, covered in jute cloth, and encased in a sturdy wooden crate.</li>
              </ul>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="font-serif text-xl text-luxury-gold mb-2">4. Insurance & Liability</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><span className="font-semibold text-luxury-gold">All shipments</span> are <span className="font-semibold">fully insured</span> against loss and damage.</li>
            <li><span className="font-semibold text-luxury-gold">Packaging Quality:</span> We use professional-grade materials to minimize transit risk.</li>
            <li><span className="font-semibold text-luxury-gold">Insurance Claims:</span> In the unlikely event of damage in transit, follow our <a href="/returns" className="text-luxury-gold underline hover:text-luxury-darkgold">Return & Refund Policy</a> for claim procedures.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-serif text-xl text-luxury-gold mb-2">5. Customs, Duties & Taxes</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><span className="font-semibold text-luxury-gold">Customs Clearance:</span> Subject to your country's import regulations.</li>
            <li><span className="font-semibold text-luxury-gold">Duties & Taxes:</span>
              <ul className="list-disc pl-6">
                <li>Payable by the customer upon delivery.</li>
                <li>We are <span className="font-semibold">not</span> responsible for customs delays or fees.</li>
                <li><span className="font-semibold">Advice:</span> Contact your local customs office for an estimate of import charges before ordering.</li>
              </ul>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="font-serif text-xl text-luxury-gold mb-2">Contact & Support</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><span className="font-semibold text-luxury-gold">Email:</span> <a href="mailto:support@imperialcraft.in" className="text-luxury-gold underline hover:text-luxury-darkgold">support@imperialcraft.in</a></li>
            <li><span className="font-semibold text-luxury-gold">Phone:</span> +91 XXXXXXXXXX</li>
            <li><span className="font-semibold text-luxury-gold">Business Hours:</span> Mon–Fri, 10 AM–6 PM IST</li>
          </ul>
        </section>
      </div>
    </div>
  )
} 