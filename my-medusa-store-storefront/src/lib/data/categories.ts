import { cache } from "react"
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"

const getCategories = cache(async (
  options: {
    limit?: number
    offset?: number
    fields?: string
    parent_category_id?: string | null
  } = {}
) => {
  const { 
    limit = 100, 
    offset = 0, 
    fields = "id,name,handle,description,category_children,parent_category",
    parent_category_id = null
  } = options

  const queryParams: any = { limit, offset, fields }

  if (parent_category_id !== null) {
    queryParams.parent_category_id = parent_category_id
  }

  const { product_categories } = await sdk.client.fetch<{
    product_categories: HttpTypes.StoreProductCategory[]
  }>("/store/product-categories", {
    query: queryParams,
    next: {
      tags: ["categories"],
    },
  })

  if (!product_categories) {
    return notFound()
  }

  return product_categories
})

export const listCategories = async (
  options: {
    limit?: number
    offset?: number
    fields?: string
  } = {}
) => {
  return await getCategories({ ...options, parent_category_id: "null" })
}

export const getCategoriesByParentId = async (
  parentId: string,
  options: {
    limit?: number
    offset?: number
    fields?: string
  } = {}
) => {
  return await getCategories({ ...options, parent_category_id: parentId })
}

export const getCategoryByHandle = cache(async (
  handle: string | string[]
): Promise<HttpTypes.StoreProductCategory> => {
  const categoryHandle = Array.isArray(handle) ? handle[handle.length - 1] : handle

  const { product_categories } = await sdk.client.fetch<{
    product_categories: HttpTypes.StoreProductCategory[]
  }>("/store/product-categories", {
    query: {
      handle: categoryHandle,
      fields: "*category_children, *products",
    },
    next: {
      tags: ["categories"],
    },
  })

  const category = product_categories?.[0]

  if (!category) {
    notFound()
  }

  return category
})

export const getCachedCategories = cache(async () => {
  // To avoid fetching all categories at once, let's fetch only top-level ones
  const topLevelCategories = await listCategories()

  // For each top-level category, fetch its children
  const withChildren = await Promise.all(
    topLevelCategories.map(async (c) => {
      if (c.id) {
        c.category_children = await getCategoriesByParentId(c.id)
      }
      return c
    })
  )

  return withChildren
})
