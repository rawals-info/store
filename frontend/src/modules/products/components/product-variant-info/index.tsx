import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import React from "react"

type ProductVariantInfoProps = {
  variant?: HttpTypes.StoreProductVariant
  product: HttpTypes.StoreProduct
}

const ProductVariantInfo: React.FC<ProductVariantInfoProps> = ({ 
  variant, 
  product 
}) => {
  // If no variant is selected, don't render anything
  if (!variant) return null
  
  return (
    <div className="mt-4 space-y-3">
      {/* Variant details */}
      <div className="space-y-1">
        {variant.sku && (
          <div className="flex items-center text-sm">
            <span className="text-luxury-charcoal/60 w-20">SKU:</span>
            <span className="font-medium text-luxury-charcoal">{variant.sku}</span>
          </div>
        )}
      </div>
      
      {/* Additional features for this variant if available */}
      {variant.title && variant.title !== "Default Variant" && (
        <div className="pt-4 border-t border-luxury-gold/20">
          <Text className="text-luxury-charcoal text-sm">
            Selected variant: <span className="font-medium">{variant.title}</span>
          </Text>
        </div>
      )}
    </div>
  )
}

export default ProductVariantInfo 