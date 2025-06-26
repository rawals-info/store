// @ts-ignore
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendLuxuryEmail, buildLuxuryTemplate } from "../util/email"

export default async function customerOnboardingEmail({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderId = event.data.id
  const orderService = container.resolve("order") as any
  const order = await orderService.retrieve(orderId, {
    relations: ["customer"],
  })
  const customerId = order.customer_id

  const orders = await orderService.list({ customer_id: customerId }, { select: ["id"] })
  if (orders.length > 1) {
    // Not the first order – skip onboarding email
    return
  }

  const body = `
    <p>Dear ${order.first_name ?? order.email},</p>
    <p>Thank you for placing your first order with Marble Luxe! We're honored you chose us to elevate your space.</p>
    <p>Over the coming weeks we'll share styling ideas, exclusive previews, and stories behind our craft.</p>
    <p style="margin-top:32px">Stay inspired,<br/>The Marble Luxe Team</p>
  `

  await sendLuxuryEmail({
    to: order.email,
    name: order.first_name ?? order.email,
    subject: "Your Journey with Marble Luxe Begins",
    html: buildLuxuryTemplate("Welcome to the Marble Luxe Family", body),
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
  context: { subscriberId: "customer-onboarding-email" },
} 