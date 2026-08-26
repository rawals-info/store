"use server"

import { sdk, dataFetchingConfig } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { cache } from "react"
import { notFound } from "next/navigation"

import { listIndiaRegions } from "@lib/constants/india-region"

export const listRegions = cache(async () => {
  try {
    return await sdk.client.fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      next: {
        tags: ["regions"],
      },
    })
      .then(({ regions }) => regions?.length ? regions : listIndiaRegions())
  } catch (err) {
    return listIndiaRegions()
  }
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
    if (allRegions.length > 0) {
      return allRegions[0]
    }

    // Graceful hard-coded fallback to keep frontend functional even if backend is unreachable
    return {
      id: "fallback-region",
      name: "Fallback Region",
      currency_code: "us",
      tax_provider_id: null,
      tax_rate: 0,
      automatic_taxes: false,
      gift_cards_taxable: false,
      countries: [
        { iso_2: countryCode, display_name: countryCode.toUpperCase() } as any,
      ],
    } as any // cast to StoreRegion
  }
}
