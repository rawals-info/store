// @ts-ignore
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendLuxuryEmail, buildLuxuryTemplate } from "../util/email"

export default async function orderDeliveredEmail({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderId = event.data.id
  const orderService = container.resolve("order") as any
  const order = await orderService.retrieve(orderId, {
    relations: ["customer"],
  })

  const body = `
    <p>Dear ${order.first_name ?? order.email},</p>
    <p>We are thrilled to confirm that your Marble Luxe order <strong>#${order.display_id}</strong> has been delivered.</p>
    <p>We hope every detail exceeds your expectations.</p>
    <p>If there is anything we can assist you with, please let us know.</p>
    <p style="margin-top:32px">Enjoy your new piece,<br/>The Marble Luxe Team</p>
  `

  await sendLuxuryEmail({
    to: order.email,
    name: order.first_name ?? order.email,
    subject: `Order #${order.display_id} Delivered – Marble Luxe`,
    html: buildLuxuryTemplate("Order Delivered", body),
  })
}

export const config: SubscriberConfig = {
  event: "order.completed",
  context: { subscriberId: "order-delivered-email" },
} 