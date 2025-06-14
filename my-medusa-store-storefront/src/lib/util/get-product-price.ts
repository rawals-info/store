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
  if (!variant) {
    // If no variant data, return default empty
    return {
      calculated_price_number: 0,
      calculated_price: null,
      original_price_number: 0,
      original_price: null,
      currency_code: 'USD',
      price_type: 'default',
      percentage_diff: 0,
    }
  }

  // Determine target currency from calculated_price or fallback to USD, normalized to uppercase
  const regionCurrency = (variant.calculated_price?.currency_code || 'USD').toUpperCase()

  // 1. Static price list entries on variant.prices
  const prices = variant.prices || []
  if (prices.length > 0) {
    // 1a. Try explicit region price
    const regionPrice = prices.find((p: any) => p.currency_code.toUpperCase() === regionCurrency)
    if (regionPrice) {
      const amount = regionPrice.amount || 0
      const amountInUnits = fixPrecision(amount)
      return {
        calculated_price_number: amountInUnits,
        calculated_price: convertToLocale({ amount: amountInUnits, currency_code: regionCurrency }),
        original_price_number: amountInUnits,
        original_price: convertToLocale({ amount: amountInUnits, currency_code: regionCurrency }),
        currency_code: regionCurrency,
        price_type: 'default',
        percentage_diff: 0,
      }
    }
    // 1b. Fallback USD static price
    const usdPrice = prices.find((p: any) => p.currency_code.toUpperCase() === 'USD')
    if (usdPrice) {
      const amount = usdPrice.amount || 0
      const amountInUnits = fixPrecision(amount)
      return {
        calculated_price_number: amountInUnits,
        calculated_price: convertToLocale({ amount: amountInUnits, currency_code: 'USD' }),
        original_price_number: amountInUnits,
        original_price: convertToLocale({ amount: amountInUnits, currency_code: 'USD' }),
        currency_code: 'USD',
        price_type: 'default',
        percentage_diff: 0,
      }
    }
  }

  // 2. Conversion fallback using calculated_price from API
  if (variant.calculated_price) {
    const rawCal = variant.calculated_price.calculated_amount ?? variant.calculated_price.calculated_price?.calculated_amount ?? 0
    const rawOrig = variant.calculated_price.original_amount ?? variant.calculated_price.calculated_price?.original_amount ?? rawCal
    // Use regionCurrency as currency code, or uppercase calculated_price currency_code as fallback
    const currencyCode = (variant.calculated_price.currency_code || 'USD').toUpperCase()
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

  // 3. If all else fails, return default
  return {
    calculated_price_number: 0,
    calculated_price: null,
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
