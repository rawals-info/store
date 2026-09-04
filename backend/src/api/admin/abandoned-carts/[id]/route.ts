import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve("query")
  const { id } = req.params

  const { data: carts } = await query.graph({
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
      "shipping_address.address_1",
      "shipping_address.address_2",
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
      "shipping_methods.id",
      "shipping_methods.name",
      "shipping_methods.amount",
    ],
    filters: { id },
  })

  const cart = carts?.[0]
  if (!cart) {
    return res.status(404).json({ message: `Cart with id ${id} was not found` })
  }

  const items = cart.items || []
  const subtotal = items.reduce((sum: number, item: any) => {
    const price = typeof item.unit_price === "string" ? parseFloat(item.unit_price) : (item.unit_price || 0)
    return sum + price * (item.quantity || 1)
  }, 0)

  const shippingTotal = (cart.shipping_methods || []).reduce((sum: number, sm: any) => {
    const amount = typeof sm.amount === "string" ? parseFloat(sm.amount) : (sm.amount || 0)
    return sum + amount
  }, 0)

  const total = subtotal + shippingTotal

  const isLocalhost =
    req.headers.host?.includes("localhost") ||
    Boolean(req.headers.referer && req.headers.referer.includes("localhost"))
  const storefrontUrls = (process.env.STOREFRONT_URL || "")
    .split(",")
    .map((u) => u.trim().replace(/\/$/, ""))
  let storefrontBase = "https://tajpetha.in"
  if (isLocalhost) {
    const localUrl = storefrontUrls.find((u) => u.includes("localhost")) || "http://localhost:8000"
    storefrontBase = localUrl
  } else {
    storefrontBase = storefrontUrls[0] || "https://tajpetha.in"
  }
  const recoveryUrl = `${storefrontBase}/cart?cart_id=${cart.id}`

  const customerName =
    cart.customer?.first_name || cart.shipping_address?.first_name
      ? `${cart.customer?.first_name || cart.shipping_address?.first_name || ""} ${cart.customer?.last_name || cart.shipping_address?.last_name || ""}`.trim()
      : null

  res.json({
    abandoned_cart: {
      ...cart,
      subtotal,
      shipping_total: shippingTotal,
      total,
      customer_name: customerName,
      recovery_url: recoveryUrl,
      is_notified: Boolean(cart.metadata?.abandoned_notified_at),
      notification_count: Number(cart.metadata?.abandoned_notification_count || 0),
      last_notified_at: cart.metadata?.abandoned_notified_at || null,
      notification_history: cart.metadata?.abandoned_notifications || [],
    },
  })
}
