// @ts-ignore
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendLuxuryEmail, buildLuxuryTemplate } from "../util/email"

export default async function orderShippedEmail({
  event,
  container,
}: SubscriberArgs<{ order_id: string }>) {
  const orderId = event.data.order_id

  const orderService = container.resolve("order") as any
  const order = await orderService.retrieve(orderId, {
    relations: ["shipping_address", "customer", "fulfillments"],
  })

  const tracking = order.fulfillments?.[0]?.tracking_numbers?.[0]

  const body = `
    <p>Dear ${order.first_name ?? order.email},</p>
    <p>Your order <strong>#${order.display_id}</strong> has left our atelier and is now on its way to you.</p>
    ${tracking ? `<p>Your tracking number is <strong>${tracking}</strong>.</p>` : ""}
    <p>We hope the anticipation is as delightful as the unboxing will be.</p>
    <p style="margin-top:32px">Warm regards,<br/>The Imperial Craft Of India Team</p>
  `

  await sendLuxuryEmail({
    to: order.email,
    name: order.first_name ?? order.email,
    subject: `Your Imperial Craft Of India Order #${order.display_id} Has Shipped`,
    html: buildLuxuryTemplate("Order Shipped", body),
  })
}

export const config: SubscriberConfig = {
  event: "order.fulfillment_created",
  context: { subscriberId: "order-shipped-email" },
} 