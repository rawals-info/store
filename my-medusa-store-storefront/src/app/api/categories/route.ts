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

export async function GETAll() {
  try {
    const { product_categories } = await sdk.client.fetch<{
      product_categories: any[]
    }>(
      "/store/product-categories",
      {
        query: {
          limit: 1000,
          fields: "id,name,handle,description,category_children,parent_category",
        },
        next: {
          revalidate: 10,
          tags: ["categories"],
        },
        cache: "no-store",
      }
    )
    
    return NextResponse.json({ 
      success: true, 
      categories: product_categories,
      count: product_categories?.length || 0,
      parentCount: product_categories?.filter(c => !c?.parent_category)?.length || 0
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Fetch all categories with a high limit
    const { product_categories } = await sdk.client.fetch<{
      product_categories: any[]
    }>(
      "/store/product-categories",
      {
        query: {
          limit: 1000, // High limit to ensure we get all categories
          fields: "id,name,handle,description,category_children,parent_category",
        },
        next: {
          revalidate: 10,
          tags: ["categories"],
        },
        cache: "no-store", // Don't cache during development
      }
    )
    
    // Log what we found
    console.log("API fetched categories:", product_categories?.length || 0);
    console.log("Parent categories:", product_categories?.filter(c => !c?.parent_category)?.length || 0);
    
    return NextResponse.json({ 
      success: true, 
      categories: product_categories,
      count: product_categories?.length || 0,
      parentCount: product_categories?.filter(c => !c?.parent_category)?.length || 0
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 })
  }
} 