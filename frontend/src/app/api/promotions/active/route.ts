import { NextResponse } from "next/server"
import { getActivePromotion } from "@lib/data/promotions"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const promotion = await getActivePromotion()
    return NextResponse.json(
      { promotion },
      {
        headers: {
          "Cache-Control": "public, s-maxage=43200, stale-while-revalidate=86400",
        },
      }
    )
  } catch (error) {
    console.error("[GET /api/promotions/active] Error:", error)
    return NextResponse.json({ promotion: null })
  }
}
