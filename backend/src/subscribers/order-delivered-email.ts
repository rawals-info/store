// @ts-ignore
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendLuxuryEmail, buildLuxuryTemplate } from "../util/email"
import { Modules } from "@medusajs/framework/utils"
import type { IOrderModuleService } from "@medusajs/framework/types"

export default async function orderDeliveredEmail({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderId = event.data.id
  const orderService = container.resolve<IOrderModuleService>(Modules.ORDER)
  const order: any = await orderService.retrieveOrder(orderId)

  const body = `
    <p>Dear ${order.shipping_address?.first_name ?? order.email},</p>
    <p>Sweet news! 🍯 Your <strong>Taj Petha</strong> order <strong>#${order.display_id}</strong> has been successfully delivered and is now ready for you to enjoy!</p>
    
    <div class="highlight-box">
      <p><strong>🎉 Your Sweet Treats Have Arrived!</strong></p>
      <p>We hope every bite brings you the authentic taste of Agra's finest traditions. Our artisans have carefully crafted each sweet with the same love and expertise that has been passed down through generations.</p>
    </div>
    
    <p><strong>🍯 How to Enjoy Your Taj Petha:</strong></p>
    <ul style="margin: 16px 0; padding-left: 20px;">
      <li style="margin: 8px 0;">💫 <strong>Fresh Taste:</strong> Best enjoyed within 15-20 days for optimal flavor and texture</li>
      <li style="margin: 8px 0;">🌡️ <strong>Storage Tips:</strong> Keep in a cool, dry place away from direct sunlight</li>
      <li style="margin: 8px 0;">🍃 <strong>Serving Suggestion:</strong> Perfect with a cup of Indian chai or as a sweet ending to your meals</li>
      <li style="margin: 8px 0;">🎁 <strong>Share the Joy:</strong> Great for sharing with family and friends during special moments</li>
    </ul>
    
    <div class="highlight-box">
      <p><strong>❤️ We Value Your Experience</strong></p>
      <p>How did we do? We'd love to hear about your experience with our sweets! Your feedback helps us maintain the high quality that makes Taj Petha special.</p>
    </div>
    
    <p>If you notice anything that doesn't meet our usual standards of excellence, please reach out to us immediately at <strong>support@tajpetha.in</strong>. We stand behind every sweet we make.</p>
    
    <p>Thank you for choosing Taj Petha and for being part of our sweet family. We look forward to serving you again soon with more delicious traditional flavors!</p>
    
    <p style="margin-top: 32px; font-style: italic;">Enjoy every sweet moment!<br/>The Taj Petha Family 🍯</p>
  `

  await sendLuxuryEmail({
    to: order.email as string,
    name: order.shipping_address?.first_name ?? order.email,
    subject: `Sweet Delivery Complete! Order #${order.display_id} - Taj Petha 🍯`,
    html: buildLuxuryTemplate("Your Sweets Have Arrived!", body),
  })
}

export const config: SubscriberConfig = {
  event: "order.completed",
  context: { subscriberId: "order-delivered-email" },
} 