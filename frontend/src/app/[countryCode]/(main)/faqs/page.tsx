import type { Metadata } from "next"
import FaqClient from "./faq-client"

export const dynamic = 'force-static'
export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ countryCode: string }> }): Promise<Metadata> {
  const { countryCode } = await params
  return {
    title: "Frequently Asked Questions (FAQs) | Authentic Agra Petha | Taj Petha",
    description: "Got questions about Agra Petha shelf life, pure vegetarian ingredients, shipping times, storage tips, or bulk wedding gifting? Find all answers here.",
    keywords: [
      "Agra Petha FAQs",
      "How long does petha last",
      "Is Agra petha vegetarian",
      "Best way to store petha",
      "Taj Petha delivery time",
      "Agra petha ingredients",
    ],
    alternates: {
      canonical: `https://tajpetha.in/${countryCode}/faqs`,
    },
  }
}

export default async function FaqPage({ params }: { params: Promise<{ countryCode: string }> }) {
  const { countryCode } = await params

  // Full FAQ Structured Schema
  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is authentic Agra Petha made of?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Authentic Agra Petha is made from pure ash gourd (winter melon or benincasa hispida), slow-simmered in light natural sugar syrup and infused with real Kashmiri saffron, rose water, cardamom, or chocolate. It is 100% vegetarian with zero gelatin or artificial fillers.",
        },
      },
      {
        "@type": "Question",
        name: "How long does Taj Petha stay fresh?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In our airtight, vacuum-sealed packaging, Taj Petha maintains peak freshness for 30–45 days at normal room temperature. Once opened, we recommend storing it in an airtight container or refrigerator and consuming within 10–14 days.",
        },
      },
      {
        "@type": "Question",
        name: "How long does shipping take across India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Every order is cooked fresh in Agra and dispatched via Air Express within 24 hours. Metro cities receive their orders in 2–3 business days, while all other Indian locations receive delivery within 3–5 business days.",
        },
      },
      {
        "@type": "Question",
        name: "Are all Taj Petha sweets and namkeens 100% pure vegetarian?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, 100% of our sweets, namkeens, and Agra dalmoths are strictly vegetarian and certified by the Food Safety and Standards Authority of India (FSSAI).",
        },
      },
      {
        "@type": "Question",
        name: "Can I order customized boxes for weddings and corporate gifting?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! We specialize in custom festive and wedding sweet hampers with personalized gift cards and corporate branding. We offer tiered bulk pricing for orders of 20+ boxes.",
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <FaqClient countryCode={countryCode} />
    </>
  )
}