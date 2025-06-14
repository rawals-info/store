import { HttpTypes } from "@medusajs/types"
import { getPercentageDiff } from "./get-precentage-diff"
import { convertToLocale } from "./money"

// Define and export the CalculatedVariant type
export type CalculatedVariant = {
  calculated_price: string | null
  calculated_price_number: number
  original_price: string | null
  original_price_number: number
  price_type: string
  percentage_diff: string | number
  currency_code: string
}

// Helper to fix floating point precision issues when multiplying
const fixPrecision = (num: number): number => {
  return Math.round(num * 100) / 100;
}

export const getPricesForVariant = (variant: any) => {
  // Check if variant is missing
  if (!variant) {
    return null
  }
  
  // Check if we have prices array from the API
  if (variant.prices && variant.prices.length > 0) {
    // Find the price matching the region or first available
    const price = variant.prices.find((p: any) => p.currency_code === 'USD') || variant.prices[0]
    
    if (price) {
      const amount = price.amount || 0
      // Treat amount as whole currency units (no division)
      const amountInUnits = fixPrecision(amount)
      
      return {
        calculated_price_number: amountInUnits,
        calculated_price: convertToLocale({
          amount: amountInUnits,
          currency_code: price.currency_code || 'USD',
        }),
        original_price_number: amountInUnits,
        original_price: convertToLocale({
          amount: amountInUnits,
          currency_code: price.currency_code || 'USD',
        }),
        currency_code: price.currency_code || 'USD',
        price_type: 'default',
        percentage_diff: 0,
      }
    }
  }
  
  // If we have calculated_price from API, treat it as cents and divide by 100
  if (variant.calculated_price) {
    const rawCal = variant.calculated_price.calculated_amount ?? variant.calculated_price.calculated_price?.calculated_amount ?? 0
    const rawOrig = variant.calculated_price.original_amount ?? variant.calculated_price.calculated_price?.original_amount ?? rawCal
    const currencyCode = variant.calculated_price.currency_code || 'USD'
    // Treat calculated prices as whole units (no division)
    const finalCalculated = fixPrecision(rawCal)
    const finalOriginal = fixPrecision(rawOrig)
    
    return {
      calculated_price_number: finalCalculated,
      calculated_price: convertToLocale({ amount: finalCalculated, currency_code: currencyCode }),
      original_price_number: finalOriginal,
      original_price: convertToLocale({ amount: finalOriginal, currency_code: currencyCode }),
      currency_code: currencyCode,
      price_type: variant.calculated_price.calculated_price?.price_list_type || 'default',
      percentage_diff: getPercentageDiff(finalOriginal, finalCalculated),
    }
  }

  // If no price data available, return a default structure
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

    // First try to find variants with prices array
    const variantsWithPricesArray = product.variants.filter((v: any) => 
      v.prices && v.prices.length > 0
    )
    
    // If we have variants with prices array, use those
    if (variantsWithPricesArray.length > 0) {
      // Find the cheapest variant based on the first price in the prices array
      const cheapestVariant = variantsWithPricesArray.reduce((cheapest: any, current: any) => {
        const cheapestPrice = cheapest.prices[0]?.amount || Number.MAX_VALUE
        const currentPrice = current.prices[0]?.amount || Number.MAX_VALUE
        return currentPrice < cheapestPrice ? current : cheapest
      }, variantsWithPricesArray[0])
      
      return getPricesForVariant(cheapestVariant)
    }
    
    // Fallback to calculated_price if no prices array is available
    const variantsWithCalculatedPrice = product.variants.filter((v: any) => 
      v.calculated_price && (typeof v.calculated_price.calculated_amount === 'number' || v.calculated_price.calculated_amount)
    )
    
    // If no variants have calculated_price either, return the first variant
    if (variantsWithCalculatedPrice.length === 0) {
      return getPricesForVariant(product.variants[0])
    }

    // Find the cheapest variant based on calculated_price
    const cheapestVariant: any = variantsWithCalculatedPrice
      .sort((a: any, b: any) => {
        const aAmount = Number(a.calculated_price.calculated_amount) || 0
        const bAmount = Number(b.calculated_price.calculated_amount) || 0
        return aAmount - bAmount
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
