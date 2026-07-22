import React, { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"
import ProductInfo from "@modules/products/templates/product-info"
import dynamic from "next/dynamic"
import ProductActions from "@modules/products/components/product-actions"
import RelatedProducts from "@modules/products/components/related-products"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { generateProductSchema, generateBreadcrumbSchema, generateFAQSchema } from "@lib/seo"
import { getProductReviewSummary, getProductReviews } from "@lib/data/products"
import type { StoreProductReview } from "types/global"
import FaqAccordion from "@components/FaqAccordion"
import { getProductFaqs } from "@lib/faq/select"
import { ProductTrustBadges } from "@components/TrustBadges"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

// ✅ Code splitting: Dynamically load heavy components
const ImageGallery = dynamic(() => import("@modules/products/components/image-gallery"))
const ProductReviews = dynamic(() => import("../components/product-reviews"), {
  loading: () => <div className="h-48 flex items-center justify-center text-luxury-charcoal/60">Loading reviews...</div>,
})

export default async function ProductTemplate({
  product,
  region,
  countryCode,
}: ProductTemplateProps) {
  // Check if product has specific tags
  const isLimitedEdition = product.tags?.some(tag => 
    tag.value?.toLowerCase().includes("limited") || 
    tag.value?.toLowerCase().includes("edition")
  )

  if (!product) {
    return notFound()
  }

  // Fetch review data and list for schema
  let reviewData = { average_rating: 0, count: 0 }
  let reviewList: StoreProductReview[] = []
  try {
    // Prefer the reviews endpoint that also returns summary fields to avoid
    // incompatibilities between different backends.
    const reviewsResponse = await getProductReviews({ productId: product.id, limit: 3, offset: 0 })

    // Some backends include average_rating/count at the top level; fall back to
    // computing from the returned reviews if needed.
    const avg = (reviewsResponse as any).average_rating
    const cnt = (reviewsResponse as any).count

    if (typeof avg === 'number' && typeof cnt === 'number') {
      reviewData = { average_rating: avg, count: cnt }
    } else {
      const list = (reviewsResponse as any).reviews || []
      const computedCount = Array.isArray(list) ? list.length : 0
      const computedAvg = computedCount > 0
        ? list.reduce((sum: number, r: any) => sum + (Number(r.rating) || 0), 0) / computedCount
        : 0
      reviewData = { average_rating: computedAvg, count: computedCount }
    }

    reviewList = (reviewsResponse as any).reviews || []
  } catch (error) {
    console.log("Could not fetch reviews; proceeding without defaults")
  }

  // Generate product schema for SEO with dynamic review data & real reviews
  const productSchema = generateProductSchema(product, region, countryCode, reviewData, reviewList)
  
  // Generate breadcrumb schema
  const breadcrumbs = [
    { name: "Home", url: `/${countryCode}` },
    { name: "Products", url: `/${countryCode}/products` },
    ...(product.collection ? [{ name: product.collection.title, url: `/${countryCode}/collections/${product.collection.handle}` }] : []),
    { name: product.title, url: `/${countryCode}/products/${product.handle}` }
  ]
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs)

  // Build FAQs for this product based on category/collection
  const faqs = getProductFaqs(product)
  const faqJsonLd = generateFAQSchema(
    faqs.map((f) => ({ question: f.question, answer: typeof f.answer === "string" ? f.answer : "" }))
  )

  return (
    <>
      {/* SEO Schema Markup for Product */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      {/* FAQ Schema for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />
      
      <div
        className="content-container py-12 px-4"
        data-testid="product-container"
      >

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left column - Image gallery */}
          <div className="flex-1 w-full">
            <Suspense fallback={
              <div className="aspect-[29/36] w-full bg-gray-100 animate-pulse rounded-lg"></div>
            }>
              {/* If the product has no images array, fall back to its thumbnail so that the gallery is never empty */}
              {(() => {
                const galleryImages =
                  product?.images && product.images.length > 0
                    ? product.images
                    : product.thumbnail
                    ? [{ id: `${product.id}-thumbnail`, url: product.thumbnail }]
                    : []

                return (
                  <ImageGallery images={galleryImages} />
                )
              })()}
            </Suspense>
          </div>
          
          {/* Right column - Product info and actions */}
          <div className="flex-1">
            <ProductInfo product={product} reviewData={reviewData} />
            
            <div 
              className="mt-8 pt-4 border-t border-luxury-gold/20"
            >
              {/* Directly render ProductActions without an extra server fetch */}
              <ProductActions product={product} region={region} />
            </div>
            
            {/* Trust Badges */}
            <ProductTrustBadges className="mt-6" />
            
            {/* Craftmanship note */}
            {isLimitedEdition && (
              <div className="mt-6 py-4 px-5 bg-luxury-gold/10 border-l-2 border-luxury-gold">
                <p className="text-sm text-luxury-charcoal/80 italic">
                  <span className="font-semibold not-italic">Limited Edition:</span> This piece is part of a limited collection, with only a select number available. Each piece is individually numbered and comes with a certificate of authenticity.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Product FAQs */}
      <section className="content-container my-10">
        <h2 className="font-display text-2xl lg:text-3xl text-luxury-charcoal mb-4">Frequently Asked Questions</h2>
        <div className="h-px w-24 bg-luxury-gold mb-6"></div>
        <FaqAccordion faqs={faqs} />
      </section>

      <div className="content-container my-16 small:my-32">
        <ProductReviews productId={product.id} />
      </div>
      
      <div className="bg-luxury-cream/10 py-16">
        <div
          className="content-container"
          data-testid="related-products-container"
        >
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl lg:text-3xl text-luxury-charcoal">You May Also Like</h2>
            <div className="h-px w-24 bg-luxury-gold mx-auto mt-4"></div>
          </div>
          <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts product={product} countryCode={countryCode} />
          </Suspense>
        </div>
      </div>
      
    </>
  )
}
