import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getProductData } from "@lib/data/products"
import { listIndiaRegions } from "@lib/constants/india-region"
import ProductTemplate from "@modules/products/templates"
import { Suspense } from "react"
import SkeletonProductPage from "@modules/skeletons/templates/skeleton-product-page"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

// Set dynamic rendering options for this page
export const dynamic = "force-dynamic" // Changed to force-dynamic for better dev experience
export const revalidate = 0

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
    // Ensure absolute URLs for social previews
    const toAbsolute = (url: string) =>
      url && (url.startsWith("http://") || url.startsWith("https://"))
        ? url
        : `https://tajpetha.in${url?.startsWith("/") ? "" : "/"}${url || ""}`
    const images = Array.from(new Set(imageCandidates)).slice(0, 4).map(toAbsolute)

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
    return notFound()
  }
}
