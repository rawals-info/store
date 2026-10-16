import { NextResponse } from "next/server"
import { getActivePromotion } from "@lib/data/promotions"

export const revalidate = 43200 // 12 hours cache - refreshed on each production rebuild

export async function GET() {
  try {
    const promotion = await getActivePromotion()
    return NextResponse.json({ promotion })
  } catch (error) {
    console.error("[GET /api/promotions/active] Error:", error)
    return NextResponse.json({ promotion: null })
  }
}
