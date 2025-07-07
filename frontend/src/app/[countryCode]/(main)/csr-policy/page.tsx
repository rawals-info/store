import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "CSR Policy | Imperial Craft Of India",
  description: "Read our Corporate Social Responsibility policy for Imperial Craft Of India. Learn about our commitment to ethical practices and sustainability.",
}

export default function CSRPolicyPage() {
  return (
    <div className="content-container py-12">
      {/* Hero section */}
      <div className="flex flex-col items-center text-center mb-20">
        <h1 className="font-display text-4xl text-luxury-gold mb-4 tracking-wide uppercase">Corporate Social Responsibility</h1>
        <div className="h-px w-20 bg-luxury-gold mb-8"></div>
        <p className="text-luxury-charcoal/70 text-sm italic">Last updated: June 29, 2025</p>
      </div>

      {/* Policy Content */}
      <div className="max-w-3xl mx-auto text-luxury-charcoal text-base md:text-lg space-y-12">
        <section>
          <p className="mb-4">
            <strong>Imperial Craft of India</strong> ("we," "us," or "our") is committed to conducting business in a socially responsible and sustainable manner. This CSR Policy outlines our approach to integrating social, environmental, and ethical considerations into our operations, decision-making, and stakeholder engagement.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">1. Purpose and Scope</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><span className="font-semibold text-luxury-gold">Purpose:</span> To define the principles and commitments guiding Imperial Craft of India's CSR initiatives and ensure alignment with our core values.</li>
            <li><span className="font-semibold text-luxury-gold">Scope:</span> Applies to all employees, subsidiaries, suppliers, and partners globally.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">2. CSR Vision and Mission</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><span className="font-semibold text-luxury-gold">Vision:</span> To enrich communities, protect the environment, and promote ethical craftsmanship while delivering high-quality handicraft products.</li>
            <li><span className="font-semibold text-luxury-gold">Mission:</span> To implement sustainable practices, support local artisans, and invest in social and environmental projects that create shared value.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">3. Core CSR Pillars</h2>
          
          <div className="mb-8">
            <h3 className="font-serif text-xl text-luxury-gold mb-2">Community Development</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Support education, healthcare, and livelihood programs in artisan communities.</li>
              <li>Partner with NGOs for skills training and capacity building.</li>
              <li>Encourage employee volunteerism in local community projects.</li>
            </ul>
          </div>
          
          <div className="mb-8">
            <h3 className="font-serif text-xl text-luxury-gold mb-2">Environmental Stewardship</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Minimize waste through eco-friendly packaging and recycling initiatives.</li>
              <li>Reduce carbon footprint by optimizing logistics, using renewable energy sources, and encouraging digital communication.</li>
              <li>Promote sustainable sourcing of raw materials, prioritizing certified and ethically harvested supplies.</li>
            </ul>
          </div>
          
          <div className="mb-8">
            <h3 className="font-serif text-xl text-luxury-gold mb-2">Ethical Sourcing & Supply Chain</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Conduct due diligence and regular audits of suppliers to ensure compliance with labor rights, fair wages, and safe working conditions.</li>
              <li>Establish long-term, transparent relationships with artisan groups, ensuring timely payments and market access.</li>
            </ul>
          </div>
          
          <div className="mb-8">
            <h3 className="font-serif text-xl text-luxury-gold mb-2">Employee Well-being & Diversity</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide a safe, inclusive, and harassment-free workplace.</li>
              <li>Offer professional development, training, and fair compensation.</li>
              <li>Foster diversity by recruiting and promoting talents from underrepresented communities.</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif text-xl text-luxury-gold mb-2">Responsible Business Practices</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Uphold high standards of integrity, anti-corruption, and transparency in all dealings.</li>
              <li>Comply with all applicable laws, regulations, and international conventions.</li>
              <li>Incorporate CSR criteria into strategic planning and performance evaluations.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">4. Governance & Accountability</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><span className="font-semibold text-luxury-gold">CSR Committee:</span> A cross-functional committee chaired by senior leadership oversees strategy, implementation, and reporting.</li>
            <li><span className="font-semibold text-luxury-gold">Reporting:</span> Annual CSR report published on our website, aligned with recognized frameworks (e.g., GRI Standards).</li>
            <li><span className="font-semibold text-luxury-gold">Measurable Targets:</span> Establish KPIs (e.g., % of sustainable materials used, community impact metrics) and review progress quarterly.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">5. Stakeholder Engagement</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><span className="font-semibold text-luxury-gold">Consultation:</span> Regular dialogue with artisans, employees, customers, NGOs, and local authorities.</li>
            <li><span className="font-semibold text-luxury-gold">Feedback Mechanisms:</span> Surveys, focus groups, and grievance channels to capture concerns and suggestions.</li>
            <li><span className="font-semibold text-luxury-gold">Collaboration:</span> Participate in industry forums and partnerships to share best practices.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">6. Continuous Improvement</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><span className="font-semibold text-luxury-gold">Review Cycle:</span> Annual policy review to reflect evolving social, environmental, and regulatory landscapes.</li>
            <li><span className="font-semibold text-luxury-gold">Innovation:</span> Invest in research and development of sustainable materials and processes.</li>
            <li><span className="font-semibold text-luxury-gold">Learning:</span> Provide ongoing CSR training for employees and suppliers.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">7. Contact Information</h2>
          <p className="mb-4">
            For questions or suggestions regarding our CSR activities, please contact:
          </p>
          <div className="pl-6">
            <p className="font-semibold">CSR Team</p>
            <p>Email: <a href="mailto:csr@imperialcraft.in" className="text-luxury-gold underline hover:text-luxury-darkgold">csr@imperialcraft.in</a></p>
            <p>Phone: +91 XXXXXXXXXX</p>
          </div>
        </section>

        <section className="border-t border-luxury-gold/20 pt-8 mt-12">
          <p className="text-center italic">
            Imperial Craft of India is dedicated to fostering a sustainable and equitable future for our artisans, communities, and the planet.
          </p>
        </section>
      </div>
    </div>
  )
} 