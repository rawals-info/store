import { listRegions } from "@lib/data/regions"
import { sdk } from "@lib/config"

interface StoreResponse {
  store: {
    id: string
    name: string
    default_currency_code: string
    default_region_id: string
    [key: string]: any
  }
}

/**
 * Gets the default country code from the backend.
 *
 * The original implementation attempted to read the store settings via
 * `GET /store`, but that endpoint no longer exists in Medusa v2. Instead we
 * optionally look for an environment variable `NEXT_PUBLIC_DEFAULT_REGION_ID`
 * and fall back to the first region that has a country configured.
 *
 * @returns The default ISO-2 country code (lower-case)
 */
export async function getDefaultCountry(): Promise<string> {
  // 1. Try to honour an explicit region configured in the environment.
  const defaultRegionId = process.env.NEXT_PUBLIC_DEFAULT_REGION_ID

  if (defaultRegionId) {
    try {
      const regions = await listRegions()
      const defaultRegion = regions.find((region) => region.id === defaultRegionId)

      if (defaultRegion?.countries?.length) {
        const iso = defaultRegion.countries[0].iso_2?.toLowerCase()
        if (iso) {
          return iso
        }
      }
    } catch (error) {
      // Log at debug level – do not treat as fatal.
      console.debug("Failed to resolve NEXT_PUBLIC_DEFAULT_REGION_ID", error)
    }
  }

  // 2. Fallback: use the first available region that has a country.
  try {
    const regions = await listRegions()
    const regionWithCountry = regions.find((region) => region.countries?.length)
    if (regionWithCountry?.countries?.length) {
      const iso = regionWithCountry.countries[0].iso_2?.toLowerCase()
      if (iso) {
        return iso
      }
    }
  } catch (error) {
    console.error("Error listing regions for fallback:", error)
  }

  // 3. Final fallback: default to "in" (India).
  return "in"
} 