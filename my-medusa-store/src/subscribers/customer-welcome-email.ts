// @ts-ignore
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendLuxuryEmail, buildLuxuryTemplate } from "../util/email"

export default async function customerWelcomeEmail({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const customerId = event.data.id
  const customerService = container.resolve("customer") as any
  const customer = await customerService.retrieve(customerId)

  const body = `
    <p>Dear ${customer.first_name ?? customer.email},</p>
    <p>Welcome to Imperial Craft Of India – where timeless elegance meets exquisite craftsmanship.</p>
    <p>As a valued member, you'll enjoy early access to limited editions, private sales, and curated inspiration.</p>
    <p style="margin-top:32px">We're delighted to have you,<br/>The Imperial Craft Of India Team</p>
  `

  await sendLuxuryEmail({
    to: customer.email,
    name: customer.first_name ?? customer.email,
    subject: "Welcome to Imperial Craft Of India",
    html: buildLuxuryTemplate("Welcome", body),
  })
}

export const config: SubscriberConfig = {
  event: "customer.created",
  context: { subscriberId: "customer-welcome-email" },
} 