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

    console.info("[AdminEmail] order totals", {
      subtotal: order.subtotal,
      shipping_total: order.shipping_total,
      tax_total: order.tax_total,
      total: order.total,
    })

    /* ----------------- 1. Send email to admin ----------------- */
    if (ADMIN_EMAIL) {
      const fmt = (amt: number) =>
        Intl.NumberFormat("en-US", {
          style: "currency",
          currency: order.currency_code.toUpperCase(),
        }).format(amt)

      const items: any[] = Array.isArray(order.items) ? order.items : []
      const itemsHtml = items
        .map(
          (it: any) =>
            `<tr><td>${it.title}</td><td style="text-align:center">${it.quantity}</td><td style="text-align:right">${fmt(Number(it.total ?? it.unit_price * it.quantity))}</td></tr>`
        )
        .join("")

      const addressLines = (addr: any) =>
        [
          [addr.first_name, addr.last_name].filter(Boolean).join(" "),
          addr.address_1,
          addr.address_2,
          `${addr.postal_code ?? ""} ${addr.city ?? ""}`.trim(),
          addr.country_code ? addr.country_code.toUpperCase() : undefined,
          addr.phone,
        ]
          .filter(Boolean)
          .map((l) => `<div>${l}</div>`) // wrap each line
          .join("")

      const body = `
        <p><strong>Order #${order.display_id ?? order.id}</strong> has been placed.</p>

        <table width="100%" cellpadding="6" style="border-collapse:collapse;font-size:14px;margin-top:16px">
          <thead><tr><th align="left">Item</th><th align="center">Qty</th><th align="right">Total</th></tr></thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <p style="margin-top:16px"><strong>Subtotal:</strong> ${fmt(Number(order.subtotal ?? 0))}</p>
        <p><strong>Shipping:</strong> ${fmt(Number(order.shipping_total ?? 0))}</p>
        <p><strong>Tax:</strong> ${fmt(Number(order.tax_total ?? 0))}</p>
        ${order.discount_total ? `<p><strong>Discount:</strong> -${fmt(Number(order.discount_total))}</p>` : ""}
        <p><strong>Grand Total:</strong> ${fmt(Number(order.total ?? 0))}</p>

        <h3 style="margin-top:24px">Customer Details</h3>
        <p><strong>Email:</strong> ${order.email}</p>
        <h4>Shipping Address</h4>
        ${addressLines(order.shipping_address ?? {})}
        <h4 style="margin-top:12px">Billing Address</h4>
        ${addressLines(order.billing_address ?? {})}

        <p style="text-align:center;margin:32px 0;">
          <a href="${
            process.env.ADMIN_URL ?? process.env.MEDUSA_BACKEND_URL ?? "http://localhost:9000"
          }/app/orders/${
        order.id
          }" style="background:#D4AF37;color:#ffffff;padding:12px 24px;text-decoration:none;font-weight:600;border-radius:3px;">View Order in Admin</a>
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