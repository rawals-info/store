import { NextResponse } from "next/server"
import { addToCart, getOrSetCart } from "@lib/data/cart"
import { cookies } from "next/headers"
import { logError } from "@lib/util/logger"

// Force dynamic behavior since this route uses cookies
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

// Optimize to return faster - handle errors gracefully
export async function POST(request: Request) {
  try {
    // Parse the request
    const requestData = await request.json()
    const { variantId, quantity, countryCode } = requestData
    
    if (!variantId) {
      return NextResponse.json({ success: false, error: "Missing variant ID" }, { status: 400 });
    }
    
    // Check if we already have a cart cookie – if so we can respond instantly and
    // perform the cart mutation in the background. This removes a full round-trip
    // on every add-to-cart click when the shopper already has a cart.
    const cookieStore = await cookies()
    const existingCartId = cookieStore.get("_medusa_cart_id")?.value

    if (existingCartId) {
      // Attempt to add item and surface any backend errors instead of ignoring them
      const result = await addToCart({ variantId, quantity, countryCode })

      if (!result.success) {
        logError("Add-to-cart failed:", result.error)
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, cartId: existingCartId })
    }

    // No cart cookie yet – create one first (blocking once per session)
    const cart = await getOrSetCart(countryCode).catch((error) => {
      logError("Failed to get/create cart:", error)
      return null
    })

    if (!cart || !cart.id) {
      return NextResponse.json(
        { success: false, error: "Failed to create cart" },
        { status: 500 }
      )
    }

    // Set cookie so subsequent add-to-cart calls return instantly
    const response = NextResponse.json({ success: true, cartId: cart.id })
    response.cookies.set("_medusa_cart_id", cart.id, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })

    // Try to add the item right away so we can catch any errors and surface them
    const result = await addToCart({ variantId, quantity, countryCode })

    if (!result.success) {
      logError("Add-to-cart failed:", result.error)
      // Revoke the previously set cookie since the cart is not valid
      response.cookies.delete("_medusa_cart_id")
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return response
  } catch (error: any) {
    logError("Error processing cart request:", error)
    return NextResponse.json(
      { success: false, error: "Error processing cart request" },
      { status: 500 }
    )
  }
} 