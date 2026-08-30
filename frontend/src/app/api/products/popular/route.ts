import { NextResponse } from "next/server"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"

export const revalidate = 300 // Cache for 5 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number(searchParams.get("limit") || 6)
    const countryCode = searchParams.get("countryCode") || "in"

    const { response } = await listProducts({
      queryParams: { limit },
      countryCode,
    })

    const products = (response?.products || []).map((prod) => {
      const { cheapestPrice, cheapestVariant } = getProductPrice({ product: prod })
      const priceNum = cheapestPrice?.calculated_price_number || Number(cheapestVariant?.calculated_price?.calculated_amount || 0)

      return {
        id: prod.id,
        title: prod.title,
        handle: prod.handle,
        thumbnail: prod.thumbnail,
        price: priceNum,
        priceFormatted: cheapestPrice?.calculated_price || (priceNum > 0 ? `₹${priceNum}` : ""),
        variantId: cheapestVariant?.id || prod.variants?.[0]?.id,
        description: prod.description || "",
      }
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error("[GET /api/products/popular] Error:", error)
    return NextResponse.json({ products: [] })
  }
}
