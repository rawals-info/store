import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { completeCartWorkflow } from "@medusajs/core-flows"
import crypto from "crypto"

export interface CartLookupResult {
  cart_id: string
  completed_at: Date | null
  order_id: string | null
}

export async function lookupCartByRazorpayOrderId(
  container: any,
  razorpayOrderId: string
): Promise<CartLookupResult | null> {
  const pgConnection = container.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any

  const result = await pgConnection.raw(
    `SELECT c.id as cart_id, c.completed_at, oc.order_id
     FROM payment_session ps
     JOIN cart_payment_collection cpc ON cpc.payment_collection_id = ps.payment_collection_id
     JOIN cart c ON c.id = cpc.cart_id
     LEFT JOIN order_cart oc ON oc.cart_id = c.id AND oc.deleted_at IS NULL
     WHERE ps.data->'razorpayOrder'->>'id' = ?
     LIMIT 1`,
    [razorpayOrderId]
  )

  const row = result?.rows?.[0]
  if (!row) return null

  return {
    cart_id: row.cart_id,
    completed_at: row.completed_at,
    order_id: row.order_id,
  }
}

export async function completeCartForRazorpayOrder(
  container: any,
  razorpayOrderId: string
): Promise<{ order_id?: string; cart_id: string; already_completed: boolean }> {
  const cartInfo = await lookupCartByRazorpayOrderId(container, razorpayOrderId)
  if (!cartInfo) {
    throw new Error(`No cart found for Razorpay order ID ${razorpayOrderId}`)
  }

  if (cartInfo.completed_at && cartInfo.order_id) {
    return {
      cart_id: cartInfo.cart_id,
      order_id: cartInfo.order_id,
      already_completed: true,
    }
  }

  // Complete cart into order
  const { errors, result } = await completeCartWorkflow(container).run({
    input: { id: cartInfo.cart_id },
    context: { transactionId: cartInfo.cart_id },
    throwOnError: false,
  })

  if (errors?.[0]) {
    // If an error occurred, check if it was completed concurrently by the browser callback
    const recheck = await lookupCartByRazorpayOrderId(container, razorpayOrderId)
    if (recheck?.completed_at && recheck?.order_id) {
      return {
        cart_id: recheck.cart_id,
        order_id: recheck.order_id,
        already_completed: true,
      }
    }
    throw errors[0].error
  }

  return {
    cart_id: cartInfo.cart_id,
    order_id: result.id,
    already_completed: false,
  }
}

export function verifyRazorpaySignature(
  rawBody: Buffer | string,
  signature: string,
  secret: string
): boolean {
  try {
    const payload = typeof rawBody === "string" ? rawBody : rawBody.toString("utf8")
    const expected = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex")
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  } catch {
    return false
  }
}

