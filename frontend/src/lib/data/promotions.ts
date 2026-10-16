import { cache } from "react"

export type ActiveStorePromotion = {
  id: string
  code: string
  discountPercent: number
  type: "percentage" | "fixed"
  status: "active" | "inactive"
  minOrderThreshold: number
}

/**
 * Dynamically fetches the primary active promotion and minimum order threshold from Medusa Admin API.
 * Uses the Secret API Key (MEDUSA_ADMIN_API_TOKEN).
 * Resolves the threshold directly from the standard shipping rule (defaults to 500).
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

    // 1. Fetch active shipping rule to resolve dynamic Free Delivery / Discount Threshold
    let minOrderThreshold = 500
    try {
      const shippingRes = await fetch(
        `${backendUrl}/admin/shipping-options?fields=*prices,*prices.price_rules`,
        {
          method: "GET",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
          next: { revalidate: 43200, tags: ["shipping-options", "promotions"] },
        }
      )

      if (shippingRes.ok) {
        const shippingData = await shippingRes.json()
        const options = shippingData?.shipping_options || []
        const standardOption =
          options.find((o: any) => o.name && o.name.toLowerCase().includes("standard")) ||
          options[0]

        const freePrice = standardOption?.prices?.find(
          (p: any) => Number(p.amount) === 0
        )

        const itemTotalRule = freePrice?.price_rules?.find(
          (r: any) =>
            r.attribute === "item_total" && (r.operator === "gte" || r.operator === "gt")
        )

        if (itemTotalRule?.value && !isNaN(Number(itemTotalRule.value))) {
          minOrderThreshold = Number(itemTotalRule.value)
        }
      }
    } catch (shippingErr) {
      // Graceful fallback to 500 if shipping options cannot be queried
    }

    // 2. Fetch active promotions
    const res = await fetch(
      `${backendUrl}/admin/promotions?fields=*application_method&order=-created_at&limit=10`,
      {
        method: "GET",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        next: { revalidate: 43200, tags: ["promotions"] },
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
      minOrderThreshold,
    }
  } catch (error) {
    console.error("[getActivePromotion] Failed to fetch active promotion from Admin API:", error)
    return null
  }
})

export const getMinOrderThreshold = cache(async (): Promise<number> => {
  const promo = await getActivePromotion()
  return promo?.minOrderThreshold ?? 500
})
