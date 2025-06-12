"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { deduplicateRequest } from "@lib/util/request-cache"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"
import { cache } from "react"

// Minimize fields for performance when listing many products
const DEFAULT_FIELDS = "id,title,handle,thumbnail,variants.calculated_price,variants.inventory_quantity" 
// More fields when detailed info is needed
const DETAILED_FIELDS = DEFAULT_FIELDS + ",metadata,tags,categories,description,variants.title"

// Cache key generator for product requests
const getProductCacheKey = (params: any) => {
  return `products_${JSON.stringify(params)}`
}

// Cache TTL in seconds
const CACHE_TTL = {
  SHORT: 30, // 30 seconds
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
}

// Cached product listing function
export const listProducts = async ({
  pageParam = 1,
  queryParams = {},
  countryCode,
  regionId,
  isDetailed = false, // Flag to determine level of detail needed
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams & {
    category_id?: string | string[]
    tags?: string | string[]
    price_range?: { min?: number; max?: number } // Changed to use Medusa's native price filtering
  }
  countryCode?: string
  regionId?: string
  isDetailed?: boolean
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = (_pageParam === 1) ? 0 : (_pageParam - 1) * limit;

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  // Process query parameters
  const processedQueryParams: Record<string, any> = {
    limit,
    offset,
    region_id: region?.id,
    fields: isDetailed ? DETAILED_FIELDS : DEFAULT_FIELDS,
    ...queryParams,
  }

  // IMPORTANT: Replace any problematic sort orders with safe ones
  if (processedQueryParams.order) {
    // Replace updated_at:desc with created_at:desc which is safer
    if (processedQueryParams.order.includes('updated_at:desc')) {
      // Use a safe default ordering
      delete processedQueryParams.order;
    }
    
    // Remove id:desc which causes errors
    if (processedQueryParams.order.includes('id:desc')) {
      // Use a safe default ordering
      delete processedQueryParams.order;
    }

    // Remove created_at:desc which causes errors
    if (processedQueryParams.order.includes('created_at:desc')) {
      // Use a safe default ordering
      delete processedQueryParams.order;
    }
  }

  // Handle category ID
  if (queryParams.category_id) {
    processedQueryParams.category_id = Array.isArray(queryParams.category_id) 
      ? queryParams.category_id 
      : [queryParams.category_id]
  }

  // Handle tags
  if (queryParams.tags) {
    processedQueryParams.tags = Array.isArray(queryParams.tags) 
      ? queryParams.tags 
      : [queryParams.tags]
  }
  
  // Handle price filtering - use Medusa's built-in price filter capability
  if (queryParams.price_range) {
    // Only set price_list_id if it exists in the region 
    // This avoids the TypeScript error for price_list_id
    const regionPriceListId = (region as any).price_list_id;
    
    if (queryParams.price_range.min !== undefined) {
      if (regionPriceListId) {
        processedQueryParams.price_list_id = regionPriceListId;
      }
      
      processedQueryParams["variants.calculated_price"] = {
        gte: queryParams.price_range.min
      }
    }
    
    if (queryParams.price_range.max !== undefined) {
      if (regionPriceListId) {
        processedQueryParams.price_list_id = regionPriceListId;
      }
      
      processedQueryParams["variants.calculated_price"] = {
        ...processedQueryParams["variants.calculated_price"] || {},
        lte: queryParams.price_range.max
      }
    }
    
    delete processedQueryParams.price_range
  }

  // Caching configuration with ISR
  const next = {
    revalidate: 60, // ISR revalidation time of 60 seconds
    tags: ['products'],
  }

  // Generate cache key for this specific request
  const cacheKey = getProductCacheKey(processedQueryParams);

  // Use request deduplication with improved caching
  return await deduplicateRequest(
    `/store/products_${cacheKey}`,
    () => sdk.client
      .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
        `/store/products`,
        {
          method: "GET",
          query: processedQueryParams,
          headers,
          next,
          cache: "force-cache",
        }
      )
      .then(({ products, count }) => {
        const nextPage = count > offset + limit ? _pageParam + 1 : null;
        
        return {
          response: {
            products,
            count,
          },
          nextPage,
          queryParams,
        }
      })
      .catch(error => {
        console.error("Error fetching products:", error);
        return {
          response: {
            products: [],
            count: 0,
          },
          nextPage: null,
          queryParams,
        };
      }),
    processedQueryParams,
    CACHE_TTL.MEDIUM // 5 minutes TTL
  )
}

/**
 * This will fetch products up to the specified limit with sorting
 */
export const listProductsWithSort = cache(async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams & {
    category_id?: string | string[]
    tags?: string | string[]
    price_range?: { min?: number; max?: number }
  }
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12
  const offset = (page - 1) * limit
  
  // For most sorts, use the API's built-in ordering
  if (sortBy === "price_asc" || sortBy === "price_desc") {
    // For price sorting, we need to add order params
    const orderDirection = sortBy === "price_asc" ? "asc" : "desc"
    
    const {
      response,
      nextPage
    } = await listProducts({
      pageParam: page,
      queryParams: {
        ...queryParams,
        limit,
        order: `variants.calculated_price:${orderDirection}`,
      },
      countryCode,
      isDetailed: true,
    })
    
    return { response, nextPage, queryParams }
  } 
  
  // Fix for created_at sorting - don't use created_at:desc as it's not supported
  if (sortBy === "created_at") {
    const {
      response,
      nextPage
    } = await listProducts({
      pageParam: page,
      queryParams: {
        ...queryParams,
        limit,
        // Don't specify order parameter as it's not supported
      },
      countryCode,
      isDetailed: true,
    })
    
    // Sort products by created_at on the client side instead
    const sortedProducts = [...response.products].sort((a, b) => {
      return new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
    });
    
    return { 
      response: {
        products: sortedProducts,
        count: response.count
      }, 
      nextPage, 
      queryParams 
    }
  }
  
  // For custom sorting that can't be handled by the API
  const {
    response,
    nextPage
  } = await listProducts({
    pageParam: page,
    queryParams: {
      ...queryParams,
      limit,
    },
    countryCode,
    isDetailed: true,
  })

  // If we need to sort client-side, do that here
  // This is less efficient but works as a fallback
  const { products, count } = response;
  const sortedProducts = sortProducts(products, sortBy);

  return {
    response: {
      products: sortedProducts,
      count,
    },
    nextPage,
    queryParams,
  };
});
