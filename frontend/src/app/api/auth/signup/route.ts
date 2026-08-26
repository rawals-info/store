import { sdk } from "@lib/config"
import { getCacheTag, getCartId, setAuthToken } from "@lib/data/cookies"
import { scheduleRevalidate } from "@lib/utils/revalidate"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    let customerForm: any = {}
    let password: string = ""

    const contentType = req.headers.get("content-type") || ""

    if (contentType.includes("application/json")) {
      const jsonData = await req.json().catch(() => ({}))
      password = (jsonData.password || "").trim()
      customerForm = {
        email: (jsonData.email || "").trim(),
        first_name: (jsonData.first_name || "").trim(),
        last_name: (jsonData.last_name || "").trim(),
        phone: (jsonData.phone || "").trim(),
      }
    } else {
      try {
        const formData = await req.formData()
        password = ((formData.get("password") as string) || "").trim()
        customerForm = {
          email: ((formData.get("email") as string) || "").trim(),
          first_name: ((formData.get("first_name") as string) || "").trim(),
          last_name: ((formData.get("last_name") as string) || "").trim(),
          phone: ((formData.get("phone") as string) || "").trim(),
        }
      } catch (formError) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid registration form data. Please try again.",
          },
          { status: 200 }
        )
      }
    }

    if (!customerForm.email || !password || !customerForm.first_name) {
      return NextResponse.json(
        {
          success: false,
          error: "First name, email, and password are required to create an account.",
        },
        { status: 200 }
      )
    }

    try {
      // 1. Register auth credential
      const token = await sdk.auth.register("customer", "emailpass", {
        email: customerForm.email,
        password: password,
      })

      if (!token) {
        throw new Error("Failed to generate authentication token")
      }

      await setAuthToken(token as string)

      const headers = {
        authorization: `Bearer ${token}`,
      }

      // 2. Create customer record in Medusa
      const { customer: createdCustomer } = await sdk.store.customer.create(
        customerForm,
        {},
        headers
      )

      // 3. Login to ensure full session
      const loginToken = await sdk.auth.login("customer", "emailpass", {
        email: customerForm.email,
        password,
      })

      if (loginToken) {
        await setAuthToken(loginToken as string)
      }

      const customerCacheTag = await getCacheTag("customers")
      scheduleRevalidate(customerCacheTag)

      try {
        const cartId = await getCartId()
        if (cartId) {
          await sdk.store.cart.transferCart(cartId, {}, { authorization: `Bearer ${loginToken || token}` })
          const cartCacheTag = await getCacheTag("carts")
          scheduleRevalidate(cartCacheTag)
        }
      } catch (cartErr) {
        console.warn("Cart transfer error on register:", cartErr)
      }

      return NextResponse.json({ success: true, customer: createdCustomer })
    } catch (regError: any) {
      console.error("Medusa register failed:", regError?.message || regError)
      const errorMsg = regError?.message?.includes("already exists") || regError?.message?.includes("duplicate")
        ? "An account with this email already exists. Please sign in instead."
        : regError?.message || "Registration failed. Please check your details and try again."

      return NextResponse.json(
        {
          success: false,
          error: errorMsg,
        },
        { status: 200 }
      )
    }
  } catch (error: any) {
    console.error("General signup route error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Unable to complete registration. Please try again.",
      },
      { status: 200 }
    )
  }
}