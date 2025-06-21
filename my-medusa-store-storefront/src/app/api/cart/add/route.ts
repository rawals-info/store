import { NextResponse } from "next/server"
import { addToCart, getOrSetCart } from "@lib/data/cart"
import { cookies } from "next/headers"

// Force dynamic behavior since this route uses cookies
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

// Optimize to return faster - handle errors gracefully
export async function POST(request: Request) {
  try {
    // Parse the request
    const requestData = await request.json();
    const { variantId, quantity, countryCode } = requestData;
    
    if (!variantId) {
      return NextResponse.json({ success: false, error: "Missing variant ID" }, { status: 400 });
    }
    
    // Create a cart immediately and set the cookie
    const cart = await getOrSetCart(countryCode).catch(error => {
      console.error("Failed to get/create cart:", error);
      return null;
    });
    
    if (!cart || !cart.id) {
      return NextResponse.json({ success: false, error: "Failed to create cart" }, { status: 500 });
    }
    
    // Prepare the response
    const response = NextResponse.json({ success: true, cartId: cart.id });

    // Only set the cookie if it doesn't exist or changed to avoid triggering
    // Next.js cookie-change revalidation on every "add to cart" call.
    const existingCookie = (await cookies()).get("_medusa_cart_id")?.value;
    if (existingCookie !== cart.id) {
      response.cookies.set("_medusa_cart_id", cart.id, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }
    
    // Fire and forget - don't wait for the result, let it happen in background
    addToCart({ variantId, quantity, countryCode }).catch(error => {
      console.error("Error adding item to cart in background:", error);
    });
    
    // Return response immediately - this speeds up the UI flow
    return response;
  } catch (error: any) {
    console.error("Error processing cart request:", error);
    return NextResponse.json(
      { success: false, error: "Error processing cart request" },
      { status: 500 }
    );
  }
} 