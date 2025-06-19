"use server"

// A simple in-memory cache for server-side request deduplication
// This helps reduce redundant API calls during server rendering

type CacheRecord = {
  timestamp: number;
  data: any;
}

// Cache for in-flight requests to handle request coalescence
const pendingRequests = new Map<string, Promise<any>>();

// Cache with expiration
const requestCache = new Map<string, CacheRecord>();
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// TTL configurations for different types of data
const TTL_CONFIG = {
  regions: 10 * 60 * 1000,    // 10 minutes for regions
  products: 5 * 60 * 1000,    // 5 minutes for products
  collections: 10 * 60 * 1000,// 10 minutes for collections
  default: 5 * 60 * 1000      // 5 minutes default
};

/**
 * Get TTL for a specific URL
 */
async function getTtlForUrl(url: string): Promise<number> {
  if (url.includes('/regions')) return TTL_CONFIG.regions;
  if (url.includes('/products')) return TTL_CONFIG.products;
  if (url.includes('/collections')) return TTL_CONFIG.collections;
  return TTL_CONFIG.default;
}

/**
 * Generate a cache key from a URL and optional query parameters
 */
export async function generateCacheKey(url: string, params?: Record<string, any>): Promise<string> {
  if (!params) {
    return url;
  }
  
  // Sort keys to ensure consistent cache keys regardless of object property order
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {} as Record<string, any>);
  
  return `${url}:${JSON.stringify(sortedParams)}`;
}

/**
 * Deduplicate requests by caching responses and coalescing in-flight requests
 * @param url The URL to fetch
 * @param fetcher The function that performs the actual fetch
 * @param params Optional query parameters
 * @param ttl Optional custom TTL in milliseconds
 * @returns The cached or fresh response
 */
export async function deduplicateRequest<T>(
  url: string,
  fetcher: () => Promise<T>,
  params?: Record<string, any>,
  ttl?: number
): Promise<T> {
  const cacheKey = await generateCacheKey(url, params);
  const now = Date.now();
  
  // If TTL is not provided, use the URL-specific TTL
  const effectiveTtl = ttl || await getTtlForUrl(url);
  
  // Check if we have a valid cached response
  const cached = requestCache.get(cacheKey);
  if (cached && now - cached.timestamp < effectiveTtl) {
    return cached.data as T;
  }
  
  // Check if there's already an in-flight request for this key
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey) as Promise<T>;
  }
  
  // If not cached or expired, fetch fresh data
  
  // Create a new request and store it in pending requests
  const requestPromise = fetcher()
    .then(result => {
      // Cache the result
      requestCache.set(cacheKey, {
        timestamp: Date.now(),
        data: result
      });
      
      // Clean up the pending request
      pendingRequests.delete(cacheKey);
      
      return result;
    })
    .catch(error => {
      // Clean up the pending request on error
      pendingRequests.delete(cacheKey);
      throw error;
    });
  
  // Store the promise in pending requests
  pendingRequests.set(cacheKey, requestPromise);
  
  return requestPromise;
}

/**
 * Clear the entire request cache
 */
export async function clearRequestCache(): Promise<void> {
  requestCache.clear();
}

/**
 * Clear a specific entry from the cache
 * @param url The URL to clear from cache
 * @param params Optional query parameters
 */
export async function clearCacheEntry(url: string, params?: Record<string, any>): Promise<void> {
  const cacheKey = await generateCacheKey(url, params);
  requestCache.delete(cacheKey);
} 