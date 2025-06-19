"use server"

import { sdk, dataFetchingConfig } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { cache } from "react"
import { notFound } from "next/navigation"

export const listRegions = cache(async () => {
  return sdk.client.fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
    method: "GET",
    next: {
      tags: ["regions"],
    },
  })
    .then(({ regions }) => regions)
    .catch((err) => {
      throw new Error(err)
    })
})

export const retrieveRegion = cache(async (id: string) => {
  return sdk.client.fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
    method: "GET",
    next: {
      tags: ["regions", `region-${id}`],
    },
  })
    .then(({ region }) => region)
    .catch((err) => {
      throw new Error(err)
    })
})

const getRegionByCountryCode = cache(async (countryCode: string) => {
  const regions = await listRegions()
  const region = regions.find((r) =>
    r.countries?.some((c) => c.iso_2 === countryCode)
  )

  if (!region) {
    return null
  }

  return region
})

export const getRegion = async (countryCode: string) => {
  try {
    const region = await getRegionByCountryCode(countryCode);
    return region;
  } catch (e: any) {
    console.error("Error fetching region:", e.message);
    // As a fallback, we can list all regions and find a match.
    // This is not ideal and should be logged for monitoring.
    const allRegions = await listRegions().catch(() => [])
    const region = allRegions.find((r) => r.countries?.some((c) => c.iso_2 === countryCode))
    
    if (region) {
      return region
    }

    // If still no region, return the first one as a last resort
    return allRegions[0] ?? null
  }
}
