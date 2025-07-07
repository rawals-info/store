import { sdk } from "@lib/config"
import { deduplicateRequest } from "@lib/util/request-cache"
import { NextRequest, NextResponse } from "next/server"

type BatchRequest = {
  path: string
  method?: "GET" | "POST" | "PUT" | "DELETE"
  query?: Record<string, any>
  body?: Record<string, any>
  headers?: Record<string, string>
}

/**
 * Generate a unique key for a request based on its properties
 */
function generateRequestKey(request: BatchRequest): string {
  const { path, method = "GET", query = {}, body = {} } = request
  
  // For GET requests, include query params in the key
  if (method === "GET") {
    const queryStr = Object.keys(query).sort().map(key => `${key}=${JSON.stringify(query[key])}`).join('&')
    return `${method}:${path}${queryStr ? `?${queryStr}` : ''}`
  }
  
  // For non-GET requests, include the body in the key
  const bodyStr = Object.keys(body).length > 0 ? JSON.stringify(body) : ''
  return `${method}:${path}${bodyStr ? `:${bodyStr}` : ''}`
}

/**
 * Handles batch API requests in a single endpoint
 * This reduces the number of HTTP requests made to the Medusa backend
 */
export async function POST(req: NextRequest) {
  try {
    const { requests } = await req.json()

    if (!Array.isArray(requests) || requests.length === 0) {
      return NextResponse.json(
        { error: "Invalid batch request format" },
        { status: 400 }
      )
    }

    // Improved request grouping by path, method, query params, and body
    const requestsMap = new Map<string, { request: BatchRequest, indices: number[] }>()
    
    // Group requests by their unique properties
    requests.forEach((request, index) => {
      const key = generateRequestKey(request)
      
      if (!requestsMap.has(key)) {
        requestsMap.set(key, { request, indices: [index] })
      } else {
        requestsMap.get(key)!.indices.push(index)
      }
    })

    // Process each unique request in parallel
    const uniqueResults = await Promise.all(
      Array.from(requestsMap.entries()).map(async ([key, { request, indices }]) => {
        const { path, method = "GET", query = {}, body = {}, headers = {} } = request

        if (!path) {
          return {
            key,
            indices,
            result: {
              error: "Missing path in batch request",
              status: 400,
            }
          }
        }

        try {
          // Use request deduplication to avoid multiple identical requests
          // with intelligent TTL based on request type
          const ttl = path.includes('/regions') ? 10 * 60 * 1000 : // 10 minutes for regions
                     path.includes('/products') ? 5 * 60 * 1000 : // 5 minutes for products
                     60 * 1000 // 1 minute default for batch requests
          
          const response = await deduplicateRequest(
            path,
            () => sdk.client.fetch(path, {
              method,
              query,
              body: method !== "GET" ? body : undefined,
              headers,
            }),
            method === "GET" ? query : undefined,
            ttl
          )

          return {
            key,
            indices,
            result: {
              data: response,
              path,
              status: 200,
            }
          }
        } catch (error: any) {
          console.error(`Batch request error for path ${path}:`, error)
          
          return {
            key,
            indices,
            result: {
              error: error.message || "Unknown error",
              path,
              status: error.status || 500,
            }
          }
        }
      })
    )

    // Map results back to original request order
    const results = new Array(requests.length)
    
    for (const { indices, result } of uniqueResults) {
      for (const index of indices) {
        results[index] = result
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Batch API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 