import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductData } from "@lib/data/products"
import ProductTemplate from "@modules/products/templates"
import { Suspense } from "react"
import SkeletonProductPage from "@modules/skeletons/templates/skeleton-product-page"

import { listProducts } from "@lib/data/products"
import { listIndiaRegions } from "@lib/constants/india-region"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

// 1-hour ISR fallback (on-demand webhook provides instant invalidation on changes)
export const revalidate = 3600

export async function generateStaticParams() {
  const regions = listIndiaRegions()
  const countryCodes = regions.flatMap((r) => r.countries?.map((c) => c.iso_2?.toLowerCase() || "in") || ["in"])

  try {
    const { response } = await listProducts({
      queryParams: { limit: 100, fields: "handle" },
    })

    const handles = response?.products?.map((p) => p.handle).filter(Boolean) as string[] || []

    return countryCodes.flatMap((countryCode) =>
      handles.map((handle) => ({
        countryCode,
        handle,
      }))
    )
  } catch (error) {
    console.error("Failed to generate static params for products:", error)
    return []
  }
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
    const noindex = md?.noindex === true || md?.noindex === "true"
    const ogImage: string | undefined = md?.og_image

    // Compose high-converting SEO title and description with fallbacks
    const baseTitle = seoTitle || `Buy ${product.title} Online (Fresh Agra Preparation) | Taj Petha`
    const descriptionRaw =
      seoDescription ||
      product.description ||
      `Buy authentic ${product.title} online directly from Agra halwais. Fresh daily preparation, vacuum sealed with 30-day freshness, and delivered across India.`
    const description = descriptionRaw.length > 160 ? `${descriptionRaw.substring(0, 157)}...` : descriptionRaw

    // Prefer product thumbnail, then og_image override, then gallery images
    const imageCandidates: string[] = []
    if (product.thumbnail) imageCandidates.push(product.thumbnail)
    if (ogImage) imageCandidates.push(ogImage)
    if (product.images?.length) imageCandidates.push(...product.images.map((i) => i.url))
    // Ensure absolute URLs for social previews
    const toAbsolute = (url: string) =>
      url && (url.startsWith("http://") || url.startsWith("https://"))
        ? url
        : `https://tajpetha.in${url?.startsWith("/") ? "" : "/"}${url || ""}`
    const images = Array.from(new Set(imageCandidates)).slice(0, 4).map(toAbsolute)

    const keywords: string[] = [
      ...(seoKeywords || []),
      `buy ${product.title.toLowerCase()} online`,
      `original ${product.title.toLowerCase()}`,
      `best ${product.title.toLowerCase()} to buy`,
      product.title,
      ...(product.categories?.map((c) => c.name) || []),
      ...(product.tags?.map((t) => t.value || "") || []),
      "buy petha online",
      "agra petha",
      "fresh petha",
      "hygienic packing",
      "free delivery sweets",
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

    // All schema markup (Product, Breadcrumb, FAQ) is generated inside ProductTemplate
    // via generateProductSchema() in @lib/seo — no duplicate schema here.
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
    return notFound()
  }
}
