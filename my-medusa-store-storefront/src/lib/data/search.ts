"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders } from "./cookies"
import { cache } from "react"
import { getProductPrice } from "@lib/util/get-product-price"

const CACHE_TTL = 0 // Set to 0 to disable caching temporarily for debugging

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

    // Ensure pricing data is available on returned products
    const processedProducts = searchResult.hits.map((product) => {
      if (product.variants && product.variants.length > 0) {
        const { cheapestPrice } = getProductPrice({ product })

        product.variants = product.variants.map((variant) => {
          const typedVariant: any = variant

          if (
            typedVariant.prices?.length > 0 ||
            typedVariant.calculated_price
          ) {
            return variant
          }

          typedVariant.prices = [
            {
              amount: cheapestPrice?.calculated_price_number || 0,
              currency_code: cheapestPrice?.currency_code || "EUR",
            },
          ]

          return typedVariant
        })
      }

      return product
    })

    return {
      products: processedProducts,
      count: searchResult.count,
    }
  } catch (error) {
    console.error("Error searching products:", error)
    return { products: [], count: 0 }
  }
}) 