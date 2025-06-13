import { Metadata } from "next"
import { getRegion } from "@lib/data/regions"
import { CategoriesTemplate } from "@modules/categories/templates"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@lib/config"

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse all categories of our exclusive marble handicrafts collection.",
}

// Function to fetch all categories without pagination limits
async function getAllCategories() {
  try {
    const response = await sdk.client.fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          limit: 1000, // Using a high limit to get all categories
          fields: "id,name,handle,description,category_children,parent_category",
        },
        next: {
          revalidate: 3600, // Cache for 1 hour
          tags: ["categories"]
        }
      }
    )
    
    console.log("Fetching all categories from API with params:", {
      limit: 1000,
      offset: 0,
      fields: 'id,name,handle,description,category_children,parent_category'
    });
    
    console.log("API returned categories:", response.product_categories?.length || 0);
    return response.product_categories || []
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return []
  }
}

export default async function CategoriesPage({
  params,
}: {
  params: { countryCode: string }
}) {
  // Properly await params before using them
  const paramsData = await params
  const countryCode = paramsData.countryCode
  
  const region = await getRegion(countryCode)
  
  console.log("Fetching categories for region:", region?.id || "unknown region")
  const categories = await getAllCategories()
  
  console.log("Categories page received:", categories?.length || 0, "categories")
  console.log("Parent categories:", categories?.filter(c => !c?.parent_category)?.length || 0)
  console.log("Parent category names:", categories?.filter(c => !c?.parent_category)?.map(c => c.name))
  
  if (!categories || categories.length === 0) {
    console.log("No categories found")
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center">
          <h2 className="text-2xl font-serif mb-4">Categories Coming Soon</h2>
          <p className="text-luxury-charcoal/70">
            Our category selection is being updated. Please check back later.
          </p>
        </div>
      </div>
    )
  }

  return <CategoriesTemplate categories={categories} region={region} />
} 