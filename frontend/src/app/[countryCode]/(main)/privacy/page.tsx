import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Taj Petha",
  description: "Read our privacy policy for Taj Petha. Learn how we collect, use, and protect your personal information when you visit our website.",
  robots: { index: true, follow: true, "max-image-preview": 'large', "max-snippet": -1, "max-video-preview": -1 },
}

export default function PrivacyPage() {
  return (
    <div className="content-container py-12">
      {/* Hero section */}
      <div className="flex flex-col items-center text-center mb-20">
        <h1 className="font-display text-4xl text-luxury-gold mb-4 tracking-wide uppercase">Privacy Policy</h1>
        <div className="h-px w-20 bg-luxury-gold mb-8"></div>
        <p className="text-luxury-charcoal/70 text-sm italic">Last updated: June 15, 2024</p>
      </div>

      {/* Policy Content */}
      <div className="max-w-3xl mx-auto text-luxury-charcoal text-base md:text-lg space-y-12">
        <section>
          <p className="mb-4">
            Taj Petha ("we," "us," or "our") operates the website <strong><a href="https://tajpetha.in" className="text-luxury-gold hover:text-luxury-darkgold">tajpetha.in</a></strong> (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our Service. By accessing or using the Service, you acknowledge that you have read, understood, and agree to the practices described in this policy.
          </p>
        </section>

        <div className="h-px w-full bg-luxury-gold/20 my-10"></div>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">1. Information We Collect</h2>
          
          <div className="mb-6">
            <h3 className="font-serif text-xl text-luxury-gold mb-2">1.1 Personal Data</h3>
            <p className="mb-2">
              When you use our Service, you may voluntarily provide us with certain personally identifiable information, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Shipping address, city, state/province, ZIP/postal code, country</li>
              <li>Payment information (processed securely by third‑party gateways)</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif text-xl text-luxury-gold mb-2">1.2 Usage Data & Cookies</h3>
            <p className="mb-2">
              We automatically collect information about how you access and use the Service ("Usage Data"), such as:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Pages visited, time spent on pages, and click paths</li>
              <li>Device identifiers and operating system</li>
              <li>Referring URLs and navigation data</li>
            </ul>
            
            <p className="mb-2">
              We also use cookies, web beacons, tags, and similar tracking technologies to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Operate and secure the Service (Session Cookies)</li>
              <li>Remember your preferences (Preference Cookies)</li>
              <li>Prevent fraud and misuse (Security Cookies)</li>
            </ul>
            <p className="mt-2">
              You can manage or disable cookies through your browser settings; however, certain features of the Service may not function properly without them.
            </p>
          </div>
        </section>

        <div className="h-px w-full bg-luxury-gold/20 my-10"></div>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">2. How We Use Your Data</h2>
          <p className="mb-2">We use collected data for these purposes:</p>
          <ul className="list-disc pl-6 space-y-3">
            <li><span className="font-semibold text-luxury-gold">To Provide & Maintain the Service:</span> Process orders, fulfill shipments, and offer customer support.</li>
            <li><span className="font-semibold text-luxury-gold">To Communicate Updates:</span> Notify you about changes, promotions, or important service announcements.</li>
            <li><span className="font-semibold text-luxury-gold">To Personalize Your Experience:</span> Tailor content, offers, and features based on your interactions.</li>
            <li><span className="font-semibold text-luxury-gold">To Analyze & Improve:</span> Monitor usage trends, diagnose technical issues, and optimize our Service.</li>
            <li><span className="font-semibold text-luxury-gold">To Prevent Fraud:</span> Detect and address unauthorized or malicious activities.</li>
          </ul>
        </section>

        <div className="h-px w-full bg-luxury-gold/20 my-10"></div>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">3. Data Sharing & Disclosure</h2>
          
          <div className="mb-6">
            <h3 className="font-serif text-xl text-luxury-gold mb-2">3.1 Service Providers</h3>
            <p className="mb-2">
              We engage trusted third‑party vendors (e.g., payment gateways, hosting, analytics providers) who have access to your Personal Data solely to perform tasks on our behalf. They are contractually bound to protect your information and may not use it for other purposes.
            </p>
          </div>
          
          <div>
            <h3 className="font-serif text-xl text-luxury-gold mb-2">3.2 Legal Requirements</h3>
            <p className="mb-2">
              We may disclose your Personal Data if required by law or when we believe in good faith that such disclosure is necessary to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Comply with a legal obligation or court order</li>
              <li>Protect our rights, property, or safety, and that of our users or the public</li>
              <li>Investigate potential wrongdoing or misuse of the Service</li>
            </ul>
          </div>
        </section>

        <div className="h-px w-full bg-luxury-gold/20 my-10"></div>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">4. International Data Transfers</h2>
          <p className="mb-4">
            Your data may be stored and processed in India. If you are located outside India, by using our Service you consent to the transfer of your information to India and its processing there under this policy. We implement reasonable safeguards—including encryption and access controls—to protect your data during transfer and storage.
          </p>
        </section>

        <div className="h-px w-full bg-luxury-gold/20 my-10"></div>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">5. Data Security</h2>
          <p className="mb-4">
            We implement commercially acceptable technical and organizational measures to secure your Personal Data. However, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security, but we strive for the highest standard of protection.
          </p>
        </section>

        <div className="h-px w-full bg-luxury-gold/20 my-10"></div>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">6. Your Choices & Rights</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><span className="font-semibold text-luxury-gold">Access & Correction:</span> You may request access to, correction of, or deletion of your Personal Data by contacting us.</li>
            <li><span className="font-semibold text-luxury-gold">Cookies & Tracking:</span> You can disable or delete cookies via your browser settings; however, this may impact Service functionality.</li>
            <li><span className="font-semibold text-luxury-gold">Marketing Communications:</span> You may opt out of promotional emails by clicking the "unsubscribe" link at the bottom of our emails or contacting support.</li>
          </ul>
        </section>

        <div className="h-px w-full bg-luxury-gold/20 my-10"></div>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">7. Links to Other Sites</h2>
          <p className="mb-4">
            Our Service may include links to third‑party websites that are not operated by us. We are not responsible for their content or privacy practices. Please review their privacy policies before providing personal information.
          </p>
        </section>

        <div className="h-px w-full bg-luxury-gold/20 my-10"></div>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">8. Children's Privacy</h2>
          <p className="mb-4">
            Our Service is not intended for children under 18. We do not knowingly collect personal information from minors. If you believe we have collected data from a child under 18, please contact us so we can promptly delete it.
          </p>
        </section>

        <div className="h-px w-full bg-luxury-gold/20 my-10"></div>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">9. Changes to This Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy from time to time. When we do, we will post the revised policy on this page with an updated "Last Updated" date and, where appropriate, notify you via email or a prominent notice on our Service. Your continued use of the Service after changes are posted constitutes your acceptance of the updated policy.
          </p>
        </section>

        <div className="h-px w-full bg-luxury-gold/20 my-10"></div>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">10. Contact Us</h2>
          <p className="mb-4">
            If you have questions or concerns about this Privacy Policy, please contact us:
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
            Thank you for trusting Taj Petha with your personal information. We are committed to safeguarding your privacy and providing you with the finest Agra petha experience.
          </p>
        </section>
        
        <section className="text-center">
          <div className="flex justify-center mt-6">
            <a 
              href="https://wa.me/919259418994?text=Hello%20Taj%20Petha%2C%20I%20have%20a%20question%20about%20your%20privacy%20policy."
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