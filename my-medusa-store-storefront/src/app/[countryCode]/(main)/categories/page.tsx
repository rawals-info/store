import { Metadata } from "next"
import { getRegion } from "@lib/data/regions"
import { listCategories } from "@lib/data/categories"
import CategorySection from "@modules/categories/components/category-section"
import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse all categories of our exclusive marble handicrafts collection.",
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
      {parentCategories.map((c: HttpTypes.StoreProductCategory) => (
        <CategorySection category={c} key={c.id} />
      ))}
    </div>
  )
} 