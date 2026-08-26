"use client"

import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import { formatIndianPrice } from "@lib/util/money"
import { calculateDiscountedPrice } from "@lib/config/promotions"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
  product?: HttpTypes.StoreProduct
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
  product,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-jakarta">
          Select {title}:
        </span>
        <span className="text-[11px] font-semibold text-emerald-700 font-jakarta">
          💡 Bigger pack = Extra Savings
        </span>
      </div>
      <div
        className="flex flex-wrap gap-2"
        data-testid={dataTestId}
      >
        {filteredOptions.map((v, index) => {
          const isSelected = v === current
          const isLargest = index === filteredOptions.length - 1 && filteredOptions.length > 1

          // Find variant price if available
          const matchingVariant = product?.variants?.find((variant) =>
            variant.options?.some((opt) => opt.value === v)
          ) as any

          const rawAmt = Number(matchingVariant?.calculated_price?.calculated_amount || matchingVariant?.prices?.[0]?.amount || 0)
          const { discountedPrice: discAmt } = calculateDiscountedPrice(rawAmt)

          return (
            <button
              type="button"
              onClick={() => updateOption(option.id, v)}
              key={v}
              disabled={disabled}
              className={clx(
                "px-3.5 py-2 rounded-xl text-xs font-jakarta font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 shadow-xs",
                isSelected
                  ? "bg-amber-50 border-2 border-petha-amber text-amber-950 ring-1 ring-petha-amber/20 shadow-sm"
                  : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              )}
              data-testid="option-button"
            >
              <span>{v}</span>
              {discAmt > 0 && (
                <span className={`text-[11px] font-mono font-medium ${isSelected ? 'text-amber-800' : 'text-slate-500'}`}>
                  ₹{formatIndianPrice(discAmt)}
                </span>
              )}
              {isLargest && (
                <span className="bg-amber-200/90 text-amber-900 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-tight">
                  Best Value
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
