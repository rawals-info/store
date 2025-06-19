import { Metadata } from "next"
import { getRegion } from "@lib/data/regions"
import { CategoriesTemplate } from "@modules/categories/templates"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@lib/config"
import { notFound } from "next/navigation"
import { listCategories } from "@lib/data/categories"
import CategorySection from "@modules/categories/components/category-section"
import { ProductCategory } from "@medusajs/medusa"

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

export default async function Categories({
  params,
}: {
  params: { countryCode: string }
}) {
  const region = await getRegion(params.countryCode).catch(() => null)
  const categories = await listCategories().catch(() => null)

  if (!categories) {
    return notFound()
  }

  // Get only parent categories
  const parentCategories = categories.filter((c) => !c.parent_category)

  return (
    <div className="flex flex-col gap-y-12 py-12">
      {parentCategories.map((c: ProductCategory) => (
        <CategorySection category={c} key={c.id} />
      ))}
    </div>
  )
} 