"use client"

import React, { useEffect, useState } from "react"
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
      <div className="flex items-center gap-1 mt-1.5">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-2.5 h-2.5 bg-slate-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const average = reviewData?.average_rating || 4.8
  const count = reviewData?.count || 48
  const roundedRating = Math.round(average)

  return (
    <div className="flex items-center gap-1 mt-1.5 font-jakarta">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-xs ${i < roundedRating ? 'text-amber-400' : 'text-slate-200'}`}>
            ★
          </span>
        ))}
      </div>
      <span className="text-[10px] font-bold text-slate-500">
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
      
      <div
        data-testid="product-wrapper"
        className="group bg-white rounded-3xl border border-amber-100/90 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full"
      >
        {/* Image Container */}
        <div className="relative">
          <LocalizedClientLink href={`/products/${product.handle}`} className="block relative aspect-square overflow-hidden bg-amber-50/30">
            {/* Promo Tag */}
            <div className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-full bg-petha-amber text-white text-[10px] font-bold font-jakarta uppercase tracking-wider shadow-sm">
              Fresh Batch
            </div>

            {/* Veg Symbol */}
            <div className="absolute top-2.5 right-2.5 z-10 w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-white border border-emerald-600 flex items-center justify-center shadow-sm">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-600" />
            </div>

            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              size="full"
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </LocalizedClientLink>
        </div>

        {/* Product Details */}
        <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
          <div>
            <ProductPreviewRating productId={product.id} />
            
            <LocalizedClientLink href={`/products/${product.handle}`}>
              <h3 className="font-cormorant text-base sm:text-lg font-bold text-slate-900 line-clamp-2 h-[2.5rem] sm:h-auto group-hover:text-petha-amber transition-colors mt-1 leading-tight sm:leading-snug">
                {product.title}
              </h3>
            </LocalizedClientLink>

            <p className="hidden sm:block font-jakarta text-[11px] text-slate-500 mt-0.5 mb-2 line-clamp-1">
              Authentic Agra Recipe · Traditional Pack
            </p>
          </div>

          {/* Price & Quick Add Button */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
            <div className="min-w-0">
              {cheapestPrice ? (
                <div className="font-mono text-sm sm:text-base font-bold text-slate-900">
                  <PreviewPrice price={cheapestPrice} />
                </div>
              ) : (
                <span className="text-xs font-bold text-slate-700 font-jakarta">₹249</span>
              )}
            </div>

            <button
              type="button"
              onClick={handleQuickBuy}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-full bg-petha-amber hover:bg-petha-saffron text-white font-jakarta text-[10px] sm:text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              <ShoppingBag className="w-3 h-3 flex-shrink-0" />
              <span className="whitespace-nowrap">+ Add</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductPreview
export { ProductPreviewRating }
