import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { completeCartForRazorpayOrder, verifyRazorpaySignature } from "../service"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const webhookSecret =
    process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_TEST_WEBHOOK_SECRET
  const signature = req.headers["x-razorpay-signature"] as string

  // Validate signature if secret is configured
  if (webhookSecret && signature) {
    const rawBody = req.rawBody
      ? Buffer.isBuffer(req.rawBody)
        ? req.rawBody.toString("utf8")
        : req.rawBody
      : JSON.stringify(req.body)

    if (!verifyRazorpaySignature(rawBody, signature, webhookSecret)) {
      console.error("[Razorpay Webhook] Invalid signature")
      return res.status(400).json({ error: "Invalid signature" })
    }
  }

  const event = (req.body as any)?.event
  const payload = (req.body as any)?.payload

  console.log(`[Razorpay Webhook] Received event: ${event}`)

  // Handle successful payment events
  if (event === "order.paid" || event === "payment.captured") {
    const razorpayOrderId =
      payload?.order?.entity?.id ||
      payload?.payment?.entity?.order_id

    if (!razorpayOrderId) {
      console.warn("[Razorpay Webhook] Missing razorpay order_id in event payload")
      return res.status(200).json({ status: "ignored_no_order_id" })
    }

    try {
      const outcome = await completeCartForRazorpayOrder(req.scope, razorpayOrderId)
      console.log(
        `[Razorpay Webhook] Processed ${event} for Razorpay order ${razorpayOrderId}: cart=${outcome.cart_id}, order=${outcome.order_id}, already_completed=${outcome.already_completed}`
      )
      return res.status(200).json({ status: "success", ...outcome })
    } catch (err: any) {
      console.error(`[Razorpay Webhook] Error completing cart for order ${razorpayOrderId}:`, err)
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(200).json({ status: "ignored_event", event })
}

