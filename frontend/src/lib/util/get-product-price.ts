import { HttpTypes } from "@medusajs/types"
import { getPercentageDiff } from "./get-precentage-diff"
import { convertToLocale } from "./money"
import { DEFAULT_CURRENCY } from "@lib/config/defaults"

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
      currency_code: DEFAULT_CURRENCY,
      price_type: 'default',
      percentage_diff: 0,
    }
  }

  // Get the requested currency from calculated_price or fallback to USD
  const requestedCurrency = (variant.calculated_price?.currency_code || DEFAULT_CURRENCY).toUpperCase()
  
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
      p.currency_code && p.currency_code.toUpperCase() === DEFAULT_CURRENCY
    );
    
    if (usdCalculatedPrice && usdCalculatedPrice.amount) {
      const amount = Number(usdCalculatedPrice.amount);
      return {
        calculated_price_number: amount,
        calculated_price: convertToLocale({ amount, currency_code: DEFAULT_CURRENCY }),
        original_price_number: amount,
        original_price: convertToLocale({ amount, currency_code: DEFAULT_CURRENCY }),
        currency_code: DEFAULT_CURRENCY,
        price_type: 'default',
        percentage_diff: 0,
      }
    }
  }
  
  // Then try static USD price in prices array
  const usdPrice = prices.find((p: any) => 
    p.currency_code && p.currency_code.toUpperCase() === DEFAULT_CURRENCY
  );
  
  if (usdPrice) {
    const amount = Number(usdPrice.amount) || 0;
    return {
      calculated_price_number: amount,
      calculated_price: convertToLocale({ amount, currency_code: DEFAULT_CURRENCY }),
      original_price_number: amount,
      original_price: convertToLocale({ amount, currency_code: DEFAULT_CURRENCY }),
      currency_code: DEFAULT_CURRENCY,
      price_type: 'default',
      percentage_diff: 0,
    }
  }
  
  // 4. LAST RESORT: If we have any calculated price, use it regardless of currency
  if (variant.calculated_price && variant.calculated_price.calculated_amount !== undefined) {
    const amount = Number(variant.calculated_price.calculated_amount);
    const currencyCode = (variant.calculated_price.currency_code || DEFAULT_CURRENCY).toUpperCase();
    
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
    currency_code: DEFAULT_CURRENCY,
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

    // Get all variants with valid pricing data
    const validVariants = product.variants.filter((v: any) => {
      // Check if variant has calculated_price
      const hasCalculatedPrice = v.calculated_price && 
        (typeof v.calculated_price.calculated_amount === 'number' && v.calculated_price.calculated_amount > 0)
      
      // Check if variant has prices array
      const hasPricesArray = v.prices && v.prices.length > 0 && 
        v.prices.some((p: any) => p.amount && Number(p.amount) > 0)
      
      return hasCalculatedPrice || hasPricesArray
    })

    if (validVariants.length === 0) {
      // If no valid variants, return first variant as fallback
      return getPricesForVariant(product.variants[0])
    }

    // Find the cheapest variant by comparing all possible price sources
    const cheapestVariant = validVariants.reduce((cheapest: any, current: any) => {
      let cheapestAmount = Number.MAX_VALUE
      let currentAmount = Number.MAX_VALUE

      // Get price for cheapest variant
      if (cheapest.calculated_price?.calculated_amount) {
        cheapestAmount = Number(cheapest.calculated_price.calculated_amount)
      } else if (cheapest.prices?.length > 0) {
        // Find the lowest price in the prices array
        const lowestPrice = cheapest.prices.reduce((min: any, price: any) => {
          const amount = Number(price.amount) || Number.MAX_VALUE
          return amount < min ? amount : min
        }, Number.MAX_VALUE)
        cheapestAmount = lowestPrice
      }

      // Get price for current variant  
      if (current.calculated_price?.calculated_amount) {
        currentAmount = Number(current.calculated_price.calculated_amount)
      } else if (current.prices?.length > 0) {
        // Find the lowest price in the prices array
        const lowestPrice = current.prices.reduce((min: any, price: any) => {
          const amount = Number(price.amount) || Number.MAX_VALUE
          return amount < min ? amount : min
        }, Number.MAX_VALUE)
        currentAmount = lowestPrice
      }

      return currentAmount < cheapestAmount ? current : cheapest
    }, validVariants[0])

    return getPricesForVariant(cheapestVariant)
  }

  const getCheapestVariant = () => {
    if (!product || !product.variants?.length) return null
    return product.variants.reduce((cheapest: any, current: any) => {
      const getAmt = (v: any) => Number(v.calculated_price?.calculated_amount || v.prices?.[0]?.amount || Number.MAX_VALUE)
      return getAmt(current) < getAmt(cheapest) ? current : cheapest
    }, product.variants[0])
  }

  const getHighestVariant = () => {
    if (!product || !product.variants?.length) return null
    return product.variants.reduce((highest: any, current: any) => {
      const getAmt = (v: any) => Number(v.calculated_price?.calculated_amount || v.prices?.[0]?.amount || 0)
      return getAmt(current) > getAmt(highest) ? current : highest
    }, product.variants[0])
  }

  const highestPrice = () => {
    const highestV = getHighestVariant()
    return highestV ? getPricesForVariant(highestV) : null
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
    highestPrice: highestPrice(),
    cheapestVariant: getCheapestVariant(),
    highestVariant: getHighestVariant(),
    variantPrice: variantPrice(),
  }
}

