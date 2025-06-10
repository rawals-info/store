import { listRegions } from "@lib/data/regions"

/**
 * Get all valid country codes from the backend
 * @returns Array of valid country codes
 */
export async function getValidCountries(): Promise<string[]> {
  try {
    const regions = await listRegions()
    
    // Extract all country codes from all regions
    const countryCodes: string[] = []
    
    if (regions) {
      regions.forEach(region => {
        region.countries?.forEach(country => {
          if (country.iso_2) {
            countryCodes.push(country.iso_2.toLowerCase())
          }
        })
      })
    }
    
    return countryCodes
  } catch (error) {
    console.error("Error getting valid countries:", error)
    return []
  }
}

/**
 * Check if a country code is valid
 * @param countryCode Country code to check
 * @returns Boolean indicating if the country code is valid
 */
export async function isValidCountry(countryCode: string): Promise<boolean> {
  const validCountries = await getValidCountries()
  return validCountries.includes(countryCode.toLowerCase())
} 