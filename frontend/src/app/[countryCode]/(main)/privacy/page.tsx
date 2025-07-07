import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Imperial Craft Of India",
  description: "Read our privacy policy for Imperial Craft Of India. Learn how we collect, use, and protect your personal information.",
}

export default function PrivacyPage() {
  return (
    <div className="content-container py-12">
      {/* Hero section */}
      <div className="flex flex-col items-center text-center mb-20">
        <h1 className="font-display text-4xl text-luxury-gold mb-4 tracking-wide uppercase">Privacy Policy</h1>
        <div className="h-px w-20 bg-luxury-gold mb-8"></div>
        <p className="text-luxury-charcoal/70 text-sm italic">Last updated: June 29, 2025</p>
      </div>

      {/* Policy Content */}
      <div className="max-w-3xl mx-auto text-luxury-charcoal text-base md:text-lg space-y-12">
        <section>
          <p className="mb-4">
            <strong>Imperial Craft of India</strong> ("we," "us," or "our") operates the website <strong>imperialcraft.in</strong> (the "Site"). We are committed to protecting the privacy of all visitors ("you" or "your"). This Privacy Policy describes what information we collect, how we use and share it, and your choices regarding that information. By accessing or using the Site, you agree to this Privacy Policy. If you do not agree, please do not use the Site.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">1. Information We Collect</h2>
          
          <div className="mb-6">
            <h3 className="font-serif text-xl text-luxury-gold mb-2">Voluntarily Provided Data</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><span className="font-semibold text-luxury-gold">Account Registration:</span> name, email address, phone number, password.</li>
              <li><span className="font-semibold text-luxury-gold">Purchases & Transactions:</span> billing/shipping address, payment instrument details (credit/debit card number, expiration date, bank transfer details).</li>
              <li><span className="font-semibold text-luxury-gold">Communications:</span> correspondence you send us (e‑mail, feedback, reviews, support requests).</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="font-serif text-xl text-luxury-gold mb-2">Automatically Collected Data</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><span className="font-semibold text-luxury-gold">Usage Data:</span> pages visited, time spent on pages, clickstream data, referral URLs.</li>
              <li><span className="font-semibold text-luxury-gold">Device & Browser Data:</span> IP address, browser type and version, operating system, device identifiers, screen resolution.</li>
              <li><span className="font-semibold text-luxury-gold">Cookies & Similar Technologies:</span> see Section 4.</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif text-xl text-luxury-gold mb-2">Third‑Party Data</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><span className="font-semibold text-luxury-gold">Service Providers:</span> information from payment processors, shipping carriers.</li>
              <li><span className="font-semibold text-luxury-gold">Analytics & Advertising Partners:</span> aggregated usage and demographic data.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><span className="font-semibold text-luxury-gold">To Provide & Improve Services:</span> process orders, ship products, respond to inquiries, manage your account, personalize your experience.</li>
            <li><span className="font-semibold text-luxury-gold">Marketing & Promotions:</span> send you special offers, product updates, surveys (you may opt out at any time).</li>
            <li><span className="font-semibold text-luxury-gold">Analytics & Research:</span> understand usage patterns, measure advertising effectiveness, improve Site functionality.</li>
            <li><span className="font-semibold text-luxury-gold">Legal Compliance & Safety:</span> detect and prevent fraud, enforce our Terms & Conditions, comply with legal obligations.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">3. Information Sharing & Disclosure</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><span className="font-semibold text-luxury-gold">Service Providers:</span> we share data with third parties who help us operate the Site (e.g., payment gateways, shipping partners, hosting providers).</li>
            <li><span className="font-semibold text-luxury-gold">Legal Requirements & Protection:</span> we may disclose information if required by law, subpoena, or to protect our rights, property, or safety.</li>
            <li><span className="font-semibold text-luxury-gold">Business Transfers:</span> in the event of a merger, acquisition, or asset sale, your information may be transferred; you will be notified and given choices where required by law.</li>
            <li><span className="font-semibold text-luxury-gold">No Sale of Personal Data:</span> we do <em>not</em> sell your personal information to marketers or other third parties.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">4. Cookies & Tracking Technologies</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><span className="font-semibold text-luxury-gold">Purpose:</span> cookies and similar technologies enable Site functionality (e.g., keeping you logged in), remember preferences, and deliver personalized content.</li>
            <li>
              <span className="font-semibold text-luxury-gold">Types of Cookies:</span>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><span className="font-semibold">Session Cookies:</span> expire when you close your browser.</li>
                <li><span className="font-semibold">Persistent Cookies:</span> remain on your device until deleted or they expire.</li>
                <li><span className="font-semibold">Third‑Party Cookies:</span> set by analytics and advertising partners for aggregated insights.</li>
              </ul>
            </li>
            <li><span className="font-semibold text-luxury-gold">Your Choices:</span> most browsers allow you to disable or delete cookies; note that disabling cookies may break certain features of the Site.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">5. Data Retention</h2>
          <p className="mb-4">
            We retain your personal information only as long as necessary to fulfill the purposes outlined in this Privacy Policy, comply with legal obligations, resolve disputes, and enforce our agreements.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">6. Your Rights & Choices</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><span className="font-semibold text-luxury-gold">Access & Correction:</span> you may review, update, or correct your account information by logging in or contacting us at <a href="mailto:support@imperialcraft.in" className="text-luxury-gold underline hover:text-luxury-darkgold">support@imperialcraft.in</a>.</li>
            <li><span className="font-semibold text-luxury-gold">Data Portability & Deletion:</span> you may request a copy of your data or deletion of your account (subject to legal obligations) by contacting <a href="mailto:support@imperialcraft.in" className="text-luxury-gold underline hover:text-luxury-darkgold">support@imperialcraft.in</a>.</li>
            <li><span className="font-semibold text-luxury-gold">Marketing Opt‑Out:</span> click the "unsubscribe" link in any promotional email or email <a href="mailto:support@imperialcraft.in" className="text-luxury-gold underline hover:text-luxury-darkgold">support@imperialcraft.in</a>.</li>
            <li><span className="font-semibold text-luxury-gold">Do Not Track:</span> we do not respond to browser "Do Not Track" signals; you may disable cookies as described above.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">7. Security</h2>
          <p className="mb-4">
            We employ reasonable administrative, technical, and physical safeguards to protect your information. All payment transactions are encrypted using SSL. However, no system is completely secure—absolute security cannot be guaranteed.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">8. Children's Privacy</h2>
          <p className="mb-4">
            Our Site is not intended for children under 18. We do not knowingly collect personal information from minors. If you believe we have collected data from a minor, please contact us immediately.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">9. International Data Transfers</h2>
          <p className="mb-4">
            Imperial Craft of India is based in India. By using the Site, you consent to the transfer of your information to India and other countries where our service providers operate, under legal safeguards.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">10. Changes to This Privacy Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy at any time. The "Last updated" date at the top will reflect changes. Your continued use of the Site after changes are posted constitutes acceptance of the revised policy.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">11. Contact Us</h2>
          <p className="mb-4">
            If you have questions or concerns about this Privacy Policy, please contact us at:
          </p>
          <ul className="list-none pl-0 space-y-1">
            <li><strong>Email:</strong> <a href="mailto:support@imperialcraft.in" className="text-luxury-gold underline hover:text-luxury-darkgold">support@imperialcraft.in</a></li>
            <li><strong>Phone:</strong> +91 XXXXXXXXXX</li>
            <li><strong>Address:</strong> Imperial Craft of India, [Your Business Address]</li>
          </ul>
        </section>

        <section className="border-t border-luxury-gold/20 pt-8 mt-12">
          <p className="text-center">
            Thank you for trusting Imperial Craft of India with your personal information. We are committed to keeping it safe and secure.
          </p>
        </section>
      </div>
    </div>
  )
} 