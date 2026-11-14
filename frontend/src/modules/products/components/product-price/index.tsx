"use client"

import { getProductPrice } from "@lib/util/get-product-price"
import { formatIndianPrice } from "@lib/util/money"
import { usePromotion } from "@lib/context/promotion-context"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variantId,
}: {
  product: HttpTypes.StoreProduct
  variantId?: string
}) {
  const { threshold, calculatePrice } = usePromotion()

  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId,
  })

  const selectedPrice = variantId ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-8 bg-slate-100 rounded animate-pulse" />
  }

  const rawNum = selectedPrice.calculated_price_number || 0
  const { discountedPrice, isDiscounted, discountPercent } = calculatePrice(rawNum)

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="font-mono text-3xl sm:text-4xl font-bold text-slate-900">
          ₹{formatIndianPrice(isDiscounted ? discountedPrice : rawNum)}
        </span>
        {isDiscounted ? (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-lg sm:text-xl text-slate-400 line-through">
              ₹{formatIndianPrice(rawNum)}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100/90 text-emerald-800 font-jakarta text-xs font-bold border border-emerald-200/90 shadow-2xs">
              {discountPercent}% OFF APPLIED
            </span>
          </div>
        ) : (
          <span className="px-2.5 py-1 rounded-full bg-emerald-100/80 text-emerald-900 font-jakarta text-xs font-bold border border-emerald-200/80 shadow-2xs">
            FREE Delivery on orders ₹{threshold}+
          </span>
        )}
      </div>
      <p className="text-xs font-jakarta text-emerald-700 font-medium flex items-center gap-1.5">
        <span>✨</span>
        <span>
          {isDiscounted
            ? `Special ${discountPercent}% discount auto-applied · Free express shipping on ₹${threshold}+`
            : `Free express shipping on orders above ₹${threshold}`}
        </span>
      </p>
      <p className="text-[11px] font-jakarta font-semibold text-slate-500">
        ✨ Inclusive of all taxes · Vacuum Sealed Agra Dispatch
      </p>
    </div>
  )
}
