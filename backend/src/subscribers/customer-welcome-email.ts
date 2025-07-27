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
    <p>A warm welcome to the <strong>Taj Petha</strong> family – where every sweet tells a story of tradition, heritage, and the authentic flavors of Agra!</p>
    
    <div class="highlight-box">
      <p><strong>🍯 Welcome to Our Sweet Legacy</strong></p>
      <p>For generations, we have been crafting the finest pethas, namkeens, and traditional Indian sweets using time-honored recipes passed down through our family. Each bite is a celebration of Agra's rich culinary heritage.</p>
    </div>
    
    <p>As a valued member of our sweet family, you'll enjoy:</p>
    <ul style="margin: 16px 0; padding-left: 20px;">
      <li style="margin: 8px 0;">🎯 <strong>Early access</strong> to our seasonal specialties and festival collections</li>
      <li style="margin: 8px 0;">🎁 <strong>Exclusive offers</strong> on our premium petha varieties</li>
      <li style="margin: 8px 0;">📦 <strong>Special discounts</strong> on bulk orders for celebrations</li>
      <li style="margin: 8px 0;">🌟 <strong>First to know</strong> about new flavors and traditional recipes</li>
    </ul>
    
    <p>Whether you're craving our signature <strong>Kesar Petha</strong>, the delightful <strong>Angoori Petha</strong>, or our famous <strong>Dalmoth</strong>, we're here to bring the authentic taste of Agra right to your doorstep.</p>
    
    <p style="margin-top: 32px; font-style: italic;">Sweet regards and warm wishes,<br/>The Taj Petha Family</p>
  `

  await sendLuxuryEmail({
    to: customer.email,
    name: customer.first_name ?? customer.email,
    subject: "Welcome to Taj Petha - Your Sweet Journey Begins! 🍯",
    html: buildLuxuryTemplate("Welcome to Our Sweet Family", body),
  })
}

export const config: SubscriberConfig = {
  event: "customer.created",
  context: { subscriberId: "customer-welcome-email" },
} 