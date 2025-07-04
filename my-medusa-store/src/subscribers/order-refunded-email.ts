// @ts-ignore
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendLuxuryEmail, buildLuxuryTemplate } from "../util/email"
import { Modules } from "@medusajs/framework/utils"
import type { IOrderModuleService } from "@medusajs/framework/types"

export default async function orderRefundedEmail({
  event,
  container,
}: SubscriberArgs<{ order_id?: string }>) {
  const orderId = (event as any).data.order_id ?? (event as any).data.id
  if (!orderId) return

  const orderService = container.resolve<IOrderModuleService>(Modules.ORDER)
  const order: any = await orderService.retrieveOrder(orderId, {
    relations: ["customer"],
  })

  const body = `
    <p>Dear ${order.first_name ?? order.email},</p>
    <p>We have processed a refund for your order <strong>#${order.display_id}</strong>. The amount will be credited back to your original payment method shortly.</p>
    <p>If you have any questions, please reply to this email and our concierge team will assist you.</p>
    <p style="margin-top:32px">Sincerely,<br/>The Imperial Craft Of India Team</p>
  `

  await sendLuxuryEmail({
    to: order.email as string,
    // @ts-ignore
    name: order.first_name ?? order.email,
    subject: `Refund Processed for Order #${order.display_id}`,
    html: buildLuxuryTemplate("Refund Confirmation", body),
  })
}

export const config: SubscriberConfig = {
  event: "payment.refunded",
  context: { subscriberId: "order-refunded-email" },
} 