import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { formatIndianPrice } from "@lib/util/money"
import { BlogProductLink } from "./types"

// Badge map based on handle keywords
const HANDLE_BADGES: Record<string, { badge: string; emoji: string }> = {
  "white-petha": { badge: "Classic Mughal", emoji: "🍬" },
  "kesar-angoori-petha": { badge: "Bestseller", emoji: "🍯" },
  "kesar-dry-petha": { badge: "Saffron Glaze", emoji: "✨" },
  "pan-petha": { badge: "Royal Paan", emoji: "🍃" },
  "chocolate-petha": { badge: "Fusion Treat", emoji: "🍫" },
  "dalmoth": { badge: "Royal Savory", emoji: "🥨" },
  "masala-peanuts": { badge: "Tea Partner", emoji: "🥜" },
  "lal-petha": { badge: "Heritage Sweet", emoji: "🔴" },
}

/**
 * Resolves live product details (real prices, live Cloudinary thumbnails, titles)
 * from Medusa backend using cached Next.js ISR tags.
 * When a price or thumbnail is updated in Medusa, your webhook revalidates tag "products"
 * and updates all blog pages automatically.
 */
export async function getLiveBlogProducts(
  handles: string[] = [],
  countryCode: string = "in"
): Promise<BlogProductLink[]> {
  if (!handles || handles.length === 0) return []

  try {
    const { response } = await listProducts({
      queryParams: {
        handle: handles,
        limit: Math.max(handles.length, 10),
      } as any,
      countryCode,
    })

    const foundProducts = response?.products || []
    if (foundProducts.length === 0) return []

    const productMap = new Map<string, any>()
    for (const prod of foundProducts) {
      if (prod.handle) {
        productMap.set(prod.handle, prod)
      }
    }

    // Map according to requested order
    const result: BlogProductLink[] = []
    for (const handle of handles) {
      const prod = productMap.get(handle)
      if (prod) {
        const { cheapestPrice, cheapestVariant } = getProductPrice({ product: prod })
        const priceNum =
          cheapestPrice?.calculated_price_number ||
          Number(cheapestVariant?.calculated_price?.calculated_amount || 0)

        const meta = HANDLE_BADGES[handle] || { badge: "Fresh From Agra", emoji: "🍬" }

        result.push({
          name: prod.title,
          handle: prod.handle,
          price: priceNum > 0 ? `₹${formatIndianPrice(priceNum)}` : "Check Price",
          thumbnail: prod.thumbnail,
          description: prod.description || "Handcrafted fresh in Agra with pure ash gourd",
          emoji: meta.emoji,
          badge: meta.badge,
        })
      }
    }

    return result
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[getLiveBlogProducts] Falling back to default data:", error)
    }
    return []
  }
}
