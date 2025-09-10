export const dynamic = 'force-static'

export default function TermsPage() {
  return (
    <div className="content-container py-12">
      {/* Hero section */}
      <div className="flex flex-col items-center text-center mb-20">
        <h1 className="font-display text-4xl text-luxury-gold mb-4 tracking-wide uppercase">Terms & Conditions</h1>
        <div className="h-px w-20 bg-luxury-gold mb-8"></div>
        <p className="text-luxury-charcoal/70 text-sm italic">Last updated: June 15, 2024</p>
      </div>

      {/* Policy Content */}
      <div className="max-w-3xl mx-auto text-luxury-charcoal text-base md:text-lg space-y-12">
        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">1. Introduction</h2>
          <p className="mb-4">
            Welcome to <strong><a href="https://tajpetha.in" className="text-luxury-gold hover:text-luxury-darkgold">tajpetha.in</a></strong> (the "Website"), operated by Taj Petha ("we," "us," or "our"). These Terms & Conditions govern your use of our Website and any purchases you make. By accessing the Website, placing an order, or using our services, you agree to be bound by these Terms. Please read them carefully before proceeding with any order.
          </p>
        </section>

        <div className="h-px w-full bg-luxury-gold/20 my-10"></div>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">2. Products & Ordering</h2>
          <ol className="list-decimal pl-6 space-y-3">
            <li><span className="font-semibold text-luxury-gold">Product Description:</span> We make every effort to display our pethas as accurately as possible. However, colors, packaging, and appearance may slightly vary due to the artisanal nature of our products and your device display settings.</li>
            <li><span className="font-semibold text-luxury-gold">Availability:</span> All products are subject to availability. We reserve the right to limit quantities or discontinue products without notice.</li>
            <li><span className="font-semibold text-luxury-gold">Prices:</span> All prices are in Indian Rupees (INR) and include applicable taxes. Shipping costs are calculated and shown separately at checkout.</li>
          </ol>
        </section>

        <div className="h-px w-full bg-luxury-gold/20 my-10"></div>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">3. User Eligibility</h2>
          <p className="mb-4">
            By placing an order, you represent and warrant that:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>You are at least <strong>18 years old</strong>.</li>
            <li>You possess the legal authority to enter into binding contracts.</li>
            <li>You are using the Website for personal, non-commercial purposes.</li>
          </ul>
        </section>

        <div className="h-px w-full bg-luxury-gold/20 my-10"></div>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">4. Order Process</h2>
          <ol className="list-decimal pl-6 space-y-3">
            <li><span className="font-semibold text-luxury-gold">Order Placement:</span> After placing an order, you will receive an order acknowledgment email confirming receipt of your order.</li>
            <li><span className="font-semibold text-luxury-gold">Order Acceptance:</span> Your order represents an offer to purchase. We reserve the right to accept or decline your order at our discretion.</li>
            <li><span className="font-semibold text-luxury-gold">Order Confirmation:</span> A contract is formed only when we send you an Order Confirmation email and process your payment.</li>
            <li><span className="font-semibold text-luxury-gold">Order Cancellation:</span> We may cancel orders due to product unavailability, pricing errors, or suspected fraudulent activity.</li>
          </ol>
        </section>

        <div className="h-px w-full bg-luxury-gold/20 my-10"></div>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">5. Payment & Security</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><span className="font-semibold text-luxury-gold">Payment Methods:</span> We accept Credit/Debit Cards, UPI, Net Banking, and other payment methods as displayed on our checkout page.</li>
            <li><span className="font-semibold text-luxury-gold">Payment Security:</span> All payment information is encrypted using industry-standard SSL technology. We do not store your complete payment card details.</li>
            <li><span className="font-semibold text-luxury-gold">Payment Verification:</span> To protect against fraud, we reserve the right to verify payment details and shipping address before processing any order.</li>
          </ul>
        </section>

        <div className="h-px w-full bg-luxury-gold/20 my-10"></div>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">6. Shipping & Delivery</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><span className="font-semibold text-luxury-gold">Delivery Timeframes:</span> We aim to dispatch orders within 1 business day of confirmation. Estimated delivery times are:
              <ul className="list-disc pl-6 mt-1">
                <li>Urban & Metro Areas: 3–7 business days</li>
                <li>Remote Locations: 10–12 business days</li>
              </ul>
            </li>
            <li><span className="font-semibold text-luxury-gold">Address Accuracy:</span> You are responsible for providing accurate shipping information. We cannot be held liable for deliveries delayed or missed due to incorrect address details.</li>
            <li><span className="font-semibold text-luxury-gold">Signature Requirement:</span> All deliveries require a signature upon receipt to ensure proper handling.</li>
          </ul>
        </section>

        <div className="h-px w-full bg-luxury-gold/20 my-10"></div>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">7. Perishable Food Policy</h2>
          <p className="mb-4">
            Our pethas are perishable food items that require proper handling after delivery:
          </p>
          <ul className="list-disc pl-6 space-y-3">
            <li><span className="font-semibold text-luxury-gold">Storage:</span> Upon receipt, store pethas in a cool, dry place. Check package for specific storage instructions.</li>
            <li><span className="font-semibold text-luxury-gold">Shelf Life:</span> Our pethas have a limited shelf life as indicated on the packaging. Consume within this period for optimal taste and quality.</li>
            <li><span className="font-semibold text-luxury-gold">Food Safety:</span> Do not consume if packaging is damaged or if there are visible signs of spoilage, regardless of the expiration date.</li>
          </ul>
        </section>

        <div className="h-px w-full bg-luxury-gold/20 my-10"></div>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">8. Returns & Exchanges</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><span className="font-semibold text-luxury-gold">No Returns on Opened Products:</span> Due to the perishable nature of our products, we cannot accept returns on opened or consumed items.</li>
            <li><span className="font-semibold text-luxury-gold">Transit Damage:</span> If your order arrives damaged, please contact us within 2 business days of delivery with:
              <ul className="list-disc pl-6 mt-1">
                <li>Order number</li>
                <li>Clear description of the issue</li>
                <li>Photos showing the damage</li>
              </ul>
            </li>
            <li><span className="font-semibold text-luxury-gold">Resolution:</span> After verification, we may offer a replacement shipment or refund at our discretion.</li>
          </ul>
        </section>

        <div className="h-px w-full bg-luxury-gold/20 my-10"></div>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">9. Intellectual Property</h2>
          <p className="mb-4">
            All content, including text, graphics, logos, images, and software on the Website is the property of Taj Petha and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written permission.
          </p>
        </section>

        <div className="h-px w-full bg-luxury-gold/20 my-10"></div>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">10. User Content & Reviews</h2>
          <p className="mb-4">
            By submitting reviews, comments, or feedback on our Website:
          </p>
          <ul className="list-disc pl-6 space-y-3">
            <li>You grant us a non-exclusive, royalty-free license to use, reproduce, and display your content.</li>
            <li>You warrant that your content is accurate, non-confidential, and does not infringe on third-party rights.</li>
            <li>We reserve the right to edit, refuse, or remove content that violates these Terms or is otherwise objectionable.</li>
          </ul>
        </section>

        <div className="h-px w-full bg-luxury-gold/20 my-10"></div>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">11. Limitation of Liability</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li>To the maximum extent permitted by law, Taj Petha shall not be liable for any indirect, incidental, special, consequential, or punitive damages.</li>
            <li>Our total liability for any claim shall not exceed the purchase price of the products that gave rise to such claim.</li>
            <li>Nothing in these Terms excludes or limits our liability for personal injury or death resulting from our negligence.</li>
          </ul>
        </section>

        <div className="h-px w-full bg-luxury-gold/20 my-10"></div>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">12. Disclaimers</h2>
          <p className="mb-4">
            The Website and all products are provided "as is" without warranty of any kind, either express or implied. While we take care to ensure product information is accurate, food ingredients and nutritional content may vary slightly. Customers with food allergies or dietary restrictions should review product information carefully before purchasing.
          </p>
        </section>

        <div className="h-px w-full bg-luxury-gold/20 my-10"></div>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">13. Force Majeure</h2>
          <p className="mb-4">
            We shall not be liable for any delay or failure to perform resulting from causes outside our reasonable control, including but not limited to acts of God, natural disasters, pandemic, labor disputes, or governmental actions.
          </p>
        </section>

        <div className="h-px w-full bg-luxury-gold/20 my-10"></div>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">14. Governing Law</h2>
          <p className="mb-4">
            These Terms shall be governed by and construed in accordance with the laws of India. Any dispute arising under these Terms shall be subject to the exclusive jurisdiction of the courts in Agra, Uttar Pradesh, India.
          </p>
        </section>

        <div className="h-px w-full bg-luxury-gold/20 my-10"></div>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">15. Modifications to Terms</h2>
          <p className="mb-4">
            We may modify these Terms at any time by posting updates on this page. Your continued use of the Website after any changes constitutes your acceptance of the revised Terms. We recommend reviewing these Terms periodically.
          </p>
        </section>

        <div className="h-px w-full bg-luxury-gold/20 my-10"></div>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">16. Contact Information</h2>
          <p className="mb-4">
            If you have questions regarding these Terms & Conditions, please contact us:
          </p>
          <ul className="list-none pl-0 space-y-3">
            <li className="flex items-center">
              <span className="text-luxury-gold mr-3 text-xl">📧</span>
              <span><span className="font-semibold">Email:</span> <a href="mailto:support@tajpetha.in" className="text-luxury-gold underline hover:text-luxury-darkgold">support@tajpetha.in</a></span>
            </li>
            <li className="flex items-center">
              <span className="text-luxury-gold mr-3 text-xl">🌐</span>
              <span><span className="font-semibold">Website:</span> <a href="https://tajpetha.in" className="text-luxury-gold underline hover:text-luxury-darkgold">tajpetha.in</a></span>
            </li>
            <li className="flex items-center">
              <span className="text-luxury-gold mr-3 text-xl">📞</span>
              <span><span className="font-semibold">Phone:</span> +91‑92594‑18994</span>
            </li>
          </ul>
        </section>

        <section className="border-t border-luxury-gold/20 pt-8 mt-12">
          <p className="text-center">
            Thank you for choosing Taj Petha. We look forward to serving you with the finest Agra pethas and an exceptional customer experience.
          </p>
        </section>
        
        <section className="text-center">
          <div className="flex justify-center mt-6">
            <a 
              href="https://wa.me/919259418994?text=Hello%20Taj%20Petha%2C%20I%20have%20a%20question%20about%20your%20terms%20and%20conditions."
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