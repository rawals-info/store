import { sdk } from "@lib/config"
import { NextResponse } from "next/server"
import { HttpTypes } from "@medusajs/types"

// Set CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const limit = url.searchParams.get("limit") || "4"
    const offset = url.searchParams.get("offset") || "0"
    const parentId = url.searchParams.get("parent_id")

    // Build query parameters
    const queryParams: Record<string, any> = {
      limit: parseInt(limit),
      offset: parseInt(offset),
      fields: "*category_children",
    }

    // If parent_id is provided, filter by parent
    if (parentId) {
      queryParams.parent_category_id = parentId === "null" ? null : parentId
    }

    // Fetch categories with strict caching for better performance
    const response = await sdk.client.fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: queryParams,
        next: {
          revalidate: 3600, // Cache for 1 hour
          tags: ["categories"],
        }
      }
    )
    
    return NextResponse.json(
      { 
        categories: response.product_categories || [],
      },
      { 
        status: 200,
        headers: {
          ...corsHeaders,
          // Add cache control headers
          "Cache-Control": "public, max-age=300, s-maxage=600, stale-while-revalidate=3600",
        } 
      }
    )
  } catch (error: any) {
    console.error("Categories API error:", error.message)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500, headers: corsHeaders }
    )
  }
} 