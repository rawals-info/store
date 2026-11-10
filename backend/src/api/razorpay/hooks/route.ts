import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const storeUrl = process.env.STORE_CORS?.split(",")[0] || "https://tajpetha.in"
  res.redirect(303, `${storeUrl}/in/cart`)
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const storeUrl = process.env.STORE_CORS?.split(",")[0] || "https://tajpetha.in"
  res.redirect(303, `${storeUrl}/in/cart`)
}
