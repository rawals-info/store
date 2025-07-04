// @ts-ignore
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendLuxuryEmail, buildLuxuryTemplate } from "../util/email"
import { Modules } from "@medusajs/framework/utils"
import type { IOrderModuleService } from "@medusajs/framework/types"

export default async function orderDeliveredEmail({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderId = event.data.id
  const orderService = container.resolve<IOrderModuleService>(Modules.ORDER)
  const order: any = await orderService.retrieveOrder(orderId)

  const body = `
    <p>Dear ${order.email},</p>
    <p>We are thrilled to confirm that your Imperial Craft Of India order <strong>#${order.display_id}</strong> has been delivered.</p>
    <p>We hope every detail exceeds your expectations.</p>
    <p>If there is anything we can assist you with, please let us know.</p>
    <p style="margin-top:32px">Enjoy your new piece,<br/>The Imperial Craft Of India Team</p>
  `

  await sendLuxuryEmail({
    to: order.email as string,
    name: order.email,
    subject: `Order #${order.display_id} Delivered – Imperial Craft Of India`,
    html: buildLuxuryTemplate("Order Delivered", body),
  })
}

export const config: SubscriberConfig = {
  event: "order.completed",
  context: { subscriberId: "order-delivered-email" },
} 