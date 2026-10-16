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
  const { threshold, calculatePotentialDiscount } = usePromotion()

  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId,
  })

  const selectedPrice = variantId ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-8 bg-slate-100 rounded animate-pulse" />
  }

  const rawNum = selectedPrice.calculated_price_number || 0
  const { discountedPrice: potentialPrice, discountPercent } = calculatePotentialDiscount(rawNum)

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="font-mono text-3xl sm:text-4xl font-bold text-slate-900">
          ₹{formatIndianPrice(rawNum)}
        </span>
        {discountPercent > 0 ? (
          <span className="px-2.5 py-1 rounded-full bg-amber-100/80 text-amber-900 font-jakarta text-xs font-bold border border-amber-200/80 shadow-2xs">
            {discountPercent}% OFF on orders ₹{threshold}+
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full bg-emerald-100/80 text-emerald-900 font-jakarta text-xs font-bold border border-emerald-200/80 shadow-2xs">
            FREE Delivery on orders ₹{threshold}+
          </span>
        )}
      </div>
      {discountPercent > 0 && (
        <p className="text-xs font-jakarta text-slate-600 flex items-center gap-1.5">
          <span>💡</span>
          <span>
            Get this for <strong className="text-emerald-700 font-mono font-bold">₹{formatIndianPrice(potentialPrice)}</strong> (+ FREE Delivery) when your box reaches ₹{threshold}!
          </span>
        </p>
      )}
      <p className="text-[11px] font-jakarta font-semibold text-slate-500">
        ✨ Inclusive of all taxes · Vacuum Sealed Agra Dispatch
      </p>
    </div>
  )
}
