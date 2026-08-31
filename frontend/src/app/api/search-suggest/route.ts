import { NextResponse } from "next/server"
import { searchProducts } from "@lib/data/search"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") ?? ""
  const countryCode = searchParams.get("countryCode") ?? "us"

  if (!q.trim()) {
    return NextResponse.json({ products: [] })
  }

  try {
    const { products } = await searchProducts({
      query: q,
      limit: 5,
      offset: 0,
      filter: {},
      countryCode,
    })

    return NextResponse.json({ products })
  } catch (e) {
    console.error("Error in search-suggest route", e)
    return NextResponse.json({ products: [] }, { status: 500 })
  }
} 