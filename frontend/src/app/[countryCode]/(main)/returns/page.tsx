import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Returns & Exchanges Policy | Taj Petha",
  description: "Read our returns and exchanges policy for Taj Petha. Learn about eligibility, documentation requirements, and how to submit a claim.",
}

export default function ReturnsPage() {
  return (
    <div className="content-container py-12">
      {/* Hero section */}
      <div className="flex flex-col items-center text-center mb-20">
        <h1 className="font-display text-4xl text-luxury-gold mb-4 tracking-wide uppercase">Returns & Exchanges Policy</h1>
        <div className="h-px w-20 bg-luxury-gold mb-8"></div>
        <p className="text-luxury-charcoal/70 text-sm italic">Last updated: June 15, 2024</p>
      </div>

      {/* Policy Content */}
      <div className="max-w-3xl mx-auto text-luxury-charcoal text-base md:text-lg space-y-12">
        <section>
          <p className="mb-6">
            At Taj Petha, we craft each piece of petha with utmost care and ship it securely to ensure it reaches you in perfect condition. Due to the perishable nature of our products and to safeguard against misuse, we maintain a strict Returns & Exchanges policy:
          </p>
        </section>

        <section>
          <h3 className="font-serif text-xl text-luxury-gold mb-4">1. No Returns on Opened or Consumed Products</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Once a package has been opened or the seal broken, it cannot be returned or exchanged.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-serif text-xl text-luxury-gold mb-4">2. Exchange Eligibility</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Exchanges are granted <span className="font-semibold">only</span> for products damaged <span className="font-semibold">in transit</span>.</li>
            <li>You must report the damage within <span className="font-semibold">2 business days</span> of delivery.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-serif text-xl text-luxury-gold mb-4">3. Documentation Requirements</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><span className="font-semibold">Order Number</span></li>
            <li><span className="font-semibold">Clear Description</span> of the damage (e.g., crushed pieces, torn packaging)</li>
            <li><span className="font-semibold">High‑Resolution Photographs</span> showing both the external packaging and the damaged contents</li>
          </ul>
        </section>

        <section>
          <h3 className="font-serif text-xl text-luxury-gold mb-4">4. Condition for Exchange</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>The item(s) must be returned in their <span className="font-semibold">original, unopened</span> packaging—with all tags, seals, and labels intact—so they can be deemed saleable.</li>
            <li>Packages signed for by anyone other than the intended recipient or those showing signs of mishandling by the recipient are <span className="font-semibold">not eligible</span>.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-serif text-xl text-luxury-gold mb-4">5. Review & Approval</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>All exchange requests undergo a thorough review by our Customer Service team.</li>
            <li>Incomplete documentation or evidence of neglect/incorrect handling will result in claim denial.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-serif text-xl text-luxury-gold mb-4">6. Exchange Processing</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Once approved, replacement shipments are dispatched <span className="font-semibold">within 7 business days</span>.</li>
            <li>You will receive a new tracking link as soon as your replacement is on its way.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-serif text-xl text-luxury-gold mb-4">7. Final Sale</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>All sales are final. No refunds are issued except at Taj Petha's sole discretion, after a complete review of your claim.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-serif text-xl text-luxury-gold mb-4">8. How to Submit a Claim</h3>
          <ul className="list-none pl-6 space-y-4">
            <li className="flex items-center">
              <span className="text-luxury-gold mr-3 text-xl">📧</span>
              <span><span className="font-semibold">Email:</span> <a href="mailto:support@tajpetha.in" className="text-luxury-gold underline hover:text-luxury-darkgold">support@tajpetha.in</a></span>
            </li>
            <li className="flex items-center">
              <span className="text-luxury-gold mr-3 text-xl">☎️</span>
              <span><span className="font-semibold">Phone:</span> +91-92594-18994</span>
            </li>
          </ul>
        </section>

        <div className="bg-luxury-cream/30 p-6 border-l-4 border-luxury-gold">
          <p className="text-luxury-charcoal/90 italic">
            <span className="font-semibold">Note:</span> This strict policy helps us maintain the highest quality standards, ensures fairness for all customers, and protects against fraudulent claims. If you have any questions or require assistance, our support team is here to help—just reach out within the specified time frame!
          </p>
        </div>
        
        <section className="text-center">
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