import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Force dynamic behavior since this route uses cookies
export const dynamic = "force-dynamic"

// Get cart ID
export async function GET() {
  try {
    const cookieStore = await cookies()
    const cartId = cookieStore.get("_medusa_cart_id")?.value
    return NextResponse.json({ cartId: cartId || null })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get cart ID" },
      { status: 500 }
    )
  }
}

// Set cart ID
export async function POST(request: Request) {
  try {
    const { cartId } = await request.json()
    
    if (!cartId) {
      return NextResponse.json(
        { error: "Cart ID is required" },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    cookieStore.set("_medusa_cart_id", cartId, {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    )
  }
}

// Delete cart ID
export async function DELETE() {
  try {
    const cookieStore = await cookies()
    cookieStore.set("_medusa_cart_id", "", {
      maxAge: -1,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete cart ID" },
      { status: 500 }
    )
  }
} 