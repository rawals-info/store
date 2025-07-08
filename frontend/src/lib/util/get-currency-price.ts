import { HttpTypes } from "@medusajs/types"
import { DEFAULT_CURRENCY, DEFAULT_COUNTRY } from "@lib/config/defaults"

/**
 * Get the currency price for a given region
 * @param region - the region to get the currency price for
 * @param amount - the amount to format
 * @param options - options to pass to the formatter
 * @returns - the formatted currency price
 */
export function formatAmount({
  amount,
  region,
  includeTaxes = true,
  ...options
}: {
  amount: number | null | undefined
  region: HttpTypes.StoreRegion | null
  includeTaxes?: boolean
} & Omit<Intl.NumberFormatOptions, "currency">) {
  const regionCurrency = region?.currency_code?.toUpperCase() || DEFAULT_CURRENCY

  const taxRate = includeTaxes ? 1 : 1
  // Tax handling is not available in this version of the API
  // const taxRate = includeTaxes ? 1 : 1 - (region?.tax_rate || 0) / 100

  const locale = region?.countries?.[0]?.iso_2 || `en-${DEFAULT_COUNTRY}`

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: regionCurrency,
    minimumFractionDigits: 2,
    ...options,
  }).format((amount || 0) * taxRate / 100)
}

/**
 * Get the amount without currency symbol
 * @param amount - the amount to format
 * @returns - the formatted amount
 */
export function formatAmountWithoutCurrency(
  amount: number,
  options?: Intl.NumberFormatOptions
) {
  return new Intl.NumberFormat("en-IN", {
    style: "decimal",
    minimumFractionDigits: 2,
    ...options,
  }).format(amount / 100)
}

/**
 * Get the currency symbol for a given currency code
 * @param currency - the currency code to get the symbol for
 * @returns - the currency symbol
 */
export function getCurrencySymbol(currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .formatToParts(0)
    .find((part) => part.type === "currency")?.value
} 