// @ts-ignore – types provided by Medusa at runtime
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import {
  sendLuxuryEmail,
  buildLuxuryTemplate,
  buildOrderDetailsBox,
  buildInfoBox,
  buildSectionHeading,
  buildParagraph,
  buildStrong,
  buildLink,
  buildList,
  buildSignOff
} from "../util/email"
import { Modules } from "@medusajs/framework/utils"
import type { IOrderModuleService } from "@medusajs/framework/types"

/**
 * Sends an order confirmation email to the customer for their Taj Petha order.
 * Make sure to set BREVO_API_KEY and EMAIL_FROM in your environment.
 */
export default async function orderConfirmationEmail({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const { id: orderId } = event.data

  // Retrieve the order with relations so we have customer info
  const orderService = container.resolve<IOrderModuleService>(Modules.ORDER)

  // Smart retry strategy: Try immediately, then retry up to 5 times over 30 seconds
  let order: any = null
  const maxAttempts = 6 // 1 immediate + 5 retries
  const delays = [0, 5000, 10000, 15000, 20000, 25000] // 0s, 5s, 10s, 15s, 20s, 25s

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      // Wait before retry (except first attempt which is immediate)
      if (delays[attempt] > 0) {
        console.log(`[OrderConfirmationEmail] Retry ${attempt}/${maxAttempts - 1} after ${delays[attempt] / 1000}s for order ${orderId}`)
        await new Promise(resolve => setTimeout(resolve, delays[attempt] - (attempt > 0 ? delays[attempt - 1] : 0)))
      } else {
        console.log(`[OrderConfirmationEmail] Attempting immediate retrieval for order ${orderId}`)
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
        relations: [
          "items",
          "shipping_address",
          "billing_address",
        ],
      })

      console.log(`[OrderConfirmationEmail] Order ${orderId} retrieved successfully after ${attempt + 1} attempt(s)`)
      break // Success! Exit retry loop

    } catch (error) {
      if (attempt === maxAttempts - 1) {
        // Final attempt failed
        console.error(`[OrderConfirmationEmail] Failed to retrieve order ${orderId} after ${maxAttempts} attempts (30 seconds total)`)
        throw error
      }
      // Continue to next retry
    }
  }

  if (!order) {
    console.error(`[OrderConfirmationEmail] Order ${orderId} not found after all retries`)
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

  console.info("[CustomerEmail] order totals", {
    subtotal: order.subtotal,
    shipping_total: order.shipping_total,
    tax_total: order.tax_total,
    total: order.total,
  })

  const fmt = (amt: number) =>
    Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: order.currency_code?.toUpperCase?.() ?? "INR",
    }).format(amt)

  const items: any[] = Array.isArray(order.items) ? order.items : []

  // Build items table with variant information
  const itemsHtml = items
    .map((it: any) => {
      const lineTotal = asNumber(it.total ?? it.unit_price * it.quantity)
      // Get variant info - could be variant_title, variant_sku, or product_title with options
      const variantInfo = it.variant_title || it.variant_sku || ""
      const variantDisplay = variantInfo && variantInfo !== "Default variant" && variantInfo !== it.title
        ? `<div style="font-size: 12px; color: #8A8A8A; margin-top: 4px;">${variantInfo}</div>`
        : ""
      return `
        <tr>
          <td style="padding: 16px 0; border-bottom: 1px solid #F0EDE8; font-size: 14px; color: #2C2C2C;">
            ${it.title}${variantDisplay}
          </td>
          <td style="padding: 16px 0; border-bottom: 1px solid #F0EDE8; font-size: 14px; color: #2C2C2C; text-align: center;">${it.quantity}</td>
          <td style="padding: 16px 0; border-bottom: 1px solid #F0EDE8; font-size: 14px; color: #2C2C2C; text-align: right;">${fmt(lineTotal)}</td>
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
      addr.phone ? `<span style="color: #6A6A6A;">${addr.phone}</span>` : undefined,
    ]
      .filter(Boolean)
      .map((l) => `<div style="font-size: 14px; color: #4A4A4A; line-height: 1.8;">${l}</div>`)
      .join("")

  const customerName = order.shipping_address?.first_name ?? order.email

  const body = `
    ${buildParagraph(`Dear ${buildStrong(customerName)},`)}
    
    ${buildParagraph(`Thank you for choosing ${buildStrong("Taj Petha")}. Your order ${buildStrong("#" + (order.display_id ?? order.id))} has been received and our artisans are preparing your selection with care.`)}

    ${buildOrderDetailsBox(`
      <h2 style="font-family: 'Georgia', serif; font-size: 14px; font-weight: 400; color: #1A1A1A; margin: 0 0 24px 0; letter-spacing: 2px; text-transform: uppercase;">Order Summary</h2>
      
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 12px 0; border-bottom: 1px solid #E8E4DC; font-family: 'Georgia', serif; font-size: 12px; font-weight: 400; color: #8A8A8A; letter-spacing: 1px; text-transform: uppercase;">Item</th>
            <th style="text-align: center; padding: 12px 0; border-bottom: 1px solid #E8E4DC; font-family: 'Georgia', serif; font-size: 12px; font-weight: 400; color: #8A8A8A; letter-spacing: 1px; text-transform: uppercase;">Qty</th>
            <th style="text-align: right; padding: 12px 0; border-bottom: 1px solid #E8E4DC; font-family: 'Georgia', serif; font-size: 12px; font-weight: 400; color: #8A8A8A; letter-spacing: 1px; text-transform: uppercase;">Amount</th>
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
          <span style="font-family: 'Georgia', serif; font-size: 16px; color: #1A1A1A; letter-spacing: 1px;">Total</span>
          <span style="font-family: 'Georgia', serif; font-size: 18px; color: #1A1A1A; font-weight: 600;">${fmt(asNumber(order.total))}</span>
        </div>
      </div>
    `)}

    ${buildSectionHeading("Delivery Address")}
    ${addressLines(order.shipping_address ?? {})}

    ${buildInfoBox("What Happens Next", buildList([
    "Our artisans will prepare your order with traditional expertise",
    "Your sweets will be carefully packed in premium packaging",
    "You will receive a shipping notification once dispatched"
  ]))}
    
    ${buildParagraph(`Should you have any questions, please contact us at ${buildLink("mailto:support@tajpetha.in", "support@tajpetha.in")}`)}
    
    ${buildSignOff()}
  `

  await sendLuxuryEmail({
    to: order.email as string,
    name: customerName,
    subject: `Order #${(order.display_id ?? order.id) as string} Confirmed - Taj Petha`,
    html: buildLuxuryTemplate("Order Confirmed", body),
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
  context: {
    subscriberId: "order-confirmation-email",
  },
}