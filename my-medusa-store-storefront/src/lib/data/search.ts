"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders } from "./cookies"
import { cache } from "react"

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
  limit = 100, // Increase limit to make sure we get all products
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

  console.log(`[SEARCH DEBUG] Searching for "${query}" in country ${countryCode}`)

  // For temporary debugging - if query is about chess, immediately return empty results
  // This will trigger the fallback to the chess category page
  if (query.toLowerCase().includes('chess')) {
    console.log("[SEARCH DEBUG] Chess search detected, returning empty results to trigger redirect")
    return { products: [], count: 0 }
  }

  try {
    const headers = {
      ...(await getAuthHeaders()),
    }

    // Get products without complex parameters that might cause API errors
    console.log("[SEARCH DEBUG] Fetching all products with simplified parameters")
    
    const allProducts = await sdk.client.fetch<{
      products: HttpTypes.StoreProduct[]
      count: number
    }>(`/store/products`, {
      method: "GET",
      query: {
        limit: 100,
        offset: 0,
      },
      headers,
      cache: "no-store", // Disable cache
    })

    console.log(`[SEARCH DEBUG] Found ${allProducts?.products?.length || 0} total products`)

    if (!allProducts?.products || allProducts.products.length === 0) {
      console.log("[SEARCH DEBUG] No products returned from API")
      return { products: [], count: 0 }
    }

    // Split search terms to increase match probability
    const searchTerms = query.toLowerCase().trim().split(/\s+/);
    
    const matchesSearch = (product: HttpTypes.StoreProduct) => {
      const title = (product.title || '').toLowerCase()
      const description = (product.description || '').toLowerCase()
      const handle = (product.handle || '').toLowerCase()
      
      // Log each product's search-relevant fields for debugging
      console.log(`[SEARCH DEBUG] Checking product: ${product.title}`)
      
      // Check if ANY search term matches (more lenient matching)
      for (const term of searchTerms) {
        if (term.length < 3) continue; // Skip very short terms
        
        // Direct title match (higher priority)
        if (title.includes(term)) {
          console.log(`[SEARCH DEBUG] ✓ Match found in title for ${product.title} with term "${term}"`)
          return true
        }
        
        // Description match
        if (description.includes(term)) {
          console.log(`[SEARCH DEBUG] ✓ Match found in description for ${product.title} with term "${term}"`)
          return true
        }
        
        // Handle match
        if (handle.includes(term)) {
          console.log(`[SEARCH DEBUG] ✓ Match found in handle for ${product.title} with term "${term}"`)
          return true
        }
      }
      
      // No match found
      return false
    }

    // Filter products with the search term
    const filteredProducts = allProducts.products.filter(matchesSearch)
    console.log(`[SEARCH DEBUG] Found ${filteredProducts.length} matching products`)
    
    // Log all matching product titles
    if (filteredProducts.length > 0) {
      console.log("[SEARCH DEBUG] Matching products:", filteredProducts.map(p => p.title).join(", "))
    }

    // Apply pagination to filtered results
    const paginatedProducts = filteredProducts.slice(offset, offset + limit)

    return {
      products: paginatedProducts,
      count: filteredProducts.length,
    }
  } catch (error) {
    console.error("[SEARCH DEBUG] Error searching products:", error)
    return { products: [], count: 0 }
  }
}) 