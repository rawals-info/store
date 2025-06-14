import { NextResponse } from "next/server"
import { retrieveCart } from "@lib/data/cart"

// Force dynamic route to avoid caching
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"
export const revalidate = 0

export async function GET() {
  try {
    // Retrieve cart with no-cache to ensure latest data
    const cart = await retrieveCart()
    
    const response = NextResponse.json({ cart })
    
    // Set no-cache headers to ensure freshness
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")
    
    return response
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ cart: null }, { status: 500 })
  }
} 