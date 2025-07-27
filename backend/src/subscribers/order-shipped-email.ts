// @ts-ignore
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendLuxuryEmail, buildLuxuryTemplate } from "../util/email"
import { Modules } from "@medusajs/framework/utils"
import type { IOrderModuleService } from "@medusajs/framework/types"

export default async function orderShippedEmail({
  event,
  container,
}: SubscriberArgs<{ order_id: string }>) {
  const orderId = event.data.order_id

  const orderService = container.resolve<IOrderModuleService>(Modules.ORDER)
  const order: any = await orderService.retrieveOrder(orderId, {
    relations: ["shipping_address", "fulfillments"],
  })

  // @ts-ignore
  const tracking = order.fulfillments?.[0]?.tracking_numbers?.[0]

  const body = `
    <p>Dear ${order.shipping_address?.first_name ?? order.email},</p>
    <p>Exciting news! 🚚 Your delicious <strong>Taj Petha</strong> order <strong>#${order.display_id}</strong> has been carefully packed and is now on its sweet journey to you!</p>
    
    <div class="highlight-box">
      <p><strong>📦 Your Sweets Are On The Way!</strong></p>
      <p>Our master sweet makers have lovingly prepared your order using our traditional family recipes. Each sweet has been packed with care to ensure it reaches you in perfect condition.</p>
    </div>
    
    ${tracking ? `
    <div class="highlight-box">
      <p><strong>📍 Track Your Sweet Delivery</strong></p>
      <p>Your tracking number is: <strong style="font-size: 16px; color: #B8860B;">${tracking}</strong></p>
      <p>You can use this number to track your package and know exactly when your delicious treats will arrive!</p>
    </div>
    ` : ""}
    
    <p><strong>🍯 What to Expect:</strong></p>
    <ul style="margin: 16px 0; padding-left: 20px;">
      <li style="margin: 8px 0;">📦 <strong>Premium Packaging:</strong> Your sweets are packed in food-safe, moisture-resistant packaging</li>
      <li style="margin: 8px 0;">🌡️ <strong>Freshness Guaranteed:</strong> Special care taken to maintain texture and flavor during transit</li>
      <li style="margin: 8px 0;">⏰ <strong>Estimated Delivery:</strong> 2-5 business days depending on your location</li>
      <li style="margin: 8px 0;">📱 <strong>Updates:</strong> You'll receive notifications when your package is out for delivery</li>
    </ul>
    
    <p><strong>💡 Sweet Delivery Tips:</strong></p>
    <ul style="margin: 16px 0; padding-left: 20px;">
      <li style="margin: 6px 0;">🏠 Please ensure someone is available to receive the package</li>
      <li style="margin: 6px 0;">❄️ Store your sweets in a cool, dry place immediately upon arrival</li>
      <li style="margin: 6px 0;">📞 Contact us immediately if you notice any issues upon delivery</li>
    </ul>
    
    <p>The anticipation of enjoying authentic Agra sweets is almost as delightful as the first bite! We can't wait for you to experience the traditional flavors that have made our family proud for generations.</p>
    
    <p>If you have any questions about your shipment or need assistance, please contact us at <strong>support@tajpetha.in</strong>.</p>
    
    <p style="margin-top: 32px; font-style: italic;">Sweet travels and happy indulging ahead!<br/>The Taj Petha Family 🍯</p>
  `

  await sendLuxuryEmail({
    to: order.email as string,
    name: order.shipping_address?.first_name ?? order.email,
    subject: `Your Sweet Order #${order.display_id} Has Shipped! 🚚🍯 - Taj Petha`,
    html: buildLuxuryTemplate("Your Sweets Are On The Way!", body),
  })
}

export const config: SubscriberConfig = {
  event: "order.fulfillment_created",
  context: { subscriberId: "order-shipped-email" },
}