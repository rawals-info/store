import type { Metadata } from "next"

export const dynamic = 'force-static'

export async function generateMetadata({ params }: { params: Promise<{ countryCode: string }> }): Promise<Metadata> {
  const { countryCode } = await params
  return {
    title: "Shipping Policy | Taj Petha",
    description: "Read about shipping times, coverage, and free delivery thresholds for Taj Petha orders in India.",
    alternates: { canonical: `https://tajpetha.in/${countryCode}/shipping` },
  }
}


