// @ts-ignore
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import {
  sendLuxuryEmail,
  buildLuxuryTemplate,
  buildInfoBox,
  buildParagraph,
  buildStrong,
  buildLink,
  buildList,
  buildSignOff
} from "../util/email"
import { Modules } from "@medusajs/framework/utils"
import type { IOrderModuleService } from "@medusajs/framework/types"

export default async function orderShippedEmail({
  event,
  container,
}: SubscriberArgs<{ order_id: string }>) {
  const orderId = event.data.order_id

  console.log(`[ShippingEmail] Processing order ${orderId}`)

  const orderService = container.resolve<IOrderModuleService>(Modules.ORDER)
  const order: any = await orderService.retrieveOrder(orderId, {
    select: [
      "id",
      "display_id",
      "email",
      "created_at",
    ],
    relations: ["shipping_address"],
  })

  console.log(`[ShippingEmail] Sending shipping notification to ${order.email}`)

  const customerName = order.shipping_address?.first_name ?? order.email

  const body = `
    ${buildParagraph(`Dear ${buildStrong(customerName)},`)}
    
    ${buildParagraph(`We are pleased to inform you that your ${buildStrong("Taj Petha")} order ${buildStrong("#" + order.display_id)} has been carefully packed and dispatched.`)}
    
    ${buildInfoBox("Your Order Is On Its Way", `
      <p style="font-size: 14px; color: #4A4A4A; margin: 0;">Our artisans have lovingly prepared your order using our traditional family recipes. Each sweet has been packed with care to ensure it reaches you in perfect condition.</p>
    `)}
    
    <h2 style="font-family: 'Georgia', serif; font-size: 14px; font-weight: 400; color: #1A1A1A; margin: 32px 0 16px 0; letter-spacing: 2px; text-transform: uppercase;">What to Expect</h2>
    
    ${buildList([
    "<strong>Premium Packaging:</strong> Your sweets are packed in food-safe, moisture-resistant packaging",
    "<strong>Freshness Guaranteed:</strong> Special care taken to maintain texture and flavour during transit",
    "<strong>Estimated Delivery:</strong> 2-5 business days depending on your location",
    "<strong>Updates:</strong> You will receive notifications when your package is out for delivery"
  ])}
    
    <h2 style="font-family: 'Georgia', serif; font-size: 14px; font-weight: 400; color: #1A1A1A; margin: 32px 0 16px 0; letter-spacing: 2px; text-transform: uppercase;">Delivery Tips</h2>
    
    ${buildList([
    "Please ensure someone is available to receive the package",
    "Store your sweets in a cool, dry place immediately upon arrival",
    "Contact us immediately if you notice any issues upon delivery"
  ])}
    
    ${buildParagraph(`Should you have any questions about your shipment, please contact us at ${buildLink("mailto:support@tajpetha.in", "support@tajpetha.in")}`)}
    
    ${buildSignOff()}
  `

  await sendLuxuryEmail({
    to: order.email as string,
    name: customerName,
    subject: `Your Order #${order.display_id} Has Been Dispatched - Taj Petha`,
    html: buildLuxuryTemplate("Your Order Has Shipped", body),
  })

  console.log(`[ShippingEmail] Shipping notification sent successfully to ${order.email}`)
}

export const config: SubscriberConfig = {
  event: "order.fulfillment_created",
  context: { subscriberId: "order-shipped-email" },
}