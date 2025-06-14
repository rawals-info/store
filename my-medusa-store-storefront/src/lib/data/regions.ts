"use server"

import { sdk, dataFetchingConfig } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { deduplicateRequest } from "@lib/util/request-cache"
import { HttpTypes } from "@medusajs/types"
import { getStaticDataCacheOptions } from "./optimize-fetching"

export const listRegions = async () => {
  const cacheOptions = {
    next: {
      revalidate: dataFetchingConfig.regions.revalidate,
      tags: ["regions"]
    }
  }

  return deduplicateRequest(
    "/store/regions",
    () => sdk.client
      .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
        method: "GET",
        next: cacheOptions.next,
      })
      .then(({ regions }) => regions)
      .catch(medusaError),
    undefined,
    dataFetchingConfig.regions.revalidate * 1000 // Convert to milliseconds
  )
}

export const retrieveRegion = async (id: string) => {
  const cacheOptions = {
    next: {
      revalidate: dataFetchingConfig.regions.revalidate,
      tags: ["regions", `region-${id}`]
    }
  }

  return deduplicateRequest(
    `/store/regions/${id}`,
    () => sdk.client
      .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
        method: "GET",
        next: cacheOptions.next,
      })
      .then(({ region }) => region)
      .catch(medusaError),
    undefined,
    dataFetchingConfig.regions.revalidate * 1000 // Convert to milliseconds
  )
}

// In-memory cache for regions by country code
const regionMap = new Map<string, HttpTypes.StoreRegion>()
// Timestamp to track when the in-memory cache was last refreshed
let regionCacheTimestamp = 0;
const CACHE_TTL = dataFetchingConfig.regions.revalidate * 1000; // Convert to milliseconds

// Store a promise for the ongoing fetch to avoid duplicate requests
let ongoingFetch: Promise<void> | null = null;

export const getRegion = async (countryCode: string) => {
  try {
    const now = Date.now();
    
    // If cache is stale or empty, refresh it
    if ((now - regionCacheTimestamp > CACHE_TTL || regionMap.size === 0) && !ongoingFetch) {
      // Create a fetch promise that updates the cache
      ongoingFetch = (async () => {
        try {
          const regions = await listRegions();
          
          if (regions) {
            // Clear existing cache
            regionMap.clear();
            
            // Populate cache with fresh data
            regions.forEach((region) => {
              region.countries?.forEach((c) => {
                const iso2 = c?.iso_2?.toLowerCase() ?? "";
                regionMap.set(iso2, region);
              });
            });
            
            // Update timestamp
            regionCacheTimestamp = now;
          }
        } finally {
          // Clear the ongoing fetch reference
          ongoingFetch = null;
        }
      })();
      
      // Wait for the fetch to complete
      await ongoingFetch;
    } else if (ongoingFetch) {
      // If there's an ongoing fetch, wait for it to complete
      await ongoingFetch;
    }

    // Get region from cache
    const key = countryCode?.toLowerCase() ?? "us";
    const region = regionMap.get(key) ?? regionMap.get("us");
    return region;
  } catch (e: any) {
    console.error("Error fetching region:", e);
    return null;
  }
}
