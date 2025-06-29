import { Client } from "typesense"
import { AbstractSearchService } from "@medusajs/utils"

export type TypesenseOptions = {
  /** Typesense cluster nodes */
  nodes: {
    host: string
    port: number
    protocol: "http" | "https"
  }[]
  /** Typesense API key */
  apiKey: string
  /** Optional prefix prepended to collection names */
  indexPrefix?: string
}

/**
 * Basic Typesense implementation of Medusa's AbstractSearchService interface.
 */
class TypesenseService extends AbstractSearchService {
  public readonly isDefault = true
  protected readonly client_: Client
  protected readonly indexPrefix_: string

  constructor(_, options: TypesenseOptions) {
    // @ts-expect-error prefer-rest-params – Medusa passes many deps we ignore
    super(...arguments)

    if (!options?.nodes?.length || !options.apiKey) {
      throw new Error(
        "TypesenseService requires `nodes` (host/port/protocol) and `apiKey` in the options."
      )
    }

    this.client_ = new Client({
      nodes: options.nodes,
      apiKey: options.apiKey,
      connectionTimeoutSeconds: 2,
    })

    this.indexPrefix_ = options.indexPrefix ?? ""
  }

  /* -------------------------------------------------------------------------- */
  /* Helper methods                                                             */
  /* -------------------------------------------------------------------------- */
  protected collectionName(name: string) {
    return `${this.indexPrefix_}${name}`
  }

  protected async ensureCollection(name: string) {
    const collectionName = this.collectionName(name)
    try {
      await this.client_.collections(collectionName).retrieve()
    } catch (e) {
      // assume not found; create minimal schema
      await this.client_.collections().create({
        name: collectionName,
        fields: [
          { name: "id", type: "string" },
          { name: "title", type: "string" },
          { name: "description", type: "string" },
          { name: "handle", type: "string" },
        ],
      })
    }
  }

  /* -------------------------------------------------------------------------- */
  /* AbstractSearchService implementation                                       */
  /* -------------------------------------------------------------------------- */
  async createIndex(indexName: string, _settings: Record<string, any> = {}) {
    await this.ensureCollection(indexName)
  }

  async getIndex(indexName: string) {
    return this.client_.collections(this.collectionName(indexName)).retrieve()
  }

  async addDocuments(indexName: string, documents: Record<string, any>[], _type: string) {
    if (!Array.isArray(documents) || documents.length === 0) return

    await this.ensureCollection(indexName)
    // Typesense expects an NDJSON string
    const ndjson = documents.map((d) => JSON.stringify(d)).join("\n")
    await this.client_.collections(this.collectionName(indexName)).documents().import(ndjson, {
      action: "upsert",
      batch_size: 100,
    })
  }

  async replaceDocuments(indexName: string, documents: Record<string, any>[], type: string) {
    // delete all then add
    await this.deleteAllDocuments(indexName)
    return this.addDocuments(indexName, documents, type)
  }

  async deleteDocument(indexName: string, document_id: string | number) {
    await this.client_
      .collections(this.collectionName(indexName))
      .documents(String(document_id))
      .delete()
  }

  async deleteAllDocuments(indexName: string) {
    await this.client_.collections(this.collectionName(indexName)).documents().delete({})
  }

  async search(indexName: string, query: string | null, options: Record<string, any> = {}) {
    const { paginationOptions } = options || {}
    const offset = paginationOptions?.offset ?? 0
    const limit = paginationOptions?.limit ?? 20
    const page = Math.floor(offset / limit) + 1

    const response = await this.client_
      .collections(this.collectionName(indexName))
      .documents()
      .search({
        q: query ?? "*",
        query_by: "title,description,handle",
        page,
        per_page: limit,
      })

    return {
      hits: response.hits?.map((h: any) => h.document) ?? [],
      count: response.found,
    }
  }

  async updateSettings(indexName: string, settings: Record<string, any>) {
    return this.client_.collections(this.collectionName(indexName)).update(settings)
  }
}

export default TypesenseService 