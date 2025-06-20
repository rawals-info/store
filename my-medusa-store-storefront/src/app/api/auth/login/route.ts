import { sdk } from "@lib/config"
import { getCacheTag, getCartId, setAuthToken } from "@lib/data/cookies"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// Force dynamic behavior since this route uses cookies
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    let email = "";
    let password = "";
    
    // Check content type and handle accordingly
    const contentType = req.headers.get("content-type") || "";
    
    if (contentType.includes("application/json")) {
      // Handle JSON request
      const jsonData = await req.json();
      
      // Check if this is a token-based login
      if (jsonData.token) {
        const token = jsonData.token;
        await setAuthToken(token);
        return NextResponse.json({ success: true });
      }
      
      // Regular login
      email = jsonData.email;
      password = jsonData.password;
    } else {
      // Handle FormData request
      try {
        const formData = await req.formData();
        email = formData.get("email") as string;
        password = formData.get("password") as string;
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

    // Validate required fields for regular login
    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Email and password are required." 
        }, 
        { status: 400 }
      );
    }

    // Attempt login
    try {
      const loginToken = await sdk.auth.login("customer", "emailpass", {
        email,
        password,
      });

      await setAuthToken(loginToken as string);

      // Transfer cart if exists
      const cartId = await getCartId();
      if (cartId) {
        await sdk.store.cart.transferCart(cartId, {}, { authorization: `Bearer ${loginToken}` });
        const cartCacheTag = await getCacheTag("carts");
        revalidateTag(cartCacheTag);
      }

      return NextResponse.json({ success: true });
    } catch (loginError) {
      console.error("Login error:", loginError);
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid email or password. Please try again." 
        }, 
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      },
      { status: 500 }
    );
  }
} 