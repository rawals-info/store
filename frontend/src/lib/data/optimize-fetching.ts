// This file contains optimization strategies for data fetching

/**
 * Configure server-side cache control headers
 * @returns Cache control headers for Next.js 
 */
export function getCacheControlHeaders() {
  // Only apply in production to allow for easier development
  if (process.env.NODE_ENV === 'production') {
    return {
      'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59'
    }
  }
  return {}
}

/**
 * Create a deduplication key for requests
 * This helps Next.js avoid duplicate requests during server rendering
 * @param endpoint API endpoint
 * @param params Query parameters
 * @returns A unique key for the request
 */
export function createDedupKey(endpoint: string, params?: Record<string, any>) {
  return `${endpoint}${params ? JSON.stringify(params) : ''}`
}

/**
 * Add deduplication options to Medusa fetch requests
 * @param url API endpoint
 * @param options Fetch options
 * @returns Enhanced fetch options with deduplication
 */
export function addDedupOptions(url: string, options: any = {}) {
  const dedupKey = createDedupKey(url, options.query)
  
  return {
    ...options,
    next: {
      ...options.next,
      // This tells Next.js to deduplicate requests with the same key
      revalidate: 10, // Revalidate cache every 10 seconds
      tags: [...(options.next?.tags || []), dedupKey]
    }
  }
}

/**
 * Enhanced cache control for static data
 * For data that rarely changes like collections, regions, etc.
 * @returns Enhanced cache control options
 */
export function getStaticDataCacheOptions() {
  return {
    next: {
      revalidate: 60 * 60, // Revalidate once per hour
      tags: ['static-data']
    }
  }
}

/**
 * Enhanced cache control for dynamic data
 * For data that changes more frequently like products with inventory, orders, etc.
 * @returns Enhanced cache control options
 */
export function getDynamicDataCacheOptions() {
  return {
    next: {
      revalidate: 60, // Revalidate every minute
      tags: ['dynamic-data']
    }
  }
} 