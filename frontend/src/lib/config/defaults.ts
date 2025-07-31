import { cache } from "react"
import { listIndiaRegions } from "@lib/constants/india-region"
import { getDefaultCountry } from "@lib/util/get-default-country"
import { HttpTypes } from "@medusajs/types"

/**
 * This module exposes DEFAULT_COUNTRY & DEFAULT_CURRENCY that are
 * populated once (at runtime) by querying the Medusa backend.  They
 * provide a synchronous fallback the rest of the codebase can import
 * without sprinkling hard-coded values everywhere.
 */
export let DEFAULT_COUNTRY = "in" // sensible initial guess
export let DEFAULT_CURRENCY = "INR"

// NOTE: We avoid calling server functions during module initialization to
// comply with Next.js restrictions.  A separate lazy loader can call
// `hydrateDefaults()` after the first render on the server.

export const hydrateDefaults = async () => {
  if (typeof window !== "undefined") return // run only on server
  try {
    const country = await getDefaultCountry()
    DEFAULT_COUNTRY = country
    const regions = listIndiaRegions()
    const region = regions.find((r) =>
      r.countries?.some((c) => c.iso_2?.toLowerCase() === country)
    )
    if (region?.currency_code) DEFAULT_CURRENCY = region.currency_code.toUpperCase()
  } catch (err) {
    console.error("[defaults] hydrateDefaults error", err)
  }
}

export const getDefaultCurrency = () => DEFAULT_CURRENCY
export const getDefaultCountrySync = () => DEFAULT_COUNTRY 

/**
 * Get default region and currency settings
 */
export const getDefaults = cache(async () => {
  try {
    const regions = listIndiaRegions()
    
    // Default to first region (India)
    const defaultRegion = regions[0]
    
    return {
      region: defaultRegion,
      currency: defaultRegion?.currency_code || "inr",
      country: defaultRegion?.countries?.[0]?.iso_2 || "in",
    }
  } catch (error) {
    console.error("Error getting defaults:", error)
    return {
      region: null,
      currency: "inr",
      country: "in",
    }
  }
}) 