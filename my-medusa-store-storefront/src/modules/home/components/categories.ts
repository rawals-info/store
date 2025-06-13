import { listCategories } from "@lib/data/categories"
import { cache } from "react"

// Cache the categories data
export const getCachedCategories = cache(async () => {
  try {
    // Get all categories, with a high limit to ensure we get all parent categories
    const categories = await listCategories({
      limit: 1000,
      fields: "id,name,handle,description,category_children,parent_category"
    })
    
    // Log category data for debugging
    console.log("Categories fetched:", Array.isArray(categories) ? categories.length : "not an array")
    
    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}) 