/**
 * Central Store Promotion Configuration & Helper Engine
 *
 * Provides a single source of truth for promotions across the store.
 * Allows changing promo code, discount percentage, or toggling promotions
 * via environment variables or central config without breaking cart, checkout,
 * or causing deceptive pricing.
 */

export interface PromoConfig {
  code: string
  discountPercent: number
  enabled: boolean
  description: string
}

export const STORE_PROMOTION: PromoConfig = {
  code: (process.env.NEXT_PUBLIC_DEFAULT_PROMO_CODE || "SWEET20").trim(),
  discountPercent: Math.max(0, Math.min(100, Number(process.env.NEXT_PUBLIC_DEFAULT_PROMO_PERCENT || 20))),
  enabled: process.env.NEXT_PUBLIC_ENABLE_AUTO_PROMO !== "false",
  description: "Special Sweet Discount",
}

/**
 * Calculates discounted price based on active promotion configuration.
 * If promotion is disabled or discountPercent is 0, returns the raw price as discounted price.
 */
export const calculateDiscountedPrice = (rawPrice: number) => {
  const safeRaw = isNaN(rawPrice) || rawPrice <= 0 ? 0 : rawPrice
  
  if (!STORE_PROMOTION.enabled || STORE_PROMOTION.discountPercent <= 0 || !STORE_PROMOTION.code) {
    return {
      rawPrice: safeRaw,
      discountedPrice: safeRaw,
      savings: 0,
      discountPercent: 0,
      isDiscounted: false,
      promoCode: null,
    }
  }

  const multiplier = 1 - STORE_PROMOTION.discountPercent / 100
  const discounted = Math.round(safeRaw * multiplier * 100) / 100
  const savings = Math.round((safeRaw - discounted) * 100) / 100

  return {
    rawPrice: safeRaw,
    discountedPrice: discounted,
    savings,
    discountPercent: STORE_PROMOTION.discountPercent,
    isDiscounted: savings > 0,
    promoCode: STORE_PROMOTION.code,
  }
}

/**
 * Returns active promo code if enabled, or null if disabled.
 */
export const getActivePromoCode = (): string | null => {
  if (STORE_PROMOTION.enabled && STORE_PROMOTION.discountPercent > 0 && STORE_PROMOTION.code) {
    return STORE_PROMOTION.code
  }
  return null
}

/**
 * Returns promo badge text (e.g. "Save 20% with SWEET20")
 */
export const getPromoBadgeText = (): string => {
  if (STORE_PROMOTION.enabled && STORE_PROMOTION.discountPercent > 0 && STORE_PROMOTION.code) {
    return `Save ${STORE_PROMOTION.discountPercent}% with ${STORE_PROMOTION.code}`
  }
  return "Fresh Agra Sweets"
}
