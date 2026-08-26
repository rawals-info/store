"use client"

import React from "react"
import { CalculatedVariant } from "@lib/util/get-product-price"
import { formatIndianPrice } from "@lib/util/money"
import { calculateDiscountedPrice } from "@lib/config/promotions"

export default function PreviewPrice({
  price,
}: {
  price: CalculatedVariant
}) {
  if (!price || !price.calculated_price || price.calculated_price_number === 0) {
    return (
      <div className="font-mono flex flex-col items-start">
        <span className="font-bold text-sm text-slate-800">
          ₹249
        </span>
      </div>
    )
  }

  const rawNum = price.calculated_price_number || 249
  const { discountedPrice, isDiscounted, discountPercent } = calculateDiscountedPrice(rawNum)

  return (
    <div className="flex flex-col items-start">
      <span className="font-mono font-bold text-sm sm:text-base text-slate-900 leading-tight">
        ₹{formatIndianPrice(discountedPrice)}
      </span>
      {isDiscounted && (
        <div className="flex items-center gap-1 mt-0.5">
          <span className="font-mono text-[10px] sm:text-xs text-slate-400 line-through">
            ₹{formatIndianPrice(rawNum)}
          </span>
          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded font-jakarta">
            {discountPercent}% OFF
          </span>
        </div>
      )}
    </div>
  )
}
