import type { Metadata } from "next"

export const dynamic = 'force-static'

export async function generateMetadata({ params }: { params: Promise<{ countryCode: string }> }): Promise<Metadata> {
  const { countryCode } = await params
  return {
    title: "Terms & Conditions | Taj Petha",
    description: "Read our terms and conditions for Taj Petha. Learn about your rights and responsibilities when ordering our delicious Agra pethas.",
    alternates: { canonical: `https://tajpetha.in/${countryCode}/terms` },
    robots: { index: true, follow: true, "max-image-preview": 'large', "max-snippet": -1, "max-video-preview": -1 },
  }
}


