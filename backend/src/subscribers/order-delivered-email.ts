// @ts-ignore
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import {
  sendLuxuryEmail,
  buildLuxuryTemplate,
  buildHeroStatusCard,
  buildParagraph,
  buildStrong,
  buildSignOff,
  buildList,
} from "../util/email"
import { Modules } from "@medusajs/framework/utils"
import type { IOrderModuleService } from "@medusajs/framework/types"

export default async function orderDeliveredEmail({
  event,
  container,
}: SubscriberArgs<{ id?: string; order_id?: string; no_notification?: boolean; [key: string]: any }>) {
  if (event.data?.no_notification === true || event.data?.notify === false) {
    console.log(`[DeliveredEmail] Skipping delivered email: admin disabled notification`)
    return
  }

  const orderId = event.data.id || event.data.order_id
  if (!orderId) return

  const orderService = container.resolve<IOrderModuleService>(Modules.ORDER)
  const order: any = await orderService.retrieveOrder(orderId, {
    select: ["id", "display_id", "email"],
    relations: ["shipping_address"],
  })

  if (!order || order.no_notification === true) return

  const customerName =
    order.shipping_address?.first_name ||
    order.email?.split("@")[0] ||
    "Valued Customer"
  const displayId = order.display_id ? `${order.display_id}` : orderId

  const body = `
    ${buildHeroStatusCard({
      icon: "🎉",
      title: "Your Sweets Have Arrived!",
      subtitle: `Dear ${customerName}, your Taj Petha order #${displayId} has been successfully delivered.`,
      orderId: displayId,
      badgeText: "✅ Successfully Delivered",
    })}

    <div style="background: #FFFDF9; border: 1px solid #FDE68A; border-radius: 16px; padding: 20px; margin-bottom: 20px;">
      <h3 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18px; font-weight: 700; color: #0F172A; margin: 0 0 10px 0;">
        Serving &amp; Enjoyment Tips
      </h3>
      ${buildList([
        "<strong>Refrigerate for Extra Melt:</strong> Serve slightly chilled for the signature Agra syrup burst.",
        "<strong>Best Before:</strong> Enjoy within 15–20 days for peak aroma and freshness.",
        "<strong>Zero Preservatives:</strong> Always store in an airtight container away from direct sunlight.",
      ])}
    </div>

    <!-- WhatsApp Review / Support -->
    <div style="margin-top: 22px; text-align: center;">
      <a href="https://wa.me/919876543210?text=Hi%20Taj%20Petha,%20I%20received%20my%20order%20${displayId}!%20Here%20is%20my%20feedback:" class="whatsapp-button">
        ⭐ Tell Us How You Liked Your Sweets!
      </a>
    </div>

    ${buildSignOff()}
  `

  await sendLuxuryEmail({
    to: order.email as string,
    name: customerName,
    subject: `Delivered! Enjoy Your Taj Petha Sweets (Order #${displayId})`,
    html: buildLuxuryTemplate("Order Delivered", body),
  })
}

export const config: SubscriberConfig = {
  event: "order.completed",
  context: { subscriberId: "order-delivered-email" },
}