import React, { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"
import ProductInfo from "@modules/products/templates/product-info"
import dynamic from "next/dynamic"
import ProductActions from "@modules/products/components/product-actions"
import RelatedProducts from "@modules/products/components/related-products"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import ProductReviews from "../components/product-reviews"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

// Dynamically load the gallery; keep SSR so it renders on the server and avoids the forbidden ssr:false flag.
const ImageGallery = dynamic(() => import("@modules/products/components/image-gallery"))

export default function ProductTemplate({
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

  return (
    <>
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
              <ImageGallery images={product?.images || []} />
            </Suspense>
          </div>
          
          {/* Right column - Product info and actions */}
          <div className="flex-1">
            <ProductInfo product={product} />
            
            <div className="mt-8 pt-4 border-t border-luxury-gold/20">
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
