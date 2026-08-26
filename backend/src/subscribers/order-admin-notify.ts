import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import type {
  INotificationModuleService,
  IOrderModuleService,
} from "@medusajs/framework/types"

import {
  sendLuxuryEmail,
  buildLuxuryTemplate,
  buildHeroStatusCard,
  buildParagraph,
  buildStrong,
  buildSignOff,
} from "../util/email"

/**
 * Notify administrators whenever a customer places a new order.
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

    let order: any = null
    const maxAttempts = 6
    const delays = [0, 5000, 10000, 15000, 20000, 25000]

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        if (delays[attempt] > 0) {
          await new Promise((resolve) =>
            setTimeout(
              resolve,
              delays[attempt] - (attempt > 0 ? delays[attempt - 1] : 0)
            )
          )
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
            "display_id",
            "created_at",
          ],
          relations: ["items", "shipping_address", "billing_address"],
        })
        break
      } catch (error) {
        if (attempt === maxAttempts - 1) throw error
      }
    }

    if (!order) return

    const asNumber = (val: any): number => {
      if (val == null) return 0
      if (typeof val === "number") return val
      if (typeof val === "string") return parseFloat(val)
      if (typeof val.toNumber === "function") return val.toNumber()
      if (typeof val.value !== "undefined") return Number(val.value)
      return Number(val)
    }

    const fmt = (amt: number) =>
      Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: order.currency_code?.toUpperCase?.() ?? "INR",
      }).format(amt)

    const items: any[] = Array.isArray(order.items) ? order.items : []
    const displayId = order.display_id ? `${order.display_id}` : order.id

    const itemsHtml = items
      .map((it: any, index: number) => {
        const lineTotal = asNumber(it.total ?? it.unit_price * it.quantity)
        const variantInfo = it.variant_title || it.variant_sku || ""
        const variantDisplay =
          variantInfo && variantInfo !== "Default variant" && variantInfo !== it.title
            ? `<div style="font-size: 11px; color: #64748B;">Pack: <strong>${variantInfo}</strong></div>`
            : ""
        const isLast = index === items.length - 1

        return `
          <tr>
            <td style="padding: 12px 16px; ${isLast ? "" : "border-bottom: 1px solid #EAE3D9;"}">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="36" valign="top">
                    <div style="width: 32px; height: 32px; border-radius: 8px; background-color: #FEF3C7; text-align: center; line-height: 32px; font-size: 16px;">
                      🍬
                    </div>
                  </td>
                  <td style="padding-left: 10px;">
                    <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 16px; font-weight: 700; color: #0F172A;">
                      ${it.title}
                    </div>
                    ${variantDisplay}
                    <div style="font-size: 11px; color: #64748B;">Qty: <strong>${it.quantity}</strong></div>
                  </td>
                  <td align="right" valign="top">
                    <div style="font-family: monospace; font-size: 14px; font-weight: 700; color: #0F172A;">
                      ${fmt(lineTotal)}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`
      })
      .join("")

    const addr = order.shipping_address || {}
    const addressText = [
      [addr.first_name, addr.last_name].filter(Boolean).join(" "),
      addr.address_1,
      addr.address_2,
      `${addr.city ?? ""} ${addr.postal_code ?? ""}`.trim(),
      addr.country_code ? addr.country_code.toUpperCase() : undefined,
      addr.phone ? `📞 Phone: ${addr.phone}` : undefined,
      order.email ? `✉️ Email: ${order.email}` : undefined,
    ]
      .filter(Boolean)
      .join("<br>")

    const grandTotal = asNumber(order.total)

    if (ADMIN_EMAIL) {
      const body = `
        ${buildHeroStatusCard({
          icon: "🔔",
          title: "New Customer Order Received!",
          subtitle: `A new order has been placed on the storefront and is ready for dispatch preparation.`,
          orderId: displayId,
          badgeText: `💰 ${fmt(grandTotal)} Paid`,
        })}

        <!-- Order Items Breakdown -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 10px;">
          <tr>
            <td>
              <h3 style="margin: 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18px; font-weight: 700; color: #0F172A; text-transform: uppercase; letter-spacing: 1px;">
                Items to Pack
              </h3>
            </td>
          </tr>
        </table>

        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background: #FAF8F5; border-radius: 16px; border: 1px solid #EFE8DE; overflow: hidden; margin-bottom: 18px;">
          ${itemsHtml}
        </table>

        <!-- Customer & Delivery Address Card -->
        <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 18px 20px; margin-bottom: 18px;">
          <div style="font-size: 10px; font-weight: 800; color: #92400E; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
            📍 Customer &amp; Shipping Details
          </div>
          <div style="font-size: 13px; color: #1E293B; line-height: 1.6;">
            ${addressText}
          </div>
        </div>

        <div style="text-align: center; margin: 24px 0;">
          <a href="${process.env.ADMIN_URL ?? "http://localhost:9000"}/app/orders" class="cta-button">
            Open Order in Medusa Admin ➔
          </a>
        </div>

        ${buildSignOff("Taj Petha Store Admin")}
      `

      await sendLuxuryEmail({
        to: ADMIN_EMAIL,
        subject: `🔔 New Order #${displayId} Received (${fmt(grandTotal)}) - Taj Petha`,
        html: buildLuxuryTemplate("New Order Received", body, "Store Admin Notification"),
      })
    }

    if (notificationService) {
      await notificationService.createNotifications({
        to: ADMIN_EMAIL ?? "admin",
        channel: "feed",
        template: "admin-order-placed",
        data: {
          order_id: order.id,
          display_id: order.display_id,
          total: order.total,
          currency_code: order.currency_code,
          customer_email: order.email,
        },
      })
    }
  } catch (error) {
    logger?.error?.(
      `[AdminNotify] Failed to send notification for order ${event.data.id}:`,
      error
    )
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
  context: { subscriberId: "order-admin-notify" },
}