import { NextRequest, NextResponse } from "next/server"
import { retrieveCart, retrieveCartDropdown, retrieveCartCount } from "@lib/data/cart"
import { CART_FIELDS } from "@lib/constants/api-fields"

// Force dynamic behavior since this route uses cookies
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const context = searchParams.get("context") || "full" // full, dropdown, count
    const cacheBuster = searchParams.get("t") // Check for cache buster
    
    // ✅ FIX: If cache buster is present, always fetch fresh data
    const useFresh = !!cacheBuster
    
    console.log(`[API /api/cart] Fetching cart, context: ${context}, fresh: ${useFresh}`)
    
    // Use optimized cart function based on context
    let cart;
    switch (context) {
      case "dropdown":
        cart = await retrieveCartDropdown()
        break
      case "count":
        cart = await retrieveCartCount()
        break
      default:
        // ✅ FIX: Pass fresh option to bypass Next.js cache
        cart = await retrieveCart(undefined, undefined, { fresh: useFresh })
    }
    
    console.log(`[API /api/cart] Cart fetched, items count: ${cart?.items?.length || 0}`)
    
    const response = NextResponse.json({ cart })
    
    // ✅ Set aggressive cache headers for dynamic content
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")
    
    return response
  } catch (error) {
    console.error("[API /api/cart] Error retrieving cart:", error)
    return NextResponse.json(
      { error: "Failed to retrieve cart" },
      { status: 500 }
    )
  }
} 