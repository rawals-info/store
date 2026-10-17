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
          ? `<div style="font-size: 12px; color: #64748B; margin-top: 2px;">Pack: <span style="color: #1E293B; font-weight: 600;">${variantInfo}</span></div>`
          : ""
      const isLast = index === items.length - 1

      const thumbnailHtml = it.thumbnail
        ? `<img src="${it.thumbnail}" alt="${it.title}" width="48" height="48" style="width: 48px; height: 48px; border-radius: 8px; object-fit: cover; display: block; border: 1px solid #E2E8F0;" />`
        : `<table width="48" height="48" cellpadding="0" cellspacing="0" border="0" style="width: 48px; height: 48px; border-radius: 8px; background-color: #F8FAFC; border: 1px solid #E2E8F0; text-align: center;"><tr><td align="center" valign="middle" style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 10px; font-weight: 700; color: #94A3B8; text-transform: uppercase;">BOX</td></tr></table>`

      return `
        <tr>
          <td style="padding: 14px 16px; ${isLast ? "" : "border-bottom: 1px solid #F1F5F9;"}">
            <table width="100%" border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td width="52" valign="top">
                  ${thumbnailHtml}
                </td>
                <td style="padding-left: 12px;" valign="top">
                  <div style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 14px; font-weight: 600; color: #0F172A; line-height: 1.3;">
                    ${it.title}
                  </div>
                  ${variantDisplay}
                  <div style="font-size: 12px; color: #64748B; margin-top: 3px;">Qty: <strong style="color: #0F172A;">${it.quantity}</strong></div>
                </td>
                <td align="right" valign="top">
                  <div style="font-family: monospace, Consolas, sans-serif; font-size: 14px; font-weight: 700; color: #0F172A;">
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
    addr.phone ? `Phone: ${addr.phone}` : undefined,
  ]
    .filter(Boolean)
    .join("<br>")

  const subtotal = asNumber(order.subtotal)
  const shippingTotal = asNumber(order.shipping_total)
  const discountTotal = asNumber(order.discount_total)
  const taxTotal = asNumber(order.tax_total)
  const grandTotal = asNumber(order.total)

  const body = `
    <!-- Order Status Header -->
    <div style="text-align: center; margin-bottom: 26px;">
      <div style="display: inline-block; background-color: #FEF3C7; color: #92400E; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; padding: 4px 12px; border-radius: 9999px; margin-bottom: 12px;">
        Order Confirmed &bull; Order #${displayId}
      </div>
      <h1 style="margin: 0 0 8px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 30px; font-weight: 700; color: #0F172A; line-height: 1.2;">
        Thank You for Your Order
      </h1>
      <p style="margin: 0 auto; font-size: 14px; color: #64748B; line-height: 1.6; max-width: 460px;">
        Hello ${customerName}, we have received your order #${displayId} and are preparing it for express dispatch from Agra.
      </p>
    </div>

    <!-- Section Header -->
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 10px;">
      <tr>
        <td>
          <span style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.8px;">
            Order Items
          </span>
        </td>
        <td align="right">
          <span style="font-size: 11px; color: #059669; font-weight: 600; background-color: #ECFDF5; border: 1px solid #A7F3D0; padding: 2px 8px; border-radius: 4px;">
            Fresh Batch
          </span>
        </td>
      </tr>
    </table>

    <!-- Items Table -->
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background: #FFFFFF; border-radius: 10px; border: 1px solid #E2E8F0; overflow: hidden; margin-bottom: 18px;">
      ${itemsHtml}
    </table>

    <!-- Totals Card -->
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background: #FFFFFF; border-radius: 10px; border: 1px solid #E2E8F0; padding: 16px 18px; margin-bottom: 18px;">
      <tr>
        <td>
          <table width="100%" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding: 6px 0; font-size: 13px; color: #64748B;">Items Subtotal</td>
              <td align="right" style="padding: 6px 0; font-family: monospace, Consolas, sans-serif; font-size: 13px; color: #0F172A;">${fmt(subtotal)}</td>
            </tr>
            ${
              discountTotal > 0
                ? `<tr>
                    <td style="padding: 6px 0; font-size: 13px; color: #059669; font-weight: 600;">Promo Discount</td>
                    <td align="right" style="padding: 6px 0; font-family: monospace, Consolas, sans-serif; font-size: 13px; color: #059669; font-weight: 600;">-${fmt(discountTotal)}</td>
                  </tr>`
                : ""
            }
            <tr>
              <td style="padding: 6px 0; font-size: 13px; color: #64748B;">Shipping &amp; Handling</td>
              <td align="right" style="padding: 6px 0; font-family: monospace, Consolas, sans-serif; font-size: 13px; color: #0F172A;">
                ${shippingTotal === 0 ? `<span style="color: #059669; font-weight: 700; background: #ECFDF5; padding: 2px 6px; border-radius: 4px;">FREE</span>` : fmt(shippingTotal)}
              </td>
            </tr>
            ${
              taxTotal > 0
                ? `<tr>
                    <td style="padding: 6px 0; font-size: 13px; color: #64748B;">Taxes (GST Included)</td>
                    <td align="right" style="padding: 6px 0; font-family: monospace, Consolas, sans-serif; font-size: 13px; color: #0F172A;">${fmt(taxTotal)}</td>
                  </tr>`
                : ""
            }
            <tr>
              <td colspan="2" style="padding: 12px 0 0 0; border-top: 1.5px solid #0F172A;">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 700; color: #0F172A; text-transform: uppercase; letter-spacing: 0.5px;">
                      Order Total:
                    </td>
                    <td align="right" style="font-family: monospace, Consolas, sans-serif; font-size: 18px; font-weight: 800; color: #B45309;">
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
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
      <tr>
        <td class="two-col" width="48%" valign="top" style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px;">
          <div style="font-size: 11px; font-weight: 700; color: #B45309; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px;">
            Delivery Address
          </div>
          <div style="font-size: 12.5px; color: #334155; line-height: 1.6;">
            ${addressText || "Address on File"}
          </div>
        </td>
        
        <td width="4%" class="two-col-gap">&nbsp;</td>

        <td class="two-col" width="48%" valign="top" style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px;">
          <div style="font-size: 11px; font-weight: 700; color: #059669; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px;">
            Freshness &amp; Care
          </div>
          <div style="font-size: 12px; color: #334155; line-height: 1.6;">
            &bull; Prepared fresh daily in Agra<br>
            &bull; Sealed for 30-day freshness<br>
            &bull; Store in a cool, dry place
          </div>
        </td>
      </tr>
    </table>

    <!-- Customer Support Section -->
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; margin-bottom: 8px;">
      <tr>
        <td style="padding: 16px 20px;">
          <div style="font-size: 13px; font-weight: 600; color: #0F172A; margin-bottom: 4px;">
            Have questions about your order?
          </div>
          <div style="font-size: 12px; color: #64748B; line-height: 1.5; margin-bottom: 12px;">
            Our customer concierge is available Monday through Sunday, 9:00 AM – 9:00 PM IST.
          </div>
          <a href="https://wa.me/919259418994?text=Hello%2C%20I%20have%20an%20inquiry%20regarding%20Order%20%23${displayId}" target="_blank" style="display: inline-block; background-color: #059669; color: #FFFFFF !important; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 700; padding: 8px 18px; border-radius: 6px; text-decoration: none;">
            WhatsApp Helpdesk (+91 92594 18994)
          </a>
        </td>
      </tr>
    </table>
  `

  await sendLuxuryEmail({
    to: order.email as string,
    name: customerName,
    subject: `Your Taj Petha Order #${displayId} is Confirmed`,
    html: buildLuxuryTemplate("Order Confirmed", body),
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
  context: { subscriberId: "order-confirmation-email" },
}