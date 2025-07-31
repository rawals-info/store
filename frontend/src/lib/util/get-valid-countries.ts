import { cache } from "react"
import { listIndiaRegions } from "@lib/constants/india-region"

/**
 * Get a list of valid country codes from regions
 */
export const getValidCountries = cache(async (): Promise<string[]> => {
  const regions = listIndiaRegions()
  
  const countries = regions
    .flatMap((region) => region.countries || [])
    .map((country) => country.iso_2)
    .filter(Boolean) as string[]
  
  return countries
})

/**
 * Check if a country code is valid
 * @param countryCode Country code to check
 * @returns Boolean indicating if the country code is valid
 */
export async function isValidCountry(countryCode: string): Promise<boolean> {
  const validCountries = await getValidCountries()
  return validCountries.includes(countryCode.toLowerCase())
} 