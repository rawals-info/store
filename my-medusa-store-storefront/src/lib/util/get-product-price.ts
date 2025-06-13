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
    // Find the price in USD (or first price if no USD)
    const price = variant.prices.find((p: any) => p.currency_code === 'USD') || variant.prices[0]
    
    if (price) {
      const amount = price.amount || 0
      const currencyCode = price.currency_code || 'USD'
      
      // FIXED: Medusa stores prices in dollars/100, so we need to multiply by 100 for display
      const amountInDollars = fixPrecision(amount * 100)
      
      return {
        calculated_price_number: amountInDollars,
        calculated_price: convertToLocale({
          amount: amountInDollars,
          currency_code: currencyCode,
        }),
        original_price_number: amountInDollars,
        original_price: convertToLocale({
          amount: amountInDollars,
          currency_code: currencyCode,
        }),
        currency_code: currencyCode,
        price_type: 'default',
        percentage_diff: 0,
      }
    }
  }
  
  // If we have calculated_price, use that
  if (variant.calculated_price) {
    // IMPORTANT: Check if calculated_amount exists directly on calculated_price
    // or nested in calculated_price.calculated_price as the API might return either format
    const calculatedAmount = typeof variant.calculated_price.calculated_amount === 'number' 
      ? variant.calculated_price.calculated_amount 
      : (variant.calculated_price.calculated_price?.calculated_amount || 0)
      
    // Similarly check for original amount in both locations
    const originalAmount = typeof variant.calculated_price.original_amount === 'number'
      ? variant.calculated_price.original_amount
      : (variant.calculated_price.calculated_price?.original_amount || calculatedAmount)

    // FIXED: Prices need to be multiplied by 100, not divided
    // If the price seems too low (under 10 for most items), assume it needs multiplication
    const isLikelyNeedsMultiplication = calculatedAmount < 10
    
    const finalCalculatedAmount = isLikelyNeedsMultiplication ? fixPrecision(calculatedAmount * 100) : calculatedAmount
    const finalOriginalAmount = isLikelyNeedsMultiplication ? fixPrecision(originalAmount * 100) : originalAmount
    
    const currencyCode = variant.calculated_price.currency_code || 'USD'
    
    console.log("Price debug:", {
      variant: variant.title || variant.id,
      raw_calculated: calculatedAmount,
      raw_original: originalAmount,
      final_calculated: finalCalculatedAmount,
      final_original: finalOriginalAmount,
      needs_multiplication: isLikelyNeedsMultiplication,
      currency: currencyCode
    })
    
    return {
      calculated_price_number: finalCalculatedAmount,
      calculated_price: convertToLocale({
        amount: finalCalculatedAmount,
        currency_code: currencyCode,
      }),
      original_price_number: finalOriginalAmount,
      original_price: convertToLocale({
        amount: finalOriginalAmount,
        currency_code: currencyCode,
      }),
      currency_code: currencyCode,
      price_type: variant.calculated_price.calculated_price?.price_list_type || 'default',
      percentage_diff: getPercentageDiff(
        finalOriginalAmount,
        finalCalculatedAmount
      ),
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
