import { NextResponse } from "next/server"
import { retrieveCart } from "@lib/data/cart"

// Force dynamic behavior since this route uses cookies
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Retrieve cart
    const cart = await retrieveCart()
    
    const response = NextResponse.json({ cart })
    
    // Set appropriate cache headers for dynamic content
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")
    
    return response
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ cart: null }, { status: 500 })
  }
} 