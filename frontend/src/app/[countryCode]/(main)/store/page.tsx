import { Metadata } from "next"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { notFound } from "next/navigation"
import { getRegion } from "@lib/data/regions"
import { getIndiaRegion } from "@lib/constants/india-region"

import { listIndiaRegions } from "@lib/constants/india-region"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore our exclusive collection of authentic Agra petha sweets.",
  robots: { index: true, follow: true, "max-image-preview": 'large', "max-snippet": -1, "max-video-preview": -1 },
}

export const revalidate = 3600

export async function generateStaticParams() {
  const regions = listIndiaRegions()
  return regions.flatMap((r) => r.countries?.map((c) => ({ countryCode: c.iso_2?.toLowerCase() || "in" })) || [{ countryCode: "in" }])
}

export default async function StorePage({
  params,
  searchParams,
}: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ sortBy?: SortOptions; page?: string }>
}) {
  const { countryCode } = await params
  const { sortBy, page } = await searchParams
  
  // Verify the region exists
  const region = getIndiaRegion()
  
  if (!region) {
    return notFound()
  }
  
  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
    />
  )
}
