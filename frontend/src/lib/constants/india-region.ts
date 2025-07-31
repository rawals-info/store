import { HttpTypes } from "@medusajs/types"

/**
 * Hardcoded India region constant for performance optimization
 * Since we only sell in India, we can eliminate all region API calls
 * Data fetched from actual backend: reg_01JZJ9AW0JXXNRDRK5W3T2SCKW
 */
export const INDIA_REGION = {
  id: "reg_01JZJ9AW0JXXNRDRK5W3T2SCKW",
  name: "India",
  currency_code: "inr",
  created_at: "2025-07-07T11:11:28.422Z",
  updated_at: "2025-07-07T11:11:28.422Z",
  deleted_at: null,
  metadata: null,
  countries: [
    {
      iso_2: "in",
      iso_3: "ind",
      num_code: "356",
      name: "INDIA",
      display_name: "India",
      region_id: "reg_01JZJ9AW0JXXNRDRK5W3T2SCKW",
      metadata: null,
      created_at: "2025-07-07T10:51:22.046Z",
      updated_at: "2025-07-07T10:51:22.046Z",
      deleted_at: null,
    }
  ]
} as unknown as HttpTypes.StoreRegion

/**
 * Get the hardcoded India region - replaces getRegion() calls
 */
export function getIndiaRegion(): HttpTypes.StoreRegion {
  return INDIA_REGION
}

/**
 * List regions with only India - replaces listRegions() calls
 */
export function listIndiaRegions(): HttpTypes.StoreRegion[] {
  return [INDIA_REGION]
} 