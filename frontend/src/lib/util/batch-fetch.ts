"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders } from "@lib/data/cookies"

/**
 * Type representing a single API request to be batched
 */
export type BatchRequest = {
  path: string
  method?: "GET" | "POST" | "PUT" | "DELETE"
  query?: Record<string, any>
  body?: Record<string, any>
  cacheTags?: string[]
  cacheRevalidate?: number
}

/**
 * Type representing the response from a batched API request
 */
export type BatchResponse<T = any> = {
  data: T
  status: number
  path: string
}

/**
 * Execute multiple API requests in a single network round trip
 * 
 * @param requests - Array of requests to be batched
 * @returns Array of responses in the same order as the requests
 */
export async function batchFetch<T extends unknown[]>(
  requests: BatchRequest[]
): Promise<BatchResponse<T[number]>[]> {
  if (!requests || requests.length === 0) {
    return []
  }

  // If there's only one request, don't use batching
  if (requests.length === 1) {
    const req = requests[0]
    const headers = await getAuthHeaders() || {}

    const next = {
      revalidate: req.cacheRevalidate || 60,
      tags: req.cacheTags || [],
    }

    try {
      const data = await sdk.client.fetch(req.path, {
        method: req.method || "GET",
        query: req.query,
        body: req.body,
        headers,
        next,
        cache: "force-cache",
      })

      return [{ 
        data, 
        status: 200, 
        path: req.path 
      }] as BatchResponse<T[number]>[]
    } catch (error) {
      console.error(`Error in batch fetch for path ${req.path}:`, error)
      return [{ 
        data: null, 
        status: 500, 
        path: req.path 
      }] as BatchResponse<T[number]>[]
    }
  }

  // For multiple requests, we'll use the batch API endpoint when requests are homogeneous
  // (same cache requirements)
  const isSingleCacheGroup = isSameCacheRequirements(requests)
  
  if (isSingleCacheGroup && process.env.NODE_ENV !== 'development') {
    return processBatchEndpoint(requests).then(results => 
      results as unknown as BatchResponse<T[number]>[]
    )
  }
  
  // For heterogeneous cache requirements or during development, use the grouped approach
  // Group requests by cache requirements to maintain Next.js caching behavior
  const requestGroups = groupRequestsByCache(requests)
  
  const results: BatchResponse<any>[] = []
  
  // Process each group sequentially
  for (const group of requestGroups) {
    const groupResults = await processBatchGroup(group)
    results.push(...groupResults)
  }
  
  // Sort results to match the original request order
  const orderedResults: BatchResponse<T[number]>[] = []
  
  for (const req of requests) {
    const result = results.find(r => r.path === req.path)
    if (result) {
      orderedResults.push(result as BatchResponse<T[number]>)
    } else {
      // Fallback if something went wrong
      orderedResults.push({ 
        data: null, 
        status: 500, 
        path: req.path 
      } as BatchResponse<T[number]>)
    }
  }
  
  return orderedResults
}

/**
 * Check if all requests have the same cache requirements
 */
function isSameCacheRequirements(requests: BatchRequest[]): boolean {
  if (requests.length <= 1) return true
  
  const firstReq = requests[0]
  const firstCacheKey = `${firstReq.cacheRevalidate || 60}_${(firstReq.cacheTags || []).sort().join('_')}`
  
  return requests.every(req => {
    const cacheKey = `${req.cacheRevalidate || 60}_${(req.cacheTags || []).sort().join('_')}`
    return cacheKey === firstCacheKey
  })
}

/**
 * Use the batch API endpoint to process multiple requests in a single HTTP call
 */
async function processBatchEndpoint(requests: BatchRequest[]): Promise<BatchResponse<any>[]> {
  try {
    // Get auth headers for the batch request
    const authHeaders = await getAuthHeaders() || {}
    
    // Format requests for the batch endpoint
    const batchRequests = requests.map(req => ({
      path: req.path,
      method: req.method || "GET",
      query: req.query,
      body: req.body,
      headers: authHeaders
    }))
    
    // Use the first request's cache settings for the batch request
    const first = requests[0]
    const next = {
      revalidate: first.cacheRevalidate || 60,
      tags: first.cacheTags || [],
    }
    
    // Make the batch request
    const response = await fetch('/api/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders
      },
      body: JSON.stringify({ requests: batchRequests }),
      next
    })
    
    if (!response.ok) {
      throw new Error(`Batch request failed with status ${response.status}`)
    }
    
    const batchResults = await response.json()
    
    // Map the batch results to the expected format
    return batchResults.map((result: any, index: number) => ({
      data: result.data,
      status: result.status,
      path: requests[index].path
    }))
  } catch (error) {
    console.error('Error in batch endpoint request:', error)
    
    // Fallback to individual requests
    return processBatchGroup(requests)
  }
}

/**
 * Group requests by their cache requirements to maintain proper caching
 */
function groupRequestsByCache(requests: BatchRequest[]): BatchRequest[][] {
  const groups: Record<string, BatchRequest[]> = {}
  
  for (const req of requests) {
    // Create a cache key based on revalidation time and tags
    const cacheKey = `${req.cacheRevalidate || 60}_${(req.cacheTags || []).sort().join('_')}`
    
    if (!groups[cacheKey]) {
      groups[cacheKey] = []
    }
    
    groups[cacheKey].push(req)
  }
  
  return Object.values(groups)
}

/**
 * Process a group of requests with the same caching requirements
 */
async function processBatchGroup(requests: BatchRequest[]): Promise<BatchResponse<any>[]> {
  const headers = await getAuthHeaders() || {}
  
  // Use the first request's cache settings for the entire group
  const first = requests[0]
  const next = {
    revalidate: first.cacheRevalidate || 60,
    tags: first.cacheTags || [],
  }
  
  // For simplicity, we'll execute these in parallel with Promise.all
  const results = await Promise.all(
    requests.map(async (req) => {
      try {
        const data = await sdk.client.fetch(req.path, {
          method: req.method || "GET",
          query: req.query,
          body: req.body,
          headers,
          next,
          cache: "force-cache",
        })
        
        return { 
          data, 
          status: 200, 
          path: req.path 
        }
      } catch (error) {
        console.error(`Error in batch group for path ${req.path}:`, error)
        return { 
          data: null, 
          status: 500, 
          path: req.path 
        }
      }
    })
  )
  
  return results
} 