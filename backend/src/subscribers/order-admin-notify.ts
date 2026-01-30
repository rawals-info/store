import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import type {
  INotificationModuleService,
  IOrderModuleService,
} from "@medusajs/framework/types"

import {
  sendLuxuryEmail,
  buildLuxuryTemplate,
  buildOrderDetailsBox,
  buildSectionHeading,
  buildParagraph,
  buildStrong,
  buildButton
} from "../util/email"

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

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL
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

    // Smart retry strategy: Try immediately, then retry up to 5 times over 30 seconds
    let order: any = null
    const maxAttempts = 6
    const delays = [0, 5000, 10000, 15000, 20000, 25000]

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        if (delays[attempt] > 0) {
          logger?.info?.(`[AdminNotify] Retry ${attempt}/${maxAttempts - 1} after ${delays[attempt] / 1000}s for order ${event.data.id}`)
          await new Promise(resolve => setTimeout(resolve, delays[attempt] - (attempt > 0 ? delays[attempt - 1] : 0)))
        } else {
          logger?.info?.(`[AdminNotify] Attempting immediate retrieval for order ${event.data.id}`)
        }

        order = await orderService.retrieveOrder(event.data.id, {
          select: [
            "subtotal",
            "shipping_total",
            "tax_total",
            "discount_total",
            "total",
            "currency_code",
            "email",
          ],
          relations: ["items", "shipping_address", "billing_address"],
        }) as any

        logger?.info?.(`[AdminNotify] Order ${event.data.id} retrieved successfully after ${attempt + 1} attempt(s)`)
        break

      } catch (error) {
        if (attempt === maxAttempts - 1) {
          logger?.error?.(`[AdminNotify] Failed to retrieve order ${event.data.id} after ${maxAttempts} attempts`)
          throw error
        }
      }
    }

    if (!order) {
      logger?.error?.(`[AdminNotify] Order ${event.data.id} not found after all retries`)
      return
    }

    const asNumber = (val: any): number => {
      if (val == null) return 0
      if (typeof val === "number") return val
      if (typeof val === "string") return parseFloat(val)
      if (typeof val.toNumber === "function") return val.toNumber()
      if (typeof val.value !== "undefined") return Number(val.value)
      return Number(val)
    }

    console.info("[AdminEmail] order totals", {
      subtotal: order.subtotal,
      shipping_total: order.shipping_total,
      tax_total: order.tax_total,
      total: order.total,
    })

    /* ----------------- 1. Send email to admin ----------------- */
    if (ADMIN_EMAIL) {
      const fmt = (amt: number) =>
        Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: order.currency_code.toUpperCase(),
        }).format(amt)

      const items: any[] = Array.isArray(order.items) ? order.items : []
      const itemsHtml = items
        .map((it: any) => {
          const lineTotal = asNumber(it.total ?? it.unit_price * it.quantity)
          // Get variant info
          const variantInfo = it.variant_title || it.variant_sku || ""
          const variantDisplay = variantInfo && variantInfo !== "Default variant" && variantInfo !== it.title
            ? `<div style="font-size: 11px; color: #8A8A8A; margin-top: 2px;">${variantInfo}</div>`
            : ""
          return `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #F0EDE8; font-size: 14px; color: #2C2C2C;">
                ${it.title}${variantDisplay}
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #F0EDE8; font-size: 14px; color: #2C2C2C; text-align: center;">${it.quantity}</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #F0EDE8; font-size: 14px; color: #2C2C2C; text-align: right;">${fmt(lineTotal)}</td>
            </tr>`
        })
        .join("")

      const addressLines = (addr: any) =>
        [
          [addr.first_name, addr.last_name].filter(Boolean).join(" "),
          addr.address_1,
          addr.address_2,
          `${addr.city ?? ""} ${addr.postal_code ?? ""}`.trim(),
          addr.country_code ? addr.country_code.toUpperCase() : undefined,
          addr.phone,
        ]
          .filter(Boolean)
          .map((l) => `<div style="font-size: 14px; color: #4A4A4A;">${l}</div>`)
          .join("")

      const body = `
        ${buildParagraph(`A new order ${buildStrong("#" + (order.display_id ?? order.id))} has been placed.`)}

        ${buildOrderDetailsBox(`
          <h2 style="font-family: 'Georgia', serif; font-size: 14px; font-weight: 400; color: #1A1A1A; margin: 0 0 24px 0; letter-spacing: 2px; text-transform: uppercase;">Order Details</h2>
          
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
            <thead>
              <tr>
                <th style="text-align: left; padding: 12px 0; border-bottom: 1px solid #E8E4DC; font-size: 12px; color: #8A8A8A; letter-spacing: 1px; text-transform: uppercase;">Item</th>
                <th style="text-align: center; padding: 12px 0; border-bottom: 1px solid #E8E4DC; font-size: 12px; color: #8A8A8A; letter-spacing: 1px; text-transform: uppercase;">Qty</th>
                <th style="text-align: right; padding: 12px 0; border-bottom: 1px solid #E8E4DC; font-size: 12px; color: #8A8A8A; letter-spacing: 1px; text-transform: uppercase;">Amount</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #E8E4DC;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 14px; color: #6A6A6A;">Subtotal</span>
              <span style="font-size: 14px; color: #2C2C2C;">${fmt(asNumber(order.subtotal))}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 14px; color: #6A6A6A;">Shipping</span>
              <span style="font-size: 14px; color: #2C2C2C;">${fmt(asNumber(order.shipping_total))}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 14px; color: #6A6A6A;">Tax</span>
              <span style="font-size: 14px; color: #2C2C2C;">${fmt(asNumber(order.tax_total))}</span>
            </div>
            ${order.discount_total ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 14px; color: #6A6A6A;">Discount</span>
              <span style="font-size: 14px; color: #C9A962;">-${fmt(asNumber(order.discount_total))}</span>
            </div>` : ""}
            <div style="display: flex; justify-content: space-between; margin-top: 16px; padding-top: 16px; border-top: 1px solid #C9A962;">
              <span style="font-family: 'Georgia', serif; font-size: 16px; color: #1A1A1A;">Total</span>
              <span style="font-family: 'Georgia', serif; font-size: 18px; color: #1A1A1A; font-weight: 600;">${fmt(asNumber(order.total))}</span>
            </div>
          </div>
        `)}

        ${buildSectionHeading("Customer Details")}
        ${buildParagraph(`${buildStrong("Email:")} ${order.email}`)}
        
        ${buildSectionHeading("Shipping Address")}
        ${addressLines(order.shipping_address ?? {})}
        
        ${buildSectionHeading("Billing Address")}
        ${addressLines(order.billing_address ?? {})}

        ${buildButton(
        `${process.env.ADMIN_URL ?? process.env.MEDUSA_BACKEND_URL ?? "http://localhost:9000"}/app/orders/${order.id}`,
        "View Order in Admin"
      )}
      `

      await sendLuxuryEmail({
        to: ADMIN_EMAIL,
        subject: `New Order #${order.display_id ?? order.id}`,
        html: buildLuxuryTemplate("New Order Received", body),
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