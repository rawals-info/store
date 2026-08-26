// @ts-ignore – types provided by Medusa at runtime
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import {
  sendLuxuryEmail,
  buildLuxuryTemplate,
  buildHeroStatusCard,
  buildOrderDetailsBox,
  buildInfoBox,
  buildSectionHeading,
  buildParagraph,
  buildStrong,
  buildLink,
  buildSignOff,
  buildButton,
} from "../util/email"
import { Modules } from "@medusajs/framework/utils"
import type { IOrderModuleService } from "@medusajs/framework/types"

/**
 * Sends an order confirmation email to the customer for their Taj Petha order.
 */
export default async function orderConfirmationEmail({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const { id: orderId } = event.data

  const orderService = container.resolve<IOrderModuleService>(Modules.ORDER)

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

      order = await orderService.retrieveOrder(orderId, {
        select: [
          "subtotal",
          "shipping_total",
          "tax_total",
          "discount_total",
          "total",
          "currency_code",
          "email",
          "display_id",
        ],
        relations: ["items", "shipping_address", "billing_address"],
      })
      break
    } catch (error) {
      if (attempt === maxAttempts - 1) {
        console.error(
          `[OrderConfirmationEmail] Failed to retrieve order ${orderId} after ${maxAttempts} attempts`
        )
        throw error
      }
    }
  }

  if (!order) {
    console.error(`[OrderConfirmationEmail] Order ${orderId} not found`)
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

  const fmt = (amt: number) =>
    Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: order.currency_code?.toUpperCase?.() ?? "INR",
    }).format(amt)

  const items: any[] = Array.isArray(order.items) ? order.items : []
  const customerName =
    order.shipping_address?.first_name ||
    order.email?.split("@")[0] ||
    "Valued Customer"
  const displayId = order.display_id ? `${order.display_id}` : orderId

  // Build items table with variant information
  const itemsHtml = items
    .map((it: any, index: number) => {
      const lineTotal = asNumber(it.total ?? it.unit_price * it.quantity)
      const variantInfo = it.variant_title || it.variant_sku || ""
      const variantDisplay =
        variantInfo && variantInfo !== "Default variant" && variantInfo !== it.title
          ? `<div style="font-size: 11px; color: #64748B; margin-top: 2px;">Pack: <strong>${variantInfo}</strong></div>`
          : ""
      const isLast = index === items.length - 1

      return `
        <tr>
          <td style="padding: 14px 16px; ${isLast ? "" : "border-bottom: 1px solid #EAE3D9;"}">
            <table width="100%" border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td width="36" valign="top">
                  <div style="width: 34px; height: 34px; border-radius: 8px; background-color: #FEF3C7; text-align: center; line-height: 34px; font-size: 17px;">
                    🍬
                  </div>
                </td>
                <td style="padding-left: 10px;" valign="top">
                  <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 16px; font-weight: 700; color: #0F172A;">
                    ${it.title}
                  </div>
                  ${variantDisplay}
                  <div style="font-size: 11px; color: #64748B; margin-top: 1px;">Qty: <strong>${it.quantity}</strong></div>
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
    addr.phone ? `📞 ${addr.phone}` : undefined,
  ]
    .filter(Boolean)
    .join("<br>")

  const subtotal = asNumber(order.subtotal)
  const shippingTotal = asNumber(order.shipping_total)
  const discountTotal = asNumber(order.discount_total)
  const taxTotal = asNumber(order.tax_total)
  const grandTotal = asNumber(order.total)

  const body = `
    ${buildHeroStatusCard({
      icon: "✨",
      title: "Order Confirmed & In Preparation!",
      subtitle: `Thank you, ${customerName}. Our Agra halwais are preparing your fresh batch now.`,
      orderId: displayId,
      badgeText: "⚡ 24–48h Air Express",
    })}

    <!-- Section Header -->
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 10px;">
      <tr>
        <td>
          <h3 style="margin: 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 19px; font-weight: 700; color: #0F172A; text-transform: uppercase; letter-spacing: 1px;">
            Artisanal Sweets in Order
          </h3>
        </td>
        <td align="right">
          <span style="font-size: 11px; color: #059669; font-weight: 700; background: #ECFDF5; padding: 3px 8px; border-radius: 6px;">
            Vacuum Freshness Sealed
          </span>
        </td>
      </tr>
    </table>

    <!-- Items Table -->
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background: #FAF8F5; border-radius: 16px; border: 1px solid #EFE8DE; overflow: hidden; margin-bottom: 18px;">
      ${itemsHtml}
    </table>

    <!-- Totals Card -->
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; padding: 16px 18px; margin-bottom: 18px;">
      <tr>
        <td>
          <table width="100%" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding: 4px 0; font-size: 13px; color: #64748B;">Items Subtotal</td>
              <td align="right" style="padding: 4px 0; font-family: monospace; font-size: 13px; color: #1E293B;">${fmt(subtotal)}</td>
            </tr>
            ${
              discountTotal > 0
                ? `<tr>
                    <td style="padding: 4px 0; font-size: 13px; color: #059669; font-weight: 600;">Promo Discount</td>
                    <td align="right" style="padding: 4px 0; font-family: monospace; font-size: 13px; color: #059669; font-weight: 600;">-${fmt(discountTotal)}</td>
                  </tr>`
                : ""
            }
            <tr>
              <td style="padding: 4px 0; font-size: 13px; color: #64748B;">Express Delivery</td>
              <td align="right" style="padding: 4px 0; font-family: monospace; font-size: 13px; color: #1E293B;">
                ${shippingTotal === 0 ? `<span style="color: #059669; font-weight: 700; background: #ECFDF5; padding: 2px 6px; border-radius: 4px;">FREE</span>` : fmt(shippingTotal)}
              </td>
            </tr>
            ${
              taxTotal > 0
                ? `<tr>
                    <td style="padding: 4px 0; font-size: 13px; color: #64748B;">Taxes (GST Inc.)</td>
                    <td align="right" style="padding: 4px 0; font-family: monospace; font-size: 13px; color: #1E293B;">${fmt(taxTotal)}</td>
                  </tr>`
                : ""
            }
            <tr>
              <td colspan="2" style="padding: 12px 0 0 0; border-top: 2px solid #0F172A;">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18px; font-weight: 700; color: #0F172A;">
                      Total Paid:
                    </td>
                    <td align="right" style="font-family: monospace; font-size: 20px; font-weight: 800; color: #D97706;">
                      ${fmt(grandTotal)}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- 2-Column Section: Delivery Address & Freshness Promise -->
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top: 14px;">
      <tr>
        <td class="two-col" width="48%" valign="top" style="background: #FAF8F5; border: 1px solid #EFE8DE; border-radius: 16px; padding: 16px 18px;">
          <div style="font-size: 10px; font-weight: 800; color: #92400E; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
            📍 Delivering To
          </div>
          <div style="font-size: 12px; color: #334155; line-height: 1.6;">
            ${addressText || "Address on File"}
          </div>
        </td>
        
        <td width="4%" class="two-col" height="12">&nbsp;</td>

        <td class="two-col" width="48%" valign="top" style="background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 16px; padding: 16px 18px;">
          <div style="font-size: 10px; font-weight: 800; color: #065F46; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
            🛡️ Freshness Guarantee
          </div>
          <div style="font-size: 12px; color: #047857; line-height: 1.5;">
            &bull; Prepared fresh in Agra on order day<br>
            &bull; 100% Safe Transit Guarantee<br>
            &bull; Sealed vacuum freshness
          </div>
        </td>
      </tr>
    </table>

    <!-- WhatsApp Support Link -->
    <div style="margin-top: 22px; text-align: center;">
      <a href="https://wa.me/919876543210?text=Hi%20Taj%20Petha,%20I%20have%20a%20question%20about%20order%20${displayId}" class="whatsapp-button">
        💬 Have a Question? Chat on WhatsApp
      </a>
    </div>

    ${buildSignOff()}
  `

  await sendLuxuryEmail({
    to: order.email as string,
    name: customerName,
    subject: `Order #${displayId} Confirmed - Taj Petha Agra`,
    html: buildLuxuryTemplate("Order Confirmed", body),
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
  context: { subscriberId: "order-confirmation-email" },
}