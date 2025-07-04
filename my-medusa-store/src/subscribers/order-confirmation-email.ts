// @ts-ignore – types provided by Medusa at runtime
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendLuxuryEmail, buildLuxuryTemplate } from "../util/email"
import { Modules } from "@medusajs/framework/utils"
import type { IOrderModuleService } from "@medusajs/framework/types"

/**
 * Sends a simple order confirmation email to the customer using Brevo.
 * Make sure to set BREVO_API_KEY and EMAIL_FROM in your environment.
 */
export default async function orderConfirmationEmail({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const { id: orderId } = event.data

  // Retrieve the order with relations so we have customer info
  const orderService = container.resolve<IOrderModuleService>(Modules.ORDER)
  const order: any = await orderService.retrieveOrder(orderId, {
    select: [
      "subtotal",
      "shipping_total",
      "tax_total",
      "discount_total",
      "total",
      "currency_code",
    ],
    relations: [
      "items",
      "shipping_address",
      "billing_address",
    ],
  })

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
      currency: order.currency_code?.toUpperCase?.() ?? "USD",
    }).format(amt)

  const items: any[] = Array.isArray(order.items) ? order.items : []
  const itemsHtml = items
    .map((it: any) => {
      const lineTotal = asNumber(it.total ?? it.unit_price * it.quantity)
      return `<tr><td>${it.title}</td><td style="text-align:center">${it.quantity}</td><td style="text-align:right">${fmt(lineTotal)}</td></tr>`
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
      .map((l) => `<div>${l}</div>`) // wrap each line
      .join("")

  const body = `
    <p>Dear ${(order as any).shipping_address?.first_name ?? order.email},</p>
    <p>Thank you for your purchase! Your order <strong>#${order.display_id}</strong> has been received and is now being processed.</p>

    <table width="100%" cellpadding="6" style="border-collapse:collapse;font-size:14px;margin-top:16px">
      <thead><tr><th align="left">Item</th><th align="center">Qty</th><th align="right">Total</th></tr></thead>
      <tbody>${itemsHtml}</tbody>
    </table>
    <p style="margin-top:16px"><strong>Subtotal:</strong> ${fmt(asNumber(order.subtotal))}</p>
    <p><strong>Shipping:</strong> ${fmt(asNumber(order.shipping_total))}</p>
    <p><strong>Tax:</strong> ${fmt(asNumber(order.tax_total))}</p>
    ${order.discount_total ? `<p><strong>Discount:</strong> -${fmt(asNumber(order.discount_total))}</p>` : ""}
    <p><strong>Grand Total:</strong> ${fmt(asNumber(order.total))}</p>

    <h3 style="margin-top:24px">Shipping To</h3>
    ${addressLines(order.shipping_address ?? {})}

    <p style="margin-top:32px">You will receive a shipment notification with tracking details as soon as your order is on its way.</p>
    <p style="margin-top:32px">With appreciation,<br/>The Imperial Craft Of India Team</p>
  `

  await sendLuxuryEmail({
    to: order.email as string,
    name: order.email,
    subject: `Order #${order.display_id} Confirmation`,
    html: buildLuxuryTemplate("Order Confirmation", body),
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
  context: {
    subscriberId: "order-confirmation-email",
  },
} 