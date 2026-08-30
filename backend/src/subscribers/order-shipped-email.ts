// @ts-ignore
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendLuxuryEmail, buildLuxuryTemplate } from "../util/email"
import { Modules } from "@medusajs/framework/utils"
import type { IOrderModuleService } from "@medusajs/framework/types"

interface TrackingInfo {
  courierName: string
  trackingNumber: string
  trackingUrl: string
  hasTracking: boolean
}

function parseTracking(rawTracking: string | undefined): TrackingInfo {
  if (!rawTracking || !rawTracking.trim()) {
    return {
      courierName: "Express Air Cargo",
      trackingNumber: "Dispatched & Handed Over",
      trackingUrl: "",
      hasTracking: false,
    }
  }

  const trimmed = rawTracking.trim()

  // 1. AfterShip URL: https://www.aftership.com/track?c=dtdc&t=U2000344964
  if (trimmed.includes("aftership.com/track")) {
    try {
      const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`)
      const courierCode = url.searchParams.get("c") || "Express Air"
      const trackingNum = url.searchParams.get("t") || trimmed

      const courierMap: Record<string, string> = {
        dtdc: "DTDC Express Air",
        delhivery: "Delhivery Air",
        bluedart: "BlueDart Express",
        shiprocket: "Shiprocket Express",
        xpressbees: "Xpressbees",
        ecom: "Ecom Express",
        indiapost: "India Post Speed Post",
        shadowfax: "Shadowfax",
      }

      const formattedCourier = courierMap[courierCode.toLowerCase()] || `${courierCode.toUpperCase()} Express`

      return {
        courierName: formattedCourier,
        trackingNumber: trackingNum,
        trackingUrl: trimmed.startsWith("http") ? trimmed : `https://${trimmed}`,
        hasTracking: true,
      }
    } catch {
      // fallback
    }
  }

  // 2. Direct courier tracking URL (Delhivery, BlueDart, Shiprocket, DTDC, etc.)
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const url = new URL(trimmed)
      let courier = "Express Air Courier"
      if (url.hostname.includes("delhivery")) courier = "Delhivery Air"
      else if (url.hostname.includes("bluedart")) courier = "BlueDart Express"
      else if (url.hostname.includes("dtdc")) courier = "DTDC Express Air"
      else if (url.hostname.includes("shiprocket")) courier = "Shiprocket Express"
      else if (url.hostname.includes("indiapost")) courier = "India Post Speed Post"

      const lastSegment = trimmed.split(/[/?&=#]/).filter(Boolean).pop() || "Tracking Link"

      return {
        courierName: courier,
        trackingNumber: lastSegment,
        trackingUrl: trimmed,
        hasTracking: true,
      }
    } catch {}
  }

  // 3. Raw AWB / Tracking code (e.g. U2000344964)
  return {
    courierName: "Express Air Courier",
    trackingNumber: trimmed,
    trackingUrl: `https://www.aftership.com/track?t=${encodeURIComponent(trimmed)}`,
    hasTracking: true,
  }
}

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

  console.log(`[ShippingEmail] Processing shipping email for order ${orderId}`)

  let rawTracking = ""

  // Extract tracking information from fulfillment
  const fulfillmentId = event.data.fulfillment_id || (event.data.id && event.data.id.startsWith("ful_") ? event.data.id : undefined)
  if (fulfillmentId) {
    try {
      const fulfillmentService = container.resolve(Modules.FULFILLMENT) as any
      const fulfillment = await fulfillmentService.retrieveFulfillment(fulfillmentId, {
        relations: ["labels"],
      })

      if (fulfillment?.no_notification === true || (fulfillment as any)?.data?.no_notification === true) {
        console.log(`[ShippingEmail] Skipping shipping email: fulfillment marked no_notification = true`)
        return
      }

      if (fulfillment?.labels && Array.isArray(fulfillment.labels) && fulfillment.labels.length > 0) {
        rawTracking = fulfillment.labels[0].tracking_number || fulfillment.labels[0].tracking_url || ""
      } else if (fulfillment?.data?.tracking_number) {
        rawTracking = String(fulfillment.data.tracking_number)
      }
    } catch (err) {
      console.warn(`[ShippingEmail] Non-blocking: Could not retrieve fulfillment labels:`, err)
    }
  }

  if (!rawTracking && event.data.tracking_number) {
    rawTracking = String(event.data.tracking_number)
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

  if (order.no_notification === true) {
    console.log(`[ShippingEmail] Skipping shipping email: order ${orderId} has no_notification = true`)
    return
  }

  const customerName =
    order.shipping_address?.first_name ||
    order.email?.split("@")[0] ||
    "Valued Customer"
  const displayId = order.display_id ? `${order.display_id}` : orderId

  const tracking = parseTracking(rawTracking)

  const items: any[] = Array.isArray(order.items) ? order.items : []
  const itemsHtml = items
    .map((it: any, index: number) => {
      const variantInfo = it.variant_title || it.variant_sku || ""
      const variantDisplay =
        variantInfo && variantInfo !== "Default variant" && variantInfo !== it.title
          ? `<div style="font-size: 12px; color: #64748B; margin-top: 3px;">Pack: <strong style="color: #334155;">${variantInfo}</strong></div>`
          : ""
      const isLast = index === items.length - 1

      return `
        <tr>
          <td style="padding: 16px; ${isLast ? "" : "border-bottom: 1px solid #EFE8DE;"}">
            <table width="100%" border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td width="42" valign="top">
                  <div style="width: 38px; height: 38px; border-radius: 10px; background-color: #FEF3C7; text-align: center; line-height: 38px; font-size: 18px; border: 1px solid #FDE68A;">
                    🍬
                  </div>
                </td>
                <td style="padding-left: 12px;" valign="top">
                  <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 16px; font-weight: 700; color: #0F172A; line-height: 1.2;">
                    ${it.title}
                  </div>
                  ${variantDisplay}
                </td>
                <td align="right" valign="top" style="font-size: 13px; font-weight: 700; color: #0F172A; white-space: nowrap;">
                  Qty: ${it.quantity}
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
    addr.phone ? `Phone: ${addr.phone}` : undefined,
  ]
    .filter(Boolean)
    .join("<br>")

  const trackingButtonHtml = tracking.trackingUrl
    ? `
      <div style="text-align: center; margin-top: 16px;">
        <a href="${tracking.trackingUrl}" target="_blank" style="display: block; background: #D97706; color: #FFFFFF !important; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 15px 28px; border-radius: 12px; text-align: center; text-decoration: none; box-shadow: 0 4px 14px rgba(217, 119, 6, 0.28);">
          Track Live Shipment &rarr;
        </a>
        <div style="font-size: 11px; color: #94A3B8; margin-top: 8px;">
          Direct real-time GPS tracking &amp; checkpoint updates
        </div>
      </div>
    `
    : `
      <div style="font-size: 12px; color: #64748B; text-align: center; margin-top: 10px;">
        Your parcel is in express air transit to your delivery address.
      </div>
    `

  const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Order #${displayId} Has Been Dispatched - Taj Petha</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
    body { margin: 0; padding: 0; background-color: #F5EFEB; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1E293B; }
    table { border-collapse: collapse; }
    a { text-decoration: none; }
    @media only screen and (max-width: 620px) {
      .email-wrapper { width: 100% !important; border-radius: 0 !important; border: none !important; }
      .content-cell { padding: 24px 18px !important; }
      .two-col { display: block !important; width: 100% !important; box-sizing: border-box !important; }
      .two-col-gap { display: none !important; }
      .hero-heading { font-size: 30px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 32px 0; background-color: #F5EFEB;">

  <center>
    <table class="email-wrapper" width="600" border="0" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 24px; overflow: hidden; border: 1px solid #EAE1D5; box-shadow: 0 20px 40px -15px rgba(45, 24, 7, 0.08); text-align: left;">
      
      <!-- Brand Header -->
      <tr>
        <td style="background-color: #FAF8F5; padding: 28px 32px 24px 32px; text-align: center; border-bottom: 1px solid #EFE8DE;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center">
                <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 32px; font-weight: 700; color: #0F172A; letter-spacing: 3px; text-transform: uppercase; line-height: 1;">
                  TAJ PETHA
                </div>
                <div style="font-size: 10px; font-weight: 700; color: #B45309; letter-spacing: 2px; text-transform: uppercase; margin-top: 6px;">
                  Original Agra Sweet Kitchen &bull; Direct Fresh Dispatch
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Main Body Container -->
      <tr>
        <td class="content-cell" style="padding: 36px 32px;">

          <!-- Order Status Header -->
          <div style="text-align: center; margin-bottom: 28px;">
            <div style="display: inline-block; background-color: #FEF3C7; border: 1px solid #FDE68A; color: #92400E; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 5px 14px; border-radius: 9999px; margin-bottom: 12px;">
              Shipment Update &bull; Order #${displayId}
            </div>
            <h1 class="hero-heading" style="margin: 0 0 10px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 36px; font-weight: 700; color: #0F172A; line-height: 1.15;">
              Your Fresh Sweets Are On The Way
            </h1>
            <p style="margin: 0 auto; font-size: 14px; color: #64748B; line-height: 1.6; max-width: 460px;">
              Dear ${customerName}, your sweet batch has been prepared, vacuum-sealed for 30-day freshness, and handed over for express air transit.
            </p>
          </div>

          <!-- Minimalist Stepper -->
          <div style="background-color: #FAF8F5; border: 1px solid #EFE8DE; border-radius: 16px; padding: 14px 16px; margin-bottom: 28px;">
            <table width="100%" border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td width="33%" align="center" style="font-size: 11px; font-weight: 600; color: #059669;">
                  <span style="display: inline-block; width: 6px; height: 6px; background-color: #059669; border-radius: 50%; margin-right: 5px; vertical-align: middle;"></span>Order Placed
                </td>
                <td width="34%" align="center" style="font-size: 11px; font-weight: 800; color: #D97706; border-left: 1px solid #EFE8DE; border-right: 1px solid #EFE8DE;">
                  <span style="display: inline-block; width: 6px; height: 6px; background-color: #D97706; border-radius: 50%; margin-right: 5px; vertical-align: middle;"></span>Dispatched
                </td>
                <td width="33%" align="center" style="font-size: 11px; font-weight: 500; color: #94A3B8;">
                  <span style="display: inline-block; width: 6px; height: 6px; background-color: #CBD5E1; border-radius: 50%; margin-right: 5px; vertical-align: middle;"></span>Out for Delivery
                </td>
              </tr>
            </table>
          </div>

          <!-- Courier & Live Tracking Card -->
          <div style="background-color: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 18px; padding: 24px; margin-bottom: 32px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);">
            
            <div style="font-size: 11px; font-weight: 800; color: #B45309; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 14px;">
              Courier &amp; Tracking Details
            </div>

            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 14px;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #F1F5F9; font-size: 13px; color: #64748B;">
                  Courier Partner
                </td>
                <td align="right" style="padding: 10px 0; border-bottom: 1px solid #F1F5F9; font-size: 13px; font-weight: 700; color: #0F172A;">
                  ${tracking.courierName}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #F1F5F9; font-size: 13px; color: #64748B;">
                  AWB / Tracking Number
                </td>
                <td align="right" style="padding: 10px 0; border-bottom: 1px solid #F1F5F9; font-family: 'JetBrains Mono', monospace, Consolas; font-size: 13px; font-weight: 700; color: #D97706;">
                  ${tracking.trackingNumber}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-size: 13px; color: #64748B;">
                  Transit Status
                </td>
                <td align="right" style="padding: 10px 0; font-size: 13px; font-weight: 700; color: #059669;">
                  In Transit to Destination
                </td>
              </tr>
            </table>

            ${trackingButtonHtml}
          </div>

          <!-- Items in This Parcel Section -->
          <div style="margin-bottom: 28px;">
            <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 20px; font-weight: 700; color: #0F172A; margin-bottom: 12px; letter-spacing: 0.5px;">
              Items in This Parcel
            </div>

            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FAF8F5; border: 1px solid #EFE8DE; border-radius: 16px; overflow: hidden;">
              ${itemsHtml}
            </table>
          </div>

          <!-- 2-Column: Destination & Storage Instructions -->
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
            <tr>
              <td class="two-col" width="48%" valign="top" style="background-color: #FAF8F5; border: 1px solid #EFE8DE; border-radius: 16px; padding: 18px;">
                <div style="font-size: 10px; font-weight: 800; color: #B45309; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                  Delivery Address
                </div>
                <div style="font-size: 12.5px; color: #334155; line-height: 1.6;">
                  ${addressText || "Address on File"}
                </div>
              </td>

              <td width="4%" class="two-col-gap">&nbsp;</td>

              <td class="two-col" width="48%" valign="top" style="background-color: #FAF8F5; border: 1px solid #EFE8DE; border-radius: 16px; padding: 18px;">
                <div style="font-size: 10px; font-weight: 800; color: #059669; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                  Freshness Guarantee
                </div>
                <div style="font-size: 12.5px; color: #334155; line-height: 1.6;">
                  &bull; Sealed in 3-layer vacuum pack<br>
                  &bull; Stays fresh for 30 days<br>
                  &bull; Refrigerate after opening seal
                </div>
              </td>
            </tr>
          </table>

          <!-- Customer Support Assistance Box -->
          <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px; padding: 16px 20px; text-align: center;">
            <div style="font-size: 12.5px; color: #475569; font-weight: 600; margin-bottom: 10px;">
              Have questions about your parcel or delivery schedule?
            </div>
            <a href="https://wa.me/919876543210?text=Hi%20Taj%20Petha,%20I%20have%20a%20question%20about%20delivery%20for%20order%20${displayId}" style="display: inline-block; background-color: #22C55E; color: #FFFFFF; font-size: 12px; font-weight: 700; padding: 9px 20px; border-radius: 9999px; text-decoration: none;">
              💬 WhatsApp Support (+91 98765 43210)
            </a>
          </div>

        </td>
      </tr>

      <!-- Luxury Footer -->
      <tr>
        <td style="background-color: #FAF8F5; padding: 28px 32px; text-align: center; border-top: 1px solid #EFE8DE;">
          <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18px; font-weight: 700; color: #0F172A; margin-bottom: 4px;">
            Taj Petha
          </div>
          <div style="font-size: 11px; color: #64748B; line-height: 1.6;">
            Handcrafted with pride in Agra 282001, Uttar Pradesh, India<br>
            Official Store: <a href="https://tajpetha.in" style="color: #D97706; font-weight: 600;">https://tajpetha.in</a> &bull; Email: <a href="mailto:support@tajpetha.in" style="color: #D97706; font-weight: 600;">support@tajpetha.in</a>
          </div>
          <div style="font-size: 10px; color: #94A3B8; margin-top: 12px;">
            &copy; 2026 Taj Petha. All rights reserved. 100% Vegetarian Authentic Sweets.
          </div>
        </td>
      </tr>

    </table>
  </center>

</body>
</html>`

  await sendLuxuryEmail({
    to: order.email as string,
    name: customerName,
    subject: `Your Order #${displayId} Has Been Dispatched - Taj Petha Agra`,
    html: emailHtml,
  })

  console.log(`[ShippingEmail] Shipping notification sent successfully to ${order.email}`)
}

export const config: SubscriberConfig = {
  event: "order.fulfillment_created",
  context: { subscriberId: "order-shipped-email" },
}