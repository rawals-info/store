import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getIndiaRegion } from "@lib/constants/india-region"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "../product-preview"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  try {
    // 1. Resolve the shopper's region up-front
    const region = getIndiaRegion()

    if (!region) {
      return null
    }

    // Helper to fetch products with a given filter
    const fetchProducts = async (
      queryParams: Record<string, any>
    ): Promise<HttpTypes.StoreProduct[]> => {
      const { response } = await listProducts({
        queryParams: {
          limit: 8,
          is_giftcard: false,
          ...queryParams,
        } as any,
        regionId: region.id,
      })

      return response.products.filter((p) => p.id !== product.id)
    }

    let suggestions: HttpTypes.StoreProduct[] = []

    // 2. Try by category first
    if (product.categories?.length) {
      const categoryIds = product.categories.map((c) => c.id)
      suggestions = await fetchProducts({ category_id: categoryIds })
    }

    // 3. Fallback to collection
    if (suggestions.length < 4 && product.collection_id) {
      const more = await fetchProducts({ collection_id: [product.collection_id] })
      suggestions = [...suggestions, ...more]
    }

    // 4. Fallback to tags
    if (suggestions.length < 4 && product.tags?.length) {
      const tagIds = product.tags.map((t) => t.id)
      const more = await fetchProducts({ tags: tagIds })
      suggestions = [...suggestions, ...more]
    }

    // 5. As a last resort, fetch latest products
    if (suggestions.length < 4) {
      const more = await fetchProducts({ order: "created_at:desc" })
      suggestions = [...suggestions, ...more]
    }

    // Remove duplicates and limit to 4 items
    const uniqueSuggestions = Array.from(
      new Map(suggestions.map((p) => [p.id, p])).values()
    ).slice(0, 4)

    if (!uniqueSuggestions.length) {
      return null
    }

    return (
      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-4 sm:gap-6">
        {uniqueSuggestions.map((suggested) => (
          <li key={suggested.id}>
            <ProductPreview region={region} product={suggested} />
          </li>
        ))}
      </ul>
    )
  } catch (e) {
    console.error("Error generating related products:", e)
    return null
  }
}
