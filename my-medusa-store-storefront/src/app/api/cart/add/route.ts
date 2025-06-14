import { NextResponse } from "next/server"
import { addToCart, getOrSetCart } from "@lib/data/cart"

export async function POST(request: Request) {
  const { variantId, quantity, countryCode } = await request.json()
  try {
    if (!variantId) {
      throw new Error("Missing variant ID")
    }

    // Ensure cart exists and retrieve cart ID
    const cart = await getOrSetCart(countryCode)
    if (!cart || !cart.id) {
      throw new Error("Failed to retrieve or create cart")
    }

    // Add the item to the cart
    await addToCart({ variantId, quantity, countryCode })

    // Set the cart ID cookie explicitly on the response
    const response = NextResponse.json({ success: true })
    response.cookies.set("_medusa_cart_id", cart.id, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
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