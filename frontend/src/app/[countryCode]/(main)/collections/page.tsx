import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { getIndiaRegion } from "@lib/constants/india-region"
import { notFound } from "next/navigation"
import CollectionPreview from "@modules/collections/components/collection-preview"

import { listIndiaRegions } from "@lib/constants/india-region"

export const revalidate = 3600

export async function generateStaticParams() {
  const regions = listIndiaRegions()
  return regions.flatMap((r) => r.countries?.map((c) => ({ countryCode: c.iso_2?.toLowerCase() || "in" })) || [{ countryCode: "in" }])
}

interface CollectionsPageProps {
  params: Promise<{
    countryCode: string
  }>
}

export default async function CollectionsPage(props: CollectionsPageProps) {
  const params = await props.params
  const countryCode = params.countryCode
  const region = getIndiaRegion()

  if (!region) {
    notFound()
  }

  const { collections } = await listCollections()

  return (
    <div className="content-container py-12">
      <div className="flex flex-col">
        <h1 className="font-display text-4xl text-luxury-charcoal mb-2">
          Our Collections
        </h1>
        <div className="h-px w-20 bg-luxury-gold mb-8"></div>
        <p className="text-serif-regular text-luxury-charcoal/80 max-w-xl mb-12">
          Explore our curated collections of authentic Agra pethas, each representing a unique flavor profile and traditional sweet-making heritage.
        </p>
      </div>

      {collections.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
          {collections.map((collection) => (
            <CollectionPreview key={collection.id} collection={collection} />
          ))}
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center justify-center">
          <h2 className="font-display text-xl text-luxury-gold mb-4">No collections found</h2>
          <p className="text-serif-regular text-luxury-charcoal/80 text-center max-w-lg">
            We're currently updating our petha collections. Please check back soon for our latest sweet creations.
          </p>
        </div>
      )}
    </div>
  )
} 