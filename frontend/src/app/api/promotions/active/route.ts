import { NextResponse } from "next/server"
import { getActivePromotion } from "@lib/data/promotions"

export const revalidate = 60 // 60 seconds cache

export async function GET() {
  try {
    const promotion = await getActivePromotion()
    return NextResponse.json({ promotion })
  } catch (error) {
    console.error("[GET /api/promotions/active] Error:", error)
    return NextResponse.json({ promotion: null })
  }
}
