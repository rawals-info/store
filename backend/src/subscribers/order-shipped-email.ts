// @ts-ignore
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import {
  sendLuxuryEmail,
  buildLuxuryTemplate,
  buildHeroStatusCard,
  buildParagraph,
  buildStrong,
  buildSignOff,
} from "../util/email"
import { Modules } from "@medusajs/framework/utils"
import type { IOrderModuleService } from "@medusajs/framework/types"

export default async function orderShippedEmail({
  event,
  container,
}: SubscriberArgs<{ order_id?: string; id?: string; fulfillment_id?: string; no_notification?: boolean; [key: string]: any }>) {
  // Check if admin explicitly toggled OFF "Send notification"
  if (event.data?.no_notification === true || event.data?.notify === false) {
    console.log(`[ShippingEmail] Skipping shipping email: admin disabled notification for order ${event.data.order_id || event.data.id}`)
    return
  }

  const orderId = event.data.order_id || event.data.id
  if (!orderId) {
    console.warn(`[ShippingEmail] No order_id provided in event data:`, event.data)
    return
  }

  console.log(`[ShippingEmail] Processing order ${orderId}`)

  // Also check if the created fulfillment has no_notification enabled
  if (event.data.fulfillment_id) {
    try {
      const fulfillmentService = container.resolve(Modules.FULFILLMENT) as any
      const fulfillment = await fulfillmentService.retrieveFulfillment(event.data.fulfillment_id)
      if (fulfillment?.no_notification === true || (fulfillment as any)?.data?.no_notification === true) {
        console.log(`[ShippingEmail] Skipping shipping email: fulfillment ${event.data.fulfillment_id} marked no_notification = true`)
        return
      }
    } catch (err) {
      // Non-blocking fallback
    }
  }

  const orderService = container.resolve<IOrderModuleService>(Modules.ORDER)
  const order: any = await orderService.retrieveOrder(orderId, {
    select: ["id", "display_id", "email", "created_at"],
    relations: ["shipping_address", "items"],
  })

  if (!order) {
    console.error(`[ShippingEmail] Order ${orderId} not found`)
    return
  }

  // Check if order fulfillment has no_notification flag
  if (order.no_notification === true) {
    console.log(`[ShippingEmail] Skipping shipping email: order ${orderId} has no_notification = true`)
    return
  }

  const customerName =
    order.shipping_address?.first_name ||
    order.email?.split("@")[0] ||
    "Valued Customer"
  const displayId = order.display_id ? `${order.display_id}` : orderId

  const items: any[] = Array.isArray(order.items) ? order.items : []
  const itemsHtml = items
    .map((it: any, index: number) => {
      const variantInfo = it.variant_title || it.variant_sku || ""
      const variantDisplay =
        variantInfo && variantInfo !== "Default variant" && variantInfo !== it.title
          ? `<div style="font-size: 11px; color: #64748B;">Pack: <strong>${variantInfo}</strong></div>`
          : ""
      const isLast = index === items.length - 1

      return `
        <tr>
          <td style="padding: 12px 16px; ${isLast ? "" : "border-bottom: 1px solid #EAE3D9;"}">
            <table width="100%" border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td width="36" valign="top">
                  <div style="width: 32px; height: 32px; border-radius: 8px; background-color: #FEF3C7; text-align: center; line-height: 32px; font-size: 16px;">
                    🍃
                  </div>
                </td>
                <td style="padding-left: 10px;">
                  <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 16px; font-weight: 700; color: #0F172A;">
                    ${it.title}
                  </div>
                  ${variantDisplay}
                  <div style="font-size: 11px; color: #64748B;">Qty: <strong>${it.quantity}</strong></div>
                </td>
              </tr>
            </table>
          </td>
        </tr>`
    })
    .join("")

  const addr = order.shipping_address || {}
  const addressText = [
    [addr.first_name, addr.last_name].filter(Boolean).join(" "),
    addr.address_1,
    addr.address_2,
    `${addr.city ?? ""} ${addr.postal_code ?? ""}`.trim(),
    addr.phone ? `📞 ${addr.phone}` : undefined,
  ]
    .filter(Boolean)
    .join("<br>")

  const body = `
    ${buildHeroStatusCard({
      icon: "🚀",
      title: "Your Order is On Its Way!",
      subtitle: `Dear ${customerName}, your fresh batch has been packed and handed over to our express air courier.`,
      orderId: displayId,
      badgeText: "⚡ In Transit to Destination",
    })}

    <!-- Simple Elegant Stepper -->
    <div style="margin-bottom: 20px; padding: 12px; background-color: #F8FAFC; border-radius: 14px; border: 1px solid #E2E8F0;">
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td width="33%" align="center" style="font-size: 11px; font-weight: 700; color: #059669;">
            ✓ Ordered
          </td>
          <td width="34%" align="center" style="font-size: 11px; font-weight: 800; color: #D97706; border-left: 1px solid #E2E8F0; border-right: 1px solid #E2E8F0;">
            ⚡ Dispatched
          </td>
          <td width="33%" align="center" style="font-size: 11px; font-weight: 600; color: #94A3B8;">
            📦 Out for Delivery
          </td>
        </tr>
      </table>
    </div>

    <!-- Items in Shipment -->
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 10px;">
      <tr>
        <td>
          <h3 style="margin: 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18px; font-weight: 700; color: #0F172A; text-transform: uppercase; letter-spacing: 1px;">
            Items in This Parcel
          </h3>
        </td>
      </tr>
    </table>

    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background: #FAF8F5; border-radius: 16px; border: 1px solid #EFE8DE; overflow: hidden; margin-bottom: 18px;">
      ${itemsHtml}
    </table>

    <!-- 2-Column Section: Destination & Freshness Tips -->
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top: 14px;">
      <tr>
        <td class="two-col" width="48%" valign="top" style="background: #FAF8F5; border: 1px solid #EFE8DE; border-radius: 16px; padding: 16px 18px;">
          <div style="font-size: 10px; font-weight: 800; color: #92400E; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
            📍 Delivering To
          </div>
          <div style="font-size: 12px; color: #334155; line-height: 1.5;">
            ${addressText || "Address on File"}
          </div>
        </td>
        
        <td width="4%" class="two-col" height="12">&nbsp;</td>

        <td class="two-col" width="48%" valign="top" style="background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 16px; padding: 16px 18px;">
          <div style="font-size: 10px; font-weight: 800; color: #065F46; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
            ❄️ Storage &amp; Serving Tip
          </div>
          <div style="font-size: 12px; color: #047857; line-height: 1.5;">
            &bull; Keep away from direct heat<br>
            &bull; Refrigerate after opening seal<br>
            &bull; Best enjoyed chilled!
          </div>
        </td>
      </tr>
    </table>

    <!-- WhatsApp Support Option -->
    <div style="margin-top: 22px; text-align: center;">
      <a href="https://wa.me/919876543210?text=Hi%20Taj%20Petha,%20I%20have%20a%20question%20about%20delivery%20for%20order%20${displayId}" class="whatsapp-button">
        💬 Delivery Question? Chat on WhatsApp
      </a>
    </div>

    ${buildSignOff()}
  `

  await sendLuxuryEmail({
    to: order.email as string,
    name: customerName,
    subject: `Your Order #${displayId} Has Been Dispatched - Taj Petha Agra`,
    html: buildLuxuryTemplate("Order Dispatched", body),
  })

  console.log(`[ShippingEmail] Shipping notification sent successfully to ${order.email}`)
}

export const config: SubscriberConfig = {
  event: "order.fulfillment_created",
  context: { subscriberId: "order-shipped-email" },
}