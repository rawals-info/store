// @ts-ignore
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendLuxuryEmail, buildLuxuryTemplate } from "../util/email"
import { Modules } from "@medusajs/framework/utils"
import type { IOrderModuleService } from "@medusajs/framework/types"

export default async function orderCanceledEmail({
  event,
  container,
}: SubscriberArgs<{ id?: string; order_id?: string; no_notification?: boolean; [key: string]: any }>) {
  if (event.data?.no_notification === true || event.data?.notify === false) {
    console.log(`[CanceledEmail] Skipping canceled email: admin disabled notification`)
    return
  }

  const orderId = event.data?.id || event.data?.order_id
  if (!orderId) {
    console.warn(`[CanceledEmail] No order ID provided in event data:`, event.data)
    return
  }

  console.log(`[CanceledEmail] Processing order cancellation email for:`, orderId)

  let order: any = null
  const query = container.resolve("query") as any

  // 1. Try to query full order graph including payment collections and summary
  if (query) {
    try {
      const { data: orders } = await query.graph({
        entity: "order",
        fields: [
          "id",
          "display_id",
          "email",
          "total",
          "subtotal",
          "shipping_total",
          "tax_total",
          "discount_total",
          "currency_code",
          "created_at",
          "shipping_address.*",
          "items.*",
          "payment_collections.*",
          "payment_collections.payments.*",
          "summary.*",
        ],
        filters: {
          id: orderId,
        },
      })

      if (orders && orders.length > 0) {
        order = orders[0]
      }
    } catch (qErr) {
      console.warn(`[CanceledEmail] Could not query order via graph:`, qErr)
    }
  }

  // 2. Fallback to order service if graph failed
  if (!order) {
    try {
      const orderService = container.resolve<IOrderModuleService>(Modules.ORDER)
      order = await orderService.retrieveOrder(orderId, {
        select: ["id", "display_id", "email", "total", "currency_code", "created_at"],
        relations: ["shipping_address", "items", "payment_collections", "payment_collections.payments"],
      })
    } catch (orderErr) {
      console.error(`[CanceledEmail] Could not retrieve order by ID:`, orderErr)
      return
    }
  }

  if (!order) {
    console.error(`[CanceledEmail] Order not found: ${orderId}`)
    return
  }

  if (order.no_notification === true) {
    console.log(`[CanceledEmail] Skipping canceled email: order ${order.id} has no_notification = true`)
    return
  }

  const customerName =
    order.shipping_address?.first_name ||
    order.email?.split("@")[0] ||
    "Valued Customer"
  const displayId = order.display_id ? `${order.display_id}` : order.id
  const currency = order.currency_code?.toUpperCase?.() || "INR"

  const fmt = (amt: number) =>
    Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 2,
    }).format(amt)

  // Calculate payment state
  const asNumber = (val: any): number => {
    if (val == null) return 0
    if (typeof val === "number") return val
    if (typeof val === "string") return parseFloat(val)
    if (typeof val.toNumber === "function") return val.toNumber()
    if (typeof val.value !== "undefined") return Number(val.value)
    return Number(val)
  }

  const orderTotal = asNumber(order.total)
  
  // Calculate total captured/authorized payments
  let capturedTotal = 0
  if (order.summary && order.summary.paid_total != null) {
    capturedTotal = asNumber(order.summary.paid_total)
  } else if (order.payment_collections && Array.isArray(order.payment_collections)) {
    for (const pCol of order.payment_collections) {
      if (pCol.payments && Array.isArray(pCol.payments)) {
        for (const p of pCol.payments) {
          if (p.status === "captured" || p.status === "authorized") {
            capturedTotal += asNumber(p.amount)
          }
        }
      }
    }
  }

  // Determine Payment & Refund Case
  let paymentCardHtml = ""
  if (capturedTotal >= orderTotal && capturedTotal > 0) {
    // CASE 1: FULLY PAID
    paymentCardHtml = `
      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #ECFDF5; border: 1.5px solid #A7F3D0; border-radius: 10px; margin-bottom: 24px;">
        <tr>
          <td style="padding: 18px 20px;">
            <div style="display: inline-block; background-color: #059669; color: #FFFFFF; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; padding: 3px 10px; border-radius: 9999px; margin-bottom: 8px;">
              Full Refund Initiated
            </div>
            <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 16px; font-weight: 800; color: #065F46; margin-bottom: 6px;">
              ${fmt(capturedTotal)} will be refunded to your account
            </div>
            <div style="font-size: 13px; color: #047857; line-height: 1.6;">
              Because your order was paid online, we have initiated a full refund of <strong>${fmt(capturedTotal)}</strong> back to your original payment source (UPI / Card / NetBanking). Depending on your bank&apos;s settlement schedule, funds will reflect within <strong>3–5 business days</strong>.
            </div>
          </td>
        </tr>
      </table>
    `
  } else if (capturedTotal > 0 && capturedTotal < orderTotal) {
    // CASE 2: PARTIALLY PAID
    const remainingAmount = Math.max(0, orderTotal - capturedTotal)
    paymentCardHtml = `
      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FFFBEB; border: 1.5px solid #FDE68A; border-radius: 10px; margin-bottom: 24px;">
        <tr>
          <td style="padding: 18px 20px;">
            <div style="display: inline-block; background-color: #D97706; color: #FFFFFF; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; padding: 3px 10px; border-radius: 9999px; margin-bottom: 8px;">
              Partial Refund Initiated
            </div>
            <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 16px; font-weight: 800; color: #92400E; margin-bottom: 6px;">
              ${fmt(capturedTotal)} will be refunded to your account
            </div>
            <div style="font-size: 13px; color: #B45309; line-height: 1.6;">
              A refund for the paid portion of <strong>${fmt(capturedTotal)}</strong> has been initiated back to your original payment method (3–5 business days). The unpaid balance of <strong>${fmt(remainingAmount)}</strong> has been cancelled. No further charges will occur.
            </div>
          </td>
        </tr>
      </table>
    `
  } else {
    // CASE 3: UNPAID / ZERO PAYMENT CHARGED
    paymentCardHtml = `
      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 10px; margin-bottom: 24px;">
        <tr>
          <td style="padding: 18px 20px;">
            <div style="display: inline-block; background-color: #475569; color: #FFFFFF; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; padding: 3px 10px; border-radius: 9999px; margin-bottom: 8px;">
              No Payment Charged
            </div>
            <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 16px; font-weight: 800; color: #0F172A; margin-bottom: 6px;">
              ₹0.00 Deducted &bull; No Refund Needed
            </div>
            <div style="font-size: 13px; color: #64748B; line-height: 1.6;">
              No payment was captured or charged for this order. You have not been billed, and no deduction was made from your account.
            </div>
          </td>
        </tr>
      </table>
    `
  }

  // Items table
  const items: any[] = Array.isArray(order.items) ? order.items : []
  const itemsHtml = items
    .map((it: any, index: number) => {
      const variantInfo = it.variant_title || it.variant_sku || ""
      const variantDisplay =
        variantInfo && variantInfo !== "Default variant" && variantInfo !== it.title
          ? `<div style="font-size: 12px; color: #64748B; margin-top: 2px;">Pack: ${variantInfo}</div>`
          : ""
      const isLast = index === items.length - 1

      return `
        <tr>
          <td style="padding: 14px 16px; ${isLast ? "" : "border-bottom: 1px solid #F1F5F9;"}">
            <div style="font-size: 13.5px; font-weight: 700; color: #0F172A;">${it.title}</div>
            ${variantDisplay}
            <div style="font-size: 12px; color: #94A3B8; margin-top: 3px;">Qty: ${it.quantity} &bull; ${fmt(asNumber(it.unit_price) * it.quantity)}</div>
          </td>
        </tr>
      `
    })
    .join("")

  const body = `
    <!-- Cancellation Status Banner -->
    <div style="text-align: center; margin-bottom: 26px;">
      <div style="display: inline-block; background-color: #FEF2F2; color: #991B1B; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; padding: 4px 14px; border-radius: 9999px; margin-bottom: 12px; border: 1px solid #FECACA;">
        Order Cancelled &bull; #${displayId}
      </div>
      <h1 style="margin: 0 0 8px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 30px; font-weight: 700; color: #0F172A; line-height: 1.2;">
        Your Order Has Been Cancelled
      </h1>
      <p style="margin: 0 auto; font-size: 14px; color: #64748B; line-height: 1.6; max-width: 480px;">
        Hello ${customerName}, your Taj Petha order <strong>#${displayId}</strong> has been cancelled as requested.
      </p>
    </div>

    <!-- Dynamic Payment & Refund Status Card -->
    ${paymentCardHtml}

    <!-- Cancelled Items Summary -->
    ${
      items.length > 0
        ? `
      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 10px; margin-bottom: 24px; overflow: hidden;">
        <tr>
          <td style="background-color: #F8FAFC; padding: 12px 16px; border-bottom: 1px solid #E2E8F0;">
            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #475569;">
              Cancelled Items
            </span>
          </td>
        </tr>
        ${itemsHtml}
      </table>
    `
        : ""
    }

    <!-- Support Concierge Card -->
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; margin-bottom: 8px;">
      <tr>
        <td style="padding: 20px; text-align: center;">
          <div style="font-size: 14px; font-weight: 700; color: #0F172A; margin-bottom: 6px;">
            Was this a mistake or do you need assistance?
          </div>
          <div style="font-size: 12.5px; color: #64748B; line-height: 1.5; margin-bottom: 14px; max-width: 440px; margin-left: auto; margin-right: auto;">
            If you cancelled by mistake or have any questions regarding your refund status, our Agra customer desk is ready to help.
          </div>
          <a href="https://wa.me/919259418994?text=Hello%20Taj%20Petha,%20I%20have%20an%20inquiry%20regarding%20my%20cancelled%20order%20%23${displayId}:" target="_blank" style="display: inline-block; background-color: #059669; color: #FFFFFF !important; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 700; padding: 10px 24px; border-radius: 6px; text-decoration: none;">
            WhatsApp Customer Desk (+91 92594 18994)
          </a>
        </td>
      </tr>
    </table>
  `

  await sendLuxuryEmail({
    to: order.email as string,
    name: customerName,
    subject: `Your Taj Petha Order #${displayId} Has Been Cancelled`,
    html: buildLuxuryTemplate("Order Cancelled", body),
  })

  console.log(`[CanceledEmail] Cancellation email successfully sent to ${order.email}`)
}

export const config: SubscriberConfig = {
  event: "order.canceled",
  context: { subscriberId: "order-canceled-email" },
}
