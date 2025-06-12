import { HttpTypes } from "@medusajs/types"
import { getPercentageDiff } from "./get-precentage-diff"
import { convertToLocale } from "./money"

export const getPricesForVariant = (variant: any) => {
  // Check if variant or calculated_price is missing
  if (!variant) {
    return null
  }
  
  // If calculated_price is missing, return a default structure
  if (!variant.calculated_price?.calculated_amount) {
    return {
      calculated_price_number: 0,
      calculated_price: null, // Will be displayed as "Contact for price"
      original_price_number: 0,
      original_price: null,
      currency_code: 'USD',
      price_type: 'default',
      percentage_diff: 0,
    }
  }

  // Ensure we have valid numbers
  const calculatedAmount = typeof variant.calculated_price.calculated_amount === 'number' 
    ? variant.calculated_price.calculated_amount 
    : 0
    
  const originalAmount = typeof variant.calculated_price.original_amount === 'number'
    ? variant.calculated_price.original_amount
    : calculatedAmount // Default to calculated amount if original is not available

  const currencyCode = variant.calculated_price.currency_code || 'USD'
  
  return {
    calculated_price_number: calculatedAmount,
    calculated_price: convertToLocale({
      amount: calculatedAmount,
      currency_code: currencyCode,
    }),
    original_price_number: originalAmount,
    original_price: convertToLocale({
      amount: originalAmount,
      currency_code: currencyCode,
    }),
    currency_code: currencyCode,
    price_type: variant.calculated_price.calculated_price?.price_list_type || 'default',
    percentage_diff: getPercentageDiff(
      originalAmount,
      calculatedAmount
    ),
  }
}

export function getProductPrice({
  product,
  variantId,
}: {
  product: HttpTypes.StoreProduct
  variantId?: string
}) {
  if (!product || !product.id) {
    throw new Error("No product provided")
  }

  const cheapestPrice = () => {
    if (!product || !product.variants?.length) {
      return null
    }

    // Filter out variants without calculated_price to avoid errors
    const variantsWithPrice = product.variants.filter((v: any) => !!v.calculated_price)
    
    // If no variants have calculated_price, return the first variant without price info
    if (variantsWithPrice.length === 0) {
      return getPricesForVariant(product.variants[0])
    }

    const cheapestVariant: any = variantsWithPrice
      .sort((a: any, b: any) => {
        return (
          a.calculated_price.calculated_amount -
          b.calculated_price.calculated_amount
        )
      })[0]

    return getPricesForVariant(cheapestVariant)
  }

  const variantPrice = () => {
    if (!product || !variantId) {
      return null
    }

    const variant: any = product.variants?.find(
      (v) => v.id === variantId || v.sku === variantId
    )

    if (!variant) {
      return null
    }

    return getPricesForVariant(variant)
  }

  return {
    product,
    cheapestPrice: cheapestPrice(),
    variantPrice: variantPrice(),
  }
}
