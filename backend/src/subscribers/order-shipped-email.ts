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

  // 1. AfterShip URL:
  // e.g. https://www.aftership.com/track/dtdc/D4000936801?
  // or   https://www.aftership.com/track?c=dtdc&t=D4000936801
  if (trimmed.includes("aftership.com/track")) {
    try {
      const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`)
      let courierCode = url.searchParams.get("c") || ""
      let trackingNum = url.searchParams.get("t") || ""

      if (!trackingNum) {
        // Path format: /track/:courier/:trackingNumber
        const segments = url.pathname.split("/").filter(Boolean)
        const trackIdx = segments.indexOf("track")
        if (trackIdx !== -1 && segments.length > trackIdx + 2) {
          courierCode = segments[trackIdx + 1]
          trackingNum = segments[trackIdx + 2]
        } else if (trackIdx !== -1 && segments.length > trackIdx + 1) {
          trackingNum = segments[trackIdx + 1]
        }
      }

      const formattedCourier = courierCode
        ? (courierMap[courierCode.toLowerCase()] || `${courierCode.toUpperCase()} Express`)
        : "Express Air Courier"

      const cleanTrackingNum = trackingNum ? trackingNum.replace(/[?&#/].*$/, "") : "Live Tracking"
      const cleanUrl = courierCode && cleanTrackingNum !== "Live Tracking"
        ? `https://www.aftership.com/track/${courierCode.toLowerCase()}/${cleanTrackingNum}`
        : (trimmed.startsWith("http") ? trimmed.replace(/\?+$/, "") : `https://${trimmed}`.replace(/\?+$/, ""))

      return {
        courierName: formattedCourier,
        trackingNumber: cleanTrackingNum,
        trackingUrl: cleanUrl,
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

      const lastSegment = url.pathname.split("/").filter(Boolean).pop() || url.searchParams.get("t") || "Live Tracking"

      return {
        courierName: courier,
        trackingNumber: lastSegment.replace(/[?&#/].*$/, ""),
        trackingUrl: trimmed.replace(/\?+$/, ""),
        hasTracking: true,
      }
    } catch {}
  }

  // 3. Raw AWB / Tracking code (e.g. D4000936801)
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
    console.log(`[ShippingEmail] Skipping shipping email: admin disabled notification for ${event.data.order_id || event.data.id}`)
    return
  }

  const eventId = event.data.id || event.data.order_id || event.data.fulfillment_id
  if (!eventId) {
    console.warn(`[ShippingEmail] No identifier provided in event data:`, event.data)
    return
  }

  console.log(`[ShippingEmail] Processing shipping email for event payload:`, event.data)

  let rawTracking = ""
  let order: any = null

  // In shipment.created, event.data.id is the fulfillment id (e.g. ful_...)
  const fulfillmentId = event.data.fulfillment_id || (eventId.startsWith("ful_") ? eventId : undefined)
  const query = container.resolve("query") as any

  if (fulfillmentId) {
    try {
      // Query fulfillment and linked order via remote query graph
      const { data: fulfillments } = await query.graph({
        entity: "fulfillment",
        fields: [
          "id",
          "labels.*",
          "order.id",
          "order.display_id",
          "order.email",
          "order.created_at",
        ],
        filters: {
          id: fulfillmentId,
        },
      })

      if (fulfillments && fulfillments.length > 0) {
        const matchedFulfillment = fulfillments[0]
        if (matchedFulfillment?.labels && Array.isArray(matchedFulfillment.labels) && matchedFulfillment.labels.length > 0) {
          rawTracking = matchedFulfillment.labels[0].tracking_number || matchedFulfillment.labels[0].tracking_url || ""
        }
        if (matchedFulfillment?.order) {
          order = matchedFulfillment.order
        }
      }
    } catch (err) {
      console.warn(`[ShippingEmail] Could not query fulfillment graph:`, err)
    }

    // Fallback: check fulfillment module directly if labels not found
    if (!rawTracking) {
      try {
        const fulfillmentService = container.resolve(Modules.FULFILLMENT) as any
        const fulfillment = await fulfillmentService.retrieveFulfillment(fulfillmentId, {
          relations: ["labels"],
        })
        if (fulfillment?.labels && Array.isArray(fulfillment.labels) && fulfillment.labels.length > 0) {
          rawTracking = fulfillment.labels[0].tracking_number || fulfillment.labels[0].tracking_url || ""
        } else if (fulfillment?.data?.tracking_number) {
          rawTracking = String(fulfillment.data.tracking_number)
        }
      } catch (fErr) {
        console.warn(`[ShippingEmail] Could not retrieve fulfillment labels via service:`, fErr)
      }
    }
  }

  // Resolve full order details (items, shipping address)
  const orderId = order?.id || event.data.order_id || (!eventId.startsWith("ful_") ? eventId : undefined)
  if (orderId) {
    try {
      const orderService = container.resolve<IOrderModuleService>(Modules.ORDER)
      order = await orderService.retrieveOrder(orderId, {
        select: ["id", "display_id", "email", "created_at"],
        relations: ["shipping_address", "items"],
      })
    } catch (orderErr) {
      console.warn(`[ShippingEmail] Could not retrieve order by ID:`, orderErr)
    }
  }

  if (!rawTracking && event.data.tracking_number) {
    rawTracking = String(event.data.tracking_number)
  }

  if (!order) {
    console.error(`[ShippingEmail] Order could not be resolved for event ID ${eventId}`)
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
          ? `<div style="font-size: 12px; color: #64748B; margin-top: 3px;">Pack: <span style="color: #1E293B; font-weight: 600;">${variantInfo}</span></div>`
          : ""
      const isLast = index === items.length - 1

      const thumbnailHtml = it.thumbnail
        ? `<img src="${it.thumbnail}" alt="${it.title}" width="52" height="52" style="width: 52px; height: 52px; border-radius: 8px; object-fit: cover; display: block; border: 1px solid #E2E8F0;" />`
        : `<table width="52" height="52" cellpadding="0" cellspacing="0" border="0" style="width: 52px; height: 52px; border-radius: 8px; background-color: #F8FAFC; border: 1px solid #E2E8F0; text-align: center;"><tr><td align="center" valign="middle" style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 10px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px;">BOX</td></tr></table>`

      return `
        <tr>
          <td style="padding: 16px; ${isLast ? "" : "border-bottom: 1px solid #F1F5F9;"}">
            <table width="100%" border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td width="56" valign="top">
                  ${thumbnailHtml}
                </td>
                <td style="padding-left: 14px;" valign="top">
                  <div style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 14px; font-weight: 600; color: #0F172A; line-height: 1.35;">
                    ${it.title}
                  </div>
                  ${variantDisplay}
                  <div style="font-size: 12px; color: #64748B; margin-top: 4px;">
                    Quantity: <strong style="color: #0F172A;">${it.quantity}</strong>
                  </div>
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
        <a href="${tracking.trackingUrl}" target="_blank" style="display: block; background-color: #B45309; color: #FFFFFF !important; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; padding: 14px 24px; border-radius: 8px; text-align: center; text-decoration: none;">
          Track Shipment &rarr;
        </a>
        <div style="font-size: 11px; color: #94A3B8; margin-top: 8px;">
          Live checkpoint tracking powered by ${tracking.courierName}
        </div>
      </div>
    `
    : `
      <div style="font-size: 12px; color: #64748B; text-align: center; margin-top: 10px;">
        Your parcel is in transit to your delivery address.
      </div>
    `

  const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Taj Petha Order #${displayId} Has Been Dispatched</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
    body { margin: 0; padding: 0; background-color: #F8F6F2; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1E293B; }
    table { border-collapse: collapse; }
    a { text-decoration: none; }
    @media only screen and (max-width: 620px) {
      .email-wrapper { width: 100% !important; border-radius: 0 !important; border: none !important; }
      .content-cell { padding: 24px 20px !important; }
      .two-col { display: block !important; width: 100% !important; box-sizing: border-box !important; margin-bottom: 12px !important; }
      .two-col-gap { display: none !important; }
      .hero-heading { font-size: 26px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 32px 0; background-color: #F8F6F2;">

  <center>
    <table class="email-wrapper" width="600" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E8E2D9; text-align: left; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);">
      
      <!-- Top Accent Line -->
      <tr>
        <td height="4" style="background-color: #B45309; line-height: 4px; font-size: 4px;">&nbsp;</td>
      </tr>

      <!-- Brand Header -->
      <tr>
        <td style="background-color: #FFFFFF; padding: 30px 32px 20px 32px; text-align: center; border-bottom: 1px solid #F1EFEA;">
          <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 26px; font-weight: 700; color: #0F172A; letter-spacing: 3px; text-transform: uppercase; line-height: 1;">
            TAJ PETHA
          </div>
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 10px; font-weight: 700; color: #B45309; letter-spacing: 2px; text-transform: uppercase; margin-top: 6px;">
            Original Agra Confectionery &bull; Direct Kitchen Dispatch
          </div>
        </td>
      </tr>

      <!-- Main Content -->
      <tr>
        <td class="content-cell" style="padding: 32px 32px;">

          <!-- Order Status Header -->
          <div style="margin-bottom: 24px; text-align: center;">
            <div style="display: inline-block; background-color: #FEF3C7; color: #92400E; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; padding: 4px 12px; border-radius: 9999px; margin-bottom: 12px;">
              Shipment Update &bull; Order #${displayId}
            </div>
            <h1 class="hero-heading" style="margin: 0 0 8px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 30px; font-weight: 700; color: #0F172A; line-height: 1.2;">
              Your Order Has Been Dispatched
            </h1>
            <p style="margin: 0 auto; font-size: 14px; color: #64748B; line-height: 1.6; max-width: 460px;">
              Hello ${customerName}, your order has been packed and handed over to ${tracking.courierName} for delivery.
            </p>
          </div>

          <!-- Courier & Live Tracking Card -->
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 10px; margin-bottom: 24px; overflow: hidden;">
            <tr>
              <td style="padding: 16px 20px; border-bottom: 1px solid #F1F5F9; background-color: #F8FAFC;">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <span style="font-size: 11px; font-weight: 700; color: #B45309; text-transform: uppercase; letter-spacing: 0.8px;">
                        Tracking Details
                      </span>
                    </td>
                    <td align="right">
                      <span style="font-size: 11px; font-weight: 700; color: #059669; background-color: #ECFDF5; border: 1px solid #A7F3D0; padding: 3px 9px; border-radius: 9999px;">
                        In Transit
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 18px 20px;">
                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 14px;">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #F1F5F9; font-size: 13px; color: #64748B;">
                      Courier Partner
                    </td>
                    <td align="right" style="padding: 8px 0; border-bottom: 1px solid #F1F5F9; font-size: 13px; font-weight: 600; color: #0F172A;">
                      ${tracking.courierName}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #F1F5F9; font-size: 13px; color: #64748B;">
                      Tracking / AWB Number
                    </td>
                    <td align="right" style="padding: 8px 0; border-bottom: 1px solid #F1F5F9; font-family: monospace, Consolas, sans-serif; font-size: 13px; font-weight: 700; color: #B45309;">
                      ${tracking.trackingNumber}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 13px; color: #64748B;">
                      Estimated Delivery
                    </td>
                    <td align="right" style="padding: 8px 0; font-size: 13px; font-weight: 600; color: #0F172A;">
                      2–4 Business Days (Express Air)
                    </td>
                  </tr>
                </table>

                ${trackingButtonHtml}
              </td>
            </tr>
          </table>

          <!-- Items in Shipment -->
          <div style="margin-bottom: 24px;">
            <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px;">
              Items in This Shipment
            </div>

            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 10px; overflow: hidden;">
              ${itemsHtml}
            </table>
          </div>

          <!-- 2-Column: Destination & Storage Advisory -->
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
            <tr>
              <td class="two-col" width="48%" valign="top" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px;">
                <div style="font-size: 11px; font-weight: 700; color: #B45309; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px;">
                  Delivery Address
                </div>
                <div style="font-size: 12.5px; color: #334155; line-height: 1.6;">
                  ${addressText || "Address on File"}
                </div>
              </td>

              <td width="4%" class="two-col-gap">&nbsp;</td>

              <td class="two-col" width="48%" valign="top" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px;">
                <div style="font-size: 11px; font-weight: 700; color: #059669; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px;">
                  Freshness &amp; Care
                </div>
                <div style="font-size: 12px; color: #334155; line-height: 1.6;">
                  &bull; Freshly packed for 30-day shelf life<br>
                  &bull; Keep in a cool, dry place away from heat<br>
                  &bull; Refrigerate after opening the inner seal
                </div>
              </td>
            </tr>
          </table>

          <!-- Customer Support Section -->
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; margin-bottom: 8px;">
            <tr>
              <td style="padding: 16px 20px;">
                <div style="font-size: 13px; font-weight: 600; color: #0F172A; margin-bottom: 4px;">
                  Have questions about your delivery?
                </div>
                <div style="font-size: 12px; color: #64748B; line-height: 1.5; margin-bottom: 12px;">
                  Our customer desk is available Monday through Sunday, 9:00 AM – 9:00 PM IST.
                </div>
                <a href="https://wa.me/919259418994?text=Hello%2C%20I%20have%20an%20inquiry%20regarding%20Order%20%23${displayId}" target="_blank" style="display: inline-block; background-color: #059669; color: #FFFFFF !important; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 700; padding: 8px 18px; border-radius: 6px; text-decoration: none;">
                  WhatsApp Helpdesk (+91 92594 18994)
                </a>
              </td>
            </tr>
          </table>

        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background-color: #F8FAFC; padding: 24px 32px; text-align: center; border-top: 1px solid #E2E8F0;">
          <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 16px; font-weight: 700; color: #0F172A; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px;">
            Taj Petha Confectioners
          </div>
          <div style="font-size: 11px; color: #64748B; line-height: 1.6;">
            Noori Gate, Near Taj Mahal, Agra, Uttar Pradesh 282001, India<br>
            Official Store: <a href="https://tajpetha.in" style="color: #B45309; text-decoration: none; font-weight: 600;">tajpetha.in</a> &bull; Support: <a href="mailto:support@tajpetha.in" style="color: #B45309; text-decoration: none; font-weight: 600;">support@tajpetha.in</a>
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
    subject: `Your Taj Petha Order #${displayId} Has Been Dispatched`,
    html: emailHtml,
  })

  console.log(`[ShippingEmail] Shipping notification sent successfully to ${order.email}`)
}

export const config: SubscriberConfig = {
  event: "shipment.created",
  context: { subscriberId: "order-shipped-email" },
}