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

export default async function orderRefundedEmail({
  event,
  container,
}: SubscriberArgs<{ order_id?: string }>) {
  const orderId = (event as any).data.order_id ?? (event as any).data.id
  if (!orderId) return

  const orderService = container.resolve<IOrderModuleService>(Modules.ORDER)
  const order: any = await orderService.retrieveOrder(orderId, {
    select: ["id", "display_id", "email"],
    relations: ["shipping_address"],
  })

  const customerName = order.shipping_address?.first_name ?? order.email

  const body = `
    ${buildParagraph(`Dear ${buildStrong(customerName)},`)}
    
    ${buildParagraph(`We have successfully processed a refund for your ${buildStrong("Taj Petha")} order ${buildStrong("#" + order.display_id)}.`)}
    
    ${buildInfoBox("Refund Details", `
      <p style="font-size: 14px; color: #4A4A4A; margin: 0;">The refund amount will be credited back to your original payment method within 3-5 business days, depending on your bank's processing time.</p>
    `)}
    
    ${buildParagraph("We sincerely apologise for any inconvenience this may have caused. At Taj Petha, we are committed to ensuring every customer has a delightful experience with our traditional sweets.")}
    
    <h2 style="font-family: 'Georgia', serif; font-size: 14px; font-weight: 400; color: #1A1A1A; margin: 32px 0 16px 0; letter-spacing: 2px; text-transform: uppercase;">What Happens Next</h2>
    
    ${buildList([
    "Your refund will appear on your statement within 3-5 business days",
    "You will receive a confirmation once the refund is processed by your bank",
    "We would love to serve you again with our authentic Agra sweets"
  ])}
    
    ${buildParagraph(`If you have any questions about this refund or would like to place a new order, please do not hesitate to contact us at ${buildLink("mailto:support@tajpetha.in", "support@tajpetha.in")}. Our customer care team is always here to help.`)}
    
    ${buildParagraph("We hope to have the opportunity to serve you again soon with our delicious traditional sweets.")}
    
    ${buildSignOff()}
  `

  await sendLuxuryEmail({
    to: order.email as string,
    name: customerName,
    subject: `Refund Processed - Order #${order.display_id} - Taj Petha`,
    html: buildLuxuryTemplate("Refund Confirmation", body),
  })
}

export const config: SubscriberConfig = {
  event: "payment.refunded",
  context: { subscriberId: "order-refunded-email" },
}