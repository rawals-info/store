import FaqAccordion from "@components/FaqAccordion"

export const metadata = {
  title: "FAQs | Imperial Craft Of India",
  description:
    "Frequently asked questions about Imperial Craft Of India. Shipping, returns, wholesale, and more.",
}

const faqs = [
  {
    question: "Do you offer wholesale pricing?",
    answer: (
      <span>
        Yes, we do offer wholesale opportunities. For wholesale inquiries, please get in touch with us at <a href="mailto:support@imperialcraft.in" className="text-luxury-gold underline hover:text-luxury-darkgold">support@imperialcraft.in</a>.
      </span>
    ),
  },
  {
    question: "How long does shipping take?",
    answer: (
      <span>
        Standard shipping via DHL or FedEx takes approximately <span className="font-semibold">10 business days</span> to most destinations. Oversized items shipped by sea may take <span className="font-semibold">6–8 weeks</span>.
      </span>
    ),
  },
  {
    question: "Are your products insured during shipping?",
    answer: (
      <span>
        Yes, all shipments are <span className="font-semibold">fully insured</span> against loss and damage. Please inspect your package upon arrival and contact us immediately if there are any issues.
      </span>
    ),
  },
  {
    question: "Can I return or exchange my order?",
    answer: (
      <span>
        Yes, you may request a return within <span className="font-semibold">7 calendar days</span> of delivery, provided the item is unused and in its original packaging. See our <a href="/returns" className="text-luxury-gold underline hover:text-luxury-darkgold">Return & Refund Policy</a> for details.
      </span>
    ),
  },
  {
    question: "Do you ship internationally?",
    answer: (
      <span>
        Yes, we ship worldwide via DHL, FedEx, and India Post (where available). Customs duties and taxes are the responsibility of the customer.
      </span>
    ),
  },
  {
    question: "How are your products packaged?",
    answer: (
      <span>
        We use professional-grade packaging: air shipments are packed in reinforced boxes with foam and bubble wrap; sea shipments are crated in wood for maximum protection.
      </span>
    ),
  },
  {
    question: "How do I care for my marble product?",
    answer: (
      <span>
        Clean with a soft, damp cloth. Avoid acidic or abrasive cleaners. For detailed care instructions, see our <a href="/care" className="text-luxury-gold underline hover:text-luxury-darkgold">Product Care Guide</a>.
      </span>
    ),
  },
  {
    question: "Can I request a custom or personalized order?",
    answer: (
      <span>
        Absolutely! We welcome custom commissions. Please email <a href="mailto:support@imperialcraft.in" className="text-luxury-gold underline hover:text-luxury-darkgold">support@imperialcraft.in</a> with your requirements.
      </span>
    ),
  },
  {
    question: "How can I contact you?",
    answer: (
      <span>
        Email: <a href="mailto:support@imperialcraft.in" className="text-luxury-gold underline hover:text-luxury-darkgold">support@imperialcraft.in</a><br />
        Phone: +91&nbsp;XXXXXXXXXX<br />
        Business Hours: Mon–Fri, 10&nbsp;AM–6&nbsp;PM IST
      </span>
    ),
  },
]

export default function FaqsPage() {
  return (
    <div className="content-container py-12">
      <div className="flex flex-col items-center text-center mb-16">
        <h1 className="font-display text-4xl text-luxury-gold mb-4 tracking-wide uppercase">Frequently Asked Questions</h1>
        <div className="h-px w-20 bg-luxury-gold mb-8"></div>
        <p className="text-luxury-charcoal/70 text-base max-w-2xl mx-auto">
          Answers to our most common questions about shipping, returns, custom orders, and more. If you need further assistance, please contact our team.
        </p>
      </div>
      <div className="max-w-3xl mx-auto">
        <FaqAccordion faqs={faqs} />
      </div>
    </div>
  )
} 