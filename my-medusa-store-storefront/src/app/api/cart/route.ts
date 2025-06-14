import { NextResponse } from "next/server"
import { retrieveCart } from "@lib/data/cart"

export async function GET() {
  try {
    const cart = await retrieveCart()
    return NextResponse.json({ cart })
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ cart: null }, { status: 500 })
  }
} 