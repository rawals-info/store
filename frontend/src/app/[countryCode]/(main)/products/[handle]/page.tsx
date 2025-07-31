import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getProductData } from "@lib/data/products"
import { listIndiaRegions } from "@lib/constants/india-region"
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
// Cache the product page for 5 minutes to balance freshness with performance.
export const revalidate = 300

// NOTE: Disabled static params generation to speed up dev and avoid large API calls.
export async function generateStaticParams() {
  const countryCodes = listIndiaRegions().flatMap(region =>
    region.countries?.map(country => country.iso_2).filter(Boolean) || []
  )

  if (!countryCodes.length) {
    return []
  }

  const { response } = await listProducts({ queryParams: { limit: 100 } })
  const products = response.products

  const staticParams = countryCodes
    ?.map((countryCode) =>
      products?.map((product) => ({
        countryCode,
        handle: product.handle,
      }))
    )
    .flat()

  return staticParams || []
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { handle, countryCode } = await props.params
  try {
    const { product } = await getProductData(handle, countryCode)

    if (!product) {
      return notFound()
    }

    return {
      title: `${product.title} | Taj Petha`,
      description:
        product.description?.substring(0, 160) ||
        `Discover the delicious ${product.title}, an authentic Agra petha sweet from our premium collection.`,
      openGraph: {
        title: `${product.title} | Taj Petha`,
        description:
          product.description?.substring(0, 160) ||
          `Discover the delicious ${product.title}, an authentic Agra petha sweet from our premium collection.`,
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
