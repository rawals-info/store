import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"
import { z } from "zod"

export const GetAdminReviewsSchema = createFindParams().merge(
  z.object({
    // Filter by product title (partial match)
    product: z.string().optional(),
    // Filter by review status
    status: z.enum(["pending", "approved", "rejected"]).optional(),
    // Filter by exact product id
    product_id: z.string().optional(),
    // Filter by multiple product ids
    product_ids: z.array(z.string()).optional(),
  })
)

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve("query")

  const { product, status, product_id, product_ids } = (req as any).validatedQuery ?? {}

  // If product name filter is provided, first resolve matching product IDs
  let productIdFilter: Record<string, unknown> | undefined
  if (product && product.length > 0) {
    const { data: matchedProducts } = await query.graph({
      entity: "product",
      fields: ["id"],
      filters: {
        title: { $ilike: `%${product}%` },
      },
      pagination: {
        // cap to a reasonable number to avoid excessive IN lists
        take: 100,
      },
    })

    const productIds = (matchedProducts as Array<{ id: string }>)?.map((p) => p.id) ?? []

    // If no matched products, return empty result early
    if (productIds.length === 0) {
      return res.json({ reviews: [], count: 0, limit: req.queryConfig?.pagination?.take ?? 20, offset: req.queryConfig?.pagination?.skip ?? 0 })
    }

    productIdFilter = { product_id: { $in: productIds } }
  }

  // Build filters object
  const baseFilters = (req as any).queryConfig?.filters || {}
  const filters = {
    ...baseFilters,
    ...(status ? { status } : {}),
    ...(product_id ? { product_id } : {}),
    ...(Array.isArray(product_ids) && product_ids.length ? { product_id: { $in: product_ids } } : {}),
    ...(productIdFilter || {}),
  }

  const { 
    data: reviews, 
    metadata: { count, take, skip } = {
      count: 0,
      take: 20,
      skip: 0,
    },
  } = await query.graph({
    entity: "review",
    fields: (req as any).queryConfig?.fields,
    filters,
    pagination: (req as any).queryConfig?.pagination,
    withDeleted: (req as any).queryConfig?.withDeleted,
  })

  res.json({ 
    reviews,
    count,
    limit: take,
    offset: skip,
  })
}