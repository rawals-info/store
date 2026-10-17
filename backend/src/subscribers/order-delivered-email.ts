// @ts-ignore
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendLuxuryEmail, buildLuxuryTemplate } from "../util/email"
import { Modules } from "@medusajs/framework/utils"
import type { IOrderModuleService } from "@medusajs/framework/types"

export default async function orderDeliveredEmail({
  event,
  container,
}: SubscriberArgs<{ id?: string; order_id?: string; fulfillment_id?: string; no_notification?: boolean; [key: string]: any }>) {
  if (event.data?.no_notification === true || event.data?.notify === false) {
    console.log(`[DeliveredEmail] Skipping delivered email: admin disabled notification`)
    return
  }

  const eventId = event.data?.id || event.data?.order_id || event.data?.fulfillment_id
  if (!eventId) {
    console.warn(`[DeliveredEmail] No identifier provided in event data:`, event.data)
    return
  }

  console.log(`[DeliveredEmail] Processing delivered email for event: ${event.name}, payload:`, event.data)

  let order: any = null
  const query = container.resolve("query") as any

  // 1. Try to resolve via fulfillment if eventId is a fulfillment (ful_...) or fulfillment_id is provided
  const fulfillmentId = event.data.fulfillment_id || (eventId.startsWith("ful_") ? eventId : undefined)
  if (fulfillmentId && query) {
    try {
      const { data: fulfillments } = await query.graph({
        entity: "fulfillment",
        fields: [
          "id",
          "order.id",
          "order.display_id",
          "order.email",
          "order.created_at",
        ],
        filters: {
          id: fulfillmentId,
        },
      })

      if (fulfillments && fulfillments.length > 0 && fulfillments[0]?.order) {
        order = fulfillments[0].order
      }
    } catch (fErr) {
      console.warn(`[DeliveredEmail] Could not query fulfillment graph:`, fErr)
    }
  }

  // 2. If eventId is a delivery (del_...) or not found yet, try querying delivery graph
  if (!order && eventId.startsWith("del_") && query) {
    try {
      const { data: deliveries } = await query.graph({
        entity: "delivery",
        fields: [
          "id",
          "fulfillment.order.id",
          "fulfillment.order.display_id",
          "fulfillment.order.email",
        ],
        filters: {
          id: eventId,
        },
      })
      if (deliveries && deliveries.length > 0 && deliveries[0]?.fulfillment?.order) {
        order = deliveries[0].fulfillment.order
      }
    } catch (dErr) {
      console.warn(`[DeliveredEmail] Could not query delivery graph:`, dErr)
    }
  }

  // 3. Resolve full order details (items, shipping address) via Order Module
  const orderId = order?.id || event.data.order_id || (!eventId.startsWith("ful_") && !eventId.startsWith("del_") ? eventId : undefined)
  if (orderId) {
    try {
      const orderService = container.resolve<IOrderModuleService>(Modules.ORDER)
      order = await orderService.retrieveOrder(orderId, {
        select: ["id", "display_id", "email", "created_at"],
        relations: ["shipping_address", "items"],
      })
    } catch (orderErr) {
      console.warn(`[DeliveredEmail] Could not retrieve order by ID:`, orderErr)
    }
  }

  if (!order) {
    console.error(`[DeliveredEmail] Order could not be resolved for event payload:`, event.data)
    return
  }

  if (order.no_notification === true) {
    console.log(`[DeliveredEmail] Skipping delivered email: order ${order.id} has no_notification = true`)
    return
  }

  const customerName =
    order.shipping_address?.first_name ||
    order.email?.split("@")[0] ||
    "Valued Customer"
  const displayId = order.display_id ? `${order.display_id}` : order.id

  const body = `
    <!-- Status Header -->
    <div style="text-align: center; margin-bottom: 26px;">
      <div style="display: inline-block; background-color: #ECFDF5; color: #065F46; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; padding: 4px 12px; border-radius: 9999px; margin-bottom: 12px; border: 1px solid #A7F3D0;">
        Delivered &bull; Order #${displayId}
      </div>
      <h1 style="margin: 0 0 8px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 30px; font-weight: 700; color: #0F172A; line-height: 1.2;">
        Your Order Has Been Delivered
      </h1>
      <p style="margin: 0 auto; font-size: 14px; color: #64748B; line-height: 1.6; max-width: 460px;">
        Hello ${customerName}, your Taj Petha order #${displayId} has arrived safely. We hope you and your family enjoy the authentic Agra taste.
      </p>
    </div>

    <!-- Freshness & Storage Advisory -->
    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
      <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 700; color: #B45309; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px;">
        Freshness &amp; Storage Advisory
      </div>
      <div style="font-size: 13px; color: #334155; line-height: 1.7;">
        &bull; <strong>Storage:</strong> Store unopened vacuum packs in a cool, dry place away from heat and direct sunlight.<br>
        &bull; <strong>Serving:</strong> Once opened, transfer to an airtight container and refrigerate. Serve slightly chilled for the best authentic texture.<br>
        &bull; <strong>Best Before:</strong> Consume within 7–10 days of opening for peak aroma and freshness.
      </div>
    </div>

    <!-- Customer Support & Feedback Box -->
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; margin-bottom: 8px;">
      <tr>
        <td style="padding: 20px; text-align: center;">
          <div style="font-size: 14px; font-weight: 700; color: #0F172A; margin-bottom: 6px;">
            How was your sweet experience?
          </div>
          <div style="font-size: 12.5px; color: #64748B; line-height: 1.5; margin-bottom: 14px; max-width: 420px; margin-left: auto; margin-right: auto;">
            Your feedback means the world to our master halwais and helps us preserve our traditional Agra craftsmanship.
          </div>
          <a href="https://wa.me/919259418994?text=Hello%20Taj%20Petha,%20I%20received%20my%20order%20%23${displayId}!%20Here%20is%20my%20feedback:" target="_blank" style="display: inline-block; background-color: #059669; color: #FFFFFF !important; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 700; padding: 10px 24px; border-radius: 6px; text-decoration: none;">
            Share Feedback via WhatsApp (+91 92594 18994)
          </a>
        </td>
      </tr>
    </table>
  `

  await sendLuxuryEmail({
    to: order.email as string,
    name: customerName,
    subject: `Your Taj Petha Order #${displayId} Has Been Delivered`,
    html: buildLuxuryTemplate("Order Delivered", body),
  })

  console.log(`[DeliveredEmail] Delivered notification sent successfully to ${order.email}`)
}

export const config: SubscriberConfig = {
  event: ["delivery.created", "order.completed"],
  context: { subscriberId: "order-delivered-email" },
}