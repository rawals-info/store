import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabsWrapper from "@modules/products/components/product-tabs-wrapper"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import { HttpTypes } from "@medusajs/types"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

export default async function ProductTemplate({
  product,
  region,
  countryCode,
}: ProductTemplateProps) {
  if (!product) {
    return notFound()
  }

  // Check if product has specific tags
  const isLimitedEdition = product.tags?.some(tag => 
    tag.value?.toLowerCase().includes("limited") || 
    tag.value?.toLowerCase().includes("edition")
  )

  return (
    <>
      <div className="bg-luxury-cream/20 py-3 text-center text-sm text-luxury-charcoal/70">
        <p>Each marble piece is uniquely handcrafted by our master artisans</p>
      </div>
      
      <div
        className="content-container py-12 px-4"
        data-testid="product-container"
      >
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left column - Image gallery */}
          <div className="flex-1">
            <ImageGallery images={product?.images || []} />
          </div>
          
          {/* Right column - Product info and actions */}
          <div className="flex-1">
            <ProductInfo product={product} />
            
            <div className="mt-8 pt-4 border-t border-luxury-gold/20">
              <Suspense
                fallback={
                  <ProductActions
                    disabled={true}
                    product={product}
                    region={region}
                  />
                }
              >
                <ProductActionsWrapper id={product.id} region={region} />
              </Suspense>
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
        
        {/* Product details tabs */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="border-b border-luxury-gold/20 mb-8">
            <h2 className="font-display text-2xl text-luxury-charcoal">Product Details</h2>
          </div>
          <Suspense fallback={<div className="h-[200px] flex items-center justify-center">
            <p className="text-luxury-charcoal/50">Loading product details...</p>
          </div>}>
            <ProductTabsWrapper product={product} />
          </Suspense>
        </div>
      </div>
      
      {/* Related products section */}
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
      
      {/* Craftsmanship commitment section */}
      <div className="content-container my-16">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="font-display text-xl text-luxury-charcoal mb-4">Our Craftsmanship Commitment</h3>
          <p className="text-luxury-charcoal/80 text-serif-italic mb-6">
            Each marble piece in our collection represents hours of dedicated craftsmanship. Our artisans, with decades of expertise, 
            transform raw marble into exquisite works of art that bring elegance and timeless beauty to your space.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="p-6 border border-luxury-gold/20 hover:border-luxury-gold/50 transition-colors">
              <h4 className="uppercase tracking-wider text-sm font-medium text-luxury-charcoal mb-3">Ethically Sourced</h4>
              <p className="text-sm text-luxury-charcoal/70">Our marble is ethically sourced from the finest quarries, selected for its exceptional quality and unique veining patterns.</p>
            </div>
            <div className="p-6 border border-luxury-gold/20 hover:border-luxury-gold/50 transition-colors">
              <h4 className="uppercase tracking-wider text-sm font-medium text-luxury-charcoal mb-3">Hand-Finished</h4>
              <p className="text-sm text-luxury-charcoal/70">Every piece is meticulously hand-finished by our master craftsmen, ensuring exceptional attention to detail and perfect edges.</p>
            </div>
            <div className="p-6 border border-luxury-gold/20 hover:border-luxury-gold/50 transition-colors">
              <h4 className="uppercase tracking-wider text-sm font-medium text-luxury-charcoal mb-3">Quality Guaranteed</h4>
              <p className="text-sm text-luxury-charcoal/70">Each product undergoes rigorous quality control before leaving our workshop, backed by our lifetime craftsmanship guarantee.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
