import { sdk } from "@lib/config"
import { dataFetchingConfig } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

/**
 * Fetches all available regions from the Medusa backend
 * @returns A record of regions by country code
 */
export const getRegions = async () => {
  try {
    const response = await sdk.client.fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      next: {
        revalidate: dataFetchingConfig.regions.revalidate,
      },
    })

    if (!response.regions) {
      return {}
    }

    // Transform to dictionary of country code to region
    const regionMap: Record<string, HttpTypes.StoreRegion> = {}
    
    for (const region of response.regions) {
      if (region.countries) {
        for (const country of region.countries) {
          if (country.iso_2) {
            regionMap[country.iso_2.toLowerCase()] = region
          }
        }
      }
    }

    return regionMap
  } catch (error) {
    console.error("Error determining regions:", error)
    return {}
  }
}

/**
 * Checks if a country code is valid and has a region set up
 * @param countryCode The country code to check
 * @returns Whether the country has a region set up
 */
export async function isValidCountry(countryCode: string): Promise<boolean> {
  const regions = await getRegions()
  return !!regions[countryCode.toLowerCase()]
}

export const getDefaultRegion = async () => {
  try {
    const regions = await getRegions()
    // Default to US if available
    return regions["us"] || Object.values(regions)[0] || null
  } catch (error) {
    console.error("Error determining default region:", error)
    return null
  }
} 