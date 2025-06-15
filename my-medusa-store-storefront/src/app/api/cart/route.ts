import { NextResponse } from "next/server"
import { retrieveCart } from "@lib/data/cart"

// Update the caching strategy to be more efficient
// Use default dynamic behavior instead of force-dynamic
export const dynamic = "default"

// Small stale-while-revalidate window to prevent excessive requests
export const revalidate = 3 // Revalidate after 3 seconds

// Keep track of last fetch time and pending requests
let lastFetchTime = 0;
let pendingRequest: Promise<NextResponse> | null = null;

export async function GET() {
  const now = Date.now();
  
  // If we have a pending request, return that instead of creating a new one
  if (pendingRequest && now - lastFetchTime < 300) {
    return pendingRequest;
  }
  
  // If we've fetched recently (within last 1 second), use the same response
  if (now - lastFetchTime < 1000) {
    // Create a new response but keep using the same cart data
    try {
      const cart = await retrieveCart()
      const response = NextResponse.json({ cart })
      response.headers.set("Cache-Control", "s-maxage=3, stale-while-revalidate=10")
      return response
    } catch (error) {
      console.error("Error fetching cart:", error)
      return NextResponse.json({ cart: null }, { status: 500 })
    }
  }
  
  // Otherwise, create a new request
  lastFetchTime = now;
  
  pendingRequest = (async () => {
    try {
      // Retrieve cart
      const cart = await retrieveCart()
      
      const response = NextResponse.json({ cart })
      
      // Use a short but reasonable cache window
      response.headers.set("Cache-Control", "s-maxage=3, stale-while-revalidate=10")
      
      return response
    } catch (error) {
      console.error("Error fetching cart:", error)
      return NextResponse.json({ cart: null }, { status: 500 })
    } finally {
      // Clear pending request after a short delay
      setTimeout(() => {
        pendingRequest = null;
      }, 300);
    }
  })();
  
  return pendingRequest;
} 