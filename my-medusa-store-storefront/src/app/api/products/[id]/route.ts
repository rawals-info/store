import { NextRequest, NextResponse } from "next/server"
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

/**
 * API endpoint to fetch a single product with detailed information
 * This endpoint is used by client components to fetch data after initial render
 */
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params
    
    // Get the region ID from query params
    const { searchParams } = new URL(req.url)
    const regionId = searchParams.get("regionId")
    
    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    if (!regionId) {
      return NextResponse.json(
        { error: "Region ID is required" },
        { status: 400 }
      )
    }

    // Fetch the product with the region info
    const result = await sdk.client.fetch<{
      products: HttpTypes.StoreProduct[]
    }>(`/store/products`, {
      query: {
        id: [id],
        region_id: regionId,
        limit: 1
      },
      cache: "no-store",
    }).catch(error => {
      console.error("Error fetching product:", error)
      return { products: [] }
    })

    // Return the product
    return NextResponse.json({
      product: result.products[0] || null,
    })
  } catch (error) {
    console.error("Error in product API:", error)
    return NextResponse.json(
      { error: "An error occurred while fetching product" },
      { status: 500 }
    )
  }
} 