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
    relations: [
      "items",
      "shipping_address",
      "billing_address",
      "customer",
    ],
  })

  const fmt = (amt: number) =>
    Intl.NumberFormat("en-US", {
      style: "currency",
      currency: order.currency_code?.toUpperCase?.() ?? "USD",
    }).format(amt / 100)

  const items: any[] = Array.isArray(order.items) ? order.items : []
  const itemsHtml = items
    .map(
      (it: any) =>
        `<tr><td>${it.title}</td><td style="text-align:center">${it.quantity}</td><td style="text-align:right">${fmt(Number(
          it.total ?? it.unit_price * it.quantity
        ))}</td></tr>`
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
    <p>Dear ${order.first_name ?? order.email},</p>
    <p>Thank you for your purchase! Your order <strong>#${order.display_id}</strong> has been received and is now being processed.</p>

    <table width="100%" cellpadding="6" style="border-collapse:collapse;font-size:14px;margin-top:16px">
      <thead><tr><th align="left">Item</th><th align="center">Qty</th><th align="right">Total</th></tr></thead>
      <tbody>${itemsHtml}</tbody>
    </table>
    <p style="margin-top:16px"><strong>Subtotal:</strong> ${fmt(Number(order.subtotal ?? 0))}</p>
    <p><strong>Shipping:</strong> ${fmt(Number(order.shipping_total ?? 0))}</p>
    <p><strong>Tax:</strong> ${fmt(Number(order.tax_total ?? 0))}</p>
    ${order.discount_total ? `<p><strong>Discount:</strong> -${fmt(Number(order.discount_total))}</p>` : ""}
    <p><strong>Grand Total:</strong> ${fmt(Number(order.total ?? 0))}</p>

    <h3 style="margin-top:24px">Shipping To</h3>
    ${addressLines(order.shipping_address ?? {})}

    <p style="margin-top:32px">You will receive a shipment notification with tracking details as soon as your order is on its way.</p>
    <p style="margin-top:32px">With appreciation,<br/>The Imperial Craft Of India Team</p>
  `

  await sendLuxuryEmail({
    to: order.email as string,
    // @ts-ignore
    name: order.first_name ?? order.email,
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