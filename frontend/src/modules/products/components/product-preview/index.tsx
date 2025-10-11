"use client"

import React, { useEffect, useState } from "react"
import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { getProductReviewSummary } from "@lib/data/products"
import QuickBuyModal from "@components/QuickBuyModal"
import { ShoppingBag } from "lucide-react"

// Client-side rating component for ProductPreview
const ProductPreviewRating = ({ productId }: { productId: string }) => {
  const [reviewData, setReviewData] = useState<{ average_rating: number; count: number } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getProductReviewSummary(productId)
      .then(setReviewData)
      .finally(() => setIsLoading(false))
  }, [productId])

  if (isLoading) {
    return (
      <div className="flex items-center space-x-1 mt-1">
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-2.5 h-2.5 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!reviewData || reviewData.count === 0) {
    return null // Don't show anything if no reviews
  }

  const { average_rating, count } = reviewData
  const roundedRating = Math.round(average_rating)

  return (
    <div className="flex items-center space-x-1 mt-1">
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-2.5 h-2.5 ${i < roundedRating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-gray-500">
        {average_rating.toFixed(1)} ({count})
      </span>
    </div>
  )
}

const ProductPreview = ({
  product,
  region,
}: {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}) => {
  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false)
  
  const { cheapestPrice } = getProductPrice({
    product,
  })
  
  const isLimitedEdition = product.tags?.some(tag => 
    tag.value?.toLowerCase().includes("limited") || 
    tag.value?.toLowerCase().includes("edition")
  )
  
  // Generate fake low stock number for urgency (2-8 items left)
  const getLowStockCount = () => {
    const seed = product.id?.charCodeAt(0) || 0
    return ((seed % 7) + 2) // Returns 2-8
  }
  const lowStockCount = getLowStockCount()
  
  // Randomly show low stock indicator (70% of products)
  const showLowStock = (product.id?.charCodeAt(product.id.length - 1) || 0) % 10 < 7
  
  // Check if product is in stock
  const isInStock = product.variants?.some(variant => 
    !variant.manage_inventory || 
    variant.allow_backorder || 
    (variant.inventory_quantity && variant.inventory_quantity > 0)
  ) ?? true

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsQuickBuyOpen(true)
  }

  return (
    <>
      <QuickBuyModal
        product={product}
        region={region}
        isOpen={isQuickBuyOpen}
        onClose={() => setIsQuickBuyOpen(false)}
      />
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group"
    >
      <div
        data-testid="product-wrapper" 
        className="overflow-hidden rounded-sm border border-luxury-gold/10 bg-luxury-ivory/10 transition-all duration-300 hover:shadow-md hover:border-luxury-gold/30 hover:-translate-y-2 active:scale-[0.98]"
      >
        <div className="relative">
          {/* Product thumbnail - reduced in height */}
          <div className="w-full overflow-hidden relative" style={{ height: '260px' }}>
            <div className="w-full h-full transition-transform duration-300 group-hover:scale-110">
              <Thumbnail
                thumbnail={product.thumbnail}
                images={product.images}
                size="full"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          
          {/* Gold gradient overlay on hover */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
            style={{
              background: 'linear-gradient(to bottom, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.3))'
            }}
          />
          
          {/* Quick Buy button - Always visible on mobile, hover on desktop */}
          <div className="absolute bottom-3 left-3 right-3 z-20 flex gap-2 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-2 sm:group-hover:translate-y-0 transition-all duration-300">
            <button
              onClick={handleQuickBuy}
              className="flex-1 bg-luxury-gold hover:bg-luxury-gold/90 text-white py-2.5 px-4 text-sm font-medium uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Quick Buy</span>
              <span className="sm:hidden">Buy Now</span>
            </button>
          </div>
          
          {/* Product badges container */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {/* Discount Badge - Mobile-Optimized */}
            {isInStock && (
              <div className="badge-container">
                <span className="bg-gradient-to-r from-luxury-gold to-yellow-600 px-2 py-1 sm:px-2.5 sm:py-1.5 text-white text-[9px] sm:text-[10px] uppercase tracking-wider font-bold flex items-center shadow-md">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                  </svg>
                  Save 20%
                </span>
              </div>
            )}
            
            {/* Limited Edition badge */}
            {isLimitedEdition && (
              <div className="badge-container">
                <span className="bg-luxury-charcoal/90 backdrop-blur-sm px-2 py-1 text-luxury-ivory text-[9px] uppercase tracking-wider font-medium flex items-center border border-luxury-gold/30">
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
          
          {/* Add Reviews Rating */}
          <ProductPreviewRating productId={product.id} />
          
          {/* Low Stock Urgency - Elegant Style */}
          {isInStock && showLowStock && (
            <div className="mt-2 pt-2 border-t border-luxury-gold/20">
              <div className="flex items-center gap-1.5 text-xs">
                <svg className="w-3 h-3 text-orange-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-orange-600">
                  Only {lowStockCount} left
                </span>
              </div>
            </div>
          )}
          
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
    </>
  )
}

export default ProductPreview
export { ProductPreviewRating }
