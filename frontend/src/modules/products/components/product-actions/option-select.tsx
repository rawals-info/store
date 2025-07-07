import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
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

  // Helper to get variant information for a specific option value
  const getVariantInfo = (optionId: string, optionValue: string) => {
    // Find a variant that has this option value
    const variant = product?.variants?.find(v => 
      v.options?.some(opt => opt.option_id === optionId && opt.value === optionValue)
    )
    
    return {
      title: variant?.title || optionValue,
      price: variant?.calculated_price || null,
      inventory: variant?.inventory_quantity,
      sku: variant?.sku || null
    }
  }

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm font-medium">{title}</span>
      <div
        className="flex flex-wrap gap-2"
        data-testid={dataTestId}
      >
        {filteredOptions.map((v) => {
          // Get variant info for this option value when product is available
          const variantInfo = product ? getVariantInfo(option.id, v) : { title: v, price: null, inventory: null, sku: null }
          const isOutOfStock = typeof variantInfo.inventory === 'number' && variantInfo.inventory <= 0
          
          return (
            <button
              onClick={() => updateOption(option.id, v)}
              key={v}
              className={clx(
                "border rounded px-3 py-2 text-sm flex flex-col items-center min-w-[80px] transition-all",
                {
                  "bg-luxury-gold/10 border-luxury-gold": v === current,
                  "border-luxury-charcoal/20 hover:border-luxury-gold/50": v !== current && !isOutOfStock && !disabled,
                  "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed": isOutOfStock || disabled
                }
              )}
              disabled={disabled || isOutOfStock}
              data-testid="option-button"
              title={isOutOfStock ? "Out of stock" : ""}
            >
              <span className="font-medium">{variantInfo.title}</span>
              {variantInfo.sku && <span className="text-xs text-luxury-charcoal/60 mt-1">SKU: {variantInfo.sku}</span>}
              {isOutOfStock && <span className="text-xs text-red-500 mt-1">Out of stock</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
