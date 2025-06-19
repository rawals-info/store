"use client"

import { Text } from "@medusajs/ui"
import { CalculatedVariant } from "@lib/util/get-product-price"
import { clx } from "@medusajs/ui"
import { convertToLocale } from "@lib/util/money"

export default function PreviewPrice({
  price,
}: {
  price: CalculatedVariant
}) {
  // Handle case where price might not be available
  if (!price || !price.calculated_price || price.calculated_price_number === 0) {
    return (
      <div className="font-serif flex flex-col items-end">
        <Text className="text-luxury-gold font-medium text-base-regular">
          Contact for price
        </Text>
      </div>
    )
  }
  
  // Check if this is a sale price
  const isSale = price.price_type === "sale" && 
    price.original_price && 
    price.original_price_number > price.calculated_price_number

  return (
    <div
      className={clx("font-serif flex flex-col items-end", {
        "text-luxury-gold": price.price_type === "sale",
        "text-luxury-charcoal/90": price.price_type !== "sale",
      })}
    >
      {isSale && (
        <Text className="text-ui-fg-muted line-through text-small-regular">
          {price.original_price}
        </Text>
      )}
      <Text className={`font-medium text-base-regular ${isSale ? 'text-ui-fg-interactive' : 'text-luxury-gold'}`}>
        {price.calculated_price}
      </Text>
    </div>
  )
}
