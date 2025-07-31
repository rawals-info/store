"use server"

import { sdk } from "@lib/config"
import { COLLECTION_FIELDS } from "@lib/constants/api-fields"
import { cache } from "react"
import { HttpTypes } from "@medusajs/types"

export const retrieveCollection = async (id: string) => {
  const next = {
    revalidate: 60 * 10, // Revalidate every 10 minutes
    tags: ['collections', `collection-${id}`], // Tags for cache invalidation
  }

  return sdk.client
    .fetch<{ collection: HttpTypes.StoreCollection }>(
      `/store/collections/${id}`,
      {
        next,
      }
    )
    .then(({ collection }) => collection)
}

export const listCollections = cache(async (query?: Record<string, any>) => {
  return sdk.client
    .fetch<{ collections: HttpTypes.StoreCollection[] }>(`/store/collections`, {
      method: "GET",
      query: { 
        ...query, 
        fields: query?.fields || COLLECTION_FIELDS.LIST // Use optimized fields by default
      },
      next: {
        tags: ["collections"],
      },
    })
    .then(({ collections }) => ({ collections }))
    .catch(() => ({ collections: [] }))
})

export const getCollectionByHandle = async (
  handle: string
): Promise<HttpTypes.StoreCollection> => {
  const next = {
    revalidate: 60 * 10, // Revalidate every 10 minutes
    tags: ['collections', `collection-handle-${handle}`], // Tags for cache invalidation
  }

  return sdk.client
    .fetch<HttpTypes.StoreCollectionListResponse>(`/store/collections`, {
      query: { handle, fields: "*products" },
      next,
    })
    .then(({ collections }) => collections[0])
}
