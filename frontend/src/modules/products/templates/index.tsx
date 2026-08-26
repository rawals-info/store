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
import Breadcrumb from "@modules/common/components/breadcrumb"

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
      
      <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-12">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-testid="product-container"
        >
          {/* Breadcrumbs */}
          <Breadcrumb
            items={[
              { label: "All Sweets", href: `/${countryCode}/products` },
              ...(product.categories?.[0]?.name
                ? [{ label: product.categories[0].name, href: `/${countryCode}/products?category=${product.categories[0].handle}` }]
                : []),
              { label: product.title, isCurrent: true },
            ]}
            countryCode={countryCode}
            className="mb-6 rounded-2xl border border-amber-100/90 shadow-xs"
          />

          {/* Main Card */}
          <div className="bg-white rounded-3xl border border-amber-100/90 p-6 sm:p-10 shadow-sm mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
              {/* Left Column: Image Gallery */}
              <div className="w-full">
                <Suspense fallback={
                  <div className="aspect-square w-full bg-amber-50 rounded-3xl animate-pulse" />
                }>
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
              
              {/* Right Column: Details & Fast Buy Actions */}
              <div className="flex flex-col space-y-6">
                <ProductInfo product={product} reviewData={reviewData} />
                
                <div className="pt-6 border-t border-slate-100">
                  <ProductActions product={product} region={region} />
                </div>
                
                {/* Trust Badges */}
                <ProductTrustBadges className="mt-4" />
              </div>
            </div>
          </div>

          {/* Product FAQs */}
          <section className="bg-white rounded-3xl border border-amber-100/90 p-6 sm:p-10 shadow-sm mb-12">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-jakarta text-[11px] uppercase tracking-widest text-amber-950 font-bold px-3.5 py-1 rounded-full bg-amber-100/90 border border-amber-200">
                Freshness &amp; Shipping Guide
              </span>
            </div>
            <h2 className="font-cormorant text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              Frequently Asked Questions
            </h2>
            <FaqAccordion faqs={faqs} />
          </section>

          {/* Reviews Section */}
          <div className="bg-white rounded-3xl border border-amber-100/90 p-6 sm:p-10 shadow-sm mb-12">
            <ProductReviews productId={product.id} />
          </div>
          
          {/* Related Sweets & Snacks */}
          <div className="bg-white rounded-3xl border border-amber-100/90 p-6 sm:p-10 shadow-sm" data-testid="related-products-container">
            <div className="text-center mb-8">
              <span className="font-jakarta text-xs uppercase tracking-widest text-petha-amber font-bold inline-block px-3 py-1 rounded-full bg-amber-100/70 mb-2">
                Pair With Fresh Sweets
              </span>
              <h2 className="font-cormorant text-3xl sm:text-4xl font-bold text-slate-900">
                You May Also Like
              </h2>
            </div>
            <Suspense fallback={<SkeletonRelatedProducts />}>
              <RelatedProducts product={product} countryCode={countryCode} />
            </Suspense>
          </div>
        </div>
      </div>
      
    </>
  )
}
