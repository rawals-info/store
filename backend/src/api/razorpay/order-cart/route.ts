import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { lookupCartByRazorpayOrderId } from "../service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const orderId = (req.query?.order_id as string) || (req.query as any)?.orderId
  if (!orderId) {
    return res.status(400).json({ error: "Missing order_id query parameter" })
  }

  try {
    const result = await lookupCartByRazorpayOrderId(req.scope, orderId)
    if (!result) {
      return res.status(404).json({ error: "Cart not found for order_id" })
    }

    return res.status(200).json(result)
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}

