import { Metadata } from "next"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { notFound } from "next/navigation"
import { getRegion } from "@lib/data/regions"
import { getIndiaRegion } from "@lib/constants/india-region"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore our exclusive collection of authentic Agra petha sweets.",
  robots: { index: true, follow: true, "max-image-preview": 'large', "max-snippet": -1, "max-video-preview": -1 },
}

export const revalidate = 1800

export default async function StorePage({
  params,
  searchParams,
}: {
  params: { countryCode: string }
  searchParams: { sortBy?: SortOptions; page?: string }
}) {
  // Get the country code from params
  const countryCode = params.countryCode
  
  // Verify the region exists
  const region = getIndiaRegion()
  
  if (!region) {
    return notFound()
  }
  
  // Get sort and pagination parameters
  const sortBy = searchParams.sortBy
  const page = searchParams.page
  
  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
    />
  )
}
