import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import type {
  INotificationModuleService,
  IOrderModuleService,
} from "@medusajs/framework/types"

import { sendLuxuryEmail, buildLuxuryTemplate } from "../util/email"

/**
 * Notify administrators (email + in-app notification) whenever a customer places an order.
 *
 * Event payload (see OrderWorkflowEvents.PLACED) → `{ id: string }` where `id` is the order ID.
 */
export default async function orderAdminNotify({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger") as any

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL // e.g. support@imperial-craft.com
  if (!ADMIN_EMAIL) {
    logger?.warn?.(
      "ADMIN_EMAIL env var not set – orderAdminNotify will skip sending admin emails."
    )
  }

  try {
    const orderService = container.resolve<IOrderModuleService>(Modules.ORDER)
    const notificationService = container.resolve<INotificationModuleService>(
      Modules.NOTIFICATION
    )

    const order = await orderService.retrieveOrder(event.data.id, {
      relations: ["items", "shipping_address", "billing_address"],
    })

    /* ----------------- 1. Send email to admin ----------------- */
    if (ADMIN_EMAIL) {
      const totalAmount = typeof order.total === "number" ? order.total : Number(order.total ?? 0)
      const totalFormatted = (totalAmount / 100).toFixed(2) +
        " " +
        order.currency_code.toUpperCase()

      const body = `
        <p>A new order has just been placed on Imperial Craft Of India.</p>
        <p><strong>Order #${order.display_id ?? order.id}</strong><br/>
        Total: <strong>${totalFormatted}</strong><br/>
        Customer: ${order.email}</p>
        <p style="text-align:center;margin:32px 0;">
          <a href="${process.env.ADMIN_URL ?? process.env.MEDUSA_BACKEND_URL ?? "http://localhost:9000"}/app/orders/${order.id}" style="background:#D4AF37;color:#ffffff;padding:12px 24px;text-decoration:none;font-weight:600;border-radius:3px;">View Order</a>
        </p>
      `

      await sendLuxuryEmail({
        to: ADMIN_EMAIL,
        subject: `New order #${order.display_id ?? order.id}`,
        html: buildLuxuryTemplate("New Order Placed", body),
      })
    }

    /* ----------------- 2. Create in-app notification ----------------- */
    await notificationService.createNotifications({
      channel: "admin", // logical channel; use plugin/provider for display in admin UI
      to: ADMIN_EMAIL ?? "admin", // who should be notified
      template: "new-order-admin", // arbitrary identifier – we're not using provider templates
      trigger_type: "order.placed",
      resource_id: order.id,
      data: {
        order_id: order.id,
        email: order.email,
        total: order.total,
        currency_code: order.currency_code,
      },
    })
  } catch (err) {
    logger?.error?.("orderAdminNotify subscriber failed", err)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
  context: { subscriberId: "order-admin-notify" },
} 