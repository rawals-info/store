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
import { Modules } from "@medusajs/framework/utils"
import type { IOrderModuleService } from "@medusajs/framework/types"

export default async function customerOnboardingEmail({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderId = event.data.id

  const orderService = container.resolve<IOrderModuleService>(Modules.ORDER)

  // Smart retry strategy: Try immediately, then retry up to 3 times over 15 seconds (non-critical)
  let order: any = null
  const maxAttempts = 4 // Fewer retries for non-critical email
  const delays = [0, 5000, 10000, 15000]

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      if (delays[attempt] > 0) {
        console.log(`[CustomerOnboardingEmail] Retry ${attempt}/${maxAttempts - 1} after ${delays[attempt] / 1000}s for order ${orderId}`)
        await new Promise(resolve => setTimeout(resolve, delays[attempt] - (attempt > 0 ? delays[attempt - 1] : 0)))
      } else {
        console.log(`[CustomerOnboardingEmail] Attempting immediate retrieval for order ${orderId}`)
      }

      order = await orderService.retrieveOrder(orderId)
      console.log(`[CustomerOnboardingEmail] Order ${orderId} retrieved successfully`)
      break

    } catch (error) {
      if (attempt === maxAttempts - 1) {
        console.error(`[CustomerOnboardingEmail] Failed to retrieve order ${orderId} after ${maxAttempts} attempts - skipping (non-critical)`)
        return // Silently fail for onboarding email
      }
    }
  }

  if (!order) {
    console.warn(`[CustomerOnboardingEmail] Order ${orderId} not found after retries - skipping`)
    return
  }
  const customerId = order.customer_id

  const orders = await (orderService as any).listOrders({ customer_id: customerId }, { select: ["id"] })
  if (orders.length > 1) {
    // Not the first order – skip onboarding email
    return
  }

  const customerName = order.shipping_address?.first_name ?? order.email

  const body = `
    ${buildParagraph(`Dear ${buildStrong(customerName)},`)}
    
    ${buildParagraph(`Welcome to the world of ${buildStrong("Taj Petha")}. Thank you for placing your first order with us. You have taken your first step into a journey of authentic Agra flavours that have been cherished for generations.`)}
    
    ${buildInfoBox("You Have Discovered Something Special", `
      <p style="font-size: 14px; color: #4A4A4A; margin: 0;">Our family has been perfecting the art of sweet-making for decades, using the same traditional recipes and techniques that made Agra famous for its pethas. Each sweet is handcrafted with care, ensuring you experience the true taste of our heritage.</p>
    `)}
    
    <h2 style="font-family: 'Georgia', serif; font-size: 14px; font-weight: 400; color: #1A1A1A; margin: 32px 0 16px 0; letter-spacing: 2px; text-transform: uppercase;">What Makes Taj Petha Special</h2>
    
    ${buildList([
    "<strong>Traditional Recipes:</strong> Passed down through generations of master sweet makers",
    "<strong>Premium Ingredients:</strong> Only the finest ash gourd, pure sugar, and authentic spices",
    "<strong>Handcrafted Excellence:</strong> Each piece lovingly made by experienced artisans",
    "<strong>Fresh Delivery:</strong> Packed with care to preserve taste and texture"
  ])}
    
    <h2 style="font-family: 'Georgia', serif; font-size: 14px; font-weight: 400; color: #1A1A1A; margin: 32px 0 16px 0; letter-spacing: 2px; text-transform: uppercase;">What to Look Forward To</h2>
    
    ${buildList([
    "Stories behind our traditional recipes and the history of Agra sweets",
    "Exclusive previews of seasonal specialties and festival collections",
    "Tips on how to store and enjoy your pethas for maximum freshness",
    "Special member-only discounts and offers"
  ])}
    
    ${buildInfoBox("A Special Welcome Awaits", `
      <p style="font-size: 14px; color: #4A4A4A; margin: 0;">Keep an eye on your inbox for a special welcome discount on your next order. We look forward to sharing more of our traditional flavours with you.</p>
    `)}
    
    ${buildParagraph("Thank you for choosing Taj Petha and allowing us to be part of your sweet moments. We are honoured to share our family's legacy with yours.")}
    
    ${buildSignOff()}
  `

  await sendLuxuryEmail({
    to: order.email as string,
    // @ts-ignore
    name: customerName,
    subject: "Your Journey with Taj Petha Begins",
    html: buildLuxuryTemplate("Welcome to the Taj Petha Family", body),
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
  context: { subscriberId: "customer-onboarding-email" },
}