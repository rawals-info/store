import { NextResponse } from "next/server"
import { addToCart, getOrSetCart } from "@lib/data/cart"

// Force dynamic behavior since this route uses cookies
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const { variantId, quantity, countryCode } = await request.json()
  
  if (!variantId) {
    return NextResponse.json({ success: false, error: "Missing variant ID" }, { status: 400 })
  }

  try {
    // Get or create a cart in a single operation
    const cart = await getOrSetCart(countryCode)
    if (!cart || !cart.id) {
      throw new Error("Failed to retrieve or create cart")
    }

    // Add the item to the cart
    await addToCart({ variantId, quantity, countryCode })

    // Return success immediately with cart ID cookie
    const response = NextResponse.json({ success: true, cartId: cart.id })
    
    // Set the cart ID cookie
    response.cookies.set("_medusa_cart_id", cart.id, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })
    
    return response
  } catch (error: any) {
    console.error("Error adding to cart:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Error" },
      { status: 500 }
    )
  }
} 