import { NextRequest, NextResponse } from "next/server"
import { sdk } from "@lib/config"
import { getAuthHeaders, getCartId, removeCartId } from "@lib/data/cookies"
import { randomUUID } from "crypto"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  return handleCallback(req)
}

export async function GET(req: NextRequest) {
  return handleCallback(req)
}

async function handleCallback(req: NextRequest) {
  const origin = req.nextUrl.origin
  let cartId: string | undefined | null = req.nextUrl.searchParams.get("cart_id")
  let countryCode = req.nextUrl.searchParams.get("country_code") || "in"

  // Check form data if it's a POST
  if (req.method === "POST") {
    try {
      const formData = await req.formData()
      const errorDesc =
        (formData.get("error[description]") as string) ||
        (formData.get("error_description") as string)

      if (errorDesc) {
        console.error("[Razorpay Callback] Payment failed or cancelled by user:", errorDesc)
        return NextResponse.redirect(
          new URL(`/${countryCode}/cart?error=${encodeURIComponent(errorDesc)}`, origin),
          303
        )
      }
    } catch {
      // Body may not be standard form data, proceed
    }
  }

  // Fallback to cookie if cart_id was not in query params
  if (!cartId) {
    cartId = await getCartId()
  }

  if (!cartId) {
    console.error("[Razorpay Callback] No cart ID found in request or cookies")
    return NextResponse.redirect(new URL(`/${countryCode}/cart`, origin), 303)
  }

  try {
    const headers = await getAuthHeaders()

    // Complete the cart into an order in Medusa
    const cartRes = (await sdk.store.cart.complete(
      cartId,
      {},
      { ...headers, "Idempotency-Key": randomUUID() }
    )) as any

    if (cartRes?.type === "order" && cartRes.order?.id) {
      await removeCartId()

      const orderCountry =
        cartRes.order.shipping_address?.country_code?.toLowerCase() || countryCode
      const redirectUrl = new URL(
        `/${orderCountry}/order/${cartRes.order.id}/confirmed`,
        origin
      )

      const response = NextResponse.redirect(redirectUrl, 303)
      response.cookies.set("_medusa_cart_id", "", {
        path: "/",
        maxAge: -1,
        sameSite: "lax",
      })
      response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate")
      return response
    }

    if (cartRes?.type === "cart") {
      console.warn("[Razorpay Callback] Cart not converted to order:", cartRes.error)
    }

    return NextResponse.redirect(new URL(`/${countryCode}/cart`, origin), 303)
  } catch (err: any) {
    console.error("[Razorpay Callback] Error completing cart:", err)
    return NextResponse.redirect(
      new URL(`/${countryCode}/cart?error=order_pending`, origin),
      303
    )
  }
}
