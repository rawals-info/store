// @ts-ignore – types provided by Medusa at runtime
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendLuxuryEmail, buildLuxuryTemplate } from "../util/email"

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
  const orderService = container.resolve("order") as any
  const order = await orderService.retrieve(orderId, {
    relations: [
      "items",
      "shipping_address",
      "billing_address",
      "customer",
    ],
  })

  const body = `
    <p>Dear ${order.first_name ?? order.email},</p>
    <p>Thank you for shopping with Marble Luxe. We're delighted to confirm that we've received your order <strong>#${order.display_id}</strong> totalling <strong>${
      order.total / 100
    } ${order.currency_code.toUpperCase()}</strong>.</p>
    <p>You'll receive another email as soon as your items are on the way.</p>
    <p style="margin-top:32px">With appreciation,<br/>The Marble Luxe Team</p>
  `

  await sendLuxuryEmail({
    to: order.email,
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