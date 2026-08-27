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
 * Dynamically fetches the primary active promotion from Medusa database.
 * No hardcoded strings. If no promotions are active, returns null.
 */
export async function getActivePromotion(): Promise<ActiveStorePromotion | null> {
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
    console.error("[getActivePromotion] Database query error:", error)
    return null
  }
}
