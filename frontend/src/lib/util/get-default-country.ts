import { cache } from "react"
import { listIndiaRegions } from "@lib/constants/india-region"

/**
 * Get the default country code based on various factors
 * Since we only support India, this always returns "in"
 */
export const getDefaultCountry = cache(async (): Promise<string> => {
  // Since we only support India, always return "in"
  return "in"
}) 