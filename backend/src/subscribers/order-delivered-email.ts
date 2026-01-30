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

export default async function orderDeliveredEmail({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderId = event.data.id
  const orderService = container.resolve<IOrderModuleService>(Modules.ORDER)
  const order: any = await orderService.retrieveOrder(orderId, {
    select: ["id", "display_id", "email"],
    relations: ["shipping_address"],
  })

  const customerName = order.shipping_address?.first_name ?? order.email

  const body = `
    ${buildParagraph(`Dear ${buildStrong(customerName)},`)}
    
    ${buildParagraph(`Your ${buildStrong("Taj Petha")} order ${buildStrong("#" + order.display_id)} has been successfully delivered and is ready for you to enjoy.`)}
    
    ${buildInfoBox("Your Sweets Have Arrived", `
      <p style="font-size: 14px; color: #4A4A4A; margin: 0;">We hope every bite brings you the authentic taste of Agra's finest traditions. Our artisans have carefully crafted each sweet with the same expertise that has been passed down through generations.</p>
    `)}
    
    <h2 style="font-family: 'Georgia', serif; font-size: 14px; font-weight: 400; color: #1A1A1A; margin: 32px 0 16px 0; letter-spacing: 2px; text-transform: uppercase;">Enjoying Your Taj Petha</h2>
    
    ${buildList([
    "<strong>Best Before:</strong> Enjoy within 15-20 days for optimal flavour and texture",
    "<strong>Storage:</strong> Keep in a cool, dry place away from direct sunlight",
    "<strong>Serving Suggestion:</strong> Perfect with a cup of Indian chai or as a sweet ending to your meals",
    "<strong>Share the Joy:</strong> Ideal for sharing with family and friends during special moments"
  ])}
    
    ${buildInfoBox("We Value Your Experience", `
      <p style="font-size: 14px; color: #4A4A4A; margin: 0;">How did we do? We would love to hear about your experience with our sweets. Your feedback helps us maintain the high quality that makes Taj Petha special.</p>
    `)}
    
    ${buildParagraph(`If you notice anything that does not meet our usual standards of excellence, please reach out to us immediately at ${buildLink("mailto:support@tajpetha.in", "support@tajpetha.in")}. We stand behind every sweet we make.`)}
    
    ${buildParagraph("Thank you for choosing Taj Petha and for being part of our family. We look forward to serving you again soon.")}
    
    ${buildSignOff()}
  `

  await sendLuxuryEmail({
    to: order.email as string,
    name: customerName,
    subject: `Delivery Complete - Order #${order.display_id} - Taj Petha`,
    html: buildLuxuryTemplate("Your Order Has Been Delivered", body),
  })
}

export const config: SubscriberConfig = {
  event: "order.completed",
  context: { subscriberId: "order-delivered-email" },
}