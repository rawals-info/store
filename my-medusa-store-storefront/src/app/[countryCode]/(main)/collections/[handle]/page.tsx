import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCollectionByHandle, listCollections } from "@lib/data/collections"
import { listRegions } from "@lib/data/regions"
import { parallelFetch } from "@lib/util/parallel-fetch"
import { batchFetch } from "@lib/util/batch-fetch"
import { StoreCollection, StoreRegion } from "@medusajs/types"
import CollectionTemplate from "@modules/collections/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { Suspense } from "react"

type Props = {
  params: { handle: string; countryCode: string }
  searchParams: {
    page?: string
    sortBy?: SortOptions
  }
}

// Set dynamic rendering options for this page
export const dynamic = "force-static"
// Fix the config field issue by using a number directly
export const revalidate = 600

export async function generateStaticParams() {
  // Fetch collections and regions using batch fetch
  const responses = await batchFetch([
    {
      path: "/store/collections",
      query: { fields: "*products" },
      cacheTags: ["collections"],
      cacheRevalidate: 600
    },
    {
      path: "/store/regions",
      cacheTags: ["regions"],
      cacheRevalidate: 600
    }
  ])

  const collectionsData = (responses[0].data as any)?.collections || []
  const regionsData = (responses[1].data as any)?.regions || []
  
  const regions = regionsData || []

  if (!collectionsData.length) {
    return []
  }

  const countryCodes = regions
    ?.map((r: any) => r.countries?.map((c: any) => c.iso_2))
    .flat()
    .filter(Boolean) as string[]

  const collectionHandles = collectionsData.map(
    (collection: StoreCollection) => collection.handle
  )

  const staticParams = countryCodes
    ?.map((countryCode: string) =>
      collectionHandles.map((handle: string | undefined) => ({
        countryCode,
        handle,
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  // Properly await params in Next.js 15
  const params = await props.params
  const handle = params.handle

  const response = await batchFetch([
    {
      path: "/store/collections",
      query: { handle: handle, fields: "*products" },
      cacheTags: ["collections"],
      cacheRevalidate: 600
    }
  ])

  const collection = (response[0].data as any)?.collections?.[0]

  if (!collection) {
    notFound()
  }

  const metadata = {
    title: `${collection.title} | Imperial Craft Of India`,
    description: collection.handle ? 
      `Explore our exclusive ${collection.title} collection of premium marble products. Each piece is crafted with exceptional quality and timeless design.` : 
      "Discover our luxury marble collections, each showcasing the finest craftsmanship and materials.",
    openGraph: {
      title: `${collection.title} | Imperial Craft Of India`,
      description: collection.handle ? 
        `Explore our exclusive ${collection.title} collection of premium marble products. Each piece is crafted with exceptional quality and timeless design.` : 
        "Discover our luxury marble collections, each showcasing the finest craftsmanship and materials.",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
    },
  } as Metadata

  return metadata
}

export default async function CollectionPage(props: Props) {
  // Properly await params and searchParams in Next.js 15
  const searchParamsData = await props.searchParams
  const paramsData = await props.params
  
  const { sortBy, page } = searchParamsData
  const handle = paramsData.handle
  const countryCode = paramsData.countryCode

  const response = await batchFetch([
    {
      path: "/store/collections",
      query: { handle: handle, fields: "*products" },
      cacheTags: ["collections"],
      cacheRevalidate: 600
    }
  ])

  const collection = (response[0].data as any)?.collections?.[0]

  if (!collection) {
    notFound()
  }

  return (
    <Suspense fallback={
      <div className="flex flex-col small:flex-row small:items-start py-12 content-container">
        <div className="w-full">
          <div className="flex flex-col mb-16">
            <div className="h-8 w-64 bg-gray-100 animate-pulse rounded mb-2"></div>
            <div className="h-px w-20 bg-gray-100 animate-pulse mb-8"></div>
            <div className="h-4 w-full max-w-xl bg-gray-100 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
            {Array.from({length: 8}).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-100 aspect-square w-full rounded"></div>
                <div className="h-4 w-2/3 bg-gray-100 mt-4 rounded"></div>
                <div className="h-4 w-1/3 bg-gray-100 mt-2 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    }>
      <CollectionTemplate
        collection={collection}
        page={page}
        sortBy={sortBy}
        countryCode={countryCode}
      />
    </Suspense>
  )
}
