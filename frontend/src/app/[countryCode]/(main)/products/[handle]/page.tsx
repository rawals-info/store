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
// Let products be statically generated with ISR for faster loads and better crawl
export const dynamic = "force-static"
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

    const canonical = `https://tajpetha.in/${countryCode}/products/${product.handle}`

    // Pull optional SEO fields from product.metadata
    const md: Record<string, any> | undefined = (product as any)?.metadata
    const seoTitle: string | undefined = md?.seo_title
    const seoDescription: string | undefined = md?.seo_description
    const seoKeywords: string[] | undefined = md?.seo_keywords
    const noindex: boolean | undefined = md?.noindex
    const ogImage: string | undefined = md?.og_image

    // Compose title and description with fallbacks
    const baseTitle = seoTitle || `${product.title} | Taj Petha`
    const descriptionRaw =
      seoDescription ||
      product.description ||
      `Buy ${product.title} online. Made fresh with hygienic packing, same-day dispatch, and quick delivery across India.`
    const description = descriptionRaw.length > 160 ? `${descriptionRaw.substring(0, 157)}...` : descriptionRaw

    // Prefer product thumbnail, then og_image override, then gallery images
    const imageCandidates: string[] = []
    if (product.thumbnail) imageCandidates.push(product.thumbnail)
    if (ogImage) imageCandidates.push(ogImage)
    if (product.images?.length) imageCandidates.push(...product.images.map((i) => i.url))
    const images = Array.from(new Set(imageCandidates)).slice(0, 4)

    const keywords: string[] = [
      ...(seoKeywords || []),
      product.title,
      ...(product.categories?.map((c) => c.name) || []),
      ...(product.tags?.map((t) => t.value || "") || []),
      "buy online",
      "fresh petha",
      "hygienic packing",
    ].filter(Boolean)

    return {
      title: baseTitle,
      description,
      keywords,
      robots: noindex
        ? { index: false, follow: true, googleBot: { index: false, follow: true } }
        : undefined,
      openGraph: {
        title: baseTitle,
        description,
        images: images.length ? images : undefined,
        type: "website",
        url: canonical,
      },
      twitter: {
        card: "summary_large_image",
        title: baseTitle,
        description,
        images: images.length ? images : undefined,
      },
      alternates: {
        canonical,
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
