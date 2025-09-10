import type { Metadata } from "next"

export const dynamic = 'force-static'

export async function generateMetadata({ params }: { params: Promise<{ countryCode: string }> }): Promise<Metadata> {
  const { countryCode } = await params
  return {
    title: "Returns & Refunds | Taj Petha",
    description: "Learn about Taj Petha's returns and refunds policy for perishable products and transit damages.",
    alternates: { canonical: `https://tajpetha.in/${countryCode}/returns` },
  }
}


