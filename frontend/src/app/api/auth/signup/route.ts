import { sdk } from "@lib/config"
import { getCacheTag, getCartId, setAuthToken } from "@lib/data/cookies"
import { scheduleRevalidate } from "@lib/utils/revalidate"
import { NextRequest, NextResponse } from "next/server"

// Force dynamic behavior since this route uses cookies
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    let customerForm: any = {};
    let password: string = "";
    
    // Check content type and handle accordingly
    const contentType = req.headers.get("content-type") || "";
    
    if (contentType.includes("application/json")) {
      // Handle JSON request
      const jsonData = await req.json();
      password = jsonData.password;
      customerForm = {
        email: jsonData.email,
        first_name: jsonData.first_name,
        last_name: jsonData.last_name,
        phone: jsonData.phone,
      };
    } else {
      // Handle FormData request
      try {
        const formData = await req.formData();
        password = formData.get("password") as string;
        customerForm = {
          email: formData.get("email") as string,
          first_name: formData.get("first_name") as string,
          last_name: formData.get("last_name") as string,
          phone: formData.get("phone") as string,
        };
      } catch (formError) {
        console.error("Error parsing form data:", formError);
        return NextResponse.json(
          { 
            success: false, 
            error: "Invalid form data. Please check your input and try again." 
          }, 
          { status: 400 }
        );
      }
    }

    // Validate required fields
    if (!customerForm.email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Email and password are required." 
        }, 
        { status: 400 }
      );
    }

    // Register the user
    const token = await sdk.auth.register("customer", "emailpass", {
      email: customerForm.email,
      password: password,
    })

    await setAuthToken(token as string)

    const headers = {
      authorization: `Bearer ${token}`,
    }

    // Create the customer
    const { customer: createdCustomer } = await sdk.store.customer.create(
      customerForm,
      {},
      headers
    )

    // Login the user
    const loginToken = await sdk.auth.login("customer", "emailpass", {
      email: customerForm.email,
      password,
    })

    await setAuthToken(loginToken as string)

    // Revalidate cache
    const customerCacheTag = await getCacheTag("customers")
    scheduleRevalidate(customerCacheTag)

    // Transfer cart
    const cartId = await getCartId()
    if (cartId) {
      await sdk.store.cart.transferCart(cartId, {}, { authorization: `Bearer ${loginToken}` })
      const cartCacheTag = await getCacheTag("carts")
      scheduleRevalidate(cartCacheTag)
    }

    return NextResponse.json({ success: true, customer: createdCustomer })
  } catch (error: unknown) {
    console.error("Error during signup:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      }, 
      { status: 500 }
    )
  }
} 