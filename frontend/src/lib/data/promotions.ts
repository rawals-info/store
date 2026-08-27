import { Pool } from "pg"

let pool: Pool | null = null

function getDbPool(): Pool {
  if (!pool) {
    const connectionString =
      process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/taj_db"
    pool = new Pool({
      connectionString,
      max: 5,
      idleTimeoutMillis: 30000,
    })
  }
  return pool
}

export type ActiveStorePromotion = {
  id: string
  code: string
  discountPercent: number
  type: "percentage" | "fixed"
  status: "active" | "inactive"
}

/**
 * Dynamically fetches the primary active promotion from Medusa Admin API or database.
 * No hardcoded strings. If no promotions are active, returns null.
 */
export async function getActivePromotion(): Promise<ActiveStorePromotion | null> {
  const backendUrl =
    process.env.MEDUSA_BACKEND_URL ||
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
    "http://localhost:9000"

  const secretToken =
    process.env.MEDUSA_ADMIN_API_TOKEN ||
    process.env.MEDUSA_SECRET_API_KEY ||
    ""

  // 1. Official Headless Path: Medusa Admin Promotions API using Secret Key
  if (secretToken) {
    try {
      // Medusa V2 accepts Basic auth with base64(token:) or Bearer token
      const authHeader = secretToken.startsWith("sk_")
        ? `Basic ${Buffer.from(`${secretToken}:`).toString("base64")}`
        : `Bearer ${secretToken}`

      const res = await fetch(
        `${backendUrl}/admin/promotions?fields=*application_method&status=active&order=-created_at&limit=5`,
        {
          method: "GET",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
          next: { revalidate: 60, tags: ["promotions"] },
          cache: "no-store",
        }
      )

      if (res.ok) {
        const data = await res.json()
        const promotions = data?.promotions || []
        if (promotions.length > 0) {
          // Find the best percentage discount or most recent active promotion
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
        }
        return null
      }
    } catch (apiErr) {
      console.warn("[getActivePromotion] Admin API error, falling back:", apiErr)
    }
  }

  // 2. Fallback: Direct PostgreSQL database query (works when DATABASE_URL is set)
  try {
    const db = getDbPool()
    const result = await db.query(`
      SELECT 
        p.id, 
        p.code, 
        p.status, 
        p.type, 
        pam.type as discount_type, 
        pam.value as discount_value 
      FROM promotion p 
      LEFT JOIN promotion_application_method pam ON pam.promotion_id = p.id 
      WHERE p.status = 'active' AND p.deleted_at IS NULL
      ORDER BY CAST(pam.value AS NUMERIC) DESC NULLS LAST, p.updated_at DESC
      LIMIT 1
    `)

    if (!result.rows || result.rows.length === 0) {
      return null
    }

    const row = result.rows[0]
    const discountVal = Number(row.discount_value) || 0

    return {
      id: row.id,
      code: row.code,
      discountPercent: row.discount_type === "percentage" ? discountVal : 0,
      type: row.discount_type || "percentage",
      status: row.status,
    }
  } catch (error) {
    console.error("[getActivePromotion] Error fetching active promotion:", error)
    return null
  }
}
