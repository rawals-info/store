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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { product } = await getProductData(params.handle, params.countryCode)

    if (!product) {
      return notFound()
    }

    return {
      title: `${product.title} | Marble Luxe`,
      description:
        product.description?.substring(0, 160) ||
        `Discover the exquisite ${product.title}, a handcrafted marble piece from our luxury collection.`,
      openGraph: {
        title: `${product.title} | Marble Luxe`,
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
    console.error(`Error generating metadata for product ${params.handle}:`, error)
    return {
      title: "Product not found",
    }
  }
}

export default async function ProductPage({
  params,
}: {
  params: { handle: string; countryCode: string }
}) {
  try {
    const { product, region } = await getProductData(
      params.handle,
      params.countryCode
    )

    if (!product || !region) {
      return notFound()
    }

    return (
      <Suspense fallback={<SkeletonProductPage />}>
        <ProductTemplate
          product={product}
          region={region}
          countryCode={params.countryCode}
        />
      </Suspense>
    )
  } catch (error) {
    console.error(`Error in ProductPage for handle ${params.handle}:`, error)
    // You can return a more user-friendly error page here
    return <div>Error loading product. Please try again later.</div>
  }
}
