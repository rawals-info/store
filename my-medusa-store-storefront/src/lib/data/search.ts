"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders } from "./cookies"
import { cache } from "react"
import { getProductPrice } from "@lib/util/get-product-price"
import { convertToLocale } from "@lib/util/money"

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

    // Fetch all products with valid parameters
    const allProducts = await sdk.client.fetch<{
      products: HttpTypes.StoreProduct[]
      count: number
    }>(`/store/products`, {
      method: "GET",
      query: {
        limit: 100,
        offset: 0,
        // Only include valid parameters
        region_id: filter.region_id
      },
      headers,
      cache: "no-store",
    })

    if (!allProducts?.products || allProducts.products.length === 0) {
      return { products: [], count: 0 }
    }

    // Split search terms
    const searchTerms = query.toLowerCase().trim().split(/\s+/);
    
    // Search products for any matching term
    const filteredProducts = allProducts.products.filter(product => {
      const title = (product.title || '').toLowerCase()
      const description = (product.description || '').toLowerCase()
      const handle = (product.handle || '').toLowerCase()
      const collection = product.collection?.title?.toLowerCase() || ''
      const tags = product.tags?.map(tag => tag.value.toLowerCase()) || []
      
      // Check if ANY search term matches ANY field
      return searchTerms.some(term => {
        if (term.length < 2) return false; // Skip very short terms
        
        return (
          title.includes(term) || 
          description.includes(term) || 
          handle.includes(term) ||
          collection.includes(term) ||
          tags.some(tag => tag.includes(term))
        )
      })
    })
    
    // Process products to ensure pricing data is available
    const processedProducts = filteredProducts.map(product => {
      // Get price information for display
      if (product.variants && product.variants.length > 0) {
        // Get price information using the utility function
        const { cheapestPrice } = getProductPrice({ product })
        
        // Add pricing data to any variants missing it
        product.variants = product.variants.map(variant => {
          const typedVariant = variant as any
          
          // If the variant already has price data, keep it
          if (typedVariant.prices?.length > 0 || typedVariant.calculated_price) {
            return variant
          }
          
          // Otherwise add pricing data
          typedVariant.prices = [{
            amount: cheapestPrice?.calculated_price_number || 0,
            currency_code: cheapestPrice?.currency_code || "EUR",
          }]
          
          return typedVariant
        })
      }
      
      return product
    })
    
    // Apply pagination
    const paginatedProducts = processedProducts.slice(offset, offset + limit)

    return {
      products: paginatedProducts,
      count: processedProducts.length,
    }
  } catch (error) {
    console.error("Error searching products:", error)
    return { products: [], count: 0 }
  }
}) 