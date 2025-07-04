// @ts-ignore
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendLuxuryEmail, buildLuxuryTemplate } from "../util/email"
import { Modules } from "@medusajs/framework/utils"
import type { IOrderModuleService } from "@medusajs/framework/types"

export default async function customerOnboardingEmail({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderId = event.data.id
  const orderService = container.resolve<IOrderModuleService>(Modules.ORDER)
  const order: any = await orderService.retrieveOrder(orderId, {
    relations: ["customer"],
  })
  const customerId = order.customer_id

  const orders = await (orderService as any).listOrders({ customer_id: customerId }, { select: ["id"] })
  if (orders.length > 1) {
    // Not the first order – skip onboarding email
    return
  }

  const body = `
    <p>Dear ${order.first_name ?? order.email},</p>
    <p>Thank you for placing your first order with Imperial Craft Of India! We're honored you chose us to elevate your space.</p>
    <p>Over the coming weeks we'll share styling ideas, exclusive previews, and stories behind our craft.</p>
    <p style="margin-top:32px">Stay inspired,<br/>The Imperial Craft Of India Team</p>
  `

  await sendLuxuryEmail({
    to: order.email as string,
    // @ts-ignore
    name: order.first_name ?? order.email,
    subject: "Your Journey with Imperial Craft Of India Begins",
    html: buildLuxuryTemplate("Welcome to the Imperial Craft Of India Family", body),
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
  context: { subscriberId: "customer-onboarding-email" },
} 