import { MedusaContainer } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { sendAbandonedCartRecoveryEmail } from "../util/abandoned-cart-email"

export default async function abandonedCartJob(container: MedusaContainer) {
  const logger = container.resolve("logger")
  const query = container.resolve("query")
  const cartModuleService = container.resolve(Modules.CART)

  // Only run automatic dispatch if enabled in environment
  const isEnabled = process.env.ENABLE_ABANDONED_CART_AUTOMATION === "true"
  if (!isEnabled) {
    logger.debug(
      "[abandonedCartJob] Automatic abandoned cart notifications are disabled (set ENABLE_ABANDONED_CART_AUTOMATION=true to enable)."
    )
    return
  }

  logger.info("[abandonedCartJob] Checking for abandoned carts older than 24 hours...")

  const oneDayAgo = new Date()
  oneDayAgo.setDate(oneDayAgo.getDate() - 1)

  const limit = 50
  let offset = 0
  let totalCount = 0
  let sentCount = 0

  do {
    const { data: rawCarts, metadata } = await query.graph({
      entity: "cart",
      fields: [
        "id",
        "email",
        "currency_code",
        "completed_at",
        "metadata",
        "customer.first_name",
        "customer.last_name",
        "shipping_address.first_name",
        "shipping_address.last_name",
        "items.id",
        "items.title",
        "items.thumbnail",
        "items.quantity",
        "items.unit_price",
        "items.variant_title",
      ],
      filters: {
        updated_at: {
          $lt: oneDayAgo,
        },
        email: {
          $ne: null,
        },
        completed_at: null,
      },
      pagination: {
        skip: offset,
        take: limit,
      },
    })

    totalCount = metadata?.count ?? 0

    // Filter carts that have items and have not yet received an automated notification
    const eligibleCarts = (rawCarts || []).filter(
      (c: any) =>
        Array.isArray(c.items) &&
        c.items.length > 0 &&
        !c.metadata?.abandoned_notified_at
    )

    for (const cart of eligibleCarts) {
      try {
        const customerName =
          cart.customer?.first_name || cart.shipping_address?.first_name
            ? `${cart.customer?.first_name || cart.shipping_address?.first_name || ""} ${cart.customer?.last_name || cart.shipping_address?.last_name || ""}`.trim()
            : undefined

        if (!cart.email) continue

        await sendAbandonedCartRecoveryEmail({
          to: cart.email,
          customerName,
          cartId: cart.id,
          items: cart.items.map((item: any) => ({
            title: item.title,
            thumbnail: item.thumbnail,
            quantity: item.quantity,
            unit_price: item.unit_price,
            variant_title: item.variant_title,
          })),
          currencyCode: cart.currency_code || "inr",
        })

        const nowIso = new Date().toISOString()
        await cartModuleService.updateCarts(cart.id, {
          metadata: {
            ...(cart.metadata || {}),
            abandoned_notified_at: nowIso,
            abandoned_notification_count: 1,
            abandoned_notifications: [
              {
                sent_at: nowIso,
                recipient: cart.email,
                subject: "Did you leave something sweet behind? 🍯 - Taj Petha",
                automated: true,
                success: true,
              },
            ],
          },
        })

        sentCount++
      } catch (err: any) {
        logger.error(
          `[abandonedCartJob] Failed to send automated notification for cart ${cart.id}: ${err.message}`
        )
      }
    }

    offset += limit
  } while (offset < totalCount)

  logger.info(`[abandonedCartJob] Completed: Sent ${sentCount} recovery notifications.`)
}

export const config = {
  name: "abandoned-cart-notification",
  // Run daily at 10:00 AM server time
  schedule: process.env.ABANDONED_CART_CRON_SCHEDULE || "0 10 * * *",
}
