import { cache } from "react"

export type ActiveStorePromotion = {
  id: string
  code: string
  discountPercent: number
  type: "percentage" | "fixed"
  status: "active" | "inactive"
}

/**
 * Dynamically fetches the primary active promotion from Medusa Admin API.
 * Uses the Secret API Key (MEDUSA_ADMIN_API_TOKEN).
 * No hardcoded strings. If no promotions are active, returns null.
 */
export const getActivePromotion = cache(async (): Promise<ActiveStorePromotion | null> => {
  const backendUrl =
    process.env.MEDUSA_BACKEND_URL ||
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
    "http://localhost:9000"

  const secretToken =
    process.env.MEDUSA_ADMIN_API_TOKEN ||
    process.env.MEDUSA_SECRET_API_KEY ||
    ""

  if (!secretToken) {
    console.warn("[getActivePromotion] Missing MEDUSA_ADMIN_API_TOKEN in environment")
    return null
  }

  try {
    // Medusa V2 accepts Basic auth with base64(token:) or Bearer token
    const authHeader = secretToken.startsWith("sk_")
      ? `Basic ${Buffer.from(`${secretToken}:`).toString("base64")}`
      : `Bearer ${secretToken}`

    const res = await fetch(
      `${backendUrl}/admin/promotions?fields=*application_method&order=-created_at&limit=10`,
      {
        method: "GET",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        next: { revalidate: 86400, tags: ["promotions"] },
      }
    )

    if (!res.ok) {
      const errText = await res.text().catch(() => "")
      console.error(`[getActivePromotion] Admin API error status ${res.status}:`, errText)
      return null
    }

    const data = await res.json()
    const rawPromotions = data?.promotions || []
    const promotions = rawPromotions.filter(
      (p: any) => p.status === "active" && !p.deleted_at
    )

    if (promotions.length === 0) {
      return null
    }

    // Pick the best percentage discount or most recent active promotion
    const bestPromo = promotions.sort((a: any, b: any) => {
      const valA = Number(a.application_method?.value) || 0
      const valB = Number(b.application_method?.value) || 0
      return valB - valA
    })[0]

    const appMethod = bestPromo.application_method
    const discountVal = Number(appMethod?.value) || 0

    return {
      id: bestPromo.id,
      code: bestPromo.code,
      discountPercent: appMethod?.type === "percentage" ? discountVal : 0,
      type: appMethod?.type || "percentage",
      status: bestPromo.status,
    }
  } catch (error) {
    console.error("[getActivePromotion] Failed to fetch active promotion from Admin API:", error)
    return null
  }
})

