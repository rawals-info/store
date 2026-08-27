/**
 * Central Store Promotion Helper Engine
 *
 * Dynamic promotion engine: Reads live promotions directly from Medusa database.
 * No hardcoded promo strings or environment variables.
 */

export interface PromoConfig {
  code: string | null
  discountPercent: number
  enabled: boolean
  description: string
}

// Backward-compatible fallback object (defaults to null/0 to prevent hardcoding)
export const STORE_PROMOTION: PromoConfig = {
  code: null,
  discountPercent: 0,
  enabled: true,
  description: "Live Sweet Promotion",
}

/**
 * Calculates discounted price based on a dynamic promotion.
 * If no active promo is passed, returns the raw price as standard without discount.
 */
export const calculateDiscountedPrice = (
  rawPrice: number,
  promo?: { code: string; discountPercent: number } | null
) => {
  const safeRaw = isNaN(rawPrice) || rawPrice <= 0 ? 0 : rawPrice

  if (!promo || promo.discountPercent <= 0 || !promo.code) {
    return {
      rawPrice: safeRaw,
      discountedPrice: safeRaw,
      savings: 0,
      discountPercent: 0,
      isDiscounted: false,
      promoCode: null,
    }
  }

  const multiplier = 1 - promo.discountPercent / 100
  const discounted = Math.round(safeRaw * multiplier * 100) / 100
  const savings = Math.round((safeRaw - discounted) * 100) / 100

  return {
    rawPrice: safeRaw,
    discountedPrice: discounted,
    savings,
    discountPercent: promo.discountPercent,
    isDiscounted: savings > 0,
    promoCode: promo.code,
  }
}

export const getActivePromoCode = (): string | null => null
export const getPromoBadgeText = (): string => "Fresh Agra Sweets"
