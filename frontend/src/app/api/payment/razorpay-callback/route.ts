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
  let razorpayOrderId: string | undefined | null = null

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

      razorpayOrderId = (formData.get("razorpay_order_id") as string) || null
    } catch {
      // Body may not be standard form data, proceed
    }
  }

  const backendUrl =
    process.env.MEDUSA_BACKEND_URL ||
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
    "http://localhost:9000"

  // 1. If cartId is missing or we want to check if already completed by webhook
  let knownOrderId: string | null = null
  if (razorpayOrderId) {
    try {
      const res = await fetch(
        `${backendUrl}/razorpay/order-cart?order_id=${encodeURIComponent(razorpayOrderId)}`,
        { cache: "no-store" }
      )
      if (res.ok) {
        const data = await res.json()
        if (data.cart_id && !cartId) {
          cartId = data.cart_id
        }
        if (data.order_id) {
          knownOrderId = data.order_id
        }
      }
    } catch (e) {
      console.error("[Razorpay Callback] Failed to lookup cart by razorpay order:", e)
    }
  }

  // Fallback to cookie if cart_id was not in query params and not resolved via order-cart
  if (!cartId) {
    cartId = await getCartId()
  }

  // If order was already completed (e.g. by webhook), redirect straight to confirmed order
  if (knownOrderId) {
    await removeCartId()
    const response = NextResponse.redirect(
      new URL(`/${countryCode}/order/${knownOrderId}/confirmed`, origin),
      303
    )
    response.cookies.set("_medusa_cart_id", "", {
      path: "/",
      maxAge: -1,
      sameSite: "lax",
    })
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate")
    return response
  }

  if (!cartId) {
    console.error("[Razorpay Callback] No cart ID found in request, order-cart, or cookies")
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

    // If cart was not converted (e.g. completed concurrently by webhook), re-check order-cart
    if (razorpayOrderId) {
      try {
        const res = await fetch(
          `${backendUrl}/razorpay/order-cart?order_id=${encodeURIComponent(razorpayOrderId)}`,
          { cache: "no-store" }
        )
        if (res.ok) {
          const data = await res.json()
          if (data.order_id) {
            await removeCartId()
            const response = NextResponse.redirect(
              new URL(`/${countryCode}/order/${data.order_id}/confirmed`, origin),
              303
            )
            response.cookies.set("_medusa_cart_id", "", {
              path: "/",
              maxAge: -1,
              sameSite: "lax",
            })
            response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate")
            return response
          }
        }
      } catch {
        // ignore
      }
    }

    if (cartRes?.type === "cart") {
      console.warn("[Razorpay Callback] Cart not converted to order:", cartRes.error)
    }

    return NextResponse.redirect(new URL(`/${countryCode}/cart`, origin), 303)
  } catch (err: any) {
    console.error("[Razorpay Callback] Error completing cart:", err)

    // Re-check if concurrent webhook completed the order despite error
    if (razorpayOrderId) {
      try {
        const res = await fetch(
          `${backendUrl}/razorpay/order-cart?order_id=${encodeURIComponent(razorpayOrderId)}`,
          { cache: "no-store" }
        )
        if (res.ok) {
          const data = await res.json()
          if (data.order_id) {
            await removeCartId()
            const response = NextResponse.redirect(
              new URL(`/${countryCode}/order/${data.order_id}/confirmed`, origin),
              303
            )
            response.cookies.set("_medusa_cart_id", "", {
              path: "/",
              maxAge: -1,
              sameSite: "lax",
            })
            response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate")
            return response
          }
        }
      } catch {
        // ignore
      }
    }

    return NextResponse.redirect(
      new URL(`/${countryCode}/cart?error=order_pending`, origin),
      303
    )
  }
}
