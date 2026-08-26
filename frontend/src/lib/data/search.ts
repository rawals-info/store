"use server"

import { listProducts } from "./products"
import { getIndiaRegion } from "@lib/constants/india-region"
import { HttpTypes } from "@medusajs/types"
import { cache } from "react"

export const searchProducts = cache(async ({
  query,
  limit = 20,
  offset = 0,
  filter = {},
  countryCode = "in",
}: {
  query: string
  limit?: number
  offset?: number
  filter?: Record<string, any>
  countryCode?: string
}): Promise<{
  products: HttpTypes.StoreProduct[]
  count: number
}> => {
  if (!query || !query.trim()) {
    return { products: [], count: 0 }
  }

  const cleanQuery = query.trim().toLowerCase()
  const region = getIndiaRegion()

  try {
    // 1. Fetch products from Medusa
    const { response } = await listProducts({
      regionId: region.id,
      queryParams: {
        limit: 100,
        ...filter,
      },
    })

    const allProducts = response.products || []

    // 2. Filter locally across title, handle, description, tags, materials, and categories
    const matchingProducts = allProducts.filter((product) => {
      const title = (product.title || "").toLowerCase()
      const handle = (product.handle || "").toLowerCase()
      const description = (product.description || "").toLowerCase()
      const subtitle = (product.subtitle || "").toLowerCase()
      const material = (product.material || "").toLowerCase()
      const tags = (product.tags || []).map((t) => (t.value || "").toLowerCase()).join(" ")
      const categories = (product.categories || []).map((c) => (c.name || "").toLowerCase()).join(" ")

      const searchCorpus = `${title} ${handle} ${description} ${subtitle} ${material} ${tags} ${categories}`

      // Check if all search words match or full query matches
      const words = cleanQuery.split(/\s+/).filter(Boolean)
      return words.every((w) => searchCorpus.includes(w))
    })

    const paginated = matchingProducts.slice(offset, offset + limit)

    return {
      products: paginated,
      count: matchingProducts.length,
    }
  } catch (error) {
    console.error("Search error in searchProducts:", error)
    return { products: [], count: 0 }
  }
})