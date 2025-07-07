import { z } from "zod"
import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import Typesense, { Client as TypesenseClient } from "typesense"
import { HttpTypes } from "@medusajs/types"

/**
 * Request body validation schema.
 * Accepts either `query` or `q` (aliased) plus optional pagination fields.
 */
export const SearchSchema = z.object({
  // search term (one of the two fields is required)
  q: z.string().optional(),
  query: z.string().optional(),

  // pagination (optional)
  limit: z.coerce.number().int().positive().min(1).max(100).optional(),
  offset: z.coerce.number().int().nonnegative().optional(),

  // arbitrary filter object (not used in this simple implementation)
  filter: z.record(z.any()).optional(),
})

export type SearchRequest = z.infer<typeof SearchSchema>

/**
 * POST /store/products/search
 *
 * This endpoint pipes the request to the default search service (Typesense in our project)
 * and returns the hits in a consistent format: { hits: Product[]; count: number }
 */
export const POST = async (
  req: MedusaRequest<SearchRequest>,
  res: MedusaResponse
) => {
  const body: any = (req as any).validatedBody ?? req.body ?? {}

  const { q, query, limit = 20, offset = 0 } = body

  const searchTerm = (q ?? query ?? "").trim()

  if (!searchTerm) {
    return res.status(400).json({ message: "query parameter 'q' is required" })
  }

  // initialize Typesense client lazily and cache on module scope
  if (!(global as any).__typesenseClient) {
    ;(global as any).__typesenseClient = new TypesenseClient({
      nodes: [
        {
          host: process.env.TYPESENSE_HOST || "localhost",
          port: Number(process.env.TYPESENSE_PORT) || 8108,
          protocol: process.env.TYPESENSE_PROTOCOL || "http",
        },
      ],
      apiKey: process.env.TYPESENSE_API_KEY || "xyz",
      connectionTimeoutSeconds: 2,
    })
  }

  const client: TypesenseClient = (global as any).__typesenseClient

  const page = Math.floor(offset / limit) + 1
  try {
    let resp
    try {
      resp = await client
        .collections("products")
        .documents()
        .search({
          q: searchTerm,
          query_by: "title,description,handle",
          page,
          per_page: limit,
        })
    } catch (err: any) {
      // If collection doesn't exist, create it and return empty hits
      if (err?.constructor?.name === "ObjectNotFound") {
        await client.collections().create({
          name: "products",
          fields: [
            { name: "id", type: "string" },
            { name: "title", type: "string" },
            { name: "description", type: "string" },
            { name: "handle", type: "string" },
          ],
        })
        resp = { hits: [], found: 0 }
      } else {
        throw err
      }
    }

    const hitIds = (resp.hits as any[]).map((h) => (h.document as any).id as string)
    let products: HttpTypes.StoreProduct[] = []
    if (hitIds.length) {
      try {
        const queryFn = req.scope.resolve("query") ?? req.scope.resolve("remoteQuery")
        if (queryFn) {
          const { data } = await queryFn.graph({
            entity: "product",
            filters: { id: { $in: hitIds } },
            fields: ["*"],
            pagination: {},
          })
          // maintain order same as hits
          const map = new Map<string, any>()
          data.forEach((p: any) => map.set(p.id, p))
          products = hitIds.map((id) => map.get(id)).filter(Boolean)
        }
      } catch (e) {
        console.error("fetching products by ids failed", e)
      }
    }

    // If no hits yet, maybe index is empty -> index existing products once
    if ((resp.hits as any[]).length === 0) {
      try {
        const queryFn = req.scope.resolve("query") ?? req.scope.resolve("remoteQuery")
        if (queryFn) {
          const { data: products } = await queryFn.graph({
            entity: "product",
            fields: ["id", "title", "description", "handle"],
            filters: {},
            pagination: {},
          })

          if (Array.isArray(products) && products.length) {
            const ndjson = products
              .map((p: any) =>
                JSON.stringify({
                  id: p.id,
                  title: p.title,
                  description: p.description ?? "",
                  handle: p.handle,
                })
              )
              .join("\n")
            await client.collections("products").documents().import(ndjson, {
              action: "upsert",
              batch_size: 100,
            })

            // re-run search
            const reResp = await client
              .collections("products")
              .documents()
              .search({
                q: searchTerm,
                query_by: "title,description,handle",
                page,
                per_page: limit,
              })
            resp = reResp as any
          }
        }
      } catch (e) {
        console.error("Indexing products in Typesense failed", e)
      }
    }

    res.json({ hits: products, count: resp.found })
  } catch (e) {
    console.error("Typesense search failed", e)
    res.status(500).json({ message: "Search engine error" })
  }
} 