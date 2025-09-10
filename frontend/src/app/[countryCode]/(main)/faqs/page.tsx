import FaqAccordion from "@components/FaqAccordion"
import type { Metadata } from "next"

export const dynamic = 'force-static'

export async function generateMetadata({ params }: { params: Promise<{ countryCode: string }> }): Promise<Metadata> {
  const { countryCode } = await params
  return {
    title: "FAQs | Taj Petha",
    description: "Frequently asked questions about Taj Petha's authentic Agra pethas. Learn about our products, shipping, storage, and more.",
    alternates: {
      canonical: `https://tajpetha.in/${countryCode}/faqs`,
    },
  }
}


const faqs = [
  {
    question: "What exactly is petha?",
    answer: (
      <span>
        Petha is a traditional Indian sweet originating from Agra. It's made from ash gourd (winter melon) that is cooked in sugar syrup and typically flavored with cardamom, saffron, or rose essence. Our pethas are crafted following authentic recipes that have been perfected over generations.
      </span>
    ),
  },
  {
    question: "How long does petha stay fresh?",
    answer: (
      <span>
        When stored properly in a cool, dry place, our pethas typically remain fresh for <span className="font-semibold">4-6 weeks</span> from the manufacturing date (marked on the package). Once opened, we recommend consuming within <span className="font-semibold">7-10 days</span> for best taste and quality.
      </span>
    ),
  },
  {
    question: "Are your pethas vegetarian?",
    answer: (
      <span>
        Yes, all our pethas are <span className="font-semibold">100% vegetarian</span>. They are made using plant-based ingredients only and are suitable for vegetarian diets. They do not contain eggs, meat, or gelatin.
      </span>
    ),
  },
  {
    question: "Do your products contain preservatives?",
    answer: (
      <span>
        We use minimal preservatives in our pethas. The primary preservation comes naturally from the sugar syrup process. Any food-grade preservatives used are within safe limits prescribed by FSSAI (Food Safety and Standards Authority of India) and are clearly listed in the ingredients.
      </span>
    ),
  },
  {
    question: "How are your pethas packaged?",
    answer: (
      <span>
        Our pethas are hygienically packed in food-grade, air-sealed pouches that maintain freshness. These are then placed in sturdy, eco-friendly boxes for transit protection. For gift orders, we offer premium packaging options including traditional decorative boxes.
      </span>
    ),
  },
  {
    question: "How long does shipping take?",
    answer: (
      <span>
        We dispatch orders within <span className="font-semibold">1 business day</span> of confirmation. Estimated delivery times are:
        <br/><br/>
        • Urban & Metro Areas: <span className="font-semibold">3–7 business days</span>
        <br/>
        • Remote Locations: <span className="font-semibold">10–12 business days</span>
      </span>
    ),
  },
  {
    question: "Do you ship outside India?",
    answer: (
      <span>
        Yes, we ship to select international destinations. International shipping typically takes <span className="font-semibold">7-14 business days</span> depending on the location. Please note that customs duties and taxes may apply and are the responsibility of the recipient.
      </span>
    ),
  },
  {
    question: "Can I return or exchange my order?",
    answer: (
      <span>
        Due to the perishable nature of our products, we cannot accept returns on opened packages. However, if you receive damaged items, please contact us within <span className="font-semibold">2 business days</span> of delivery with photos of the damage. See our <a href="/returns" className="text-luxury-gold underline hover:text-luxury-darkgold">Returns & Exchanges Policy</a> for details.
      </span>
    ),
  },
  {
    question: "What flavors of petha do you offer?",
    answer: (
      <span>
        We offer a variety of flavors including:
        <br/><br/>
        • <span className="font-semibold">Classic (Kesar)</span> - The traditional saffron-infused petha
        <br/>
        • <span className="font-semibold">Angoori</span> - Grape-sized pieces with a juicier texture
        <br/>
        • <span className="font-semibold">Rose</span> - Delicately flavored with natural rose essence
        <br/>
        • <span className="font-semibold">Elaichi (Cardamom)</span> - With aromatic cardamom notes
        <br/>
        • <span className="font-semibold">Coconut</span> - Blended with coconut for a tropical twist
        <br/>
        • <span className="font-semibold">Chocolate</span> - Our modern interpretation with cocoa coating
        <br/><br/>
        We also offer seasonal and limited-edition flavors throughout the year.
      </span>
    ),
  },
  {
    question: "Do you offer gift packaging?",
    answer: (
      <span>
        Yes, we offer premium gift packaging options perfect for festivals, weddings, and special occasions. You can add a gift message during checkout, and we'll include a beautifully printed card with your personalized note.
      </span>
    ),
  },
  {
    question: "Are there any dietary concerns with petha?",
    answer: (
      <span>
        Our traditional pethas contain sugar and are not suitable for individuals on sugar-restricted diets or those with diabetes. However, we do offer a <span className="font-semibold">Sugar-Free</span> variety made with natural sweeteners for those monitoring their sugar intake. People with allergies should note that our products are processed in a facility that handles nuts.
      </span>
    ),
  },
  {
    question: "Do you offer bulk orders for events?",
    answer: (
      <span>
        Absolutely! We welcome bulk orders for weddings, corporate events, and special occasions. For orders exceeding 5 kg, please contact us directly at <a href="mailto:support@tajpetha.in" className="text-luxury-gold underline hover:text-luxury-darkgold">support@tajpetha.in</a> for customized packaging and potential discounts.
      </span>
    ),
  },
  {
    question: "How can I contact you?",
    answer: (
      <span>
        Email: <a href="mailto:support@tajpetha.in" className="text-luxury-gold underline hover:text-luxury-darkgold">support@tajpetha.in</a><br />
        Phone: +91-92594-18994<br />
        WhatsApp: <a href="https://wa.me/919259418994" className="text-luxury-gold underline hover:text-luxury-darkgold">+91-92594-18994</a><br />
        Shop Address: Shop No-1, Pratap Nagar, Agra 282010
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
          Everything you need to know about our authentic Agra pethas, ordering process, shipping, and more. If your question isn't answered here, please don't hesitate to contact us.
        </p>
      </div>
      <div className="max-w-3xl mx-auto">
        <FaqAccordion faqs={faqs} />
      </div>
      
      <div className="flex justify-center mt-16">
        <a 
          href="https://wa.me/919259418994?text=Hello%20Taj%20Petha%2C%20I%20have%20a%20question%20that%20wasn't%20covered%20in%20your%20FAQs."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center bg-[#25D366] hover:bg-[#20BD5C] text-white px-6 py-3 rounded-md transition-colors duration-300 shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
          </svg>
          <span>Still have questions? Chat with us on WhatsApp</span>
        </a>
      </div>
    </div>
  )
} 