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

// Client-side rating component
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
      <div className="flex items-center gap-1 mt-2">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3 h-3 bg-luxury-charcoal/10 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!reviewData || reviewData.count === 0) {
    return null
  }

  const { average_rating, count } = reviewData
  const roundedRating = Math.round(average_rating)

  return (
    <div className="flex items-center gap-1.5 mt-2">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-3 h-3 ${i < roundedRating ? 'text-yellow-500' : 'text-luxury-charcoal/20'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-luxury-charcoal/60">
        ({count})
      </span>
    </div>
  )
}

const ProductPreview = ({
  product,
  region,
  isFeatured,
}: {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  isFeatured?: boolean
}) => {
  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false)

  const { cheapestPrice } = getProductPrice({
    product,
  })

  // Check if product has a real discount (compare_at_amount exists and is higher)
  const hasDiscount = cheapestPrice &&
    cheapestPrice.price_type === "sale" &&
    cheapestPrice.original_price !== cheapestPrice.calculated_price

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
          className="overflow-hidden rounded bg-white border border-luxury-charcoal/5 transition-all duration-300 hover:shadow-lg hover:border-luxury-charcoal/10 hover:-translate-y-1"
        >
          {/* Image container */}
          <div className="relative">
            <div className="w-full overflow-hidden relative aspect-[4/3]">
              <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
                <Thumbnail
                  thumbnail={product.thumbnail}
                  images={product.images}
                  size="full"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* Subtle overlay on hover */}
            <div
              className="absolute inset-0 bg-luxury-charcoal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />

            {/* Quick Buy button */}
            <div className="absolute bottom-3 left-3 right-3 z-20 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-2 sm:group-hover:translate-y-0 transition-all duration-300">
              <button
                onClick={handleQuickBuy}
                className="w-full bg-luxury-charcoal hover:bg-luxury-charcoal/90 text-white py-2.5 px-4 text-sm font-medium tracking-wide flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Quick Add</span>
              </button>
            </div>

            {/* Discount badge - only show for real discounts */}
            {hasDiscount && isInStock && (
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-luxury-charcoal text-white px-2.5 py-1 text-[10px] uppercase tracking-wider font-medium">
                  Special Price
                </span>
              </div>
            )}

            {/* Out of stock badge */}
            {!isInStock && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                <span className="bg-luxury-charcoal/80 text-white px-4 py-2 text-xs uppercase tracking-wider">
                  Sold Out
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Product title */}
            <Text className="text-sm font-medium text-luxury-charcoal group-hover:text-luxury-gold transition-colors duration-300 line-clamp-1">
              {product.title}
            </Text>

            {/* Rating */}
            <ProductPreviewRating productId={product.id} />

            {/* Price */}
            <div className="mt-3 flex items-baseline gap-2">
              {cheapestPrice ? (
                <>
                  <PreviewPrice price={cheapestPrice} />
                  {hasDiscount && cheapestPrice.original_price && (
                    <span className="text-xs text-luxury-charcoal/40 line-through">
                      {cheapestPrice.original_price}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-sm text-luxury-charcoal/60">
                  Contact for price
                </span>
              )}
            </div>

            {/* Category */}
            {product.categories && product.categories.length > 0 && (
              <div className="mt-2 pt-2 border-t border-luxury-charcoal/5">
                <span className="text-[10px] uppercase tracking-wider text-luxury-charcoal/40">
                  {product.categories[0].name}
                </span>
              </div>
            )}
          </div>
        </div>
      </LocalizedClientLink>
    </>
  )
}

export default ProductPreview
export { ProductPreviewRating }
