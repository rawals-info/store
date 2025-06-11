import { cache } from "react"
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"

// In-memory cache for categories to prevent redundant API calls
const categoriesCache: Record<string, {
  data: HttpTypes.StoreProductCategory[] | HttpTypes.StoreProductCategory,
  timestamp: number
}> = {}

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000

/**
 * Fetches a list of categories with optional filters
 * @param options Options to filter categories by
 * @returns Array of categories
 */
export const listCategories = cache(async (
  options: {
    limit?: number
    offset?: number
    fields?: string
  } = {}
): Promise<HttpTypes.StoreProductCategory[]> => {
  const { limit = 100, offset = 0, fields = "*category_children, *parent_category" } = options
  
  // Create a cache key based on the options
  const cacheKey = `categories-list-${limit}-${offset}-${fields}`
  
  // Check if we have a valid cached response
  const cachedData = categoriesCache[cacheKey]
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data as HttpTypes.StoreProductCategory[]
  }

  try {
    const { product_categories } = await sdk.client.fetch<{
      product_categories: HttpTypes.StoreProductCategory[]
    }>(
      "/store/product-categories",
      {
        query: {
          limit,
          offset,
          fields,
        },
        next: {
          revalidate: 60, // Cache for 60 seconds
          tags: ["categories"],
        },
        cache: "force-cache", // Use force-cache to avoid duplicate requests
      }
    )
    
    // Cache the response
    if (product_categories) {
      categoriesCache[cacheKey] = {
        data: product_categories,
        timestamp: Date.now()
      }
    }

    return product_categories || []
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
})

/**
 * Fetches a category by handle
 * @param handle The handle of the category to fetch (string or string array)
 * @returns The category
 */
export const getCategoryByHandle = cache(async (
  handle: string | string[]
): Promise<HttpTypes.StoreProductCategory> => {
  // Handle both string and string array inputs
  const categoryHandle = Array.isArray(handle) 
    ? handle[handle.length - 1] 
    : handle

  // Create a cache key based on the handle
  const cacheKey = `category-${categoryHandle}`;
  
  // Check if we have a valid cached response
  const cachedData = categoriesCache[cacheKey]
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data as HttpTypes.StoreProductCategory
  }

  try {
    const { product_categories } = await sdk.client.fetch<{
      product_categories: HttpTypes.StoreProductCategory[]
    }>(
      "/store/product-categories",
      {
        query: {
          handle: categoryHandle,
          fields: "*category_children, *products",
        },
        next: {
          revalidate: 60, // Cache for 60 seconds
          tags: ["categories", cacheKey],
        },
        cache: "force-cache", // Use force-cache to avoid duplicate requests
      }
    )

    const category = product_categories?.[0]

    if (!category) {
      notFound()
    }
    
    // Cache the response
    categoriesCache[cacheKey] = {
      data: category,
      timestamp: Date.now()
    }

    return category
  } catch (error) {
    console.error(`Error fetching category with handle ${categoryHandle}:`, error)
    notFound()
  }
})
