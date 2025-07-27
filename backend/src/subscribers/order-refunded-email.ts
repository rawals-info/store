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
  const order: any = await orderService.retrieveOrder(orderId)

  const body = `
    <p>Dear ${order.shipping_address?.first_name ?? order.email},</p>
    <p>We have successfully processed a refund for your <strong>Taj Petha</strong> order <strong>#${order.display_id}</strong>. 💰</p>
    
    <div class="highlight-box">
      <p><strong>💳 Refund Details</strong></p>
      <p>The refund amount will be credited back to your original payment method within 3-5 business days, depending on your bank's processing time.</p>
    </div>
    
    <p>We sincerely apologize for any inconvenience this may have caused. At Taj Petha, we're committed to ensuring every customer has a delightful experience with our traditional sweets.</p>
    
    <p><strong>What's Next:</strong></p>
    <ul style="margin: 16px 0; padding-left: 20px;">
      <li style="margin: 6px 0;">💫 Your refund will appear on your statement within 3-5 business days</li>
      <li style="margin: 6px 0;">📧 You'll receive a confirmation once the refund is processed by your bank</li>
      <li style="margin: 6px 0;">🍯 We'd love to serve you again with our authentic Agra sweets</li>
    </ul>
    
    <p>If you have any questions about this refund or would like to place a new order, please don't hesitate to contact us at <strong>support@tajpetha.in</strong>. Our customer care team is always here to help.</p>
    
    <p>We hope to have the opportunity to serve you again soon with our delicious traditional sweets!</p>
    
    <p style="margin-top: 32px; font-style: italic;">With warm regards and sweet wishes,<br/>The Taj Petha Family 🍯</p>
  `

  await sendLuxuryEmail({
    to: order.email as string,
    name: order.shipping_address?.first_name ?? order.email,
    subject: `Refund Processed for Order #${order.display_id} - Taj Petha 💰`,
    html: buildLuxuryTemplate("Refund Confirmation", body),
  })
}

export const config: SubscriberConfig = {
  event: "payment.refunded",
  context: { subscriberId: "order-refunded-email" },
} 