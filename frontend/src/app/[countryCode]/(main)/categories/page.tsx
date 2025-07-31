import { Metadata } from "next"
import { getRegion } from "@lib/data/regions"
import { getIndiaRegion } from "@lib/constants/india-region"
import { listCategories } from "@lib/data/categories"
import CategorySection from "@modules/categories/components/category-section"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

export const metadata: Metadata = {
  title: "Categories",
  description: "Explore all categories of our products.",
}

// Cache the rendered page for 5 minutes and serve stale content while revalidating.
export const revalidate = 300

export default async function Categories(props: {
  params: { countryCode: string }
}) {
  const { countryCode } = await props.params
  
  const region = getIndiaRegion()
  const categories = await listCategories().catch(() => null)

  if (!categories) {
    return notFound()
  }

  // Get only parent categories
  const parentCategories = categories.filter((c) => !c.parent_category)

  return (
    <div className="py-6">
      <div className="content-container">
        <div className="flex flex-col gap-y-8 pb-24">
          <h1 className="text-2xl-semi font-display text-luxury-charcoal tracking-wide">Browse Categories</h1>
          <div className="flex flex-col gap-y-12">
            {parentCategories.map((c: HttpTypes.StoreProductCategory) => (
              <CategorySection category={c} key={c.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 