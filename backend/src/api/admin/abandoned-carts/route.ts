import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"
import { z } from "zod"

export const GetAdminAbandonedCartsSchema = createFindParams().merge(
  z.object({
    // Search query (email, name, or phone)
    q: z.string().optional(),
    // Filter by notification status
    status: z.enum(["all", "notified", "not_notified"]).optional().default("all"),
    // Filter by whether cart has customer email
    has_email: z.enum(["all", "true", "false"]).optional().default("all"),
    // Inactivity threshold in hours (e.g. 1, 6, 24, 72)
    hours_ago: z.coerce.number().optional().default(1),
    // Order field
    order: z.string().optional().default("-updated_at"),
  })
)

export type GetAdminAbandonedCartsQuery = z.infer<typeof GetAdminAbandonedCartsSchema>

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve("query")
  const validatedQuery = ((req as any).validatedQuery || {}) as GetAdminAbandonedCartsQuery

  const {
    q,
    status = "all",
    has_email = "all",
    hours_ago = 1,
  } = validatedQuery

  const take = req.queryConfig?.pagination?.take ?? 50
  const skip = req.queryConfig?.pagination?.skip ?? 0

  // Calculate cutoff date: carts updated before this threshold are considered abandoned
  const cutoffDate = new Date()
  cutoffDate.setHours(cutoffDate.getHours() - (hours_ago || 1))

  // Base filters for query.graph
  const filters: Record<string, any> = {
    completed_at: null,
    updated_at: {
      $lt: cutoffDate,
    },
  }

  // Handle has_email filter
  if (has_email === "true") {
    filters.email = { $ne: null }
  } else if (has_email === "false") {
    filters.email = null
  }

  // Fetch carts matching criteria
  // We request cart items, customer details, and shipping address
  const { data: rawCarts } = await query.graph({
    entity: "cart",
    fields: [
      "id",
      "email",
      "currency_code",
      "created_at",
      "updated_at",
      "completed_at",
      "metadata",
      "customer.id",
      "customer.email",
      "customer.first_name",
      "customer.last_name",
      "customer.phone",
      "shipping_address.first_name",
      "shipping_address.last_name",
      "shipping_address.phone",
      "shipping_address.city",
      "shipping_address.province",
      "shipping_address.postal_code",
      "shipping_address.country_code",
      "items.id",
      "items.title",
      "items.subtitle",
      "items.thumbnail",
      "items.quantity",
      "items.unit_price",
      "items.variant_title",
      "items.product_id",
    ],
    filters,
    pagination: {
      take: 500, // Fetch broader set to filter items & compute accurate stats
      skip: 0,
      order: { updated_at: "DESC" },
    },
  })

  // Filter only carts that have at least 1 line item
  let validAbandonedCarts = (rawCarts || []).filter(
    (cart: any) => Array.isArray(cart.items) && cart.items.length > 0
  )

  // Apply search query filter if provided
  if (q && q.trim().length > 0) {
    const searchLower = q.trim().toLowerCase()
    validAbandonedCarts = validAbandonedCarts.filter((cart: any) => {
      const email = cart.email?.toLowerCase() || ""
      const custFirst = cart.customer?.first_name?.toLowerCase() || ""
      const custLast = cart.customer?.last_name?.toLowerCase() || ""
      const shipFirst = cart.shipping_address?.first_name?.toLowerCase() || ""
      const shipLast = cart.shipping_address?.last_name?.toLowerCase() || ""
      const phone = cart.shipping_address?.phone || cart.customer?.phone || ""
      const cartId = cart.id?.toLowerCase() || ""

      return (
        email.includes(searchLower) ||
        custFirst.includes(searchLower) ||
        custLast.includes(searchLower) ||
        shipFirst.includes(searchLower) ||
        shipLast.includes(searchLower) ||
        phone.includes(searchLower) ||
        cartId.includes(searchLower)
      )
    })
  }

  // Enrich each cart with computed fields
  const enrichedCarts = validAbandonedCarts.map((cart: any) => {
    const items = cart.items || []
    const total = items.reduce((sum: number, item: any) => {
      const price = typeof item.unit_price === "string" ? parseFloat(item.unit_price) : (item.unit_price || 0)
      return sum + price * (item.quantity || 1)
    }, 0)

    const itemCount = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0)

    const notifiedAt = cart.metadata?.abandoned_notified_at
    const notificationCount = Number(cart.metadata?.abandoned_notification_count || 0)
    const isNotified = Boolean(notifiedAt || notificationCount > 0)

    const customerName =
      cart.customer?.first_name || cart.shipping_address?.first_name
        ? `${cart.customer?.first_name || cart.shipping_address?.first_name || ""} ${cart.customer?.last_name || cart.shipping_address?.last_name || ""}`.trim()
        : null

    return {
      ...cart,
      total,
      item_count: itemCount,
      customer_name: customerName,
      is_notified: isNotified,
      notification_status: isNotified ? "notified" : "not_notified",
      last_notified_at: notifiedAt || null,
      notification_count: notificationCount,
    }
  })

  // Apply notification status filter if requested
  let filteredCarts = enrichedCarts
  if (status === "notified") {
    filteredCarts = enrichedCarts.filter((c: any) => c.is_notified)
  } else if (status === "not_notified") {
    filteredCarts = enrichedCarts.filter((c: any) => !c.is_notified)
  }

  // Calculate overall statistics across all valid abandoned carts
  const statistics = {
    total_abandoned_carts: enrichedCarts.length,
    recoverable_carts: enrichedCarts.filter((c: any) => Boolean(c.email)).length,
    notified_carts: enrichedCarts.filter((c: any) => c.is_notified).length,
    total_abandoned_value: enrichedCarts.reduce((sum: number, c: any) => sum + (c.total || 0), 0),
    recoverable_value: enrichedCarts
      .filter((c: any) => Boolean(c.email))
      .reduce((sum: number, c: any) => sum + (c.total || 0), 0),
  }

  // Paginate filtered results
  const paginatedCarts = filteredCarts.slice(skip, skip + take)

  res.json({
    abandoned_carts: paginatedCarts,
    count: filteredCarts.length,
    statistics,
    limit: take,
    offset: skip,
  })
}
