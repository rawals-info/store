/*
  Script: reindex-typesense.ts
  --------------------------------
  This script (1) fetches all products from your Medusa backend and (2) upserts them
  into the `products` collection in Typesense. Run it manually whenever you need
  to refresh your local Typesense index while developing:

    pnpm run reindex:typesense    # or yarn run / npm run depending on manager

  Requirements:
    • Environment variables:
        MEDUSA_BACKEND_URL            – The base URL of your Medusa backend (default: http://localhost:9000)
        NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY – Publishable key to call store endpoints (optional when CORS disabled)
        TYPESENSE_PROTOCOL            – http | https (default: http)
        TYPESENSE_HOST                – Typesense host (default: localhost)
        TYPESENSE_PORT                – Typesense port (default: 8108)
        TYPESENSE_API_KEY             – Admin API key for Typesense (default: xyz)

  Notes:
    • The script creates the `products` collection if it doesn't exist yet.
    • Only the fields used for search (id, title, description, handle) are indexed.
*/

import Typesense, { Client } from "typesense"

interface MedusaProduct {
  id: string
  title: string
  description?: string
  handle?: string
}

async function fetchAllProducts(): Promise<MedusaProduct[]> {
  const backendUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

  const limit = 100
  let offset = 0
  let fetched: MedusaProduct[] = []
  let total = Infinity

  while (offset < total) {
    const url = `${backendUrl}/store/products?limit=${limit}&offset=${offset}`
    const res = await fetch(url, {
      headers: publishableKey
        ? { "x-publishable-api-key": publishableKey }
        : {},
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch products from Medusa: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    const products = (data.products || []) as MedusaProduct[]
    total = data.count ?? products.length
    fetched = fetched.concat(products)

    if (products.length === 0) break
    offset += limit
  }

  return fetched
}

async function ensureCollection(client: Client, name: string) {
  try {
    await client.collections(name).retrieve()
  } catch {
    // Collection does not exist – create it
    await client.collections().create({
      name,
      fields: [
        { name: "id", type: "string" },
        { name: "title", type: "string" },
        { name: "description", type: "string", optional: true },
        { name: "handle", type: "string", optional: true },
      ],
    })
  }
}

async function main() {
  const client = new Typesense.Client({
    nodes: [
      {
        host: process.env.TYPESENSE_HOST || "localhost",
        port: +(process.env.TYPESENSE_PORT || 8108),
        protocol: (process.env.TYPESENSE_PROTOCOL || "http") as "http" | "https",
      },
    ],
    apiKey: process.env.TYPESENSE_API_KEY || "xyz",
    connectionTimeoutSeconds: 5,
  })

  const collectionName = "products"
  await ensureCollection(client, collectionName)

  console.log("Fetching products from Medusa backend…")
  const products = await fetchAllProducts()
  console.log(`Fetched ${products.length} products, indexing in Typesense…`)

  const documents = products.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description ?? "",
    handle: p.handle ?? "",
  }))

  // Import documents in batches for performance
  const BATCH_SIZE = 100
  for (let i = 0; i < documents.length; i += BATCH_SIZE) {
    const batch = documents.slice(i, i + BATCH_SIZE)
    await client
      .collections(collectionName)
      .documents()
      .import(batch, { action: "upsert" })
  }

  console.log("✅ Typesense index has been refreshed!")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
}) 