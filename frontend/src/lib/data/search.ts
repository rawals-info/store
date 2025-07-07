"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders } from "./cookies"
import { cache } from "react"

// Simple in-memory cache for server-side search results.
// Key: serialized args, Value: { ts, products, count }
const SEARCH_CACHE = new Map<string, { ts: number; products: HttpTypes.StoreProduct[]; count: number }>()
const CACHE_TTL = 60_000 // 1 minute TTL

// Define search response type
type SearchResponse = {
  hits: HttpTypes.StoreProduct[]
  count: number
}

/**
 * Search products with a query string
 */
export const searchProducts = cache(async ({
  query,
  limit = 100,
  offset = 0,
  filter = {},
  countryCode,
}: {
  query: string
  limit?: number
  offset?: number
  filter?: Record<string, any>
  countryCode: string
}): Promise<{
  products: HttpTypes.StoreProduct[]
  count: number
}> => {
  // If query is empty, return empty results
  if (!query || !query.trim()) {
    return { products: [], count: 0 }
  }

  try {
    // Build cache key – ignore offset when limit small to share cache pages  
    const keyObj = { query: query.toLowerCase(), limit, offset, region: filter.region_id || null }
    const cacheKey = JSON.stringify(keyObj)

    const cached = SEARCH_CACHE.get(cacheKey)
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      return { products: cached.products, count: cached.count }
    }

    const headers = {
      ...(await getAuthHeaders()),
    }

    // Build request body for the backend search endpoint
    const searchBody = {
      q: query,
      limit,
      offset,
    }

    // Call the custom backend endpoint that proxies Typesense search
    const searchResult = await sdk.client.fetch<SearchResponse>(
      `/store/products/search`,
      {
        method: "POST",
        body: searchBody,
        headers,
        cache: "no-store",
      }
    )

    if (!searchResult?.hits || searchResult.hits.length === 0) {
      return { products: [], count: searchResult?.count || 0 }
    }

    // --- Fetch full product data with pricing for the current region ---
    const hitIds = searchResult.hits.map((p) => p.id)

    let detailedProducts: HttpTypes.StoreProduct[] = []

    if (hitIds.length) {
      const queryParams = new URLSearchParams()
      hitIds.forEach((id) => queryParams.append("id[]", id))

      // Attach region_id if present so Medusa returns calculated prices
      if (filter.region_id) {
        queryParams.set("region_id", filter.region_id as string)
      }

      queryParams.set("limit", String(hitIds.length))

      const detailsResp = await sdk.client.fetch<{
        products: HttpTypes.StoreProduct[]
      }>(`/store/products?${queryParams.toString()}`, {
        method: "GET",
        headers,
        next: {
          revalidate: 300,
          tags: ["products", `search-details-${query.toLowerCase()}`]
        },
        cache: "force-cache",
      })

      const map = new Map(detailsResp.products.map((p) => [p.id, p]))
      detailedProducts = hitIds.map((id) => map.get(id)).filter(Boolean) as HttpTypes.StoreProduct[]
    }

    const finalResult = {
      products: detailedProducts,
      count: searchResult.count,
    }

    // Store in memory cache
    SEARCH_CACHE.set(cacheKey, { ts: Date.now(), ...finalResult })

    return finalResult
  } catch (error) {
    console.error("Error searching products:", error)
    return { products: [], count: 0 }
  }
}) 