import { getCategoriesByParentId, listCategories } from "@lib/data/categories"
import { cache } from "react"

// Cache the categories data
export const getCachedCategories = cache(async () => {
  const topLevelCategories = await listCategories()

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