"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

/**
 * Fetches product tags from the Medusa backend
 * @returns Promise<HttpTypes.StoreProductTag[]>
 */
export const listTags = async (query?: Record<string, any>) => {
  const next = {
    ...(await getCacheOptions("tags")),
  }

  const limit = query?.limit || 100

  return sdk.client
    .fetch<{ product_tags: HttpTypes.StoreProductTag[] }>(
      "/store/product-tags",
      {
        query: {
          limit,
          ...query,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_tags }) => product_tags)
}

/**
 * Gets a tag by its value
 * @param value - The value of the tag to fetch
 * @returns The tag with the given value
 */
export const getTagByValue = async (value: string) => {
  const next = {
    ...(await getCacheOptions("tags")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreProductTagListResponse>(
      `/store/product-tags`,
      {
        query: {
          value,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_tags }) => product_tags[0])
} 