// @ts-ignore
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendLuxuryEmail, buildLuxuryTemplate } from "../util/email"
import { Modules } from "@medusajs/framework/utils"
import type { IOrderModuleService } from "@medusajs/framework/types"

export default async function customerOnboardingEmail({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderId = event.data.id
  
  // ✅ FIX: Add delay to ensure order is fully committed to database
  await new Promise(resolve => setTimeout(resolve, 2000)) // 2 second delay
  
  const orderService = container.resolve<IOrderModuleService>(Modules.ORDER)
  
  // ✅ FIX: Add retry logic with error handling
  let order: any
  try {
    order = await orderService.retrieveOrder(orderId)
  } catch (error) {
    console.error(`[CustomerOnboardingEmail] Failed to retrieve order ${orderId}:`, error)
    return // Silently fail for onboarding email (non-critical)
  }
  
  if (!order) {
    console.warn(`[CustomerOnboardingEmail] Order ${orderId} not found`)
    return
  }
  const customerId = order.customer_id

  const orders = await (orderService as any).listOrders({ customer_id: customerId }, { select: ["id"] })
  if (orders.length > 1) {
    // Not the first order – skip onboarding email
    return
  }

  const body = `
    <p>Dear ${order.shipping_address?.first_name ?? order.email},</p>
    <p>Welcome to the sweet world of <strong>Taj Petha</strong>! 🍯 Thank you for placing your very first order with us. You've just taken your first step into a journey of authentic Agra flavors that have been cherished for generations.</p>
    
    <div class="highlight-box">
      <p><strong>🌟 You've Discovered Something Special!</strong></p>
      <p>Our family has been perfecting the art of sweet-making for decades, using the same traditional recipes and techniques that made Agra famous for its pethas. Each sweet is Hand-Made with love, ensuring you experience the true taste of our heritage.</p>
    </div>
    
    <p><strong>What Makes Taj Petha Special:</strong></p>
    <ul style="margin: 16px 0; padding-left: 20px;">
      <li style="margin: 8px 0;">🏺 <strong>Traditional Recipes:</strong> Passed down through generations of master sweet makers</li>
      <li style="margin: 8px 0;">🌿 <strong>Premium Ingredients:</strong> Only the finest ash gourd, pure sugar, and authentic spices</li>
      <li style="margin: 8px 0;">👨‍🍳 <strong>Hand-Made Excellence:</strong> Each piece lovingly made by experienced artisans</li>
      <li style="margin: 8px 0;">📦 <strong>Fresh Delivery:</strong> Packed with care to preserve taste and texture</li>
    </ul>
    
    <p>Over the coming weeks, we'll share with you:</p>
    <ul style="margin: 16px 0; padding-left: 20px;">
      <li style="margin: 6px 0;">🍯 Stories behind our traditional recipes and the history of Agra sweets</li>
      <li style="margin: 6px 0;">🎉 Exclusive previews of seasonal specialties and festival collections</li>
      <li style="margin: 6px 0;">💡 Tips on how to store and enjoy your pethas for maximum freshness</li>
      <li style="margin: 6px 0;">🎁 Special member-only discounts and offers</li>
    </ul>
    
    <div class="highlight-box">
      <p><strong>💝 A Sweet Surprise Awaits!</strong></p>
      <p>Keep an eye on your inbox for a special welcome discount on your next order. We can't wait to share more of our traditional flavors with you!</p>
    </div>
    
    <p>Thank you for choosing Taj Petha and allowing us to be part of your sweet moments. We're honored to share our family's legacy with yours.</p>
    
    <p style="margin-top: 32px; font-style: italic;">Stay sweet and keep indulging,<br/>The Taj Petha Family 🍯</p>
  `

  await sendLuxuryEmail({
    to: order.email as string,
    // @ts-ignore
    name: order.shipping_address?.first_name ?? order.email,
    subject: "Your Sweet Journey with Taj Petha Begins! 🍯✨",
    html: buildLuxuryTemplate("Welcome to the Taj Petha Family", body),
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
  context: { subscriberId: "customer-onboarding-email" },
} 