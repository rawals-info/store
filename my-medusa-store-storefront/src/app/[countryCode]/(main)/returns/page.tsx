import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Return & Refund Policy | Imperial Craft Of India",
  description: "Read our luxury return and refund policy for Imperial Craft Of India. Hassle-free returns, clear eligibility, and premium support.",
}

export default function ReturnsPage() {
  return (
    <div className="content-container py-12">
      {/* Hero section */}
      <div className="flex flex-col items-center text-center mb-20">
        <h1 className="font-display text-4xl text-luxury-gold mb-4 tracking-wide uppercase">Return & Refund Policy</h1>
        <div className="h-px w-20 bg-luxury-gold mb-8"></div>
        <p className="text-luxury-charcoal/70 text-sm italic">Last updated: June 29, 2025</p>
      </div>

      {/* Policy Content */}
      <div className="max-w-3xl mx-auto text-luxury-charcoal text-base md:text-lg space-y-12">
        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">Imperial Craft of India – Return & Refund Policy</h2>
        </section>

        <section>
          <h3 className="font-serif text-xl text-luxury-gold mb-2">1. Eligibility for Returns</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><span className="font-semibold text-luxury-gold">Timeframe:</span> Requests must be made within <span className="font-semibold">7 calendar days</span> of delivery.</li>
            <li><span className="font-semibold text-luxury-gold">Condition:</span> Products must be returned <span className="font-semibold">unused</span>, in their <span className="font-semibold">original packaging</span>, with all tags and accessories.</li>
            <li><span className="font-semibold text-luxury-gold">Return Shipping:</span> Buyer pays return shipping. Please use a <span className="font-semibold">trackable courier</span> and insure your shipment—Imperial Craft of India is not liable for lost or damaged returns.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-serif text-xl text-luxury-gold mb-2">2. How to Initiate a Return</h3>
          <ol className="list-decimal pl-6 space-y-1">
            <li><span className="font-semibold text-luxury-gold">Email Support:</span> Send your <span className="font-semibold">order number</span>, reason for return, and photos (if applicable) to <a href="mailto:support@imperialcraft.in" className="text-luxury-gold underline hover:text-luxury-darkgold">support@imperialcraft.in</a> within 7 days of delivery.</li>
            <li><span className="font-semibold text-luxury-gold">Receive RMA:</span> We will reply with a <span className="font-semibold">Return Merchandise Authorization (RMA)</span> and shipping instructions.</li>
            <li><span className="font-semibold text-luxury-gold">Ship the Item:</span> Affix the RMA clearly on the package and send via your chosen courier.</li>
            <li><span className="font-semibold text-luxury-gold">Inspection & Confirmation:</span> Once we receive and inspect the item, you will be notified and your refund will be processed.</li>
          </ol>
        </section>

        <section>
          <h3 className="font-serif text-xl text-luxury-gold mb-2">3. Cancellations (Pre‑Dispatch)</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><span className="font-semibold text-luxury-gold">Timing:</span> Orders may be canceled in full <span className="font-semibold">before dispatch</span>.</li>
            <li><span className="font-semibold text-luxury-gold">Process:</span> Email <a href="mailto:support@imperialcraft.in" className="text-luxury-gold underline hover:text-luxury-darkgold">support@imperialcraft.in</a> with your order number.</li>
            <li><span className="font-semibold text-luxury-gold">Refund:</span> Full amount refunded within <span className="font-semibold">5–10 working days</span> of cancellation confirmation.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-serif text-xl text-luxury-gold mb-2">4. Refund Processing</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><span className="font-semibold text-luxury-gold">Method:</span> Refunds are issued via <span className="font-semibold">Bank NEFT/RTGS</span> or <span className="font-semibold">PayPal</span>, matching your original payment method.</li>
            <li><span className="font-semibold text-luxury-gold">Timeline:</span> Expect <span className="font-semibold">5–10 working days</span> from our approval of your return.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-serif text-xl text-luxury-gold mb-2">5. Damaged or Defective Items</h3>
          <p>If your item arrives damaged or is found defective within 7 days:</p>
          <ol className="list-decimal pl-6 space-y-1">
            <li><span className="font-semibold text-luxury-gold">Document Damage:</span>
              <ul className="list-disc pl-6">
                <li>Photograph the <span className="font-semibold">external packaging</span> before opening.</li>
                <li>Photograph the <span className="font-semibold">damaged item</span> immediately.</li>
              </ul>
            </li>
            <li><span className="font-semibold text-luxury-gold">Notify Support & Carrier:</span>
              <ul className="list-disc pl-6">
                <li>Email <a href="mailto:support@imperialcraft.in" className="text-luxury-gold underline hover:text-luxury-darkgold">support@imperialcraft.in</a> with your order number, damage details, and photos.</li>
                <li>Notify the shipping carrier (FedEx, DHL, etc.) per their damage‑claim process.</li>
              </ul>
            </li>
            <li><span className="font-semibold text-luxury-gold">Claim Handling:</span>
              <ul className="list-disc pl-6">
                <li>We will file an insurance claim on your behalf.</li>
                <li>If additional information is required, we will request it promptly.</li>
              </ul>
            </li>
            <li><span className="font-semibold text-luxury-gold">Resolution Options:</span>
              <ul className="list-disc pl-6">
                <li><span className="font-semibold">Replacement:</span> A new item shipped at no charge.</li>
                <li><span className="font-semibold">Full Refund:</span> Issued upon claim approval.</li>
              </ul>
            </li>
          </ol>
          <div className="bg-luxury-cream/60 border-l-4 border-luxury-gold p-4 my-4 text-sm text-luxury-charcoal/80">
            <span className="font-semibold text-luxury-gold">Note:</span> Damage claims must be submitted within <span className="font-semibold">3 calendar days</span> of delivery. Claims beyond this period cannot be honored.
          </div>
        </section>

        <section>
          <h3 className="font-serif text-xl text-luxury-gold mb-2">Contact & Support</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><span className="font-semibold text-luxury-gold">Email (All Inquiries – Returns, Claims & Cancellations):</span> <a href="mailto:support@imperialcraft.in" className="text-luxury-gold underline hover:text-luxury-darkgold">support@imperialcraft.in</a></li>
            <li><span className="font-semibold text-luxury-gold">Phone:</span> +91 XXXXXXXXXX</li>
            <li><span className="font-semibold text-luxury-gold">Business Hours:</span> Mon–Fri, 10 AM–6 PM IST</li>
          </ul>
          <p className="mt-4">For assistance or status updates, please reach out—our team is here to ensure your satisfaction!</p>
        </section>
      </div>
    </div>
  )
} 