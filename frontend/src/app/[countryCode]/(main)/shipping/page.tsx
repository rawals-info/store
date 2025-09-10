export const dynamic = 'force-static'

export default function ShippingPage() {
  return (
    <div className="content-container py-12">
      {/* Hero section */}
      <div className="flex flex-col items-center text-center mb-20">
        <h1 className="font-display text-4xl text-luxury-gold mb-4 tracking-wide uppercase">Shipping & Delivery</h1>
        <div className="h-px w-20 bg-luxury-gold mb-8"></div>
        <p className="text-luxury-charcoal/70 text-sm italic">Last updated: June 15, 2024</p>
      </div>

      {/* Policy Content */}
      <div className="max-w-3xl mx-auto text-luxury-charcoal text-base md:text-lg space-y-12">
        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-6">
            At Taj Petha, we take every precaution to ensure your Agra pethas arrive fresh and intact:
          </h2>
          
          <ul className="list-disc pl-6 space-y-4">
            <li>
              <span className="font-semibold text-luxury-gold">Fast Processing:</span>
              <p className="mt-1">
                All domestic orders are packed and dispatched from our Agra warehouse within <span className="font-semibold">1 business day</span> of order confirmation.
              </p>
            </li>
            
            <li>
              <span className="font-semibold text-luxury-gold">Delivery Timelines:</span>
              <ul className="list-disc pl-6 mt-1 space-y-1">
                <li><span className="font-semibold">Urban & Metro Areas:</span> 3–7 business days</li>
                <li><span className="font-semibold">Remote Locations:</span> 10–12 business days</li>
              </ul>
            </li>
            
            <li>
              <span className="font-semibold text-luxury-gold">Reputable Couriers:</span>
              <p className="mt-1">
                We partner with leading courier services for secure handling. Once your order ships, you'll receive a tracking link showing the expected delivery date.
              </p>
            </li>
            
            <li>
              <span className="font-semibold text-luxury-gold">Signature Requirement:</span>
              <p className="mt-1">
                For security and quality control, all packages require a signature upon delivery. If you anticipate being unavailable, please specify an alternate recipient (family member, colleague, or neighbour) in the "Delivery Instructions" field at checkout. We strongly recommend that you—or your designee—sign for the package, as Taj Petha cannot assume responsibility for parcels signed by anyone other than the intended recipient.
              </p>
            </li>
          </ul>
        </section>

        <div className="h-px w-full bg-luxury-gold/20 my-10"></div>

        <section>
          <h3 className="font-display text-2xl text-luxury-charcoal mb-6">Strict Replacement & Refund Policy</h3>
          <p className="mb-6">
            Because petha is a perishable food item, we cannot accept returns. To ensure fairness and guard against fraudulent claims, all replacement or refund requests must be submitted with proper documentation and within a strict time frame:
          </p>
          
          <ul className="list-disc pl-6 space-y-4">
            <li>
              <span className="font-semibold text-luxury-gold">Time Frame for Claims:</span>
              <p className="mt-1">
                Report any issue within <span className="font-semibold">2 business days</span> of delivery.
              </p>
            </li>
            
            <li>
              <span className="font-semibold text-luxury-gold">How to Submit a Claim:</span>
              <ul className="list-none pl-6 mt-2 space-y-2">
                <li className="flex items-center">
                  <span className="text-luxury-gold mr-2">📧</span>
                  <span><span className="font-semibold">Email:</span> <a href="mailto:support@tajpetha.in" className="text-luxury-gold underline hover:text-luxury-darkgold">support@tajpetha.in</a></span>
                </li>
                <li className="flex items-center">
                  <span className="text-luxury-gold mr-2">☎️</span>
                  <span><span className="font-semibold">Phone:</span> +91-92594-18994</span>
                </li>
              </ul>
            </li>
            
            <li>
              <span className="font-semibold text-luxury-gold">Required Information:</span>
              <ul className="list-disc pl-6 mt-1 space-y-1">
                <li><span className="font-semibold">Order Number</span></li>
                <li><span className="font-semibold">Detailed Description</span> of the issue (e.g., "item missing," "broken pieces," etc.)</li>
                <li><span className="font-semibold">High‑Resolution Photographs</span> clearly showing the problem (e.g., damaged packaging, incorrect items, foreign objects).</li>
              </ul>
            </li>
            
            <li>
              <span className="font-semibold text-luxury-gold">Review Process:</span>
              <ul className="list-disc pl-6 mt-1 space-y-1">
                <li>All submissions are reviewed by our Customer Service team.</li>
                <li>Incomplete or illegible documentation may result in claim denial.</li>
                <li>We reserve the right to request additional evidence or to inspect returned packaging materials.</li>
              </ul>
            </li>
            
            <li>
              <span className="font-semibold text-luxury-gold">Resolution at Our Discretion:</span>
              <p className="mt-1">
                After verifying the claim, we may offer one of the following:
              </p>
              <ul className="list-disc pl-6 mt-1 space-y-1">
                <li><span className="font-semibold">Replacement Shipment</span> at no additional cost</li>
                <li><span className="font-semibold">Partial or Full Refund</span> to the original payment method</li>
              </ul>
            </li>
          </ul>
          
          <div className="bg-luxury-cream/30 p-6 mt-8 border-l-4 border-luxury-gold">
            <p className="text-luxury-charcoal/90 italic">
              <span className="font-semibold">Note:</span> Claims made after 2 business days or without sufficient proof will not be eligible for replacement or refund. This policy helps us uphold product quality and protect against fraudulent claims—such as false reports of "bricks" or non‑delivery—which are, unfortunately, on the rise.
            </p>
          </div>
        </section>
        
        <div className="h-px w-full bg-luxury-gold/20 my-10"></div>
        
        <section className="text-center">
          <p className="text-luxury-charcoal font-serif">
            If you have any questions about shipping, delivery, or our replacement policy, please reach out to our support team. We're here to ensure your Taj Petha experience remains as sweet and satisfying as possible!
          </p>
          
          <div className="flex justify-center mt-6">
            <a 
              href="https://wa.me/919259418994?text=Hello%20Taj%20Petha%2C%20I%20have%20a%20question%20about%20my%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-[#25D366] hover:bg-[#20BD5C] text-white px-6 py-3 rounded-md transition-colors duration-300 shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
              </svg>
              <span>Chat with us on WhatsApp</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
} 