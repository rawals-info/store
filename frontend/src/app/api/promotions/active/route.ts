import { NextResponse } from "next/server"
import { getActivePromotion } from "@lib/data/promotions"

export const revalidate = 86400 // 1 day cache for promotions metadata

export async function GET() {
  try {
    const promotion = await getActivePromotion()
    return NextResponse.json({ promotion })
  } catch (error) {
    console.error("[GET /api/promotions/active] Error:", error)
    return NextResponse.json({ promotion: null })
  }
}
