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

  // Get the requested currency from calculated_price or fallback to USD
  const requestedCurrency = (variant.calculated_price?.currency_code || 'USD').toUpperCase()
  
  // 1. FIRST: Try to use calculated_price specific to the requested currency
  if (variant.calculated_price && 
      variant.calculated_price.currency_code && 
      variant.calculated_price.currency_code.toUpperCase() === requestedCurrency && 
      variant.calculated_price.calculated_amount !== undefined && 
      variant.calculated_price.calculated_amount !== null) {
    
    const amount = Number(variant.calculated_price.calculated_amount);
    return {
      calculated_price_number: amount,
      calculated_price: convertToLocale({ amount, currency_code: requestedCurrency }),
      original_price_number: amount,
      original_price: convertToLocale({ amount, currency_code: requestedCurrency }),
      currency_code: requestedCurrency,
      price_type: 'default',
      percentage_diff: 0,
    }
  }
  
  // 2. SECOND: Look for a price with matching currency code in prices array
  const prices = variant.prices || [];
  const matchingPrice = prices.find((p: any) => 
    p.currency_code && p.currency_code.toUpperCase() === requestedCurrency
  );
  
  if (matchingPrice) {
    const amount = Number(matchingPrice.amount) || 0;
    return {
      calculated_price_number: amount,
      calculated_price: convertToLocale({ amount, currency_code: requestedCurrency }),
      original_price_number: amount,
      original_price: convertToLocale({ amount, currency_code: requestedCurrency }),
      currency_code: requestedCurrency,
      price_type: 'default',
      percentage_diff: 0,
    }
  }
  
  // 3. THIRD: Get USD price as fallback and display it in USD (don't convert)
  
  // First try calculated_price with USD
  if (variant.calculated_price) {
    // Look through all prices for a USD one
    const allPrices = variant.calculated_price.prices || [];
    const usdCalculatedPrice = allPrices.find((p: any) => 
      p.currency_code && p.currency_code.toUpperCase() === 'USD'
    );
    
    if (usdCalculatedPrice && usdCalculatedPrice.amount) {
      const amount = Number(usdCalculatedPrice.amount);
      return {
        calculated_price_number: amount,
        calculated_price: convertToLocale({ amount, currency_code: 'USD' }),
        original_price_number: amount,
        original_price: convertToLocale({ amount, currency_code: 'USD' }),
        currency_code: 'USD',
        price_type: 'default',
        percentage_diff: 0,
      }
    }
  }
  
  // Then try static USD price in prices array
  const usdPrice = prices.find((p: any) => 
    p.currency_code && p.currency_code.toUpperCase() === 'USD'
  );
  
  if (usdPrice) {
    const amount = Number(usdPrice.amount) || 0;
    return {
      calculated_price_number: amount,
      calculated_price: convertToLocale({ amount, currency_code: 'USD' }),
      original_price_number: amount,
      original_price: convertToLocale({ amount, currency_code: 'USD' }),
      currency_code: 'USD',
      price_type: 'default',
      percentage_diff: 0,
    }
  }
  
  // 4. LAST RESORT: If we have any calculated price, use it regardless of currency
  if (variant.calculated_price && variant.calculated_price.calculated_amount !== undefined) {
    const amount = Number(variant.calculated_price.calculated_amount);
    const currencyCode = (variant.calculated_price.currency_code || 'USD').toUpperCase();
    
    return {
      calculated_price_number: amount,
      calculated_price: convertToLocale({ amount, currency_code: currencyCode }),
      original_price_number: amount,
      original_price: convertToLocale({ amount, currency_code: currencyCode }),
      currency_code: currencyCode,
      price_type: 'default',
      percentage_diff: 0,
    }
  }

  // Final fallback: If all else fails, return default
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
