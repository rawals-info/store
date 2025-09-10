import type { Metadata } from "next"

export const dynamic = 'force-static'

export async function generateMetadata({ params }: { params: Promise<{ countryCode: string }> }): Promise<Metadata> {
  const { countryCode } = await params
  return {
    title: "Contact Us | Taj Petha",
    description: "Get in touch with Taj Petha for orders, support, and bulk inquiries.",
    alternates: { canonical: `https://tajpetha.in/${countryCode}/contact` },
  }
}


