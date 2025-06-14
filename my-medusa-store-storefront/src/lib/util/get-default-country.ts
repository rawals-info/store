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
 * @returns The default country code
 */
export async function getDefaultCountry(): Promise<string> {
  // Attempt to fetch store settings for default_region_id
  let defaultRegionId: string | undefined
  try {
    const { store } = await sdk.client.fetch<StoreResponse>(`/store`, {
      method: "GET",
      next: { revalidate: 60 }
    })
    defaultRegionId = store?.default_region_id
  } catch (error) {
    console.error("Error fetching store settings, skipping default_region_id:", error)
  }
  
  // If a default region ID is configured, try to use it
  if (defaultRegionId) {
    try {
      const regions = await listRegions()
      const defaultRegion = regions.find(region => region.id === defaultRegionId)
      if (defaultRegion?.countries?.length) {
        const iso = defaultRegion.countries[0].iso_2?.toLowerCase()
        if (iso) {
          return iso
        }
      }
    } catch (error) {
      console.error("Error listing regions for default_region_id:", error)
    }
  }
  
  // Fallback: use the first available region from backend
  try {
    const regions = await listRegions()
    const regionWithCountry = regions.find(region => region.countries?.length)
    if (regionWithCountry?.countries?.length) {
      const iso = regionWithCountry.countries[0].iso_2?.toLowerCase()
      if (iso) {
        return iso
      }
    }
  } catch (error) {
    console.error("Error listing regions for fallback:", error)
  }
  
  // Last fallback to 'us'
  return "us"
} 