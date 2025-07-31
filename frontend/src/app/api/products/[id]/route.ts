import { NextRequest, NextResponse } from "next/server"
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { PRODUCT_FIELDS } from "@lib/constants/api-fields"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

/**
 * API endpoint to fetch a single product with detailed information
 * This endpoint is used by client components to fetch data after initial render
 */
export async function GET(
  req: NextRequest,
  routeContext: { params: { id: string } }
) {
  try {
    const { id } = await routeContext.params
    
    // Get the region ID from query params
    const { searchParams } = new URL(req.url)
    const regionId = searchParams.get("regionId")
    const contextType = searchParams.get("context") || "detail" // detail, list, search, etc.
    
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

    // Choose fields based on context
    const getFieldsForContext = (contextType: string) => {
      switch (contextType) {
        case "list": return PRODUCT_FIELDS.LIST
        case "search": return PRODUCT_FIELDS.SEARCH
        case "cart": return PRODUCT_FIELDS.CART_ITEM
        case "related": return PRODUCT_FIELDS.RELATED
        default: return PRODUCT_FIELDS.DETAIL
      }
    }

    // Fetch the product with the region info
    const result = await sdk.client.fetch<{
      products: HttpTypes.StoreProduct[]
    }>(`/store/products`, {
      query: {
        id: [id],
        region_id: regionId,
        limit: 1,
        fields: getFieldsForContext(contextType)
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