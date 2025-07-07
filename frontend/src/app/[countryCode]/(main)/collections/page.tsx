"use server"

import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { notFound } from "next/navigation"
import CollectionPreview from "@modules/collections/components/collection-preview"

interface CollectionsPageProps {
  params: {
    countryCode: string
  }
}

export default async function CollectionsPage(props: CollectionsPageProps) {
  const params = await props.params
  const countryCode = params.countryCode
  const region = await getRegion(countryCode)

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
          Explore our curated collections of handcrafted marble art, each representing a unique aspect of our artisanal heritage.
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
            We're currently updating our collections. Please check back soon for our latest curation.
          </p>
        </div>
      )}
    </div>
  )
} 