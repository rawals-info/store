// @ts-ignore
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import {
  sendLuxuryEmail,
  buildLuxuryTemplate,
  buildInfoBox,
  buildParagraph,
  buildStrong,
  buildList,
  buildSignOff
} from "../util/email"

export default async function customerWelcomeEmail({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const customerId = event.data.id
  const customerService = container.resolve("customer") as any
  const customer = await customerService.retrieve(customerId)

  const customerName = customer.first_name ?? customer.email

  const body = `
    ${buildParagraph(`Dear ${buildStrong(customerName)},`)}
    
    ${buildParagraph(`A warm welcome to ${buildStrong("Taj Petha")} – where every sweet tells a story of tradition, heritage, and the authentic flavours of Agra.`)}
    
    ${buildInfoBox("Welcome to Our Legacy", `
      <p style="font-size: 14px; color: #4A4A4A; margin: 0;">For generations, we have been crafting the finest pethas, namkeens, and traditional Indian sweets using time-honoured recipes passed down through our family. Each bite is a celebration of Agra's rich culinary heritage.</p>
    `)}
    
    <h2 style="font-family: 'Georgia', serif; font-size: 14px; font-weight: 400; color: #1A1A1A; margin: 32px 0 16px 0; letter-spacing: 2px; text-transform: uppercase;">As a Valued Member, You Will Enjoy</h2>
    
    ${buildList([
    "<strong>Early access</strong> to our seasonal specialties and festival collections",
    "<strong>Exclusive offers</strong> on our premium petha varieties",
    "<strong>Special discounts</strong> on bulk orders for celebrations",
    "<strong>First to know</strong> about new flavours and traditional recipes"
  ])}
    
    ${buildParagraph(`Whether you are craving our signature ${buildStrong("Kesar Petha")}, the delightful ${buildStrong("Angoori Petha")}, or our famous ${buildStrong("Dalmoth")}, we are here to bring the authentic taste of Agra right to your doorstep.`)}
    
    ${buildSignOff()}
  `

  await sendLuxuryEmail({
    to: customer.email,
    name: customerName,
    subject: "Welcome to Taj Petha",
    html: buildLuxuryTemplate("Welcome to Our Family", body),
  })
}

export const config: SubscriberConfig = {
  event: "customer.created",
  context: { subscriberId: "customer-welcome-email" },
}