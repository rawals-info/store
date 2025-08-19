import React, { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"
import ProductInfo from "@modules/products/templates/product-info"
import dynamic from "next/dynamic"
import ProductActions from "@modules/products/components/product-actions"
import RelatedProducts from "@modules/products/components/related-products"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import ProductReviews from "../components/product-reviews"
import { generateProductSchema, generateBreadcrumbSchema, generateFAQSchema, getBaseURL } from "@lib/seo"
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

// Dynamically load the gallery; keep SSR so it renders on the server and avoids the forbidden ssr:false flag.
const ImageGallery = dynamic(() => import("@modules/products/components/image-gallery"))

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
    // Summary
    const summary = await getProductReviewSummary(product.id)
    reviewData = {
      average_rating: typeof summary.average_rating === 'number' ? summary.average_rating : 0,
      count: typeof summary.count === 'number' ? summary.count : 0
    }

    // Fetch first 3 reviews for schema markup
    const { reviews } = await getProductReviews({ productId: product.id, limit: 3, offset: 0 })
    reviewList = reviews || []
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
        itemScope
        itemType="https://schema.org/Product"
      >
        {/* Hidden metadata for better SEO - structured data in HTML */}
        <meta itemProp="name" content={product.title} />
        <meta itemProp="description" content={product.description || `Authentic ${product.title} from Taj Petha`} />
        <meta itemProp="sku" content={product.variants?.[0]?.sku || `TAJ-${product.id}`} />
        <meta itemProp="url" content={`/${countryCode}/products/${product.handle}`} />
        
        {/* Add product images as microdata with absolute URLs */}
        {(() => {
          const baseUrl = getBaseURL()
          const toAbsolute = (url: string) => {
            if (!url) return ""
            if (url.startsWith("http://") || url.startsWith("https://")) return url
            return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`
          }
          const urls = (product.images?.map((i) => i.url) || (product.thumbnail ? [product.thumbnail] : [])).map(toAbsolute)
          return urls.map((u, index) => (
            <meta key={index} itemProp="image" content={u} />
          ))
        })()}
        
        {/* Brand information */}
        <div itemProp="brand" itemScope itemType="https://schema.org/Brand" style={{ display: 'none' }}>
          <meta itemProp="name" content="Taj Petha" />
        </div>
        
        {/* Category information */}
        <meta itemProp="category" content={product.categories?.[0]?.name || product.collection?.title || "Indian Sweets"} />
        
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
              itemProp="offers" 
              itemScope 
              itemType="https://schema.org/Offer"
            >
              {/* Complete offer metadata */}
              <meta
                itemProp="price"
                content={(function () {
                  const wantedCurrency = (region?.currency_code || 'INR').toUpperCase()
                  const variants = Array.isArray(product.variants) ? product.variants : []
                  const amounts: number[] = []
                  for (const v of variants as any[]) {
                    const cp = v?.calculated_price
                    if (cp && cp.currency_code && cp.currency_code.toUpperCase() === wantedCurrency && cp.calculated_amount !== undefined) {
                      const amt = Number(cp.calculated_amount)
                      if (!Number.isNaN(amt)) amounts.push(amt)
                      continue
                    }
                    const matchInPrices = (v?.prices || []).find((p: any) => p?.currency_code && p.currency_code.toUpperCase() === wantedCurrency)
                    if (matchInPrices && matchInPrices.amount !== undefined) {
                      const amt = Number(matchInPrices.amount)
                      if (!Number.isNaN(amt)) amounts.push(amt)
                    }
                  }
                  const best = amounts.length > 0 ? Math.min(...amounts) : null
                  const minor = best !== null ? best : (function () {
                    const any: number[] = []
                    for (const v of variants as any[]) {
                      const cp = v?.calculated_price
                      if (cp && cp.calculated_amount !== undefined) {
                        const amt = Number(cp.calculated_amount)
                        if (!Number.isNaN(amt)) any.push(amt)
                      } else if (Array.isArray(v?.prices) && v.prices.length > 0) {
                        const amt = Number(v.prices[0]?.amount)
                        if (!Number.isNaN(amt)) any.push(amt)
                      }
                    }
                    return any.length > 0 ? Math.min(...any) : 0
                  })()
                  return (Number(minor) / 100).toFixed(2)
                })()}
              />
              <div itemProp="priceSpecification" itemScope itemType="https://schema.org/PriceSpecification" style={{ display: 'none' }}>
                {(() => {
                  const wantedCurrency = (region?.currency_code || 'INR').toUpperCase()
                  const variants = Array.isArray(product.variants) ? product.variants : []
                  const amounts: number[] = []
                  for (const v of variants as any[]) {
                    const cp = v?.calculated_price
                    if (cp && cp.currency_code && cp.currency_code.toUpperCase() === wantedCurrency && cp.calculated_amount !== undefined) {
                      const amt = Number(cp.calculated_amount)
                      if (!Number.isNaN(amt)) amounts.push(amt)
                      continue
                    }
                    const matchInPrices = (v?.prices || []).find((p: any) => p?.currency_code && p.currency_code.toUpperCase() === wantedCurrency)
                    if (matchInPrices && matchInPrices.amount !== undefined) {
                      const amt = Number(matchInPrices.amount)
                      if (!Number.isNaN(amt)) amounts.push(amt)
                    }
                  }
                  const best = amounts.length > 0 ? Math.min(...amounts) : null
                  const minor = best !== null ? best : (function () {
                    const any: number[] = []
                    for (const v of variants as any[]) {
                      const cp = v?.calculated_price
                      if (cp && cp.calculated_amount !== undefined) {
                        const amt = Number(cp.calculated_amount)
                        if (!Number.isNaN(amt)) any.push(amt)
                      } else if (Array.isArray(v?.prices) && v.prices.length > 0) {
                        const amt = Number(v.prices[0]?.amount)
                        if (!Number.isNaN(amt)) any.push(amt)
                      }
                    }
                    return any.length > 0 ? Math.min(...any) : 0
                  })()
                  const price = (Number(minor) / 100).toFixed(2)
                  return (
                    <>
                      <meta itemProp="price" content={price} />
                      <meta itemProp="priceCurrency" content={wantedCurrency} />
                    </>
                  )
                })()}
              </div>
              <meta itemProp="priceCurrency" content={region?.currency_code?.toUpperCase() || "INR"} />
              <meta itemProp="availability" content={product.variants?.some(v => v.inventory_quantity && v.inventory_quantity > 0) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"} />
              <meta itemProp="itemCondition" content="https://schema.org/NewCondition" />
              {/* Added price validity date */}
              <meta itemProp="priceValidUntil" content={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} />
              <meta itemProp="url" content={`/${countryCode}/products/${product.handle}`} />
              
              {/* Seller information */}
              <div itemProp="seller" itemScope itemType="https://schema.org/Organization" style={{ display: 'none' }}>
                <meta itemProp="name" content="Taj Petha" />
              </div>
              
              {/* Return policy information */}
              <div itemProp="hasMerchantReturnPolicy" itemScope itemType="https://schema.org/MerchantReturnPolicy" style={{ display: 'none' }}>
                <meta itemProp="returnPolicyCategory" content="https://schema.org/MerchantReturnFiniteReturnWindow" />
                <meta itemProp="merchantReturnDays" content="7" />
                <meta itemProp="refundType" content="https://schema.org/StoreCreditRefund" />
                <meta itemProp="returnMethod" content="https://schema.org/ReturnByMail" />
                <meta itemProp="returnFees" content="https://schema.org/FreeReturn" />
                <link itemProp="url" href={`/${countryCode}/returns`} />
              </div>
              
              {/* Shipping details */}
              <div itemProp="shippingDetails" itemScope itemType="https://schema.org/OfferShippingDetails" style={{ display: 'none' }}>
                <div itemProp="shippingDestination" itemScope itemType="https://schema.org/DefinedRegion">
                  <meta itemProp="addressCountry" content="IN" />
                </div>
                <div itemProp="shippingRate" itemScope itemType="https://schema.org/MonetaryAmount">
                  <meta itemProp="value" content="0.00" />
                  <meta itemProp="currency" content={region?.currency_code?.toUpperCase() || "INR"} />
                </div>
                <div itemProp="deliveryTime" itemScope itemType="https://schema.org/ShippingDeliveryTime">
                  <div itemProp="handlingTime" itemScope itemType="https://schema.org/QuantitativeValue">
                    <meta itemProp="minValue" content="0" />
                    <meta itemProp="maxValue" content="1" />
                    <meta itemProp="unitCode" content="d" />
                  </div>
                  <div itemProp="transitTime" itemScope itemType="https://schema.org/QuantitativeValue">
                    <meta itemProp="minValue" content="1" />
                    <meta itemProp="maxValue" content="4" />
                    <meta itemProp="unitCode" content="d" />
                  </div>
                </div>
              </div>
              
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

        {/* Only include AggregateRating microdata when real review data exists */}
        {reviewData.count > 0 && reviewData.average_rating > 0 && (
          <div 
            className="sr-only"
            itemProp="aggregateRating" 
            itemScope 
            itemType="https://schema.org/AggregateRating"
          >
            <meta itemProp="ratingValue" content={reviewData.average_rating.toFixed(1)} />
            <meta itemProp="reviewCount" content={String(reviewData.count)} />
            <meta itemProp="bestRating" content="5" />
            <meta itemProp="worstRating" content="1" />
          </div>
        )}

        {/* Attach reviews directly to the Product item (sibling of AggregateRating) */}
        {reviewList && reviewList.length > 0 && (
          <div style={{ display: 'none' }}>
            {reviewList.slice(0, 5).map((review, index) => (
              <div key={index} itemProp="review" itemScope itemType="https://schema.org/Review">
                <div itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                  <meta itemProp="ratingValue" content={review.rating.toString()} />
                  <meta itemProp="bestRating" content="5" />
                  <meta itemProp="worstRating" content="1" />
                </div>
                <div itemProp="author" itemScope itemType="https://schema.org/Person">
                  <meta itemProp="name" content={`${review.first_name} ${review.last_name}`.trim() || "Anonymous"} />
                </div>
                <meta itemProp="name" content={review.title || `${product.title} review`} />
                <meta itemProp="reviewBody" content={review.content} />
                <meta itemProp="datePublished" content={new Date().toISOString().split('T')[0]} />
              </div>
            ))}
          </div>
        )}
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
