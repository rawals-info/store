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
  const { threshold, calculatePotentialDiscount } = usePromotion()

  if (!price || !price.calculated_price || price.calculated_price_number === 0) {
    return null
  }

  const rawNum = price.calculated_price_number || 0
  const { discountPercent } = calculatePotentialDiscount(rawNum)

  return (
    <div className="flex flex-col items-start">
      <div className="flex items-baseline gap-1.5 flex-wrap">
        <span className="font-mono font-bold text-sm sm:text-base text-slate-900 leading-tight">
          ₹{formatIndianPrice(rawNum)}
        </span>
        {discountPercent > 0 ? (
          <span className="text-[9px] font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded font-jakarta tracking-tight">
            {discountPercent}% OFF on ₹{threshold}+
          </span>
        ) : (
          <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded font-jakarta tracking-tight">
            FREE Delivery on ₹{threshold}+
          </span>
        )}
      </div>
    </div>
  )
}
