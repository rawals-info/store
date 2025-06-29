import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import { getProductData } from "@lib/data/products"
import ProductTemplate from "@modules/products/templates"
import { Suspense } from "react"
import SkeletonProductPage from "@modules/skeletons/templates/skeleton-product-page"

type Props = {
  params: { countryCode: string; handle: string }
}

// Set dynamic rendering options for this page
export const dynamic = "force-dynamic"
// Use default fetch caching so region list is cached for 60s on the server
// (still dynamic thanks to force-dynamic)
// export const fetchCache = "force-no-store"
export const revalidate = 0 // Disable revalidation for product pages to avoid the delay

// NOTE: Disabled static params generation to speed up dev and avoid large API calls.
/*
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
*/

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { handle, countryCode } = await props.params
  try {
    const { product } = await getProductData(handle, countryCode)

    if (!product) {
      return notFound()
    }

    return {
      title: `${product.title} | Imperial Craft Of India`,
      description:
        product.description?.substring(0, 160) ||
        `Discover the exquisite ${product.title}, a handcrafted marble piece from our luxury collection.`,
      openGraph: {
        title: `${product.title} | Imperial Craft Of India`,
        description:
          product.description?.substring(0, 160) ||
          `Discover the exquisite ${product.title}, a handcrafted marble piece from our luxury collection.`,
        images: product.thumbnail ? [product.thumbnail] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
      },
    }
  } catch (error) {
    console.error(`Error generating metadata for product:`, error)
    return {
      title: "Product not found",
    }
  }
}

export default async function ProductPage(props: Props) {
  const { handle, countryCode } = await props.params
  try {
    const { product, region } = await getProductData(handle, countryCode)

    if (!product || !region) {
      return notFound()
    }

    return (
      <Suspense fallback={<SkeletonProductPage />}>
        <ProductTemplate
          product={product}
          region={region}
          countryCode={countryCode}
        />
      </Suspense>
    )
  } catch (error) {
    console.error(`Error in ProductPage:`, error)
    // More friendly user interface for errors
    return (
      <div className="py-8 px-4 text-center">
        <div className="bg-red-50 p-6 rounded-lg max-w-lg mx-auto">
          <h2 className="text-xl font-medium text-red-800 mb-2">
            Unable to load product
          </h2>
          <p className="text-red-700">
            We're having trouble loading this product. Please try refreshing the page.
          </p>
          <button
            className="mt-4 px-4 py-2 bg-luxury-gold text-white rounded hover:bg-luxury-gold/90"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }
}
