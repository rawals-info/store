import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const robotsTxt = `User-agent: *\nDisallow: /`

  res.setHeader('Content-Type', 'text/plain')
  res.send(robotsTxt)
}
