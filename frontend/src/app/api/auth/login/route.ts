import { sdk } from "@lib/config"
import { getCacheTag, getCartId, setAuthToken } from "@lib/data/cookies"
import { scheduleRevalidate } from "@lib/utils/revalidate"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    let email = ""
    let password = ""

    const contentType = req.headers.get("content-type") || ""

    if (contentType.includes("application/json")) {
      const jsonData = await req.json().catch(() => ({}))
      if (jsonData.token) {
        await setAuthToken(jsonData.token)
        return NextResponse.json({ success: true })
      }
      email = (jsonData.email || "").trim()
      password = (jsonData.password || "").trim()
    } else {
      try {
        const formData = await req.formData()
        email = ((formData.get("email") as string) || "").trim()
        password = ((formData.get("password") as string) || "").trim()
      } catch (formError) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid login form submission. Please try again.",
          },
          { status: 200 }
        )
      }
    }

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter both your email address and password.",
        },
        { status: 200 }
      )
    }

    try {
      const loginToken = await sdk.auth.login("customer", "emailpass", {
        email,
        password,
      })

      if (!loginToken) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid email or password. Please check your credentials or create a new account.",
          },
          { status: 200 }
        )
      }

      await setAuthToken(loginToken as string)

      try {
        const cartId = await getCartId()
        if (cartId) {
          await sdk.store.cart.transferCart(cartId, {}, { authorization: `Bearer ${loginToken}` })
          const cartCacheTag = await getCacheTag("carts")
          scheduleRevalidate(cartCacheTag)
        }
      } catch (cartErr) {
        console.warn("Cart transfer error on login:", cartErr)
      }

      return NextResponse.json({ success: true })
    } catch (loginError: any) {
      console.error("Medusa login failed:", loginError?.message || loginError)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password. If you are new to Taj Petha, please click 'Create Account' above.",
        },
        { status: 200 }
      )
    }
  } catch (error: any) {
    console.error("General login route error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Unable to process login. Please try again.",
      },
      { status: 200 }
    )
  }
}