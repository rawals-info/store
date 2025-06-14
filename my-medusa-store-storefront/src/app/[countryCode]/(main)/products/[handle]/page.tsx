import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import { batchFetch } from "@lib/util/batch-fetch"
import ProductTemplate from "@modules/products/templates"
import { Suspense } from "react"
import SkeletonProductPage from "@modules/skeletons/templates/skeleton-product-page"

type Props = {
  params: { countryCode: string; handle: string }
}

// Set dynamic rendering options for this page
export const dynamic = "force-static"
export const revalidate = 300

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    if (!countryCodes) {
      return []
    }

    // For each country, fetch product handles in parallel
    const countryProducts = await Promise.all(
      countryCodes.map(async (country) => {
        const { response } = await listProducts({
          countryCode: country,
          queryParams: { limit: 100, fields: "handle" },
        })

        return {
          country,
          products: response.products,
        }
      })
    )

    return countryProducts
      .flatMap((countryData) =>
        countryData.products.map((product) => ({
          countryCode: countryData.country,
          handle: product.handle,
        }))
      )
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const paramsData = await props.params
  const { countryCode, handle } = paramsData

  // Use batch fetch for metadata generation
  const responses = await batchFetch([
    {
      path: `/store/regions`,
      cacheTags: ["regions"],
      cacheRevalidate: 60
    },
    {
      path: `/store/products`,
      query: { 
        limit: 1,
        fields: "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags,+categories,+variants.options,+options",
        handle: handle 
      },
      cacheTags: ["products"],
      cacheRevalidate: 60
    }
  ])

  const regionResponse = (responses[0].data as any)
  const regions = regionResponse?.regions || []
  const region = regions.find((r: any) => r.countries.some((c: any) => c.iso_2 === countryCode))
  
  const productResponse = (responses[1].data as any)
  const product = productResponse?.products?.[0]

  if (!region || !product) {
    notFound()
  }

  return {
    title: `${product.title} | Marble Luxe`,
    description: product.description?.substring(0, 160) || `Discover the exquisite ${product.title}, a handcrafted marble piece from our luxury collection.`,
    openGraph: {
      title: `${product.title} | Marble Luxe`,
      description: product.description?.substring(0, 160) || `Discover the exquisite ${product.title}, a handcrafted marble piece from our luxury collection.`,
      images: product.thumbnail ? [product.thumbnail] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
    },
  }
}

export default async function ProductPage(props: Props) {
  const paramsData = await props.params
  const { countryCode, handle } = paramsData
  
  // Use batch fetch instead of parallelFetch to reduce API calls
  const responses = await batchFetch([
    {
      path: `/store/regions`,
      cacheTags: ["regions"],
      cacheRevalidate: 60
    },
    {
      path: `/store/products`,
      query: { 
        limit: 1,
        fields: "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags,+categories,+variants.options,+options",
        handle: handle
      },
      cacheTags: ["products"],
      cacheRevalidate: 60
    }
  ])

  const regionResponse = (responses[0].data as any)
  const regions = regionResponse?.regions || []
  const region = regions.find((r: any) => r.countries.some((c: any) => c.iso_2 === countryCode))
  
  const productResponse = (responses[1].data as any)
  const pricedProduct = productResponse?.products?.[0]

  if (!region || !pricedProduct) {
    notFound()
  }

  return (
    <Suspense fallback={<SkeletonProductPage />}>
      <ProductTemplate
        product={pricedProduct}
        region={region}
        countryCode={countryCode}
      />
    </Suspense>
  )
}
