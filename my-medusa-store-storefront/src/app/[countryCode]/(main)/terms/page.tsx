import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms & Conditions | Imperial Craft Of India",
  description: "Read our terms and conditions for Imperial Craft Of India. Learn about your rights and responsibilities when using our services and products.",
}

export default function TermsPage() {
  return (
    <div className="content-container py-12">
      {/* Hero section */}
      <div className="flex flex-col items-center text-center mb-20">
        <h1 className="font-display text-4xl text-luxury-gold mb-4 tracking-wide uppercase">Terms & Conditions</h1>
        <div className="h-px w-20 bg-luxury-gold mb-8"></div>
        <p className="text-luxury-charcoal/70 text-sm italic">Last updated: June 29, 2025</p>
      </div>

      {/* Policy Content */}
      <div className="max-w-3xl mx-auto text-luxury-charcoal text-base md:text-lg space-y-12">
        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">1. Introduction</h2>
          <p className="mb-4">
            Welcome to <strong>imperialcraft.in</strong> (the "Website"), operated by Imperial Craft of India ("we," "us," or "our"). These Terms & Conditions, together with our Privacy Policy and any other notices or agreements published on the Website, govern your use of our site and any purchases you make. By accessing or using the Website, placing an order, or otherwise engaging with our services, you agree to be bound by this Agreement.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">2. Website Availability</h2>
          <ol className="list-decimal pl-6 space-y-3">
            <li><span className="font-semibold text-luxury-gold">Maintenance & Suspension:</span> We may suspend or discontinue the Website (or any part) at any time for maintenance, upgrades, or other reasons, without liability.</li>
            <li><span className="font-semibold text-luxury-gold">Modifications:</span> We reserve the right to modify or remove any feature, content, or functionality without prior notice.</li>
            <li><span className="font-semibold text-luxury-gold">Unauthorized Use:</span> Should we determine, in our sole discretion, that you are misusing the Website or breaching these Terms, we may suspend or terminate your access immediately and pursue any legal remedies available.</li>
          </ol>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">3. Your Status</h2>
          <p className="mb-4">
            By placing an order, you represent and warrant that:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>You are at least <strong>18 years old</strong>.</li>
            <li>You have full legal capacity to enter into binding contracts.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">4. Formation of Contract</h2>
          <ol className="list-decimal pl-6 space-y-3">
            <li><span className="font-semibold text-luxury-gold">Order Acknowledgment:</span> After you place an order, you will receive an acknowledgment email—this does not constitute acceptance.</li>
            <li><span className="font-semibold text-luxury-gold">Acceptance & Dispatch Confirmation:</span> Your order constitutes an offer. We accept your offer only upon sending you a <strong>Confirmation of Dispatch</strong> email for the specific item(s). The contract is formed at that moment.</li>
            <li><span className="font-semibold text-luxury-gold">Partial Shipments:</span> Each dispatched item forms its own contract once its dispatch is confirmed.</li>
          </ol>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">5. Payment & Fraud</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><span className="font-semibold text-luxury-gold">Authorized Payments Only:</span> You must use a valid payment method in your name. We accept Credit/Debit Cards, PayPal, and Bank NEFT/RTGS.</li>
            <li><span className="font-semibold text-luxury-gold">Fraud Liability:</span> We disclaim all liability for fraudulent use of payment instruments. You are responsible for safeguarding your account credentials.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">6. Intellectual Property</h2>
          <p className="mb-4">
            All content, trademarks, logos, and service marks on the Website are the property of Imperial Craft of India or its licensors. No right or license is granted to use any of these except as expressly provided in writing.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">7. External Links</h2>
          <p className="mb-4">
            We may provide external links for your convenience. We do not control those sites, and accept no responsibility for their content or accuracy. Linking to imperialcraft.in requires our prior written permission—please contact <a href="mailto:support@imperialcraft.in" className="text-luxury-gold underline hover:text-luxury-darkgold">support@imperialcraft.in</a>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">8. Prohibited Conduct</h2>
          <p className="mb-4">
            You agree <strong>not</strong> to use the Website to post or transmit any content that is unlawful, defamatory, obscene, abusive, threatening, or otherwise objectionable. You indemnify us against any loss arising from your misuse.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">9. Returns, Refunds & Damage Claims</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><span className="font-semibold text-luxury-gold">No Returns:</span> Due to the fragile nature of our products, we do not accept returns.</li>
            <li><span className="font-semibold text-luxury-gold">Pre‑Dispatch Cancellations:</span> If you cancel before shipment, we issue a refund minus a restocking fee.</li>
            <li><span className="font-semibold text-luxury-gold">Damaged Goods Procedures:</span>
              <ol className="list-decimal pl-6 space-y-1">
                <li>Photograph external packaging <strong>before</strong> opening.</li>
                <li>Inspect within <strong>3 days</strong> of delivery.</li>
                <li>Email <a href="mailto:support@imperialcraft.in" className="text-luxury-gold underline hover:text-luxury-darkgold">support@imperialcraft.in</a> with order details, carrier name, and photos.</li>
                <li>Upon insurance claim approval, you may choose a replacement or full refund.</li>
              </ol>
            </li>
            <li><span className="font-semibold text-luxury-gold">Refund Timeline:</span> All refunds via NEFT/RTGS/PayPal within <strong>5–10 working days</strong> of claim approval.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">10. Shipping Policy</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><span className="font-semibold text-luxury-gold">Couriers:</span> DHL & FedEx (approx. 10 business days). Fallback to India Post if needed.</li>
            <li><span className="font-semibold text-luxury-gold">Oversize (&gt; 48″ diameter):</span> Sea cargo to your nearest seaport (6–8 weeks). Inland delivery from port is buyer's responsibility or available for an additional fee—email for a quote.</li>
            <li><span className="font-semibold text-luxury-gold">PO Boxes & Restricted Destinations:</span> No deliveries to P.O. Boxes. Russia/Brazil shipments require a firm or business name.</li>
            <li><span className="font-semibold text-luxury-gold">Customs & Duties:</span> You are responsible for any import taxes, duties, or customs delays.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">11. Limitation of Liability</h2>
          <p className="mb-4">
            <span className="font-semibold text-luxury-gold">Cap on Liability:</span> To the maximum extent permitted by law, our total aggregate liability for any claim related to the Website or products sold shall not exceed the purchase price you paid for the relevant product. In no event shall we be liable for any indirect, incidental, special, or consequential damages.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">12. Force Majeure</h2>
          <p className="mb-4">
            We shall not be liable for any failure or delay in performance caused by circumstances beyond our reasonable control, including but not limited to natural disasters, acts of government, war, terrorism, strikes, pandemics, or supply chain disruptions.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">13. Dispute Resolution & Arbitration</h2>
          <p className="mb-4">
            Any dispute, claim, or controversy arising out of or relating to these Terms shall be resolved by <strong>binding arbitration</strong> administered in India under the Arbitration and Conciliation Act, 1996. The arbitration shall be conducted in English and seated in Delhi, India. Judgment on the award may be entered in any court of competent jurisdiction.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">14. Severability & Waiver</h2>
          <p className="mb-4">
            If any provision of this Agreement is held invalid or unenforceable, the remaining provisions shall remain in full force and effect. No waiver of any right or provision shall be deemed a further or continuing waiver without the express written consent of the party waiving the right.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">15. Export Compliance</h2>
          <p className="mb-4">
            You agree to comply with all applicable import and export laws and regulations of India and your country of residence. You shall not export or re-export any products in violation of any applicable laws.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">16. Third‑Party Services Disclaimer</h2>
          <p className="mb-4">
            We may rely on third‑party carriers, payment processors, and other service providers to fulfill orders. We disclaim any liability for the acts or omissions of such third parties.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">17. User Accounts & Registration</h2>
          <p className="mb-4">
            To access certain features, you may need to register. You agree to provide true, accurate, and complete information and to update it promptly. Notify us of changes at <a href="mailto:support@imperialcraft.in" className="text-luxury-gold underline hover:text-luxury-darkgold">support@imperialcraft.in</a>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">18. Governing Law & Jurisdiction</h2>
          <p className="mb-4">
            These Terms are governed by the laws of India. You submit to the exclusive jurisdiction of the courts of Delhi for any disputes not resolved by arbitration.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">19. Entire Agreement & Changes</h2>
          <p className="mb-4">
            This Agreement, together with the Privacy Policy and other notices, constitutes the entire understanding between you and us. We may update these Terms at any time; the "Last updated" date will reflect changes. Your continued use after updates signifies acceptance of the revised Terms.
          </p>
        </section>

        <section className="border-t border-luxury-gold/20 pt-8 mt-12">
          <p className="text-center">
            If you have any questions or require further clarification, please contact us at <a href="mailto:support@imperialcraft.in" className="text-luxury-gold underline hover:text-luxury-darkgold">support@imperialcraft.in</a>.
          </p>
        </section>
      </div>
    </div>
  )
} 