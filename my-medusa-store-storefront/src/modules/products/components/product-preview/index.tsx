"use client"

import React from "react"
import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

const ProductPreview = ({
  product,
  region,
}: {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}) => {
  const { cheapestPrice } = getProductPrice({
    product,
  })
  
  const isLimitedEdition = product.tags?.some(tag => 
    tag.value?.toLowerCase().includes("limited") || 
    tag.value?.toLowerCase().includes("edition")
  )
  
  const isHandcrafted = true // All our products are handcrafted

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group"
    >
      <div
        data-testid="product-wrapper" className="overflow-hidden rounded-sm border border-luxury-gold/10 bg-luxury-ivory/10 transition-all duration-300 group-hover:shadow-md group-hover:border-luxury-gold/30 group-hover:-translate-y-1">
        <div className="relative">
          {/* Product thumbnail - reduced in height */}
          <div className="w-full overflow-hidden relative" style={{ height: '260px' }}>
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              size="full"
              isFeatured={product.isFeatured}
              className="transition-transform duration-700 group-hover:scale-110 object-cover w-full h-full"
            />
          </div>
          
          {/* Gold gradient overlay on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
            background: 'linear-gradient(to bottom, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.3))'
          }}></div>
          
          {/* Quick View button appears on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-20 transform translate-y-4 group-hover:translate-y-0">
            <span className="bg-luxury-ivory/95 border border-luxury-gold px-4 py-2 text-luxury-charcoal text-[10px] uppercase tracking-wider hover:bg-luxury-gold hover:text-luxury-ivory transition-colors duration-300 shadow-sm">
              Quick View
            </span>
          </div>
          
          {/* Product badges container */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {/* Handcrafted badge */}
            {isHandcrafted && (
              <div className="badge-container">
                <span className="bg-luxury-ivory/95 border border-luxury-gold/60 px-2 py-1 text-luxury-charcoal text-[9px] uppercase tracking-wider font-medium flex items-center">
                  <svg className="w-2.5 h-2.5 mr-1 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"></path>
                  </svg>
                  Handcrafted
                </span>
              </div>
            )}
            
            {/* Limited Edition badge */}
            {isLimitedEdition && (
              <div className="badge-container">
                <span className="bg-luxury-gold/90 px-2 py-1 text-luxury-ivory text-[9px] uppercase tracking-wider font-medium flex items-center">
                  <svg className="w-2.5 h-2.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                  </svg>
                  Limited Edition
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex flex-row items-center justify-between mb-1.5">
            <Text className="text-base font-serif font-medium text-luxury-charcoal hover:text-luxury-gold transition-colors duration-300 flex-grow pr-3 truncate">
              {product.title}
            </Text>
            
            {/* Use PreviewPrice component to display price with our fixes */}
            {cheapestPrice ? (
              <PreviewPrice price={cheapestPrice} />
            ) : (
              <div className="text-luxury-gold font-medium text-base-regular font-serif">
                Contact for price
              </div>
            )}
          </div>
          
          {/* Category tags */}
          <div className="flex flex-wrap gap-1 mt-2">
            {product.categories?.slice(0, 2).map((category) => (
              <div key={category.id} className="text-luxury-charcoal/60 text-[10px] uppercase tracking-wide">
                {category.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}

export default ProductPreview
