import { listRegions } from "@lib/data/regions"
import { getDefaultCountry } from "@lib/util/get-default-country"

/**
 * This module exposes DEFAULT_COUNTRY & DEFAULT_CURRENCY that are
 * populated once (at runtime) by querying the Medusa backend.  They
 * provide a synchronous fallback the rest of the codebase can import
 * without sprinkling hard-coded values everywhere.
 */
export let DEFAULT_COUNTRY = "in" // sensible initial guess
export let DEFAULT_CURRENCY = "INR"

;(async () => {
  try {
    // Resolve country first (cached internally by getDefaultCountry)
    const country = await getDefaultCountry()  // e.g. "in"
    DEFAULT_COUNTRY = country

    // Look up the matching region to extract its currency
    const regions = await listRegions()
    const region = regions.find((r) =>
      r.countries?.some((c) => c.iso_2?.toLowerCase() === country)
    )

    if (region?.currency_code) {
      DEFAULT_CURRENCY = region.currency_code.toUpperCase()
    }
  } catch (err) {
    console.error("[defaults] Failed to resolve default country/currency", err)
    // Keep initial fallbacks
  }
})()

export const getDefaultCurrency = () => DEFAULT_CURRENCY
export const getDefaultCountrySync = () => DEFAULT_COUNTRY 