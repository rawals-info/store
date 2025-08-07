import React, { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"
import ProductInfo from "@modules/products/templates/product-info"
import dynamic from "next/dynamic"
import ProductActions from "@modules/products/components/product-actions"
import RelatedProducts from "@modules/products/components/related-products"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import ProductReviews from "../components/product-reviews"
import { generateProductSchema, generateBreadcrumbSchema } from "@lib/seo"
import { getProductReviewSummary, getProductReviews } from "@lib/data/products"
import type { StoreProductReview } from "types/global"

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
  let reviewData = { average_rating: 4.7, count: 89 }
  let reviewList: StoreProductReview[] = []
  try {
    // Summary
    const summary = await getProductReviewSummary(product.id)
    reviewData = {
      average_rating: typeof summary.average_rating === 'number' ? summary.average_rating : 4.7,
      count: typeof summary.count === 'number' ? summary.count : 89
    }

    // Fetch first 3 reviews for schema markup
    const { reviews } = await getProductReviews({ productId: product.id, limit: 3, offset: 0 })
    reviewList = reviews || []
  } catch (error) {
    console.log("Could not fetch reviews, using defaults")
  }

  // Generate product schema for SEO with dynamic review data & real reviews
  const productSchema = generateProductSchema(product, region, reviewData, reviewList)
  
  // Generate breadcrumb schema
  const breadcrumbs = [
    { name: "Home", url: `/${countryCode}` },
    { name: "Products", url: `/${countryCode}/products` },
    ...(product.collection ? [{ name: product.collection.title, url: `/${countryCode}/collections/${product.collection.handle}` }] : []),
    { name: product.title, url: `/${countryCode}/products/${product.handle}` }
  ]
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs)

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
                  <div itemProp="image">
                    <ImageGallery images={galleryImages} />
                  </div>
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
              {/* Hidden offer metadata */}
              <meta itemProp="price" content={product.variants?.[0]?.calculated_price && typeof product.variants[0].calculated_price === 'number' ? (product.variants[0].calculated_price / 100).toFixed(2) : "199.00"} />
              <meta itemProp="priceCurrency" content={region?.currency_code?.toUpperCase() || "INR"} />
              <meta itemProp="availability" content={product.variants?.some(v => v.inventory_quantity && v.inventory_quantity > 0) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"} />
              <meta itemProp="itemCondition" content="https://schema.org/NewCondition" />
              {/* Added price validity date */}
              <meta itemProp="priceValidUntil" content={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} />
              {/* Link references for return policy and shipping details */}
              <link itemProp="hasMerchantReturnPolicy" href="/returns" />
              <link itemProp="shippingDetails" href="/shipping" />
              <div itemProp="seller" itemScope itemType="https://schema.org/Organization">
                <meta itemProp="name" content="Taj Petha" />
              </div>
              
              {/* Directly render ProductActions without an extra server fetch */}
              <ProductActions product={product} region={region} />
            </div>
            
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

      <div 
        className="content-container my-16 small:my-32"
        itemProp="aggregateRating" 
        itemScope 
        itemType="https://schema.org/AggregateRating"
      >
        {/* Use dynamic rating metadata */}
        <meta itemProp="ratingValue" content={reviewData.average_rating.toFixed(1)} />
        <meta itemProp="reviewCount" content={reviewData.count.toString()} />
        <meta itemProp="bestRating" content="5" />
        <meta itemProp="worstRating" content="1" />
        
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
