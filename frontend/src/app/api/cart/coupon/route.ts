import { NextRequest, NextResponse } from "next/server"
import { applyPromotions, retrieveCart } from "@lib/data/cart"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const code = (body.code || "").trim().toUpperCase()

    if (!code) {
      return NextResponse.json({ error: "Promotion code is required" }, { status: 400 })
    }

    await applyPromotions([code])
    const updatedCart = await retrieveCart(undefined, undefined, { fresh: true })

    return NextResponse.json({ success: true, cart: updatedCart })
  } catch (error: any) {
    console.error("[POST /api/cart/coupon] Error applying coupon:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to apply promotion code" },
      { status: 400 }
    )
  }
}
