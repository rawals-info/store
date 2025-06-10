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
 * Gets the default country code from the backend
 * @param fallback Fallback country code if no default is found
 * @returns The default country code
 */
export async function getDefaultCountry(fallback = "us"): Promise<string> {
  try {
    // First, try to get the store settings to find the default region
    const { store } = await sdk.client.fetch<StoreResponse>(`/store`, {
      method: "GET",
      cache: "no-store",
    })
    
    // If store has a default region set
    if (store?.default_region_id) {
      const defaultRegionId = store.default_region_id
      
      // Get all regions
      const regions = await listRegions()
      
      // Find the default region by ID
      const defaultRegion = regions.find(region => region.id === defaultRegionId)
      
      // If we found the default region and it has countries
      if (defaultRegion?.countries && defaultRegion.countries.length > 0) {
        // Return the first country in the default region
        return defaultRegion.countries[0].iso_2?.toLowerCase() || fallback
      }
    }
    
    // If no default region is set or we couldn't find it, just return the first region
    const regions = await listRegions()
    
    if (regions && regions.length > 0) {
      // Use the first region with countries
      const firstRegionWithCountries = regions.find(region => region.countries?.some(c => c.iso_2))
      
      if (firstRegionWithCountries?.countries && firstRegionWithCountries.countries.length > 0) {
        // Use the first country of the first region
        return firstRegionWithCountries.countries[0].iso_2?.toLowerCase() || fallback
      }
    }
    
    return fallback
  } catch (error) {
    console.error("Error determining default region:", error)
    // Fallback if there's an error
    return fallback
  }
} 