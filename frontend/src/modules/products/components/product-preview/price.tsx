"use client"

import React from "react"
import { CalculatedVariant } from "@lib/util/get-product-price"
import { formatIndianPrice } from "@lib/util/money"
import { usePromotion } from "@lib/context/promotion-context"

export default function PreviewPrice({
  price,
}: {
  price: CalculatedVariant
}) {
  const { calculatePrice } = usePromotion()

  if (!price || !price.calculated_price || price.calculated_price_number === 0) {
    return null
  }

  const rawNum = price.calculated_price_number || 0
  const { discountedPrice, isDiscounted, discountPercent } = calculatePrice(rawNum)

  return (
    <div className="flex flex-col min-w-0 flex-1">
      <div className="font-mono text-sm sm:text-base font-bold text-slate-900 leading-tight">
        ₹{formatIndianPrice(isDiscounted ? discountedPrice : rawNum)}
      </div>
      {isDiscounted && (
        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
          <span className="font-mono text-[10px] sm:text-xs text-slate-400 line-through">
            ₹{formatIndianPrice(rawNum)}
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded font-jakarta whitespace-nowrap">
            {discountPercent}% OFF
          </span>
        </div>
      )}
    </div>
  )
}
