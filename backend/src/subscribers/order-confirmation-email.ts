// @ts-ignore – types provided by Medusa at runtime
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendLuxuryEmail, buildLuxuryTemplate } from "../util/email"
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

  // ✅ FIX: Increase delay significantly - order.placed fires before DB commit
  // Wait 5 seconds to ensure the order is fully persisted
  await new Promise(resolve => setTimeout(resolve, 5000))

  // Retrieve the order with relations so we have customer info
  const orderService = container.resolve<IOrderModuleService>(Modules.ORDER)
  
  // ✅ FIX: Add aggressive retry logic with exponential backoff
  let order: any
  let retries = 5 // Increased from 3 to 5
  let waitTime = 2000 // Start with 2 seconds
  
  while (retries > 0) {
    try {
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
      break // Successfully retrieved order
    } catch (error) {
      retries--
      if (retries === 0) {
        console.error(`[OrderConfirmationEmail] Failed to retrieve order ${orderId} after 5 attempts (waited 15+ seconds total):`, error)
        throw error // Re-throw after all retries exhausted
      }
      console.warn(`[OrderConfirmationEmail] Retry ${5 - retries}/5 for order ${orderId}, waiting ${waitTime}ms`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
      waitTime *= 1.5 // Exponential backoff: 2s, 3s, 4.5s, 6.75s
    }
  }

  if (!order) {
    console.error(`[OrderConfirmationEmail] Order ${orderId} not found after retries`)
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
    Intl.NumberFormat("en-US", {
      style: "currency",
      currency: order.currency_code?.toUpperCase?.() ?? "INR",
    }).format(amt)

  const items: any[] = Array.isArray(order.items) ? order.items : []
  const itemsHtml = items
    .map((it: any) => {
      const lineTotal = asNumber(it.total ?? it.unit_price * it.quantity)
      return `<tr><td style="padding: 12px 8px; border-bottom: 1px solid #F0E68C;">${it.title}</td><td style="padding: 12px 8px; text-align:center; border-bottom: 1px solid #F0E68C;">${it.quantity}</td><td style="padding: 12px 8px; text-align:right; border-bottom: 1px solid #F0E68C; font-weight: 600;">${fmt(lineTotal)}</td></tr>`
    })
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
      .map((l) => `<div style="margin: 4px 0;">${l}</div>`) // wrap each line
      .join("")

  const body = `
    <p>Dear ${(order as any).shipping_address?.first_name ?? order.email},</p>
    <p>Thank you for choosing <strong>Taj Petha</strong> for your sweet cravings! 🍯 Your order <strong>#${order.display_id ?? order.id}</strong> has been received and our master sweet makers are already preparing your delicious treats.</p>

    <div class="highlight-box">
      <p><strong>🎯 Your Sweet Order Summary</strong></p>
      <p>Each item is lovingly Hand-Made using our traditional family recipes, ensuring you receive the authentic taste of Agra's finest sweets.</p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin: 24px 0;">
      <thead>
        <tr>
          <th style="text-align: left; padding: 12px 8px; background: linear-gradient(135deg, #E8944A, #D2691E); color: #FFFFFF; font-weight: 600;">Sweet Item</th>
          <th style="text-align: center; padding: 12px 8px; background: linear-gradient(135deg, #E8944A, #D2691E); color: #FFFFFF; font-weight: 600;">Qty</th>
          <th style="text-align: right; padding: 12px 8px; background: linear-gradient(135deg, #E8944A, #D2691E); color: #FFFFFF; font-weight: 600;">Total</th>
        </tr>
      </thead>
      <tbody style="background: #FFFEF7;">${itemsHtml}</tbody>
    </table>
    
    <div style="background: #FFF8E7; padding: 20px; border-radius: 8px; margin: 24px 0; border: 1px solid #F0E68C;">
      <p style="margin: 8px 0; font-size: 16px;"><strong>Subtotal:</strong> <span style="float: right; color: #B8860B;">${fmt(asNumber(order.subtotal))}</span></p>
      <p style="margin: 8px 0; font-size: 16px;"><strong>Shipping:</strong> <span style="float: right; color: #B8860B;">${fmt(asNumber(order.shipping_total))}</span></p>
      <p style="margin: 8px 0; font-size: 16px;"><strong>Tax:</strong> <span style="float: right; color: #B8860B;">${fmt(asNumber(order.tax_total))}</span></p>
      ${order.discount_total ? `<p style="margin: 8px 0; font-size: 16px;"><strong>Discount:</strong> <span style="float: right; color: #E8944A;">-${fmt(asNumber(order.discount_total))}</span></p>` : ""}
      <hr style="border: none; height: 1px; background: #E8944A; margin: 16px 0;">
      <p style="margin: 8px 0; font-size: 18px; font-weight: 700;"><strong>Grand Total:</strong> <span style="float: right; color: #B8860B; font-size: 20px;">${fmt(asNumber(order.total))}</span></p>
    </div>

    <div class="address-section">
      <h3>🏠 Delivery Address</h3>
      ${addressLines(order.shipping_address ?? {})}
    </div>

    <div class="highlight-box">
      <p><strong>📦 What Happens Next?</strong></p>
      <p>• Our sweet makers will carefully prepare your order with love and tradition<br/>
      • Your sweets will be packed in our premium, food-safe packaging<br/>
      • You'll receive a tracking notification once your order is dispatched<br/>
      • Enjoy your authentic Agra sweets fresh from our kitchen to your home!</p>
    </div>
    
    <p>If you have any questions about your order or need assistance, please don't hesitate to contact us at <strong>support@tajpetha.in</strong>.</p>
    
    <p style="margin-top: 32px; font-style: italic;">Sweet regards and thank you for your trust,<br/>The Taj Petha Family 🍯</p>
  `

  await sendLuxuryEmail({
    to: order.email as string,
    name: order.email,
    subject: `Sweet Order #${(order.display_id ?? order.id) as string} Confirmed - Taj Petha 🍯`,
    html: buildLuxuryTemplate("Order Confirmation", body),
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
  context: {
    subscriberId: "order-confirmation-email",
  },
} 